export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  subcategory?: string;
  gemColor?: string;
  description: string;
  featured?: boolean;
  new?: boolean;
  bestseller?: boolean;
  image?: string;
  // New inventory fields
  stock: number;
  lowStockThreshold: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductFormData {
  name: string;
  price: number;
  category: string;
  subcategory?: string;
  gemColor?: string;
  description: string;
  featured: boolean;
  new: boolean;
  bestseller: boolean;
  stock: number;
  lowStockThreshold: number;
  isActive: boolean;
}

export interface InventoryUpdate {
  productId: string;
  stock: number;
  lowStockThreshold: number;
}
