import nodemailer from 'nodemailer';

// Enhanced email template interface
export interface EmailTemplate {
  subject: string;
  text: string;
  html: string;
}

// Email service configuration
const EMAIL_CONFIG = {
  service: 'gmail',
  from: process.env.EMAIL_FROM || 'noreply@kala-jewelry.com',
  adminEmail: process.env.ADMIN_EMAIL || 'admin@kala-jewelry.com',
  replyTo: process.env.EMAIL_REPLY_TO || 'support@kala-jewelry.com',
  
  // Gmail SMTP configuration
  smtp: {
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  },
  
  // SendGrid configuration
  sendgrid: {
    apiKey: process.env.SENDGRID_API_KEY
  },
  
  // Mailgun configuration
  mailgun: {
    apiKey: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_DOMAIN
  }
};

// Create transporter based on available configuration
function createTransporter(): nodemailer.Transporter | null {
  try {
    // Try Gmail SMTP first
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      console.log('📧 Using Gmail SMTP for email delivery');
      return nodemailer.createTransporter(EMAIL_CONFIG.smtp);
    }
    
    // TODO: Add SendGrid and Mailgun transporters here when needed
    
    console.log('⚠️ No email credentials configured. Running in simulation mode.');
    return null;
    
  } catch (error) {
    console.error('❌ Error creating email transporter:', error);
    return null;
  }
}

// Enhanced email sending function
export async function sendEmail(
  to: string | string[],
  template: EmailTemplate,
  options?: {
    from?: string;
    replyTo?: string;
    attachments?: Array<{
      filename: string;
      content: Buffer | string;
      contentType?: string;
    }>;
  }
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    const transporter = createTransporter();
    
    if (!transporter) {
      // Simulate email sending for development
      console.log('📧 Simulating email delivery:');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('📍 To:', Array.isArray(to) ? to.join(', ') : to);
      console.log('📋 Subject:', template.subject);
      console.log('👤 From:', options?.from || EMAIL_CONFIG.from);
      console.log('💬 Preview:', template.text.substring(0, 100) + '...');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const simulatedId = `sim_${Date.now()}_${Math.random().toString(36).substring(7)}`;
      console.log('✅ Email delivered successfully (simulated)');
      console.log('🆔 Message ID:', simulatedId);
      console.log('');
      
      return { success: true, messageId: simulatedId };
    }
    
    // Send real email
    const mailOptions = {
      from: `Kala Jewelry <${options?.from || EMAIL_CONFIG.from}>`,
      to: Array.isArray(to) ? to.join(', ') : to,
      subject: template.subject,
      text: template.text,
      html: template.html,
      replyTo: options?.replyTo || EMAIL_CONFIG.replyTo,
      attachments: options?.attachments
    };
    
    console.log('📧 Sending email via SMTP...');
    console.log('📍 To:', mailOptions.to);
    console.log('📋 Subject:', template.subject);
    
    const info = await transporter.sendMail(mailOptions);
    
    console.log('✅ Email sent successfully!');
    console.log('🆔 Message ID:', info.messageId);
    console.log('📊 Response:', info.response);
    
    return { success: true, messageId: info.messageId };
    
  } catch (error) {
    console.error('❌ Email delivery failed:', error);
    
    // Return detailed error information
    const errorMessage = error instanceof Error ? error.message : 'Unknown email error';
    return { 
      success: false, 
      error: errorMessage
    };
  }
}

// Email template generators
export class EmailTemplates {
  
  static orderConfirmation(order: any): EmailTemplate {
    const itemsList = order.items.map((item: any) => 
      `<tr>
        <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${item.name}</td>
        <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; text-align: center;">${item.quantity}</td>
        <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; text-align: right;">₹${item.price.toLocaleString()}</td>
      </tr>`
    ).join('');

    return {
      subject: `Order Confirmation - ${order.id}`,
      text: `
Dear ${order.customer.firstName} ${order.customer.lastName},

Thank you for your order! We've received your request and it's being reviewed.

Order ID: ${order.id}
Total: ₹${order.subtotal.toLocaleString()}

Items:
${order.items.map((item: any) => `- ${item.name} (Qty: ${item.quantity}) - ₹${item.price.toLocaleString()}`).join('\n')}

We'll notify you once your order is approved and ready for shipment.

Best regards,
Kala Jewelry Team
      `.trim(),
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Confirmation</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f9fafb;">
  <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
    
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #8B4513 0%, #A0522D 100%); color: white; padding: 30px; text-align: center;">
      <h1 style="margin: 0; font-size: 28px; font-weight: bold;">Order Confirmed!</h1>
      <p style="margin: 10px 0 0 0; opacity: 0.9;">Thank you for choosing Kala Jewelry</p>
    </div>
    
    <!-- Content -->
    <div style="padding: 30px;">
      <p style="color: #374151; line-height: 1.6; margin: 0 0 20px 0;">
        Dear <strong>${order.customer.firstName} ${order.customer.lastName}</strong>,
      </p>
      
      <p style="color: #374151; line-height: 1.6; margin: 0 0 20px 0;">
        We've received your order and our artisans are excited to create something beautiful for you! 
        Your order is currently being reviewed and will be processed shortly.
      </p>
      
      <!-- Order Summary -->
      <div style="background-color: #f9fafb; border-radius: 8px; padding: 20px; margin: 20px 0;">
        <h3 style="color: #8B4513; margin: 0 0 15px 0;">Order Summary</h3>
        <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
          <strong>Order ID:</strong>
          <span style="font-family: monospace; background: #e5e7eb; padding: 2px 6px; border-radius: 4px;">${order.id}</span>
        </div>
        <div style="display: flex; justify-content: space-between;">
          <strong>Total Amount:</strong>
          <strong style="color: #8B4513;">₹${order.subtotal.toLocaleString()}</strong>
        </div>
      </div>
      
      <!-- Items Table -->
      <h3 style="color: #8B4513; margin: 25px 0 15px 0;">Items Ordered</h3>
      <table style="width: 100%; border-collapse: collapse; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
        <thead>
          <tr style="background-color: #f3f4f6;">
            <th style="padding: 12px; text-align: left; color: #374151; font-weight: 600; border-bottom: 1px solid #e5e7eb;">Item</th>
            <th style="padding: 12px; text-align: center; color: #374151; font-weight: 600; border-bottom: 1px solid #e5e7eb;">Qty</th>
            <th style="padding: 12px; text-align: right; color: #374151; font-weight: 600; border-bottom: 1px solid #e5e7eb;">Price</th>
          </tr>
        </thead>
        <tbody>
          ${itemsList}
        </tbody>
      </table>
      
      <!-- Delivery Info -->
      <div style="background-color: #fefce8; border-left: 4px solid #eab308; padding: 15px; margin: 25px 0; border-radius: 0 8px 8px 0;">
        <h4 style="color: #92400e; margin: 0 0 10px 0;">📍 Delivery Address</h4>
        <p style="color: #92400e; margin: 0; line-height: 1.5;">
          ${order.customer.address}<br>
          ${order.customer.city}, ${order.customer.state} ${order.customer.zipCode}<br>
          ${order.customer.country}
        </p>
      </div>
      
      <!-- Next Steps -->
      <div style="background-color: #f0f9ff; border-radius: 8px; padding: 20px; margin: 25px 0;">
        <h4 style="color: #0369a1; margin: 0 0 10px 0;">What happens next?</h4>
        <ul style="color: #0369a1; margin: 0; padding-left: 20px;">
          <li>Our team will review your order within 24 hours</li>
          <li>You'll receive an approval notification via email</li>
          <li>Your jewelry will be carefully crafted and shipped</li>
          <li>Track your order anytime using your Order ID</li>
        </ul>
      </div>
      
      <!-- Contact -->
      <div style="text-align: center; padding: 20px 0; border-top: 1px solid #e5e7eb; margin-top: 30px;">
        <p style="color: #6b7280; margin: 0 0 15px 0;">Questions about your order?</p>
        <div style="display: inline-flex; gap: 15px;">
          <a href="mailto:support@kala-jewelry.com" style="color: #8B4513; text-decoration: none; padding: 8px 16px; border: 1px solid #8B4513; border-radius: 6px; display: inline-block;">
            📧 Email Support
          </a>
          <a href="tel:+1-555-0123" style="color: #8B4513; text-decoration: none; padding: 8px 16px; border: 1px solid #8B4513; border-radius: 6px; display: inline-block;">
            📞 Call Us
          </a>
        </div>
      </div>
    </div>
    
    <!-- Footer -->
    <div style="background-color: #f9fafb; padding: 20px; text-align: center; color: #6b7280; font-size: 14px;">
      <p style="margin: 0;">© 2024 Kala Jewelry. Crafting beauty, one piece at a time.</p>
      <p style="margin: 5px 0 0 0;">
        <a href="#" style="color: #8B4513; text-decoration: none;">Unsubscribe</a> | 
        <a href="#" style="color: #8B4513; text-decoration: none;">Privacy Policy</a>
      </p>
    </div>
  </div>
</body>
</html>
      `
    };
  }

  static adminNotification(order: any): EmailTemplate {
    return {
      subject: `New Order Received - ${order.id}`,
      text: `
New order received for review:

Order ID: ${order.id}
Customer: ${order.customer.firstName} ${order.customer.lastName}
Email: ${order.customer.email}
Phone: ${order.customer.phone}
Total: ₹${order.subtotal.toLocaleString()}

Items:
${order.items.map((item: any) => `- ${item.name} (Qty: ${item.quantity}) - ₹${item.price.toLocaleString()}`).join('\n')}

Address:
${order.customer.address}
${order.customer.city}, ${order.customer.state} ${order.customer.zipCode}
${order.customer.country}

Please review and approve/reject this order in the admin panel.
      `.trim(),
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Order - Admin Notification</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f9fafb;">
  <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
    
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%); color: white; padding: 25px; text-align: center;">
      <h1 style="margin: 0; font-size: 24px; font-weight: bold;">🔔 New Order Alert</h1>
      <p style="margin: 10px 0 0 0; opacity: 0.9;">Order ${order.id} requires your attention</p>
    </div>
    
    <!-- Content -->
    <div style="padding: 25px;">
      <div style="background-color: #fee2e2; border-left: 4px solid #dc2626; padding: 15px; margin-bottom: 20px; border-radius: 0 6px 6px 0;">
        <p style="color: #991b1b; margin: 0; font-weight: 600;">⚡ Action Required: Please review this order</p>
      </div>
      
      <!-- Customer Info -->
      <div style="background-color: #f9fafb; border-radius: 8px; padding: 20px; margin: 20px 0;">
        <h3 style="color: #374151; margin: 0 0 15px 0;">👤 Customer Information</h3>
        <table style="width: 100%; color: #374151;">
          <tr><td style="padding: 5px 0;"><strong>Name:</strong></td><td>${order.customer.firstName} ${order.customer.lastName}</td></tr>
          <tr><td style="padding: 5px 0;"><strong>Email:</strong></td><td><a href="mailto:${order.customer.email}" style="color: #dc2626;">${order.customer.email}</a></td></tr>
          <tr><td style="padding: 5px 0;"><strong>Phone:</strong></td><td><a href="tel:${order.customer.phone}" style="color: #dc2626;">${order.customer.phone}</a></td></tr>
          <tr><td style="padding: 5px 0; vertical-align: top;"><strong>Address:</strong></td><td>${order.customer.address}<br>${order.customer.city}, ${order.customer.state} ${order.customer.zipCode}<br>${order.customer.country}</td></tr>
        </table>
      </div>
      
      <!-- Order Details -->
      <div style="background-color: #f0f9ff; border-radius: 8px; padding: 20px; margin: 20px 0;">
        <h3 style="color: #374151; margin: 0 0 15px 0;">📦 Order Details</h3>
        <div style="display: flex; justify-content: space-between; margin-bottom: 15px; padding: 10px; background: white; border-radius: 6px;">
          <span><strong>Order ID:</strong></span>
          <span style="font-family: monospace; background: #e5e7eb; padding: 2px 6px; border-radius: 4px;">${order.id}</span>
        </div>
        <div style="display: flex; justify-content: space-between; padding: 10px; background: white; border-radius: 6px;">
          <span><strong>Total Amount:</strong></span>
          <strong style="color: #dc2626; font-size: 18px;">₹${order.subtotal.toLocaleString()}</strong>
        </div>
      </div>
      
      <!-- Items -->
      <h3 style="color: #374151; margin: 25px 0 15px 0;">🛍️ Items Ordered</h3>
      <div style="border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
        ${order.items.map((item: any) => `
          <div style="padding: 15px; border-bottom: 1px solid #e5e7eb; display: flex; justify-content: space-between; align-items: center;">
            <div>
              <strong style="color: #374151;">${item.name}</strong><br>
              <small style="color: #6b7280;">Category: ${item.category}</small>
            </div>
            <div style="text-align: right;">
              <div style="color: #374151;">Qty: <strong>${item.quantity}</strong></div>
              <div style="color: #dc2626; font-weight: 600;">₹${item.price.toLocaleString()}</div>
            </div>
          </div>
        `).join('')}
      </div>
      
      <!-- Action Buttons -->
      <div style="text-align: center; padding: 30px 0;">
        <p style="color: #374151; margin: 0 0 20px 0; font-weight: 600;">Ready to take action?</p>
        <div style="display: inline-flex; gap: 15px;">
          <a href="#" style="background-color: #16a34a; color: white; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; display: inline-block;">
            ✅ Approve Order
          </a>
          <a href="#" style="background-color: #dc2626; color: white; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; display: inline-block;">
            ❌ Reject Order
          </a>
        </div>
        <p style="color: #6b7280; margin: 15px 0 0 0; font-size: 14px;">Or manage this order in your admin panel</p>
      </div>
    </div>
    
    <!-- Footer -->
    <div style="background-color: #f9fafb; padding: 15px; text-align: center; color: #6b7280; font-size: 14px;">
      <p style="margin: 0;">Kala Jewelry Admin Dashboard</p>
    </div>
  </div>
</body>
</html>
      `
    };
  }

  static orderApproved(order: any): EmailTemplate {
    return {
      subject: `Great News! Your Order ${order.id} has been Approved`,
      text: `
Dear ${order.customer.firstName} ${order.customer.lastName},

Wonderful news! Your order has been approved and our skilled artisans are now preparing your beautiful jewelry.

Order ID: ${order.id}
Status: Approved ✅
Total: ₹${order.subtotal.toLocaleString()}

Your order will be carefully crafted and shipped within 3-5 business days. You'll receive a tracking number once it's dispatched.

Thank you for choosing Kala Jewelry!

Best regards,
Kala Jewelry Team
      `.trim(),
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Approved</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f9fafb;">
  <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
    
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #16a34a 0%, #22c55e 100%); color: white; padding: 30px; text-align: center;">
      <div style="font-size: 48px; margin-bottom: 10px;">🎉</div>
      <h1 style="margin: 0; font-size: 28px; font-weight: bold;">Order Approved!</h1>
      <p style="margin: 10px 0 0 0; opacity: 0.9;">Your jewelry is being crafted with love</p>
    </div>
    
    <!-- Content -->
    <div style="padding: 30px;">
      <p style="color: #374151; line-height: 1.6; margin: 0 0 20px 0; font-size: 16px;">
        Dear <strong>${order.customer.firstName} ${order.customer.lastName}</strong>,
      </p>
      
      <p style="color: #374151; line-height: 1.6; margin: 0 0 25px 0; font-size: 16px;">
        We're thrilled to let you know that your order has been <strong style="color: #16a34a;">approved</strong>! 
        Our master artisans are now carefully crafting your exquisite jewelry with the finest attention to detail.
      </p>
      
      <!-- Status Update -->
      <div style="background: linear-gradient(135deg, #ecfdf5 0%, #f0fdf4 100%); border-radius: 12px; padding: 25px; margin: 25px 0; border: 1px solid #bbf7d0;">
        <div style="text-align: center;">
          <div style="background-color: #16a34a; color: white; border-radius: 50%; width: 60px; height: 60px; display: inline-flex; align-items: center; justify-content: center; font-size: 24px; margin-bottom: 15px;">✓</div>
          <h3 style="color: #16a34a; margin: 0 0 10px 0;">Order Status: APPROVED</h3>
          <p style="color: #166534; margin: 0;">Your order is now in production!</p>
        </div>
      </div>
      
      <!-- Order Summary -->
      <div style="background-color: #f9fafb; border-radius: 8px; padding: 20px; margin: 25px 0;">
        <h3 style="color: #374151; margin: 0 0 15px 0;">📋 Order Summary</h3>
        <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
          <span>Order ID:</span>
          <span style="font-family: monospace; background: #e5e7eb; padding: 2px 6px; border-radius: 4px;">${order.id}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
          <span>Total Amount:</span>
          <strong style="color: #16a34a;">₹${order.subtotal.toLocaleString()}</strong>
        </div>
        <div style="display: flex; justify-content: space-between;">
          <span>Expected Delivery:</span>
          <strong>3-5 Business Days</strong>
        </div>
      </div>
      
      <!-- Timeline -->
      <div style="background-color: #fefce8; border-radius: 8px; padding: 20px; margin: 25px 0;">
        <h4 style="color: #92400e; margin: 0 0 15px 0;">📅 What's Next?</h4>
        <div style="position: relative; padding-left: 25px;">
          <div style="position: absolute; left: 0; top: 6px; width: 12px; height: 12px; background-color: #16a34a; border-radius: 50%;"></div>
          <div style="color: #92400e; margin-bottom: 15px;">
            <strong>Now:</strong> Artisans begin crafting your jewelry
          </div>
          <div style="position: absolute; left: 0; top: 36px; width: 12px; height: 12px; background-color: #eab308; border-radius: 50%;"></div>
          <div style="color: #92400e; margin-bottom: 15px;">
            <strong>In 2-3 days:</strong> Quality check and packaging
          </div>
          <div style="position: absolute; left: 0; top: 66px; width: 12px; height: 12px; background-color: #d1d5db; border-radius: 50%;"></div>
          <div style="color: #92400e;">
            <strong>In 3-5 days:</strong> Shipped with tracking number
          </div>
        </div>
      </div>
      
      <!-- Track Order CTA -->
      <div style="text-align: center; padding: 25px 0;">
        <a href="#" style="background-color: #8B4513; color: white; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 600; display: inline-block; font-size: 16px;">
          📦 Track Your Order
        </a>
      </div>
    </div>
    
    <!-- Footer -->
    <div style="background-color: #f9fafb; padding: 20px; text-align: center; color: #6b7280; font-size: 14px;">
      <p style="margin: 0 0 10px 0;">Thank you for choosing Kala Jewelry</p>
      <p style="margin: 0;">We can't wait for you to see your beautiful new jewelry! ✨</p>
    </div>
  </div>
</body>
</html>
      `
    };
  }

  static orderRejected(order: any, reason?: string): EmailTemplate {
    return {
      subject: `Order Update - ${order.id}`,
      text: `
Dear ${order.customer.firstName} ${order.customer.lastName},

We regret to inform you that we're unable to process your order at this time.

Order ID: ${order.id}
${reason ? `Reason: ${reason}` : ''}

We sincerely apologize for any inconvenience. Please feel free to contact our customer service team if you have any questions or would like to place a new order.

Best regards,
Kala Jewelry Team
      `.trim(),
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Update</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f9fafb;">
  <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
    
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%); color: white; padding: 30px; text-align: center;">
      <h1 style="margin: 0; font-size: 24px; font-weight: bold;">Order Update</h1>
      <p style="margin: 10px 0 0 0; opacity: 0.9;">Regarding your order ${order.id}</p>
    </div>
    
    <!-- Content -->
    <div style="padding: 30px;">
      <p style="color: #374151; line-height: 1.6; margin: 0 0 20px 0;">
        Dear <strong>${order.customer.firstName} ${order.customer.lastName}</strong>,
      </p>
      
      <div style="background-color: #fef2f2; border-left: 4px solid #dc2626; padding: 20px; margin: 20px 0; border-radius: 0 8px 8px 0;">
        <p style="color: #991b1b; margin: 0 0 10px 0; font-weight: 600;">We're sorry, but we're unable to process your order at this time.</p>
        ${reason ? `<p style="color: #991b1b; margin: 0;"><strong>Reason:</strong> ${reason}</p>` : ''}
      </div>
      
      <p style="color: #374151; line-height: 1.6; margin: 20px 0;">
        We sincerely apologize for any inconvenience this may cause. Our team is always working to improve our services and ensure the best experience for our customers.
      </p>
      
      <!-- Contact Support -->
      <div style="background-color: #f0f9ff; border-radius: 8px; padding: 25px; margin: 25px 0; text-align: center;">
        <h3 style="color: #0369a1; margin: 0 0 15px 0;">💬 Need Assistance?</h3>
        <p style="color: #0369a1; margin: 0 0 20px 0;">Our customer service team is here to help you with any questions or to assist with a new order.</p>
        <div style="display: inline-flex; gap: 15px;">
          <a href="mailto:support@kala-jewelry.com" style="background-color: #0369a1; color: white; text-decoration: none; padding: 12px 20px; border-radius: 6px; display: inline-block;">
            📧 Email Support
          </a>
          <a href="tel:+1-555-0123" style="background-color: transparent; color: #0369a1; text-decoration: none; padding: 12px 20px; border: 1px solid #0369a1; border-radius: 6px; display: inline-block;">
            📞 Call Us
          </a>
        </div>
      </div>
    </div>
    
    <!-- Footer -->
    <div style="background-color: #f9fafb; padding: 20px; text-align: center; color: #6b7280; font-size: 14px;">
      <p style="margin: 0;">Thank you for your understanding</p>
      <p style="margin: 5px 0 0 0;">© 2024 Kala Jewelry</p>
    </div>
  </div>
</body>
</html>
      `
    };
  }
}

// Convenience functions
export async function sendOrderConfirmation(order: any): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const template = EmailTemplates.orderConfirmation(order);
  return await sendEmail(order.customer.email, template);
}

export async function sendAdminNotification(order: any): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const template = EmailTemplates.adminNotification(order);
  return await sendEmail(EMAIL_CONFIG.adminEmail, template, {
    replyTo: order.customer.email
  });
}

export async function sendOrderApproval(order: any): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const template = EmailTemplates.orderApproved(order);
  return await sendEmail(order.customer.email, template);
}

export async function sendOrderRejection(order: any, reason?: string): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const template = EmailTemplates.orderRejected(order, reason);
  return await sendEmail(order.customer.email, template);
}

// Utility functions
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validateEmailConfiguration(): { isConfigured: boolean; provider: string; issues: string[] } {
  const issues: string[] = [];
  let provider = 'none';
  
  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    provider = 'gmail';
  } else if (process.env.SENDGRID_API_KEY) {
    provider = 'sendgrid';
  } else if (process.env.MAILGUN_API_KEY && process.env.MAILGUN_DOMAIN) {
    provider = 'mailgun';
  } else {
    issues.push('No email provider configured');
  }
  
  if (!process.env.EMAIL_FROM) {
    issues.push('EMAIL_FROM not set');
  }
  
  if (!process.env.ADMIN_EMAIL) {
    issues.push('ADMIN_EMAIL not set');
  }
  
  return {
    isConfigured: issues.length === 0,
    provider,
    issues
  };
}
