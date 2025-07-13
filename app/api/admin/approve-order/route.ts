import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { updateOrderStatus, getOrderById } from '../../../../utils/orderStorage';
import { sendOrderApprovalNotification } from '../../../../utils/emailService';
import { checkRateLimit, RATE_LIMITS, createRateLimitHeaders } from '../../../../utils/rateLimit';
import { getClientIP } from '../../../../utils/auth';

export async function POST(request: NextRequest) {
  const clientIP = getClientIP(request);
  
  // Apply rate limiting
  const rateLimit = checkRateLimit(clientIP, RATE_LIMITS.ORDER, 'approve-order');
  const rateLimitHeaders = createRateLimitHeaders(rateLimit, RATE_LIMITS.ORDER);
  
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { success: false, message: rateLimit.error },
      { status: 429, headers: rateLimitHeaders }
    );
  }

  try {
    const body = await request.json();
    const { orderId, action, adminKey, adminNotes } = body;

    // Validate admin key
    if (adminKey !== process.env.ADMIN_KEY) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401, headers: rateLimitHeaders }
      );
    }

    // Validate required fields
    if (!orderId || !action) {
      return NextResponse.json(
        { success: false, message: 'Order ID and action are required' },
        { status: 400, headers: rateLimitHeaders }
      );
    }

    // Validate action
    if (!['approved', 'rejected'].includes(action)) {
      return NextResponse.json(
        { success: false, message: 'Invalid action. Must be "approved" or "rejected"' },
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

    // Check if order is in correct status for approval/rejection
    if (currentOrder.status !== 'pending') {
      return NextResponse.json(
        { success: false, message: `Cannot ${action} order with status: ${currentOrder.status}` },
        { status: 400, headers: rateLimitHeaders }
      );
    }

    // Update order status
    const updatedOrder = await updateOrderStatus(orderId, action, {
      approvedAt: action === 'approved' ? new Date().toISOString() : undefined,
      adminNotes: adminNotes || undefined
    });

    if (!updatedOrder) {
      return NextResponse.json(
        { success: false, message: 'Failed to update order status' },
        { status: 500, headers: rateLimitHeaders }
      );
    }

    console.log(`📋 Order ${action}:`, orderId);

    let emailResult: { success: boolean; messageId?: string; error?: string } = { success: false, error: 'No email sent' };

    // Send approval notification email to customer (only if approved)
    if (action === 'approved') {
      console.log('📧 Sending approval notification to customer...');
      emailResult = await sendOrderApprovalNotification(updatedOrder);
      
      if (emailResult.success) {
        console.log('✅ Approval notification sent successfully');
      } else {
        console.error('❌ Failed to send approval notification:', emailResult.error);
      }
    } else if (action === 'rejected') {
      console.log('📧 Order rejected - no automatic email sent (can be sent manually)');
      // Note: Rejection emails can be sent manually through admin panel if needed
    }

    return NextResponse.json({
      success: true,
      message: `Order ${action} successfully`,
      order: updatedOrder,
      emailSent: emailResult.success,
      emailError: emailResult.success ? undefined : emailResult.error
    }, { headers: rateLimitHeaders });

  } catch (error) {
    console.error('Error processing order approval:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to process order approval' },
      { status: 500, headers: rateLimitHeaders }
    );
  }
}
