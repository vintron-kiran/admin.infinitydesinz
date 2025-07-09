import { Size } from './types';
import { API_BASE_URL } from '@/lib/constants';

const API_URL = `${API_BASE_URL}/size-uom`;



/**
 * Retrieve the auth token from localStorage
 */
function getToken() {
  console.log(localStorage.getItem('authToken'));
  return typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
}

export async function fetchSizes(): Promise<Size[]> {
  const token = getToken();
  const res = await fetch(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Failed to fetch sizes');
  return res.json();
}

export async function addSize(data: Omit<Size, 'id'>): Promise<Size> {
  const token = getToken();
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to add size');
  return res.json();
}

export async function updateSize(id: number, data: Omit<Size, 'id'>): Promise<Size> {
  const token = getToken();
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update size');
  return res.json();
}


export async function deleteSize(id: number): Promise<void> {
  const token = getToken();
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error('Failed to delete size');
}
