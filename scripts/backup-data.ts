#!/usr/bin/env tsx
import { DatabaseMigration } from './migrate-to-supabase';

async function createBackup() {
  try {
    console.log('📁 Creating Data Backup');
    console.log('=======================');

    await DatabaseMigration.createBackup();

    console.log('✅ Backup completed successfully!');
    console.log('   Backup location: data/backup/');
    console.log('   Files backed up with timestamp prefix');

  } catch (error) {
    console.error('❌ Backup failed:', error);
    process.exit(1);
  }
}

createBackup();
