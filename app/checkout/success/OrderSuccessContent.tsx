'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';

interface OrderInfo {
  id: string;
  status: string;
  createdAt: string;
  subtotal: number;
  customer: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

export default function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const [orderInfo, setOrderInfo] = useState<OrderInfo | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Try to get order ID from URL params
  const orderId = searchParams?.get('orderId');
  
  useEffect(() => {
    if (orderId) {
      fetchOrderInfo(orderId);
    } else {
      setLoading(false);
    }
  }, [orderId]);
  
  const fetchOrderInfo = async (id: string) => {
    try {
      const response = await fetch(`/api/order-status?orderId=${id}`);
      const data = await response.json();
      
      if (data.success) {
        setOrderInfo(data.order);
      }
    } catch (error) {
      console.error('Error fetching order info:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'approved':
        return 'text-green-600 bg-green-100';
      case 'rejected':
        return 'text-red-600 bg-red-100';
      case 'shipped':
        return 'text-blue-600 bg-blue-100';
      case 'delivered':
        return 'text-purple-600 bg-purple-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };
  
  const getStatusMessage = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Your order is being reviewed by our team.';
      case 'approved':
        return 'Your order has been approved and is being prepared for shipment.';
      case 'rejected':
        return 'Unfortunately, your order could not be processed.';
      case 'shipped':
        return 'Your order has been shipped and is on its way to you.';
      case 'delivered':
        return 'Your order has been delivered successfully.';
      default:
        return 'Order status unknown.';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-primary">
        <Header />
        <main className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-sm text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary mx-auto mb-4"></div>
            <p className="text-primary">Loading order information...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary">
      <Header />
      
      <main className="container mx-auto px-4 py-16">
        <motion.div
          className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-sm text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
            className="w-20 h-20 bg-green-100 rounded-full mx-auto mb-6 flex items-center justify-center"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-10 w-10 text-green-600" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M5 13l4 4L19 7" 
              />
            </svg>
          </motion.div>
          
          <h1 className="text-3xl font-serif mb-4 text-primary">Thank You for Your Order!</h1>
          
          {orderInfo ? (
            <div className="text-left">
              <div className="bg-secondary/10 p-6 rounded-lg mb-6">
                <h2 className="text-xl font-medium mb-4 text-primary">Order Details</h2>
                <div className="space-y-2 text-primary">
                  <p><strong>Order ID:</strong> {orderInfo.id}</p>
                  <p><strong>Customer:</strong> {orderInfo.customer.firstName} {orderInfo.customer.lastName}</p>
                  <p><strong>Email:</strong> {orderInfo.customer.email}</p>
                  <p><strong>Total:</strong> ₹{orderInfo.subtotal.toFixed(2)}</p>
                  <p><strong>Order Date:</strong> {new Date(orderInfo.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2 text-primary">Order Status</h3>
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(orderInfo.status)}`}>
                  {orderInfo.status.charAt(0).toUpperCase() + orderInfo.status.slice(1)}
                </div>
                <p className="text-primary/80 mt-2">{getStatusMessage(orderInfo.status)}</p>
              </div>
              
              <div className="border-t pt-6">
                <p className="text-primary/80 mb-6">
                  We&apos;ve sent a confirmation email to <strong>{orderInfo.customer.email}</strong> with your order details.
                  {orderInfo.status === 'pending' && (
                    ' You will receive another email once your order has been approved and is ready to ship.'
                  )}
                </p>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-primary/80 mb-6">
                Your order has been received and is being processed. We&apos;ve sent a confirmation email with your order details.
              </p>
              <div className="bg-secondary/10 p-6 rounded-lg mb-6">
                <h2 className="text-xl font-medium mb-2 text-primary">What happens next?</h2>
                <div className="text-left space-y-2 text-primary">
                  <p>1. Our team will review your order</p>
                  <p>2. You&apos;ll receive an email confirmation when approved</p>
                  <p>3. Your jewelry will be carefully prepared and shipped</p>
                  <p>4. You&apos;ll receive tracking information via email</p>
                </div>
              </div>
            </div>
          )}
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            {orderInfo && (
              <Link href={`/track-order?orderId=${orderInfo.id}`}>
                <motion.button
                  className="bg-ivory-400 text-primary-500 px-6 py-3 rounded-full hover:bg-ivory-300 transition-colors font-medium shadow-lg border border-primary-200"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Track Your Order
                </motion.button>
              </Link>
            )}
            
            <Link href="/shop">
              <motion.button
                className="bg-primary-500 text-ivory-400 px-6 py-3 rounded-full hover:bg-primary-600 transition-colors font-medium shadow-md"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Continue Shopping
              </motion.button>
            </Link>
            
            <Link href="/">
              <motion.button
                className="border border-primary text-primary px-6 py-3 rounded-full hover:bg-primary hover:text-ivory transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Return Home
              </motion.button>
            </Link>
          </div>
          
          {orderInfo && (
            <div className="mt-8 p-4 bg-secondary/10 rounded-lg">
              <p className="text-sm text-primary">
                <strong>Need help?</strong> Contact us at orders@kala-jewelry.com or +1 (555) 123-4567 
                with your order ID: <span className="font-mono">{orderInfo.id}</span>
              </p>
            </div>
          )}
        </motion.div>
      </main>
      
      <Footer />
    </div>
  );
}
