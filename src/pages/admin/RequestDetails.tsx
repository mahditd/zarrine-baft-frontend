import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  getAdminRequest,
  updateAdminRequestStatus,
  type AdminRequest,
} from "@/api/admin";
import { requestStatusLabel } from "@/utils/requestStatus";

const NEXT_STATUSES = [
  "contacted",
  "in_discussion",
  "completed",
  "cancelled",
];

export default function AdminRequestDetails() {
  const { id } = useParams();

  return <AdminRequestDetailsView key={id} requestId={Number(id)} />;
}

function AdminRequestDetailsView({ requestId }: { requestId: number }) {
  const [request, setRequest] = useState<AdminRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const data = await getAdminRequest(requestId);
        if (mounted) setRequest(data);
      } catch {
        if (mounted) setError("دریافت درخواست با خطا مواجه شد");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();

    return () => {
      mounted = false;
    };
  }, [requestId]);

  async function changeStatus(status: string) {
    try {
      setSaving(true);
      setError("");
      await updateAdminRequestStatus(requestId, status, note);
      const data = await getAdminRequest(requestId);
      setRequest(data);
      setNote("");
    } catch {
      setError("تغییر وضعیت انجام نشد");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !request) {
    return (
      <div className="space-y-4 py-10 text-center">
        <p className="text-destructive">{error || "درخواست پیدا نشد"}</p>

        <Link
          to="/admin/requests"
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
    <div className="max-w-3xl space-y-6">
      <Link
        to="/admin/requests"
        className="text-sm text-primary hover:underline"
      >
        ← بازگشت به درخواست‌ها
      </Link>

      <div className="rounded-xl border p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold">
              {request.request_number || `#${request.id}`}
            </h2>

            <p className="mt-2 text-sm text-muted-foreground">
              {new Date(request.created_at).toLocaleDateString("fa-IR")}
            </p>
          </div>

          <span className="rounded-full bg-muted px-3 py-1 text-sm font-medium">
            {requestStatusLabel(request.status)}
          </span>
        </div>

        <div className="mt-4 space-y-1 text-sm">
          <p>مشتری: {request.customer_name} ({request.phone})</p>
          <p>شرکت: {request.company_name} ({request.company_phone})</p>
          {request.description && <p>توضیحات: {request.description}</p>}
        </div>
      </div>

      <div className="space-y-2 rounded-xl border p-5">
        <h3 className="text-lg font-semibold">تغییر وضعیت</h3>

        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="یادداشت مدیر (خصوصی، فقط برای ادمین)"
          className="min-h-20 w-full rounded-md border px-3 py-2 text-sm"
        />

        <div className="flex flex-wrap gap-2">
          {NEXT_STATUSES.filter((s) => s !== request.status).map((status) => (
            <Button
              key={status}
              size="sm"
              variant={status === "cancelled" ? "destructive" : "outline"}
              disabled={saving}
              onClick={() => changeStatus(status)}
            >
              {requestStatusLabel(status)}
            </Button>
          ))}
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>

      <div className="space-y-2 rounded-xl border p-5">
        <h3 className="text-lg font-semibold">محصولات</h3>

        {request.items.map((item) => (
          <div key={item.id} className="rounded-lg border p-3 text-sm">
            <p className="font-semibold">{item.product_name_fa}</p>
            <p>کد: {item.product_code} | تعداد: {item.quantity}</p>
            <p>
              قیمت ثبت شده: {item.price_snapshot.toLocaleString()} تومان | جمع:{" "}
              {(item.price_snapshot * item.quantity).toLocaleString()} تومان
            </p>
          </div>
        ))}

        <p className="font-bold">مجموع: {totalPrice.toLocaleString()} تومان</p>
      </div>

      {request.status_history.length > 0 && (
        <div className="space-y-2 rounded-xl border p-5">
          <h3 className="text-lg font-semibold">تاریخچه (شامل یادداشت‌ها)</h3>

          {request.status_history.map((entry) => (
            <div key={entry.id} className="rounded-lg bg-muted p-3 text-sm">
              <p>
                {requestStatusLabel(entry.from_status)} ←{" "}
                {requestStatusLabel(entry.to_status)}
                {entry.admin_name && ` (توسط ${entry.admin_name})`}
              </p>

              <p className="text-muted-foreground">
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
