'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useState, useEffect } from 'react';

interface BraceletPlaceholderProps {
  name: string;
  gemColor?: string;
  className?: string;
  imageSrc?: string;
}

export default function BraceletPlaceholder({
  name,
  gemColor = '#B9F2FF',
  className = '',
  imageSrc,
}: BraceletPlaceholderProps) {
  // Available bracelet images
  const braceletImages = [
    '/images/bracelets/bracelet.jpg',
    '/images/bracelets/bracelet2.jpg'
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Auto-cycle through images every 3 seconds when no specific image is provided
  useEffect(() => {
    if (!imageSrc && braceletImages.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % braceletImages.length);
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [imageSrc, braceletImages.length]);

  const displayImage = imageSrc || braceletImages[currentImageIndex];

  return (
    <div className={`relative w-full h-full flex items-center justify-center ${className}`}>
      <motion.div
        className="relative w-full h-full"
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.3 }}
      >
        {/* Bracelet */}
        <div className="w-full h-full flex items-center justify-center">
          {displayImage ? (
            <div className="w-full h-full relative overflow-hidden">
              <Image
                src={displayImage}
                alt={name}
                fill
                className="object-cover transition-opacity duration-500"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
          ) : (
            <div className="w-24 h-24 rounded-full border-4 border-[#FFD700] border-dashed relative">
              {/* Gems */}
              {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, index) => (
                <div 
                  key={index}
                  className="absolute w-3 h-3 rounded-full"
                  style={{ 
                    backgroundColor: gemColor,
                    top: `calc(50% - 1.5px + ${Math.sin(angle * Math.PI / 180) * 12}px)`,
                    left: `calc(50% - 1.5px + ${Math.cos(angle * Math.PI / 180) * 12}px)`
                  }}
                />
              ))}
            </div>
          )}
        </div>
        
        {/* Bracelet name */}
        <div className="mt-2 text-center text-xs text-gray-700">{name}</div>
      </motion.div>
    </div>
  );
} 