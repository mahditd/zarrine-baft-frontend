import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  getAdminProducts,
  updateProductStatus,
} from "@/api/admin";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";

export default function AdminProducts() {
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [activeFilter, setActiveFilter] = useState<
    "all" | "active" | "inactive"
  >(searchParams.get("active") === "true" ? "active" : "all");
  const [error, setError] = useState("");

  const debouncedSearch = useDebouncedValue(searchInput);

  const filters = useMemo(
    () => ({
      page,
      search: debouncedSearch,
      isActive:
        activeFilter === "all" ? undefined : activeFilter === "active",
    }),
    [page, debouncedSearch, activeFilter],
  );

  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin-products", filters],
    queryFn: () => getAdminProducts(filters),
    placeholderData: (previousData) => previousData,
  });

  async function toggleStatus(id: number, current: boolean) {
    try {
      setError("");
      await updateProductStatus(id, !current);
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
    } catch {
      setError("تغییر وضعیت انجام نشد (فعال‌سازی بدون تصویر ممکن نیست)");
    }
  }

  const totalPages = data?.total_pages ?? 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-semibold">محصولات</h2>

        <Link
          to="/admin/products/new"
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
        >
          + محصول جدید
        </Link>
      </div>

      <div className="flex flex-wrap gap-3">
        <input
          value={searchInput}
          onChange={(e) => {
            setSearchInput(e.target.value);
            setPage(1);
          }}
          placeholder="جستجو: نام، کد…"
          className="min-w-52 flex-1 rounded-lg border bg-card px-4 py-2"
        />

        <select
          value={activeFilter}
          onChange={(e) => {
            setActiveFilter(e.target.value as "all" | "active" | "inactive");
            setPage(1);
          }}
          className="rounded-lg border bg-card px-3 py-2 text-sm"
        >
          <option value="all">همه</option>
          <option value="active">فعال</option>
          <option value="inactive">غیرفعال</option>
        </select>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {isLoading && (
        <div className="flex justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      )}

      {isError && (
        <p className="py-8 text-center text-destructive">
          خطا در دریافت محصولات
        </p>
      )}

      {data && data.products.length === 0 && (
        <p className="py-8 text-center text-muted-foreground">
          محصولی یافت نشد
        </p>
      )}

      {data && data.products.length > 0 && (
        <>
          <div className="space-y-2">
            {data.products.map((product) => (
              <div
                key={product.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border p-4"
              >
                <div>
                  <p className="font-semibold">
                    {product.product_code} — {product.name_fa}
                  </p>

                  <p className="text-sm text-muted-foreground">
                    {product.name_en} | {product.category.name_fa} |{" "}
                    {product.material.name_fa} | {product.images.length} تصویر
                    | {product.variants.length} وریانت
                  </p>

                  <span
                    className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs ${
                      product.is_active
                        ? "bg-green-100 text-green-800"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {product.is_active ? "فعال" : "غیرفعال"}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Link
                    to={`/admin/products/${product.id}/edit`}
                    className="rounded-lg border px-3 py-1.5 text-sm hover:bg-muted"
                  >
                    ویرایش
                  </Link>

                  <Link
                    to={`/admin/products/${product.id}/images`}
                    className="rounded-lg border px-3 py-1.5 text-sm hover:bg-muted"
                  >
                    تصاویر
                  </Link>

                  <Link
                    to={`/admin/products/${product.id}/variants`}
                    className="rounded-lg border px-3 py-1.5 text-sm hover:bg-muted"
                  >
                    وریانت‌ها
                  </Link>

                  <Button
                    size="sm"
                    variant={product.is_active ? "outline" : "default"}
                    onClick={() => toggleStatus(product.id, product.is_active)}
                  >
                    {product.is_active ? "غیرفعال" : "فعال"}
                  </Button>
                </div>
              </div>
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
