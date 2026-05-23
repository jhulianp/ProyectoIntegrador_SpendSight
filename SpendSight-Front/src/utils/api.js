import { notify } from './toastBus';

/**
 * URL base del API del backend Spring Boot.
 * Configurable mediante VITE_API_URL en /app/SpendSight-Front/.env
 */
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

let backendDownNotified = false;

/**
 * Wrapper de fetch que NUNCA lanza excepción al UI.
 * - Si el backend responde 2xx -> { ok: true, data }
 * - Si el backend responde !=2xx -> { ok: false, status, error }
 * - Si el backend no responde / CORS / red -> { ok: false, offline: true, error }
 *
 * Cuando el backend está caído muestra un toast amarillo "una sola vez"
 * para no inundar al usuario.
 */
export async function apiCall(path, { method = 'GET', body, silent = false } = {}) {
  const url = `${API_URL}${path}`;
  try {
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });

    if (!res.ok) {
      let errMsg = `Error ${res.status}`;
      try {
        const errBody = await res.json();
        errMsg = errBody.message || errBody.error || errMsg;
      } catch (_) { /* respuesta no-JSON */ }
      if (!silent) {
        notify({ message: `⚠ Backend: ${errMsg}`, variant: 'error' });
      }
      return { ok: false, status: res.status, error: errMsg };
    }

    // Reset flag de aviso de offline
    backendDownNotified = false;

    // 204 No Content
    if (res.status === 204) return { ok: true, data: null };

    let data = null;
    try { data = await res.json(); } catch (_) { /* puede venir vacío */ }
    return { ok: true, data };
  } catch (err) {
    // Network error / CORS / backend caído
    if (!silent && !backendDownNotified) {
      backendDownNotified = true;
      notify({
        message: '⚠ Backend no disponible — trabajando con datos locales',
        variant: 'warning',
        timeout: 5000,
      });
    }
    return { ok: false, offline: true, error: err.message };
  }
}

/**
 * Endpoints mapeados según las rutas reales del backend.
 * (Algunos no llevan slash inicial; los normalizamos aquí).
 */
export const ENDPOINTS = {
  auth: {
    login: '/api/auth/login',
    register: '/api/auth/register',
  },
  usuarios: '/api/usuarios',
  categorias: '/apispendsight/v1/categorias',
  gastos: '/apispendsight/v1/gastos',
  comercios: '/apispendsight/v1/Comercio', // ojo: la C es mayúscula en el backend
  mediosPago: '/api/medios-pago',
};
