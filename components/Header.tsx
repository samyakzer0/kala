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
      <header className="sticky top-0 z-50 bg-[#872730] px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="text-white text-2xl font-serif">
            <Link href="/" className="flex items-center">
              <img src="/logo.png" alt="KAMTI" className="h-16 w-auto" />
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              href="/"
              className={`text-white hover:text-white/80 transition-colors relative ${activeTab === 'home' ? 'font-medium' : ''}`}
            >
              Home
              {activeTab === 'home' && (
                <motion.div 
                  className="absolute -bottom-1 left-0 right-0 h-0.5 bg-white" 
                  layoutId="underline"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </Link>
            <Link 
              href="/shop"
              className={`text-white hover:text-white/80 transition-colors relative ${activeTab === 'shop' ? 'font-medium' : ''}`}
            >
              Shop
              {activeTab === 'shop' && (
                <motion.div 
                  className="absolute -bottom-1 left-0 right-0 h-0.5 bg-white" 
                  layoutId="underline"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </Link>
            <Link 
              href="/about"
              className={`text-white hover:text-white/80 transition-colors relative ${activeTab === 'about' ? 'font-medium' : ''}`}
            >
              About
              {activeTab === 'about' && (
                <motion.div 
                  className="absolute -bottom-1 left-0 right-0 h-0.5 bg-white" 
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
              className="text-white text-2xl hover:text-white/80 transition-colors"
              aria-label="Toggle menu"
            >
              ☰
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
        <div className={`fixed right-0 top-0 h-full w-80 bg-white transform transition-transform duration-300 ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}>
          <div className="flex items-center justify-between p-4 border-b">
            <div className="text-[#872730] text-2xl font-serif">
              <img src="/logo.png" alt="KAMTI" className="h-12 w-auto" />
            </div>
            <button 
              onClick={toggleMenu}
              className="text-gray-600 text-2xl hover:text-gray-800 transition-colors"
              aria-label="Close menu"
            >
              ✕
            </button>
          </div>
          
          <nav className="p-4">
            <ul className="space-y-4">
              <li>
                <Link
                  href="/"
                  className={`block py-3 text-lg transition-colors border-b border-gray-100 ${
                    activeTab === 'home' ? 'text-[#872730] font-medium' : 'text-gray-800 hover:text-[#872730]'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/shop"
                  className={`block py-3 text-lg transition-colors border-b border-gray-100 ${
                    activeTab === 'shop' ? 'text-[#872730] font-medium' : 'text-gray-800 hover:text-[#872730]'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Shop
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className={`block py-3 text-lg transition-colors border-b border-gray-100 ${
                    activeTab === 'about' ? 'text-[#872730] font-medium' : 'text-gray-800 hover:text-[#872730]'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  About
                </Link>
              </li>
              {menuItems.map((item, index) => (
                <li key={index}>
                  <Link
                    href={item.path}
                    className="block py-3 text-lg text-gray-800 hover:text-[#872730] transition-colors border-b border-gray-100 last:border-b-0"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
            
            <div className="mt-8 pt-8 border-t border-gray-200">
              <Link href="/shop" className="block">
                <button 
                  className="w-full bg-[#872730] text-white py-3 px-6 rounded-full hover:bg-[#872730]/90 transition-colors whitespace-nowrap"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Shop Now
                </button>
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </>
  );
}
