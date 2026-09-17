import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyRequests, cancelRequest } from "@/api/requestApi";
import type { CustomerRequest } from "@/api/requestApi";
import { Button } from "@/components/ui/button";
import { requestStatusLabel } from "@/utils/requestStatus";

export default function MyRequests() {
  const [requests, setRequests] = useState<CustomerRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function fetchRequests() {
      try {
        setLoading(true);
        setError("");

        const data = await getMyRequests();

        if (mounted) {
          setRequests(data.requests);
        }
      } catch {
        if (mounted) {
          setError("دریافت درخواست‌ها با خطا مواجه شد");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    fetchRequests();

    return () => {
      mounted = false;
    };
  }, []);

  async function handleCancel(id: number) {
    try {
      await cancelRequest(id);

      setRequests((prev) =>
        prev.map((request) =>
          request.id === id ? { ...request, status: "cancelled" } : request,
        ),
      );
    } catch {
      setError("لغو درخواست انجام نشد");
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-10 text-center">
        در حال بارگذاری...
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-6 py-10 text-center text-destructive">
        {error}
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="container mx-auto px-6 py-10 text-center">
        <h1 className="text-3xl font-bold">درخواستي ندارید</h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto space-y-6 px-6 py-10">
      <h1 className="text-3xl font-bold">درخواست‌های من</h1>

      {requests.map((request) => (
        <div key={request.id} className="space-y-4 rounded-xl border p-5">
          <div className="flex justify-between">
            <div>
              <p className="font-semibold">
                <Link
                  to={`/my-requests/${request.id}`}
                  className="text-primary hover:underline"
                >
                  درخواست شماره {request.request_number || request.id}
                </Link>
              </p>

              <p>شرکت: {request.company_name}</p>

              <p>وضعیت: {requestStatusLabel(request.status)}</p>

              <p className="text-sm text-muted-foreground">
                {new Date(request.created_at).toLocaleDateString("fa-IR")}
              </p>
            </div>

            {request.status === "new" && (
              <Button
                variant="destructive"
                onClick={() => handleCancel(request.id)}
              >
                لغو درخواست
              </Button>
            )}
          </div>

          <div className="space-y-2 border-t pt-4">
            {request.items.map((item) => (
              <div key={item.id} className="rounded-lg border p-3">
                <p className="font-semibold">{item.product_name_fa}</p>

                <p>کد محصول: {item.product_code}</p>

                <p>تعداد: {item.quantity}</p>

                <p>
                  قیمت ثبت شده: {item.price_snapshot.toLocaleString()} تومان
                </p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
