'use client';


import MainCategoryPromotionMainContent from './MainCategoryPromotionMainContent';
import { useAuthGuard } from '@/hooks/useAuthGuard';



export default function SizesPage() {
   const isReady = useAuthGuard();
  if (!isReady) return null;

  return <MainCategoryPromotionMainContent />;
}
