'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

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

export default function TrackOrderPage() {
  return (
    <>
      <Header />
      <Suspense fallback={
        <div className="min-h-screen bg-ivory-500 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto mb-4"></div>
            <p className="text-primary-600">Loading order tracking...</p>
          </div>
        </div>
      }>
        <TrackOrderContent />
      </Suspense>
      <Footer />
    </>
  );
}

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const [orderId, setOrderId] = useState('');
  const [email, setEmail] = useState('');
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchMethod, setSearchMethod] = useState<'orderId' | 'email'>('orderId');

  // Define handleSearch with useCallback to make it available for the effect dependency
  const handleSearch = useCallback(async (prefilledOrderId?: string) => {
    const searchOrderId = prefilledOrderId || orderId.trim();
    const searchEmail = email.trim();
    
    if (!searchOrderId && !searchEmail) {
      setError('Please enter either an Order ID or Email address');
      return;
    }

    setLoading(true);
    setError('');
    setOrder(null);

    try {
      const searchParam = searchMethod === 'orderId' 
        ? `orderId=${encodeURIComponent(searchOrderId)}`
        : `email=${encodeURIComponent(searchEmail)}`;
      
      const response = await fetch(`/api/order-status?${searchParam}`);
      const result = await response.json();

      if (result.success) {
        if (Array.isArray(result.orders)) {
          // Multiple orders returned (email search)
          if (result.orders.length === 0) {
            setError('No orders found for this email address');
          } else {
            // For now, show the most recent order
            setOrder(result.orders[0]);
          }
        } else {
          // Single order returned (order ID search)
          setOrder(result.order);
        }
      } else {
        setError(result.message || 'Order not found');
      }
    } catch (error) {
      console.error('Error searching for order:', error);
      setError('Error searching for order. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [orderId, email, searchMethod]);
  
  // Pre-populate order ID if passed as query parameter
  useEffect(() => {
    const orderIdParam = searchParams?.get('orderId');
    if (orderIdParam) {
      setOrderId(orderIdParam);
      // Auto-search if order ID is provided
      if (orderIdParam.trim()) {
        handleSearch(orderIdParam.trim());
      }
    }
  }, [searchParams, handleSearch]);

  const handleSearchClick = () => {
    handleSearch();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'shipped':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'delivered':
        return 'bg-secondary-200 text-secondary-800 border-secondary-300';
      default:
        return 'bg-ivory-100 text-primary-800 border-primary-200';
    }
  };

  const getStatusMessage = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Your order is being reviewed by our team.';
      case 'approved':
        return 'Great news! Your order has been approved and is being prepared for shipment.';
      case 'rejected':
        return 'We apologize, but your order could not be processed. Please contact customer service.';
      case 'shipped':
        return 'Your order has been shipped and is on its way to you!';
      case 'delivered':
        return 'Your order has been successfully delivered. Thank you for your purchase!';
      default:
        return 'Order status unknown.';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-primary-500 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold text-ivory-400 mb-4">Track Your Order</h1>
          <p className="text-lg text-ivory-300 max-w-2xl mx-auto">
            Enter your order ID or email address to check the status of your jewelry purchase.
          </p>
        </motion.div>

        {/* Search Form */}
        <motion.div 
          className="bg-ivory-400 rounded-lg shadow-md p-8 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="mb-6">
            <div className="flex space-x-4 mb-4">
              <button
                onClick={() => setSearchMethod('orderId')}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  searchMethod === 'orderId'
                    ? 'bg-secondary-400 text-white shadow-md'
                    : 'bg-ivory-400 text-primary-500 hover:bg-ivory-300 border border-primary-200'
                }`}
              >
                Search by Order ID
              </button>
              <button
                onClick={() => setSearchMethod('email')}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  searchMethod === 'email'
                    ? 'bg-secondary-400 text-white shadow-md'
                    : 'bg-ivory-400 text-primary-500 hover:bg-ivory-300 border border-primary-200'
                }`}
              >
                Search by Email
              </button>
            </div>

            {searchMethod === 'orderId' ? (
              <div>
                <label htmlFor="orderId" className="block text-sm font-medium text-primary-700 mb-2">
                  Order ID
                </label>
                <input
                  type="text"
                  id="orderId"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  placeholder="Enter your order ID (e.g., KJ-XXXXXXXX-XXXXXXXXXX)"
                  className="w-full px-4 py-3 border border-primary-300 rounded-md focus:ring-2 focus:ring-secondary-500 focus:border-transparent"
                />
                <p className="text-sm text-primary-500 mt-1">
                  Your order ID can be found in your confirmation email.
                </p>
              </div>
            ) : (
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-primary-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter the email address used for your order"
                  className="w-full px-4 py-3 border border-primary-300 rounded-md focus:ring-2 focus:ring-secondary-500 focus:border-transparent"
                />
                <p className="text-sm text-primary-500 mt-1">
                  We&apos;ll show your most recent order for this email address.
                </p>
              </div>
            )}
          </div>

          <button
            onClick={handleSearchClick}
            disabled={loading}
            className="w-full bg-ivory-400 text-primary-500 py-3 px-6 rounded-md font-medium hover:bg-ivory-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg border border-primary-200"
          >
            {loading ? 'Searching...' : 'Track Order'}
          </button>

          {error && (
            <motion.div 
              className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <p className="text-red-800">{error}</p>
            </motion.div>
          )}
        </motion.div>

        {/* Order Details */}
        {order && (
          <motion.div 
            className="bg-ivory-400 rounded-lg shadow-md overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Order Header */}
            <div className="bg-ivory-100 px-8 py-6 border-b">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-primary-700">Order {order.id}</h2>
                  <p className="text-primary-600 mt-1">Placed on {formatDate(order.createdAt)}</p>
                </div>
                <div className="mt-4 sm:mt-0">
                  <span className={`inline-block px-4 py-2 rounded-full border font-medium text-sm ${getStatusColor(order.status)}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>
              </div>
            </div>

            {/* Status Message */}
            <div className="px-8 py-6 border-b">
              <div className="flex items-start space-x-3">
                <div className={`w-3 h-3 rounded-full mt-1 ${
                  order.status === 'delivered' ? 'bg-green-500' :
                  order.status === 'shipped' ? 'bg-blue-500' :
                  order.status === 'approved' ? 'bg-green-500' :
                  order.status === 'rejected' ? 'bg-red-500' : 'bg-yellow-500'
                }`}></div>
                <div>
                  <h3 className="font-medium text-primary-700 mb-1">Order Status</h3>
                  <p className="text-primary-600">{getStatusMessage(order.status)}</p>
                  {order.approvedAt && (
                    <p className="text-sm text-primary-500 mt-1">
                      Last updated: {formatDate(order.approvedAt)}
                    </p>
                  )}
                  {order.adminNotes && (
                    <div className="mt-2 p-3 bg-blue-50 rounded-md">
                      <p className="text-sm text-blue-800">
                        <strong>Note:</strong> {order.adminNotes}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="px-8 py-6 border-b">
              <h3 className="font-medium text-primary-700 mb-4">Order Items</h3>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-ivory-200 rounded-lg flex items-center justify-center">
                        <span className="text-primary-600 text-xs font-medium">
                          {item.category.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-medium text-primary-700">{item.name}</h4>
                        <p className="text-sm text-primary-500">Category: {item.category}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-primary-700">${item.price}</p>
                      <p className="text-sm text-primary-500">Qty: {item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Customer Information */}
            <div className="px-8 py-6 border-b">
              <h3 className="font-medium text-primary-700 mb-4">Shipping Information</h3>
              <div className="bg-ivory-100 rounded-lg p-4">
                <p className="font-medium text-primary-700">
                  {order.customer.firstName} {order.customer.lastName}
                </p>
                <p className="text-primary-600">{order.customer.email}</p>
                <p className="text-primary-600">{order.customer.phone}</p>
                <div className="mt-2 text-primary-600">
                  <p>{order.customer.address}</p>
                  <p>
                    {order.customer.city}, {order.customer.state} {order.customer.zipCode}
                  </p>
                  <p>{order.customer.country}</p>
                </div>
              </div>
            </div>

            {/* Order Total */}
            <div className="px-8 py-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-primary-700">Order Total</h3>
                <p className="text-2xl font-bold text-primary-700">${order.subtotal}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Help Section */}
        <motion.div 
          className="mt-12 bg-ivory-400 rounded-lg shadow-md p-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h3 className="text-xl font-bold text-primary-700 mb-4">Need Help?</h3>
          <p className="text-primary-600 mb-6">
            If you have questions about your order or need assistance, our customer service team is here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:support@jewelry.com"
              className="bg-ivory-400 text-primary-500 px-6 py-3 rounded-full font-medium hover:bg-ivory-300 transition-colors shadow-lg border border-primary-200"
            >
              Email Support
            </a>
            <a
              href="tel:+1-555-0123"
              className="bg-ivory-100 text-primary-600 px-6 py-3 rounded-full font-medium hover:bg-ivory-200 transition-colors border border-primary-200"
            >
              Call Us: +1-555-0123
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
