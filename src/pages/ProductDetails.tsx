import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useParams } from "react-router-dom";
import { useProduct } from "@/hooks/useProduct";
import { useRequestStore } from "@/store/requestStore";

type ProductVariant = {
  id: number;
  product_id: number;
  color: {
    id: number;
    name_fa: string;
    name_en: string;
    hex_code: string;
  };
  size?: {
    id: number;
    name: string;
  };
  price: number;
};

export default function ProductDetails() {
  const { id } = useParams();

  const productId = Number(id);

  const { data: product, isLoading, error } = useProduct(productId);

  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    null,
  );

  const [quantity, setQuantity] = useState(1);

  const [selectionError, setSelectionError] = useState("");

  const addItem = useRequestStore((state) => state.addItem);

  if (isLoading) {
    return (
      <div className="container mx-auto px-6 py-10">در حال بارگذاری...</div>
    );
  }

  if (error || !product) {
    return <div className="container mx-auto px-6 py-10">محصول پیدا نشد</div>;
  }
  const sizes = [
    ...new Set(
      product.variants.map((variant) => variant.size?.name).filter(Boolean),
    ),
  ];

  const availableColors = product.variants.filter(
    (variant) => variant.size?.name === selectedSize,
  );
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
              <span className="font-semibold">سایز:</span>

              <div className="mt-3 flex flex-wrap gap-3">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => {
                      setSelectedSize(size);
                      setSelectedColor(null);
                      setSelectedVariant(null);
                    }}
                    className={`rounded-lg border px-4 py-2 transition ${
                      selectedSize === size
                        ? "border-primary bg-primary text-primary-foreground"
                        : "bg-card hover:bg-muted"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <span className="font-semibold">رنگ:</span>

              <div className="mt-3 flex flex-wrap gap-3">
                {selectedSize ? (
                  availableColors.map((variant) => (
                    <button
                      key={variant.id}
                      onClick={() => {
                        setSelectedColor(variant.color.name_fa);
                        setSelectedVariant(variant);
                      }}
                      className={`rounded-lg border px-4 py-2 transition ${
                        selectedColor === variant.color.name_fa
                          ? "border-primary bg-primary text-primary-foreground"
                          : "bg-card hover:bg-muted"
                      }`}
                    >
                      {variant.color.name_fa}
                    </button>
                  ))
                ) : (
                  <span className="text-sm text-muted-foreground">
                    ابتدا سایز را انتخاب کنید
                  </span>
                )}
              </div>
            </div>

            <div>
              <span className="font-semibold">تعداد:</span>

              <div className="mt-3 flex items-center gap-2">
                <button
                  className="rounded border px-3 py-1"
                  onClick={() => setQuantity((q) => Math.max(1, q - 100))}
                >
                  -100
                </button>

                <button
                  className="rounded border px-3 py-1"
                  onClick={() => setQuantity((q) => Math.max(1, q - 10))}
                >
                  -10
                </button>

                <button
                  className="rounded border px-3 py-1"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                >
                  -1
                </button>

                <span className="min-w-12 text-center text-lg font-semibold">
                  {quantity}
                </span>

                <button
                  className="rounded border px-3 py-1"
                  onClick={() => setQuantity((q) => Math.min(999, q + 1))}
                >
                  +1
                </button>

                <button
                  className="rounded border px-3 py-1"
                  onClick={() => setQuantity((q) => Math.min(999, q + 10))}
                >
                  +10
                </button>

                <button
                  className="rounded border px-3 py-1"
                  onClick={() => setQuantity((q) => Math.min(999, q + 100))}
                >
                  +100
                </button>
              </div>
            </div>

            {selectedVariant && (
              <div>
                <span className="font-semibold">قیمت:</span>{" "}
                {selectedVariant.price.toLocaleString()} تومان
              </div>
            )}

            {selectionError && (
              <p className="text-sm text-destructive">{selectionError}</p>
            )}

            <Button
              size="lg"
              disabled={!selectedVariant}
              onClick={() => {
                if (!selectedVariant) {
                  setSelectionError("لطفاً سایز و رنگ محصول را انتخاب کنید");
                  return;
                }

                setSelectionError("");

                addItem({
                  productId: product.id,
                  variantId: selectedVariant.id,

                  productCode: product.product_code,

                  productNameFA: product.name_fa,
                  productNameEN: product.name_en,

                  sizeName: selectedVariant.size?.name,
                  colorName: selectedVariant.color.name_fa,

                  quantity,
                  imageUrl: product.images[0]?.image_url,
                });
              }}
            >
              افزودن به لیست درخواست
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
