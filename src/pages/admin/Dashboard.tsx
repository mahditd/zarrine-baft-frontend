import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { getAdminDashboard, type DashboardResponse } from "@/api/admin";
import { requestStatusLabel } from "@/utils/requestStatus";

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const result = await getAdminDashboard();
        if (mounted) setData(result);
      } catch {
        if (mounted) setError("دریافت آمار با خطا مواجه شد");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !data) {
    return <p className="py-10 text-center text-destructive">{error}</p>;
  }

  const stats = [
    { label: "کل محصولات", value: data.total_products, to: "/admin/products" },
    {
      label: "محصولات فعال",
      value: data.active_products,
      to: "/admin/products?active=true",
    },
    {
      label: "درخواست‌های جدید",
      value: data.new_requests,
      to: "/admin/requests?status=new",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            to={stat.to}
            className="rounded-xl border p-6 transition hover:shadow-sm"
          >
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <p className="mt-2 text-4xl font-bold">{stat.value}</p>
          </Link>
        ))}
      </div>

      <div className="rounded-xl border p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">آخرین درخواست‌ها</h2>

          <Link
            to="/admin/requests"
            className="text-sm text-primary hover:underline"
          >
            مشاهده همه
          </Link>
        </div>

        {data.latest_requests.length === 0 ? (
          <p className="text-sm text-muted-foreground">درخواستی ثبت نشده</p>
        ) : (
          <div className="space-y-2">
            {data.latest_requests.map((request) => (
              <Link
                key={request.id}
                to={`/admin/requests/${request.id}`}
                className="flex flex-wrap items-center justify-between gap-2 rounded-lg border p-3 hover:bg-muted"
              >
                <div>
                  <p className="font-semibold">
                    {request.request_number || `#${request.id}`} —{" "}
                    {request.company_name}
                  </p>

                  <p className="text-sm text-muted-foreground">
                    {request.customer_name} |{" "}
                    {new Date(request.created_at).toLocaleDateString("fa-IR")}
                  </p>
                </div>

                <span className="rounded-full bg-muted px-3 py-1 text-sm">
                  {requestStatusLabel(request.status)}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
