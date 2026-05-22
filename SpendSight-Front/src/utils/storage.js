export function loadStorage(key, fallback = []) {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function saveStorage(key, data) {
  try {
    window.localStorage.setItem(key, JSON.stringify(data));
  } catch {
    // ignore storage errors for now
  }
}

export function fmtCOP(value) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);
}

export function safeParse(value, fallback = []) {
  try {
    return JSON.parse(value || 'null') || fallback;
  } catch {
    return fallback;
  }
}
