'use client';


import ColorsMainContent from './ColorsMainContent';
import { useAuthGuard } from '@/hooks/useAuthGuard';



export default function SizesPage() {
   const isReady = useAuthGuard();
  if (!isReady) return null;

  return <ColorsMainContent />;
}
