'use client';

export default function HeroSection() {
  return (
    <section className="bg-primary-500 min-h-screen flex flex-col justify-center px-4 py-16">
      <div className="max-w-6xl mx-auto w-full">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-7xl font-serif text-ivory-400 mb-8 leading-tight">
            Designed by you, Created by{' '}
            <em className="italic">Us.</em>
          </h1>
          <button className="bg-ivory-400 text-primary-500 px-8 py-4 rounded-full text-lg font-medium hover:bg-ivory-300 transition-colors whitespace-nowrap shadow-lg border border-primary-200">
            EXPLORE NOW!
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <div className="text-center">
            <div className="aspect-square mb-4 rounded-lg overflow-hidden">
              <img 
                src="/images/bracelets/bracelet.jpg"
                alt="Elegant Bracelets"
                className="w-full h-full object-cover object-center"
              />
            </div>
            <h3 className="text-xl font-serif text-ivory-400">Elegant Bracelets</h3>
          </div>
          
          <div className="text-center">
            <div className="aspect-square mb-4 rounded-lg overflow-hidden">
              <img 
                src="/images/necklaces/necklace.jpg"
                alt="Beautiful Pendants"
                className="w-full h-full object-cover object-center"
              />
            </div>
            <h3 className="text-xl font-serif text-ivory-400">Beautiful Pendants</h3>
          </div>
          
          <div className="text-center">
            <div className="aspect-square mb-4 rounded-lg overflow-hidden">
              <img 
                src="/images/rings/rings.jpg"
                alt="Stunning Rings"
                className="w-full h-full object-cover object-center"
              />
            </div>
            <h3 className="text-xl font-serif text-ivory-400">Stunning Rings</h3>
          </div>
        </div>
      </div>
    </section>
  );
}