import { NextRequest, NextResponse } from 'next/server';
import { DatabaseMigration } from '../../../scripts/migrate-to-supabase';
import { isSupabaseConfigured, validateSupabaseConfig } from '../../../lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const adminKey = url.searchParams.get('adminKey');

    // Verify admin authentication
    if (adminKey !== process.env.ADMIN_KEY) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check migration status
    const migrationStatus = await DatabaseMigration.isMigrationNeeded();
    const supabaseConfig = validateSupabaseConfig();

    return NextResponse.json({
      success: true,
      migration: {
        canMigrate: migrationStatus.canMigrate,
        hasOrders: migrationStatus.hasOrders,
        hasProducts: migrationStatus.hasProducts,
        hasAnalytics: migrationStatus.hasAnalytics,
        supabaseConfigured: migrationStatus.supabaseConfigured,
      },
      supabase: {
        isConfigured: supabaseConfig.isValid,
        missingConfig: supabaseConfig.missing,
      },
      environment: {
        useSupabase: process.env.USE_SUPABASE_DATABASE === 'true',
        autoMigrate: process.env.AUTO_MIGRATE_TO_SUPABASE === 'true',
      },
    });

  } catch (error) {
    console.error('Error checking migration status:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to check migration status' 
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { adminKey, action } = body;

    // Verify admin authentication
    if (adminKey !== process.env.ADMIN_KEY) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if Supabase is configured
    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Supabase is not properly configured. Please check your environment variables.' 
        },
        { status: 400 }
      );
    }

    switch (action) {
      case 'migrate':
        console.log('🚀 Starting database migration to Supabase...');
        
        // Create backup first
        await DatabaseMigration.createBackup();
        
        // Run migration
        const result = await DatabaseMigration.runFullMigration();
        
        return NextResponse.json({
          success: result.success,
          message: result.success ? 'Migration completed successfully' : 'Migration completed with errors',
          results: result.results,
        });

      case 'backup':
        console.log('📁 Creating backup of JSON data...');
        await DatabaseMigration.createBackup();
        
        return NextResponse.json({
          success: true,
          message: 'Backup created successfully',
        });

      case 'check-status':
        const migrationStatus = await DatabaseMigration.isMigrationNeeded();
        
        return NextResponse.json({
          success: true,
          migration: migrationStatus,
        });

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('Migration API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Migration failed' 
      },
      { status: 500 }
    );
  }
}
