import { Button } from "@/components/ui/button";

export default function ProductDetails() {
  return (
    <div className="container mx-auto px-6 py-10">
      <div className="grid gap-10 lg:grid-cols-2">
        {/* Image area */}
        <div className="rounded-xl border bg-card p-4">
          <div className="flex h-96 items-center justify-center rounded-lg bg-muted">
            تصویر محصول
          </div>
        </div>

        {/* Information area */}
        <div>
          <div className="text-sm text-muted-foreground">کد محصول: 001</div>

          <h1 className="mt-3 text-4xl font-bold text-primary">کت زمستانی</h1>

          <p className="mt-2 text-muted-foreground">Winter Coat</p>

          <div className="mt-8 space-y-4">
            <div>
              <span className="font-semibold">جنس:</span>
              پارچه فوتر
            </div>

            <div>
              <span className="font-semibold">رنگ‌ها:</span>
              مشکی، کرم
            </div>

            <div>
              <span className="font-semibold">سایزها:</span>
              M، L، XL
            </div>

            <Button size="lg">افزودن به لیست درخواست</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
