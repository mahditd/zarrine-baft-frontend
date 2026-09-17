import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ProductImage } from "@/types/product";
import {
  deleteProductImage,
  getProductImages,
  reorderProductImages,
  replaceProductImage,
  uploadProductImage,
} from "@/api/admin";

export default function AdminProductImages() {
  const { id } = useParams();
  const productId = Number(id);

  const [images, setImages] = useState<ProductImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    try {
      setError("");
      const list = await getProductImages(productId);
      setImages(list);
    } catch {
      setError("دریافت تصاویر با خطا مواجه شد");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let mounted = true;

    async function fetchImages() {
      try {
        const list = await getProductImages(productId);
        if (mounted) setImages(list);
      } catch {
        if (mounted) setError("دریافت تصاویر با خطا مواجه شد");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchImages();

    return () => {
      mounted = false;
    };
  }, [productId]);

  async function run(fn: () => Promise<unknown>) {
    try {
      setBusy(true);
      setError("");
      await fn();
      await load();
    } catch {
      setError("عملیات با خطا مواجه شد (حداکثر ۱۵ تصویر، حذف آخرین تصویر ممکن نیست)");
    } finally {
      setBusy(false);
    }
  }

  function move(index: number, direction: -1 | 1) {
    const next = [...images];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    setImages(next);
    run(() => reorderProductImages(productId, next.map((img) => img.id)));
  }

  return (
    <div className="max-w-3xl space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">تصاویر محصول {productId}</h2>

        <Link
          to={`/admin/products/${productId}/edit`}
          className="text-sm text-primary hover:underline"
        >
          بازگشت به محصول
        </Link>
      </div>

      <p className="text-sm text-muted-foreground">
        اولین تصویر کاور است. حداکثر ۱۵ تصویر (JPG/PNG/WEBP تا ۱۰ مگابایت).
      </p>

      <label className="block rounded-xl border border-dashed p-5 text-center text-sm hover:bg-muted">
        {busy ? "در حال آپلود…" : "+ افزودن تصویر"}
        <input
          type="file"
          accept=".jpg,.jpeg,.png,.webp"
          className="hidden"
          disabled={busy}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) run(() => uploadProductImage(productId, file));
            e.target.value = "";
          }}
        />
      </label>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {loading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {images.map((image, index) => (
            <div key={image.id} className="space-y-2 rounded-xl border p-3">
              <div className="relative">
                <img
                  src={image.image_url}
                  alt={`تصویر ${index + 1}`}
                  className="h-48 w-full rounded-lg object-cover"
                />

                {image.is_cover && (
                  <span className="absolute right-2 top-2 rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                    کاور
                  </span>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  disabled={busy || index === 0}
                  onClick={() => move(index, -1)}
                  className="rounded-lg border px-2 py-1 text-xs hover:bg-muted disabled:opacity-50"
                >
                  ↑
                </button>

                <button
                  disabled={busy || index === images.length - 1}
                  onClick={() => move(index, 1)}
                  className="rounded-lg border px-2 py-1 text-xs hover:bg-muted disabled:opacity-50"
                >
                  ↓
                </button>

                <label className="cursor-pointer rounded-lg border px-2 py-1 text-xs hover:bg-muted">
                  جایگزینی
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.webp"
                    className="hidden"
                    disabled={busy}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file)
                        run(() =>
                          replaceProductImage(productId, image.id, file),
                        );
                      e.target.value = "";
                    }}
                  />
                </label>

                <Button
                  size="sm"
                  variant="destructive"
                  disabled={busy}
                  onClick={() => run(() => deleteProductImage(image.id))}
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
