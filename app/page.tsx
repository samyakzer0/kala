'use client';

import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import HeroSection from '../components/HeroSection';
import IntroSection from '../components/IntroSection';
// import SpotlightRing from '../components/SpotlightRing'; // Removed unused import
import RingPlaceholder from '../components/RingPlaceholder';
import NecklacePlaceholder from '../components/NecklacePlaceholder';
import EarringPlaceholder from '../components/EarringPlaceholder';
import BraceletPlaceholder from '../components/BraceletPlaceholder';
import ProductCard from '../components/ProductCard';
import CustomerTestimonials from '../components/CustomerTestimonials';
import { Product } from '../types/product';

interface ProductWithAnalytics extends Product {
  analytics?: {
    views: number;
    orders: number;
    popularityScore: number;
  };
}

export default function Home() {
  const { scrollYProgress } = useScroll();
  // Opacity transform defined but not currently used in component
  // Keeping for potential future animation enhancements
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [popularProducts, setPopularProducts] = useState<ProductWithAnalytics[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Fetch featured and popular products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Fetch featured products (manually set as featured in admin)
        const featuredResponse = await fetch('/api/products?featured=true');
        const featuredResult = await featuredResponse.json();
        
        // Fetch popular products (based on views and orders)
        const popularResponse = await fetch('/api/popular-products?type=popular&limit=6');
        const popularResult = await popularResponse.json();
        
        if (featuredResult.success) {
          setFeaturedProducts(featuredResult.products.slice(0, 6));
        }
        
        if (popularResult.success) {
          setPopularProducts(popularResult.products);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, []);
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="min-h-screen bg-primary-500">
      <Header />
      
      {/* Hero Section */}
      <HeroSection />
      
      {/* Intro Section */}
      <IntroSection />
      
      {/* Categories Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <motion.h2 
            className="text-3xl font-serif text-center mb-12 text-ivory-400"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Explore Our Collections
          </motion.h2>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {/* Rings Category */}
            <motion.div variants={itemVariants}>
              <Link href="/category/rings">
                <div className="bg-ivory-400 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="aspect-square bg-ivory-300 p-4 flex items-center justify-center">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                      className="w-full h-full flex items-center justify-center"
                    >
                      <RingPlaceholder name="" gemColor="#B9F2FF" />
                    </motion.div>
                  </div>
                  <div className="p-4 text-center">
                    <h3 className="text-xl font-serif text-primary-500">Rings</h3>
                    <p className="text-primary-400 text-sm mt-1">Timeless elegance for every occasion</p>
                  </div>
                </div>
              </Link>
            </motion.div>
            
            {/* Necklaces Category */}
            <motion.div variants={itemVariants}>
              <Link href="/category/necklaces">
                <div className="bg-ivory-400 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="aspect-square bg-ivory-300 p-4 flex items-center justify-center">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                      className="w-full h-full flex items-center justify-center"
                    >
                      <NecklacePlaceholder name="" gemColor="#E0115F" />
                    </motion.div>
                  </div>
                  <div className="p-4 text-center">
                    <h3 className="text-xl font-serif text-primary-500">Necklaces</h3>
                    <p className="text-primary-400 text-sm mt-1">Exquisite pendants and chains</p>
                  </div>
                </div>
              </Link>
            </motion.div>
            
            {/* Earrings Category */}
            <motion.div variants={itemVariants}>
              <Link href="/category/earrings">
                <div className="bg-ivory-400 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="aspect-square bg-ivory-300 p-4 flex items-center justify-center">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                      className="w-full h-full flex items-center justify-center"
                    >
                      <EarringPlaceholder name="" gemColor="#50C878" />
                    </motion.div>
                  </div>
                  <div className="p-4 text-center">
                    <h3 className="text-xl font-serif text-primary-500">Earrings</h3>
                    <p className="text-primary-400 text-sm mt-1">Perfect accents for any style</p>
                  </div>
                </div>
              </Link>
            </motion.div>
            
            {/* Bracelets Category */}
            <motion.div variants={itemVariants}>
              <Link href="/category/bracelets">
                <div className="bg-ivory-400 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="aspect-square bg-ivory-300 p-4 flex items-center justify-center">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                      className="w-full h-full flex items-center justify-center"
                    >
                      <BraceletPlaceholder name="" gemColor="#0F52BA" />
                    </motion.div>
                  </div>
                  <div className="p-4 text-center">
                    <h3 className="text-xl font-serif text-primary-500">Bracelets</h3>
                    <p className="text-primary-400 text-sm mt-1">Graceful beauty for your wrist</p>
                  </div>
                </div>
              </Link>
            </motion.div>
          </motion.div>
          
          <div className="text-center mt-12">
            <Link href="/shop">
              <motion.button
                className="bg-ivory-400 text-primary-500 px-8 py-3 rounded-full hover:bg-ivory-300 transition-colors font-medium shadow-lg border border-primary-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                View All Collections
              </motion.button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Featured/Popular Products */}
      <section className="py-16 px-4 bg-ivory-400">
        <div className="container mx-auto">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-serif text-primary-500">
              {featuredProducts.length > 0 ? 'Featured Pieces' : 'Popular Picks'}
            </h2>
            <p className="text-primary-600 mt-2">
              {featuredProducts.length > 0 
                ? 'Handpicked selections from our finest collection'
                : 'Most loved by our customers'
              }
            </p>
          </motion.div>
          
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto"></div>
              <p className="mt-2 text-primary-600">Loading products...</p>
            </div>
          ) : (featuredProducts.length > 0 ? featuredProducts : popularProducts).length > 0 ? (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            >
              {(featuredProducts.length > 0 ? featuredProducts : popularProducts).map((product: ProductWithAnalytics) => (
                <motion.div key={product.id} variants={itemVariants}>
                  <ProductCard product={product} />
                  {/* Show popularity indicator for popular products */}
                  {featuredProducts.length === 0 && product.analytics && (
                    <div className="mt-2 text-center">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-secondary-100 text-secondary-800">
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        {product.analytics.views} views • {product.analytics.orders} orders
                      </span>
                    </div>
                  )}
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-8">
              <p className="text-primary-600">No products available at the moment.</p>
              <p className="text-primary-500 text-sm mt-1">
                Products will appear here as they gain popularity through customer views and orders.
              </p>
            </div>
          )}
          
          <div className="text-center mt-12">
            <Link href="/shop">
              <motion.button
                className="bg-ivory-400 text-primary-500 px-8 py-3 rounded-full hover:bg-ivory-300 transition-colors font-medium shadow-lg border border-primary-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Shop All Products
              </motion.button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Testimonials */}
      <CustomerTestimonials />
      
      {/* CTA Banner */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="py-16 px-4 bg-primary-600 text-ivory-400 text-center"
      >
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-3xl font-serif mb-6">Find Your Perfect Piece</h2>
          <p className="mb-8">
            Browse our collection of exquisite jewelry and discover pieces that reflect your unique style and personality.
          </p>
          <Link href="/shop">
            <motion.button
              className="bg-ivory-400 text-primary-500 px-8 py-3 rounded-full hover:bg-ivory-300 transition-colors font-medium shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Shop Now
            </motion.button>
          </Link>
        </div>
      </motion.section>
      
      <Footer />
    </div>
  );
}
