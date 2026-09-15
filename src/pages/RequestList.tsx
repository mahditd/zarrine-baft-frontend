import { Button } from "@/components/ui/button";
import { useRequestStore } from "@/store/requestStore";
import { Link } from "react-router-dom";

export default function RequestList() {
  const items = useRequestStore((state) => state.items);

  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
  const removeItem = useRequestStore((state) => state.removeItem);
  const clear = useRequestStore((state) => state.clear);
  const increaseQuantity = useRequestStore((state) => state.increaseQuantity);

  const decreaseQuantity = useRequestStore((state) => state.decreaseQuantity);

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-6 py-10">
        لیست درخواست شما خالی است
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-10 space-y-6">
      <div className="flex items-center justify-between rounded-xl border p-5">
        <div>
          <h1 className="text-3xl font-bold">لیست درخواست</h1>

          <p className="mt-2 text-muted-foreground">
            {items.length} مورد | مجموع تعداد: {totalQuantity}
          </p>
        </div>

        <Button variant="destructive" onClick={clear}>
          پاک کردن همه
        </Button>
      </div>

      {items.map((item) => (
        <div key={item.variantId} className="flex gap-5 rounded-xl border p-5">
          {/* Image */}
          <Link to={`/products/${item.productId}`}>
            <div className="h-32 w-32 shrink-0 overflow-hidden rounded-lg bg-muted">
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
          <div className="flex-1 space-y-2">
            <p className="text-sm text-muted-foreground">
              کد محصول: {item.productCode}
            </p>
            <h2 className="text-xl font-semibold">{item.productNameFA}</h2>

            <p className="text-muted-foreground">{item.productNameEN}</p>

            <p>رنگ: {item.colorName}</p>

            <p>سایز: {item.sizeName}</p>

            {/* Quantity */}
            <div className="flex flex-wrap items-center gap-2 pt-3">
              <span className="font-semibold">تعداد:</span>

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

              <span className="min-w-10 text-center font-bold">
                {item.quantity}
              </span>

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

            <Button
              variant="destructive"
              className="mt-3"
              onClick={() => removeItem(item.variantId)}
            >
              حذف
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
