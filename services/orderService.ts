import { supabaseAdmin, isSupabaseConfigured, Database, OrderStatus, CustomerData, OrderItem, ShippingInfo } from '../lib/supabase';
import { Order } from '../types/order';

// Order service class for Supabase operations
export class OrderService {
  private static isConfigured = isSupabaseConfigured();

  // Create a new order
  static async createOrder(order: Order): Promise<Order> {
    if (!this.isConfigured) {
      throw new Error('Supabase is not properly configured');
    }

    try {
      const { data, error } = await supabaseAdmin
        .from('orders')
        .insert({
          id: order.id,
          customer_data: order.customer,
          items: order.items,
          subtotal: order.subtotal,
          status: order.status,
          admin_notes: order.adminNotes,
          approved_at: order.approvedAt,
          delivered_at: order.deliveredAt,
          delivery_notes: order.deliveryNotes,
          shipping: order.shipping,
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating order:', error);
        throw new Error(`Failed to create order: ${error.message}`);
      }

      return this.transformDbOrderToOrder(data);
    } catch (error) {
      console.error('Order creation failed:', error);
      throw error;
    }
  }

  // Get order by ID
  static async getOrderById(orderId: string): Promise<Order | null> {
    if (!this.isConfigured) {
      throw new Error('Supabase is not properly configured');
    }

    try {
      const { data, error } = await supabaseAdmin
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null; // Order not found
        }
        console.error('Error fetching order:', error);
        throw new Error(`Failed to fetch order: ${error.message}`);
      }

      return this.transformDbOrderToOrder(data);
    } catch (error) {
      console.error('Order fetch failed:', error);
      throw error;
    }
  }

  // Update order status
  static async updateOrderStatus(
    orderId: string,
    status: OrderStatus,
    additionalFields?: {
      adminNotes?: string;
      approvedAt?: string;
      deliveredAt?: string;
      deliveryNotes?: string;
    }
  ): Promise<Order | null> {
    if (!this.isConfigured) {
      throw new Error('Supabase is not properly configured');
    }

    try {
      const updateData: any = {
        status,
        updated_at: new Date().toISOString(),
      };

      // Apply additional fields if provided
      if (additionalFields) {
        if (additionalFields.adminNotes) {
          updateData.admin_notes = additionalFields.adminNotes;
        }
        if (additionalFields.approvedAt) {
          updateData.approved_at = additionalFields.approvedAt;
        }
        if (additionalFields.deliveredAt) {
          updateData.delivered_at = additionalFields.deliveredAt;
        }
        if (additionalFields.deliveryNotes) {
          updateData.delivery_notes = additionalFields.deliveryNotes;
        }
      }

      // Set approvedAt if status is approved and not already provided
      if (status === 'approved' && !additionalFields?.approvedAt) {
        updateData.approved_at = new Date().toISOString();
      }

      const { data, error } = await supabaseAdmin
        .from('orders')
        .update(updateData)
        .eq('id', orderId)
        .select()
        .single();

      if (error) {
        console.error('Error updating order status:', error);
        throw new Error(`Failed to update order status: ${error.message}`);
      }

      return this.transformDbOrderToOrder(data);
    } catch (error) {
      console.error('Order status update failed:', error);
      throw error;
    }
  }

  // Update order shipping information
  static async updateOrderShipping(
    orderId: string,
    shippingInfo: {
      trackingId: string;
      provider: string;
      shippingMethod?: string;
      estimatedDelivery?: string;
    }
  ): Promise<Order | null> {
    if (!this.isConfigured) {
      throw new Error('Supabase is not properly configured');
    }

    try {
      // First get the current order to merge shipping info
      const currentOrder = await this.getOrderById(orderId);
      if (!currentOrder) {
        return null;
      }

      const updatedShipping = {
        ...currentOrder.shipping,
        ...shippingInfo,
        shippedAt: new Date().toISOString(),
      };

      const { data, error } = await supabaseAdmin
        .from('orders')
        .update({
          shipping: updatedShipping,
          status: 'shipped',
          updated_at: new Date().toISOString(),
        })
        .eq('id', orderId)
        .select()
        .single();

      if (error) {
        console.error('Error updating order shipping:', error);
        throw new Error(`Failed to update order shipping: ${error.message}`);
      }

      return this.transformDbOrderToOrder(data);
    } catch (error) {
      console.error('Order shipping update failed:', error);
      throw error;
    }
  }

  // Get all orders
  static async getAllOrders(): Promise<Order[]> {
    if (!this.isConfigured) {
      throw new Error('Supabase is not properly configured');
    }

    try {
      const { data, error } = await supabaseAdmin
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching all orders:', error);
        throw new Error(`Failed to fetch orders: ${error.message}`);
      }

      return data.map(order => this.transformDbOrderToOrder(order));
    } catch (error) {
      console.error('Orders fetch failed:', error);
      throw error;
    }
  }

  // Get orders by status
  static async getOrdersByStatus(status: OrderStatus): Promise<Order[]> {
    if (!this.isConfigured) {
      throw new Error('Supabase is not properly configured');
    }

    try {
      const { data, error } = await supabaseAdmin
        .from('orders')
        .select('*')
        .eq('status', status)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching orders by status:', error);
        throw new Error(`Failed to fetch orders by status: ${error.message}`);
      }

      return data.map(order => this.transformDbOrderToOrder(order));
    } catch (error) {
      console.error('Orders by status fetch failed:', error);
      throw error;
    }
  }

  // Get orders by customer email
  static async getOrdersByCustomerEmail(email: string): Promise<Order[]> {
    if (!this.isConfigured) {
      throw new Error('Supabase is not properly configured');
    }

    try {
      const { data, error } = await supabaseAdmin
        .from('orders')
        .select('*')
        .contains('customer_data', { email: email.toLowerCase() })
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching orders by email:', error);
        throw new Error(`Failed to fetch orders by email: ${error.message}`);
      }

      return data.map(order => this.transformDbOrderToOrder(order));
    } catch (error) {
      console.error('Orders by email fetch failed:', error);
      throw error;
    }
  }

  // Delete order
  static async deleteOrder(orderId: string): Promise<boolean> {
    if (!this.isConfigured) {
      throw new Error('Supabase is not properly configured');
    }

    try {
      const { error } = await supabaseAdmin
        .from('orders')
        .delete()
        .eq('id', orderId);

      if (error) {
        console.error('Error deleting order:', error);
        throw new Error(`Failed to delete order: ${error.message}`);
      }

      return true;
    } catch (error) {
      console.error('Order deletion failed:', error);
      return false;
    }
  }

  // Get order statistics
  static async getOrderStats(): Promise<{
    total: number;
    pending: number;
    approved: number;
    rejected: number;
    shipped: number;
    delivered: number;
    totalRevenue: number;
    averageOrderValue: number;
  }> {
    if (!this.isConfigured) {
      throw new Error('Supabase is not properly configured');
    }

    try {
      // Get all orders for statistics
      const { data: orders, error } = await supabaseAdmin
        .from('orders')
        .select('status, subtotal');

      if (error) {
        console.error('Error fetching order statistics:', error);
        throw new Error(`Failed to fetch order statistics: ${error.message}`);
      }

      const stats = {
        total: orders.length,
        pending: 0,
        approved: 0,
        rejected: 0,
        shipped: 0,
        delivered: 0,
        totalRevenue: 0,
        averageOrderValue: 0,
      };

      orders.forEach(order => {
        stats[order.status as keyof typeof stats]++;
        if (order.status !== 'rejected') {
          stats.totalRevenue += order.subtotal;
        }
      });

      stats.averageOrderValue = stats.total > 0 ? stats.totalRevenue / stats.total : 0;

      return stats;
    } catch (error) {
      console.error('Order statistics fetch failed:', error);
      throw error;
    }
  }

  // Transform database order to application order
  private static transformDbOrderToOrder(dbOrder: Database['public']['Tables']['orders']['Row']): Order {
    return {
      id: dbOrder.id,
      customer: dbOrder.customer_data,
      items: dbOrder.items,
      subtotal: dbOrder.subtotal,
      status: dbOrder.status,
      createdAt: dbOrder.created_at,
      approvedAt: dbOrder.approved_at,
      adminNotes: dbOrder.admin_notes,
      deliveredAt: dbOrder.delivered_at,
      deliveryNotes: dbOrder.delivery_notes,
      shipping: dbOrder.shipping,
    };
  }
}

// Legacy function exports for backward compatibility
export async function createOrder(order: Order): Promise<Order> {
  return OrderService.createOrder(order);
}

export async function getOrderById(orderId: string): Promise<Order | null> {
  return OrderService.getOrderById(orderId);
}

export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus,
  additionalFields?: {
    adminNotes?: string;
    approvedAt?: string;
    deliveredAt?: string;
    deliveryNotes?: string;
  }
): Promise<Order | null> {
  return OrderService.updateOrderStatus(orderId, status, additionalFields);
}

export async function updateOrderShipping(
  orderId: string,
  shippingInfo: {
    trackingId: string;
    provider: string;
    shippingMethod?: string;
    estimatedDelivery?: string;
  }
): Promise<Order | null> {
  return OrderService.updateOrderShipping(orderId, shippingInfo);
}

export async function getAllOrders(): Promise<Order[]> {
  return OrderService.getAllOrders();
}

export async function getOrdersByStatus(status: OrderStatus): Promise<Order[]> {
  return OrderService.getOrdersByStatus(status);
}

export async function getOrdersByCustomerEmail(email: string): Promise<Order[]> {
  return OrderService.getOrdersByCustomerEmail(email);
}

export async function deleteOrder(orderId: string): Promise<boolean> {
  return OrderService.deleteOrder(orderId);
}

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
  return OrderService.getOrderStats();
}
