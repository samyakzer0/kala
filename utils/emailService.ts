import nodemailer from 'nodemailer';
import { Order } from '../types/order';
import { KalaEmailTemplates, EmailTemplate } from './emailTemplates';

// Enhanced email service configuration
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
  
  // Email debug mode
  debug: process.env.EMAIL_DEBUG === 'true'
};

// Create transporter based on available configuration
function createTransporter(): nodemailer.Transporter | null {
  try {
    // Try Gmail SMTP first
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      console.log('📧 Using Gmail SMTP for email delivery');
      return nodemailer.createTransport(EMAIL_CONFIG.smtp);
    }
    
    console.log('⚠️ No email credentials configured. Running in simulation mode.');
    return null;
    
  } catch (error) {
    console.error('❌ Error creating email transporter:', error);
    return null;
  }
}

// Enhanced email sending function with admin BCC support
export async function sendEmailWithAdminBCC(
  to: string | string[],
  template: EmailTemplate,
  options?: {
    from?: string;
    replyTo?: string;
    bccAdmin?: boolean;
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
      if (options?.bccAdmin) {
        console.log('📨 BCC Admin:', EMAIL_CONFIG.adminEmail);
      }
      console.log('💬 Preview:', template.text.substring(0, 100) + '...');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, EMAIL_CONFIG.debug ? 1000 : 500));
      
      const simulatedId = `sim_${Date.now()}_${Math.random().toString(36).substring(7)}`;
      console.log('✅ Email delivered successfully (simulated)');
      console.log('🆔 Message ID:', simulatedId);
      console.log('');
      
      return { success: true, messageId: simulatedId };
    }
    
    // Prepare BCC list
    const bccList = [];
    if (options?.bccAdmin && EMAIL_CONFIG.adminEmail) {
      bccList.push(EMAIL_CONFIG.adminEmail);
    }
    
    // Send real email
    const mailOptions = {
      from: `Kala Jewelry <${options?.from || EMAIL_CONFIG.from}>`,
      to: Array.isArray(to) ? to.join(', ') : to,
      bcc: bccList.length > 0 ? bccList.join(', ') : undefined,
      subject: template.subject,
      text: template.text,
      html: template.html,
      replyTo: options?.replyTo || EMAIL_CONFIG.replyTo,
      attachments: options?.attachments
    };
    
    console.log('📧 Sending email via SMTP...');
    console.log('📍 To:', mailOptions.to);
    console.log('📋 Subject:', template.subject);
    if (bccList.length > 0) {
      console.log('📨 BCC:', bccList.join(', '));
    }
    
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

// Enhanced order confirmation email (with admin BCC)
export async function sendOrderConfirmation(order: Order): Promise<{ success: boolean; messageId?: string; error?: string }> {
  console.log('📧 Generating order confirmation email...');
  
  const template = KalaEmailTemplates.orderConfirmation(order);
  
  return await sendEmailWithAdminBCC(
    order.customer.email,
    template,
    {
      from: EMAIL_CONFIG.from,
      replyTo: EMAIL_CONFIG.replyTo,
      bccAdmin: true // Admin gets copy of customer confirmation
    }
  );
}

// Enhanced admin notification email
export async function sendAdminNotification(order: Order): Promise<{ success: boolean; messageId?: string; error?: string }> {
  console.log('📧 Generating admin notification email...');
  
  const template = KalaEmailTemplates.adminOrderNotification(order);
  
  return await sendEmailWithAdminBCC(
    EMAIL_CONFIG.adminEmail,
    template,
    {
      from: EMAIL_CONFIG.from,
      replyTo: order.customer.email, // Admin can reply directly to customer
      bccAdmin: false // Don't BCC admin to themselves
    }
  );
}

// NEW: Order approval notification email
export async function sendOrderApprovalNotification(order: Order): Promise<{ success: boolean; messageId?: string; error?: string }> {
  console.log('📧 Generating order approval notification email...');
  
  const template = KalaEmailTemplates.orderApproval(order);
  
  return await sendEmailWithAdminBCC(
    order.customer.email,
    template,
    {
      from: EMAIL_CONFIG.from,
      replyTo: EMAIL_CONFIG.replyTo,
      bccAdmin: true // Admin gets copy of approval notification
    }
  );
}

// NEW: Order delivery confirmation email
export async function sendOrderDeliveryConfirmation(order: Order): Promise<{ success: boolean; messageId?: string; error?: string }> {
  console.log('📧 Generating order delivery confirmation email...');
  
  const template = KalaEmailTemplates.orderDelivered(order);
  
  return await sendEmailWithAdminBCC(
    order.customer.email,
    template,
    {
      from: EMAIL_CONFIG.from,
      replyTo: EMAIL_CONFIG.replyTo,
      bccAdmin: true // Admin gets copy of delivery confirmation
    }
  );
}

// NEW: Manual email sending function for admin
export async function sendManualEmail(
  to: string,
  subject: string,
  message: string,
  options?: {
    isHtml?: boolean;
    bccAdmin?: boolean;
  }
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  console.log('📧 Sending manual email...');
  
  const template: EmailTemplate = {
    subject: subject,
    text: options?.isHtml ? message.replace(/<[^>]*>/g, '') : message,
    html: options?.isHtml ? message : `<pre style="font-family: Arial, sans-serif; white-space: pre-wrap;">${message}</pre>`
  };
  
  return await sendEmailWithAdminBCC(
    to,
    template,
    {
      from: EMAIL_CONFIG.from,
      replyTo: EMAIL_CONFIG.replyTo,
      bccAdmin: options?.bccAdmin ?? true
    }
  );
}

// Utility function to validate email configuration
export function validateEmailConfiguration(): {
  isConfigured: boolean;
  provider?: string;
  issues: string[];
} {
  const issues: string[] = [];
  
  if (!process.env.EMAIL_USER) {
    issues.push('EMAIL_USER not configured');
  }
  
  if (!process.env.EMAIL_PASS) {
    issues.push('EMAIL_PASS not configured');
  }
  
  if (!process.env.EMAIL_FROM) {
    issues.push('EMAIL_FROM not configured (using default)');
  }
  
  if (!process.env.ADMIN_EMAIL) {
    issues.push('ADMIN_EMAIL not configured (using default)');
  }
  
  const isConfigured = process.env.EMAIL_USER && process.env.EMAIL_PASS;
  
  return {
    isConfigured: !!isConfigured,
    provider: isConfigured ? 'Gmail SMTP' : undefined,
    issues
  };
}

// Legacy functions for backward compatibility
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
  return await sendEmailWithAdminBCC(to, template, {
    ...options,
    bccAdmin: false
  });
}

// Order approval and rejection functions
export async function sendOrderApproval(order: Order): Promise<{ success: boolean; messageId?: string; error?: string }> {
  return await sendEmailWithAdminBCC(
    order.customer.email,
    KalaEmailTemplates.orderApproval(order),
    {
      bccAdmin: true
    }
  );
}

export async function sendOrderRejection(order: Order, reason?: string): Promise<{ success: boolean; messageId?: string; error?: string }> {
  return await sendEmailWithAdminBCC(
    order.customer.email,
    KalaEmailTemplates.orderRejection(order, reason),
    {
      bccAdmin: true
    }
  );
}

// Export the email templates class for direct use
export { KalaEmailTemplates };
