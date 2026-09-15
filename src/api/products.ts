import { apiClient } from "./client"
import type { Product } from "@/types/product"


export interface ProductsResponse {
  limit: number
  page: number
  products: Product[]
  total_pages: number
  total_products: number
}


export async function getProducts(): Promise<ProductsResponse> {
  const response = await apiClient.get<ProductsResponse>("/products")

  return response.data
}