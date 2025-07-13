import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { updateOrderStatus, getOrderById } from '../../../../utils/orderStorage';
import { sendOrderDeliveryConfirmation } from '../../../../utils/emailService';
import { checkRateLimit, RATE_LIMITS, createRateLimitHeaders } from '../../../../utils/rateLimit';
import { getClientIP } from '../../../../utils/auth';

export async function POST(request: NextRequest) {
  const clientIP = getClientIP(request);
  
  // Apply rate limiting
  const rateLimit = checkRateLimit(clientIP, RATE_LIMITS.ORDER, 'mark-delivered');
  const rateLimitHeaders = createRateLimitHeaders(rateLimit, RATE_LIMITS.ORDER);
  
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { success: false, message: rateLimit.error },
      { status: 429, headers: rateLimitHeaders }
    );
  }

  try {
    const body = await request.json();
    const { orderId, adminKey, deliveryNotes } = body;

    // Validate admin key
    if (adminKey !== process.env.ADMIN_KEY) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401, headers: rateLimitHeaders }
      );
    }

    // Validate required fields
    if (!orderId) {
      return NextResponse.json(
        { success: false, message: 'Order ID is required' },
        { status: 400, headers: rateLimitHeaders }
      );
    }

    // Get the current order
    const currentOrder = await getOrderById(orderId);
    if (!currentOrder) {
      return NextResponse.json(
        { success: false, message: 'Order not found' },
        { status: 404, headers: rateLimitHeaders }
      );
    }

    // Check if order is in correct status for delivery confirmation
    // Orders should be approved before they can be marked as delivered
    if (!['approved', 'shipped'].includes(currentOrder.status)) {
      return NextResponse.json(
        { success: false, message: `Cannot mark order as delivered. Current status: ${currentOrder.status}. Order must be approved or shipped first.` },
        { status: 400, headers: rateLimitHeaders }
      );
    }

    // Update order status to delivered
    const updatedOrder = await updateOrderStatus(orderId, 'delivered', {
      deliveredAt: new Date().toISOString(),
      deliveryNotes: deliveryNotes || undefined
    });

    if (!updatedOrder) {
      return NextResponse.json(
        { success: false, message: 'Failed to update order status' },
        { status: 500, headers: rateLimitHeaders }
      );
    }

    console.log('📦 Order marked as delivered:', orderId);
    console.log('📧 Sending delivery confirmation to customer...');

    // Send delivery confirmation email to customer
    const emailResult = await sendOrderDeliveryConfirmation(updatedOrder);
    
    if (emailResult.success) {
      console.log('✅ Delivery confirmation sent successfully');
    } else {
      console.error('❌ Failed to send delivery confirmation:', emailResult.error);
    }

    return NextResponse.json({
      success: true,
      message: 'Order marked as delivered successfully',
      order: updatedOrder,
      emailSent: emailResult.success,
      emailError: emailResult.error
    }, { headers: rateLimitHeaders });

  } catch (error) {
    console.error('Error marking order as delivered:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to mark order as delivered' },
      { status: 500, headers: rateLimitHeaders }
    );
  }
}
