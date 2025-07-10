'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

// Interface for category analytics
interface CategoryAnalytics {
  categoryId: string;
  views: number;
  lastViewed: string;
}

// Map of category IDs to their display names
const categoryNames: Record<string, string> = {
  'rings': 'Rings',
  'necklaces': 'Necklaces',
  'earrings': 'Earrings',
  'bracelets': 'Bracelets'
};

// Map of category IDs to their background images
const categoryImages: Record<string, string> = {
  'rings': '/images/rings/rings.jpg',
  'necklaces': '/images/necklaces/necklace.jpg',
  'earrings': '/images/earrings/earrings.jpg',
  'bracelets': '/images/bracelets/bracelet.jpg'
};

export default function PopularCategories() {
  const [popularCategories, setPopularCategories] = useState<CategoryAnalytics[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchPopularCategories = async () => {
      try {
        const response = await fetch('/api/popular-categories');
        const data = await response.json();
        
        if (data.success) {
          setPopularCategories(data.categories);
        }
      } catch (error) {
        console.error('Error fetching popular categories:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPopularCategories();
  }, []);
  
  // If there are no popular categories or they're still loading,
  // use a predefined list of all categories
  const displayCategories = popularCategories.length > 0
    ? popularCategories
    : Object.keys(categoryNames).map(id => ({
        categoryId: id,
        views: 0,
        lastViewed: new Date().toISOString()
      }));
  
  if (loading && displayCategories.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-secondary-500 mx-auto"></div>
      </div>
    );
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-16 mb-12"
    >
      <h2 className="text-3xl font-serif mb-6 text-center text-ivory-400">
        {popularCategories.length > 0 ? 'Popular Categories' : 'Browse Categories'}
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {displayCategories.map((category) => {
          const categoryId = category.categoryId;
          const name = categoryNames[categoryId] || categoryId;
          const imageSrc = categoryImages[categoryId] || '/images/rings/rings.jpg';
          
          return (
            <Link href={`/category/${categoryId}`} key={categoryId}>
              <motion.div 
                className="relative h-60 rounded-lg overflow-hidden shadow-lg group cursor-pointer"
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.3 }}
              >
                <div 
                  className="absolute inset-0 bg-cover bg-center" 
                  style={{ backgroundImage: `url(${imageSrc})` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-primary-800/80 to-transparent"></div>
                </div>
                
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <h3 className="text-xl font-serif mb-1">{name}</h3>
                  <div className="flex items-center">
                    <span className="text-sm text-ivory-300">Explore Collection</span>
                    <motion.span 
                      className="ml-2 text-ivory-300"
                      initial={{ x: 0 }}
                      whileHover={{ x: 4 }}
                    >
                      →
                    </motion.span>
                  </div>
                </div>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </motion.div>
  );
}
