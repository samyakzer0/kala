import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getOrderById, updateOrderStatus } from '../../../../utils/orderStorage';
import { validateAdminKey, getClientIP } from '../../../../utils/auth';
import { sendOrderApprovalNotification, sendManualEmail } from '../../../../utils/emailService';
import { checkRateLimit, RATE_LIMITS, createRateLimitHeaders } from '../../../../utils/rateLimit';

export async function PATCH(request: NextRequest) {
  const clientIP = getClientIP(request);
  
  // Apply rate limiting for admin actions
  const rateLimit = checkRateLimit(clientIP, RATE_LIMITS.ADMIN, 'admin-order-update');
  const rateLimitHeaders = createRateLimitHeaders(rateLimit, RATE_LIMITS.ADMIN);
  
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { success: false, message: rateLimit.error },
      { status: 429, headers: rateLimitHeaders }
    );
  }
  
  try {
    const body = await request.json();
    const { orderId, status, adminNotes, adminKey } = body;
    
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
    
    // Validate status
    const validStatuses = ['pending', 'approved', 'rejected', 'shipped', 'delivered'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, message: 'Invalid status' },
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
    
    // Prevent duplicate status updates
    if (existingOrder.status === status) {
      return NextResponse.json(
        { success: false, message: `Order is already ${status}` },
        { status: 400, headers: rateLimitHeaders }
      );
    }
    
    // Update order status
    const updatedOrder = await updateOrderStatus(orderId, status, adminNotes);
    if (!updatedOrder) {
      return NextResponse.json(
        { success: false, message: 'Failed to update order' },
        { status: 500, headers: rateLimitHeaders }
      );
    }
    
    // Send appropriate email notifications
    let emailResult: { success: boolean; messageId?: string; error?: string } = { success: true };
    
    try {
      if (status === 'approved') {
        console.log(`📧 Sending approval email for order ${orderId}...`);
        emailResult = await sendOrderApprovalNotification(updatedOrder);
        
        if (emailResult.success) {
          console.log(`✅ Approval email sent successfully for order ${orderId}`);
        } else {
          console.error(`❌ Failed to send approval email for order ${orderId}:`, emailResult.error);
        }
        
      } else if (status === 'rejected') {
        console.log(`📧 Sending rejection email for order ${orderId}...`);
        // For rejection, send a manual email with rejection details
        const rejectionSubject = `Order Update - #${updatedOrder.id}`;
        const rejectionMessage = `Dear ${updatedOrder.customer.firstName} ${updatedOrder.customer.lastName},\n\nWe regret to inform you that your order #${updatedOrder.id} has been rejected.\n\n${adminNotes ? `Reason: ${adminNotes}\n\n` : ''}Please contact us if you have any questions.\n\nBest regards,\nThe Kala Jewelry Team`;
        emailResult = await sendManualEmail(updatedOrder.customer.email, rejectionSubject, rejectionMessage, { isHtml: false, bccAdmin: true });
        
        if (emailResult.success) {
          console.log(`✅ Rejection email sent successfully for order ${orderId}`);
        } else {
          console.error(`❌ Failed to send rejection email for order ${orderId}:`, emailResult.error);
        }
      }
      
      // For shipped/delivered status, you could add tracking emails here
      // if (status === 'shipped') {
      //   emailResult = await sendShippingNotification(updatedOrder);
      // }
      
    } catch (emailError) {
      console.error(`❌ Email sending error for order ${orderId}:`, emailError);
      // Don't fail the status update if email fails
      emailResult = { 
        success: false, 
        error: emailError instanceof Error ? emailError.message : 'Email sending failed' 
      };
    }
    
    console.log(`✅ Order ${orderId} status updated to ${status} by admin`);
    
    return NextResponse.json({
      success: true,
      message: `Order ${status} successfully`,
      order: updatedOrder,
      emailSent: emailResult.success,
      emailError: emailResult.error
    }, { headers: rateLimitHeaders });
    
  } catch (error) {
    console.error('❌ Error updating order status:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to update order status' 
      },
      { status: 500, headers: rateLimitHeaders }
    );
  }
}

// Get order details for admin review
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('orderId');
    const adminKey = searchParams.get('adminKey');
    const clientIP = getClientIP(request);
    
    // Secure admin authentication
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
    
    if (!orderId) {
      return NextResponse.json(
        { success: false, message: 'Order ID is required' },
        { status: 400 }
      );
    }
    
    const order = await getOrderById(orderId);
    if (!order) {
      return NextResponse.json(
        { success: false, message: 'Order not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      order
    });
    
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to fetch order' 
      },
      { status: 500 }
    );
  }
}
