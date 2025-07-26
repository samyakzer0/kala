import { NextRequest, NextResponse } from 'next/server';
import { getDatabaseInfo } from '../../../../lib/database';

export async function GET(request: NextRequest) {
  try {
    const dbInfo = await getDatabaseInfo();
    
    return NextResponse.json({
      success: true,
      databaseInfo: dbInfo,
      environment: {
        USE_SUPABASE_DATABASE: process.env.USE_SUPABASE_DATABASE,
        NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Not Set',
        SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Set' : 'Not Set',
      }
    });

  } catch (error) {
    console.error('Error getting database info:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to get database info',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
