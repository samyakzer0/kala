import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { deleteOrder, getAllOrders } from '../../../../utils/orderStorage';

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('orderId');
    const adminKey = searchParams.get('adminKey');
    
    // Simple admin authentication
    const expectedAdminKey = process.env.ADMIN_KEY || 'kala-admin-2024';
    if (adminKey !== expectedAdminKey) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    if (!orderId) {
      return NextResponse.json(
        { success: false, message: 'Order ID is required' },
        { status: 400 }
      );
    }
    
    const deleted = await deleteOrder(orderId);
    
    if (!deleted) {
      return NextResponse.json(
        { success: false, message: 'Order not found' },
        { status: 404 }
      );
    }
    
    console.log(`🗑️ Order ${orderId} deleted by admin`);
    
    return NextResponse.json({
      success: true,
      message: 'Order deleted successfully'
    });
    
  } catch (error) {
    console.error('Error deleting order:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to delete order' 
      },
      { status: 500 }
    );
  }
}

// Bulk operations for admin
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, orderIds, adminKey } = body;
    
    // Simple admin authentication
    const expectedAdminKey = process.env.ADMIN_KEY || 'kala-admin-2024';
    if (adminKey !== expectedAdminKey) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    if (action === 'clearAll') {
      // Clear all orders (for development/testing)
      const orders = await getAllOrders();
      let deletedCount = 0;
      
      for (const order of orders) {
        const deleted = await deleteOrder(order.id);
        if (deleted) deletedCount++;
      }
      
      console.log(`🗑️ Cleared ${deletedCount} orders`);
      
      return NextResponse.json({
        success: true,
        message: `Cleared ${deletedCount} orders`
      });
    }
    
    return NextResponse.json(
      { success: false, message: 'Invalid action' },
      { status: 400 }
    );
    
  } catch (error) {
    console.error('Error in bulk operations:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to process bulk operation' 
      },
      { status: 500 }
    );
  }
}
