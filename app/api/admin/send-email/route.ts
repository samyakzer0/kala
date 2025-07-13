import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { sendManualEmail } from '../../../../utils/emailService';
import { checkRateLimit, createRateLimitHeaders } from '../../../../utils/rateLimit';
import { getClientIP } from '../../../../utils/auth';
import { validateEmail } from '../../../../utils/validation';

export async function POST(request: NextRequest) {
  const clientIP = getClientIP(request);
  
  // Apply rate limiting (more restrictive for manual emails)
  const rateLimit = checkRateLimit(clientIP, { maxRequests: 5, windowMs: 60000 }, 'manual-email'); // 5 emails per minute
  const rateLimitHeaders = createRateLimitHeaders(rateLimit, { maxRequests: 5, windowMs: 60000 });
  
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { success: false, message: rateLimit.error },
      { status: 429, headers: rateLimitHeaders }
    );
  }

  try {
    const body = await request.json();
    const { to, subject, message, adminKey, isHtml, bccAdmin } = body;

    // Validate admin key
    if (adminKey !== process.env.ADMIN_KEY) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401, headers: rateLimitHeaders }
      );
    }

    // Validate required fields
    if (!to || !subject || !message) {
      return NextResponse.json(
        { success: false, message: 'Email address, subject, and message are required' },
        { status: 400, headers: rateLimitHeaders }
      );
    }

    // Validate email format
    if (!validateEmail(to)) {
      return NextResponse.json(
        { success: false, message: 'Invalid email address format' },
        { status: 400, headers: rateLimitHeaders }
      );
    }

    // Validate message length (prevent abuse)
    if (message.length > 10000) {
      return NextResponse.json(
        { success: false, message: 'Message is too long (max 10,000 characters)' },
        { status: 400, headers: rateLimitHeaders }
      );
    }

    console.log('📧 Sending manual email...');
    console.log('📍 To:', to);
    console.log('📋 Subject:', subject);
    console.log('💬 Length:', message.length, 'characters');

    // Send manual email
    const emailResult = await sendManualEmail(to, subject, message, {
      isHtml: isHtml || false,
      bccAdmin: bccAdmin !== false // Default to true unless explicitly set to false
    });

    if (emailResult.success) {
      console.log('✅ Manual email sent successfully');
    } else {
      console.error('❌ Failed to send manual email:', emailResult.error);
    }

    return NextResponse.json({
      success: emailResult.success,
      message: emailResult.success ? 'Email sent successfully' : 'Failed to send email',
      messageId: emailResult.messageId,
      error: emailResult.error
    }, { headers: rateLimitHeaders });

  } catch (error) {
    console.error('Error sending manual email:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to send email' },
      { status: 500, headers: rateLimitHeaders }
    );
  }
}
