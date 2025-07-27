import { NextResponse } from 'next/server';
import { getAllProducts } from '../../../../lib/database';

export async function GET() {
  try {
    const products = await getAllProducts();
    
    // Group products by category for debugging
    const productsByCategory = products.reduce((acc, product) => {
      if (!acc[product.category]) {
        acc[product.category] = [];
      }
      acc[product.category].push({
        id: product.id,
        name: product.name,
        category: product.category,
        subcategory: product.subcategory,
        isActive: product.isActive,
        stock: product.stock
      });
      return acc;
    }, {} as Record<string, any[]>);
    
    return NextResponse.json({
      success: true,
      totalProducts: products.length,
      productsByCategory,
      allProducts: products.map(p => ({
        id: p.id,
        name: p.name,
        category: p.category,
        subcategory: p.subcategory,
        isActive: p.isActive,
        stock: p.stock
      }))
    });

  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to fetch products',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
