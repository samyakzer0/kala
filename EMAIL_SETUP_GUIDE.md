# Email Functionality Setup Guide

This guide explains how to set up and use email functionalities in your Kala Jewelry e-commerce platform.

## 🚀 Quick Setup

### Step 1: Choose Your Email Provider

You have several options for sending emails:

#### Option A: Gmail SMTP (Recommended for small businesses)
1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App Password**:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
3. **Use Gmail credentials** in environment variables

#### Option B: SendGrid (Recommended for production)
1. Sign up at [SendGrid](https://sendgrid.com)
2. Create an API key
3. Verify your sender identity

#### Option C: Mailgun (Alternative for production)
1. Sign up at [Mailgun](https://mailgun.com)
2. Get your API key and domain
3. Verify your domain

### Step 2: Set Environment Variables

Create a `.env.local` file in your project root:

```bash
# Copy from .env.example and fill in your values

# Option A: Gmail SMTP
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-specific-password
EMAIL_FROM=noreply@kala-jewelry.com
ADMIN_EMAIL=admin@kala-jewelry.com

# Option B: SendGrid
# SENDGRID_API_KEY=your-sendgrid-api-key

# Option C: Mailgun
# MAILGUN_API_KEY=your-mailgun-api-key
# MAILGUN_DOMAIN=your-domain.mailgun.org
```

### Step 3: Test Email Functionality

1. **Start your development server**:
   ```bash
   npm run dev
   ```

2. **Test order placement**:
   - Go to your shop
   - Add items to cart
   - Complete checkout
   - Check console logs for email simulation

3. **Enable real emails**:
   - Add your email credentials to `.env.local`
   - Restart the server
   - Place a test order

## 📧 Available Email Features

### Current Email Types

1. **Order Confirmation** - Sent to customer
2. **Admin Notification** - Sent to store admin
3. **Order Approval** - Sent to customer when admin approves
4. **Order Rejection** - Sent to customer if order is rejected

### Email Templates

The system uses customizable HTML email templates with:
- Professional styling
- Order details
- Customer information
- Admin action buttons
- Responsive design

### Email Tracking

- All emails are logged in console
- Success/failure status tracking
- Message ID for email service integration

## 🛠️ Advanced Configuration

### Custom Email Templates

To customize email templates, modify the template generation in:
- `/utils/email.ts` - Base email functionality
- `/app/api/send-order/route.ts` - Order email templates

### Multiple Email Providers

You can configure multiple providers and switch between them:

```typescript
// In utils/email.ts
const EMAIL_PROVIDER = process.env.EMAIL_PROVIDER || 'gmail';

switch (EMAIL_PROVIDER) {
  case 'sendgrid':
    // SendGrid configuration
    break;
  case 'mailgun':
    // Mailgun configuration
    break;
  default:
    // Gmail SMTP configuration
}
```

### Email Queue (Future Enhancement)

For high-volume emails, consider implementing:
- Redis-based email queue
- Batch email processing
- Retry mechanisms
- Email delivery status tracking

## 📋 Testing Checklist

- [ ] Environment variables configured
- [ ] Email credentials valid
- [ ] Test order placement
- [ ] Customer receives confirmation
- [ ] Admin receives notification
- [ ] Email templates look good
- [ ] Links in emails work
- [ ] Mobile-responsive emails

## 🔧 Troubleshooting

### Common Issues

1. **"Authentication failed"**
   - Check Gmail app password is correct
   - Ensure 2FA is enabled
   - Verify EMAIL_USER and EMAIL_PASS

2. **"Connection timeout"**
   - Check internet connection
   - Verify SMTP settings
   - Try different port (465 for SSL)

3. **Emails not being sent**
   - Check console logs for errors
   - Verify .env.local file exists
   - Restart development server

4. **Emails going to spam**
   - Set up SPF/DKIM records
   - Use verified sender domain
   - Avoid spam trigger words

### Debug Mode

Enable detailed email logging:

```bash
# In .env.local
EMAIL_DEBUG=true
```

## 📧 Production Recommendations

### For Small Business (< 100 orders/day)
- Use Gmail SMTP
- Set up professional email address
- Configure proper sender name

### For Growing Business (100-1000 orders/day)
- Use SendGrid or Mailgun
- Set up email analytics
- Implement delivery tracking

### For Large Business (1000+ orders/day)
- Use enterprise email service
- Implement email queue
- Set up monitoring and alerts
- Use dedicated IP addresses

## 🔐 Security Best Practices

1. **Never commit email credentials** to git
2. **Use environment variables** for all sensitive data
3. **Implement rate limiting** for email endpoints
4. **Validate email addresses** before sending
5. **Use secure SMTP** connections (TLS/SSL)
6. **Monitor email bounces** and unsubscribes

## 🚀 Next Steps

After basic email setup:
1. Customize email templates to match your brand
2. Set up email analytics and tracking
3. Implement customer email preferences
4. Add newsletter functionality
5. Set up automated email sequences
6. Integrate with CRM systems

---

Need help? Check the console logs or contact support!
