import { NextRequest, NextResponse } from 'next/server';

// In-memory auth attempts tracking (same instance as in auth.ts)
const authAttempts = new Map<string, { count: number; lastAttempt: number }>();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { clearAll, clientIP } = body;
    
    if (clearAll) {
      authAttempts.clear();
      return NextResponse.json({ 
        success: true, 
        message: 'All authentication attempts cleared' 
      });
    }
    
    if (clientIP) {
      authAttempts.delete(clientIP);
      return NextResponse.json({ 
        success: true, 
        message: `Authentication attempts cleared for IP: ${clientIP}` 
      });
    }
    
    return NextResponse.json({ 
      success: false, 
      message: 'Please specify clearAll: true or provide clientIP' 
    }, { status: 400 });
    
  } catch (error) {
    console.error('Error clearing auth attempts:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Error clearing authentication attempts' 
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    const attempts = Array.from(authAttempts.entries()).map(([ip, data]) => ({
      clientIP: ip,
      attempts: data.count,
      lastAttempt: new Date(data.lastAttempt).toISOString()
    }));
    
    return NextResponse.json({ 
      success: true, 
      authAttempts: attempts,
      totalTrackedIPs: attempts.length
    });
    
  } catch (error) {
    console.error('Error getting auth attempts:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Error getting authentication attempts' 
    }, { status: 500 });
  }
}
