import { Button } from "@/components/ui/button";
import { useParams } from "react-router-dom";
import { useProduct } from "@/hooks/useProduct";

export default function ProductDetails() {
  const { id } = useParams();

  const productId = Number(id);

  const { data: product, isLoading, error } = useProduct(productId);

  if (isLoading) {
    return (
      <div className="container mx-auto px-6 py-10">در حال بارگذاری...</div>
    );
  }

  if (error || !product) {
    return <div className="container mx-auto px-6 py-10">محصول پیدا نشد</div>;
  }
  return (
    <div className="container mx-auto px-6 py-10">
      <div className="grid gap-10 lg:grid-cols-2">
        {/* Image area */}
        {product.images.length > 0 ? (
          <div className="rounded-xl border bg-card p-4">
            <img
              src={product.images[0].image_url}
              alt={product.name_fa}
              className="h-96 w-full rounded-lg object-cover"
            />
          </div>
        ) : (
          <div className="rounded-xl border bg-card p-4">
            <div className="flex h-96 items-center justify-center rounded-lg bg-muted">
              تصویر محصول
            </div>
          </div>
        )}
        {/* Information area */}
        <div>
          <div className="text-sm text-muted-foreground">
            کد محصول: {product.product_code}
          </div>

          <h1 className="mt-3 text-4xl font-bold text-primary">
            {product.name_fa}
          </h1>

          <p className="mt-2 text-muted-foreground">{product.name_en}</p>

          <div className="mt-8 space-y-4">
            <div>
              <span className="font-semibold">جنس:</span>{" "}
              {product.material.name_fa}
            </div>

            <div>
              <span className="font-semibold">رنگ‌ها:</span>{" "}
              {product.variants
                .map((variant) => variant.color.name_fa)
                .join("، ")}
            </div>

            <div>
              <span className="font-semibold">سایزها:</span>{" "}
              {product.variants
                .map((variant) => variant.size?.name)
                .filter(Boolean)
                .join("، ")}
            </div>

            <Button size="lg">افزودن به لیست درخواست</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
