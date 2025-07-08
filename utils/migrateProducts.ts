import { products as oldProducts } from '../data/products';
import { Product } from '../types/product';

// Migration script to convert old products to new format with inventory
export const migrateProducts = (): Product[] => {
  return oldProducts.map((product, index) => ({
    ...product,
    // Add inventory fields with default values
    stock: Math.floor(Math.random() * 50) + 10, // Random stock between 10-60
    lowStockThreshold: 5,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }));
};

// Function to initialize products data if it doesn't exist
export const initializeProductsData = async () => {
  try {
    // Try to fetch existing products
    const response = await fetch('/api/admin/products?adminKey=kala-admin-2024');
    const result = await response.json();
    
    if (result.success && result.products.length === 0) {
      // No products exist, migrate from old data
      const migratedProducts = migrateProducts();
      
      for (const product of migratedProducts) {
        await fetch('/api/admin/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...product,
            adminKey: 'kala-admin-2024'
          })
        });
      }
      
      console.log('✅ Products migrated successfully');
    }
  } catch (error) {
    console.error('❌ Error migrating products:', error);
  }
};
