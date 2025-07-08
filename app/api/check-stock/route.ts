import { NextRequest, NextResponse } from 'next/server';
import { isProductInStock, getProductById } from '../../../utils/productStorage';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const productId = searchParams.get('productId');
  const quantity = searchParams.get('quantity');
  
  if (!productId) {
    return NextResponse.json({ 
      success: false, 
      message: 'Product ID is required' 
    }, { status: 400 });
  }
  
  try {
    const qty = quantity ? parseInt(quantity) : 1;
    const inStock = await isProductInStock(productId, qty);
    const product = await getProductById(productId);
    
    if (!product) {
      return NextResponse.json({ 
        success: false, 
        message: 'Product not found' 
      }, { status: 404 });
    }
    
    return NextResponse.json({ 
      success: true, 
      inStock,
      availableStock: product.stock,
      requestedQuantity: qty,
      productName: product.name
    });
    
  } catch (error) {
    console.error('Error checking stock:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Error checking stock' 
    }, { status: 500 });
  }
}
