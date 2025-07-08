import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { Order } from '../../../types/order';
import { 
  generateOrderId, 
  ADMIN_CONFIG 
} from '../../../utils/order';
import { 
  sendOrderConfirmation, 
  sendAdminNotification,
  validateEmailConfiguration 
} from '../../../utils/emailService';
import { createOrder } from '../../../utils/orderStorage';
import { isProductInStock, decreaseProductStock, getProductById } from '../../../utils/productStorage';
import { checkRateLimit, RATE_LIMITS, createRateLimitHeaders } from '../../../utils/rateLimit';
import { getClientIP } from '../../../utils/auth';
import { validateEmail } from '../../../utils/validation';
import { trackProductOrder } from '../../../utils/analytics';

export async function POST(request: NextRequest) {
  const clientIP = getClientIP(request);
  
  // Apply rate limiting
  const rateLimit = checkRateLimit(clientIP, RATE_LIMITS.ORDER, 'send-order');
  const rateLimitHeaders = createRateLimitHeaders(rateLimit, RATE_LIMITS.ORDER);
  
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { success: false, message: rateLimit.error },
      { status: 429, headers: rateLimitHeaders }
    );
  }
  
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
    if (!validateEmail(customer.email)) {
      return NextResponse.json(
        { success: false, message: 'Invalid email address' },
        { status: 400, headers: rateLimitHeaders }
      );
    }
    
    // Validate items and check stock availability
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, message: 'No items in order' },
        { status: 400 }
      );
    }
    
    // Check stock for all items before processing
    const stockErrors = [];
    for (const item of items) {
      const inStock = await isProductInStock(item.id, item.quantity);
      if (!inStock) {
        const product = await getProductById(item.id);
        const availableStock = product ? product.stock : 0;
        stockErrors.push({
          item: item.name,
          requested: item.quantity,
          available: availableStock
        });
      }
    }
    
    // If any items are out of stock, return error
    if (stockErrors.length > 0) {
      return NextResponse.json({
        success: false,
        message: 'Some items are out of stock',
        stockErrors: stockErrors
      }, { status: 400 });
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
    
    // Decrease stock for all items (reserve inventory)
    for (const item of items) {
      await decreaseProductStock(item.id, item.quantity);
      // Track product orders for analytics
      await trackProductOrder(item.id, item.quantity);
    }
    
    // Check email configuration
    const emailConfig = validateEmailConfiguration();
    if (!emailConfig.isConfigured) {
      console.warn('⚠️ Email not configured properly:', emailConfig.issues);
      console.warn('📧 Emails will be simulated only');
    } else {
      console.log('✅ Email configured with provider:', emailConfig.provider);
    }
    
    // Send emails using enhanced email service
    console.log('📧 Sending order confirmation to customer...');
    const customerEmailResult = await sendOrderConfirmation(order);
    
    console.log('📧 Sending order notification to admin...');
    const adminEmailResult = await sendAdminNotification(order);
    
    // Log results for debugging
    console.log('📋 Order created:', order.id);
    console.log('📧 Customer email result:', customerEmailResult);
    console.log('📧 Admin email result:', adminEmailResult);
    
    // Check if emails were sent successfully
    if (!customerEmailResult.success) {
      console.error('❌ Failed to send customer confirmation:', customerEmailResult.error);
      // Continue anyway - order is still created
    } else {
      console.log('✅ Customer confirmation sent successfully');
    }
    
    if (!adminEmailResult.success) {
      console.error('❌ Failed to send admin notification:', adminEmailResult.error);
      // Continue anyway - order is still created  
    } else {
      console.log('✅ Admin notification sent successfully');
    }
    
    return NextResponse.json({ 
      success: true,
      message: 'Order received successfully! Check your email for confirmation.',
      orderId: order.id,
      status: order.status,
      emailStatus: {
        customerEmail: customerEmailResult.success,
        adminEmail: adminEmailResult.success
      }
    }, { headers: rateLimitHeaders });
    
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