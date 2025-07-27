import { NextResponse } from 'next/server';
import { ProductService } from '../../../../services/productService';
import { isSupabaseConfigured } from '../../../../lib/supabase';

export async function GET() {
  try {
    // Check configuration
    const isConfigured = isSupabaseConfigured();
    
    if (!isConfigured) {
      return NextResponse.json({
        success: false,
        message: 'Supabase is not properly configured',
        configured: false,
        environment: {
          USE_SUPABASE_DATABASE: process.env.USE_SUPABASE_DATABASE,
          NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Not Set',
          SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Set' : 'Not Set',
          NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Not Set',
        }
      });
    }

    // Try to fetch products
    const products = await ProductService.getAllProducts();
    
    return NextResponse.json({
      success: true,
      message: 'Supabase connection successful',
      configured: true,
      productCount: products.length,
      sampleProducts: products.slice(0, 3).map(p => ({
        id: p.id,
        name: p.name,
        category: p.category,
        price: p.price
      }))
    });

  } catch (error) {
    console.error('Database test failed:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Database connection failed',
        error: error instanceof Error ? error.message : 'Unknown error',
        configured: isSupabaseConfigured()
      },
      { status: 500 }
    );
  }
}
