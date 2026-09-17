import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getAdminRequests } from "@/api/admin";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { requestStatusLabel } from "@/utils/requestStatus";

const STATUS_OPTIONS = [
  { value: "", label: "همه وضعیت‌ها" },
  { value: "new", label: "جدید" },
  { value: "contacted", label: "تماس گرفته شده" },
  { value: "in_discussion", label: "در حال مذاکره" },
  { value: "completed", label: "تکمیل شده" },
  { value: "cancelled", label: "لغو شده" },
];

export default function AdminRequests() {
  const [searchParams] = useSearchParams();

  const [page, setPage] = useState(1);
  const [status, setStatus] = useState(searchParams.get("status") ?? "");
  const [searchInput, setSearchInput] = useState("");

  const debouncedSearch = useDebouncedValue(searchInput);

  const filters = useMemo(
    () => ({ page, status, search: debouncedSearch }),
    [page, status, debouncedSearch],
  );

  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin-requests", filters],
    queryFn: () => getAdminRequests(filters),
    placeholderData: (previousData) => previousData,
  });

  const totalPages = data?.total_pages ?? 0;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">درخواست‌ها</h2>

      <div className="flex flex-wrap gap-3">
        <input
          value={searchInput}
          onChange={(e) => {
            setSearchInput(e.target.value);
            setPage(1);
          }}
          placeholder="جستجو: شماره، مشتری، شرکت، تلفن…"
          className="min-w-52 flex-1 rounded-lg border bg-card px-4 py-2"
        />

        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
          className="rounded-lg border bg-card px-3 py-2 text-sm"
        >
          {STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {isLoading && (
        <div className="flex justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      )}

      {isError && (
        <p className="py-8 text-center text-destructive">
          خطا در دریافت درخواست‌ها
        </p>
      )}

      {data && data.requests.length === 0 && (
        <p className="py-8 text-center text-muted-foreground">
          درخواستی یافت نشد
        </p>
      )}

      {data && data.requests.length > 0 && (
        <>
          <div className="space-y-2">
            {data.requests.map((request) => (
              <Link
                key={request.id}
                to={`/admin/requests/${request.id}`}
                className="flex flex-wrap items-center justify-between gap-2 rounded-xl border p-4 hover:bg-muted"
              >
                <div>
                  <p className="font-semibold">
                    {request.request_number || `#${request.id}`} —{" "}
                    {request.company_name}
                  </p>

                  <p className="text-sm text-muted-foreground">
                    {request.customer_name} | {request.phone} |{" "}
                    {new Date(request.created_at).toLocaleDateString("fa-IR")}
                  </p>
                </div>

                <span className="rounded-full bg-muted px-3 py-1 text-sm">
                  {requestStatusLabel(request.status)}
                </span>
              </Link>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="rounded-lg border px-4 py-2 text-sm hover:bg-muted disabled:opacity-50"
              >
                قبلی
              </button>

              <span className="text-sm text-muted-foreground">
                صفحه {data.page} از {totalPages}
              </span>

              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="rounded-lg border px-4 py-2 text-sm hover:bg-muted disabled:opacity-50"
              >
                بعدی
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
