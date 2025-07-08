import { EmailTemplate } from '../types/order';
import nodemailer from 'nodemailer';

// Email service configuration
// In production, you would use environment variables for these
const EMAIL_CONFIG = {
  service: 'gmail', // or 'sendgrid', 'mailgun', etc.
  from: process.env.EMAIL_FROM || 'noreply@kala-jewelry.com',
  adminEmail: process.env.ADMIN_EMAIL || 'admin@kala-jewelry.com',
  // Gmail SMTP configuration
  smtp: {
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER, // Your Gmail email
      pass: process.env.EMAIL_PASS  // Your Gmail app password
    }
  }
};

// Create transporter for sending emails
let transporter: nodemailer.Transporter | null = null;

function createTransporter() {
  if (!transporter) {
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      // Use real SMTP if credentials are provided
      transporter = nodemailer.createTransport(EMAIL_CONFIG.smtp);
    } else {
      // Use test account for development
      console.log('⚠️ No email credentials provided. Using simulation mode.');
      transporter = null;
    }
  }
  return transporter;
}

// Simple email sending function
export async function sendEmail(
  to: string | string[],
  template: EmailTemplate,
  options?: {
    from?: string;
    replyTo?: string;
  }
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    const emailTransporter = createTransporter();
    
    if (!emailTransporter) {
      // Simulate email sending for development
      console.log('📧 Sending email (simulated):');
      console.log('To:', to);
      console.log('Subject:', template.subject);
      console.log('From:', options?.from || EMAIL_CONFIG.from);
      console.log('HTML:', template.html.substring(0, 200) + '...');
      
      // Simulate delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      console.log('✅ Email sent successfully (simulated)');
      console.log('---');
      
      return { 
        success: true, 
        messageId: `sim_${Date.now()}_${Math.random().toString(36).substring(7)}` 
      };
    }
    
    // Send real email
    const mailOptions = {
      from: options?.from || EMAIL_CONFIG.from,
      to: Array.isArray(to) ? to.join(', ') : to,
      subject: template.subject,
      text: template.text,
      html: template.html,
      replyTo: options?.replyTo
    };
    
    console.log('📧 Sending real email to:', to);
    const info = await emailTransporter.sendMail(mailOptions);
    
    console.log('✅ Email sent successfully:', info.messageId);
    
    return { 
      success: true, 
      messageId: info.messageId 
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
