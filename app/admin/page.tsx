'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Order {
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
}

export default function AdminPanel() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [adminKey, setAdminKey] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [processingOrderId, setProcessingOrderId] = useState<string | null>(null);

  // Simple authentication
  const handleLogin = () => {
    if (adminKey === 'kala-admin-2024') {
      setIsAuthenticated(true);
      fetchOrders();
    } else {
      alert('Invalid admin key');
    }
  };

  const fetchOrders = async () => {
    setLoading(true);
    // In a real app, you'd have a protected API endpoint for this
    // For demo purposes, we'll simulate fetching orders
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock data for demonstration
      const mockOrders: Order[] = [
        {
          id: 'KJ-L8H9K2-ABC123',
          customer: {
            firstName: 'Jane',
            lastName: 'Smith',
            email: 'jane.smith@example.com',
            phone: '+1-555-0123',
            address: '123 Main Street',
            city: 'New York',
            state: 'NY',
            zipCode: '10001',
            country: 'United States'
          },
          items: [
            {
              id: 'ring-1',
              name: 'Charis Diamond Ring',
              price: 279,
              quantity: 1,
              category: 'rings'
            }
          ],
          subtotal: 279,
          status: 'pending',
          createdAt: new Date().toISOString()
        }
      ];
      
      setOrders(mockOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOrderAction = async (orderId: string, action: 'approved' | 'rejected', notes?: string) => {
    setProcessingOrderId(orderId);
    
    try {
      const response = await fetch('/api/admin/approve-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId,
          action,
          adminNotes: notes,
          adminKey
        }),
      });

      const result = await response.json();

      if (result.success) {
        // Update local state
        setOrders(prev => prev.map(order => 
          order.id === orderId 
            ? { ...order, status: action, adminNotes: notes, approvedAt: new Date().toISOString() }
            : order
        ));
        alert(`Order ${action} successfully!`);
      } else {
        alert(`Failed to ${action} order: ${result.message}`);
      }
    } catch (error) {
      console.error(`Error ${action} order:`, error);
      alert(`Error ${action} order. Please try again.`);
    } finally {
      setProcessingOrderId(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'delivered':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-sm">
          <h1 className="text-2xl font-bold text-center mb-6">Admin Login</h1>
          <div className="space-y-4">
            <input
              type="password"
              placeholder="Enter admin key"
              value={adminKey}
              onChange={(e) => setAdminKey(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
            />
            <button
              onClick={handleLogin}
              className="w-full bg-[#872730] text-white py-2 px-4 rounded-md hover:bg-[#872730]/90"
            >
              Login
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-4 text-center">
            Demo admin key: kala-admin-2024
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Kala Jewelry - Admin Panel</h1>
            <button
              onClick={() => setIsAuthenticated(false)}
              className="text-gray-600 hover:text-gray-900"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Order Management</h2>
          <button
            onClick={fetchOrders}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Refresh Orders'}
          </button>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#872730] mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">No orders found</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <motion.div
                key={order.id}
                className="bg-white p-6 rounded-lg shadow-sm border"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">Order #{order.id}</h3>
                    <p className="text-gray-600">
                      {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h4 className="font-medium mb-2">Customer Information</h4>
                    <div className="text-sm space-y-1">
                      <p><strong>Name:</strong> {order.customer.firstName} {order.customer.lastName}</p>
                      <p><strong>Email:</strong> {order.customer.email}</p>
                      <p><strong>Phone:</strong> {order.customer.phone}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Shipping Address</h4>
                    <div className="text-sm">
                      <p>{order.customer.address}</p>
                      <p>{order.customer.city}, {order.customer.state} {order.customer.zipCode}</p>
                      <p>{order.customer.country}</p>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="font-medium mb-2">Items</h4>
                  <div className="bg-gray-50 p-4 rounded-md">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center py-2">
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                        </div>
                        <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    ))}
                    <div className="border-t pt-2 mt-2">
                      <div className="flex justify-between items-center font-bold">
                        <span>Total:</span>
                        <span>${order.subtotal.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {order.status === 'pending' && (
                  <div className="flex gap-4">
                    <button
                      onClick={() => handleOrderAction(order.id, 'approved')}
                      disabled={processingOrderId === order.id}
                      className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50"
                    >
                      {processingOrderId === order.id ? 'Processing...' : 'Approve Order'}
                    </button>
                    <button
                      onClick={() => {
                        const reason = prompt('Reason for rejection (optional):');
                        handleOrderAction(order.id, 'rejected', reason || undefined);
                      }}
                      disabled={processingOrderId === order.id}
                      className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 disabled:opacity-50"
                    >
                      Reject Order
                    </button>
                  </div>
                )}

                {order.adminNotes && (
                  <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                    <p className="text-sm"><strong>Admin Notes:</strong> {order.adminNotes}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
