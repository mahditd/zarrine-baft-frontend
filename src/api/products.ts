import { apiClient } from "./client";
import type { Product } from "@/types/product";

export interface ProductsResponse {
  limit: number;
  page: number;
  products: Product[];
  total_pages: number;
  total_products: number;
}

export interface ProductFilters {
  page?: number;
  search?: string;
  categoryIds?: number[];
  materialIds?: number[];
  colorIds?: number[];
  sizeIds?: number[];
}

export async function getProducts(
  filters: ProductFilters = {},
): Promise<ProductsResponse> {
  const params: Record<string, string> = {};

  if (filters.page && filters.page > 1) {
    params.page = String(filters.page);
  }

  const search = filters.search?.trim();
  if (search) {
    params.search = search;
  }

  if (filters.categoryIds && filters.categoryIds.length > 0) {
    params.category_ids = filters.categoryIds.join(",");
  }

  if (filters.materialIds && filters.materialIds.length > 0) {
    params.material_ids = filters.materialIds.join(",");
  }

  if (filters.colorIds && filters.colorIds.length > 0) {
    params.color_ids = filters.colorIds.join(",");
  }

  if (filters.sizeIds && filters.sizeIds.length > 0) {
    params.size_ids = filters.sizeIds.join(",");
  }

  const response = await apiClient.get<ProductsResponse>("/api/products", {
    params,
  });

  return response.data;
}

export async function getProductById(id: number): Promise<Product> {
  const response = await apiClient.get<{ product: Product }>(
    `/api/products/${id}`,
  );

  return response.data.product;
}