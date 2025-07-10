'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CustomerTestimonials() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  
  const testimonials = [
    {
      quote: "The intricate designs and flawless craftsmanship reminded me of the royal jewelry from Rajasthan. Absolutely mesmerizing!",
      name: "Priya Sharma",
      location: "Mumbai, Maharashtra",
      rating: 5,
      flower: "🌺", // Hibiscus
      bgColor: "from-pink-100 to-rose-100"
    },
    {
      quote: "Each piece tells a story of tradition and elegance. The emerald necklace I bought for my daughter's wedding was perfect.",
      name: "Arjun Patel", 
      location: "Ahmedabad, Gujarat",
      rating: 5,
      flower: "🌼", // Daisy
      bgColor: "from-yellow-100 to-amber-100"
    },
    {
      quote: "The gold work is exquisite, and the gemstones are of the finest quality. It's like wearing a piece of art.",
      name: "Kavya Nair",
      location: "Kochi, Kerala", 
      rating: 5,
      flower: "🌸", // Cherry Blossom
      bgColor: "from-purple-100 to-pink-100"
    },
    {
      quote: "Outstanding service and breathtaking jewelry. The custom bangles exceeded all my expectations. Truly magnificent!",
      name: "Rajesh Kumar",
      location: "Delhi, NCR",
      rating: 5,
      flower: "🌻", // Sunflower
      bgColor: "from-orange-100 to-yellow-100"
    },
    {
      quote: "The temple jewelry collection is divine. Each piece reflects the rich heritage of Indian craftsmanship beautifully.",
      name: "Meera Iyer",
      location: "Chennai, Tamil Nadu",
      rating: 5,
      flower: "🌷", // Tulip
      bgColor: "from-red-100 to-pink-100"
    },
    {
      quote: "From traditional to contemporary, their range is impressive. The peacock motif earrings are absolutely stunning!",
      name: "Vikram Singh",
      location: "Jaipur, Rajasthan",
      rating: 5,
      flower: "🌹", // Rose
      bgColor: "from-emerald-100 to-green-100"
    }
  ];

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    
    return () => clearInterval(interval);
  }, [isAutoPlaying, testimonials.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <section className="bg-gradient-to-br from-ivory-500 via-ivory-400 to-primary-100 py-20 px-4 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-serif text-primary-500 mb-4">
            Voices of Joy
          </h2>
          <p className="text-primary-600 text-lg max-w-2xl mx-auto">
            Discover what our cherished customers say about their jewelry journey with us
          </p>
        </motion.div>
        
        <div 
          className="relative"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          {/* Main Carousel Container */}
          <div className="relative h-96 md:h-80 overflow-hidden rounded-3xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, scale: 0.8, rotateY: 90 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                exit={{ opacity: 0, scale: 0.8, rotateY: -90 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                className={`absolute inset-0 bg-gradient-to-br ${testimonials[currentSlide].bgColor} backdrop-blur-sm`}
              >
                <div className="relative h-full flex items-center justify-center p-8 md:p-12">
                  {/* Background Blur Effect */}
                  <div className="absolute inset-0 bg-white/30 backdrop-blur-md rounded-3xl"></div>
                  
                  {/* Content */}
                  <div className="relative z-10 max-w-4xl mx-auto text-center">
                    {/* Profile Picture with Flower */}
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 0.2, duration: 0.8, type: "spring" }}
                      className="mb-6"
                    >
                      <div className="w-20 h-20 mx-auto mb-4 relative">
                        <div className="w-full h-full rounded-full bg-gradient-to-br from-white to-ivory-300 flex items-center justify-center text-4xl shadow-lg border-4 border-white/50 backdrop-blur-sm">
                          {testimonials[currentSlide].flower}
                        </div>
                        {/* Floating sparkles */}
                        <div className="absolute -top-2 -right-2 w-4 h-4 bg-yellow-300 rounded-full animate-pulse"></div>
                        <div className="absolute -bottom-1 -left-2 w-3 h-3 bg-pink-300 rounded-full animate-bounce delay-100"></div>
                      </div>
                    </motion.div>

                    {/* Quote */}
                    <motion.blockquote
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4, duration: 0.6 }}
                      className="text-xl md:text-2xl text-primary-600 font-medium leading-relaxed mb-6 italic"
                    >
                      &quot;{testimonials[currentSlide].quote}&quot;
                    </motion.blockquote>

                    {/* Stars */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.6, duration: 0.5 }}
                      className="flex justify-center gap-1 mb-4"
                    >
                      {[...Array(testimonials[currentSlide].rating)].map((_, i) => (
                        <motion.span
                          key={i}
                          initial={{ opacity: 0, rotate: -180 }}
                          animate={{ opacity: 1, rotate: 0 }}
                          transition={{ delay: 0.7 + i * 0.1, duration: 0.3 }}
                          className="text-yellow-400 text-xl"
                        >
                          ⭐
                        </motion.span>
                      ))}
                    </motion.div>

                    {/* Name and Location */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8, duration: 0.6 }}
                      className="text-center"
                    >
                      <h4 className="font-serif text-xl md:text-2xl text-primary-500 font-semibold">
                        {testimonials[currentSlide].name}
                      </h4>
                      <p className="text-primary-400 text-sm md:text-base">
                        {testimonials[currentSlide].location}
                      </p>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Arrows */}
          <button 
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 rounded-full bg-white/80 backdrop-blur-sm border border-primary-200 flex items-center justify-center hover:bg-white transition-all duration-300 shadow-lg group"
          >
            <motion.span 
              className="text-primary-500 text-xl group-hover:scale-110 transition-transform"
              whileHover={{ x: -2 }}
            >
              ←
            </motion.span>
          </button>
          
          <button 
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 rounded-full bg-white/80 backdrop-blur-sm border border-primary-200 flex items-center justify-center hover:bg-white transition-all duration-300 shadow-lg group"
          >
            <motion.span 
              className="text-primary-500 text-xl group-hover:scale-110 transition-transform"
              whileHover={{ x: 2 }}
            >
              →
            </motion.span>
          </button>

          {/* Dots Indicator */}
          <div className="flex justify-center mt-8 gap-3">
            {testimonials.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => goToSlide(index)}
                className={`relative overflow-hidden rounded-full transition-all duration-300 ${
                  index === currentSlide 
                    ? 'w-8 h-3 bg-primary-500' 
                    : 'w-3 h-3 bg-primary-300 hover:bg-primary-400'
                }`}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              >
                {index === currentSlide && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-primary-400 to-secondary-400"
                    layoutId="activeIndicator"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </motion.button>
            ))}
          </div>

          {/* Progress Bar */}
          <div className="mt-4 w-full max-w-md mx-auto h-1 bg-primary-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-primary-500 to-secondary-400"
              initial={{ width: "0%" }}
              animate={{ width: `${((currentSlide + 1) / testimonials.length) * 100}%` }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            />
          </div>
        </div>

        {/* Auto-play Toggle */}
        <div className="text-center mt-8">
          <button
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            className="text-primary-500 hover:text-primary-600 transition-colors text-sm flex items-center gap-2 mx-auto"
          >
            <span className={`w-2 h-2 rounded-full ${isAutoPlaying ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`}></span>
            {isAutoPlaying ? 'Auto-playing' : 'Paused'}
          </button>
        </div>
      </div>
    </section>
  );
}