import { useQuery } from "@tanstack/react-query";
import {
  getCategories,
  getColors,
  getMaterials,
  getSizes,
} from "@/api/catalog";

export function useCatalogOptions() {
  const categories = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
    staleTime: 5 * 60 * 1000,
  });

  const materials = useQuery({
    queryKey: ["materials"],
    queryFn: getMaterials,
    staleTime: 5 * 60 * 1000,
  });

  const colors = useQuery({
    queryKey: ["colors"],
    queryFn: getColors,
    staleTime: 5 * 60 * 1000,
  });

  const sizes = useQuery({
    queryKey: ["sizes"],
    queryFn: getSizes,
    staleTime: 5 * 60 * 1000,
  });

  return { categories, materials, colors, sizes };
}
