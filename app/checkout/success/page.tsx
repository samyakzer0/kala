'use client';

import { Suspense } from 'react';
import OrderSuccessContent from './OrderSuccessContent';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-stone-50">
        <Header />
        <main className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-sm text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#872730] mx-auto mb-4"></div>
            <p className="text-gray-600">Loading order information...</p>
          </div>
        </main>
        <Footer />
      </div>
    }>
      <OrderSuccessContent />
    </Suspense>
  );
} 