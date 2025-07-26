import { NextRequest, NextResponse } from 'next/server';
import { readdirSync, statSync } from 'fs';
import { join } from 'path';
import { createProduct } from '../../../../lib/database';
import { ProductFormData } from '../../../../types/product';

// Sample product data templates for each category
const productTemplates = {
  rings: [
    {
      name: 'Elegant Gold Ring',
      description: 'Beautiful handcrafted gold ring with intricate design details. Perfect for special occasions or everyday elegance.',
      basePrice: 2500,
      materials: ['Gold', 'Sterling Silver'],
      sizes: ['6', '7', '8', '9', '10'],
    },
    {
      name: 'Classic Silver Ring',
      description: 'Timeless silver ring with a minimalist design. Crafted with precision and attention to detail.',
      basePrice: 1200,
      materials: ['Sterling Silver'],
      sizes: ['6', '7', '8', '9', '10'],
    },
  ],
  necklaces: [
    {
      name: 'Delicate Gold Necklace',
      description: 'Exquisite gold necklace featuring delicate craftsmanship. A perfect addition to any jewelry collection.',
      basePrice: 3500,
      materials: ['Gold', 'Precious Stones'],
      sizes: ['16"', '18"', '20"'],
    },
  ],
  earrings: [
    {
      name: 'Stunning Drop Earrings',
      description: 'Eye-catching drop earrings that add elegance to any outfit. Handcrafted with premium materials.',
      basePrice: 1800,
      materials: ['Gold', 'Sterling Silver'],
      sizes: ['One Size'],
    },
    {
      name: 'Classic Stud Earrings',
      description: 'Timeless stud earrings perfect for everyday wear. Simple yet sophisticated design.',
      basePrice: 800,
      materials: ['Sterling Silver'],
      sizes: ['One Size'],
    },
    {
      name: 'Elegant Hoop Earrings',
      description: 'Beautiful hoop earrings with a modern twist. Lightweight and comfortable for all-day wear.',
      basePrice: 1500,
      materials: ['Gold'],
      sizes: ['Small', 'Medium', 'Large'],
    },
    {
      name: 'Designer Statement Earrings',
      description: 'Bold statement earrings that make a fashion statement. Perfect for special events and occasions.',
      basePrice: 2200,
      materials: ['Gold', 'Precious Stones'],
      sizes: ['One Size'],
    },
  ],
  bracelets: [
    {
      name: 'Elegant Chain Bracelet',
      description: 'Sophisticated chain bracelet with a timeless design. Perfect for layering or wearing alone.',
      basePrice: 1600,
      materials: ['Gold', 'Sterling Silver'],
      sizes: ['6.5"', '7"', '7.5"', '8"'],
    },
    {
      name: 'Delicate Charm Bracelet',
      description: 'Beautiful charm bracelet featuring intricate details. A meaningful piece for everyday wear.',
      basePrice: 2000,
      materials: ['Sterling Silver'],
      sizes: ['6.5"', '7"', '7.5"', '8"'],
    },
  ],
};

interface ImageFile {
  path: string;
  category: string;
  filename: string;
}

// Function to scan image directories
function scanImageDirectories(): ImageFile[] {
  const imagesPath = join(process.cwd(), 'public', 'images');
  const categories = ['rings', 'necklaces', 'earrings', 'bracelets'];
  const imageFiles: ImageFile[] = [];

  for (const category of categories) {
    const categoryPath = join(imagesPath, category);
    
    try {
      const files = readdirSync(categoryPath);
      
      for (const file of files) {
        const filePath = join(categoryPath, file);
        const stat = statSync(filePath);
        
        if (stat.isFile() && /\.(jpg|jpeg|png|webp)$/i.test(file)) {
          imageFiles.push({
            path: `/images/${category}/${file}`,
            category,
            filename: file,
          });
        }
      }
    } catch (error) {
      console.log(`No images found in ${category} directory`);
    }
  }

  return imageFiles;
}

// Function to create product data from image
function createProductFromImage(imageFile: ImageFile, templateIndex: number): ProductFormData {
  const templates = productTemplates[imageFile.category as keyof typeof productTemplates];
  const template = templates[templateIndex % templates.length];
  
  // Create unique product name based on image filename
  const baseImageName = imageFile.filename.replace(/\.(jpg|jpeg|png|webp)$/i, '');
  const uniqueSuffix = baseImageName.includes('-') ? baseImageName.split('-').pop() : '';
  
  const productName = uniqueSuffix && uniqueSuffix !== baseImageName 
    ? `${template.name} - ${uniqueSuffix.toUpperCase()}`
    : `${template.name} #${templateIndex + 1}`;

  return {
    name: productName,
    description: template.description,
    category: imageFile.category,
    price: template.basePrice + (templateIndex * 100), // Slight price variation
    image: imageFile.path,
    stock: Math.floor(Math.random() * 20) + 5, // Random stock between 5-25
    isActive: true,
    featured: Math.random() > 0.7, // 30% chance to be featured
    new: Math.random() > 0.8, // 20% chance to be new
    bestseller: Math.random() > 0.9, // 10% chance to be bestseller
    lowStockThreshold: 5,
    subcategory: undefined,
    gemColor: undefined,
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { adminKey } = body;

    // Validate admin key
    if (adminKey !== process.env.ADMIN_KEY) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log('🔍 Scanning image directories...');
    
    const imageFiles = scanImageDirectories();
    console.log(`📷 Found ${imageFiles.length} images across categories`);

    if (imageFiles.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'No images found to create products from',
        details: 'Make sure you have images in the public/images/[category] folders'
      });
    }

    // Group images by category for better organization
    const imagesByCategory = imageFiles.reduce((acc, img) => {
      if (!acc[img.category]) acc[img.category] = [];
      acc[img.category].push(img);
      return acc;
    }, {} as Record<string, ImageFile[]>);

    console.log('\n📊 Images found by category:');
    Object.entries(imagesByCategory).forEach(([category, images]) => {
      console.log(`  ${category}: ${images.length} images`);
    });

    console.log('\n🚀 Creating products from images...');
    
    let successCount = 0;
    let errorCount = 0;
    const createdProducts: any[] = [];
    const errors: string[] = [];

    for (const [category, images] of Object.entries(imagesByCategory)) {
      console.log(`\n📝 Processing ${category}...`);
      
      for (let i = 0; i < images.length; i++) {
        try {
          const productData = createProductFromImage(images[i], i);
          
          console.log(`  Creating: ${productData.name}`);
          const product = await createProduct(productData);
          
          console.log(`  ✅ Created product: ${product.name} (ID: ${product.id})`);
          createdProducts.push({
            id: product.id,
            name: product.name,
            category: product.category,
            image: images[i].path
          });
          successCount++;
          
          // Small delay to avoid overwhelming the database
          await new Promise(resolve => setTimeout(resolve, 100));
          
        } catch (error) {
          const errorMessage = `Failed to create product from ${images[i].filename}: ${error}`;
          console.error(`  ❌ ${errorMessage}`);
          errors.push(errorMessage);
          errorCount++;
        }
      }
    }

    console.log('\n📈 Summary:');
    console.log(`✅ Successfully created: ${successCount} products`);
    console.log(`❌ Failed to create: ${errorCount} products`);
    console.log(`📷 Total images processed: ${imageFiles.length}`);

    return NextResponse.json({
      success: true,
      message: `Successfully populated ${successCount} products from ${imageFiles.length} images`,
      details: {
        totalImages: imageFiles.length,
        successCount,
        errorCount,
        createdProducts,
        errors: errors.length > 0 ? errors : undefined,
        imagesByCategory: Object.entries(imagesByCategory).map(([category, images]) => ({
          category,
          count: images.length
        }))
      }
    });

  } catch (error) {
    console.error('Error populating products from images:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to populate products from images',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
