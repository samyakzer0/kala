import { Product, ProductFormData } from '../types/product';
import { promises as fs } from 'fs';
import path from 'path';

const PRODUCTS_FILE = path.join(process.cwd(), 'data', 'products.json');
const IMAGES_DIR = path.join(process.cwd(), 'public', 'images', 'products');

// Ensure directories exist
async function ensureDirectories(): Promise<void> {
  const dataDir = path.dirname(PRODUCTS_FILE);
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }
  
  try {
    await fs.access(IMAGES_DIR);
  } catch {
    await fs.mkdir(IMAGES_DIR, { recursive: true });
  }
}

// Load products from file
async function loadProducts(): Promise<Product[]> {
  try {
    await ensureDirectories();
    const data = await fs.readFile(PRODUCTS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // File doesn't exist or is empty, return empty array
    return [];
  }
}

// Save products to file
async function saveProducts(products: Product[]): Promise<void> {
  await ensureDirectories();
  await fs.writeFile(PRODUCTS_FILE, JSON.stringify(products, null, 2));
}

// Generate unique product ID
function generateProductId(): string {
  return `prod-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Create a new product
export async function createProduct(productData: ProductFormData, imageFile?: File): Promise<Product> {
  const products = await loadProducts();
  
  const newProduct: Product = {
    id: generateProductId(),
    ...productData,
    image: imageFile ? `/images/products/${generateProductId()}-${imageFile.name}` : undefined,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  products.push(newProduct);
  await saveProducts(products);
  return newProduct;
}

// Get all products
export async function getAllProducts(): Promise<Product[]> {
  return loadProducts();
}

// Get product by ID
export async function getProductById(productId: string): Promise<Product | null> {
  const products = await loadProducts();
  return products.find(product => product.id === productId) || null;
}

// Update product
export async function updateProduct(productId: string, updates: Partial<ProductFormData>): Promise<Product | null> {
  const products = await loadProducts();
  const productIndex = products.findIndex(product => product.id === productId);
  
  if (productIndex === -1) {
    return null;
  }
  
  products[productIndex] = {
    ...products[productIndex],
    ...updates,
    updatedAt: new Date().toISOString()
  };
  
  await saveProducts(products);
  return products[productIndex];
}

// Update product stock
export async function updateProductStock(productId: string, newStock: number): Promise<Product | null> {
  const products = await loadProducts();
  const productIndex = products.findIndex(product => product.id === productId);
  
  if (productIndex === -1) {
    return null;
  }
  
  products[productIndex].stock = newStock;
  products[productIndex].updatedAt = new Date().toISOString();
  
  await saveProducts(products);
  return products[productIndex];
}

// Decrease product stock (when order is placed)
export async function decreaseProductStock(productId: string, quantity: number): Promise<boolean> {
  const products = await loadProducts();
  const productIndex = products.findIndex(product => product.id === productId);
  
  if (productIndex === -1) {
    return false;
  }
  
  const product = products[productIndex];
  if (product.stock < quantity) {
    return false; // Not enough stock
  }
  
  product.stock -= quantity;
  product.updatedAt = new Date().toISOString();
  
  await saveProducts(products);
  return true;
}

// Check if product is in stock
export async function isProductInStock(productId: string, quantity: number = 1): Promise<boolean> {
  const product = await getProductById(productId);
  return product ? product.stock >= quantity : false;
}

// Get low stock products
export async function getLowStockProducts(): Promise<Product[]> {
  const products = await loadProducts();
  return products.filter(product => 
    product.isActive && product.stock <= product.lowStockThreshold
  );
}

// Delete product
export async function deleteProduct(productId: string): Promise<boolean> {
  const products = await loadProducts();
  const initialLength = products.length;
  const filteredProducts = products.filter(product => product.id !== productId);
  
  if (filteredProducts.length === initialLength) {
    return false; // Product not found
  }
  
  await saveProducts(filteredProducts);
  return true;
}

// Get products by category
export async function getProductsByCategory(category: string): Promise<Product[]> {
  const products = await loadProducts();
  return products.filter(product => 
    product.category.toLowerCase() === category.toLowerCase() && product.isActive
  );
}

// Search products
export async function searchProducts(query: string): Promise<Product[]> {
  const products = await loadProducts();
  const lowercaseQuery = query.toLowerCase();
  
  return products.filter(product => 
    product.isActive && (
      product.name.toLowerCase().includes(lowercaseQuery) ||
      product.description.toLowerCase().includes(lowercaseQuery) ||
      product.category.toLowerCase().includes(lowercaseQuery) ||
      (product.subcategory && product.subcategory.toLowerCase().includes(lowercaseQuery))
    )
  );
}

// Get inventory statistics
export async function getInventoryStats(): Promise<{
  totalProducts: number;
  activeProducts: number;
  lowStockProducts: number;
  outOfStockProducts: number;
  totalStockValue: number;
  categories: { [key: string]: number };
}> {
  const products = await loadProducts();
  
  const stats = {
    totalProducts: products.length,
    activeProducts: 0,
    lowStockProducts: 0,
    outOfStockProducts: 0,
    totalStockValue: 0,
    categories: {} as { [key: string]: number }
  };
  
  products.forEach(product => {
    if (product.isActive) {
      stats.activeProducts++;
      stats.totalStockValue += product.price * product.stock;
      
      if (product.stock === 0) {
        stats.outOfStockProducts++;
      } else if (product.stock <= product.lowStockThreshold) {
        stats.lowStockProducts++;
      }
      
      stats.categories[product.category] = (stats.categories[product.category] || 0) + 1;
    }
  });
  
  return stats;
}
