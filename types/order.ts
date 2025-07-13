export interface Order {
  id: string;
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    category: string;
  }>;
  subtotal: number;
  status: 'pending' | 'approved' | 'rejected' | 'shipped' | 'delivered';
  createdAt: string;
  approvedAt?: string;
  adminNotes?: string;
  deliveredAt?: string;
  deliveryNotes?: string;
}

export interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

export interface AdminConfig {
  email: string;
  notificationEmail: string;
}
