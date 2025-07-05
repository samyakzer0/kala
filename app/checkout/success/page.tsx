'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';

export default function OrderSuccessPage() {
  // Generate a random order number
  const orderNumber = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;

  return (
    <div className="min-h-screen bg-stone-50">
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
          
          <h1 className="text-3xl font-serif mb-4">Thank You for Your Order!</h1>
          <p className="text-gray-600 mb-6">
            Your order has been received and is being processed. We've sent a confirmation email with your order details.
          </p>
          
          <div className="bg-stone-50 p-4 rounded-lg mb-8">
            <p className="text-gray-700 mb-1">Order Number:</p>
            <p className="text-xl font-medium">{orderNumber}</p>
          </div>
          
          <p className="text-gray-600 mb-8">
            If you have any questions about your order, please contact our customer service team.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/shop">
              <motion.button
                className="bg-[#872730] text-white px-6 py-3 rounded-full hover:bg-[#872730]/90 transition-colors w-full sm:w-auto"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Continue Shopping
              </motion.button>
            </Link>
            
            <Link href="/">
              <motion.button
                className="bg-black text-white px-6 py-3 rounded-full hover:bg-black/90 transition-colors w-full sm:w-auto"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Return to Home
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </main>
      
      <Footer />
    </div>
  );
} 