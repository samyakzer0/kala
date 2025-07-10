import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { 
  sendEmail, 
  validateEmailConfiguration,
  // EmailTemplates - removed unused import 
} from '../../../../utils/emailService';
import { validateAdminKey, getClientIP } from '../../../../utils/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { testEmail, adminKey } = body;
    const clientIP = getClientIP(request);
    
    // Secure admin authentication
    try {
      if (!validateAdminKey(adminKey || '', clientIP)) {
        return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
      }
    } catch (error) {
      return NextResponse.json({ 
        success: false, 
        message: error instanceof Error ? error.message : 'Authentication failed' 
      }, { status: 429 });
    }
    
    if (!testEmail) {
      return NextResponse.json(
        { success: false, message: 'Test email address is required' },
        { status: 400 }
      );
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(testEmail)) {
      return NextResponse.json(
        { success: false, message: 'Invalid email format' },
        { status: 400 }
      );
    }
    
    // Check email configuration
    const emailConfig = validateEmailConfiguration();
    
    // Create a test email template
    const testTemplate = {
      subject: '✅ Kala Jewelry - Email Test Successful',
      text: `
Hello!

This is a test email from your Kala Jewelry e-commerce platform.

If you're receiving this email, your email configuration is working correctly!

Configuration Details:
- Provider: ${emailConfig.provider}
- Configured: ${emailConfig.isConfigured ? 'Yes' : 'No'}
- Issues: ${emailConfig.issues.length > 0 ? emailConfig.issues.join(', ') : 'None'}

Test sent at: ${new Date().toISOString()}

Best regards,
Kala Jewelry System
      `.trim(),
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Email Test</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f9fafb;">
  <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
    
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #16a34a 0%, #22c55e 100%); color: white; padding: 30px; text-align: center;">
      <div style="font-size: 48px; margin-bottom: 10px;">✅</div>
      <h1 style="margin: 0; font-size: 28px; font-weight: bold;">Email Test Successful!</h1>
      <p style="margin: 10px 0 0 0; opacity: 0.9;">Your email configuration is working correctly</p>
    </div>
    
    <!-- Content -->
    <div style="padding: 30px;">
      <p style="color: #374151; line-height: 1.6; margin: 0 0 20px 0; font-size: 16px;">
        Hello! 👋
      </p>
      
      <p style="color: #374151; line-height: 1.6; margin: 0 0 25px 0; font-size: 16px;">
        This is a test email from your <strong>Kala Jewelry</strong> e-commerce platform. 
        If you're receiving this email, congratulations! Your email configuration is working perfectly.
      </p>
      
      <!-- Configuration Details -->
      <div style="background-color: #f0f9ff; border-radius: 8px; padding: 20px; margin: 25px 0;">
        <h3 style="color: #0369a1; margin: 0 0 15px 0;">📧 Configuration Details</h3>
        <table style="width: 100%; color: #0369a1;">
          <tr><td style="padding: 5px 0;"><strong>Provider:</strong></td><td>${emailConfig.provider}</td></tr>
          <tr><td style="padding: 5px 0;"><strong>Status:</strong></td><td>${emailConfig.isConfigured ? '✅ Configured' : '❌ Not Configured'}</td></tr>
          <tr><td style="padding: 5px 0;"><strong>Issues:</strong></td><td>${emailConfig.issues.length > 0 ? emailConfig.issues.join(', ') : '✅ None'}</td></tr>
          <tr><td style="padding: 5px 0;"><strong>Test Time:</strong></td><td>${new Date().toLocaleString()}</td></tr>
        </table>
      </div>
      
      <!-- Success Message -->
      <div style="background: linear-gradient(135deg, #ecfdf5 0%, #f0fdf4 100%); border-radius: 12px; padding: 25px; margin: 25px 0; border: 1px solid #bbf7d0; text-align: center;">
        <div style="background-color: #16a34a; color: white; border-radius: 50%; width: 60px; height: 60px; display: inline-flex; align-items: center; justify-content: center; font-size: 24px; margin-bottom: 15px;">🎉</div>
        <h3 style="color: #16a34a; margin: 0 0 10px 0;">All Systems Go!</h3>
        <p style="color: #166534; margin: 0;">Your customers will now receive beautiful email confirmations for their orders.</p>
      </div>
      
      <!-- Next Steps -->
      <div style="background-color: #fefce8; border-radius: 8px; padding: 20px; margin: 25px 0;">
        <h4 style="color: #92400e; margin: 0 0 15px 0;">🚀 Ready for Production?</h4>
        <ul style="color: #92400e; margin: 0; padding-left: 20px;">
          <li>Customize email templates to match your brand</li>
          <li>Set up email analytics and delivery tracking</li>
          <li>Consider upgrading to a dedicated email service for high volume</li>
          <li>Test order flows end-to-end</li>
        </ul>
      </div>
    </div>
    
    <!-- Footer -->
    <div style="background-color: #f9fafb; padding: 20px; text-align: center; color: #6b7280; font-size: 14px;">
      <p style="margin: 0;">© 2024 Kala Jewelry E-commerce Platform</p>
      <p style="margin: 5px 0 0 0;">Email system test completed successfully ✨</p>
    </div>
  </div>
</body>
</html>
      `
    };
    
    // Send test email
    const result = await sendEmail(testEmail, testTemplate);
    
    return NextResponse.json({
      success: true,
      message: 'Test email sent successfully',
      emailConfig,
      emailResult: result
    });
    
  } catch (error) {
    console.error('Error sending test email:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to send test email',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// GET endpoint to check email configuration status
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const adminKey = searchParams.get('adminKey');
    const clientIP = getClientIP(request);
    
    // Secure admin authentication
    try {
      if (!validateAdminKey(adminKey || '', clientIP)) {
        return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
      }
    } catch (error) {
      return NextResponse.json({ 
        success: false, 
        message: error instanceof Error ? error.message : 'Authentication failed' 
      }, { status: 429 });
    }
    
    const emailConfig = validateEmailConfiguration();
    
    return NextResponse.json({
      success: true,
      emailConfig,
      recommendations: {
        forProduction: emailConfig.provider === 'gmail' ? 
          'Consider using SendGrid or Mailgun for production environments' : 
          'Your email configuration looks good for production',
        nextSteps: [
          'Test email delivery thoroughly',
          'Monitor email bounce rates',
          'Set up email analytics',
          'Customize email templates'
        ]
      }
    });
    
  } catch (error) {
    console.error('Error checking email configuration:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to check email configuration' 
      },
      { status: 500 }
    );
  }
}
