import { notFound } from 'next/navigation';
import CategoryClient from './CategoryClient';

// Available categories
const categories = [
  { id: 'rings', name: 'Rings' },
  { id: 'necklaces', name: 'Necklaces' },
  { id: 'earrings', name: 'Earrings' },
  { id: 'bracelets', name: 'Bracelets' }
];

// Generate static params for all category IDs
export async function generateStaticParams() {
  return categories.map((category) => ({
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
  
  return (
    <CategoryClient 
      categoryId={id}
      categoryName={category.name}
      initialProducts={[]} // Will be fetched on client side
    />
  );
}