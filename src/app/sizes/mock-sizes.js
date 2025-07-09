const STORAGE_KEY = 'mock_brands';

function loadFromStorage() {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveToStorage(data) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }
}

let brands = loadFromStorage();

export async function fetchBrands() {
  return brands;
}

export async function addBrand(data) {
  const newBrand = { id: Date.now(), ...data };
  brands.push(newBrand);
  saveToStorage(brands);
  return newBrand;
}

export async function updateBrand(id, data) {
  brands = brands.map(b => b.id === id ? { ...b, ...data } : b);
  saveToStorage(brands);
  return brands.find(b => b.id === id);
}

export async function deleteBrand(id) {
  brands = brands.filter(b => b.id !== id);
  saveToStorage(brands);
}