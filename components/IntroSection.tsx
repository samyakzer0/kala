'use client';

export default function IntroSection() {
  return (
    <section id="intro-section" className="bg-ivory-400 py-20 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-serif text-primary-500 mb-8">
         Less but beautifully made.
        </h2>
        <p className="text-lg text-primary-400 mb-8 leading-relaxed max-w-2xl mx-auto">
          We are artists who discovered our love for jewelry making and turned it into our creative expression. Every piece we craft is a work of art, born from our passion for beautiful design and our dedication to creating something truly special. Each ring, necklace, and bracelet tells a story of youthful creativity and artistic vision.
        </p>
      </div>
      
      <div className="mt-16 max-w-6xl mx-auto">
        <div className="aspect-[16/9] rounded-lg overflow-hidden">
          <img 
            src="/images/workshop/craftsman.jpg"
            alt="Skilled Jewelry Craftsman at Work"
            className="w-full h-full object-cover object-center"
          />
        </div>
      </div>
    </section>
  );
}
