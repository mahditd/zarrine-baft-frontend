import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  cancelRequest,
  getMyRequestById,
  type CustomerRequest,
} from "@/api/requestApi";
import { requestStatusLabel } from "@/utils/requestStatus";

export default function MyRequestDetails() {
  const { id } = useParams();

  return <MyRequestDetailsView key={id} requestId={Number(id)} />;
}

function MyRequestDetailsView({ requestId }: { requestId: number }) {
  const [request, setRequest] = useState<CustomerRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function fetchRequest() {
      try {
        setLoading(true);
        setError("");

        const data = await getMyRequestById(requestId);

        if (mounted) {
          setRequest(data);
        }
      } catch {
        if (mounted) {
          setError("دریافت درخواست با خطا مواجه شد");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    fetchRequest();

    return () => {
      mounted = false;
    };
  }, [requestId]);

  async function handleCancel() {
    try {
      setCancelling(true);

      await cancelRequest(requestId);

      setRequest((prev) =>
        prev ? { ...prev, status: "cancelled" } : prev,
      );
    } catch {
      setError("لغو درخواست انجام نشد");
    } finally {
      setCancelling(false);
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto flex justify-center px-6 py-10">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto space-y-4 px-6 py-10 text-center">
        <p className="text-destructive">{error}</p>

        <Link
          to="/my-requests"
          className="text-sm text-primary hover:underline"
        >
          بازگشت به درخواست‌ها
        </Link>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="container mx-auto space-y-4 px-6 py-10 text-center">
        <p>درخواست پیدا نشد</p>

        <Link
          to="/my-requests"
          className="text-sm text-primary hover:underline"
        >
          بازگشت به درخواست‌ها
        </Link>
      </div>
    );
  }

  const totalPrice = request.items.reduce(
    (sum, item) => sum + item.price_snapshot * item.quantity,
    0,
  );

  return (
    <div className="container mx-auto max-w-3xl space-y-6 px-6 py-10">
      <Link
        to="/my-requests"
        className="text-sm text-primary hover:underline"
      >
        ← بازگشت به درخواست‌ها
      </Link>

      <div className="rounded-xl border p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold">
              درخواست شماره {request.request_number || request.id}
            </h1>

            <p className="mt-2 text-sm text-muted-foreground">
              ثبت:{" "}
              {new Date(request.created_at).toLocaleDateString("fa-IR")}
            </p>
          </div>

          <span className="rounded-full bg-muted px-3 py-1 text-sm font-medium">
            {requestStatusLabel(request.status)}
          </span>
        </div>

        {request.status === "new" && (
          <Button
            variant="destructive"
            disabled={cancelling}
            onClick={handleCancel}
            className="mt-4"
          >
            {cancelling ? "در حال لغو…" : "لغو درخواست"}
          </Button>
        )}
      </div>

      <div className="space-y-2 rounded-xl border p-5">
        <h2 className="text-lg font-semibold">اطلاعات شرکت</h2>

        <p>شرکت: {request.company_name}</p>

        <p>شماره تماس شرکت: {request.company_phone}</p>

        {request.description && <p>توضیحات: {request.description}</p>}
      </div>

      <div className="space-y-4 rounded-xl border p-5">
        <h2 className="text-lg font-semibold">محصولات</h2>

        {request.items.map((item) => (
          <div key={item.id} className="space-y-1 rounded-lg border p-4">
            <p className="font-semibold">{item.product_name_fa}</p>

            <p className="text-sm text-muted-foreground">
              {item.product_name_en}
            </p>

            <p className="text-sm">کد محصول: {item.product_code}</p>

            <p className="text-sm">
              رنگ: {item.color_name_fa} | سایز: {item.size_name}
            </p>

            <p className="text-sm">تعداد: {item.quantity}</p>

            <p className="text-sm">
              قیمت ثبت شده: {item.price_snapshot.toLocaleString()} تومان
            </p>

            <p className="font-semibold text-primary">
              جمع: {(item.price_snapshot * item.quantity).toLocaleString()}{" "}
              تومان
            </p>
          </div>
        ))}

        <div className="border-t pt-4 text-lg font-bold">
          مجموع: {totalPrice.toLocaleString()} تومان
        </div>
      </div>

      {request.status_history.length > 0 && (
        <div className="space-y-3 rounded-xl border p-5">
          <h2 className="text-lg font-semibold">تاریخچه وضعیت</h2>

          {request.status_history.map((entry) => (
            <div
              key={entry.id}
              className="rounded-lg bg-muted p-3 text-sm"
            >
              <p>
                {requestStatusLabel(entry.from_status)} ←{" "}
                {requestStatusLabel(entry.to_status)}
              </p>

              <p className="mt-1 text-muted-foreground">
                {new Date(entry.created_at).toLocaleDateString("fa-IR")}
              </p>

              {entry.note && <p className="mt-1">{entry.note}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
