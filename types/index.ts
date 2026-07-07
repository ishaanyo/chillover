export type Gender = 'men' | 'women' | 'unisex';
export type Size = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL' | '3XL';

export interface ProductImage {
  id: string;
  url: string;
  alt: string;
  order: number;
}

export interface ProductVariant {
  size: Size;
  stock: number;
}

export interface Subcategory {
  id: string;
  name: string;
  slug: string;
  mainCategory: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: Gender;
  subcategoryId?: string | null;
  subcategory?: Subcategory | null;
  price: number;
  originalPrice: number;
  description: string;
  shortDesc: string;
  images: ProductImage[];
  variants: ProductVariant[];
  features: string[];
  fabric: string;
  fit: string;
  badge?: string;
  isNew: boolean;
  isFeatured: boolean;
  isBestseller: boolean;
  tags: string[];
  createdAt: string;
}

export interface CartItem {
  product: Product;
  size: Size;
  quantity: number;
}

export interface WishlistItem {
  productId: string;
  addedAt: string;
}

export interface AdminUser {
  username: string;
  authenticated: boolean;
}
