
import { MainCategoryPromotion } from './types';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL + '/main-category-promotions';


/** Read JWT from localStorage */
function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('authToken');
}
export async function fetchMainCategoryPromotions(): Promise<MainCategoryPromotion[]> {
  const token = getToken();
  const res = await fetch(BASE_URL, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Failed to fetch promotions');
  return res.json();
}

export async function addMainCategoryPromotion(data: FormData): Promise<MainCategoryPromotion> {
  const token = getToken();
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: data,
  });
  if (!res.ok) throw new Error('Failed to add promotion');
  return res.json();
}

export async function updateMainCategoryPromotion(id: number, data: FormData): Promise<MainCategoryPromotion> {
  const token = getToken();
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
    body: data,
  });
  if (!res.ok) throw new Error('Failed to update promotion');
  return res.json();
}

export async function deleteMainCategoryPromotion(id: number): Promise<void> {
  const token = getToken();
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to delete promotion');
}
