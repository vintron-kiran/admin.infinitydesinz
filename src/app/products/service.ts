import { CreateProductDto, ProductFeatureDto, ProductFilterDto, ProductFeatureUpdateDto, ProductDetailsDto, ExistingFeature } from './types';
import { API_BASE_URL } from '@/lib/constants';

function getToken() {
  return typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
}

function authHeaders() {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
}

export async function createProduct(data: CreateProductDto) {
  const res = await fetch(`${API_BASE_URL}/products`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create product');
  return res.json();
}

export async function getProducts() {
  const res = await fetch(`${API_BASE_URL}/products`, {
    method: 'GET',
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error('Failed to fetch products');
  return res.json();
}

export async function getProduct(id: string) {
  const res = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: 'GET',
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error('Failed to fetch product');
  return res.json();
}

export async function updateProduct(id: string, data: CreateProductDto) {
  const res = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update product');
  return res.json();
}

export async function deleteProduct(id: string) {
  const res = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error('Failed to delete product');
  return res.json();
}

export async function uploadProductImages(formData: FormData) {
  const token = getToken();
  const res = await fetch(`${API_BASE_URL}/products/upload`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });
  if (!res.ok) throw new Error('Failed to upload images');
  return res.json();
}

export async function addProductFilters(productId: string, filters: ProductFilterDto) {
  const res = await fetch(`${API_BASE_URL}/product-filters`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ productId, ...filters }),
  });
  if (!res.ok) throw new Error('Failed to add filters');
  return res.json();
}

export async function updateProductFilters(id: string, filters: ProductFilterDto) {
  const res = await fetch(`${API_BASE_URL}/product-filters/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(filters),
  });
  if (!res.ok) throw new Error('Failed to update filters');
  return res.json();
}

export async function getFullProductDetails(productId: number) {
  const res = await fetch(`${API_BASE_URL}/products/details/${productId}`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error('Failed to get product details');
  return res.json();
}

export async function createProductFeature(data: ProductFeatureDto) {
  const res = await fetch(`${API_BASE_URL}/product-features`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create feature');
  return res.json();
}

export async function getProductFeatures(productId: number) {
  const res = await fetch(`${API_BASE_URL}/product-features/${productId}`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error('Failed to get features');
  return res.json();
}

export async function updateProductFeature(id: number, data: ProductFeatureUpdateDto) {
  const res = await fetch(`${API_BASE_URL}/product-features/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update feature');
  return res.json();
}

// Product Details CRUD
export async function createProductDetails(productId: number, data: ProductDetailsDto) {
  const res = await fetch(`${API_BASE_URL}/product-details`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ productId, ...data }),
  });
  if (!res.ok) throw new Error('Failed to create product details');
  return res.json();
}

export async function getProductDetails(productId: number) {
  const res = await fetch(`${API_BASE_URL}/product-details/${productId}`, {
    method: 'GET',
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error('Failed to get product details');
  return res.json();
}

export async function updateProductDetails(id: number, data: ProductDetailsDto) {
  const res = await fetch(`${API_BASE_URL}/product-details/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update product details');
  return res.json();
}

export async function getFeaturesByProduct(productId: string): Promise<ExistingFeature[]> {
  const res = await fetch(`${API_BASE_URL}/product-features/${productId}`, {
    method: 'GET',
  });

  if (!res.ok) {
    throw new Error('Failed to fetch product features');
  }

  return res.json();
}