import { Order } from '../types/order';
import { promises as fs } from 'fs';
import path from 'path';

// In production, you would use a proper database like PostgreSQL, MongoDB, etc.
// This is a simple file-based storage for demonstration purposes

const ORDERS_FILE = path.join(process.cwd(), 'data', 'orders.json');

// Ensure data directory exists
async function ensureDataDirectory(): Promise<void> {
  const dataDir = path.dirname(ORDERS_FILE);
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }
}

// Load orders from file
async function loadOrders(): Promise<Order[]> {
  try {
    await ensureDataDirectory();
    const data = await fs.readFile(ORDERS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // File doesn't exist or is empty, return empty array
    return [];
  }
}

// Save orders to file
async function saveOrders(orders: Order[]): Promise<void> {
  await ensureDataDirectory();
  await fs.writeFile(ORDERS_FILE, JSON.stringify(orders, null, 2));
}

// Create a new order
export async function createOrder(order: Order): Promise<Order> {
  const orders = await loadOrders();
  orders.push(order);
  await saveOrders(orders);
  return order;
}

// Get order by ID
export async function getOrderById(orderId: string): Promise<Order | null> {
  const orders = await loadOrders();
  return orders.find(order => order.id === orderId) || null;
}

// Update order status
export async function updateOrderStatus(
  orderId: string, 
  status: Order['status'],
  adminNotes?: string
): Promise<Order | null> {
  const orders = await loadOrders();
  const orderIndex = orders.findIndex(order => order.id === orderId);
  
  if (orderIndex === -1) {
    return null;
  }
  
  orders[orderIndex].status = status;
  if (adminNotes) {
    orders[orderIndex].adminNotes = adminNotes;
  }
  if (status === 'approved') {
    orders[orderIndex].approvedAt = new Date().toISOString();
  }
  
  await saveOrders(orders);
  return orders[orderIndex];
}

// Get all orders (for admin panel)
export async function getAllOrders(): Promise<Order[]> {
  return loadOrders();
}

// Get orders by status
export async function getOrdersByStatus(status: Order['status']): Promise<Order[]> {
  const orders = await loadOrders();
  return orders.filter(order => order.status === status);
}

// Get orders by customer email
export async function getOrdersByCustomerEmail(email: string): Promise<Order[]> {
  const orders = await loadOrders();
  return orders.filter(order => order.customer.email.toLowerCase() === email.toLowerCase());
}

// Delete order (for cleanup/testing)
export async function deleteOrder(orderId: string): Promise<boolean> {
  const orders = await loadOrders();
  const initialLength = orders.length;
  const filteredOrders = orders.filter(order => order.id !== orderId);
  
  if (filteredOrders.length === initialLength) {
    return false; // Order not found
  }
  
  await saveOrders(filteredOrders);
  return true;
}

// Get order statistics
export async function getOrderStats(): Promise<{
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  shipped: number;
  delivered: number;
  totalRevenue: number;
  averageOrderValue: number;
}> {
  const orders = await loadOrders();
  
  const stats = {
    total: orders.length,
    pending: 0,
    approved: 0,
    rejected: 0,
    shipped: 0,
    delivered: 0,
    totalRevenue: 0,
    averageOrderValue: 0
  };
  
  orders.forEach(order => {
    stats[order.status]++;
    if (order.status !== 'rejected') {
      stats.totalRevenue += order.subtotal;
    }
  });
  
  stats.averageOrderValue = stats.total > 0 ? stats.totalRevenue / stats.total : 0;
  
  return stats;
}
