import { NextRequest, NextResponse } from 'next/server';
import { trackCategoryView } from '../../../utils/analytics';
import { sanitizeString } from '../../../utils/validation';
import { LRUCache } from 'lru-cache';

// Rate limiter for category views (100 requests per IP per hour)
const ratelimit = new LRUCache({
  max: 500,
  ttl: 60 * 60 * 1000, // 1 hour
});

const getIP = (request: NextRequest) => {
  const xff = request.headers.get('x-forwarded-for');
  return xff ? xff.split(',')[0] : '127.0.0.1';
};

// Rate limiting function
async function rateLimiter(request: NextRequest, limit: number, identifier: string) {
  const ip = getIP(request);
  const tokenKey = `${ip}:${identifier}`;
  const currentUsage = ratelimit.get(tokenKey) as number || 0;
  
  if (currentUsage >= limit) {
    return false;
  }
  
  ratelimit.set(tokenKey, currentUsage + 1);
  return true;
}

export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting
    const isAllowed = await rateLimiter(request, 100, 'CATEGORY_VIEW');
    if (!isAllowed) {
      return NextResponse.json(
        { success: false, message: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
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
