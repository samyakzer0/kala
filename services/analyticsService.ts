import { supabaseAdmin, isSupabaseConfigured, Database } from '../lib/supabase';

// Analytics interfaces to match current structure
export interface ProductAnalytics {
  productId: string;
  views: number;
  orders: number;
  lastViewed: string;
  lastOrdered?: string;
  popularityScore: number;
}

export interface CategoryAnalytics {
  categoryId: string;
  views: number;
  lastViewed: string;
}

// Analytics service class for Supabase operations
export class AnalyticsService {
  private static isConfigured = isSupabaseConfigured();

  // Calculate popularity score
  private static calculatePopularityScore(views: number, orders: number): number {
    return (views * 1) + (orders * 10);
  }

  // Track product view
  static async trackProductView(productId: string): Promise<void> {
    if (!this.isConfigured) {
      console.warn('Supabase not configured, skipping analytics tracking');
      return;
    }

    try {
      const now = new Date().toISOString();

      // Check if analytics record exists for this product
      const { data: existing, error: fetchError } = await supabaseAdmin
        .from('analytics')
        .select('*')
        .eq('entity_id', productId)
        .eq('entity_type', 'product')
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('Error fetching existing analytics:', fetchError);
        return;
      }

      if (existing) {
        // Update existing record
        const newViews = existing.views + 1;
        const newPopularityScore = this.calculatePopularityScore(newViews, existing.orders);

        const { error: updateError } = await supabaseAdmin
          .from('analytics')
          .update({
            views: newViews,
            last_viewed: now,
            popularity_score: newPopularityScore,
            updated_at: now,
          })
          .eq('id', existing.id);

        if (updateError) {
          console.error('Error updating product view analytics:', updateError);
        }
      } else {
        // Create new record
        const { error: insertError } = await supabaseAdmin
          .from('analytics')
          .insert({
            entity_id: productId,
            entity_type: 'product',
            views: 1,
            orders: 0,
            last_viewed: now,
            popularity_score: this.calculatePopularityScore(1, 0),
            created_at: now,
            updated_at: now,
          });

        if (insertError) {
          console.error('Error creating product view analytics:', insertError);
        }
      }
    } catch (error) {
      console.error('Error tracking product view:', error);
    }
  }

  // Track product order
  static async trackProductOrder(productId: string, quantity: number = 1): Promise<void> {
    if (!this.isConfigured) {
      console.warn('Supabase not configured, skipping analytics tracking');
      return;
    }

    try {
      const now = new Date().toISOString();

      // Check if analytics record exists for this product
      const { data: existing, error: fetchError } = await supabaseAdmin
        .from('analytics')
        .select('*')
        .eq('entity_id', productId)
        .eq('entity_type', 'product')
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('Error fetching existing analytics:', fetchError);
        return;
      }

      if (existing) {
        // Update existing record
        const newOrders = existing.orders + quantity;
        const newPopularityScore = this.calculatePopularityScore(existing.views, newOrders);

        const { error: updateError } = await supabaseAdmin
          .from('analytics')
          .update({
            orders: newOrders,
            last_ordered: now,
            popularity_score: newPopularityScore,
            updated_at: now,
          })
          .eq('id', existing.id);

        if (updateError) {
          console.error('Error updating product order analytics:', updateError);
        }
      } else {
        // Create new record
        const { error: insertError } = await supabaseAdmin
          .from('analytics')
          .insert({
            entity_id: productId,
            entity_type: 'product',
            views: 0,
            orders: quantity,
            last_ordered: now,
            popularity_score: this.calculatePopularityScore(0, quantity),
            created_at: now,
            updated_at: now,
          });

        if (insertError) {
          console.error('Error creating product order analytics:', insertError);
        }
      }
    } catch (error) {
      console.error('Error tracking product order:', error);
    }
  }

  // Track category view
  static async trackCategoryView(categoryId: string): Promise<void> {
    if (!this.isConfigured) {
      console.warn('Supabase not configured, skipping analytics tracking');
      return;
    }

    try {
      const now = new Date().toISOString();

      // Check if analytics record exists for this category
      const { data: existing, error: fetchError } = await supabaseAdmin
        .from('analytics')
        .select('*')
        .eq('entity_id', categoryId)
        .eq('entity_type', 'category')
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('Error fetching existing category analytics:', fetchError);
        return;
      }

      if (existing) {
        // Update existing record
        const { error: updateError } = await supabaseAdmin
          .from('analytics')
          .update({
            views: existing.views + 1,
            last_viewed: now,
            updated_at: now,
          })
          .eq('id', existing.id);

        if (updateError) {
          console.error('Error updating category view analytics:', updateError);
        }
      } else {
        // Create new record
        const { error: insertError } = await supabaseAdmin
          .from('analytics')
          .insert({
            entity_id: categoryId,
            entity_type: 'category',
            views: 1,
            orders: 0,
            last_viewed: now,
            popularity_score: 1,
            created_at: now,
            updated_at: now,
          });

        if (insertError) {
          console.error('Error creating category view analytics:', insertError);
        }
      }
    } catch (error) {
      console.error('Error tracking category view:', error);
    }
  }

  // Get popular products
  static async getPopularProducts(limit: number = 10): Promise<ProductAnalytics[]> {
    if (!this.isConfigured) {
      throw new Error('Supabase is not properly configured');
    }

    try {
      const { data, error } = await supabaseAdmin
        .from('analytics')
        .select('*')
        .eq('entity_type', 'product')
        .order('popularity_score', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching popular products:', error);
        throw new Error(`Failed to fetch popular products: ${error.message}`);
      }

      return data.map(item => ({
        productId: item.entity_id,
        views: item.views,
        orders: item.orders,
        lastViewed: item.last_viewed || '',
        lastOrdered: item.last_ordered,
        popularityScore: item.popularity_score,
      }));
    } catch (error) {
      console.error('Popular products fetch failed:', error);
      throw error;
    }
  }

  // Get popular categories
  static async getPopularCategories(limit: number = 10): Promise<CategoryAnalytics[]> {
    if (!this.isConfigured) {
      throw new Error('Supabase is not properly configured');
    }

    try {
      const { data, error } = await supabaseAdmin
        .from('analytics')
        .select('*')
        .eq('entity_type', 'category')
        .order('views', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching popular categories:', error);
        throw new Error(`Failed to fetch popular categories: ${error.message}`);
      }

      return data.map(item => ({
        categoryId: item.entity_id,
        views: item.views,
        lastViewed: item.last_viewed || '',
      }));
    } catch (error) {
      console.error('Popular categories fetch failed:', error);
      throw error;
    }
  }

  // Get product analytics by ID
  static async getProductAnalytics(productId: string): Promise<ProductAnalytics | null> {
    if (!this.isConfigured) {
      throw new Error('Supabase is not properly configured');
    }

    try {
      const { data, error } = await supabaseAdmin
        .from('analytics')
        .select('*')
        .eq('entity_id', productId)
        .eq('entity_type', 'product')
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null; // Analytics not found
        }
        console.error('Error fetching product analytics:', error);
        throw new Error(`Failed to fetch product analytics: ${error.message}`);
      }

      return {
        productId: data.entity_id,
        views: data.views,
        orders: data.orders,
        lastViewed: data.last_viewed || '',
        lastOrdered: data.last_ordered,
        popularityScore: data.popularity_score,
      };
    } catch (error) {
      console.error('Product analytics fetch failed:', error);
      throw error;
    }
  }

  // Clear all analytics data
  static async clearAnalytics(): Promise<void> {
    if (!this.isConfigured) {
      throw new Error('Supabase is not properly configured');
    }

    try {
      const { error } = await supabaseAdmin
        .from('analytics')
        .delete()
        .neq('id', ''); // Delete all records

      if (error) {
        console.error('Error clearing analytics:', error);
        throw new Error(`Failed to clear analytics: ${error.message}`);
      }
    } catch (error) {
      console.error('Analytics clear failed:', error);
      throw error;
    }
  }
}

// Legacy function exports for backward compatibility
export async function trackProductView(productId: string): Promise<void> {
  return AnalyticsService.trackProductView(productId);
}

export async function trackProductOrder(productId: string, quantity: number = 1): Promise<void> {
  return AnalyticsService.trackProductOrder(productId, quantity);
}

export async function trackCategoryView(categoryId: string): Promise<void> {
  return AnalyticsService.trackCategoryView(categoryId);
}

export async function getPopularProducts(limit: number = 10): Promise<ProductAnalytics[]> {
  return AnalyticsService.getPopularProducts(limit);
}

export async function getPopularCategories(limit: number = 10): Promise<CategoryAnalytics[]> {
  return AnalyticsService.getPopularCategories(limit);
}

export async function getProductAnalytics(productId: string): Promise<ProductAnalytics | null> {
  return AnalyticsService.getProductAnalytics(productId);
}

export async function clearAnalytics(): Promise<void> {
  return AnalyticsService.clearAnalytics();
}
