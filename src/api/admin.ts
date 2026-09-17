import { apiClient } from "./client";
import type {
  Category,
  Color,
  Material,
  Product,
  ProductImage,
  ProductVariant,
  Size,
} from "@/types/product";

// ---------- Dashboard ----------

export type DashboardLatestRequest = {
  id: number;
  request_number: string;
  customer_name: string;
  company_name: string;
  status: string;
  created_at: string;
};

export type DashboardResponse = {
  total_products: number;
  active_products: number;
  new_requests: number;
  latest_requests: DashboardLatestRequest[];
};

export async function getAdminDashboard(): Promise<DashboardResponse> {
  const response = await apiClient.get<DashboardResponse>("/api/admin/dashboard");

  return response.data;
}

// ---------- Products ----------

export type AdminProductFilters = {
  page?: number;
  search?: string;
  isActive?: boolean;
};

export async function getAdminProducts(filters: AdminProductFilters = {}) {
  const params: Record<string, string> = {};

  if (filters.page && filters.page > 1) {
    params.page = String(filters.page);
  }

  const search = filters.search?.trim();
  if (search) {
    params.search = search;
  }

  if (filters.isActive !== undefined) {
    params.is_active = filters.isActive ? "true" : "false";
  }

  const response = await apiClient.get<{
    products: Product[];
    page: number;
    limit: number;
    total_products: number;
    total_pages: number;
  }>("/api/admin/products", { params });

  return response.data;
}

export async function getAdminProduct(id: number): Promise<Product> {
  const response = await apiClient.get<{ product: Product }>(
    `/api/admin/products/${id}`,
  );

  return response.data.product;
}

export type CreateProductPayload = {
  product_code: string;
  name_fa: string;
  name_en: string;
  category_id: number;
  material_id: number;
};

export async function createProduct(data: CreateProductPayload) {
  const response = await apiClient.post("/api/admin/products", data);

  return response.data;
}

export type UpdateProductPayload = {
  name_fa: string;
  name_en: string;
  category_id: number;
  material_id: number;
};

export async function updateProduct(id: number, data: UpdateProductPayload) {
  const response = await apiClient.patch(`/api/admin/products/${id}`, data);

  return response.data;
}

export async function updateProductStatus(id: number, isActive: boolean) {
  const response = await apiClient.patch(`/api/admin/products/${id}/status`, {
    is_active: isActive,
  });

  return response.data;
}

// ---------- Variants ----------

export async function getProductVariants(
  productId: number,
): Promise<ProductVariant[]> {
  const response = await apiClient.get<{ variants: ProductVariant[] }>(
    `/api/admin/products/${productId}/variants`,
  );

  return response.data.variants;
}

export type VariantPayload = {
  color_id: number;
  size_id: number;
  price: number;
};

export async function createVariant(productId: number, data: VariantPayload) {
  const response = await apiClient.post("/api/admin/product-variants", {
    product_id: productId,
    ...data,
  });

  return response.data;
}

export async function updateVariant(id: number, data: VariantPayload) {
  const response = await apiClient.patch(
    `/api/admin/product-variants/${id}`,
    data,
  );

  return response.data;
}

export async function deleteVariant(id: number) {
  const response = await apiClient.delete(`/api/admin/product-variants/${id}`);

  return response.data;
}

// ---------- Images (multipart, field "image") ----------

const multipartHeaders = { "Content-Type": "multipart/form-data" };

export async function getProductImages(
  productId: number,
): Promise<ProductImage[]> {
  const response = await apiClient.get<{ images: ProductImage[] }>(
    `/api/admin/products/${productId}/images`,
  );

  return response.data.images;
}

export async function uploadProductImage(productId: number, file: File) {
  const form = new FormData();
  form.append("image", file);

  const response = await apiClient.post(
    `/api/admin/products/${productId}/images`,
    form,
    { headers: multipartHeaders },
  );

  return response.data;
}

export async function replaceProductImage(
  productId: number,
  imageId: number,
  file: File,
) {
  const form = new FormData();
  form.append("image", file);

  const response = await apiClient.put(
    `/api/admin/products/${productId}/images/${imageId}`,
    form,
    { headers: multipartHeaders },
  );

  return response.data;
}

export async function deleteProductImage(imageId: number) {
  // Note backend path uses singular "product-images".
  const response = await apiClient.delete(
    `/api/admin/product-images/${imageId}`,
  );

  return response.data;
}

export async function reorderProductImages(
  productId: number,
  imageIds: number[],
) {
  const response = await apiClient.patch(
    `/api/admin/products/${productId}/images/reorder`,
    { image_ids: imageIds },
  );

  return response.data;
}

// ---------- Taxonomy (admin create; lists are public in catalog.ts) ----------

export async function createCategory(data: { name_fa: string; name_en: string }) {
  const response = await apiClient.post("/api/admin/categories", data);

  return response.data as { category: Category };
}

export async function createMaterial(data: { name_fa: string; name_en: string }) {
  const response = await apiClient.post("/api/admin/materials", data);

  return response.data as { material: Material };
}

export async function createColor(data: {
  name_fa: string;
  name_en: string;
  hex_code: string;
}) {
  const response = await apiClient.post("/api/admin/colors", data);

  return response.data as { color: Color };
}

export type { Category, Color, Material, Size };

// ---------- Requests ----------

export type AdminRequestItem = {
  id: number;
  product_variant_id: number;
  product_code: string;
  product_name_fa: string;
  product_name_en: string;
  color_name_fa: string;
  color_name_en: string;
  size_name: string;
  quantity: number;
  price_snapshot: number;
};

export type AdminRequestHistory = {
  id: number;
  from_status: string;
  to_status: string;
  note?: string;
  admin_name?: string;
  created_at: string;
};

export type AdminRequest = {
  id: number;
  request_number: string;
  user_id: number;
  customer_name: string;
  phone: string;
  company_name: string;
  company_phone: string;
  description: string;
  status: string;
  items: AdminRequestItem[];
  status_history: AdminRequestHistory[];
  created_at: string;
  updated_at: string;
};

export type AdminRequestsResponse = {
  page: number;
  limit: number;
  total_requests: number;
  total_pages: number;
  requests: AdminRequest[];
};

export async function getAdminRequests(filters: {
  page?: number;
  status?: string;
  search?: string;
} = {}): Promise<AdminRequestsResponse> {
  const params: Record<string, string> = {};

  if (filters.page && filters.page > 1) {
    params.page = String(filters.page);
  }
  if (filters.status) {
    params.status = filters.status;
  }
  const search = filters.search?.trim();
  if (search) {
    params.search = search;
  }

  const response = await apiClient.get<AdminRequestsResponse>(
    "/api/admin/requests",
    { params },
  );

  return response.data;
}

export async function getAdminRequest(id: number): Promise<AdminRequest> {
  const response = await apiClient.get<{ request: AdminRequest }>(
    `/api/admin/requests/${id}`,
  );

  return response.data.request;
}

export async function updateAdminRequestStatus(
  id: number,
  status: string,
  note?: string,
) {
  const response = await apiClient.patch(`/api/admin/requests/${id}/status`, {
    status,
    note: note ?? "",
  });

  return response.data;
}
