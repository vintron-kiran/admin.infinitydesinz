'use client';

import { useAuthGuard } from '@/hooks/useAuthGuard';
import CategoriesMainContent from '../CategoriesMainContent';

export default function CategoriesClientWrapper({ type }: { type: string }) {
  const isReady = useAuthGuard();
  if (!isReady) return null;

  return <CategoriesMainContent type={type} />;
}
