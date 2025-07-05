'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useState, useEffect } from 'react';

interface EarringPlaceholderProps {
  name: string;
  gemColor?: string;
  className?: string;
  imageSrc?: string;
}

export default function EarringPlaceholder({
  name,
  gemColor = '#B9F2FF',
  className = '',
  imageSrc,
}: EarringPlaceholderProps) {
  // Available earring images
  const earringImages = [
    '/images/earrings/earrings.jpg',
    '/images/earrings/earrings2.jpg',
    '/images/earrings/earrings3.jpg',
    '/images/earrings/earrings4.jpg'
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Auto-cycle through images every 3 seconds when no specific image is provided
  useEffect(() => {
    if (!imageSrc && earringImages.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % earringImages.length);
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [imageSrc, earringImages.length]);

  const displayImage = imageSrc || earringImages[currentImageIndex];
  return (
    <div className={`relative w-full h-full flex items-center justify-center ${className}`}>
      <motion.div
        className="relative w-full h-full"
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.3 }}
      >
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
          <div className="flex space-x-8">
            {/* Left Earring */}
            <div className="relative">
              <div className="w-3 h-3 rounded-full bg-[#FFD700]"></div>
              <div 
                className="w-5 h-5 rounded-full mt-1"
                style={{ backgroundColor: gemColor }}
              >
                {/* Shine effect */}
                <div className="absolute w-1.5 h-1.5 rounded-full bg-white/70 top-1 left-1"></div>
              </div>
            </div>
            
            {/* Right Earring */}
            <div className="relative">
              <div className="w-3 h-3 rounded-full bg-[#FFD700]"></div>
              <div 
                className="w-5 h-5 rounded-full mt-1"
                style={{ backgroundColor: gemColor }}
              >
                {/* Shine effect */}
                <div className="absolute w-1.5 h-1.5 rounded-full bg-white/70 top-1 left-1"></div>
              </div>
            </div>
          </div>
        )}
        
        {/* Earring name */}
        <div className="mt-4 text-center text-xs text-gray-700">{name}</div>
      </motion.div>
    </div>
  );
} 