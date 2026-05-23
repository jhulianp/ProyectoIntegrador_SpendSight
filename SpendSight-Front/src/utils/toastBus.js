/**
 * Bus de notificaciones global, sin librerías externas.
 * Cualquier parte del código puede emitir un toast llamando a notify(...)
 * y el componente <ToastHost /> (montado en App.jsx) lo escucha y lo pinta.
 */

const LISTENERS = new Set();

export function onToast(listener) {
  LISTENERS.add(listener);
  return () => LISTENERS.delete(listener);
}

/**
 * @param {{message:string, variant?:'success'|'error'|'info'|'warning', timeout?:number}} t
 */
export function notify(t) {
  const toast = {
    id: Date.now() + Math.random(),
    message: t.message,
    variant: t.variant || 'info',
    timeout: t.timeout ?? 3500,
  };
  LISTENERS.forEach((l) => l(toast));
}
