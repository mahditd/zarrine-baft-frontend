import { useMemo, useState, type ReactNode } from "react";
import type { UseQueryResult } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { ProductCard } from "./ProductCard";
import { useProducts } from "@/hooks/useProducts";
import { useCatalogOptions } from "@/hooks/useCatalogOptions";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import heroFallback from "@/assets/hero.png";

function toggleId(list: number[], id: number): number[] {
  return list.includes(id) ? list.filter((v) => v !== id) : [...list, id];
}

function FilterGroup({
  title,
  count,
  children,
}: {
  title: string;
  count: number;
  children: ReactNode;
}) {
  return (
    <fieldset className="rounded-lg border p-3">
      <legend className="px-1 text-sm font-semibold">
        {title}
        {count > 0 && <span className="text-primary"> ({count})</span>}
      </legend>

      <div className="max-h-44 space-y-2 overflow-y-auto">{children}</div>
    </fieldset>
  );
}

function TaxonomyGroup<T extends { id: number }>({
  title,
  query,
  selected,
  onToggle,
  renderLabel,
}: {
  title: string;
  query: UseQueryResult<T[], Error>;
  selected: number[];
  onToggle: (id: number) => void;
  renderLabel: (item: T) => ReactNode;
}) {
  return (
    <FilterGroup title={title} count={selected.length}>
      {query.isLoading && (
        <div className="flex justify-center py-2">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      )}

      {query.isError && (
        <p className="text-sm text-destructive">خطا در دریافت فیلترها</p>
      )}

      {!query.isLoading && !query.isError && (query.data?.length ?? 0) === 0 && (
        <p className="text-sm text-muted-foreground">موردی ثبت نشده</p>
      )}

      {query.data?.map((item) => (
        <label
          key={item.id}
          className="flex cursor-pointer items-center gap-2 text-sm"
        >
          <input
            type="checkbox"
            checked={selected.includes(item.id)}
            onChange={() => onToggle(item.id)}
          />
          {renderLabel(item)}
        </label>
      ))}
    </FilterGroup>
  );
}

export function ProductSection() {
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [categoryIds, setCategoryIds] = useState<number[]>([]);
  const [materialIds, setMaterialIds] = useState<number[]>([]);
  const [colorIds, setColorIds] = useState<number[]>([]);
  const [sizeIds, setSizeIds] = useState<number[]>([]);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const debouncedSearch = useDebouncedValue(searchInput);

  const filters = useMemo(
    () => ({
      page,
      search: debouncedSearch,
      categoryIds,
      materialIds,
      colorIds,
      sizeIds,
    }),
    [page, debouncedSearch, categoryIds, materialIds, colorIds, sizeIds],
  );

  const { data, isLoading, error } = useProducts(filters);
  const { categories, materials, colors, sizes } = useCatalogOptions();

  const activeFilterCount =
    categoryIds.length +
    materialIds.length +
    colorIds.length +
    sizeIds.length;

  function clearAll() {
    setSearchInput("");
    setCategoryIds([]);
    setMaterialIds([]);
    setColorIds([]);
    setSizeIds([]);
    setPage(1);
  }

  const totalPages = data?.total_pages ?? 0;
  const pageNumbers = useMemo(() => {
    if (totalPages <= 1) return [];
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const start = Math.max(1, Math.min(page - 2, totalPages - 4));
    return [start, start + 1, start + 2, start + 3, start + 4];
  }, [page, totalPages]);

  return (
    <section id="catalog" className="container mx-auto scroll-mt-24 px-6 py-16">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-primary">محصولات</h2>

        <p className="mt-3 text-muted-foreground">
          جدیدترین محصولات زرینه بافت
        </p>
      </div>

      {/* Search + filter toggle */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="flex min-w-52 flex-1 items-center gap-2">
          <input
            value={searchInput}
            onChange={(e) => {
              setSearchInput(e.target.value);
              setPage(1);
            }}
            placeholder="جستجو: نام، کد محصول…"
            className="w-full rounded-lg border bg-card px-4 py-2"
          />

          {searchInput && (
            <button
              onClick={() => {
                setSearchInput("");
                setPage(1);
              }}
              className="shrink-0 rounded-lg border px-3 py-2 text-sm hover:bg-muted"
            >
              پاک
            </button>
          )}
        </div>

        <button
          onClick={() => setFiltersOpen((open) => !open)}
          className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-muted"
        >
          {filtersOpen ? "بستن فیلترها" : "فیلترها"}
          {activeFilterCount > 0 && ` (${activeFilterCount})`}
        </button>

        {activeFilterCount > 0 && (
          <button
            onClick={clearAll}
            className="rounded-lg border px-4 py-2 text-sm text-destructive hover:bg-destructive/10"
          >
            حذف همه فیلترها
          </button>
        )}
      </div>

      {/* Filters */}
      {filtersOpen && (
        <div className="mb-6 grid gap-4 rounded-xl border p-4 md:grid-cols-2 lg:grid-cols-4">
          <TaxonomyGroup
            title="دسته‌بندی"
            query={categories}
            selected={categoryIds}
            onToggle={(id) => {
              setCategoryIds((prev) => toggleId(prev, id));
              setPage(1);
            }}
            renderLabel={(category) => category.name_fa}
          />

          <TaxonomyGroup
            title="جنس"
            query={materials}
            selected={materialIds}
            onToggle={(id) => {
              setMaterialIds((prev) => toggleId(prev, id));
              setPage(1);
            }}
            renderLabel={(material) => material.name_fa}
          />

          <TaxonomyGroup
            title="رنگ"
            query={colors}
            selected={colorIds}
            onToggle={(id) => {
              setColorIds((prev) => toggleId(prev, id));
              setPage(1);
            }}
            renderLabel={(color) => (
              <>
                <span
                  className="block h-4 w-4 shrink-0 rounded-full border border-gray-400"
                  style={{ backgroundColor: color.hex_code }}
                />
                {color.name_fa}
              </>
            )}
          />

          <TaxonomyGroup
            title="سایز"
            query={sizes}
            selected={sizeIds}
            onToggle={(id) => {
              setSizeIds((prev) => toggleId(prev, id));
              setPage(1);
            }}
            renderLabel={(size) => size.name}
          />
        </div>
      )}

      {isLoading && (
        <p className="py-8 text-center text-muted-foreground">
          در حال بارگذاری محصولات...
        </p>
      )}

      {error && (
        <section className="container mx-auto px-6 py-16">
          <p>خطا در دریافت محصولات</p>
        </section>
      )}

      {!isLoading && !error && data && data.products.length === 0 && (
        <p className="py-8 text-center text-muted-foreground">
          محصولی یافت نشد
        </p>
      )}

      {!isLoading && !error && data && data.products.length > 0 && (
        <>
          <p className="mb-4 text-sm text-muted-foreground">
            {data.total_products} محصول
          </p>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {data.products.map((product) => {
              const minPrice =
                product.variants.length > 0
                  ? Math.min(...product.variants.map((v) => v.price))
                  : null;
              const price =
                minPrice !== null
                  ? product.variants.length > 1
                    ? `از ${minPrice.toLocaleString()} تومان`
                    : `${minPrice.toLocaleString()} تومان`
                  : "تماس بگیرید";

              return (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  code={product.product_code}
                  persianName={product.name_fa}
                  englishName={product.name_en}
                  price={price}
                  image={product.images[0]?.image_url ?? heroFallback}
                />
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="rounded-lg border px-4 py-2 text-sm hover:bg-muted disabled:opacity-50"
              >
                قبلی
              </button>

              {pageNumbers.map((pageNumber) => (
                <button
                  key={pageNumber}
                  onClick={() => setPage(pageNumber)}
                  className={`rounded-lg border px-4 py-2 text-sm ${
                    pageNumber === page
                      ? "border-primary bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  }`}
                >
                  {pageNumber}
                </button>
              ))}

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
    </section>
  );
}
