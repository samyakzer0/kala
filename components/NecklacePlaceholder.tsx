'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

interface NecklacePlaceholderProps {
  name: string;
  gemColor?: string;
  className?: string;
  imageSrc?: string;
}

export default function NecklacePlaceholder({
  name,
  gemColor = '#B9F2FF',
  className = '',
  imageSrc = '/images/necklaces/necklace.jpg',
}: NecklacePlaceholderProps) {
  return (
    <div className={`relative w-full h-full flex items-center justify-center ${className}`}>
      <motion.div
        className="relative w-full h-full"
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.3 }}
      >
        {/* Necklace Image */}
        <div className="w-full h-full flex items-center justify-center">
          {imageSrc ? (
            <div className="w-full h-full relative overflow-hidden">
              <Image
                src={imageSrc}
                alt={name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
          ) : (
            <div className="w-24 h-16 border-t-2 border-[#FFD700] rounded-t-full relative">
              {/* Pendant */}
              <div 
                className="absolute w-6 h-6 rounded-full bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2"
                style={{ backgroundColor: gemColor }}
              >
                {/* Shine effect */}
                <div className="absolute w-2 h-2 rounded-full bg-white/70 top-1 left-1"></div>
              </div>
            </div>
          )}
        </div>
        
        {/* Necklace name */}
        <div className="mt-2 text-center text-xs text-gray-700">{name}</div>
      </motion.div>
    </div>
  );
} 