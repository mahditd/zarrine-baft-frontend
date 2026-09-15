import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="container mx-auto px-6 py-20">
      <div className="max-w-3xl">
        <h1 className="text-5xl font-bold leading-tight text-primary">
          تولید و تامین عمده پوشاک
        </h1>

        <p className="mt-6 text-lg text-muted-foreground">
          زرینه بافت، تولیدکننده پوشاک با سیستم درخواست عمده برای فروشگاه‌ها و
          کسب‌وکارها.
        </p>

        <Button
         className="mt-8 px-8 py-6 text-base">مشاهده محصولات
         </Button>
      </div>
    </section>
  );
}
