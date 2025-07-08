import { NextRequest, NextResponse } from 'next/server';
import { getAllProducts, createProduct, updateProduct, deleteProduct, getInventoryStats } from '../../../../utils/productStorage';
import { validateAdminKey, getClientIP } from '../../../../utils/auth';
import { validateProductData } from '../../../../utils/validation';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const adminKey = searchParams.get('adminKey');
  const clientIP = getClientIP(request);
  
  try {
    if (!validateAdminKey(adminKey || '', clientIP)) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      message: error instanceof Error ? error.message : 'Authentication failed' 
    }, { status: 429 });
  }
  
  try {
    const products = await getAllProducts();
    const stats = await getInventoryStats();
    
    return NextResponse.json({ 
      success: true, 
      products,
      stats
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Error fetching products' 
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { adminKey, ...productData } = body;
    const clientIP = getClientIP(request);
    
    // Validate admin authentication
    try {
      if (!validateAdminKey(adminKey || '', clientIP)) {
        return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
      }
    } catch (error) {
      return NextResponse.json({ 
        success: false, 
        message: error instanceof Error ? error.message : 'Authentication failed' 
      }, { status: 429 });
    }
    
    // Validate and sanitize product data
    let validatedData;
    try {
      validatedData = validateProductData(productData);
    } catch (error) {
      return NextResponse.json({ 
        success: false, 
        message: error instanceof Error ? error.message : 'Validation failed' 
      }, { status: 400 });
    }
    
    const newProduct = await createProduct(validatedData);
    
    return NextResponse.json({ 
      success: true, 
      product: newProduct,
      message: 'Product created successfully' 
    });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Error creating product' 
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { adminKey, productId, ...updates } = body;
    const clientIP = getClientIP(request);
    
    // Validate admin authentication
    try {
      if (!validateAdminKey(adminKey || '', clientIP)) {
        return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
      }
    } catch (error) {
      return NextResponse.json({ 
        success: false, 
        message: error instanceof Error ? error.message : 'Authentication failed' 
      }, { status: 429 });
    }
    
    if (!productId) {
      return NextResponse.json({ 
        success: false, 
        message: 'Product ID is required' 
      }, { status: 400 });
    }
    
    const updatedProduct = await updateProduct(productId, updates);
    
    if (!updatedProduct) {
      return NextResponse.json({ 
        success: false, 
        message: 'Product not found' 
      }, { status: 404 });
    }
    
    return NextResponse.json({ 
      success: true, 
      product: updatedProduct,
      message: 'Product updated successfully' 
    });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Error updating product' 
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const adminKey = searchParams.get('adminKey');
    const productId = searchParams.get('productId');
    const clientIP = getClientIP(request);
    
    // Validate admin authentication
    try {
      if (!validateAdminKey(adminKey || '', clientIP)) {
        return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
      }
    } catch (error) {
      return NextResponse.json({ 
        success: false, 
        message: error instanceof Error ? error.message : 'Authentication failed' 
      }, { status: 429 });
    }
    
    if (!productId) {
      return NextResponse.json({ 
        success: false, 
        message: 'Product ID is required' 
      }, { status: 400 });
    }
    
    const deleted = await deleteProduct(productId);
    
    if (!deleted) {
      return NextResponse.json({ 
        success: false, 
        message: 'Product not found' 
      }, { status: 404 });
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Product deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Error deleting product' 
    }, { status: 500 });
  }
}
