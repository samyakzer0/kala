import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getOrderById, updateOrderStatus } from '../../../../utils/orderStorage';
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
    let shippingInfo = null;
    if (trackingId && provider && status === 'shipped') {
      shippingInfo = {
        trackingId: trackingId.trim(),
        provider: provider.trim(),
        shippingMethod: shippingMethod?.trim(),
        estimatedDelivery: estimatedDelivery?.trim()
      };
      
      // Update order status to shipped first, then add shipping info manually
      const updatedOrder = await updateOrderStatus(orderId, status);
      if (!updatedOrder) {
        return NextResponse.json(
          { success: false, message: 'Failed to update order status' },
          { status: 500, headers: rateLimitHeaders }
        );
      }
      
      // Note: Shipping info would need to be stored in order or separate tracking system
      // For now, we'll just update the status and send notification emails
    } else {
      // Update order status without shipping info
      const updatedOrder = await updateOrderStatus(orderId, status);
      if (!updatedOrder) {
        return NextResponse.json(
          { success: false, message: 'Failed to update order status' },
          { status: 500, headers: rateLimitHeaders }
        );
      }
    }
    
    // Get the updated order for email sending
    const finalOrder = await getOrderById(orderId);
    if (!finalOrder) {
      return NextResponse.json(
        { success: false, message: 'Order not found after update' },
        { status: 500, headers: rateLimitHeaders }
      );
    }
    
    // Send appropriate email notifications
    let emailResult: { success: boolean; messageId?: string; error?: string } = { success: true };
    
    try {
      // Use our available email functions
      if (status === 'delivered') {
        console.log(`📧 Sending delivery confirmation email for order ${orderId}...`);
        const { sendOrderDeliveryConfirmation } = await import('../../../../utils/emailService');
        emailResult = await sendOrderDeliveryConfirmation(finalOrder);
        
        if (emailResult.success) {
          console.log(`✅ Delivery confirmation email sent successfully for order ${orderId}`);
        } else {
          console.error(`❌ Failed to send delivery confirmation email for order ${orderId}:`, emailResult.error);
        }
      } else {
        // For other statuses (shipped, etc.), send a manual email with status update
        console.log(`📧 Sending ${status} notification email for order ${orderId}...`);
        const { sendManualEmail } = await import('../../../../utils/emailService');
        const subject = `Order Update - #${finalOrder.id}`;
        const message = `Dear ${finalOrder.customer.firstName} ${finalOrder.customer.lastName},\n\nYour order #${finalOrder.id} status has been updated to: ${status.charAt(0).toUpperCase() + status.slice(1)}\n\n${shippingInfo ? `Tracking ID: ${shippingInfo.trackingId}\nCarrier: ${shippingInfo.provider}\n${shippingInfo.shippingMethod ? `Shipping Method: ${shippingInfo.shippingMethod}\n` : ''}${shippingInfo.estimatedDelivery ? `Estimated Delivery: ${shippingInfo.estimatedDelivery}\n` : ''}\n` : ''}You can track your order anytime by visiting our website.\n\nBest regards,\nThe Kala Jewelry Team`;
        
        emailResult = await sendManualEmail(finalOrder.customer.email, subject, message, { isHtml: false, bccAdmin: true });
        
        if (emailResult.success) {
          console.log(`✅ ${status} notification email sent successfully for order ${orderId}`);
        } else {
          console.error(`❌ Failed to send ${status} notification email for order ${orderId}:`, emailResult.error);
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
      order: finalOrder,
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
