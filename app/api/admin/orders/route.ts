import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getAllOrders, getOrderStats } from '../../../../utils/orderStorage';
import { validateAdminKey, getClientIP } from '../../../../utils/auth';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const adminKey = searchParams.get('adminKey');
    const clientIP = getClientIP(request);
    
    // Secure admin authentication with rate limiting
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
    
    // Get all orders and statistics
    const [orders, stats] = await Promise.all([
      getAllOrders(),
      getOrderStats()
    ]);
    
    return NextResponse.json({
      success: true,
      orders,
      stats
    });
    
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to fetch orders' 
      },
      { status: 500 }
    );
  }
}
