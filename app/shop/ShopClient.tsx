'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import ProductCard from '../../components/ProductCard';
import PopularCategories from '../../components/PopularCategories';
import { Product } from '../../types/product';

export default function ShopClient() {
  const searchParams = useSearchParams();
  const filterParam = searchParams.get('filter');
  
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeSubcategory, setActiveSubcategory] = useState<string | null>(null);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [sortBy, setSortBy] = useState('default');
  const [loading, setLoading] = useState(true);
  
  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        const result = await response.json();
        if (result.success) {
          setAllProducts(result.products);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, []);
  
  // Apply filters when category, subcategory, or filter param changes
  useEffect(() => {
    let result = allProducts;
    
    // Apply category filter
    if (activeCategory !== 'all') {
      result = result.filter(product => product.category === activeCategory);
    }
    
    // Apply subcategory filter
    if (activeSubcategory) {
      result = result.filter((product: Product) => product.subcategory === activeSubcategory);
    }
    
    // Apply URL filter parameter
    if (filterParam) {
      switch (filterParam) {
        case 'featured':
          result = result.filter(product => product.featured);
          break;
        case 'new':
          result = result.filter(product => product.new);
          break;
        case 'bestsellers':
          result = result.filter(product => product.bestseller);
          break;
      }
    }
    
    // Apply sorting
    switch (sortBy) {
      case 'price-low':
        result = [...result].sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result = [...result].sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        result = [...result].sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        result = [...result].sort((a, b) => b.name.localeCompare(a.name));
        break;
    }
    
    setFilteredProducts(result);
  }, [activeCategory, activeSubcategory, sortBy, filterParam, allProducts]);
  
  // Get categories and subcategories from available products
  const categories = ['all', ...Array.from(new Set(allProducts.map(product => product.category)))];
  const currentSubcategories = activeCategory !== 'all' 
    ? Array.from(new Set(allProducts
        .filter(product => product.category === activeCategory)
        .map(product => product.subcategory)
        .filter((subcategory): subcategory is string => !!subcategory)
      ))
    : [];
  
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
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h1 className="text-5xl font-serif mb-4 text-ivory-400">Shop Collection</h1>
        <p className="text-xl text-ivory-300 max-w-2xl mx-auto">
          Discover our exquisite collection of handcrafted jewelry, each piece designed to capture timeless elegance.
        </p>
      </motion.div>
      
      {/* Popular Categories */}
      <PopularCategories />
      
      {/* Filter and Sort Controls */}
      <div className="bg-ivory-400 p-6 rounded-lg shadow-sm mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex-1">
            <h2 className="text-lg font-medium mb-4 text-primary-500">Filter by Category</h2>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  className={`px-4 py-2 text-sm rounded-full transition-colors font-medium ${
                    activeCategory === category 
                      ? 'bg-secondary-400 text-white shadow-md' 
                      : 'bg-ivory-400 text-primary-500 hover:bg-ivory-300 border border-primary-200'
                  }`}
                  onClick={() => {
                    setActiveCategory(category);
                    setActiveSubcategory(null); // Reset subcategory when changing category
                  }}
                >
                  {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
            
            {/* Subcategory filters */}
            {currentSubcategories.length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-medium mb-2 text-primary-500">Filter by Subcategory</h3>
                <div className="flex flex-wrap gap-2">
                  <button
                    className={`px-3 py-1 text-sm rounded-full transition-colors font-medium ${
                      activeSubcategory === null 
                        ? 'bg-secondary-400 text-white shadow-md' 
                        : 'bg-ivory-400 text-primary-500 hover:bg-ivory-300 border border-primary-200'
                    }`}
                    onClick={() => setActiveSubcategory(null)}
                  >
                    All
                  </button>
                  {currentSubcategories.map((subcategory) => (
                    <button
                      key={subcategory}
                      className={`px-3 py-1 text-sm rounded-full transition-colors font-medium ${
                        activeSubcategory === subcategory 
                          ? 'bg-secondary-400 text-white shadow-md' 
                          : 'bg-ivory-400 text-primary-500 hover:bg-ivory-300 border border-primary-200'
                      }`}
                      onClick={() => setActiveSubcategory(subcategory || null)}
                    >
                      {subcategory ? subcategory.charAt(0).toUpperCase() + subcategory.slice(1) : ''}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div>
              <label htmlFor="sort-by" className="text-sm text-primary-500 mr-2">Sort by:</label>
              <select 
                id="sort-by"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-secondary-200 rounded px-2 py-1 text-sm text-primary-500 bg-ivory-300"
              >
                <option value="default">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name-asc">Name: A to Z</option>
                <option value="name-desc">Name: Z to A</option>
              </select>
            </div>
            
            <div className="text-sm text-primary-400">
              Showing {filteredProducts.length} products
            </div>
          </div>
        </div>
      </div>
      
      {/* Products Grid */}
      {loading ? (
        <div className="text-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary-500 mx-auto"></div>
          <p className="mt-4 text-ivory-300">Loading products...</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-16">
          <h2 className="text-2xl font-serif mb-4 text-ivory-400">No Products Found</h2>
          <p className="text-ivory-300 mb-8">Try adjusting your filters to find what you&apos;re looking for.</p>
          <button 
            className="bg-ivory-400 text-primary-500 px-6 py-2 rounded-full hover:bg-ivory-300 transition-colors font-medium shadow-md border border-primary-200"
            onClick={() => {
              setActiveCategory('all');
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
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </motion.div>
      )}
    </div>
  );
}
