import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { sendOrderConfirmation, sendOrderApproval, sendOrderRejection } from '../../../../utils/emailService';
import { validateAdminKey, getClientIP } from '../../../../utils/auth';

// This is a test endpoint for email functionality - only accessible with admin key
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'confirmation';
    const adminKey = searchParams.get('adminKey');
    const email = searchParams.get('email');
    const clientIP = getClientIP(request);

    // Secure admin authentication
    if (!validateAdminKey(adminKey || '', clientIP)) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Email address required for testing' },
        { status: 400 }
      );
    }

    // Create a sample order for testing
    const testOrder = {
      id: 'TEST-ORDER-' + Date.now(),
      customer: {
        firstName: 'Test',
        lastName: 'User',
        email: email,
        phone: '123-456-7890',
        address: '123 Test Street',
        city: 'Test City',
        state: 'Test State',
        zipCode: '12345',
        country: 'Test Country'
      },
      items: [
        {
          id: 'test-product-1',
          name: 'Diamond Test Ring',
          price: 1299.99,
          quantity: 1,
          category: 'rings'
        },
        {
          id: 'test-product-2',
          name: 'Sapphire Test Earrings',
          price: 799.99,
          quantity: 1,
          category: 'earrings'
        }
      ],
      subtotal: 2099.98,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    let result;
    let emailType = 'Unknown';

    // Test different email types
    switch (type) {
      case 'confirmation':
        emailType = 'Order Confirmation';
        result = await sendOrderConfirmation(testOrder);
        break;
      case 'approval':
        emailType = 'Order Approval';
        result = await sendOrderApproval({
          ...testOrder,
          status: 'approved',
          approvedAt: new Date().toISOString()
        });
        break;
      case 'rejection':
        emailType = 'Order Rejection';
        result = await sendOrderRejection(
          {
            ...testOrder,
            status: 'rejected',
            approvedAt: new Date().toISOString()
          },
          'Test rejection reason - items out of stock'
        );
        break;
      default:
        return NextResponse.json(
          { success: false, message: 'Invalid test type. Use: confirmation, approval, or rejection' },
          { status: 400 }
        );
    }

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: `Test ${emailType} email sent successfully to ${email}`,
        messageId: result.messageId
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          message: `Failed to send test ${emailType} email`,
          error: result.error
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error testing email service:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to test email service',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
