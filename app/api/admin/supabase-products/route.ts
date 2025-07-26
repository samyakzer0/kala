import { NextRequest, NextResponse } from 'next/server';
import { ProductService } from '../../../../services/productService';

export async function GET(request: NextRequest) {
  try {
    const products = await ProductService.getAllProducts();
    
    return NextResponse.json({
      success: true,
      count: products.length,
      products: products,
      message: `Found ${products.length} products in Supabase database`
    });

  } catch (error) {
    console.error('Error fetching products from Supabase:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to fetch products from Supabase',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
