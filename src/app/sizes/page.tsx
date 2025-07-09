'use client';


import SizesMainContent from './SizesMainContent';
import { useAuthGuard } from '@/hooks/useAuthGuard';



export default function SizesPage() {
   const isReady = useAuthGuard();
  if (!isReady) return null;

  return <SizesMainContent />;
}
