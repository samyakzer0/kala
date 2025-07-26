import { NextRequest, NextResponse } from 'next/server';
import { updateProductStock, getLowStockProducts, isProductInStock, decreaseProductStock } from '../../../../lib/database';

const ADMIN_KEY = 'kala-admin-2024';

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { adminKey, productId, stock, action } = body;
    
    if (adminKey !== ADMIN_KEY) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }
    
    if (!productId || stock === undefined) {
      return NextResponse.json({ 
        success: false, 
        message: 'Product ID and stock are required' 
      }, { status: 400 });
    }
    
    let updatedProduct;
    
    if (action === 'decrease') {
      const success = await decreaseProductStock(productId, stock);
      if (!success) {
        return NextResponse.json({ 
          success: false, 
          message: 'Insufficient stock or product not found' 
        }, { status: 400 });
      }
      updatedProduct = { message: 'Stock decreased successfully' };
    } else {
      updatedProduct = await updateProductStock(productId, stock);
      if (!updatedProduct) {
        return NextResponse.json({ 
          success: false, 
          message: 'Product not found' 
        }, { status: 404 });
      }
    }
    
    return NextResponse.json({ 
      success: true, 
      product: updatedProduct,
      message: 'Stock updated successfully' 
    });
  } catch (error) {
    console.error('Error updating stock:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Error updating stock' 
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const adminKey = searchParams.get('adminKey');
  const action = searchParams.get('action');
  const productId = searchParams.get('productId');
  const quantity = searchParams.get('quantity');
  
  if (adminKey !== ADMIN_KEY) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    if (action === 'low-stock') {
      const lowStockProducts = await getLowStockProducts();
      return NextResponse.json({ 
        success: true, 
        products: lowStockProducts 
      });
    }
    
    if (action === 'check-stock' && productId) {
      const qty = quantity ? parseInt(quantity) : 1;
      const inStock = await isProductInStock(productId, qty);
      return NextResponse.json({ 
        success: true, 
        inStock,
        quantity: qty
      });
    }
    
    return NextResponse.json({ 
      success: false, 
      message: 'Invalid action or missing parameters' 
    }, { status: 400 });
    
  } catch (error) {
    console.error('Error checking stock:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Error checking stock' 
    }, { status: 500 });
  }
}
