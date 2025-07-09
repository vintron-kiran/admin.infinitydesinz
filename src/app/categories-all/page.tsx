
'use client';


import CategoriesAllMainContent from './CategoriesAllMainContent';
import { useAuthGuard } from '@/hooks/useAuthGuard';



export default function CategoriesAllPage() {
   const isReady = useAuthGuard();
  if (!isReady) return null;

  return <CategoriesAllMainContent />;
}

