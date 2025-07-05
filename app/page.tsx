'use client';

import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import HeroSection from '../components/HeroSection';
import IntroSection from '../components/IntroSection';
import SpotlightRing from '../components/SpotlightRing';
import RingPlaceholder from '../components/RingPlaceholder';
import NecklacePlaceholder from '../components/NecklacePlaceholder';
import EarringPlaceholder from '../components/EarringPlaceholder';
import BraceletPlaceholder from '../components/BraceletPlaceholder';
import ProductCard from '../components/ProductCard';
import CustomerTestimonials from '../components/CustomerTestimonials';
import { getFeaturedProducts } from '../data/products';

export default function Home() {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const [featuredProducts, setFeaturedProducts] = useState(getFeaturedProducts());
  
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
    <div className="min-h-screen bg-stone-50">
      <Header />
      
      {/* Hero Section */}
      <HeroSection />
      
      {/* Intro Section */}
      <IntroSection />
      
      {/* Categories Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <motion.h2 
            className="text-3xl font-serif text-center mb-12"
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
                <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="aspect-square bg-stone-100 p-4 flex items-center justify-center">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                      className="w-full h-full flex items-center justify-center"
                    >
                      <RingPlaceholder name="" gemColor="#B9F2FF" />
                    </motion.div>
                  </div>
                  <div className="p-4 text-center">
                    <h3 className="text-xl font-serif">Rings</h3>
                    <p className="text-gray-600 text-sm mt-1">Timeless elegance for every occasion</p>
                  </div>
                </div>
              </Link>
            </motion.div>
            
            {/* Necklaces Category */}
            <motion.div variants={itemVariants}>
              <Link href="/category/necklaces">
                <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="aspect-square bg-stone-100 p-4 flex items-center justify-center">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                      className="w-full h-full flex items-center justify-center"
                    >
                      <NecklacePlaceholder name="" gemColor="#E0115F" />
                    </motion.div>
                  </div>
                  <div className="p-4 text-center">
                    <h3 className="text-xl font-serif">Necklaces</h3>
                    <p className="text-gray-600 text-sm mt-1">Exquisite pendants and chains</p>
                  </div>
                </div>
              </Link>
            </motion.div>
            
            {/* Earrings Category */}
            <motion.div variants={itemVariants}>
              <Link href="/category/earrings">
                <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="aspect-square bg-stone-100 p-4 flex items-center justify-center">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                      className="w-full h-full flex items-center justify-center"
                    >
                      <EarringPlaceholder name="" gemColor="#50C878" />
                    </motion.div>
                  </div>
                  <div className="p-4 text-center">
                    <h3 className="text-xl font-serif">Earrings</h3>
                    <p className="text-gray-600 text-sm mt-1">Perfect accents for any style</p>
                  </div>
                </div>
              </Link>
            </motion.div>
            
            {/* Bracelets Category */}
            <motion.div variants={itemVariants}>
              <Link href="/category/bracelets">
                <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="aspect-square bg-stone-100 p-4 flex items-center justify-center">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                      className="w-full h-full flex items-center justify-center"
                    >
                      <BraceletPlaceholder name="" gemColor="#0F52BA" />
                    </motion.div>
                  </div>
                  <div className="p-4 text-center">
                    <h3 className="text-xl font-serif">Bracelets</h3>
                    <p className="text-gray-600 text-sm mt-1">Graceful beauty for your wrist</p>
                  </div>
                </div>
              </Link>
            </motion.div>
          </motion.div>
          
          <div className="text-center mt-12">
            <Link href="/shop">
              <motion.button
                className="bg-[#872730] text-white px-8 py-3 rounded-full hover:bg-[#872730]/90 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                View All Collections
              </motion.button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Featured Products */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <motion.h2 
            className="text-3xl font-serif text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Featured Pieces
          </motion.h2>
          
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          >
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </motion.div>
          
          <div className="text-center mt-12">
            <Link href="/shop">
              <motion.button
                className="border-2 border-[#872730] text-[#872730] px-8 py-3 rounded-full hover:bg-[#872730] hover:text-white transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Shop All Products
              </motion.button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Spotlight Section */}
      <section className="py-16 px-4 bg-stone-100">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl font-serif mb-6">Crafted with Precision</h2>
              <p className="text-gray-700 mb-6">
                Each piece in our collection is meticulously crafted by skilled artisans using only the finest materials. 
                From selecting the perfect gemstones to the final polish, we ensure every detail meets our exacting standards.
              </p>
              <p className="text-gray-700 mb-8">
                Our commitment to quality and craftsmanship ensures that each piece of jewelry is not just an accessory, 
                but a treasured keepsake that will be cherished for generations.
              </p>
              <Link href="/about">
                <motion.button
                  className="bg-black text-white px-6 py-2 rounded-full hover:bg-black/90 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Our Story
                </motion.button>
              </Link>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-white p-8 rounded-lg shadow-sm"
            >
              <SpotlightRing />
            </motion.div>
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
        className="py-16 px-4 bg-[#872730] text-white text-center"
      >
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-3xl font-serif mb-6">Find Your Perfect Piece</h2>
          <p className="mb-8">
            Browse our collection of exquisite jewelry and discover pieces that reflect your unique style and personality.
          </p>
          <Link href="/shop">
            <motion.button
              className="bg-white text-[#872730] px-8 py-3 rounded-full hover:bg-white/90 transition-colors"
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
