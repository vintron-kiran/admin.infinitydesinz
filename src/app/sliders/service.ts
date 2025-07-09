import { Slider } from './types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL;
const API_URL = `${API_BASE}/sliders`;

function getToken() {
  return typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
}

export async function fetchSliders(): Promise<Slider[]> {
  const token = getToken();
  const res = await fetch(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`Failed to fetch sliders: ${res.status}`);
  return res.json();
}

export async function addSlider(formData: FormData): Promise<Slider> {
  const token = getToken();
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });
  if (!res.ok) throw new Error(`Failed to add slider: ${res.status}`);
  return res.json();
}

export async function updateSlider(id: number, formData: FormData): Promise<Slider> {
  const token = getToken();
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });
  if (!res.ok) throw new Error(`Failed to update slider: ${res.status}`);
  return res.json();
}

export async function deleteSlider(id: number): Promise<void> {
  const token = getToken();
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error(`Failed to delete slider: ${res.status}`);
}
