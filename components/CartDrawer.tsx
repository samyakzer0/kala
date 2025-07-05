'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import RingPlaceholder from './RingPlaceholder';
import NecklacePlaceholder from './NecklacePlaceholder';
import EarringPlaceholder from './EarringPlaceholder';
import BraceletPlaceholder from './BraceletPlaceholder';

interface CartDrawerProps {
  onClose: () => void;
}

export default function CartDrawer({ onClose }: CartDrawerProps) {
  const { items, removeItem, updateQuantity, subtotal } = useCart();
  
  // Close drawer when pressing Escape key
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleEsc);
    
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);
  
  // Prevent scrolling on the body when the drawer is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);
  
  // Function to render the appropriate placeholder based on product category
  const renderProductImage = (category: string, name: string, gemColor?: string) => {
    switch (category) {
      case 'rings':
        return <RingPlaceholder name={name} gemColor={gemColor} />;
      case 'necklaces':
        return <NecklacePlaceholder name={name} gemColor={gemColor} />;
      case 'earrings':
        return <EarringPlaceholder name={name} gemColor={gemColor} />;
      case 'bracelets':
        return <BraceletPlaceholder name={name} gemColor={gemColor} />;
      default:
        return <RingPlaceholder name={name} gemColor={gemColor} />;
    }
  };

  return (
    <>
      {/* Backdrop */}
      <motion.div
        className="fixed inset-0 bg-black/50 z-40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      
      {/* Drawer */}
      <motion.div
        className="fixed right-0 top-0 h-full w-full sm:w-96 bg-white z-50 shadow-lg overflow-hidden flex flex-col"
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'tween', duration: 0.3 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-serif">Your Cart</h2>
          <button 
            onClick={onClose}
            className="text-gray-600 hover:text-gray-800 transition-colors"
            aria-label="Close cart"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">Your cart is empty</p>
              <button
                onClick={onClose}
                className="text-[#872730] hover:underline"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <ul className="space-y-4">
              {items.map((item) => (
                <motion.li 
                  key={item.id}
                  className="flex items-center gap-4 bg-stone-50 p-3 rounded-lg"
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Product Image */}
                  <div className="w-16 h-16 bg-white rounded-md flex items-center justify-center">
                    {renderProductImage(item.category, item.name, item.gemColor)}
                  </div>
                  
                  {/* Product Info */}
                  <div className="flex-1">
                    <h3 className="font-medium text-sm">{item.name}</h3>
                    <p className="text-gray-600 text-xs">${item.price}</p>
                    
                    {/* Quantity Controls */}
                    <div className="flex items-center mt-1">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-6 h-6 bg-stone-200 rounded-full flex items-center justify-center"
                        aria-label="Decrease quantity"
                      >
                        -
                      </button>
                      <span className="mx-2 text-sm">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-6 h-6 bg-stone-200 rounded-full flex items-center justify-center"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  
                  {/* Item Total & Remove */}
                  <div className="text-right">
                    <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-xs text-[#872730] hover:underline mt-1"
                      aria-label="Remove item"
                    >
                      Remove
                    </button>
                  </div>
                </motion.li>
              ))}
            </ul>
          )}
        </div>
        
        {/* Footer */}
        <div className="p-4 border-t bg-stone-50">
          {items.length > 0 && (
            <>
              <div className="flex justify-between mb-4">
                <span>Subtotal</span>
                <span className="font-medium">${subtotal.toFixed(2)}</span>
              </div>
              
              <Link href="/checkout">
                <motion.button
                  className="w-full bg-[#872730] text-white py-3 rounded-full hover:bg-[#872730]/90 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onClose}
                >
                  Checkout
                </motion.button>
              </Link>
            </>
          )}
        </div>
      </motion.div>
    </>
  );
} 