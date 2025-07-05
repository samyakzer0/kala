export type Product = {
  id: string;
  name: string;
  price: number;
  category: string;
  subcategory?: string;
  gemColor?: string;
  description: string;
  featured?: boolean;
  new?: boolean;
  bestseller?: boolean;
  image?: string;
};

export const products: Product[] = [
  // Rings
  {
    id: 'ring-1',
    name: 'Charis Diamond Ring',
    price: 279,
    category: 'rings',
    subcategory: 'engagement',
    gemColor: '#B9F2FF',
    description: 'A stunning solitaire diamond ring set in 14k gold, perfect for that special moment.',
    featured: true,
    bestseller: true,
    image: '/images/rings/rings.jpg'
  },
  /* Future rings - uncomment when more images are available
  {
    id: 'ring-2',
    name: 'Astra Amethyst Ring',
    price: 315,
    category: 'rings',
    subcategory: 'gemstone',
    gemColor: '#9966CC',
    description: 'Featuring a brilliant amethyst stone surrounded by small diamonds for an elegant look.',
    new: true,
    image: '/images/rings/rings.jpg'
  },
  {
    id: 'ring-3',
    name: 'Selene Ruby Ring',
    price: 329,
    category: 'rings',
    subcategory: 'gemstone',
    gemColor: '#E0115F',
    description: 'A stunning ruby centerpiece with a delicate gold band, perfect for special occasions.',
    image: '/images/rings/rings.jpg'
  },
  {
    id: 'ring-4',
    name: 'Reverie Emerald Ring',
    price: 367,
    category: 'rings',
    subcategory: 'gemstone',
    gemColor: '#50C878',
    description: 'An elegant emerald ring that adds a touch of sophistication to any outfit.',
    image: '/images/rings/rings.jpg'
  },
  {
    id: 'ring-5',
    name: 'Moonstone Halo Ring',
    price: 325,
    category: 'rings',
    subcategory: 'wedding',
    gemColor: '#B9F2FF',
    description: 'A beautiful halo ring featuring a center diamond surrounded by smaller stones.',
    bestseller: true,
    image: '/images/rings/rings.jpg'
  },
  {
    id: 'ring-6',
    name: 'Amethyst Eternity Band',
    price: 319,
    category: 'rings',
    subcategory: 'wedding',
    gemColor: '#9966CC',
    description: 'A stunning eternity band with amethyst stones that symbolize everlasting love.',
    image: '/images/rings/rings.jpg'
  },
  {
    id: 'ring-7',
    name: 'Cascade Sapphire Ring',
    price: 299,
    category: 'rings',
    subcategory: 'gemstone',
    gemColor: '#0F52BA',
    description: 'A beautiful sapphire ring with a unique cascade design that catches the light.',
    image: '/images/rings/rings.jpg'
  },
  {
    id: 'ring-8',
    name: 'Lucerne Diamond Ring',
    price: 323,
    category: 'rings',
    subcategory: 'engagement',
    gemColor: '#B9F2FF',
    description: 'A classic engagement ring with a brilliant cut diamond and delicate band.',
    image: '/images/rings/rings.jpg'
  },
  */
  
  // Necklaces
  {
    id: 'necklace-1',
    name: 'Celestial Pendant',
    price: 245,
    category: 'necklaces',
    subcategory: 'pendant',
    gemColor: '#B9F2FF',
    description: 'A delicate pendant necklace featuring a diamond-encrusted star design.',
    featured: true,
    image: '/images/necklaces/necklace.jpg'
  },
  /* Future necklaces - uncomment when more images are available
  {
    id: 'necklace-2',
    name: 'Ruby Droplet Necklace',
    price: 289,
    category: 'necklaces',
    subcategory: 'gemstone',
    gemColor: '#E0115F',
    description: 'A stunning ruby droplet suspended on a fine gold chain, perfect for elegant evenings.',
    new: true,
    image: '/images/necklaces/necklace.jpg'
  },
  {
    id: 'necklace-3',
    name: 'Sapphire Strand',
    price: 350,
    category: 'necklaces',
    subcategory: 'gemstone',
    gemColor: '#0F52BA',
    description: 'A beautiful strand of sapphires set in white gold for a timeless look.',
    image: '/images/necklaces/necklace.jpg'
  },
  {
    id: 'necklace-4',
    name: 'Pearl Elegance',
    price: 275,
    category: 'necklaces',
    subcategory: 'pearl',
    description: 'A classic pearl necklace that adds sophistication to any outfit.',
    bestseller: true,
    image: '/images/necklaces/necklace.jpg'
  },
  */
  
  // Earrings - All 4 available
  {
    id: 'earring-1',
    name: 'Diamond Studs',
    price: 199,
    category: 'earrings',
    subcategory: 'studs',
    gemColor: '#B9F2FF',
    description: 'Classic diamond studs that add a touch of sparkle to any look.',
    bestseller: true,
    image: '/images/earrings/earrings.jpg'
  },
  {
    id: 'earring-2',
    name: 'Emerald Drop Earrings',
    price: 259,
    category: 'earrings',
    subcategory: 'drop',
    gemColor: '#50C878',
    description: 'Elegant drop earrings featuring stunning emeralds set in gold.',
    featured: true,
    image: '/images/earrings/earrings2.jpg'
  },
  {
    id: 'earring-3',
    name: 'Ruby Hoop Earrings',
    price: 229,
    category: 'earrings',
    subcategory: 'hoop',
    gemColor: '#E0115F',
    description: 'Beautiful gold hoops adorned with ruby accents for a pop of color.',
    image: '/images/earrings/earrings3.jpg'
  },
  {
    id: 'earring-4',
    name: 'Amethyst Chandelier Earrings',
    price: 279,
    category: 'earrings',
    subcategory: 'chandelier',
    gemColor: '#9966CC',
    description: 'Stunning chandelier earrings featuring amethyst stones that catch the light.',
    new: true,
    image: '/images/earrings/earrings4.jpg'
  },
  
  // Bracelets - Only 2 available
  {
    id: 'bracelet-1',
    name: 'Diamond Tennis Bracelet',
    price: 399,
    category: 'bracelets',
    subcategory: 'tennis',
    gemColor: '#B9F2FF',
    description: 'A classic tennis bracelet featuring a row of brilliant diamonds.',
    featured: true,
    bestseller: true,
    image: '/images/bracelets/bracelet.jpg'
  },
  {
    id: 'bracelet-2',
    name: 'Sapphire Bangle',
    price: 329,
    category: 'bracelets',
    subcategory: 'bangle',
    gemColor: '#0F52BA',
    description: 'A stunning gold bangle with sapphire accents for an elegant look.',
    image: '/images/bracelets/bracelet2.jpg'
  }
  /* Future bracelets - uncomment when more images are available
  {
    id: 'bracelet-3',
    name: 'Pearl Charm Bracelet',
    price: 249,
    category: 'bracelets',
    subcategory: 'charm',
    description: 'A delicate charm bracelet featuring freshwater pearls and gold charms.',
    new: true,
    image: '/images/bracelets/bracelet.jpg'
  },
  {
    id: 'bracelet-4',
    name: 'Ruby Link Bracelet',
    price: 359,
    category: 'bracelets',
    subcategory: 'link',
    gemColor: '#E0115F',
    description: 'A sophisticated link bracelet with ruby accents for a touch of color.',
    image: '/images/bracelets/bracelet2.jpg'
  }
  */
];

export const categories = [
  { id: 'all', name: 'All Jewelry' },
  { id: 'rings', name: 'Rings' },
  { id: 'necklaces', name: 'Necklaces' },
  { id: 'earrings', name: 'Earrings' },
  { id: 'bracelets', name: 'Bracelets' }
];

export const subcategories = {
  rings: [
    { id: 'engagement', name: 'Engagement Rings' },
    { id: 'wedding', name: 'Wedding Bands' },
    { id: 'gemstone', name: 'Gemstone Rings' }
  ],
  necklaces: [
    { id: 'pendant', name: 'Pendants' },
    { id: 'gemstone', name: 'Gemstone Necklaces' },
    { id: 'pearl', name: 'Pearl Necklaces' }
  ],
  earrings: [
    { id: 'studs', name: 'Stud Earrings' },
    { id: 'drop', name: 'Drop Earrings' },
    { id: 'hoop', name: 'Hoop Earrings' },
    { id: 'chandelier', name: 'Chandelier Earrings' }
  ],
  bracelets: [
    { id: 'tennis', name: 'Tennis Bracelets' },
    { id: 'bangle', name: 'Bangles' },
    { id: 'charm', name: 'Charm Bracelets' },
    { id: 'link', name: 'Link Bracelets' }
  ]
};

export function getProductById(id: string): Product | undefined {
  return products.find(product => product.id === id);
}

export function getProductsByCategory(category: string): Product[] {
  if (category === 'all') return products;
  return products.filter(product => product.category === category);
}

export function getProductsBySubcategory(subcategory: string): Product[] {
  return products.filter(product => product.subcategory === subcategory);
}

export function getFeaturedProducts(): Product[] {
  return products.filter(product => product.featured);
}

export function getNewProducts(): Product[] {
  return products.filter(product => product.new);
}

export function getBestsellerProducts(): Product[] {
  return products.filter(product => product.bestseller);
} 