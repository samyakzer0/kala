# 🚀 Vercel Deployment Guide for Kala Jewelry E-commerce

## 📋 **Pre-Deployment Requirements**

### ✅ **1. Prepare Your Code**
- [x] Code is committed to Git repository (GitHub, GitLab, or Bitbucket)
- [x] Next.js application builds successfully (`npm run build`)
- [x] Environment variables are configured
- [x] Database is set up and populated

### ✅ **2. Supabase Production Setup**
You have two options:

#### Option A: Use Same Supabase Project (Recommended for testing)
- Use your existing Supabase project for production
- Your data and products will be available immediately

#### Option B: Create Separate Production Project (Recommended for real production)
1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Create a new project for production
3. Copy the database schema from `database/schema.sql`
4. Run the schema in your production Supabase SQL editor
5. Migrate your data using the migration scripts

---

## 🚀 **Vercel Deployment Steps**

### **Step 1: Install Vercel CLI (Optional)**
```bash
npm install -g vercel
```

### **Step 2: Deploy via Vercel Dashboard (Easiest Method)**

1. **Go to [Vercel Dashboard](https://vercel.com/dashboard)**
2. **Click "New Project"**
3. **Import your Git repository**
   - Connect your GitHub/GitLab/Bitbucket account
   - Select your `kala` repository
   - Click "Import"

4. **Configure Project Settings**
   - **Project Name**: `kala-jewelry` (or your preferred name)
   - **Framework Preset**: Next.js (should auto-detect)
   - **Root Directory**: `./` (keep default)
   - **Build Command**: `npm run build` (keep default)
   - **Output Directory**: `.next` (keep default)
   - **Install Command**: `npm install` (keep default)

### **Step 3: Configure Environment Variables**

In the Vercel project settings, add these environment variables:

#### **Required Environment Variables:**

```bash
# Database Configuration
USE_SUPABASE_DATABASE=true
NEXT_PUBLIC_SUPABASE_URL=https://fdzgykiawrbvihoihrvf.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZkemd5a2lhd3Jidmlob2locnZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM1MzUzNzQsImV4cCI6MjA2OTExMTM3NH0.SzWgP5beTUdkoZjR88iCEC6gQOGejWepsMNYWgutyfE
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZkemd5a2lhd3Jidmlob2locnZmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzUzNTM3NCwiZXhwIjoyMDY5MTExMzc0fQ.aQ6gbkIctdrghYlRho6WRbe0sWY6mmCIsKYXIH1kJ60

# Admin Configuration
ADMIN_KEY=kala-admin-production-2024-secure-key

# Email Configuration
EMAIL_USER=samyakgupta450@gmail.com
EMAIL_PASS=yppb wkta sxvb llop
EMAIL_FROM=noreply@kala-jewelry.com
ADMIN_EMAIL=samyakgupta450@gmail.com
EMAIL_REPLY_TO=samyak.sage@gmail.com
EMAIL_DEBUG=false

# Site Configuration (will be updated after deployment)
NEXT_PUBLIC_SITE_URL=https://your-vercel-domain.vercel.app
```

**How to add environment variables in Vercel:**
1. Go to your project dashboard
2. Click "Settings" tab
3. Click "Environment Variables" in the sidebar
4. Add each variable one by one
5. Set environment to "Production" (and optionally "Preview" and "Development")

### **Step 4: Deploy**

1. **Click "Deploy"** in Vercel dashboard
2. **Wait for build to complete** (usually 2-5 minutes)
3. **Your app will be available at**: `https://your-project-name.vercel.app`

---

## 🔧 **Post-Deployment Configuration**

### **1. Update Site URL**
After deployment, update the `NEXT_PUBLIC_SITE_URL` environment variable:
1. Go to Vercel project settings
2. Environment Variables
3. Edit `NEXT_PUBLIC_SITE_URL` to your actual Vercel URL
4. Redeploy (or it will auto-redeploy)

### **2. Custom Domain (Optional)**
1. Go to your project settings in Vercel
2. Click "Domains" tab
3. Add your custom domain
4. Configure DNS records as instructed
5. Update `NEXT_PUBLIC_SITE_URL` to your custom domain

### **3. Test Your Deployment**

Visit these URLs to test:
- **Homepage**: `https://your-domain.vercel.app`
- **Shop**: `https://your-domain.vercel.app/shop`
- **Admin Panel**: `https://your-domain.vercel.app/admin`
- **API Health**: `https://your-domain.vercel.app/api/products`

---

## 🔧 **Alternative: Deploy via Vercel CLI**

If you prefer using the command line:

1. **Login to Vercel**
   ```bash
   vercel login
   ```

2. **Deploy from your project directory**
   ```bash
   vercel
   ```

3. **Follow the prompts**
   - Link to existing project or create new one
   - Confirm settings
   - Wait for deployment

4. **Set environment variables via CLI**
   ```bash
   vercel env add NEXT_PUBLIC_SUPABASE_URL
   vercel env add SUPABASE_SERVICE_ROLE_KEY
   # ... add all other variables
   ```

5. **Redeploy with environment variables**
   ```bash
   vercel --prod
   ```

---

## 🛡️ **Security Checklist for Production**

### **Environment Variables**
- [x] All sensitive keys are set as environment variables
- [x] No `.env` files are committed to Git
- [x] Production admin key is different from development
- [x] Supabase service role key is kept secret

### **Database Security**
- [x] Row Level Security (RLS) is enabled in Supabase
- [x] Proper authentication rules are in place
- [x] Database backups are configured

### **Application Security**
- [x] Rate limiting is configured for API endpoints
- [x] Email validation is in place
- [x] Admin routes are protected

---

## 📊 **Monitoring & Analytics**

### **Vercel Analytics**
1. Go to your project in Vercel
2. Click "Analytics" tab
3. Enable Web Analytics
4. Monitor performance and usage

### **Supabase Monitoring**
1. Monitor database usage in Supabase dashboard
2. Set up alerts for high usage
3. Monitor API request patterns

---

## 🚨 **Troubleshooting Common Issues**

### **Build Failures**
- Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Fix any TypeScript/ESLint errors

### **Environment Variable Issues**
- Verify all required variables are set
- Check for typos in variable names
- Ensure sensitive variables are not exposed

### **Database Connection Issues**
- Verify Supabase credentials
- Check Supabase project status
- Test database connection locally

### **Email Issues**
- Verify Gmail app password is correct
- Check email configuration
- Test email functionality

---

## 🎉 **You're Ready to Deploy!**

Your Kala jewelry e-commerce application is ready for production deployment on Vercel. The application includes:

- ✅ Complete product catalog with 11+ jewelry items
- ✅ Shopping cart and checkout functionality
- ✅ Admin panel for managing products and orders
- ✅ Email notifications for orders
- ✅ Responsive design for all devices
- ✅ Supabase database integration
- ✅ Analytics and tracking

Follow the steps above, and your store will be live and ready to accept orders!
