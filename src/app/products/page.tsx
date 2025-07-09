'use client';


import ProductsMainContent from './ProductsMainContent';
import { useAuthGuard } from '@/hooks/useAuthGuard';



export default function SizesPage() {
   const isReady = useAuthGuard();
  if (!isReady) return null;

  return <ProductsMainContent />;
}
