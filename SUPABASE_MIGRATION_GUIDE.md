# 🗄️ Supabase Database Migration Guide

This guide walks you through migrating your Kala Jewelry e-commerce platform from JSON file storage to Supabase PostgreSQL database.

## 📋 Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Setup Supabase](#setup-supabase)
4. [Environment Configuration](#environment-configuration)
5. [Database Schema Setup](#database-schema-setup)
6. [Migration Process](#migration-process)
7. [Verification](#verification)
8. [Troubleshooting](#troubleshooting)
9. [Production Deployment](#production-deployment)

## 📖 Overview

### What's Included in the Migration

**Current Architecture (JSON Files):**
- `data/orders.json` - Order data
- `data/products.json` - Product catalog
- `data/analytics.json` - Usage analytics

**New Architecture (Supabase):**
- `orders` table - Structured order data with indexing
- `products` table - Product catalog with inventory tracking
- `analytics` table - Performance analytics and metrics
- Advanced querying, real-time updates, and scalability

### Benefits of Migration

✅ **Performance**: Database indexing for faster queries  
✅ **Scalability**: Handle thousands of orders and products  
✅ **Reliability**: ACID compliance and data integrity  
✅ **Real-time**: Live updates and subscriptions  
✅ **Security**: Row-level security and proper authentication  
✅ **Analytics**: SQL-based reporting and insights  

## 🔧 Prerequisites

- Node.js 18+ installed
- Existing Kala Jewelry project running
- Supabase account (free tier available)
- Basic understanding of environment variables

## 🚀 Setup Supabase

### Step 1: Create Supabase Project

1. Visit [supabase.com](https://supabase.com) and sign up
2. Click "New Project"
3. Choose your organization
4. Fill in project details:
   - **Name**: `kala-jewelry-ecommerce`
   - **Database Password**: Create a strong password
   - **Region**: Choose closest to your users
5. Wait for project creation (2-3 minutes)

### Step 2: Get Project Credentials

1. Go to your project dashboard
2. Navigate to **Settings** → **API**
3. Copy the following values:
   - **Project URL** (e.g., `https://abc123.supabase.co`)
   - **Project API Keys**:
     - `anon` `public` key (safe for browser)
     - `service_role` key (server-side only)

## ⚙️ Environment Configuration

### Step 1: Update Environment Variables

Copy `.env.example` to `.env.local` and add your Supabase credentials:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.your-anon-key
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.your-service-role-key

# Migration Settings
USE_SUPABASE_DATABASE=false  # Keep false until migration is complete
AUTO_MIGRATE_TO_SUPABASE=false  # Optional auto-migration
```

### Step 2: Install Dependencies

The Supabase client is already installed. If needed:

```bash
npm install @supabase/supabase-js
```

## 🗃️ Database Schema Setup

### Step 1: Run Schema Script

1. Open your Supabase project dashboard
2. Go to **SQL Editor**
3. Open the file `database/schema.sql` from your project
4. Copy the entire contents
5. Paste into Supabase SQL Editor
6. Click **Run** to execute

This creates:
- All necessary tables with proper structure
- Indexes for optimal performance
- Row-level security policies
- Helper functions and views
- Automatic timestamp triggers

### Step 2: Verify Schema

Check that these tables were created:
- ✅ `orders` - Order management
- ✅ `products` - Product catalog
- ✅ `analytics` - Usage tracking

## 🔄 Migration Process

You have three options for migration:

### Option 1: Automatic Migration (Recommended)

Set environment variables and restart:

```bash
# In .env.local
AUTO_MIGRATE_TO_SUPABASE=true
USE_SUPABASE_DATABASE=true
```

Restart your application:
```bash
npm run dev
```

The migration runs automatically on startup.

### Option 2: Manual API Migration

Use the migration API endpoint:

```bash
# Check migration status
curl "http://localhost:3001/api/migrate-to-supabase?adminKey=kala-admin-2024"

# Run migration
curl -X POST "http://localhost:3001/api/migrate-to-supabase" \
  -H "Content-Type: application/json" \
  -d '{"adminKey": "kala-admin-2024", "action": "migrate"}'
```

### Option 3: Programmatic Migration

Run the migration script directly:

```bash
# In your project directory
node -e "
const { migrateDatabaseToSupabase } = require('./scripts/migrate-to-supabase.ts');
migrateDatabaseToSupabase().catch(console.error);
"
```

### Migration Steps Explained

The migration process:

1. **Backup Creation**: Backs up existing JSON files with timestamp
2. **Data Validation**: Checks data integrity and formats
3. **Orders Migration**: Transfers all order data with relationships
4. **Products Migration**: Migrates product catalog with inventory
5. **Analytics Migration**: Preserves usage statistics and metrics
6. **Verification**: Confirms successful data transfer

## ✅ Verification

### Step 1: Check Migration Results

The migration will output detailed logs:

```
🎉 Migration Summary:
📦 Orders: 156 migrated, 0 errors
🛍️ Products: 23 migrated, 0 errors  
📊 Analytics: 45 migrated, 0 errors
Overall Status: ✅ SUCCESS
```

### Step 2: Verify in Supabase Dashboard

1. Go to **Table Editor** in Supabase
2. Check each table has data:
   - `orders` table should show your order history
   - `products` table should show your catalog
   - `analytics` table should show usage metrics

### Step 3: Test Application

1. Enable Supabase mode:
   ```bash
   USE_SUPABASE_DATABASE=true
   ```
   
2. Restart application:
   ```bash
   npm run dev
   ```

3. Test key features:
   - ✅ Browse products
   - ✅ Add to cart
   - ✅ Place order
   - ✅ Admin panel access
   - ✅ Order management
   - ✅ Analytics viewing

### Step 4: Performance Verification

Compare query speeds:
- Product listing should be faster
- Order searches should be near-instant
- Admin dashboard should load quickly

## 🚨 Troubleshooting

### Common Issues

#### Migration Fails with "Supabase not configured"

**Solution**: Verify environment variables are correct:
```bash
# Check your .env.local file
cat .env.local | grep SUPABASE
```

#### "Permission denied" errors

**Solution**: Ensure you're using the service role key, not anon key:
```bash
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.service-role-key
```

#### Partial migration success

**Solution**: Check individual error messages:
1. View migration logs
2. Fix data format issues
3. Re-run migration (it's safe to run multiple times)

#### App errors after migration

**Solution**: 
1. Check `USE_SUPABASE_DATABASE=true` is set
2. Restart the application
3. Clear browser cache
4. Check Supabase project is active

### Database Connection Issues

If you get connection errors:

1. **Check Project Status**: Ensure Supabase project is active
2. **Verify URL**: Make sure project URL is correct
3. **Check Keys**: Confirm API keys are not expired
4. **Network**: Test connection from your environment

### Data Integrity Issues

If data appears incorrect:

1. **Compare Records**: Check source JSON vs database
2. **Check Types**: Ensure data types match schema
3. **Review Logs**: Look for conversion warnings
4. **Backup**: Original JSON files are backed up in `data/backup/`

## 🌐 Production Deployment

### Step 1: Create Production Database

1. Create new Supabase project for production
2. Run schema script on production database
3. Set up environment variables for production

### Step 2: Environment Variables

For production deployment (Vercel, Netlify, etc.):

```bash
# Production Supabase
NEXT_PUBLIC_SUPABASE_URL=https://prod-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=production-anon-key
SUPABASE_SERVICE_ROLE_KEY=production-service-key

# Production Settings
USE_SUPABASE_DATABASE=true
AUTO_MIGRATE_TO_SUPABASE=false  # Disable auto-migration in production
```

### Step 3: Data Migration for Production

1. Export data from development Supabase
2. Import to production Supabase
3. Or run migration directly in production environment

### Step 4: Testing

- Test all functionality in production
- Monitor database performance
- Set up backup schedules
- Configure monitoring and alerts

## 📊 Advanced Features

### Real-time Updates

With Supabase, you can add real-time features:

```typescript
// Subscribe to order updates
const { data, error } = supabaseClient
  .from('orders')
  .on('*', payload => {
    console.log('Order updated:', payload);
  })
  .subscribe();
```

### Advanced Queries

Use SQL for complex analytics:

```sql
-- Monthly revenue report
SELECT 
  DATE_TRUNC('month', created_at) as month,
  COUNT(*) as orders,
  SUM(subtotal) as revenue
FROM orders 
WHERE status != 'rejected'
GROUP BY month
ORDER BY month DESC;
```

### Backup and Recovery

Set up automated backups in Supabase:
1. Go to **Settings** → **Database**
2. Configure backup schedule
3. Test restore procedures

## 🔧 Maintenance

### Regular Tasks

1. **Monitor Performance**: Check query speeds
2. **Review Analytics**: Use Supabase analytics
3. **Update Indexes**: Add indexes for new query patterns
4. **Clean Data**: Archive old orders if needed

### Optimization

1. **Add Indexes**: For frequently queried fields
2. **Partition Tables**: For very large datasets
3. **Connection Pooling**: For high traffic
4. **Caching**: Implement Redis if needed

## 🆘 Support

If you encounter issues:

1. **Check Logs**: Application and Supabase logs
2. **Supabase Docs**: [docs.supabase.com](https://docs.supabase.com)
3. **Community**: Supabase Discord/GitHub
4. **Backup**: Always keep JSON backups until stable

## 🎉 Success!

Once migration is complete, you'll have:

- ✅ Scalable PostgreSQL database
- ✅ Real-time capabilities
- ✅ Advanced security
- ✅ Better performance
- ✅ SQL analytics
- ✅ Automatic backups

Your Kala Jewelry platform is now ready for production scale! 🚀
