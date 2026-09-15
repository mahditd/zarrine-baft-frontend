export interface ProductImage {
  id: number;
  image_url: string;
  display_order: number;
  is_cover: boolean;
}

export interface Size {
  id: number;
  name: string;
}

export interface Color {
  id: number;
  name: string;
}

export interface ProductVariant {
  id: number;
  product_id: number;
  color: Color;
  size: Size | null;
  price: number;
}

export interface Category {
  id: number;
  name_fa: string;
  name_en: string;
}

export interface Material {
  id: number;
  name_fa: string;
  name_en: string;
}

export interface Product {
  id: number;

  product_code: string;

  name_fa: string;
  name_en: string;

  is_active: boolean;

  category: Category;
  material: Material;

  images: ProductImage[];
  variants: ProductVariant[];
}
