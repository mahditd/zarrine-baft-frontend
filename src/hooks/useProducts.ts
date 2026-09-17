import { useQuery } from "@tanstack/react-query"
import { getProducts, type ProductFilters } from "@/api/products"




export function useProducts(filters: ProductFilters = {}) {
  return useQuery({
    queryKey: ["products", filters],
    queryFn: () => getProducts(filters),
    placeholderData: (previousData) => previousData,
  })
}