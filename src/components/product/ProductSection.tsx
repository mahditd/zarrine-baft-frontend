import { ProductCard } from "./ProductCard";

export function ProductSection() {
  return (
    <section className="container mx-auto px-6 py-16">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-primary">محصولات</h2>

        <p className="mt-3 text-muted-foreground">
          جدیدترین محصولات زرینه بافت
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <ProductCard
          code="001"
          persianName="کت زمستانی"
          englishName="Winter Coat"
          price="850,000 تومان"
          image="/hero.png"
        />
      </div>
    </section>
  );
}
