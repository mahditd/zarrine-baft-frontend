import { useState, type FormEvent } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useCatalogOptions } from "@/hooks/useCatalogOptions";
import {
  createCategory,
  createColor,
  createMaterial,
} from "@/api/admin";

function CreateForm({
  fields,
  submitLabel,
  onSubmit,
}: {
  fields: { key: string; placeholder: string; defaultValue?: string }[];
  submitLabel: string;
  onSubmit: (values: Record<string, string>) => Promise<void>;
}) {
  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(fields.map((f) => [f.key, f.defaultValue ?? ""])),
  );
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    try {
      setSaving(true);
      await onSubmit(values);
      setValues(
        Object.fromEntries(fields.map((f) => [f.key, f.defaultValue ?? ""])),
      );
    } catch {
      setError("ثبت انجام نشد (نام تکراری؟)");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2 rounded-lg bg-muted p-3">
      {fields.map((field) => (
        <input
          key={field.key}
          value={values[field.key] ?? ""}
          onChange={(e) =>
            setValues((prev) => ({ ...prev, [field.key]: e.target.value }))
          }
          placeholder={field.placeholder}
          className="w-full rounded-md border bg-card px-3 py-2 text-sm"
        />
      ))}

      {error && <p className="text-sm text-destructive">{error}</p>}

      <button
        type="submit"
        disabled={saving}
        className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50"
      >
        {saving ? "در حال ثبت…" : submitLabel}
      </button>
    </form>
  );
}

export default function AdminTaxonomy() {
  const queryClient = useQueryClient();
  const { categories, materials, colors } = useCatalogOptions();

  function refresh() {
    queryClient.invalidateQueries({ queryKey: ["categories"] });
    queryClient.invalidateQueries({ queryKey: ["materials"] });
    queryClient.invalidateQueries({ queryKey: ["colors"] });
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="space-y-3 rounded-xl border p-5">
        <h2 className="text-lg font-semibold">دسته‌بندی‌ها</h2>

        <CreateForm
          fields={[
            { key: "name_fa", placeholder: "نام فارسی" },
            { key: "name_en", placeholder: "نام انگلیسی" },
          ]}
          submitLabel="افزودن دسته‌بندی"
          onSubmit={async (values) => {
            await createCategory({
              name_fa: values.name_fa.trim(),
              name_en: values.name_en.trim(),
            });
            refresh();
          }}
        />

        {categories.isLoading ? (
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        ) : (
          categories.data?.map((item) => (
            <div key={item.id} className="rounded-lg border p-2 text-sm">
              {item.name_fa} <span className="text-muted-foreground">({item.name_en})</span>
            </div>
          ))
        )}
      </div>

      <div className="space-y-3 rounded-xl border p-5">
        <h2 className="text-lg font-semibold">جنس‌ها</h2>

        <CreateForm
          fields={[
            { key: "name_fa", placeholder: "نام فارسی" },
            { key: "name_en", placeholder: "نام انگلیسی" },
          ]}
          submitLabel="افزودن جنس"
          onSubmit={async (values) => {
            await createMaterial({
              name_fa: values.name_fa.trim(),
              name_en: values.name_en.trim(),
            });
            refresh();
          }}
        />

        {materials.isLoading ? (
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        ) : (
          materials.data?.map((item) => (
            <div key={item.id} className="rounded-lg border p-2 text-sm">
              {item.name_fa} <span className="text-muted-foreground">({item.name_en})</span>
            </div>
          ))
        )}
      </div>

      <div className="space-y-3 rounded-xl border p-5">
        <h2 className="text-lg font-semibold">رنگ‌ها</h2>

        <CreateForm
          fields={[
            { key: "name_fa", placeholder: "نام فارسی" },
            { key: "name_en", placeholder: "نام انگلیسی" },
            { key: "hex_code", placeholder: "کد رنگ، مثل #1a2b3c" },
          ]}
          submitLabel="افزودن رنگ"
          onSubmit={async (values) => {
            await createColor({
              name_fa: values.name_fa.trim(),
              name_en: values.name_en.trim(),
              hex_code: values.hex_code.trim(),
            });
            refresh();
          }}
        />

        {colors.isLoading ? (
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        ) : (
          colors.data?.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-2 rounded-lg border p-2 text-sm"
            >
              <span
                className="block h-5 w-5 rounded-full border border-gray-400"
                style={{ backgroundColor: item.hex_code }}
              />
              {item.name_fa}{" "}
              <span className="text-muted-foreground">({item.name_en})</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
