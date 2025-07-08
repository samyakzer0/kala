import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createOrder } from '../../../../utils/orderStorage';
import { generateOrderId } from '../../../../utils/order';
import type { Order } from '../../../../types/order';

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();
    
    // Simple protection for test endpoint
    if (password !== 'test-kala-2024') {
      return NextResponse.json(
        { success: false, message: 'Invalid password' },
        { status: 401 }
      );
    }
    
    // Create a test order
    const testOrder: Order = {
      id: generateOrderId(),
      customer: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '+1-555-0123',
        address: '123 Test Street',
        city: 'Test City',
        state: 'CA',
        zipCode: '90210',
        country: 'United States'
      },
      items: [
        {
          id: 'ring-1',
          name: 'Elegant Diamond Ring',
          price: 299,
          quantity: 1,
          category: 'rings'
        },
        {
          id: 'necklace-1',
          name: 'Pearl Necklace',
          price: 199,
          quantity: 2,
          category: 'necklaces'
        }
      ],
      subtotal: 697,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    
    // Save the test order
    const savedOrder = await createOrder(testOrder);
    
    console.log('🧪 Test order created:', savedOrder.id);
    
    return NextResponse.json({
      success: true,
      message: 'Test order created successfully',
      order: {
        id: savedOrder.id,
        status: savedOrder.status,
        subtotal: savedOrder.subtotal,
        itemCount: savedOrder.items.length
      }
    });
    
  } catch (error) {
    console.error('Error creating test order:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to create test order' 
      },
      { status: 500 }
    );
  }
}
