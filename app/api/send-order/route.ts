import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { Order } from '../../../types/order';
import { 
  generateOrderId, 
  generateAdminOrderEmail, 
  generateCustomerConfirmationEmail,
  ADMIN_CONFIG 
} from '../../../utils/order';
import { 
  sendOrderNotificationToAdmin, 
  sendOrderConfirmationToCustomer 
} from '../../../utils/email';
import { createOrder } from '../../../utils/orderStorage';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customer, items, subtotal } = body;
    
    // Validate required fields
    if (!customer || !items || !subtotal) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Validate customer information
    const requiredCustomerFields = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'state', 'zipCode', 'country'];
    for (const field of requiredCustomerFields) {
      if (!customer[field] || customer[field].trim() === '') {
        return NextResponse.json(
          { success: false, message: `Missing required customer field: ${field}` },
          { status: 400 }
        );
      }
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customer.email)) {
      return NextResponse.json(
        { success: false, message: 'Invalid email address' },
        { status: 400 }
      );
    }
    
    // Validate items
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, message: 'No items in order' },
        { status: 400 }
      );
    }
    
    // Create order object
    const order: Order = {
      id: generateOrderId(),
      customer: {
        firstName: customer.firstName.trim(),
        lastName: customer.lastName.trim(),
        email: customer.email.trim().toLowerCase(),
        phone: customer.phone.trim(),
        address: customer.address.trim(),
        city: customer.city.trim(),
        state: customer.state.trim(),
        zipCode: customer.zipCode.trim(),
        country: customer.country.trim()
      },
      items: items.map(item => ({
        id: item.id,
        name: item.name,
        price: parseFloat(item.price),
        quantity: parseInt(item.quantity),
        category: item.category
      })),
      subtotal: parseFloat(subtotal),
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    
    // Save order to storage
    await createOrder(order);
    
    // Generate email templates
    const adminEmailTemplate = generateAdminOrderEmail(order);
    const customerEmailTemplate = generateCustomerConfirmationEmail(order);
    
    // Send emails
    const adminEmailResult = await sendOrderNotificationToAdmin(
      ADMIN_CONFIG.email,
      adminEmailTemplate,
      order.customer.email
    );
    
    const customerEmailResult = await sendOrderConfirmationToCustomer(
      order.customer.email,
      customerEmailTemplate
    );
    
    // Log results for debugging
    console.log('📋 Order created:', order.id);
    console.log('📧 Admin email result:', adminEmailResult);
    console.log('📧 Customer email result:', customerEmailResult);
    
    // Check if emails were sent successfully
    if (!adminEmailResult.success) {
      console.error('Failed to send admin notification:', adminEmailResult.error);
      // Continue anyway - order is still created
    }
    
    if (!customerEmailResult.success) {
      console.error('Failed to send customer confirmation:', customerEmailResult.error);
      // Continue anyway - order is still created
    }
    
    return NextResponse.json({ 
      success: true,
      message: 'Order received successfully',
      orderId: order.id,
      status: order.status
    });
    
  } catch (error) {
    console.error('Error processing order:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to process order. Please try again.' 
      },
      { status: 500 }
    );
  }
} 