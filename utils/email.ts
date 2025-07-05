import { EmailTemplate } from '../types/order';

// Email service configuration
// In production, you would use environment variables for these
const EMAIL_CONFIG = {
  // For demonstration - replace with actual email service credentials
  service: 'gmail', // or 'sendgrid', 'mailgun', etc.
  from: 'noreply@kala-jewelry.com',
  adminEmail: 'admin@kala-jewelry.com'
};

// Simple email sending function for demonstration
// In production, integrate with actual email service like SendGrid, Mailgun, or Nodemailer
export async function sendEmail(
  to: string | string[],
  template: EmailTemplate,
  options?: {
    from?: string;
    replyTo?: string;
  }
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    // Simulate email sending
    console.log('📧 Sending email:');
    console.log('To:', to);
    console.log('Subject:', template.subject);
    console.log('From:', options?.from || EMAIL_CONFIG.from);
    
    // In a real implementation, you would use an email service here
    // Example with SendGrid:
    /*
    const sgMail = require('@sendgrid/mail');
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    
    const msg = {
      to: Array.isArray(to) ? to : [to],
      from: options?.from || EMAIL_CONFIG.from,
      subject: template.subject,
      text: template.text,
      html: template.html,
      replyTo: options?.replyTo
    };
    
    const response = await sgMail.send(msg);
    return { 
      success: true, 
      messageId: response[0].headers['x-message-id'] 
    };
    */
    
    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // For demo purposes, we'll just log and return success
    console.log('✅ Email sent successfully (simulated)');
    console.log('---');
    
    return { 
      success: true, 
      messageId: `msg_${Date.now()}_${Math.random().toString(36).substring(7)}` 
    };
  } catch (error) {
    console.error('❌ Error sending email:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

// Send order notification to admin
export async function sendOrderNotificationToAdmin(
  adminEmail: string,
  template: EmailTemplate,
  customerEmail: string
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  return sendEmail(adminEmail, template, {
    replyTo: customerEmail // Allow admin to reply directly to customer
  });
}

// Send confirmation to customer
export async function sendOrderConfirmationToCustomer(
  customerEmail: string,
  template: EmailTemplate
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  return sendEmail(customerEmail, template, {
    from: EMAIL_CONFIG.from
  });
}

// Send approval notification to customer
export async function sendApprovalNotificationToCustomer(
  customerEmail: string,
  template: EmailTemplate
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  return sendEmail(customerEmail, template, {
    from: EMAIL_CONFIG.from
  });
}

// Utility to validate email address
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Parse admin email reply for approval/rejection
export function parseAdminReply(emailBody: string): {
  action: 'approved' | 'rejected' | 'unknown';
  notes?: string;
} {
  const body = emailBody.toLowerCase().trim();
  
  if (body.startsWith('approved')) {
    return { action: 'approved' };
  } else if (body.startsWith('rejected')) {
    // Extract rejection reason
    const notes = emailBody.substring(8).trim(); // Remove "rejected" and get the rest
    return { action: 'rejected', notes };
  }
  
  return { action: 'unknown' };
}
