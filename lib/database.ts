// Database adapter that switches between JSON files and Supabase based on configuration
import { Order } from '../types/order';
import { Product, ProductFormData } from '../types/product';
import { ProductAnalytics, CategoryAnalytics } from '../services/analyticsService';

// Check if Supabase should be used
const shouldUseSupabase = (): boolean => {
  return process.env.USE_SUPABASE_DATABASE === 'true';
};

// Dynamic imports to avoid loading both systems
const getOrderService = async () => {
  if (shouldUseSupabase()) {
    const { OrderService } = await import('../services/orderService');
    return OrderService;
  } else {
    const orderStorage = await import('../utils/orderStorage');
    return orderStorage;
  }
};

const getProductService = async () => {
  if (shouldUseSupabase()) {
    const { ProductService } = await import('../services/productService');
    return ProductService;
  } else {
    const productStorage = await import('../utils/productStorage');
    return productStorage;
  }
};

const getAnalyticsService = async () => {
  if (shouldUseSupabase()) {
    const { AnalyticsService } = await import('../services/analyticsService');
    return AnalyticsService;
  } else {
    const analytics = await import('../utils/analytics');
    return analytics;
  }
};

// ====================================
// ORDER OPERATIONS
// ====================================

export async function createOrder(order: Order): Promise<Order> {
  const service = await getOrderService();
  return service.createOrder(order);
}

export async function getOrderById(orderId: string): Promise<Order | null> {
  const service = await getOrderService();
  return service.getOrderById(orderId);
}

export async function updateOrderStatus(
  orderId: string,
  status: Order['status'],
  additionalFields?: {
    adminNotes?: string;
    approvedAt?: string;
    deliveredAt?: string;
    deliveryNotes?: string;
  }
): Promise<Order | null> {
  const service = await getOrderService();
  return service.updateOrderStatus(orderId, status, additionalFields);
}

export async function updateOrderShipping(
  orderId: string,
  shippingInfo: {
    trackingId: string;
    provider: string;
    shippingMethod?: string;
    estimatedDelivery?: string;
  }
): Promise<Order | null> {
  const service = await getOrderService();
  return service.updateOrderShipping(orderId, shippingInfo);
}

export async function getAllOrders(): Promise<Order[]> {
  const service = await getOrderService();
  return service.getAllOrders();
}

export async function getOrdersByStatus(status: Order['status']): Promise<Order[]> {
  const service = await getOrderService();
  return service.getOrdersByStatus(status);
}

export async function getOrdersByCustomerEmail(email: string): Promise<Order[]> {
  const service = await getOrderService();
  return service.getOrdersByCustomerEmail(email);
}

export async function deleteOrder(orderId: string): Promise<boolean> {
  const service = await getOrderService();
  return service.deleteOrder(orderId);
}

export async function getOrderStats(): Promise<{
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  shipped: number;
  delivered: number;
  totalRevenue: number;
  averageOrderValue: number;
}> {
  const service = await getOrderService();
  return service.getOrderStats();
}

// ====================================
// PRODUCT OPERATIONS
// ====================================

export async function createProduct(productData: ProductFormData, imageFile?: File): Promise<Product> {
  const service = await getProductService();
  return service.createProduct(productData, imageFile);
}

export async function getAllProducts(): Promise<Product[]> {
  const service = await getProductService();
  return service.getAllProducts();
}

export async function getProductById(productId: string): Promise<Product | null> {
  const service = await getProductService();
  return service.getProductById(productId);
}

export async function updateProduct(productId: string, updates: Partial<ProductFormData>): Promise<Product | null> {
  const service = await getProductService();
  return service.updateProduct(productId, updates);
}

export async function updateProductStock(productId: string, newStock: number): Promise<Product | null> {
  const service = await getProductService();
  return service.updateProductStock(productId, newStock);
}

export async function decreaseProductStock(productId: string, quantity: number): Promise<boolean> {
  const service = await getProductService();
  return service.decreaseProductStock(productId, quantity);
}

export async function isProductInStock(productId: string, quantity: number = 1): Promise<boolean> {
  const service = await getProductService();
  return service.isProductInStock(productId, quantity);
}

export async function getLowStockProducts(): Promise<Product[]> {
  const service = await getProductService();
  return service.getLowStockProducts();
}

export async function deleteProduct(productId: string): Promise<boolean> {
  const service = await getProductService();
  return service.deleteProduct(productId);
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
  const service = await getProductService();
  return service.getProductsByCategory(category);
}

export async function searchProducts(query: string): Promise<Product[]> {
  const service = await getProductService();
  return service.searchProducts(query);
}

export async function getInventoryStats(): Promise<{
  totalProducts: number;
  activeProducts: number;
  lowStockProducts: number;
  outOfStockProducts: number;
  totalStockValue: number;
  categories: { [key: string]: number };
}> {
  const service = await getProductService();
  return service.getInventoryStats();
}

// ====================================
// ANALYTICS OPERATIONS
// ====================================

export async function trackProductView(productId: string): Promise<void> {
  const service = await getAnalyticsService();
  return service.trackProductView(productId);
}

export async function trackProductOrder(productId: string, quantity: number = 1): Promise<void> {
  const service = await getAnalyticsService();
  return service.trackProductOrder(productId, quantity);
}

export async function trackCategoryView(categoryId: string): Promise<void> {
  const service = await getAnalyticsService();
  return service.trackCategoryView(categoryId);
}

export async function getPopularProducts(limit: number = 10): Promise<ProductAnalytics[]> {
  const service = await getAnalyticsService();
  return service.getPopularProducts(limit);
}

export async function getPopularCategories(limit: number = 10): Promise<CategoryAnalytics[]> {
  const service = await getAnalyticsService();
  return service.getPopularCategories(limit);
}

// ====================================
// DATABASE INFO
// ====================================

export async function getDatabaseInfo(): Promise<{
  type: 'json' | 'supabase';
  configured: boolean;
  description: string;
}> {
  if (shouldUseSupabase()) {
    const { isSupabaseConfigured } = await import('../lib/supabase');
    return {
      type: 'supabase',
      configured: isSupabaseConfigured(),
      description: 'Using Supabase PostgreSQL database'
    };
  } else {
    return {
      type: 'json',
      configured: true,
      description: 'Using JSON file storage'
    };
  }
}

// Auto-migration function
export async function runAutoMigrationIfNeeded(): Promise<void> {
  // Only run if auto-migration is enabled and we're switching to Supabase
  if (process.env.AUTO_MIGRATE_TO_SUPABASE === 'true' && shouldUseSupabase()) {
    try {
      const { DatabaseMigration } = await import('../scripts/migrate-to-supabase');
      const migrationStatus = await DatabaseMigration.isMigrationNeeded();
      
      if (migrationStatus.canMigrate) {
        console.log('🔄 Running automatic migration to Supabase...');
        await DatabaseMigration.runFullMigration();
        console.log('✅ Automatic migration completed');
      }
    } catch (error) {
      console.error('❌ Auto-migration failed:', error);
      // Don't throw - let the app continue with current database
    }
  }
}
