import { apiClient } from "./client";

export type CreateRequestItem = {
  product_variant_id: number;
  quantity: number;
};

export type CreateRequestPayload = {
  customer_name?: string;
  phone?: string;

  company_name: string;
  company_phone: string;

  description?: string;

  items: CreateRequestItem[];
};

export type RequestItemResponse = {
  id: number;
  product_variant_id: number;
  quantity: number;

  price_snapshot: number;

  product_code: string;
  product_name_fa: string;
  product_name_en: string;

  color_name_fa: string;
  color_name_en: string;

  size_name: string;
};

export type RequestStatusHistory = {
  id: number;
  from_status: string;
  to_status: string;
  note?: string;
  created_at: string;
};

export type CustomerRequest = {
  id: number;
  request_number: string;

  customer_name: string;
  phone: string;

  company_name: string;
  company_phone: string;

  description?: string;

  status: string;

  created_at: string;
  updated_at: string;

  items: RequestItemResponse[];
  status_history: RequestStatusHistory[];
};

export type MyRequestsResponse = {
  limit: number;
  page: number;

  requests: CustomerRequest[];

  total_pages: number;
  total_requests: number;
};

export async function createRequest(data: CreateRequestPayload) {
  const response = await apiClient.post("/api/requests", data);

  return response.data;
}

export async function getMyRequests(): Promise<MyRequestsResponse> {
  const response = await apiClient.get("/api/me/requests");

  return response.data;
}

export async function getMyRequestById(id: number): Promise<CustomerRequest> {
  const response = await apiClient.get(`/api/me/requests/${id}`);

  return response.data.request ?? response.data;
}

export async function cancelRequest(id: number) {
  const response = await apiClient.patch(`/api/me/requests/${id}/cancel`);

  return response.data;
}
