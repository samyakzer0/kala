import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Client for browser usage (anon key) - only create if configured
export const supabaseClient = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Admin client for server-side operations (service role key) - only create if configured
export const supabaseAdmin = supabaseUrl && supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  : null;

// Database types based on our current data models
export interface Database {
  public: {
    Tables: {
      orders: {
        Row: {
          id: string;
          customer_data: CustomerData;
          items: OrderItem[];
          subtotal: number;
          status: OrderStatus;
          admin_notes?: string;
          approved_at?: string;
          delivered_at?: string;
          delivery_notes?: string;
          shipping?: ShippingInfo;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          customer_data: CustomerData;
          items: OrderItem[];
          subtotal: number;
          status?: OrderStatus;
          admin_notes?: string;
          approved_at?: string;
          delivered_at?: string;
          delivery_notes?: string;
          shipping?: ShippingInfo;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          customer_data?: CustomerData;
          items?: OrderItem[];
          subtotal?: number;
          status?: OrderStatus;
          admin_notes?: string;
          approved_at?: string;
          delivered_at?: string;
          delivery_notes?: string;
          shipping?: ShippingInfo;
          updated_at?: string;
        };
      };
      products: {
        Row: {
          id: string;
          name: string;
          price: number;
          category: string;
          subcategory?: string;
          gem_color?: string;
          description: string;
          featured: boolean;
          new: boolean;
          bestseller: boolean;
          image?: string;
          stock: number;
          low_stock_threshold: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          price: number;
          category: string;
          subcategory?: string;
          gem_color?: string;
          description: string;
          featured?: boolean;
          new?: boolean;
          bestseller?: boolean;
          image?: string;
          stock: number;
          low_stock_threshold?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          price?: number;
          category?: string;
          subcategory?: string;
          gem_color?: string;
          description?: string;
          featured?: boolean;
          new?: boolean;
          bestseller?: boolean;
          image?: string;
          stock?: number;
          low_stock_threshold?: number;
          is_active?: boolean;
          updated_at?: string;
        };
      };
      analytics: {
        Row: {
          id: string;
          entity_id: string;
          entity_type: 'product' | 'category';
          views: number;
          orders: number;
          last_viewed?: string;
          last_ordered?: string;
          popularity_score: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          entity_id: string;
          entity_type: 'product' | 'category';
          views?: number;
          orders?: number;
          last_viewed?: string;
          last_ordered?: string;
          popularity_score?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          entity_id?: string;
          entity_type?: 'product' | 'category';
          views?: number;
          orders?: number;
          last_viewed?: string;
          last_ordered?: string;
          popularity_score?: number;
          updated_at?: string;
        };
      };
    };
  };
}

// Type definitions matching our current models
export type OrderStatus = 'pending' | 'approved' | 'rejected' | 'shipped' | 'delivered';

export interface CustomerData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  category: string;
}

export interface ShippingInfo {
  trackingId?: string;
  provider?: string;
  shippingMethod?: string;
  estimatedDelivery?: string;
  shippedAt?: string;
}

// Helper function to check if Supabase is properly configured
export function isSupabaseConfigured(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

// Environment validation
export function validateSupabaseConfig(): {
  isValid: boolean;
  missing: string[];
} {
  const missing: string[] = [];
  
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    missing.push('NEXT_PUBLIC_SUPABASE_URL');
  }
  
  if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    missing.push('NEXT_PUBLIC_SUPABASE_ANON_KEY');
  }
  
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    missing.push('SUPABASE_SERVICE_ROLE_KEY');
  }
  
  return {
    isValid: missing.length === 0,
    missing
  };
}
