import { NextRequest, NextResponse } from 'next/server';
import { trackCategoryView } from '../../../utils/analytics';
import { sanitizeString } from '../../../utils/validation';

// Simple in-memory rate limiting for category views
const rateLimit = new Map<string, { count: number; resetTime: number }>();

const getIP = (request: NextRequest) => {
  const xff = request.headers.get('x-forwarded-for');
  return xff ? xff.split(',')[0] : '127.0.0.1';
};

// More lenient rate limiting for category tracking
function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const key = `category_view:${ip}`;
  const limit = 1000; // 1000 requests per hour
  const windowMs = 60 * 60 * 1000; // 1 hour

  const record = rateLimit.get(key);
  
  if (!record || now > record.resetTime) {
    // First request or window expired
    rateLimit.set(key, { count: 1, resetTime: now + windowMs });
    return true;
  }
  
  if (record.count >= limit) {
    return false;
  }
  
  record.count++;
  return true;
}

export async function POST(request: NextRequest) {
  try {
    // Apply more lenient rate limiting for category tracking
    const ip = getIP(request);
    const isAllowed = checkRateLimit(ip);
    
    if (!isAllowed) {
      // Silently ignore rate limited requests for analytics
      // (Better UX than showing errors for analytics tracking)
      return NextResponse.json(
        { success: true, message: 'Rate limited - tracking skipped' },
        { status: 200 }
      );
    }

    // Parse the request body
    const body = await request.json();
    const { categoryId } = body;

    // Validate required fields
    if (!categoryId || typeof categoryId !== 'string' || categoryId.trim() === '') {
      return NextResponse.json(
        { success: false, message: 'Category ID is required' },
        { status: 400 }
      );
    }

    // Sanitize the category ID
    const sanitizedCategoryId = sanitizeString(categoryId);

    // Track the category view
    await trackCategoryView(sanitizedCategoryId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error tracking category view:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to track category view' },
      { status: 500 }
    );
  }
}
