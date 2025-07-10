'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

interface RingPlaceholderProps {
  name: string;
  color?: string; // Kept for backward compatibility
  gemColor?: string;
  className?: string;
  imageSrc?: string;
}

export default function RingPlaceholder({
  name,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  color = '#FFD700', // Default gold color, not directly used but kept for props type
  gemColor,
  className = '',
  imageSrc = '/images/rings/rings.jpg',
}: RingPlaceholderProps) {
  // Using _ prefix with variables will cause TypeScript errors with destructuring
  // We'll just not reference the variable instead
  // Determine gem color based on name if not provided
  let actualGemColor = gemColor;
  if (!actualGemColor) {
    if (name.toLowerCase().includes('amethyst')) {
      actualGemColor = '#9966CC';
    } else if (name.toLowerCase().includes('ruby')) {
      actualGemColor = '#E0115F';
    } else if (name.toLowerCase().includes('emerald')) {
      actualGemColor = '#50C878';
    } else if (name.toLowerCase().includes('sapphire')) {
      actualGemColor = '#0F52BA';
    } else {
      actualGemColor = '#B9F2FF'; // Default diamond color
    }
  }

  return (
    <div className={`relative w-full h-full flex items-center justify-center ${className}`}>
      <motion.div
        className="relative w-full h-full"
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.3 }}
      >
        {/* Ring */}
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
            <div className="w-24 h-24 rounded-full border-4 border-[#FFD700] bg-transparent relative">
              {/* Gem */}
              <div 
                className="absolute w-6 h-6 rounded-full top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                style={{ backgroundColor: actualGemColor }}
              >
                {/* Shine effect */}
                <div className="absolute w-2 h-2 rounded-full bg-white/70 top-1 left-1"></div>
              </div>
            </div>
          )}
        </div>
        
        {/* Ring name - only show if no image */}
        {!imageSrc && (
          <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-center text-xs text-gray-700">{name}</div>
        )}
      </motion.div>
    </div>
  );
} 