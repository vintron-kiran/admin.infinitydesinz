// src/app/slider-right/service.ts

import { SliderRight } from './types';

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/slider-right`;

/** Read JWT from localStorage */
function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('authToken');
}

/**
 * Fetch the slider-right data
 */
export async function fetchSlider(): Promise<SliderRight> {
  const token = getToken();
  const res = await fetch(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch slider data: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

/**
 * Update slider-right images
 */
export async function updateSlider(formData: FormData): Promise<SliderRight> {
  const token = getToken();
  const res = await fetch(API_URL, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
    cache: 'no-store',
  });
  if (!res.ok) {
    throw new Error(`Failed to update slider: ${res.status} ${res.statusText}`);
  }
  return res.json();
}
