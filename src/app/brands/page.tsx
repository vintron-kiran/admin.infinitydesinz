'use client';


import BrandsMainContent from './BrandsMainContent';
import { useAuthGuard } from '@/hooks/useAuthGuard';



export default function BrandsPage() {
   const isReady = useAuthGuard();
  if (!isReady) return null;

  return <BrandsMainContent />;
}
