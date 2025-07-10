# Email Testing Guide for Kala Jewelry

This guide explains how to test the email functionality in the Kala Jewelry e-commerce platform.

## Setup Email Configuration

1. **Configure Your Email Provider**

   Edit the `.env.local` file with your email credentials:

   ```
   # Option 1: Gmail SMTP (Recommended for testing)
   EMAIL_USER=your-gmail@gmail.com
   EMAIL_PASS=your-app-specific-password  # Not your regular Gmail password!
   EMAIL_FROM=noreply@kala-jewelry.com
   ADMIN_EMAIL=admin@kala-jewelry.com
   EMAIL_REPLY_TO=support@kala-jewelry.com
   ```

   **For Gmail Users:**
   - Enable 2-factor authentication on your Gmail account
   - Generate an App Password (Google Account → Security → 2-Step Verification → App passwords)
   - Use this App Password in the `.env.local` file (not your regular Gmail password)

2. **Alternative Email Services**

   You can also use SendGrid or Mailgun by uncommenting and configuring their respective settings in the `.env.local` file.

## Testing Methods

### Method 1: Using the Test Email API Endpoint

The easiest way to test email functionality is using the dedicated test endpoint:

```bash
# Test order confirmation email
curl "http://localhost:3001/api/test/email?adminKey=kala-admin-2024&email=recipient@example.com&type=confirmation"

# Test order approval email
curl "http://localhost:3001/api/test/email?adminKey=kala-admin-2024&email=recipient@example.com&type=approval"

# Test order rejection email
curl "http://localhost:3001/api/test/email?adminKey=kala-admin-2024&email=recipient@example.com&type=rejection"
```

### Method 2: Testing via the Order Flow

1. **Create a New Order**
   - Go to the store frontend
   - Add items to cart
   - Complete checkout with your test email

2. **Update Order Status in Admin Panel**
   - Log in to the admin panel
   - Find your test order
   - Change its status to "approved" or "rejected"
   - This will trigger the corresponding email

### Method 3: Manual API Testing

You can manually test the order update endpoint with:

```bash
curl -X PATCH http://localhost:3001/api/admin/update-order \
  -H "Content-Type: application/json" \
  -d '{
    "orderId": "YOUR_TEST_ORDER_ID",
    "status": "approved",
    "adminKey": "kala-admin-2024",
    "adminNotes": "Test approval note"
  }'
```

## Email Debugging

If you're experiencing issues with email sending:

1. **Enable Email Debug Mode**
   
   Set `EMAIL_DEBUG=true` in your `.env.local` file to see detailed email logs in the console.

2. **Check Server Logs**
   
   Monitor the terminal where your Next.js server is running for email-related log messages.

3. **Common Issues**

   - **Authentication Failed**: Check your email credentials
   - **Connection Timeout**: Ensure your network allows SMTP connections
   - **Rate Limiting**: Gmail and other providers may limit the number of emails you can send

## Gmail-Specific Settings

If using Gmail, you might need to:

1. Allow less secure apps access to your account
2. Unlock CAPTCHA to enable new connections: https://accounts.google.com/DisplayUnlockCaptcha

## Testing in Production

For production environments, use a dedicated email service like SendGrid or Mailgun rather than Gmail SMTP.

---

If you continue experiencing issues, check the error messages in the console logs or contact the system administrator.
