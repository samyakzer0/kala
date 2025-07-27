'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Product } from '../types/product';
import { useCart } from '../context/CartContext';
import RingPlaceholder from './RingPlaceholder';
import NecklacePlaceholder from './NecklacePlaceholder';
import EarringPlaceholder from './EarringPlaceholder';
import BraceletPlaceholder from './BraceletPlaceholder';

type ProductCardProps = {
  product: Product;
};

export default function ProductCard({ product }: ProductCardProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_isHovered, setIsHovered] = useState(false); // Prefixed with underscore as it's intentionally unused
  const { addItem } = useCart();
  
  // Track product view when clicked
  const handleProductClick = async () => {
    try {
      await fetch(`/api/popular-products?productId=${product.id}`);
    } catch (error) {
      console.error('Error tracking product view:', error);
    }
  };
  
  // Function to render the appropriate placeholder based on product category
  const renderProductImage = () => {
    switch (product.category) {
      case 'rings':
        return <RingPlaceholder name={product.name} gemColor={product.gemColor} imageSrc={product.image} />;
      case 'necklaces':
        return <NecklacePlaceholder name={product.name} gemColor={product.gemColor} imageSrc={product.image} />;
      case 'earrings':
        return <EarringPlaceholder name={product.name} gemColor={product.gemColor} imageSrc={product.image} />;
      case 'bracelets':
        return <BraceletPlaceholder name={product.name} gemColor={product.gemColor} imageSrc={product.image} />;
      default:
        return <RingPlaceholder name={product.name} gemColor={product.gemColor} imageSrc={product.image} />;
    }
  };

  return (
    <motion.div
      className="bg-ivory-300 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/product/${product.id}`} onClick={handleProductClick}>
        <div className="relative aspect-square bg-ivory-200 flex items-center justify-center overflow-hidden">
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full"
          >
            {renderProductImage()}
          </motion.div>
          
          {product.new && (
            <div className="absolute top-2 left-2 bg-primary-500 text-ivory-400 text-xs px-2 py-1 rounded-full">
              New
            </div>
          )}
        </div>
      </Link>
      
      <div className="p-4">
        <div className="flex justify-between items-center mb-2">
          <Link href={`/product/${product.id}`} onClick={handleProductClick}>
            <h3 className="font-medium text-primary-500 hover:text-primary-400 transition-colors">{product.name}</h3>
          </Link>
          <p className="font-serif text-primary-500">₹{product.price}</p>
        </div>
        
        {/* Stock Information */}
        <div className="mb-2">
          {product.stock === 0 ? (
            <span className="text-red-600 text-xs font-medium bg-red-100 px-2 py-1 rounded">Out of Stock</span>
          ) : product.stock <= product.lowStockThreshold ? (
            <span className="text-yellow-600 text-xs font-medium bg-yellow-100 px-2 py-1 rounded">
              Only {product.stock} left
            </span>
          ) : (
            <span className="text-green-600 text-xs font-medium bg-green-100 px-2 py-1 rounded">In Stock</span>
          )}
        </div>
        
        <p className="text-primary-400 text-sm mb-4 line-clamp-2">{product.description}</p>
        
        <motion.button
          className={`w-full py-2 px-4 rounded-full transition-colors text-sm font-medium shadow-lg border border-primary-200 ${
            product.stock === 0 
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
              : 'bg-ivory-400 text-primary-500 hover:bg-ivory-300'
          }`}
          whileHover={product.stock > 0 ? { scale: 1.03 } : {}}
          whileTap={product.stock > 0 ? { scale: 0.97 } : {}}
          onClick={(e) => {
            e.preventDefault();
            if (product.stock > 0) {
              addItem(product);
            }
          }}
          disabled={product.stock === 0}
        >
          {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </motion.button>
      </div>
    </motion.div>
  );
}