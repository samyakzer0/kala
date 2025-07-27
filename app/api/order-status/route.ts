import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getOrderById, getOrdersByCustomerEmail } from '../../../lib/database';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('orderId');
    const customerEmail = searchParams.get('email');
    
    if (orderId) {
      // Get specific order by ID
      const order = await getOrderById(orderId);
      if (!order) {
        return NextResponse.json(
          { success: false, message: 'Order not found' },
          { status: 404 }
        );
      }
      
      // Return order without sensitive information
      return NextResponse.json({
        success: true,
        order: {
          id: order.id,
          status: order.status,
          createdAt: order.createdAt,
          approvedAt: order.approvedAt,
          subtotal: order.subtotal,
          items: order.items,
          customer: {
            firstName: order.customer.firstName,
            lastName: order.customer.lastName,
            email: order.customer.email
          }
        }
      });
    } else if (customerEmail) {
      // Get orders by customer email
      const orders = await getOrdersByCustomerEmail(customerEmail);
      
      return NextResponse.json({
        success: true,
        orders: orders.map(order => ({
          id: order.id,
          status: order.status,
          createdAt: order.createdAt,
          approvedAt: order.approvedAt,
          subtotal: order.subtotal,
          itemCount: order.items.length
        }))
      });
    } else {
      return NextResponse.json(
        { success: false, message: 'Either orderId or email parameter is required' },
        { status: 400 }
      );
    }
    
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to fetch order information' 
      },
      { status: 500 }
    );
  }
}
