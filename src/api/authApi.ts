import { apiClient } from "./client";

export type LoginPayload = {
  phone: string;
  password: string;
};

export async function login(data: LoginPayload) {
  const response = await apiClient.post("/api/auth/login", data);

  return response.data;
}

export type RegisterPayload = {
  full_name: string;
  phone: string;

  email?: string;

  password: string;
  confirm_password: string;

  company_name?: string;
  company_phone?: string;

  country?: string;
  address?: string;
};

export async function register(data: RegisterPayload) {
  const response = await apiClient.post("/api/auth/register", data);

  return response.data;
}

export async function getProfile() {
  const response = await apiClient.get("/api/me/profile");

  return response.data;
}

export type UpdateProfilePayload = {
  full_name: string;
  email?: string;

  company_name?: string;
  company_phone?: string;

  country?: string;
  address?: string;
};

export async function updateProfile(data: UpdateProfilePayload) {
  const response = await apiClient.patch("/api/me/profile", data);

  return response.data;
}
