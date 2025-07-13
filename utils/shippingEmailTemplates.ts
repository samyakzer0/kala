// Shipping notification email templates for emailService.ts

// Get order shipped email template
function getOrderShippedTemplate(order: any): EmailTemplate {
  return {
    subject: `Your Order #${order.id} Has Been Shipped! 📦`,
    text: `
Great news! Your order has been shipped and is on its way to you.

Order ID: ${order.id}
Tracking ID: ${order.shipping?.trackingId || 'N/A'}
Shipping Provider: ${order.shipping?.provider || 'N/A'}
${order.shipping?.estimatedDelivery ? `Estimated Delivery: ${order.shipping.estimatedDelivery}` : ''}

Items:
${order.items.map((item: any) => `- ${item.name} (Qty: ${item.quantity}) - ₹${item.price.toLocaleString()}`).join('\n')}

You can track your package using the tracking ID provided above.

Best regards,
Kala Jewelry Team
    `.trim(),
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Order Shipped</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f9fafb;">
  <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; overflow: hidden;">
    <div style="background: linear-gradient(135deg, #059669 0%, #10b981 100%); color: white; padding: 30px; text-align: center;">
      <h1 style="margin: 0; font-size: 28px;">📦 Your Order Has Been Shipped!</h1>
      <p style="margin: 10px 0 0 0;">Your jewelry is on its way to you</p>
    </div>
    
    <div style="padding: 30px;">
      <p>Dear <strong>${order.customer.firstName} ${order.customer.lastName}</strong>,</p>
      <p>Exciting news! Your order has been carefully packaged and shipped.</p>
      
      <div style="background-color: #f0f9ff; border-radius: 8px; padding: 20px; margin: 20px 0;">
        <h3 style="color: #1e40af; margin: 0 0 15px 0;">📍 Tracking Information</h3>
        <div><strong>Tracking ID:</strong> ${order.shipping?.trackingId || 'N/A'}</div>
        <div><strong>Provider:</strong> ${order.shipping?.provider || 'N/A'}</div>
        ${order.shipping?.estimatedDelivery ? `<div><strong>Estimated Delivery:</strong> ${order.shipping.estimatedDelivery}</div>` : ''}
      </div>
      
      <div style="background-color: #f9fafb; border-radius: 8px; padding: 20px;">
        <h3>Order Summary</h3>
        <div><strong>Order ID:</strong> ${order.id}</div>
        <div><strong>Items:</strong></div>
        <ul>
          ${order.items.map((item: any) => `<li>${item.name} (Qty: ${item.quantity}) - ₹${item.price.toLocaleString()}</li>`).join('')}
        </ul>
      </div>
    </div>
    
    <div style="background-color: #f9fafb; padding: 20px; text-align: center;">
      <p style="color: #6b7280; margin: 0;">Thank you for choosing Kala Jewelry</p>
    </div>
  </div>
</body>
</html>
    `
  };
}

// Get order out for delivery email template
function getOrderOutForDeliveryTemplate(order: any): EmailTemplate {
  return {
    subject: `Your Order #${order.id} is Out for Delivery! 🚚`,
    text: `
Your order is almost here! It's out for delivery and should arrive today.

Order ID: ${order.id}
Tracking ID: ${order.shipping?.trackingId || 'N/A'}
Shipping Provider: ${order.shipping?.provider || 'N/A'}

Items:
${order.items.map((item: any) => `- ${item.name} (Qty: ${item.quantity}) - ₹${item.price.toLocaleString()}`).join('\n')}

Please ensure someone is available to receive the package.

Best regards,
Kala Jewelry Team
    `.trim(),
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Out for Delivery</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f9fafb;">
  <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; overflow: hidden;">
    <div style="background: linear-gradient(135deg, #f59e0b 0%, #f97316 100%); color: white; padding: 30px; text-align: center;">
      <h1 style="margin: 0; font-size: 28px;">🚚 Out for Delivery!</h1>
      <p style="margin: 10px 0 0 0;">Your jewelry is almost there</p>
    </div>
    
    <div style="padding: 30px;">
      <p>Dear <strong>${order.customer.firstName} ${order.customer.lastName}</strong>,</p>
      <p>Great news! Your order is now out for delivery and should arrive today.</p>
      
      <div style="background-color: #fef3c7; border-radius: 8px; padding: 20px; margin: 20px 0;">
        <h3 style="color: #92400e; margin: 0 0 15px 0;">🚚 Delivery Information</h3>
        <div><strong>Tracking ID:</strong> ${order.shipping?.trackingId || 'N/A'}</div>
        <div><strong>Provider:</strong> ${order.shipping?.provider || 'N/A'}</div>
        <div><strong>Delivery Address:</strong></div>
        <div style="margin-left: 10px;">
          ${order.customer.address}<br>
          ${order.customer.city}, ${order.customer.state} ${order.customer.zipCode}
        </div>
      </div>
      
      <div style="background-color: #f9fafb; border-radius: 8px; padding: 20px;">
        <h3>Order Summary</h3>
        <div><strong>Order ID:</strong> ${order.id}</div>
        <div><strong>Items:</strong></div>
        <ul>
          ${order.items.map((item: any) => `<li>${item.name} (Qty: ${item.quantity}) - ₹${item.price.toLocaleString()}</li>`).join('')}
        </ul>
      </div>
    </div>
    
    <div style="background-color: #f9fafb; padding: 20px; text-align: center;">
      <p style="color: #6b7280; margin: 0;">Thank you for choosing Kala Jewelry</p>
    </div>
  </div>
</body>
</html>
    `
  };
}

// Get order delivered email template
function getOrderDeliveredTemplate(order: any): EmailTemplate {
  return {
    subject: `Your Order #${order.id} Has Been Delivered! ✨`,
    text: `
Congratulations! Your order has been successfully delivered.

Order ID: ${order.id}
Tracking ID: ${order.shipping?.trackingId || 'N/A'}
Delivered at: ${new Date(order.deliveredAt || Date.now()).toLocaleString()}

Items:
${order.items.map((item: any) => `- ${item.name} (Qty: ${item.quantity}) - ₹${item.price.toLocaleString()}`).join('\n')}

We hope you love your new jewelry! If you have any questions, please contact us.

Thank you for choosing Kala Jewelry!

Best regards,
Kala Jewelry Team
    `.trim(),
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Order Delivered</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f9fafb;">
  <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; overflow: hidden;">
    <div style="background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%); color: white; padding: 30px; text-align: center;">
      <h1 style="margin: 0; font-size: 28px;">✨ Delivered Successfully!</h1>
      <p style="margin: 10px 0 0 0;">Your jewelry has arrived</p>
    </div>
    
    <div style="padding: 30px;">
      <p>Dear <strong>${order.customer.firstName} ${order.customer.lastName}</strong>,</p>
      <p>Wonderful news! Your order has been successfully delivered. We hope you love your new jewelry!</p>
      
      <div style="background-color: #f0fdf4; border-radius: 8px; padding: 20px; margin: 20px 0;">
        <h3 style="color: #166534; margin: 0 0 15px 0;">✅ Delivery Confirmation</h3>
        <div><strong>Tracking ID:</strong> ${order.shipping?.trackingId || 'N/A'}</div>
        <div><strong>Delivered At:</strong> ${new Date(order.deliveredAt || Date.now()).toLocaleString()}</div>
        <div><strong>Delivery Address:</strong></div>
        <div style="margin-left: 10px;">
          ${order.customer.address}<br>
          ${order.customer.city}, ${order.customer.state} ${order.customer.zipCode}
        </div>
      </div>
      
      <div style="background-color: #f9fafb; border-radius: 8px; padding: 20px;">
        <h3>Order Summary</h3>
        <div><strong>Order ID:</strong> ${order.id}</div>
        <div><strong>Items:</strong></div>
        <ul>
          ${order.items.map((item: any) => `<li>${item.name} (Qty: ${item.quantity}) - ₹${item.price.toLocaleString()}</li>`).join('')}
        </ul>
      </div>
      
      <div style="background-color: #fef7cd; border-radius: 8px; padding: 15px; margin: 20px 0;">
        <h4 style="color: #92400e; margin: 0 0 10px 0;">💎 Care Instructions</h4>
        <p style="color: #92400e; margin: 0; font-size: 14px;">
          To keep your jewelry looking beautiful: Store in a dry place, avoid chemicals, clean gently with a soft cloth.
        </p>
      </div>
    </div>
    
    <div style="background-color: #f9fafb; padding: 20px; text-align: center;">
      <p style="color: #6b7280; margin: 0;">Thank you for choosing Kala Jewelry</p>
    </div>
  </div>
</body>
</html>
    `
  };
}
