import { ProductCard } from "./ProductCard";
import { useProducts } from "@/hooks/useProducts";
import heroFallback from "@/assets/hero.png";

export function ProductSection() {
  const { data: products, isLoading, error } = useProducts();

  if (isLoading) {
    return (
      <section className="container mx-auto px-6 py-16">
        <p>در حال بارگذاری محصولات...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="container mx-auto px-6 py-16">
        <p>خطا در دریافت محصولات</p>
      </section>
    );
  }

  return (
    <section className="container mx-auto px-6 py-16">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-primary">محصولات</h2>

        <p className="mt-3 text-muted-foreground">
          جدیدترین محصولات زرینه بافت
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {products?.products.map((product) => {
          const minPrice =
            product.variants.length > 0
              ? Math.min(...product.variants.map((v) => v.price))
              : null;
          const price =
            minPrice !== null
              ? product.variants.length > 1
                ? `از ${minPrice.toLocaleString()} تومان`
                : `${minPrice.toLocaleString()} تومان`
              : "تماس بگیرید";

          return (
            <ProductCard
              key={product.id}
              id={product.id}
              code={product.product_code}
              persianName={product.name_fa}
              englishName={product.name_en}
              price={price}
              image={product.images[0]?.image_url ?? heroFallback}
            />
          );
        })}
      </div>
    </section>
  );
}
