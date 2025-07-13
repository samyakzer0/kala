import { Order } from '../types/order';

export interface EmailTemplate {
  subject: string;
  text: string;
  html: string;
}

// Professional email templates inspired by Amazon/Shopify
export class KalaEmailTemplates {
  
  // Order Confirmation Email (sent immediately after order)
  static orderConfirmation(order: Order): EmailTemplate {
    const itemsList = order.items.map((item) => 
      `<tr style="border-bottom: 1px solid #e5e7eb;">
        <td style="padding: 12px 8px;">
          <div style="font-weight: 600; color: #111827;">${item.name}</div>
          <div style="font-size: 14px; color: #6b7280; margin-top: 2px;">Category: ${item.category}</div>
        </td>
        <td style="padding: 12px 8px; text-align: center; color: #374151;">${item.quantity}</td>
        <td style="padding: 12px 8px; text-align: right; font-weight: 600; color: #111827;">₹${item.price.toLocaleString()}</td>
        <td style="padding: 12px 8px; text-align: right; font-weight: 600; color: #111827;">₹${(item.price * item.quantity).toLocaleString()}</td>
      </tr>`
    ).join('');

    const estimatedDelivery = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    return {
      subject: `Order Confirmation #${order.id} - Kala Jewelry`,
      text: `
Dear ${order.customer.firstName} ${order.customer.lastName},

Thank you for your order with Kala Jewelry! We've received your order and it's being processed.

ORDER DETAILS:
Order Number: ${order.id}
Order Date: ${new Date(order.createdAt).toLocaleDateString('en-IN')}
Total Amount: ₹${order.subtotal.toLocaleString()}

ITEMS ORDERED:
${order.items.map((item) => `• ${item.name} (Qty: ${item.quantity}) - ₹${item.price.toLocaleString()}`).join('\n')}

SHIPPING ADDRESS:
${order.customer.firstName} ${order.customer.lastName}
${order.customer.address}
${order.customer.city}, ${order.customer.state} ${order.customer.zipCode}
${order.customer.country}

WHAT'S NEXT?
• Our team will review and approve your order within 24 hours
• You'll receive an email confirmation once your order is approved
• Estimated delivery: ${estimatedDelivery}

QUESTIONS?
Reply to this email or contact us at support@kala-jewelry.com
Phone: +91-XXX-XXX-XXXX

Thank you for choosing Kala Jewelry!

Best regards,
The Kala Jewelry Team
      `.trim(),
      html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Confirmation</title>
  <style>
    @media only screen and (max-width: 600px) {
      .container { width: 100% !important; padding: 10px !important; }
      .header { padding: 20px !important; }
      .content { padding: 20px !important; }
      .order-table { font-size: 14px !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc; line-height: 1.6;">
  
  <div class="container" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);">
    
    <!-- Header -->
    <div class="header" style="background: linear-gradient(135deg, #8B4513 0%, #A0522D 100%); color: #ffffff; padding: 40px 30px; text-align: center;">
      <h1 style="margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -0.5px;">Kala Jewelry</h1>
      <div style="width: 60px; height: 3px; background-color: rgba(255,255,255,0.3); margin: 15px auto; border-radius: 2px;"></div>
      <h2 style="margin: 15px 0 0 0; font-size: 24px; font-weight: 600;">Order Confirmed!</h2>
      <p style="margin: 8px 0 0 0; opacity: 0.9; font-size: 16px;">Thank you for your purchase</p>
    </div>
    
    <!-- Main Content -->
    <div class="content" style="padding: 40px 30px;">
      
      <!-- Greeting -->
      <p style="color: #374151; margin: 0 0 25px 0; font-size: 16px;">
        Hello <strong>${order.customer.firstName} ${order.customer.lastName}</strong>,
      </p>
      
      <p style="color: #374151; margin: 0 0 30px 0; font-size: 16px;">
        We've received your order and our skilled artisans are excited to create something beautiful for you! 
        Your order is currently being reviewed and will be processed within 24 hours.
      </p>
      
      <!-- Order Info Box -->
      <div style="background-color: #f8fafc; border: 1px solid #e5e7eb; border-radius: 8px; padding: 25px; margin: 30px 0;">
        <h3 style="color: #8B4513; margin: 0 0 20px 0; font-size: 18px; font-weight: 600;">Order Summary</h3>
        
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; padding-bottom: 12px; border-bottom: 1px solid #e5e7eb;">
          <span style="color: #6b7280; font-size: 14px;">Order Number</span>
          <span style="font-family: 'Courier New', monospace; background: #e5e7eb; padding: 4px 8px; border-radius: 4px; font-size: 14px; font-weight: 600;">#${order.id}</span>
        </div>
        
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; padding-bottom: 12px; border-bottom: 1px solid #e5e7eb;">
          <span style="color: #6b7280; font-size: 14px;">Order Date</span>
          <span style="font-size: 14px; color: #374151;">${new Date(order.createdAt).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>
        
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; padding-bottom: 12px; border-bottom: 1px solid #e5e7eb;">
          <span style="color: #6b7280; font-size: 14px;">Status</span>
          <span style="background: #fef3c7; color: #92400e; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; text-transform: uppercase;">Pending Review</span>
        </div>
        
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span style="color: #6b7280; font-size: 14px;">Total Amount</span>
          <span style="font-size: 18px; font-weight: 700; color: #8B4513;">₹${order.subtotal.toLocaleString()}</span>
        </div>
      </div>
      
      <!-- Items Table -->
      <div style="margin: 30px 0;">
        <h3 style="color: #111827; margin: 0 0 20px 0; font-size: 18px; font-weight: 600;">Items Ordered</h3>
        <table class="order-table" style="width: 100%; border-collapse: collapse; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
          <thead>
            <tr style="background-color: #f9fafb;">
              <th style="padding: 15px 8px; text-align: left; font-weight: 600; color: #374151; font-size: 14px; border-bottom: 1px solid #e5e7eb;">Item</th>
              <th style="padding: 15px 8px; text-align: center; font-weight: 600; color: #374151; font-size: 14px; border-bottom: 1px solid #e5e7eb;">Qty</th>
              <th style="padding: 15px 8px; text-align: right; font-weight: 600; color: #374151; font-size: 14px; border-bottom: 1px solid #e5e7eb;">Price</th>
              <th style="padding: 15px 8px; text-align: right; font-weight: 600; color: #374151; font-size: 14px; border-bottom: 1px solid #e5e7eb;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsList}
          </tbody>
          <tfoot>
            <tr style="background-color: #f9fafb; font-weight: 600;">
              <td colspan="3" style="padding: 15px 8px; text-align: right; color: #374151; border-top: 2px solid #e5e7eb;">Total Amount:</td>
              <td style="padding: 15px 8px; text-align: right; color: #8B4513; font-size: 18px; border-top: 2px solid #e5e7eb;">₹${order.subtotal.toLocaleString()}</td>
            </tr>
          </tfoot>
        </table>
      </div>
      
      <!-- Shipping Address -->
      <div style="background-color: #f8fafc; border: 1px solid #e5e7eb; border-radius: 8px; padding: 25px; margin: 30px 0;">
        <h3 style="color: #8B4513; margin: 0 0 15px 0; font-size: 18px; font-weight: 600;">Shipping Address</h3>
        <div style="color: #374151; line-height: 1.5;">
          <div style="font-weight: 600; margin-bottom: 5px;">${order.customer.firstName} ${order.customer.lastName}</div>
          <div>${order.customer.address}</div>
          <div>${order.customer.city}, ${order.customer.state} ${order.customer.zipCode}</div>
          <div>${order.customer.country}</div>
          <div style="margin-top: 10px; color: #6b7280;">
            <strong>Phone:</strong> ${order.customer.phone}<br>
            <strong>Email:</strong> ${order.customer.email}
          </div>
        </div>
      </div>
      
      <!-- What's Next -->
      <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border-radius: 8px; padding: 25px; margin: 30px 0;">
        <h3 style="color: #92400e; margin: 0 0 15px 0; font-size: 18px; font-weight: 600;">What Happens Next?</h3>
        <ul style="color: #92400e; margin: 0; padding-left: 20px; line-height: 1.8;">
          <li>Our team will review and approve your order within <strong>24 hours</strong></li>
          <li>You'll receive an email confirmation once your order is approved</li>
          <li>Our artisans will carefully craft your jewelry</li>
          <li>Estimated delivery: <strong>${estimatedDelivery}</strong></li>
        </ul>
      </div>
      
      <!-- Support -->
      <div style="text-align: center; margin: 40px 0 0 0; padding: 25px 0; border-top: 1px solid #e5e7eb;">
        <h3 style="color: #374151; margin: 0 0 15px 0; font-size: 16px; font-weight: 600;">Need Help?</h3>
        <p style="color: #6b7280; margin: 0 0 15px 0; font-size: 14px;">
          Our customer support team is here to help you
        </p>
        <div style="margin: 15px 0;">
          <a href="mailto:support@kala-jewelry.com" style="color: #8B4513; text-decoration: none; font-weight: 600;">support@kala-jewelry.com</a>
          <span style="color: #d1d5db; margin: 0 10px;">|</span>
          <span style="color: #6b7280;">+91-XXX-XXX-XXXX</span>
        </div>
      </div>
      
    </div>
    
    <!-- Footer -->
    <div style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
      <p style="color: #6b7280; margin: 0 0 10px 0; font-size: 14px;">
        Thank you for choosing Kala Jewelry
      </p>
      <p style="color: #9ca3af; margin: 0; font-size: 12px;">
        This email was sent to ${order.customer.email}
      </p>
      <div style="margin: 15px 0 0 0;">
        <span style="color: #9ca3af; font-size: 12px;">© 2024 Kala Jewelry. All rights reserved.</span>
      </div>
    </div>
    
  </div>
  
</body>
</html>
      `
    };
  }

  // Order Approval Email (sent when admin approves order)
  static orderApproval(order: Order): EmailTemplate {
    const estimatedDelivery = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    return {
      subject: `Great News! Your Order #${order.id} Has Been Approved - Kala Jewelry`,
      text: `
Dear ${order.customer.firstName} ${order.customer.lastName},

Excellent news! Your order has been approved and is now being processed by our skilled artisans.

ORDER DETAILS:
Order Number: ${order.id}
Approval Date: ${new Date().toLocaleDateString('en-IN')}
Total Amount: ₹${order.subtotal.toLocaleString()}

WHAT'S HAPPENING NOW?
• Your order is now in production
• Our artisans are carefully crafting your jewelry
• You'll receive updates as your order progresses
• Estimated completion and delivery: ${estimatedDelivery}

You can track your order status anytime by visiting our website or replying to this email.

Thank you for your patience and for choosing Kala Jewelry!

Best regards,
The Kala Jewelry Team
      `.trim(),
      html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Approved</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc; line-height: 1.6;">
  
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);">
    
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #059669 0%, #10b981 100%); color: #ffffff; padding: 40px 30px; text-align: center;">
      <h1 style="margin: 0; font-size: 32px; font-weight: 700;">Kala Jewelry</h1>
      <div style="width: 60px; height: 3px; background-color: rgba(255,255,255,0.3); margin: 15px auto; border-radius: 2px;"></div>
      <h2 style="margin: 15px 0 0 0; font-size: 24px; font-weight: 600;">🎉 Order Approved!</h2>
      <p style="margin: 8px 0 0 0; opacity: 0.9; font-size: 16px;">Your jewelry is now in production</p>
    </div>
    
    <!-- Main Content -->
    <div style="padding: 40px 30px;">
      
      <p style="color: #374151; margin: 0 0 25px 0; font-size: 16px;">
        Hello <strong>${order.customer.firstName}</strong>,
      </p>
      
      <p style="color: #374151; margin: 0 0 30px 0; font-size: 16px;">
        Fantastic news! Your order has been approved and our skilled artisans have begun crafting your beautiful jewelry. 
        We're excited to create something truly special for you!
      </p>
      
      <!-- Status Update -->
      <div style="background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%); border-radius: 8px; padding: 25px; margin: 30px 0; text-align: center;">
        <div style="font-size: 48px; margin-bottom: 15px;">✅</div>
        <h3 style="color: #065f46; margin: 0 0 10px 0; font-size: 20px; font-weight: 600;">Order Approved</h3>
        <p style="color: #059669; margin: 0; font-size: 16px;">Your order #${order.id} is now in production</p>
      </div>
      
      <!-- Timeline -->
      <div style="background-color: #f8fafc; border: 1px solid #e5e7eb; border-radius: 8px; padding: 25px; margin: 30px 0;">
        <h3 style="color: #8B4513; margin: 0 0 20px 0; font-size: 18px; font-weight: 600;">What's Happening Now</h3>
        
        <div style="position: relative; padding-left: 30px;">
          <div style="position: absolute; left: 8px; top: 8px; width: 8px; height: 8px; background-color: #10b981; border-radius: 50%;"></div>
          <div style="margin-bottom: 20px;">
            <div style="font-weight: 600; color: #374151; margin-bottom: 5px;">Order Approved ✅</div>
            <div style="color: #6b7280; font-size: 14px;">Your order has been reviewed and approved</div>
          </div>
        </div>
        
        <div style="position: relative; padding-left: 30px;">
          <div style="position: absolute; left: 8px; top: 8px; width: 8px; height: 8px; background-color: #f59e0b; border-radius: 50%;"></div>
          <div style="margin-bottom: 20px;">
            <div style="font-weight: 600; color: #374151; margin-bottom: 5px;">In Production 🔨</div>
            <div style="color: #6b7280; font-size: 14px;">Our artisans are carefully crafting your jewelry</div>
          </div>
        </div>
        
        <div style="position: relative; padding-left: 30px;">
          <div style="position: absolute; left: 8px; top: 8px; width: 8px; height: 8px; background-color: #d1d5db; border-radius: 50%;"></div>
          <div>
            <div style="font-weight: 600; color: #9ca3af; margin-bottom: 5px;">Ready for Delivery 📦</div>
            <div style="color: #9ca3af; font-size: 14px;">Estimated: ${estimatedDelivery}</div>
          </div>
        </div>
      </div>
      
      <!-- Order Details -->
      <div style="background-color: #f8fafc; border: 1px solid #e5e7eb; border-radius: 8px; padding: 25px; margin: 30px 0;">
        <h3 style="color: #8B4513; margin: 0 0 15px 0; font-size: 18px; font-weight: 600;">Order Details</h3>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
          <span style="color: #6b7280;">Order Number:</span>
          <span style="font-family: 'Courier New', monospace; background: #e5e7eb; padding: 4px 8px; border-radius: 4px; font-weight: 600;">#${order.id}</span>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span style="color: #6b7280;">Total Amount:</span>
          <span style="font-weight: 700; color: #8B4513; font-size: 18px;">₹${order.subtotal.toLocaleString()}</span>
        </div>
      </div>
      
      <!-- CTA Button -->
      <div style="text-align: center; margin: 30px 0;">
        <a href="${process.env.NEXT_PUBLIC_SITE_URL}/track-order" style="display: inline-block; background-color: #8B4513; color: #ffffff; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">Track Your Order</a>
      </div>
      
      <!-- Support -->
      <div style="text-align: center; margin: 40px 0 0 0; padding: 25px 0; border-top: 1px solid #e5e7eb;">
        <p style="color: #6b7280; margin: 0 0 15px 0; font-size: 14px;">
          Questions about your order? We're here to help!
        </p>
        <a href="mailto:support@kala-jewelry.com" style="color: #8B4513; text-decoration: none; font-weight: 600;">support@kala-jewelry.com</a>
      </div>
      
    </div>
    
    <!-- Footer -->
    <div style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
      <p style="color: #6b7280; margin: 0 0 10px 0; font-size: 14px;">
        Thank you for choosing Kala Jewelry
      </p>
      <p style="color: #9ca3af; margin: 0; font-size: 12px;">
        © 2024 Kala Jewelry. All rights reserved.
      </p>
    </div>
    
  </div>
  
</body>
</html>
      `
    };
  }

  // Order Delivery Confirmation Email (sent when admin marks as delivered)
  static orderDelivered(order: Order): EmailTemplate {
    return {
      subject: `Your Order #${order.id} Has Been Delivered! - Kala Jewelry`,
      text: `
Dear ${order.customer.firstName} ${order.customer.lastName},

Wonderful news! Your Kala Jewelry order has been delivered successfully.

ORDER DETAILS:
Order Number: ${order.id}
Delivery Date: ${new Date().toLocaleDateString('en-IN')}
Total Amount: ₹${order.subtotal.toLocaleString()}

JEWELRY CARE INSTRUCTIONS:
• Store in a cool, dry place away from direct sunlight
• Clean gently with a soft cloth after each wear
• Avoid contact with perfumes, lotions, and chemicals
• Store each piece separately to prevent scratching
• For deep cleaning, use mild soap and warm water

We hope you absolutely love your new jewelry! Your satisfaction means the world to us.

SHARE YOUR EXPERIENCE:
We'd love to hear about your experience and see how you style your new jewelry. 
Tag us on social media @kalajewelry or leave us a review.

Thank you for choosing Kala Jewelry. We look forward to serving you again!

Best regards,
The Kala Jewelry Team
      `.trim(),
      html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Delivered</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc; line-height: 1.6;">
  
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);">
    
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #7c3aed 0%, #8b5cf6 100%); color: #ffffff; padding: 40px 30px; text-align: center;">
      <h1 style="margin: 0; font-size: 32px; font-weight: 700;">Kala Jewelry</h1>
      <div style="width: 60px; height: 3px; background-color: rgba(255,255,255,0.3); margin: 15px auto; border-radius: 2px;"></div>
      <h2 style="margin: 15px 0 0 0; font-size: 24px; font-weight: 600;">🎉 Delivered!</h2>
      <p style="margin: 8px 0 0 0; opacity: 0.9; font-size: 16px;">Your jewelry has arrived</p>
    </div>
    
    <!-- Main Content -->
    <div style="padding: 40px 30px;">
      
      <p style="color: #374151; margin: 0 0 25px 0; font-size: 16px;">
        Hello <strong>${order.customer.firstName}</strong>,
      </p>
      
      <p style="color: #374151; margin: 0 0 30px 0; font-size: 16px;">
        Wonderful news! Your beautiful Kala Jewelry order has been delivered successfully. 
        We hope you absolutely love your new pieces!
      </p>
      
      <!-- Delivery Confirmation -->
      <div style="background: linear-gradient(135deg, #ddd6fe 0%, #c4b5fd 100%); border-radius: 8px; padding: 25px; margin: 30px 0; text-align: center;">
        <div style="font-size: 48px; margin-bottom: 15px;">📦</div>
        <h3 style="color: #5b21b6; margin: 0 0 10px 0; font-size: 20px; font-weight: 600;">Order Delivered</h3>
        <p style="color: #7c3aed; margin: 0 0 15px 0; font-size: 16px;">Order #${order.id} • ${new Date().toLocaleDateString('en-IN')}</p>
        <div style="background-color: rgba(139, 92, 246, 0.1); border-radius: 6px; padding: 10px; display: inline-block;">
          <span style="color: #5b21b6; font-weight: 600;">₹${order.subtotal.toLocaleString()}</span>
        </div>
      </div>
      
      <!-- Care Instructions -->
      <div style="background-color: #fefce8; border: 1px solid #fde047; border-radius: 8px; padding: 25px; margin: 30px 0;">
        <h3 style="color: #a16207; margin: 0 0 20px 0; font-size: 18px; font-weight: 600; display: flex; align-items: center;">
          <span style="margin-right: 10px;">💎</span>
          Jewelry Care Instructions
        </h3>
        <ul style="color: #92400e; margin: 0; padding-left: 20px; line-height: 1.8;">
          <li>Store in a cool, dry place away from direct sunlight</li>
          <li>Clean gently with a soft cloth after each wear</li>
          <li>Avoid contact with perfumes, lotions, and chemicals</li>
          <li>Store each piece separately to prevent scratching</li>
          <li>For deep cleaning, use mild soap and warm water</li>
        </ul>
        <div style="background-color: #fef3c7; border-radius: 6px; padding: 15px; margin-top: 20px;">
          <p style="color: #92400e; margin: 0; font-size: 14px; font-style: italic;">
            💡 <strong>Pro tip:</strong> Regular care will keep your jewelry looking beautiful for years to come!
          </p>
        </div>
      </div>
      
      <!-- Review Request -->
      <div style="background-color: #f0f9ff; border: 1px solid #7dd3fc; border-radius: 8px; padding: 25px; margin: 30px 0; text-align: center;">
        <h3 style="color: #0369a1; margin: 0 0 15px 0; font-size: 18px; font-weight: 600;">Love Your New Jewelry?</h3>
        <p style="color: #0284c7; margin: 0 0 20px 0; font-size: 16px;">
          We'd love to hear about your experience and see how you style your new pieces!
        </p>
        <div style="margin: 20px 0;">
          <a href="mailto:reviews@kala-jewelry.com?subject=Review for Order ${order.id}" style="display: inline-block; background-color: #0369a1; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 5px;">Leave a Review</a>
          <a href="#" style="display: inline-block; background-color: #7c3aed; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 5px;">Share on Social</a>
        </div>
        <p style="color: #0284c7; margin: 15px 0 0 0; font-size: 14px;">
          Tag us @kalajewelry to be featured on our page!
        </p>
      </div>
      
      <!-- Support -->
      <div style="text-align: center; margin: 40px 0 0 0; padding: 25px 0; border-top: 1px solid #e5e7eb;">
        <h3 style="color: #374151; margin: 0 0 15px 0; font-size: 16px; font-weight: 600;">Need Assistance?</h3>
        <p style="color: #6b7280; margin: 0 0 15px 0; font-size: 14px;">
          Our customer support team is always here to help
        </p>
        <div style="margin: 15px 0;">
          <a href="mailto:support@kala-jewelry.com" style="color: #8B4513; text-decoration: none; font-weight: 600;">support@kala-jewelry.com</a>
          <span style="color: #d1d5db; margin: 0 10px;">|</span>
          <span style="color: #6b7280;">+91-XXX-XXX-XXXX</span>
        </div>
      </div>
      
    </div>
    
    <!-- Footer -->
    <div style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
      <p style="color: #6b7280; margin: 0 0 10px 0; font-size: 14px;">
        Thank you for choosing Kala Jewelry
      </p>
      <p style="color: #9ca3af; margin: 0 0 15px 0; font-size: 12px;">
        We look forward to serving you again!
      </p>
      <div style="margin: 15px 0 0 0;">
        <span style="color: #9ca3af; font-size: 12px;">© 2024 Kala Jewelry. All rights reserved.</span>
      </div>
    </div>
    
  </div>
  
</body>
</html>
      `
    };
  }

  // Admin notification email template
  static adminOrderNotification(order: Order): EmailTemplate {
    const itemsList = order.items.map((item) => 
      `• ${item.name} (${item.category}) - Qty: ${item.quantity} - ₹${item.price.toLocaleString()}`
    ).join('\n');

    return {
      subject: `New Order Received - #${order.id} - ₹${order.subtotal.toLocaleString()}`,
      text: `
New Order Alert - Kala Jewelry Admin

A new order has been received and requires your review.

ORDER DETAILS:
Order Number: ${order.id}
Customer: ${order.customer.firstName} ${order.customer.lastName}
Email: ${order.customer.email}
Phone: ${order.customer.phone}
Order Date: ${new Date(order.createdAt).toLocaleDateString('en-IN')}
Total Amount: ₹${order.subtotal.toLocaleString()}

ITEMS ORDERED:
${itemsList}

SHIPPING ADDRESS:
${order.customer.firstName} ${order.customer.lastName}
${order.customer.address}
${order.customer.city}, ${order.customer.state} ${order.customer.zipCode}
${order.customer.country}

ACTION REQUIRED:
Please review this order in the admin panel and approve or reject it.
Admin Panel: ${process.env.NEXT_PUBLIC_SITE_URL}/admin

This is an automated notification from Kala Jewelry E-commerce System.
      `.trim(),
      html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Order Alert</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc;">
  
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);">
    
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%); color: #ffffff; padding: 30px; text-align: center;">
      <h1 style="margin: 0; font-size: 24px; font-weight: 700;">🚨 New Order Alert</h1>
      <p style="margin: 10px 0 0 0; opacity: 0.9;">Kala Jewelry Admin Panel</p>
    </div>
    
    <!-- Content -->
    <div style="padding: 30px;">
      <div style="background-color: #fef2f2; border-left: 4px solid #dc2626; padding: 20px; margin-bottom: 30px;">
        <h2 style="color: #dc2626; margin: 0 0 10px 0; font-size: 18px;">Action Required</h2>
        <p style="color: #7f1d1d; margin: 0;">A new order has been received and requires your review.</p>
      </div>
      
      <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin: 20px 0;">
        <h3 style="margin: 0 0 15px 0; color: #374151;">Order Information</h3>
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
          <span style="color: #6b7280;">Order Number:</span>
          <strong>#${order.id}</strong>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
          <span style="color: #6b7280;">Customer:</span>
          <strong>${order.customer.firstName} ${order.customer.lastName}</strong>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
          <span style="color: #6b7280;">Email:</span>
          <a href="mailto:${order.customer.email}" style="color: #8B4513;">${order.customer.email}</a>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
          <span style="color: #6b7280;">Phone:</span>
          <span>${order.customer.phone}</span>
        </div>
        <div style="display: flex; justify-content: space-between;">
          <span style="color: #6b7280;">Total Amount:</span>
          <strong style="color: #dc2626; font-size: 18px;">₹${order.subtotal.toLocaleString()}</strong>
        </div>
      </div>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${process.env.NEXT_PUBLIC_SITE_URL}/admin" style="display: inline-block; background-color: #dc2626; color: #ffffff; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: 600;">Review in Admin Panel</a>
      </div>
      
    </div>
    
  </div>
  
</body>
</html>
      `
    };
  }
}
