import { useEffect, useState, type FormEvent } from "react";
import { Link, useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ProductVariant } from "@/types/product";
import { useCatalogOptions } from "@/hooks/useCatalogOptions";
import {
  createVariant,
  deleteVariant,
  getProductVariants,
  updateVariant,
} from "@/api/admin";

export default function AdminProductVariants() {
  const { id } = useParams();
  const productId = Number(id);
  const { colors, sizes } = useCatalogOptions();

  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [colorId, setColorId] = useState("");
  const [sizeId, setSizeId] = useState("");
  const [price, setPrice] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  async function load() {
    try {
      setError("");
      setVariants(await getProductVariants(productId));
    } catch {
      setError("دریافت وریانت‌ها با خطا مواجه شد");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let mounted = true;

    async function fetchVariants() {
      try {
        const list = await getProductVariants(productId);
        if (mounted) setVariants(list);
      } catch {
        if (mounted) setError("دریافت وریانت‌ها با خطا مواجه شد");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchVariants();

    return () => {
      mounted = false;
    };
  }, [productId]);

  function resetForm() {
    setColorId("");
    setSizeId("");
    setPrice("");
    setEditingId(null);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    const priceValue = Number(price);
    if (!colorId || !sizeId || !Number.isFinite(priceValue) || priceValue <= 0) {
      setError("رنگ، سایز و قیمت معتبر الزامی است");
      return;
    }

    try {
      setSaving(true);
      const payload = {
        color_id: Number(colorId),
        size_id: Number(sizeId),
        price: Math.floor(priceValue),
      };

      if (editingId) {
        await updateVariant(editingId, payload);
      } else {
        await createVariant(productId, payload);
      }

      resetForm();
      await load();
    } catch {
      setError("ذخیره انجام نشد (وریانت تکراری؟)");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(variantId: number) {
    try {
      await deleteVariant(variantId);
      await load();
    } catch {
      setError("حذف انجام نشد");
    }
  }

  return (
    <div className="max-w-3xl space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">وریانت‌های محصول {productId}</h2>

        <Link
          to={`/admin/products/${productId}/edit`}
          className="text-sm text-primary hover:underline"
        >
          بازگشت به محصول
        </Link>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid gap-2 rounded-xl border p-4 md:grid-cols-4"
      >
        <select
          value={colorId}
          onChange={(e) => setColorId(e.target.value)}
          className="rounded-md border bg-card px-3 py-2 text-sm"
        >
          <option value="">رنگ…</option>

          {colors.data?.map((color) => (
            <option key={color.id} value={color.id}>
              {color.name_fa}
            </option>
          ))}
        </select>

        <select
          value={sizeId}
          onChange={(e) => setSizeId(e.target.value)}
          className="rounded-md border bg-card px-3 py-2 text-sm"
        >
          <option value="">سایز…</option>

          {sizes.data?.map((size) => (
            <option key={size.id} value={size.id}>
              {size.name}
            </option>
          ))}
        </select>

        <input
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="قیمت (تومان)"
          inputMode="numeric"
          className="rounded-md border px-3 py-2 text-sm"
        />

        <div className="flex gap-2">
          <Button type="submit" disabled={saving} className="flex-1">
            {saving
              ? "…"
              : editingId
                ? "ذخیره ویرایش"
                : "+ افزودن"}
          </Button>

          {editingId && (
            <Button type="button" variant="outline" onClick={resetForm}>
              انصراف
            </Button>
          )}
        </div>
      </form>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {loading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="space-y-2">
          {variants.length === 0 && (
            <p className="text-sm text-muted-foreground">وریانتی ثبت نشده</p>
          )}

          {variants.map((variant) => (
            <div
              key={variant.id}
              className="flex flex-wrap items-center justify-between gap-2 rounded-xl border p-3"
            >
              <div className="flex items-center gap-2 text-sm">
                <span
                  className="block h-5 w-5 rounded-full border border-gray-400"
                  style={{ backgroundColor: variant.color.hex_code }}
                />

                <span>
                  {variant.color.name_fa} | {variant.size?.name ?? "—"} |{" "}
                  {variant.price.toLocaleString()} تومان
                </span>
              </div>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setEditingId(variant.id);
                    setColorId(String(variant.color.id));
                    setSizeId(variant.size ? String(variant.size.id) : "");
                    setPrice(String(variant.price));
                  }}
                >
                  ویرایش
                </Button>

                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(variant.id)}
                >
                  حذف
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
