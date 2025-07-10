import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getOrderById, updateOrderStatus } from '../../../../utils/orderStorage';
import { 
  generateCustomerApprovalEmail,
  // ADMIN_CONFIG - removed unused import
} from '../../../../utils/order';
import { sendApprovalNotificationToCustomer } from '../../../../utils/email';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, action, adminNotes, adminKey } = body;
    
    // Simple admin authentication - in production, use proper authentication
    const expectedAdminKey = process.env.ADMIN_KEY || 'kala-admin-2024';
    if (adminKey !== expectedAdminKey) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    if (!orderId || !action) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    if (!['approved', 'rejected'].includes(action)) {
      return NextResponse.json(
        { success: false, message: 'Invalid action. Must be "approved" or "rejected"' },
        { status: 400 }
      );
    }
    
    // Get the order
    const order = await getOrderById(orderId);
    if (!order) {
      return NextResponse.json(
        { success: false, message: 'Order not found' },
        { status: 404 }
      );
    }
    
    if (order.status !== 'pending') {
      return NextResponse.json(
        { success: false, message: `Order is already ${order.status}` },
        { status: 400 }
      );
    }
    
    // Update order status
    const updatedOrder = await updateOrderStatus(orderId, action, adminNotes);
    if (!updatedOrder) {
      return NextResponse.json(
        { success: false, message: 'Failed to update order' },
        { status: 500 }
      );
    }
    
    // Send customer notification if approved
    if (action === 'approved') {
      const customerEmailTemplate = generateCustomerApprovalEmail(updatedOrder);
      const emailResult = await sendApprovalNotificationToCustomer(
        updatedOrder.customer.email,
        customerEmailTemplate
      );
      
      console.log('📧 Customer approval email result:', emailResult);
      
      if (!emailResult.success) {
        console.error('Failed to send customer approval email:', emailResult.error);
        // Continue anyway - order status is already updated
      }
    }
    
    console.log(`✅ Order ${orderId} ${action} by admin`);
    
    return NextResponse.json({
      success: true,
      message: `Order ${action} successfully`,
      order: {
        id: updatedOrder.id,
        status: updatedOrder.status,
        approvedAt: updatedOrder.approvedAt,
        adminNotes: updatedOrder.adminNotes
      }
    });
    
  } catch (error) {
    console.error('Error processing order approval:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to process order approval' 
      },
      { status: 500 }
    );
  }
}
