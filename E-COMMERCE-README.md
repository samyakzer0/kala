# Kala Jewelry E-commerce Platform

A complete e-commerce website built with Next.js 15 featuring order management, email notifications, and admin approval workflow.

## Features

### 🛍️ E-commerce Functionality
- Product catalog with categories (Rings, Necklaces, Earrings, Bracelets)
- Shopping cart with add/remove functionality
- Responsive product grid with filtering and sorting
- Product search and category navigation

### 📋 Order Management
- Complete checkout process with customer information
- Order tracking with unique order IDs
- Real-time order status updates
- Customer order history

### 📧 Email Notification System
- Automatic order confirmation emails to customers
- Admin notification emails for new orders
- Order approval/rejection notifications
- Professional HTML email templates

### 👨‍💼 Admin Panel
- Secure admin authentication
- Order approval/rejection workflow
- Order status management
- Customer information overview

### 🎨 Modern UI/UX
- Beautiful, responsive design with Tailwind CSS
- Smooth animations with Framer Motion
- Mobile-optimized layouts
- Professional jewelry store aesthetic

## Technology Stack

- **Frontend**: Next.js 15 (App Router), React, TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **State Management**: React Context API
- **Email**: Nodemailer (configurable for SendGrid, Mailgun, etc.)
- **Data Storage**: JSON file-based (easily replaceable with database)

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd kala-jewelry
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration (Optional)**
   Create a `.env.local` file in the root directory:
   ```env
   # Admin Configuration
   ADMIN_KEY=kala-admin-2024
   ADMIN_EMAIL=admin@kala-jewelry.com
   
   # Email Configuration (for production)
   SENDGRID_API_KEY=your_sendgrid_api_key
   SMTP_HOST=your_smtp_host
   SMTP_PORT=587
   SMTP_USER=your_smtp_user
   SMTP_PASS=your_smtp_password
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3001`

## Usage Guide

### For Customers

1. **Browse Products**
   - Visit the homepage or shop page
   - Use category filters to find specific jewelry types
   - Sort by price, name, or featured items

2. **Add to Cart**
   - Click on products to view details
   - Add items to cart with quantity selection
   - View cart items in the cart drawer

3. **Checkout Process**
   - Fill in shipping and contact information
   - Review order summary
   - Submit order

4. **Order Tracking**
   - Receive order confirmation email
   - Check order status on success page
   - Receive approval/shipping notifications

### For Administrators

1. **Access Admin Panel**
   - Navigate to `/admin`
   - Enter admin key: `kala-admin-2024`

2. **Manage Orders**
   - View all pending orders
   - Approve or reject orders
   - Add admin notes
   - Monitor order status

3. **Email Notifications**
   - Automatic notifications sent for new orders
   - Customer notifications sent upon approval
   - Email templates can be customized

## API Endpoints

### Public Endpoints
- `POST /api/send-order` - Submit new order
- `GET /api/order-status?orderId=<id>` - Get order status
- `GET /api/order-status?email=<email>` - Get orders by customer email

### Admin Endpoints
- `POST /api/admin/approve-order` - Approve/reject orders (requires admin key)

## Order Workflow

1. **Customer places order** → Order created with 'pending' status
2. **Admin receives email** → Notification with order details
3. **Admin reviews order** → Approve or reject via admin panel
4. **Customer notified** → Email sent based on admin decision
5. **Order fulfillment** → Status can be updated to 'shipped', 'delivered'

## Email Templates

The system includes professional HTML email templates for:
- Order confirmation (customer)
- New order notification (admin)
- Order approval (customer)
- Order rejection (customer)

Templates are located in `utils/order.ts` and can be customized as needed.

## Data Storage

Currently uses JSON file storage (`data/orders.json`) for simplicity. For production:

1. **Replace with Database**
   - PostgreSQL with Prisma
   - MongoDB with Mongoose
   - Firebase Firestore
   - Supabase

2. **Update Storage Functions**
   - Modify `utils/orderStorage.ts`
   - Implement database queries
   - Add connection pooling

## Email Configuration

### Development
- Emails are logged to console
- No actual emails sent

### Production Options

1. **SendGrid**
   ```javascript
   const sgMail = require('@sendgrid/mail');
   sgMail.setApiKey(process.env.SENDGRID_API_KEY);
   ```

2. **Mailgun**
   ```javascript
   const mailgun = require('mailgun-js');
   const mg = mailgun({apiKey: API_KEY, domain: DOMAIN});
   ```

3. **SMTP (Nodemailer)**
   ```javascript
   const transporter = nodemailer.createTransporter({
     host: process.env.SMTP_HOST,
     port: process.env.SMTP_PORT,
     auth: {
       user: process.env.SMTP_USER,
       pass: process.env.SMTP_PASS
     }
   });
   ```

## Customization

### Adding New Product Categories
1. Update `data/products.ts`
2. Add new category to `categories` array
3. Add subcategories if needed
4. Create product placeholder component

### Modifying Email Templates
1. Edit functions in `utils/order.ts`
2. Customize HTML and text content
3. Update styling and branding

### Styling Changes
1. Modify Tailwind classes
2. Update color scheme in `tailwind.config.js`
3. Customize animations in component files

## Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Other Platforms
- **Netlify**: Configure build settings
- **Railway**: Connect GitHub repository
- **DigitalOcean App Platform**: Use Docker or buildpack

### Important Configuration Notes

⚠️ **API Routes Configuration**: This project requires server-side functionality for the e-commerce features. The `output: "export"` configuration in `next.config.ts` has been disabled to enable API routes. This means:

- ✅ Full e-commerce functionality with server-side APIs
- ✅ Order management and email notifications  
- ✅ Admin panel with real-time data
- ❌ Cannot deploy as static files (GitHub Pages, Netlify static)
- ✅ Can deploy to Vercel, Netlify Functions, or any Node.js hosting

## Security Considerations

1. **Admin Authentication**
   - Replace simple key with proper auth (NextAuth.js)
   - Implement role-based access control
   - Use secure session management

2. **Data Validation**
   - Validate all inputs server-side
   - Sanitize customer data
   - Implement rate limiting

3. **Environment Variables**
   - Store sensitive data in environment variables
   - Use different keys for development/production
   - Never commit secrets to version control

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For questions or support:
- Email: support@kala-jewelry.com
- GitHub Issues: [Create an issue](link-to-issues)
- Documentation: [View docs](link-to-docs)

---

**Note**: This is a demonstration e-commerce platform. For production use, implement proper authentication, database storage, and payment processing.
