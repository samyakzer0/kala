'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import CartDrawer from './CartDrawer';

export default function CartIcon() {
  const { itemCount } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  return (
    <>
      <button 
        onClick={toggleCart}
        className="relative text-white hover:text-white/80 transition-colors"
        aria-label="Open cart"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-6 w-6" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" 
          />
        </svg>
        
        {itemCount > 0 && (
          <motion.div 
            className="absolute -top-2 -right-2 bg-secondary-400 text-ivory-400 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 500, damping: 15 }}
          >
            {itemCount}
          </motion.div>
        )}
      </button>
      
      <AnimatePresence>
        {isCartOpen && (
          <CartDrawer onClose={toggleCart} />
        )}
      </AnimatePresence>
    </>
  );
} 