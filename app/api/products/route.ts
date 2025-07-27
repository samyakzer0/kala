import { NextRequest, NextResponse } from 'next/server';
import { getAllProducts, getProductsByCategory, searchProducts } from '../../../lib/database';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const featured = searchParams.get('featured');
  const newProducts = searchParams.get('new');
  const bestsellers = searchParams.get('bestsellers');
  const search = searchParams.get('search');
  const active = searchParams.get('active');
  
  try {
    let products;
    
    if (search) {
      products = await searchProducts(search);
    } else if (category) {
      products = await getProductsByCategory(category);
    } else {
      products = await getAllProducts();
    }
    
    // Filter only active products for public API
    products = products.filter(product => active === 'false' ? true : product.isActive);
    
    // Apply filters
    if (featured === 'true') {
      products = products.filter(product => product.featured);
    }
    
    if (newProducts === 'true') {
      products = products.filter(product => product.new);
    }
    
    if (bestsellers === 'true') {
      products = products.filter(product => product.bestseller);
    }
    
    return NextResponse.json({ 
      success: true, 
      products: products
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Error fetching products' 
    }, { status: 500 });
  }
}
