'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import ProductCard from '../../../components/ProductCard';
import { Product } from '../../../types/product';

interface CategoryClientProps {
  categoryId: string;
  categoryName: string;
  initialProducts: Product[];
}

export default function CategoryClient({ 
  categoryId, 
  categoryName, 
  initialProducts 
}: CategoryClientProps) {
  const [activeSubcategory, setActiveSubcategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState('default');
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [allProducts, setAllProducts] = useState<Product[]>(initialProducts);
  const [loading, setLoading] = useState(false);
  
  // Fetch products from the API
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/products');
      const result = await response.json();
      
      if (result.success) {
        const categoryProducts = result.products.filter((product: Product) => 
          product.category === categoryId && product.isActive
        );
        setAllProducts(categoryProducts);
        applyFilters(categoryProducts);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get unique subcategories for this category
  const currentSubcategories = [...new Set(
    allProducts
      .filter(product => product.subcategory && product.subcategory.trim())
      .map(product => product.subcategory!)
  )].sort();
  
  // Apply filters and sorting
  const applyFilters = (productsToFilter: Product[] = allProducts) => {
    let result = [...productsToFilter];
    
    // Apply subcategory filter
    if (activeSubcategory) {
      result = result.filter(product => product.subcategory === activeSubcategory);
    }
    
    // Apply sorting
    switch (sortBy) {
      case 'price-low':
        result = result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result = result.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        result = result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        result = result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'stock':
        result = result.sort((a, b) => b.stock - a.stock);
        break;
    }
    
    setProducts(result);
  };

  // Apply filters when subcategory or sort changes
  useEffect(() => {
    applyFilters();
  }, [activeSubcategory, sortBy, allProducts]);

  // Fetch products on mount
  useEffect(() => {
    fetchProducts();
  }, [categoryId]);
  
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

  return (
    <div className="min-h-screen bg-ivory-300">
      <Header />
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 py-8"
      >
        {/* Breadcrumbs */}
        <nav className="text-sm mb-8">
          <ol className="flex items-center space-x-2">
            <li>
              <Link href="/" className="text-primary-500 hover:text-secondary-500">Home</Link>
            </li>
            <li className="text-primary-400">/</li>
            <li>
              <Link href="/shop" className="text-primary-500 hover:text-secondary-500">Shop</Link>
            </li>
            <li className="text-primary-400">/</li>
            <li className="text-secondary-500">{categoryName}</li>
          </ol>
        </nav>
        
        <h1 className="text-4xl font-serif text-center mb-8 text-primary-700">{categoryName}</h1>
        
        {/* Filter and Sort Controls */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <h2 className="text-lg font-medium">Filter Products</h2>
            
            <div className="flex flex-wrap items-center gap-4">
              <div>
                <label htmlFor="sort-by" className="text-sm text-primary-600 mr-2">Sort by:</label>
                <select 
                  id="sort-by"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-primary-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-secondary-500 focus:border-transparent bg-white"
                >
                  <option value="default">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name-asc">Name: A to Z</option>
                  <option value="name-desc">Name: Z to A</option>
                  <option value="stock">Stock: High to Low</option>
                </select>
              </div>
              
              <div className="text-sm text-primary-600">
                {loading ? 'Loading...' : `Showing ${products.length} products`}
              </div>
            </div>
          </div>
          
          {/* Subcategory Navigation (conditional) */}
          {currentSubcategories.length > 0 && (
            <div>
              <h3 className="text-sm font-medium mb-2">Subcategories:</h3>
              <div className="flex flex-wrap gap-2">
                <button
                  className={`px-3 py-1 text-sm rounded-full transition-colors ${
                    activeSubcategory === null 
                      ? 'bg-secondary-500 text-white' 
                      : 'bg-secondary-100 text-primary-700 hover:bg-secondary-200'
                  }`}
                  onClick={() => setActiveSubcategory(null)}
                >
                  All {categoryName}
                </button>
                
                {currentSubcategories.filter(Boolean).map((subcategory) => (
                  <button
                    key={subcategory}
                    className={`px-3 py-1 text-sm rounded-full transition-colors ${
                      activeSubcategory === subcategory 
                        ? 'bg-secondary-500 text-white' 
                        : 'bg-secondary-100 text-primary-700 hover:bg-secondary-200'
                    }`}
                    onClick={() => setActiveSubcategory(subcategory)}
                  >
                    {subcategory}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="text-center py-16">
            <h2 className="text-2xl font-serif mb-4 text-primary-700">No Products Found</h2>
            <p className="text-primary-600 mb-8">Try adjusting your filters to find what you're looking for.</p>
            <button 
              className="bg-secondary-500 text-white px-6 py-2 rounded-full hover:bg-secondary-600 transition-colors"
              onClick={() => {
                setActiveSubcategory(null);
                setSortBy('default');
              }}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          >
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </motion.div>
        )}
        
        {/* Category Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-16 bg-secondary text-ivory py-12 px-8 text-center rounded-lg"
        >
          <h2 className="text-3xl font-serif mb-6">Explore Our {categoryName}</h2>
          <p className="max-w-2xl mx-auto mb-8">
            Discover our exquisite collection of {categoryName.toLowerCase()} crafted with the finest materials and attention to detail.
          </p>
          <div className="flex justify-center">
            <Link href="/shop">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-ivory-400 text-primary-500 py-3 px-8 rounded-full hover:bg-ivory-300 transition-colors font-medium shadow-lg border border-primary-200"
              >
                View All Collections
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </motion.div>
      
      <Footer />
    </div>
  );
}
