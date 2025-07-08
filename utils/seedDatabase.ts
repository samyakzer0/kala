import { createProduct } from '../utils/productStorage';
import { trackProductView, trackProductOrder } from '../utils/analytics';
import { ProductFormData } from '../types/product';

// Sample products to seed the database
const sampleProducts: ProductFormData[] = [
  // Rings
  {
    name: "Eternal Diamond Ring",
    price: 1299.99,
    category: "rings",
    subcategory: "engagement",
    gemColor: "#B9F2FF",
    description: "A stunning diamond ring that symbolizes eternal love. Crafted with precision and featuring a brilliant cut diamond.",
    featured: true,
    new: true,
    bestseller: false,
    stock: 15,
    lowStockThreshold: 3,
    isActive: true
  },
  {
    name: "Vintage Rose Gold Band",
    price: 459.99,
    category: "rings",
    subcategory: "wedding",
    gemColor: "#FFB6C1",
    description: "An elegant vintage-inspired rose gold wedding band with intricate detailing.",
    featured: false,
    new: false,
    bestseller: true,
    stock: 25,
    lowStockThreshold: 5,
    isActive: true
  },
  {
    name: "Sapphire Statement Ring",
    price: 899.99,
    category: "rings",
    subcategory: "cocktail",
    gemColor: "#0F52BA",
    description: "A bold sapphire ring perfect for special occasions. Features a large center stone surrounded by diamonds.",
    featured: false,
    new: false,
    bestseller: false,
    stock: 8,
    lowStockThreshold: 2,
    isActive: true
  },
  
  // Necklaces
  {
    name: "Pearl Strand Necklace",
    price: 699.99,
    category: "necklaces",
    subcategory: "classic",
    gemColor: "#FFF8DC",
    description: "A timeless pearl necklace featuring lustrous cultured pearls. Perfect for formal occasions.",
    featured: true,
    new: false,
    bestseller: true,
    stock: 20,
    lowStockThreshold: 4,
    isActive: true
  },
  {
    name: "Gold Chain Necklace",
    price: 399.99,
    category: "necklaces",
    subcategory: "chain",
    gemColor: "#FFD700",
    description: "A delicate 18k gold chain necklace that complements any outfit.",
    featured: false,
    new: true,
    bestseller: false,
    stock: 30,
    lowStockThreshold: 8,
    isActive: true
  },
  
  // Earrings
  {
    name: "Diamond Stud Earrings",
    price: 599.99,
    category: "earrings",
    subcategory: "studs",
    gemColor: "#FFFFFF",
    description: "Classic diamond stud earrings that add sparkle to any look. Perfect for everyday wear.",
    featured: false,
    new: false,
    bestseller: true,
    stock: 40,
    lowStockThreshold: 10,
    isActive: true
  },
  {
    name: "Emerald Drop Earrings",
    price: 799.99,
    category: "earrings",
    subcategory: "drops",
    gemColor: "#50C878",
    description: "Elegant emerald drop earrings that make a statement. Perfect for special events.",
    featured: true,
    new: true,
    bestseller: false,
    stock: 12,
    lowStockThreshold: 3,
    isActive: true
  },
  
  // Bracelets
  {
    name: "Tennis Bracelet",
    price: 1199.99,
    category: "bracelets",
    subcategory: "tennis",
    gemColor: "#FFFFFF",
    description: "A stunning tennis bracelet featuring a continuous line of diamonds.",
    featured: false,
    new: false,
    bestseller: true,
    stock: 10,
    lowStockThreshold: 2,
    isActive: true
  },
  {
    name: "Charm Bracelet",
    price: 299.99,
    category: "bracelets",
    subcategory: "charm",
    gemColor: "#C0C0C0",
    description: "A customizable charm bracelet that tells your unique story. Comes with three starter charms.",
    featured: false,
    new: true,
    bestseller: false,
    stock: 35,
    lowStockThreshold: 8,
    isActive: true
  }
];

// Seed products and generate some analytics data
export async function seedDatabase(): Promise<void> {
  console.log('🌱 Seeding database with sample products...');
  
  try {
    const createdProducts = [];
    
    // Create all sample products
    for (const productData of sampleProducts) {
      const product = await createProduct(productData);
      createdProducts.push(product);
      console.log(`✅ Created product: ${product.name}`);
    }
    
    // Generate some realistic analytics data
    console.log('📊 Generating analytics data...');
    
    for (const product of createdProducts) {
      // Generate random views (between 50-500)
      const viewCount = Math.floor(Math.random() * 450) + 50;
      for (let i = 0; i < viewCount; i++) {
        await trackProductView(product.id);
      }
      
      // Generate random orders (between 5-50)
      const orderCount = Math.floor(Math.random() * 45) + 5;
      for (let i = 0; i < orderCount; i++) {
        const quantity = Math.floor(Math.random() * 3) + 1; // 1-3 items per order
        await trackProductOrder(product.id, quantity);
      }
      
      console.log(`📈 Generated analytics for ${product.name}: ${viewCount} views, ${orderCount} orders`);
    }
    
    console.log('🎉 Database seeding completed successfully!');
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

// Only run if this file is executed directly
if (require.main === module) {
  seedDatabase().catch(console.error);
}
