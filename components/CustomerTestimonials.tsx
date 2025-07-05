'use client';
import { useState } from 'react';

export default function CustomerTestimonials() {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const testimonials = [
    {
      quote: "Absolutely stunning craftsmanship! My engagement ring exceeded all expectations. The attention to detail is remarkable.",
      name: "Sarah Chen",
      image: "professional headshot of happy woman with engagement ring, elegant portrait photography, soft lighting, genuine smile, luxury jewelry customer testimonial style"
    },
    {
      quote: "The customization process was seamless. They brought my vision to life perfectly. Couldn't be happier with my wedding bands.",
      name: "Michael Rodriguez",
      image: "professional headshot of satisfied male customer, confident expression, elegant portrait photography, luxury jewelry testimonial style"
    },
    {
      quote: "Five stars! The quality is exceptional and the customer service is outstanding. My grandmother's ring restoration was perfect.",
      name: "Emma Thompson",
      image: "professional headshot of elegant older woman, warm smile, sophisticated portrait photography, jewelry customer testimonial style"
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="bg-[#f6eddf] py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-serif text-gray-900 text-center mb-16">
          What Our Customers Say
        </h2>
        
        <div className="relative">
          <div className="bg-white rounded-2xl p-8 md:p-12 shadow-lg">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-shrink-0">
                <div className="w-24 h-24 rounded-full overflow-hidden">
                  <img 
                    src={`https://readdy.ai/api/search-image?query=$%7Btestimonials%5BcurrentSlide%5D.image%7D&width=150&height=150&seq=testimonial-${currentSlide}&orientation=squarish`}
                    alt={testimonials[currentSlide].name}
                    className="w-full h-full object-cover object-top"
                  />
                </div>
              </div>
              
              <div className="flex-1 text-center md:text-left">
                <p className="text-lg md:text-xl text-gray-700 mb-6 leading-relaxed italic">
                  "{testimonials[currentSlide].quote}"
                </p>
                <p className="font-serif text-xl text-gray-900">
                  — {testimonials[currentSlide].name}
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex justify-between items-center mt-8">
            <button 
              onClick={prevSlide}
              className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center hover:bg-gray-800 transition-colors cursor-pointer"
            >
              ←
            </button>
            
            <div className="flex space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-colors cursor-pointer ${
                    index === currentSlide ? 'bg-black' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
            
            <button 
              onClick={nextSlide}
              className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center hover:bg-gray-800 transition-colors cursor-pointer"
            >
              →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}