#!/usr/bin/env tsx

// Load environment variables
import { config } from 'dotenv';
import path from 'path';

// Load .env.local first, then .env
config({ path: path.join(process.cwd(), '.env.local') });
config({ path: path.join(process.cwd(), '.env') });

import { DatabaseMigration } from './migrate-to-supabase';

async function checkMigrationStatus() {
  try {
    console.log('🔍 Checking Migration Status');
    console.log('============================');

    const status = await DatabaseMigration.isMigrationNeeded();

    console.log('📊 Current Status:');
    console.log(`   Supabase Configured: ${status.supabaseConfigured ? '✅ Yes' : '❌ No'}`);
    console.log(`   Has Orders Data: ${status.hasOrders ? '✅ Yes' : '❌ No'}`);
    console.log(`   Has Products Data: ${status.hasProducts ? '✅ Yes' : '❌ No'}`);
    console.log(`   Has Analytics Data: ${status.hasAnalytics ? '✅ Yes' : '❌ No'}`);
    console.log(`   Can Migrate: ${status.canMigrate ? '✅ Yes' : '❌ No'}`);

    console.log('\n🔧 Environment:');
    console.log(`   USE_SUPABASE_DATABASE: ${process.env.USE_SUPABASE_DATABASE || 'false'}`);
    console.log(`   AUTO_MIGRATE_TO_SUPABASE: ${process.env.AUTO_MIGRATE_TO_SUPABASE || 'false'}`);
    console.log(`   NEXT_PUBLIC_SUPABASE_URL: ${process.env.NEXT_PUBLIC_SUPABASE_URL || 'NOT SET'}`);
    console.log(`   NEXT_PUBLIC_SUPABASE_ANON_KEY: ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'SET' : 'NOT SET'}`);
    console.log(`   SUPABASE_SERVICE_ROLE_KEY: ${process.env.SUPABASE_SERVICE_ROLE_KEY ? 'SET' : 'NOT SET'}`);

    if (!status.supabaseConfigured) {
      console.log('\n⚠️  Supabase Configuration Required:');
      console.log('   1. Create a Supabase project');
      console.log('   2. Add environment variables to .env.local:');
      console.log('      NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co');
      console.log('      NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key');
      console.log('      SUPABASE_SERVICE_ROLE_KEY=your-service-key');
    }

    if (status.canMigrate) {
      console.log('\n🚀 Ready to migrate! Run:');
      console.log('   npm run migrate:supabase');
    }

  } catch (error) {
    console.error('❌ Error checking migration status:', error);
  }
}

checkMigrationStatus();
