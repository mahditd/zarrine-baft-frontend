import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCatalogOptions } from "@/hooks/useCatalogOptions";
import {
  createProduct,
  getAdminProduct,
  updateProduct,
} from "@/api/admin";

export default function AdminProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const productId = Number(id);

  const { categories, materials } = useCatalogOptions();

  const [form, setForm] = useState({
    product_code: "",
    name_fa: "",
    name_en: "",
    category_id: "",
    material_id: "",
  });
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isEdit) return;
    let mounted = true;

    async function load() {
      try {
        const product = await getAdminProduct(productId);
        if (mounted) {
          setForm({
            product_code: product.product_code,
            name_fa: product.name_fa,
            name_en: product.name_en,
            category_id: String(product.category.id),
            material_id: String(product.material.id),
          });
        }
      } catch {
        if (mounted) setError("دریافت محصول با خطا مواجه شد");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();

    return () => {
      mounted = false;
    };
  }, [isEdit, productId]);

  function updateField(key: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (!form.name_fa.trim() || !form.name_en.trim()) {
      setError("نام فارسی و انگلیسی الزامی است");
      return;
    }
    if (!form.category_id || !form.material_id) {
      setError("دسته‌بندی و جنس الزامی است");
      return;
    }
    if (!isEdit && !/^\d{3}$/.test(form.product_code)) {
      setError("کد محصول باید دقیقاً ۳ رقم باشد (۰۰۱ تا ۹۹۹)");
      return;
    }

    try {
      setSaving(true);

      if (isEdit) {
        await updateProduct(productId, {
          name_fa: form.name_fa.trim(),
          name_en: form.name_en.trim(),
          category_id: Number(form.category_id),
          material_id: Number(form.material_id),
        });
      } else {
        const result = await createProduct({
          product_code: form.product_code,
          name_fa: form.name_fa.trim(),
          name_en: form.name_en.trim(),
          category_id: Number(form.category_id),
          material_id: Number(form.material_id),
        });
        navigate(`/admin/products/${result.product.id}/edit`);
        return;
      }
    } catch {
      setError("ذخیره انجام نشد (کد تکراری؟)");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="max-w-xl space-y-4">
      <h2 className="text-xl font-semibold">
        {isEdit ? "ویرایش محصول" : "محصول جدید"}
      </h2>

      {isEdit && (
        <div className="flex gap-2">
          <Link
            to={`/admin/products/${productId}/images`}
            className="rounded-lg border px-3 py-1.5 text-sm hover:bg-muted"
          >
            مدیریت تصاویر
          </Link>

          <Link
            to={`/admin/products/${productId}/variants`}
            className="rounded-lg border px-3 py-1.5 text-sm hover:bg-muted"
          >
            مدیریت وریانت‌ها
          </Link>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border p-5">
        {!isEdit && (
          <input
            value={form.product_code}
            onChange={(e) => updateField("product_code", e.target.value)}
            placeholder="کد محصول (۰۰۱ تا ۹۹۹، غیرقابل ویرایش بعداً)"
            maxLength={3}
            className="w-full rounded-md border px-3 py-2"
          />
        )}

        <input
          value={form.name_fa}
          onChange={(e) => updateField("name_fa", e.target.value)}
          placeholder="نام فارسی"
          className="w-full rounded-md border px-3 py-2"
        />

        <input
          value={form.name_en}
          onChange={(e) => updateField("name_en", e.target.value)}
          placeholder="نام انگلیسی"
          className="w-full rounded-md border px-3 py-2"
        />

        <select
          value={form.category_id}
          onChange={(e) => updateField("category_id", e.target.value)}
          className="w-full rounded-md border bg-card px-3 py-2"
        >
          <option value="">دسته‌بندی…</option>

          {categories.data?.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name_fa}
            </option>
          ))}
        </select>

        <select
          value={form.material_id}
          onChange={(e) => updateField("material_id", e.target.value)}
          className="w-full rounded-md border bg-card px-3 py-2"
        >
          <option value="">جنس…</option>

          {materials.data?.map((material) => (
            <option key={material.id} value={material.id}>
              {material.name_fa}
            </option>
          ))}
        </select>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <Button type="submit" disabled={saving} className="w-full">
          {saving ? "در حال ذخیره…" : isEdit ? "ذخیره تغییرات" : "ایجاد محصول"}
        </Button>
      </form>
    </div>
  );
}
