import { useQuery } from "@tanstack/react-query"
import { getProductById } from "@/api/products"

export function useProduct(id: number) {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => getProductById(id),
    enabled: !!id,
  })
}