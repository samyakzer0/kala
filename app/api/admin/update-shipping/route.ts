import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getOrderById, updateOrderStatus, updateOrderShipping } from '../../../../utils/orderStorage';
import { validateAdminKey, getClientIP } from '../../../../utils/auth';
import { checkRateLimit, RATE_LIMITS, createRateLimitHeaders } from '../../../../utils/rateLimit';

export async function POST(request: NextRequest) {
  const clientIP = getClientIP(request);
  
  // Apply rate limiting for admin actions
  const rateLimit = checkRateLimit(clientIP, RATE_LIMITS.ADMIN, 'admin-shipping-update');
  const rateLimitHeaders = createRateLimitHeaders(rateLimit, RATE_LIMITS.ADMIN);
  
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { success: false, message: rateLimit.error },
      { status: 429, headers: rateLimitHeaders }
    );
  }

  try {
    const body = await request.json();
    const { orderId, status, trackingId, provider, shippingMethod, estimatedDelivery, adminKey } = body;
    
    // Secure admin authentication
    try {
      if (!validateAdminKey(adminKey || '', clientIP)) {
        return NextResponse.json(
          { success: false, message: 'Unauthorized' }, 
          { status: 401, headers: rateLimitHeaders }
        );
      }
    } catch (error) {
      return NextResponse.json(
        { 
          success: false, 
          message: error instanceof Error ? error.message : 'Authentication failed' 
        }, 
        { status: 429, headers: rateLimitHeaders }
      );
    }
    
    // Validate required fields
    if (!orderId || !status) {
      return NextResponse.json(
        { success: false, message: 'Order ID and status are required' },
        { status: 400, headers: rateLimitHeaders }
      );
    }
    
    // Validate status for shipping updates
    const validShippingStatuses = ['shipped', 'out_for_delivery', 'delivered'];
    if (!validShippingStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, message: 'Invalid shipping status' },
        { status: 400, headers: rateLimitHeaders }
      );
    }
    
    // Get existing order
    const existingOrder = await getOrderById(orderId);
    if (!existingOrder) {
      return NextResponse.json(
        { success: false, message: 'Order not found' },
        { status: 404, headers: rateLimitHeaders }
      );
    }
    
    // Check if order is approved before allowing shipping updates
    if (existingOrder.status !== 'approved' && status === 'shipped') {
      return NextResponse.json(
        { success: false, message: 'Order must be approved before shipping' },
        { status: 400, headers: rateLimitHeaders }
      );
    }
    
    // Update shipping information if provided
    if (trackingId && provider && status === 'shipped') {
      const shippingInfo = {
        trackingId: trackingId.trim(),
        provider: provider.trim(),
        shippingMethod: shippingMethod?.trim(),
        estimatedDelivery: estimatedDelivery?.trim()
      };
      
      await updateOrderShipping(orderId, shippingInfo);
    }
    
    // Update order status
    const updatedOrder = await updateOrderStatus(orderId, status);
    if (!updatedOrder) {
      return NextResponse.json(
        { success: false, message: 'Failed to update order status' },
        { status: 500, headers: rateLimitHeaders }
      );
    }
    
    // Send appropriate email notifications
    let emailResult: { success: boolean; messageId?: string; error?: string } = { success: true };
    
    try {
      // Import email functions dynamically to avoid circular dependencies
      let emailFunction;
      
      switch (status) {
        case 'shipped':
          const { sendOrderShipped } = await import('../../../../utils/emailService');
          emailFunction = sendOrderShipped;
          break;
        case 'out_for_delivery':
          const { sendOrderOutForDelivery } = await import('../../../../utils/emailService');
          emailFunction = sendOrderOutForDelivery;
          break;
        case 'delivered':
          const { sendOrderDelivered } = await import('../../../../utils/emailService');
          emailFunction = sendOrderDelivered;
          break;
      }
      
      if (emailFunction) {
        console.log(`📧 Sending ${status} email for order ${orderId}...`);
        emailResult = await emailFunction(updatedOrder);
        
        if (emailResult.success) {
          console.log(`✅ ${status} email sent successfully for order ${orderId}`);
        } else {
          console.error(`❌ Failed to send ${status} email for order ${orderId}:`, emailResult.error);
        }
      }
    } catch (emailError) {
      console.error(`❌ Error sending ${status} email for order ${orderId}:`, emailError);
      emailResult = { 
        success: false, 
        error: emailError instanceof Error ? emailError.message : 'Unknown email error' 
      };
    }
    
    return NextResponse.json({ 
      success: true, 
      order: updatedOrder,
      emailSent: emailResult.success,
      emailError: emailResult.error 
    }, { headers: rateLimitHeaders });
    
  } catch (error) {
    console.error('❌ Error updating order shipping:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500, headers: rateLimitHeaders }
    );
  }
}
