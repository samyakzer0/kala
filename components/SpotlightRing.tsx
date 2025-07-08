
'use client';

export default function SpotlightRing() {
  return (
    <section id="spotlight-ring" className="bg-ivory-400 py-20 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <div className="relative aspect-square max-w-md mx-auto mb-12 rounded-full overflow-hidden bg-ivory-300 shadow-2xl">
          <img 
            src="https://readdy.ai/api/search-image?query=elegant%20diamond%20solitaire%20ring%20centered%20on%20white%20background%2C%20luxury%20engagement%20ring%20with%20brilliant%20cut%20diamond%2C%20professional%20jewelry%20photography%2C%20pristine%20white%20backdrop%2C%20premium%20ring%20showcase&width=400&height=400&seq=spotlight-ring&orientation=squarish"
            alt="Spotlight Ring"
            className="w-full h-full object-cover object-top"
          />
        </div>
        
        <button className="bg-ivory-400 text-primary-500 px-12 py-4 rounded-full text-lg font-medium hover:bg-ivory-300 transition-colors whitespace-nowrap cursor-pointer shadow-lg border border-primary-200">
          Get Yours
        </button>
      </div>
    </section>
  );
}
