import { Button } from "@/components/ui/button";
import { useRequestStore } from "@/store/requestStore";
import { useAuthStore } from "@/store/authStore";
import { createRequest } from "@/api/requestApi";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function RequestConfirm() {
  const navigate = useNavigate();

  const items = useRequestStore((state) => state.items);
  const clear = useRequestStore((state) => state.clear);
  const user = useAuthStore((state) => state.user);

  const [companyName, setCompanyName] = useState(user?.company_name ?? "");
  const [companyPhone, setCompanyPhone] = useState(user?.company_phone ?? "");

  const [description, setDescription] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const totalPrice = items.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0,
  );

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-6 py-10 text-center">
        <h1 className="text-3xl font-bold">لیست درخواست خالی است</h1>
      </div>
    );
  }

  async function submitRequest() {
    if (!companyName.trim() || !companyPhone.trim()) {
      setError("نام شرکت و شماره تماس شرکت الزامی است");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await createRequest({
        company_name: companyName,
        company_phone: companyPhone,
        description,

        items: items.map((item) => ({
          product_variant_id: item.variantId,
          quantity: item.quantity,
        })),
      });

      clear();

      navigate("/request/success");
    } catch {
      setError("ثبت درخواست با خطا مواجه شد");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container mx-auto space-y-6 px-6 py-10">
      <h1 className="text-3xl font-bold">تایید درخواست</h1>

      <div className="space-y-4 rounded-xl border p-5">
        <h2 className="text-xl font-semibold">محصولات</h2>

        {items.map((item) => (
          <div key={item.variantId} className="rounded-lg border p-4">
            <p className="font-semibold">{item.productNameFA}</p>

            <p>رنگ: {item.colorName}</p>

            <p>سایز: {item.sizeName}</p>

            <p>تعداد: {item.quantity}</p>

            <p>قیمت واحد: {item.unitPrice.toLocaleString()} تومان</p>

            <p className="font-semibold text-primary">
              قیمت کل: {(item.unitPrice * item.quantity).toLocaleString()} تومان
            </p>
          </div>
        ))}

        <div className="border-t pt-4 text-lg font-bold">
          مجموع: {totalPrice.toLocaleString()} تومان
        </div>
      </div>

      <div className="space-y-4 rounded-xl border p-5">
        <h2 className="text-xl font-semibold">اطلاعات شرکت</h2>

        <input
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          placeholder="نام شرکت"
          className="w-full rounded-md border px-3 py-2"
        />

        <input
          value={companyPhone}
          onChange={(e) => setCompanyPhone(e.target.value)}
          placeholder="شماره تماس شرکت"
          className="w-full rounded-md border px-3 py-2"
        />

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="توضیحات (اختیاری)"
          className="min-h-24 w-full rounded-md border px-3 py-2"
        />
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Button size="lg" disabled={loading} onClick={submitRequest}>
        {loading ? "در حال ثبت..." : "ثبت درخواست"}
      </Button>
    </div>
  );
}
