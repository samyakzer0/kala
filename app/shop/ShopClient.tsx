'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import ProductCard from '../../components/ProductCard';
import { 
  products, 
  categories, 
  subcategories, 
  getProductsByCategory, 
  getFeaturedProducts,
  getNewProducts,
  getBestsellerProducts
} from '../../data/products';

export default function ShopClient() {
  const searchParams = useSearchParams();
  const filterParam = searchParams.get('filter');
  
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeSubcategory, setActiveSubcategory] = useState<string | null>(null);
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [sortBy, setSortBy] = useState('default');
  
  // Apply filters when category, subcategory, or filter param changes
  useEffect(() => {
    let result = products;
    
    // Apply category filter
    if (activeCategory !== 'all') {
      result = getProductsByCategory(activeCategory);
    }
    
    // Apply subcategory filter
    if (activeSubcategory) {
      result = result.filter(product => product.subcategory === activeSubcategory);
    }
    
    // Apply URL filter parameter
    if (filterParam) {
      switch (filterParam) {
        case 'featured':
          result = getFeaturedProducts();
          break;
        case 'new':
          result = getNewProducts();
          break;
        case 'bestsellers':
          result = getBestsellerProducts();
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
  }, [activeCategory, activeSubcategory, sortBy, filterParam]);
  
  // Get subcategories for active category
  const currentSubcategories = activeCategory !== 'all' 
    ? subcategories[activeCategory as keyof typeof subcategories] || []
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
        <h1 className="text-5xl font-serif mb-4">Shop Collection</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Discover our exquisite collection of handcrafted jewelry, each piece designed to capture timeless elegance.
        </p>
      </motion.div>
      
      {/* Filter and Sort Controls */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex-1">
            <h2 className="text-lg font-medium mb-4">Filter by Category</h2>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  className={`px-4 py-2 text-sm rounded-full transition-colors ${
                    activeCategory === category.id 
                      ? 'bg-[#872730] text-white' 
                      : 'bg-stone-100 text-gray-700 hover:bg-stone-200'
                  }`}
                  onClick={() => {
                    setActiveCategory(category.id);
                    setActiveSubcategory(null); // Reset subcategory when changing category
                  }}
                >
                  {category.name}
                </button>
              ))}
            </div>
            
            {/* Subcategory filters */}
            {currentSubcategories.length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-medium mb-2">Filter by Subcategory</h3>
                <div className="flex flex-wrap gap-2">
                  <button
                    className={`px-3 py-1 text-sm rounded-full transition-colors ${
                      activeSubcategory === null 
                        ? 'bg-[#872730] text-white' 
                        : 'bg-stone-100 text-gray-700 hover:bg-stone-200'
                    }`}
                    onClick={() => setActiveSubcategory(null)}
                  >
                    All
                  </button>
                  {currentSubcategories.map((subcategory) => (
                    <button
                      key={subcategory.id}
                      className={`px-3 py-1 text-sm rounded-full transition-colors ${
                        activeSubcategory === subcategory.id 
                          ? 'bg-[#872730] text-white' 
                          : 'bg-stone-100 text-gray-700 hover:bg-stone-200'
                      }`}
                      onClick={() => setActiveSubcategory(subcategory.id)}
                    >
                      {subcategory.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div>
              <label htmlFor="sort-by" className="text-sm text-gray-600 mr-2">Sort by:</label>
              <select 
                id="sort-by"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded px-2 py-1 text-sm"
              >
                <option value="default">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name-asc">Name: A to Z</option>
                <option value="name-desc">Name: Z to A</option>
              </select>
            </div>
            
            <div className="text-sm text-gray-600">
              Showing {filteredProducts.length} products
            </div>
          </div>
        </div>
      </div>
      
      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-16">
          <h2 className="text-2xl font-serif mb-4">No Products Found</h2>
          <p className="text-gray-600 mb-8">Try adjusting your filters to find what you're looking for.</p>
          <button 
            className="bg-[#872730] text-white px-6 py-2 rounded-full"
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
