import { NextRequest, NextResponse } from 'next/server';
import { getMostPopularProducts, getTrendingProducts, trackProductView } from '../../../utils/analytics';
import { getProductById } from '../../../utils/productStorage';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'popular'; // 'popular' or 'trending'
    const limit = parseInt(searchParams.get('limit') || '6');
    const productId = searchParams.get('productId'); // For tracking individual product views
    
    // If productId is provided, track the view
    if (productId) {
      await trackProductView(productId);
      return NextResponse.json({ success: true, message: 'View tracked' });
    }
    
    // Get analytics data
    let analyticsData;
    if (type === 'trending') {
      analyticsData = await getTrendingProducts(limit);
    } else {
      analyticsData = await getMostPopularProducts(limit);
    }
    
    // Get full product details for each popular product
    const popularProducts = [];
    for (const analytics of analyticsData) {
      const product = await getProductById(analytics.productId);
      if (product && product.isActive) {
        popularProducts.push({
          ...product,
          analytics: {
            views: analytics.views,
            orders: analytics.orders,
            popularityScore: analytics.popularityScore
          }
        });
      }
    }
    
    return NextResponse.json({
      success: true,
      products: popularProducts,
      type: type,
      total: popularProducts.length
    });
    
  } catch (error) {
    console.error('Error fetching popular products:', error);
    return NextResponse.json({
      success: false,
      message: 'Error fetching popular products'
    }, { status: 500 });
  }
}
