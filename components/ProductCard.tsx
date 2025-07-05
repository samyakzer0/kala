'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Product } from '../data/products';
import { useCart } from '../context/CartContext';
import RingPlaceholder from './RingPlaceholder';
import NecklacePlaceholder from './NecklacePlaceholder';
import EarringPlaceholder from './EarringPlaceholder';
import BraceletPlaceholder from './BraceletPlaceholder';

type ProductCardProps = {
  product: Product;
};

export default function ProductCard({ product }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { addItem } = useCart();
  
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
      className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/product/${product.id}`}>
        <div className="relative aspect-square bg-stone-100 flex items-center justify-center overflow-hidden">
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full"
          >
            {renderProductImage()}
          </motion.div>
          
          {product.new && (
            <div className="absolute top-2 left-2 bg-[#872730] text-white text-xs px-2 py-1 rounded-full">
              New
            </div>
          )}
          
          {product.bestseller && !product.new && (
            <div className="absolute top-2 left-2 bg-black text-white text-xs px-2 py-1 rounded-full">
              Bestseller
            </div>
          )}
        </div>
      </Link>
      
      <div className="p-4">
        <div className="flex justify-between items-center mb-2">
          <Link href={`/product/${product.id}`}>
            <h3 className="font-medium hover:text-[#872730] transition-colors">{product.name}</h3>
          </Link>
          <p className="font-serif">${product.price}</p>
        </div>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
        
        <motion.button
          className="w-full bg-[#872730] text-white py-2 px-4 rounded-full hover:bg-[#872730]/90 transition-colors text-sm"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={(e) => {
            e.preventDefault();
            addItem(product);
          }}
        >
          Add to Cart
        </motion.button>
      </div>
    </motion.div>
  );
}