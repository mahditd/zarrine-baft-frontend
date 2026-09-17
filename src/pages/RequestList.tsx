import { Button } from "@/components/ui/button";
import { QuantityInput } from "@/components/common/QuantityInput";
import { useRequestStore } from "@/store/requestStore";
import { Link } from "react-router-dom";

export default function RequestList() {
  const items = useRequestStore((state) => state.items);

  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);

  const totalPrice = items.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0,
  );

  const removeItem = useRequestStore((state) => state.removeItem);
  const clear = useRequestStore((state) => state.clear);
  const increaseQuantity = useRequestStore((state) => state.increaseQuantity);
  const decreaseQuantity = useRequestStore((state) => state.decreaseQuantity);

  if (items.length === 0) {
    return (
      <div className="container mx-auto flex flex-col items-center px-6 py-20 text-center">
        <h1 className="text-3xl font-bold">لیست درخواست شما خالی است</h1>

        <p className="mt-3 text-muted-foreground">
          برای ثبت درخواست، ابتدا محصولات مورد نظر خود را انتخاب کنید.
        </p>

        <Link
          to="/"
          className="mt-6 inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          مشاهده محصولات
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto space-y-6 px-6 py-10">
      <div className="flex items-center justify-between rounded-xl border p-5">
        <div>
          <h1 className="text-3xl font-bold">لیست درخواست</h1>

          <p className="mt-2 text-muted-foreground">
            {items.length} مورد | مجموع تعداد: {totalQuantity}
          </p>

          <p className="mt-1 text-lg font-semibold text-primary">
            مبلغ کل درخواست: {totalPrice.toLocaleString()} تومان
          </p>
        </div>

        <div className="flex items-center gap-3">

          <Link
            to="/request/confirm"
            className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            ادامه و تایید درخواست
          </Link>

          <Button variant="destructive" onClick={clear}>
            پاک کردن همه
          </Button>
        </div>
      </div>

      {items.map((item) => (
        <div
          key={item.variantId}
          className="relative flex gap-5 rounded-xl border p-5 transition-shadow hover:shadow-sm"
        >
          {/* Image */}
          <Link
            to={`/products/${item.productId}`}
            className="h-32 w-32 shrink-0 transition-opacity hover:opacity-80"
          >
            <div className="h-32 w-32 overflow-hidden rounded-lg bg-muted">
              {item.imageUrl ? (
                <img
                  src={item.imageUrl}
                  alt={item.productNameFA}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-sm">
                  تصویر
                </div>
              )}
            </div>
          </Link>

          {/* Information */}
          <div className="flex-1 space-y-2 pl-20">
            <div>
              <p className="text-sm text-muted-foreground">
                کد محصول: {item.productCode}
              </p>

              <h2 className="mt-1 text-xl font-semibold">
                {item.productNameFA}
              </h2>
            </div>

            <p className="text-muted-foreground">{item.productNameEN}</p>

            <p>رنگ: {item.colorName}</p>

            <p>سایز: {item.sizeName}</p>

            <div className="rounded-lg bg-muted p-3">
              <p className="text-sm text-muted-foreground">
                قیمت واحد: {item.unitPrice.toLocaleString()} تومان
              </p>

              <p className="mt-1 font-semibold text-primary">
                قیمت کل: {(item.unitPrice * item.quantity).toLocaleString()}{" "}
                تومان
              </p>
            </div>

            {/* Quantity */}
            <div className="mt-4 flex flex-wrap items-center gap-2 border-t pt-4">
              <p className="font-semibold">تعداد سفارش</p>

              <Button
                size="sm"
                variant="outline"
                onClick={() => decreaseQuantity(item.variantId, 100)}
              >
                -100
              </Button>

              <Button
                size="sm"
                variant="outline"
                onClick={() => decreaseQuantity(item.variantId, 10)}
              >
                -10
              </Button>

              <Button
                size="sm"
                variant="outline"
                onClick={() => decreaseQuantity(item.variantId, 1)}
              >
                -1
              </Button>

              <QuantityInput
                value={item.quantity}
                onCommit={(next) =>
                  increaseQuantity(item.variantId, next - item.quantity)
                }
              />

              <Button
                size="sm"
                variant="outline"
                onClick={() => increaseQuantity(item.variantId, 1)}
              >
                +1
              </Button>

              <Button
                size="sm"
                variant="outline"
                onClick={() => increaseQuantity(item.variantId, 10)}
              >
                +10
              </Button>

              <Button
                size="sm"
                variant="outline"
                onClick={() => increaseQuantity(item.variantId, 100)}
              >
                +100
              </Button>
            </div>
          </div>

          {/* Remove */}
          <Button
            variant="ghost"
            size="sm"
            className="absolute left-5 top-5 text-destructive hover:bg-destructive/10 hover:text-destructive"
            onClick={() => removeItem(item.variantId)}
          >
            حذف
          </Button>
        </div>
      ))}
    </div>
  );
}
