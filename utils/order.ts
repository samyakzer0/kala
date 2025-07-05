import { Order, EmailTemplate } from '../types/order';

// Admin configuration - in production, this would be in environment variables
export const ADMIN_CONFIG = {
  email: 'admin@kala-jewelry.com', // Replace with actual admin email
  notificationEmail: 'orders@kala-jewelry.com', // Replace with actual notification email
  companyName: 'Kala Jewelry',
  companyAddress: '123 Jewelry Street, New York, NY 10001',
  companyPhone: '+1 (555) 123-4567',
  companyWebsite: 'https://kala-jewelry.com'
};

// Generate unique order ID
export function generateOrderId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2);
  return `KJ-${timestamp}-${random}`.toUpperCase();
}

// Format currency
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
}

// Format date
export function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(dateString));
}

// Generate order confirmation email for admin
export function generateAdminOrderEmail(order: Order): EmailTemplate {
  const itemsList = order.items.map(item => 
    `- ${item.name} x ${item.quantity} - ${formatCurrency(item.price * item.quantity)}`
  ).join('\n');

  const subject = `New Order #${order.id} - ${formatCurrency(order.subtotal)}`;
  
  const text = `
New Order Received!

Order ID: ${order.id}
Date: ${formatDate(order.createdAt)}
Total: ${formatCurrency(order.subtotal)}

Customer Information:
Name: ${order.customer.firstName} ${order.customer.lastName}
Email: ${order.customer.email}
Phone: ${order.customer.phone}

Shipping Address:
${order.customer.address}
${order.customer.city}, ${order.customer.state} ${order.customer.zipCode}
${order.customer.country}

Items Ordered:
${itemsList}

To approve this order, reply to this email with "APPROVED".
To reject this order, reply to this email with "REJECTED" followed by a reason.

Order Management: Please process this order and update the customer accordingly.
  `;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>New Order #${order.id}</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #872730; color: white; padding: 20px; text-align: center; }
        .content { background: #f9f9f9; padding: 20px; }
        .order-details { background: white; padding: 15px; margin: 15px 0; border-radius: 5px; }
        .item { border-bottom: 1px solid #eee; padding: 10px 0; }
        .item:last-child { border-bottom: none; }
        .total { font-weight: bold; font-size: 18px; color: #872730; }
        .approval { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; margin: 15px 0; border-radius: 5px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>New Order Received!</h1>
          <p>Order #${order.id}</p>
        </div>
        
        <div class="content">
          <div class="order-details">
            <h2>Order Information</h2>
            <p><strong>Order ID:</strong> ${order.id}</p>
            <p><strong>Date:</strong> ${formatDate(order.createdAt)}</p>
            <p><strong>Total:</strong> <span class="total">${formatCurrency(order.subtotal)}</span></p>
          </div>
          
          <div class="order-details">
            <h2>Customer Information</h2>
            <p><strong>Name:</strong> ${order.customer.firstName} ${order.customer.lastName}</p>
            <p><strong>Email:</strong> <a href="mailto:${order.customer.email}">${order.customer.email}</a></p>
            <p><strong>Phone:</strong> ${order.customer.phone}</p>
          </div>
          
          <div class="order-details">
            <h2>Shipping Address</h2>
            <p>
              ${order.customer.address}<br>
              ${order.customer.city}, ${order.customer.state} ${order.customer.zipCode}<br>
              ${order.customer.country}
            </p>
          </div>
          
          <div class="order-details">
            <h2>Items Ordered</h2>
            ${order.items.map(item => `
              <div class="item">
                <strong>${item.name}</strong><br>
                Quantity: ${item.quantity} × ${formatCurrency(item.price)} = ${formatCurrency(item.price * item.quantity)}
              </div>
            `).join('')}
          </div>
          
          <div class="approval">
            <h3>Order Approval Required</h3>
            <p>To approve this order, reply to this email with <strong>"APPROVED"</strong>.</p>
            <p>To reject this order, reply to this email with <strong>"REJECTED"</strong> followed by a reason.</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  return { subject, text, html };
}

// Generate order confirmation email for customer
export function generateCustomerConfirmationEmail(order: Order): EmailTemplate {
  const itemsList = order.items.map(item => 
    `- ${item.name} x ${item.quantity} - ${formatCurrency(item.price * item.quantity)}`
  ).join('\n');

  const subject = `Order Confirmation #${order.id} - Thank you for your purchase!`;
  
  const text = `
Dear ${order.customer.firstName},

Thank you for your order from ${ADMIN_CONFIG.companyName}!

Your order has been received and is currently being processed. You will receive another email once your order has been approved and shipped.

Order Details:
Order ID: ${order.id}
Date: ${formatDate(order.createdAt)}
Total: ${formatCurrency(order.subtotal)}

Items Ordered:
${itemsList}

Shipping Address:
${order.customer.address}
${order.customer.city}, ${order.customer.state} ${order.customer.zipCode}
${order.customer.country}

If you have any questions about your order, please contact us at ${ADMIN_CONFIG.email} or ${ADMIN_CONFIG.companyPhone}.

Thank you for choosing ${ADMIN_CONFIG.companyName}!

Best regards,
The ${ADMIN_CONFIG.companyName} Team
  `;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Order Confirmation #${order.id}</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #872730; color: white; padding: 20px; text-align: center; }
        .content { background: #f9f9f9; padding: 20px; }
        .order-details { background: white; padding: 15px; margin: 15px 0; border-radius: 5px; }
        .item { border-bottom: 1px solid #eee; padding: 10px 0; }
        .item:last-child { border-bottom: none; }
        .total { font-weight: bold; font-size: 18px; color: #872730; }
        .footer { text-align: center; padding: 20px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Thank you for your order!</h1>
          <p>Order #${order.id}</p>
        </div>
        
        <div class="content">
          <p>Dear ${order.customer.firstName},</p>
          <p>Thank you for your order from ${ADMIN_CONFIG.companyName}! Your order has been received and is currently being processed.</p>
          
          <div class="order-details">
            <h2>Order Summary</h2>
            <p><strong>Order ID:</strong> ${order.id}</p>
            <p><strong>Date:</strong> ${formatDate(order.createdAt)}</p>
            <p><strong>Total:</strong> <span class="total">${formatCurrency(order.subtotal)}</span></p>
          </div>
          
          <div class="order-details">
            <h2>Items Ordered</h2>
            ${order.items.map(item => `
              <div class="item">
                <strong>${item.name}</strong><br>
                Quantity: ${item.quantity} × ${formatCurrency(item.price)} = ${formatCurrency(item.price * item.quantity)}
              </div>
            `).join('')}
          </div>
          
          <div class="order-details">
            <h2>Shipping Address</h2>
            <p>
              ${order.customer.address}<br>
              ${order.customer.city}, ${order.customer.state} ${order.customer.zipCode}<br>
              ${order.customer.country}
            </p>
          </div>
          
          <p>You will receive another email once your order has been approved and is ready to ship.</p>
        </div>
        
        <div class="footer">
          <p>Questions? Contact us at <a href="mailto:${ADMIN_CONFIG.email}">${ADMIN_CONFIG.email}</a> or ${ADMIN_CONFIG.companyPhone}</p>
          <p>${ADMIN_CONFIG.companyName} | ${ADMIN_CONFIG.companyAddress}</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return { subject, text, html };
}

// Generate order approval email for customer
export function generateCustomerApprovalEmail(order: Order): EmailTemplate {
  const subject = `Order #${order.id} Approved - Your jewelry is on its way!`;
  
  const text = `
Dear ${order.customer.firstName},

Great news! Your order #${order.id} has been approved and is now being prepared for shipment.

Order Total: ${formatCurrency(order.subtotal)}
Approved on: ${order.approvedAt ? formatDate(order.approvedAt) : 'N/A'}

Your exquisite jewelry pieces are being carefully prepared and will be shipped to:
${order.customer.address}
${order.customer.city}, ${order.customer.state} ${order.customer.zipCode}
${order.customer.country}

You will receive a tracking number once your order ships.

Thank you for choosing ${ADMIN_CONFIG.companyName}!

Best regards,
The ${ADMIN_CONFIG.companyName} Team
  `;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Order #${order.id} Approved</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #28a745; color: white; padding: 20px; text-align: center; }
        .content { background: #f9f9f9; padding: 20px; }
        .order-details { background: white; padding: 15px; margin: 15px 0; border-radius: 5px; }
        .total { font-weight: bold; font-size: 18px; color: #28a745; }
        .footer { text-align: center; padding: 20px; color: #666; }
        .success { background: #d4edda; border: 1px solid #c3e6cb; color: #155724; padding: 15px; border-radius: 5px; margin: 15px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Order Approved!</h1>
          <p>Order #${order.id}</p>
        </div>
        
        <div class="content">
          <div class="success">
            <strong>✓ Your order has been approved and is being prepared for shipment!</strong>
          </div>
          
          <p>Dear ${order.customer.firstName},</p>
          <p>Great news! Your order has been approved and is now being carefully prepared by our artisans.</p>
          
          <div class="order-details">
            <h2>Order Information</h2>
            <p><strong>Order ID:</strong> ${order.id}</p>
            <p><strong>Total:</strong> <span class="total">${formatCurrency(order.subtotal)}</span></p>
            <p><strong>Approved on:</strong> ${order.approvedAt ? formatDate(order.approvedAt) : 'N/A'}</p>
          </div>
          
          <div class="order-details">
            <h2>Shipping To</h2>
            <p>
              ${order.customer.address}<br>
              ${order.customer.city}, ${order.customer.state} ${order.customer.zipCode}<br>
              ${order.customer.country}
            </p>
          </div>
          
          <p>You will receive a tracking number once your order ships. Thank you for choosing ${ADMIN_CONFIG.companyName}!</p>
        </div>
        
        <div class="footer">
          <p>Questions? Contact us at <a href="mailto:${ADMIN_CONFIG.email}">${ADMIN_CONFIG.email}</a></p>
          <p>${ADMIN_CONFIG.companyName} | ${ADMIN_CONFIG.companyAddress}</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return { subject, text, html };
}
