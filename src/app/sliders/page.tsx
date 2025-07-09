'use client';


import SlidersMainContent from './SlidersMainContent';
import { useAuthGuard } from '@/hooks/useAuthGuard';



export default function SizesPage() {
   const isReady = useAuthGuard();
  if (!isReady) return null;

  return <SlidersMainContent />;
}
