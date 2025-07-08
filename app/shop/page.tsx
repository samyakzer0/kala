import { Suspense } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ShopClient from './ShopClient';

export default function ShopPage() {
  return (
    <div className="min-h-screen bg-primary-500">
      <Header />
      <Suspense fallback={
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-secondary mx-auto"></div>
            <p className="mt-4 text-ivory-400">Loading products...</p>
          </div>
        </div>
      }>
        <ShopClient />
      </Suspense>
      <Footer />
    </div>
  );
}