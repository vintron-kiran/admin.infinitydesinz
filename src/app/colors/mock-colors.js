const STORAGE_KEY = 'mock_colors';

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

let colors = loadFromStorage();

export async function fetchColors() {
  return colors;
}

export async function addColor(data) {
  const newColor = { id: Date.now(), ...data };
  colors.push(newColor);
  saveToStorage(colors);
  return newColor;
}

export async function updateColor(id, data) {
  colors = colors.map(b => b.id === id ? { ...b, ...data } : b);
  saveToStorage(colors);
  return colors.find(b => b.id === id);
}

export async function deleteColor(id) {
  colors = colors.filter(b => b.id !== id);
  saveToStorage(colors);
}