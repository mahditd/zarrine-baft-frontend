import { apiClient } from "./client";
import type {
  Category,
  Color,
  Material,
  Size,
} from "@/types/product";

export async function getCategories(): Promise<Category[]> {
  const response = await apiClient.get<{ categories: Category[] }>(
    "/api/categories",
  );

  return response.data.categories;
}

export async function getMaterials(): Promise<Material[]> {
  const response = await apiClient.get<{ materials: Material[] }>(
    "/api/materials",
  );

  return response.data.materials;
}

export async function getColors(): Promise<Color[]> {
  const response = await apiClient.get<{ colors: Color[] }>("/api/colors");

  return response.data.colors;
}

export async function getSizes(): Promise<Size[]> {
  const response = await apiClient.get<{ sizes: Size[] }>("/api/sizes");

  return response.data.sizes;
}
