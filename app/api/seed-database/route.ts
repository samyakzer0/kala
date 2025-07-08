import { NextRequest, NextResponse } from 'next/server';
import { seedDatabase } from '../../../utils/seedDatabase';
import { validateAdminKey, getClientIP } from '../../../utils/auth';

export async function POST(request: NextRequest) {
  try {
    const { adminKey } = await request.json();
    const clientIP = getClientIP(request);
    
    // Validate admin authentication
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
    
    // Seed the database
    await seedDatabase();
    
    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully with sample products and analytics data'
    });
    
  } catch (error) {
    console.error('Error seeding database:', error);
    return NextResponse.json({
      success: false,
      message: 'Error seeding database'
    }, { status: 500 });
  }
}
