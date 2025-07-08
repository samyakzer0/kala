'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import CartIcon from './CartIcon';
import { categories } from '../data/products';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState('home');

  useEffect(() => {
    // Update active tab based on the current path
    if (pathname === '/') {
      setActiveTab('home');
    } else if (pathname.startsWith('/about')) {
      setActiveTab('about');
    } else if (pathname.startsWith('/shop') || pathname.startsWith('/product') || pathname.startsWith('/category')) {
      setActiveTab('shop');
    } else if (pathname.startsWith('/checkout')) {
      setActiveTab('shop');
    } else if (pathname.startsWith('/track-order')) {
      setActiveTab('track-order');
    }
  }, [pathname]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const menuItems = [
    { name: 'New Arrivals', path: '/shop?filter=new' },
    { name: 'Bestsellers', path: '/shop?filter=bestseller' },
    ...categories.filter(cat => cat.id !== 'all').map(cat => ({
      name: cat.name,
      path: `/category/${cat.id}`
    })),
    { name: 'About Us', path: '/about' },
    { name: 'Contact', path: '/about#contact' }
  ];

  return (
    <>
      <header className="sticky top-0 z-50 bg-primary-500 px-4 py-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="text-ivory-400 text-2xl font-serif">
            <Link href="/" className="flex items-center">
              <img src="/logo.png" alt="KAMTI" className="h-16 w-auto" />
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              href="/"
              className={`text-ivory-400 hover:text-ivory-200 transition-colors relative ${activeTab === 'home' ? 'font-medium' : ''}`}
            >
              Home
              {activeTab === 'home' && (
                <motion.div 
                  className="absolute -bottom-1 left-0 right-0 h-0.5 bg-ivory-400" 
                  layoutId="underline"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </Link>
            <Link 
              href="/shop"
              className={`text-ivory-400 hover:text-ivory-200 transition-colors relative ${activeTab === 'shop' ? 'font-medium' : ''}`}
            >
              Shop
              {activeTab === 'shop' && (
                <motion.div 
                  className="absolute -bottom-1 left-0 right-0 h-0.5 bg-ivory-400" 
                  layoutId="underline"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </Link>
            <Link 
              href="/track-order"
              className={`text-ivory-400 hover:text-ivory-200 transition-colors relative ${activeTab === 'track-order' ? 'font-medium' : ''}`}
            >
              Track Order
              {activeTab === 'track-order' && (
                <motion.div 
                  className="absolute -bottom-1 left-0 right-0 h-0.5 bg-ivory-400" 
                  layoutId="underline"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </Link>
            <Link 
              href="/about"
              className={`text-ivory-400 hover:text-ivory-200 transition-colors relative ${activeTab === 'about' ? 'font-medium' : ''}`}
            >
              About
              {activeTab === 'about' && (
                <motion.div 
                  className="absolute -bottom-1 left-0 right-0 h-0.5 bg-ivory-400" 
                  layoutId="underline"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </Link>
            
            {/* Cart Icon */}
            <div className="ml-4">
              <CartIcon />
            </div>
          </nav>
          
          {/* Mobile Cart Icon */}
          <div className="flex items-center space-x-4 md:hidden">
            <CartIcon />
            
            <button 
              onClick={toggleMenu}
              className="text-ivory-400 p-2 hover:text-ivory-200 transition-colors flex flex-col justify-center items-center w-8 h-8"
              aria-label="Toggle menu"
            >
              <div className={`w-6 h-0.5 bg-ivory-400 transform transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></div>
              <div className={`w-6 h-0.5 bg-ivory-400 transition-all duration-300 my-1 ${isMenuOpen ? 'opacity-0' : ''}`}></div>
              <div className={`w-6 h-0.5 bg-ivory-400 transform transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></div>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 z-40 transition-opacity duration-300 ${
        isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
      }`}>
        <div 
          className="absolute inset-0 bg-black/50"
          onClick={toggleMenu}
        ></div>
        
        {/* Menu Panel */}
        <div className={`fixed right-0 top-0 h-full w-80 max-w-[90vw] bg-ivory-400 transform transition-transform duration-300 ease-in-out shadow-xl ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}>
          <div className="flex items-center justify-between p-6 border-b bg-primary-50">
            <div className="text-primary-500 text-xl font-serif">
              <img src="/logo.png" alt="KAMTI" className="h-10 w-auto" />
            </div>
            <button 
              onClick={toggleMenu}
              className="text-primary-600 p-2 hover:text-primary-800 transition-colors flex flex-col justify-center items-center w-8 h-8"
              aria-label="Close menu"
            >
              <div className="w-6 h-0.5 bg-primary-600 transform rotate-45 translate-y-0.5"></div>
              <div className="w-6 h-0.5 bg-primary-600 transform -rotate-45 -translate-y-0.5"></div>
            </button>
          </div>
          
          <nav className="p-6 overflow-y-auto h-full pb-20">
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className={`block py-4 px-4 text-lg transition-colors rounded-lg ${
                    activeTab === 'home' ? 'text-primary-500 font-medium bg-primary-50' : 'text-primary-700 hover:text-primary-500 hover:bg-primary-50'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  🏠 Home
                </Link>
              </li>
              <li>
                <Link
                  href="/shop"
                  className={`block py-4 px-4 text-lg transition-colors rounded-lg ${
                    activeTab === 'shop' ? 'text-primary-500 font-medium bg-primary-50' : 'text-primary-700 hover:text-primary-500 hover:bg-primary-50'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  🛍️ Shop
                </Link>
              </li>
              <li>
                <Link
                  href="/track-order"
                  className={`block py-4 px-4 text-lg transition-colors rounded-lg ${
                    activeTab === 'track-order' ? 'text-primary-500 font-medium bg-primary-50' : 'text-primary-700 hover:text-primary-500 hover:bg-primary-50'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  📦 Track Order
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className={`block py-4 px-4 text-lg transition-colors rounded-lg ${
                    activeTab === 'about' ? 'text-primary-500 font-medium bg-primary-50' : 'text-primary-700 hover:text-primary-500 hover:bg-primary-50'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  ℹ️ About
                </Link>
              </li>
              
              <li className="pt-4">
                <div className="text-sm font-medium text-primary-500 px-4 pb-2">Categories</div>
                <ul className="space-y-1">
                  {categories.filter(cat => cat.id !== 'all').map((cat, index) => (
                    <li key={index}>
                      <Link
                        href={`/category/${cat.id}`}
                        className="block py-3 px-4 text-primary-700 hover:text-primary-500 hover:bg-primary-50 transition-colors rounded-lg"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {cat.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
              
              <li className="pt-4">
                <div className="text-sm font-medium text-primary-500 px-4 pb-2">Special</div>
                <ul className="space-y-1">
                  <li>
                    <Link
                      href="/shop?filter=new"
                      className="block py-3 px-4 text-primary-700 hover:text-primary-500 hover:bg-primary-50 transition-colors rounded-lg"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      ✨ New Arrivals
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/shop?filter=bestseller"
                      className="block py-3 px-4 text-primary-700 hover:text-primary-500 hover:bg-primary-50 transition-colors rounded-lg"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      🔥 Bestsellers
                    </Link>
                  </li>
                </ul>
              </li>
            </ul>
            
            <div className="mt-8 pt-6 border-t border-primary-200">
              <Link href="/shop" className="block">
                <button 
                  className="w-full bg-ivory-400 text-primary-500 py-4 px-6 rounded-xl hover:bg-ivory-300 transition-colors text-lg font-medium shadow-lg border border-primary-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  🛒 Shop Now
                </button>
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </>
  );
}
