import { promises as fs } from 'fs';
import path from 'path';

// Load environment variables for standalone execution
import { config } from 'dotenv';
config({ path: path.join(process.cwd(), '.env.local') });
config({ path: path.join(process.cwd(), '.env') });

import { supabaseAdmin, isSupabaseConfigured } from '../lib/supabase';
import { Order } from '../types/order';
import { Product } from '../types/product';

// Migration utility class
export class DatabaseMigration {
  private static dataDir = path.join(process.cwd(), 'data');

  // Check if migration is needed (JSON files exist and Supabase is configured)
  static async isMigrationNeeded(): Promise<{
    canMigrate: boolean;
    hasOrders: boolean;
    hasProducts: boolean;
    hasAnalytics: boolean;
    supabaseConfigured: boolean;
  }> {
    const supabaseConfigured = isSupabaseConfigured();
    let hasOrders = false;
    let hasProducts = false;
    let hasAnalytics = false;

    try {
      // Check for orders.json
      const ordersPath = path.join(this.dataDir, 'orders.json');
      await fs.access(ordersPath);
      const ordersData = await fs.readFile(ordersPath, 'utf-8');
      const orders = JSON.parse(ordersData);
      hasOrders = Array.isArray(orders) && orders.length > 0;
    } catch {
      // File doesn't exist or is empty
    }

    try {
      // Check for products.json
      const productsPath = path.join(this.dataDir, 'products.json');
      await fs.access(productsPath);
      const productsData = await fs.readFile(productsPath, 'utf-8');
      const products = JSON.parse(productsData);
      hasProducts = Array.isArray(products) && products.length > 0;
    } catch {
      // File doesn't exist or is empty
    }

    try {
      // Check for analytics.json
      const analyticsPath = path.join(this.dataDir, 'analytics.json');
      await fs.access(analyticsPath);
      const analyticsData = await fs.readFile(analyticsPath, 'utf-8');
      const analytics = JSON.parse(analyticsData);
      hasAnalytics = analytics && (analytics.products || analytics.categories);
    } catch {
      // File doesn't exist or is empty
    }

    return {
      canMigrate: supabaseConfigured && (hasOrders || hasProducts || hasAnalytics),
      hasOrders,
      hasProducts,
      hasAnalytics,
      supabaseConfigured,
    };
  }

  // Migrate orders from JSON to Supabase
  static async migrateOrders(): Promise<{ success: boolean; migrated: number; errors: string[] }> {
    const errors: string[] = [];
    let migrated = 0;

    if (!supabaseAdmin) {
      return { success: false, migrated: 0, errors: ['Supabase admin client not configured'] };
    }

    try {
      const ordersPath = path.join(this.dataDir, 'orders.json');
      const ordersData = await fs.readFile(ordersPath, 'utf-8');
      const orders: Order[] = JSON.parse(ordersData);

      console.log(`📦 Migrating ${orders.length} orders to Supabase...`);

      for (const order of orders) {
        try {
          const { error } = await supabaseAdmin
            .from('orders')
            .insert({
              id: order.id,
              customer_data: order.customer,
              items: order.items,
              subtotal: order.subtotal,
              status: order.status,
              admin_notes: order.adminNotes,
              approved_at: order.approvedAt,
              delivered_at: order.deliveredAt,
              delivery_notes: order.deliveryNotes,
              shipping: order.shipping,
              created_at: order.createdAt,
              updated_at: order.createdAt, // Use createdAt as initial updatedAt
            });

          if (error) {
            errors.push(`Order ${order.id}: ${error.message}`);
          } else {
            migrated++;
            console.log(`✅ Migrated order: ${order.id}`);
          }
        } catch (err) {
          errors.push(`Order ${order.id}: ${err instanceof Error ? err.message : 'Unknown error'}`);
        }
      }

      console.log(`📦 Orders migration completed: ${migrated}/${orders.length} successful`);
      return { success: errors.length === 0, migrated, errors };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to read orders file';
      console.error('❌ Orders migration failed:', errorMessage);
      return { success: false, migrated: 0, errors: [errorMessage] };
    }
  }

  // Migrate products from JSON to Supabase
  static async migrateProducts(): Promise<{ success: boolean; migrated: number; errors: string[] }> {
    const errors: string[] = [];
    let migrated = 0;

    if (!supabaseAdmin) {
      return { success: false, migrated: 0, errors: ['Supabase admin client not configured'] };
    }

    try {
      const productsPath = path.join(this.dataDir, 'products.json');
      const productsData = await fs.readFile(productsPath, 'utf-8');
      const products: Product[] = JSON.parse(productsData);

      console.log(`🛍️ Migrating ${products.length} products to Supabase...`);

      for (const product of products) {
        try {
          const { error } = await supabaseAdmin
            .from('products')
            .insert({
              id: product.id,
              name: product.name,
              price: product.price,
              category: product.category,
              subcategory: product.subcategory,
              gem_color: product.gemColor,
              description: product.description,
              featured: product.featured || false,
              new: product.new || false,
              bestseller: product.bestseller || false,
              image: product.image,
              stock: product.stock,
              low_stock_threshold: product.lowStockThreshold || 5,
              is_active: product.isActive !== false,
              created_at: product.createdAt,
              updated_at: product.updatedAt || product.createdAt,
            });

          if (error) {
            errors.push(`Product ${product.id}: ${error.message}`);
          } else {
            migrated++;
            console.log(`✅ Migrated product: ${product.name}`);
          }
        } catch (err) {
          errors.push(`Product ${product.id}: ${err instanceof Error ? err.message : 'Unknown error'}`);
        }
      }

      console.log(`🛍️ Products migration completed: ${migrated}/${products.length} successful`);
      return { success: errors.length === 0, migrated, errors };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to read products file';
      console.error('❌ Products migration failed:', errorMessage);
      return { success: false, migrated: 0, errors: [errorMessage] };
    }
  }

  // Migrate analytics from JSON to Supabase
  static async migrateAnalytics(): Promise<{ success: boolean; migrated: number; errors: string[] }> {
    const errors: string[] = [];
    let migrated = 0;

    if (!supabaseAdmin) {
      return { success: false, migrated: 0, errors: ['Supabase admin client not configured'] };
    }

    try {
      const analyticsPath = path.join(this.dataDir, 'analytics.json');
      const analyticsData = await fs.readFile(analyticsPath, 'utf-8');
      const analytics = JSON.parse(analyticsData);

      console.log('📊 Migrating analytics data to Supabase...');

      // Migrate product analytics
      if (analytics.products) {
        const productAnalytics = Object.values(analytics.products) as any[];
        console.log(`📈 Migrating ${productAnalytics.length} product analytics...`);

        for (const productAnalytic of productAnalytics) {
          try {
            const { error } = await supabaseAdmin
              .from('analytics')
              .insert({
                entity_id: productAnalytic.productId,
                entity_type: 'product',
                views: productAnalytic.views || 0,
                orders: productAnalytic.orders || 0,
                last_viewed: productAnalytic.lastViewed,
                last_ordered: productAnalytic.lastOrdered,
                popularity_score: productAnalytic.popularityScore || 0,
                created_at: productAnalytic.lastViewed || new Date().toISOString(),
                updated_at: new Date().toISOString(),
              });

            if (error) {
              errors.push(`Product analytics ${productAnalytic.productId}: ${error.message}`);
            } else {
              migrated++;
              console.log(`✅ Migrated product analytics: ${productAnalytic.productId}`);
            }
          } catch (err) {
            errors.push(`Product analytics ${productAnalytic.productId}: ${err instanceof Error ? err.message : 'Unknown error'}`);
          }
        }
      }

      // Migrate category analytics
      if (analytics.categories) {
        const categoryAnalytics = Object.values(analytics.categories) as any[];
        console.log(`📂 Migrating ${categoryAnalytics.length} category analytics...`);

        for (const categoryAnalytic of categoryAnalytics) {
          try {
            const { error } = await supabaseAdmin
              .from('analytics')
              .insert({
                entity_id: categoryAnalytic.categoryId,
                entity_type: 'category',
                views: categoryAnalytic.views || 0,
                orders: 0,
                last_viewed: categoryAnalytic.lastViewed,
                popularity_score: categoryAnalytic.views || 0,
                created_at: categoryAnalytic.lastViewed || new Date().toISOString(),
                updated_at: new Date().toISOString(),
              });

            if (error) {
              errors.push(`Category analytics ${categoryAnalytic.categoryId}: ${error.message}`);
            } else {
              migrated++;
              console.log(`✅ Migrated category analytics: ${categoryAnalytic.categoryId}`);
            }
          } catch (err) {
            errors.push(`Category analytics ${categoryAnalytic.categoryId}: ${err instanceof Error ? err.message : 'Unknown error'}`);
          }
        }
      }

      console.log(`📊 Analytics migration completed: ${migrated} records successful`);
      return { success: errors.length === 0, migrated, errors };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to read analytics file';
      console.error('❌ Analytics migration failed:', errorMessage);
      return { success: false, migrated: 0, errors: [errorMessage] };
    }
  }

  // Run complete migration
  static async runFullMigration(): Promise<{
    success: boolean;
    results: {
      orders: { success: boolean; migrated: number; errors: string[] };
      products: { success: boolean; migrated: number; errors: string[] };
      analytics: { success: boolean; migrated: number; errors: string[] };
    };
  }> {
    console.log('🚀 Starting full database migration to Supabase...');

    if (!isSupabaseConfigured()) {
      throw new Error('Supabase is not properly configured. Please check your environment variables.');
    }

    const migrationStatus = await this.isMigrationNeeded();
    if (!migrationStatus.canMigrate) {
      throw new Error('Migration not possible. Check Supabase configuration and data files.');
    }

    const results = {
      orders: { success: true, migrated: 0, errors: [] as string[] },
      products: { success: true, migrated: 0, errors: [] as string[] },
      analytics: { success: true, migrated: 0, errors: [] as string[] },
    };

    // Migrate orders
    if (migrationStatus.hasOrders) {
      results.orders = await this.migrateOrders();
    } else {
      console.log('📦 No orders to migrate');
    }

    // Migrate products
    if (migrationStatus.hasProducts) {
      results.products = await this.migrateProducts();
    } else {
      console.log('🛍️ No products to migrate');
    }

    // Migrate analytics
    if (migrationStatus.hasAnalytics) {
      results.analytics = await this.migrateAnalytics();
    } else {
      console.log('📊 No analytics to migrate');
    }

    const overallSuccess = results.orders.success && results.products.success && results.analytics.success;

    console.log('🎉 Migration Summary:');
    console.log(`📦 Orders: ${results.orders.migrated} migrated, ${results.orders.errors.length} errors`);
    console.log(`🛍️ Products: ${results.products.migrated} migrated, ${results.products.errors.length} errors`);
    console.log(`📊 Analytics: ${results.analytics.migrated} migrated, ${results.analytics.errors.length} errors`);
    console.log(`Overall Status: ${overallSuccess ? '✅ SUCCESS' : '❌ PARTIAL SUCCESS'}`);

    return { success: overallSuccess, results };
  }

  // Create backup of JSON files before migration
  static async createBackup(): Promise<void> {
    const backupDir = path.join(process.cwd(), 'data', 'backup');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');

    try {
      await fs.mkdir(backupDir, { recursive: true });

      const files = ['orders.json', 'products.json', 'analytics.json'];
      
      for (const file of files) {
        try {
          const sourcePath = path.join(this.dataDir, file);
          const backupPath = path.join(backupDir, `${timestamp}-${file}`);
          
          await fs.access(sourcePath);
          await fs.copyFile(sourcePath, backupPath);
          console.log(`✅ Backed up ${file} to ${backupPath}`);
        } catch {
          // File doesn't exist, skip
          console.log(`⚠️ ${file} not found, skipping backup`);
        }
      }

      console.log(`📁 Backup completed in: ${backupDir}`);
    } catch (error) {
      console.error('❌ Backup failed:', error);
      throw error;
    }
  }
}

// Standalone migration script
export async function migrateDatabaseToSupabase(): Promise<void> {
  try {
    console.log('🔄 Kala Jewelry Database Migration to Supabase');
    console.log('================================================');

    // Create backup first
    console.log('📁 Creating backup of existing data...');
    await DatabaseMigration.createBackup();

    // Run migration
    const result = await DatabaseMigration.runFullMigration();

    if (result.success) {
      console.log('🎉 Migration completed successfully!');
      console.log('');
      console.log('Next steps:');
      console.log('1. Update your API routes to use the new services');
      console.log('2. Test the application thoroughly');
      console.log('3. Remove or archive the old JSON files');
    } else {
      console.log('⚠️ Migration completed with some errors. Check the logs above.');
    }

  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  }
}
