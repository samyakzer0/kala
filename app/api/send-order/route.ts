import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customer, items, subtotal } = body;
    
    // In a real application, you would use a service like SendGrid, Mailgun, etc.
    // For this demo, we'll just log the order details
    
    console.log('Order received:');
    console.log('Customer:', customer);
    console.log('Items:', items);
    console.log('Subtotal:', subtotal);
    
    // Simulate sending an email
    console.log('Sending email to admin with order details...');
    
    // Simulate a delay as if we're sending an email
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return NextResponse.json({ 
      success: true,
      message: 'Order received and email sent to admin' 
    });
  } catch (error) {
    console.error('Error processing order:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to process order' },
      { status: 500 }
    );
  }
} 