import { promises as fs } from 'fs';
import path from 'path';

const ANALYTICS_FILE = path.join(process.cwd(), 'data', 'analytics.json');

export interface ProductAnalytics {
  productId: string;
  views: number;
  orders: number;
  lastViewed: string;
  lastOrdered?: string;
  popularityScore: number; // Calculated score based on views and orders
}

// Category analytics interface
export interface CategoryAnalytics {
  categoryId: string;
  views: number;
  lastViewed: string;
}

interface AnalyticsData {
  products: Record<string, ProductAnalytics>;
  categories: Record<string, CategoryAnalytics>;
  lastUpdated: string;
}

// Ensure analytics directory exists
async function ensureAnalyticsFile(): Promise<void> {
  const dataDir = path.dirname(ANALYTICS_FILE);
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }
  
  try {
    await fs.access(ANALYTICS_FILE);
  } catch {
    // Create initial analytics file
    const initialData: AnalyticsData = {
      products: {},
      categories: {},
      lastUpdated: new Date().toISOString()
    };
    await fs.writeFile(ANALYTICS_FILE, JSON.stringify(initialData, null, 2));
  }
}

// Load analytics data
async function loadAnalytics(): Promise<AnalyticsData> {
  try {
    await ensureAnalyticsFile();
    const data = await fs.readFile(ANALYTICS_FILE, 'utf-8');
    const parsedData = JSON.parse(data);
    
    // Ensure categories property exists for backward compatibility
    if (!parsedData.categories) {
      parsedData.categories = {};
    }
    
    return parsedData;
  } catch (error) {
    console.error('Error loading analytics:', error);
    return {
      products: {},
      categories: {},
      lastUpdated: new Date().toISOString()
    };
  }
}

// Save analytics data
async function saveAnalytics(data: AnalyticsData): Promise<void> {
  try {
    data.lastUpdated = new Date().toISOString();
    await fs.writeFile(ANALYTICS_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error saving analytics:', error);
  }
}

// Calculate popularity score (views * 1 + orders * 10)
function calculatePopularityScore(views: number, orders: number): number {
  return views + (orders * 10);
}

// Track product view
export async function trackProductView(productId: string): Promise<void> {
  try {
    const analytics = await loadAnalytics();
    const now = new Date().toISOString();
    
    if (analytics.products[productId]) {
      analytics.products[productId].views += 1;
      analytics.products[productId].lastViewed = now;
    } else {
      analytics.products[productId] = {
        productId,
        views: 1,
        orders: 0,
        lastViewed: now,
        popularityScore: 1
      };
    }
    
    // Recalculate popularity score
    const product = analytics.products[productId];
    product.popularityScore = calculatePopularityScore(product.views, product.orders);
    
    await saveAnalytics(analytics);
  } catch (error) {
    console.error('Error tracking product view:', error);
  }
}

// Track product order
export async function trackProductOrder(productId: string, quantity: number = 1): Promise<void> {
  try {
    const analytics = await loadAnalytics();
    const now = new Date().toISOString();
    
    if (analytics.products[productId]) {
      analytics.products[productId].orders += quantity;
      analytics.products[productId].lastOrdered = now;
    } else {
      analytics.products[productId] = {
        productId,
        views: 0,
        orders: quantity,
        lastViewed: now,
        lastOrdered: now,
        popularityScore: quantity * 10
      };
    }
    
    // Recalculate popularity score
    const product = analytics.products[productId];
    product.popularityScore = calculatePopularityScore(product.views, product.orders);
    
    await saveAnalytics(analytics);
  } catch (error) {
    console.error('Error tracking product order:', error);
  }
}

// Track category view
export async function trackCategoryView(categoryId: string): Promise<void> {
  try {
    const analytics = await loadAnalytics();
    const now = new Date().toISOString();
    
    if (analytics.categories[categoryId]) {
      analytics.categories[categoryId].views += 1;
      analytics.categories[categoryId].lastViewed = now;
    } else {
      analytics.categories[categoryId] = {
        categoryId,
        views: 1,
        lastViewed: now
      };
    }
    
    await saveAnalytics(analytics);
  } catch (error) {
    console.error('Error tracking category view:', error);
  }
}

// Get most popular products
export async function getMostPopularProducts(limit: number = 6): Promise<ProductAnalytics[]> {
  try {
    const analytics = await loadAnalytics();
    
    // Sort by popularity score (descending)
    const sortedProducts = Object.values(analytics.products)
      .sort((a, b) => b.popularityScore - a.popularityScore)
      .slice(0, limit);
    
    return sortedProducts;
  } catch (error) {
    console.error('Error getting popular products:', error);
    return [];
  }
}

// Get trending products (recently viewed/ordered)
export async function getTrendingProducts(limit: number = 6, daysBack: number = 7): Promise<ProductAnalytics[]> {
  try {
    const analytics = await loadAnalytics();
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysBack);
    
    // Filter products that have activity in the last 'daysBack' days
    const recentProducts = Object.values(analytics.products)
      .filter(product => {
        const lastActivity = product.lastOrdered || product.lastViewed;
        return new Date(lastActivity) > cutoffDate;
      })
      .sort((a, b) => b.popularityScore - a.popularityScore)
      .slice(0, limit);
    
    return recentProducts;
  } catch (error) {
    console.error('Error getting trending products:', error);
    return [];
  }
}

// Get most viewed categories
export async function getMostViewedCategories(limit: number = 4): Promise<CategoryAnalytics[]> {
  try {
    const analytics = await loadAnalytics();
    
    // Sort by views (descending)
    const sortedCategories = Object.values(analytics.categories || {})
      .sort((a, b) => b.views - a.views)
      .slice(0, limit);
    
    return sortedCategories;
  } catch (error) {
    console.error('Error getting popular categories:', error);
    return [];
  }
}

// Get analytics for a specific product
export async function getProductAnalytics(productId: string): Promise<ProductAnalytics | null> {
  try {
    const analytics = await loadAnalytics();
    return analytics.products[productId] || null;
  } catch (error) {
    console.error('Error getting product analytics:', error);
    return null;
  }
}

// Get overall analytics summary
export async function getAnalyticsSummary(): Promise<{
  totalProducts: number;
  totalViews: number;
  totalOrders: number;
  mostPopular: ProductAnalytics | null;
}> {
  try {
    const analytics = await loadAnalytics();
    const products = Object.values(analytics.products);
    
    const totalViews = products.reduce((sum, p) => sum + p.views, 0);
    const totalOrders = products.reduce((sum, p) => sum + p.orders, 0);
    const mostPopular = products.length > 0 
      ? products.reduce((max, p) => p.popularityScore > max.popularityScore ? p : max)
      : null;
    
    return {
      totalProducts: products.length,
      totalViews,
      totalOrders,
      mostPopular
    };
  } catch (error) {
    console.error('Error getting analytics summary:', error);
    return {
      totalProducts: 0,
      totalViews: 0,
      totalOrders: 0,
      mostPopular: null
    };
  }
}
