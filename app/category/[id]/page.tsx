import { notFound } from 'next/navigation';
import CategoryClient from './CategoryClient';
import { 
  categories, 
  getProductsByCategory
} from '../../../data/products';

// Generate static params for all category IDs
export async function generateStaticParams() {
  return categories
    .filter(category => category.id !== 'all') // Exclude 'all' as it's not a specific category page
    .map((category) => ({
      id: category.id,
    }));
}

export default async function CategoryPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params;
  
  // Check if category exists
  const category = categories.find(cat => cat.id === id);
  if (!category) {
    notFound();
  }
  
  // Get initial products for this category
  const initialProducts = getProductsByCategory(id);
  
  return (
    <CategoryClient 
      categoryId={id}
      categoryName={category.name}
      initialProducts={initialProducts}
    />
  );
}