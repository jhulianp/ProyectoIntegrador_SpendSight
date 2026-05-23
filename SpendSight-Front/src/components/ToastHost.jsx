import { useEffect, useState } from 'react';
import { onToast } from '../utils/toastBus';

/**
 * Host de toasts globales. Se monta una sola vez en App.jsx.
 */
export default function ToastHost() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const off = onToast((t) => {
      setToasts((prev) => [...prev, t]);
      if (t.timeout) {
        window.setTimeout(() => {
          setToasts((prev) => prev.filter((x) => x.id !== t.id));
        }, t.timeout);
      }
    });
    return off;
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div
      data-testid="toast-host"
      style={{
        position: 'fixed',
        top: 16,
        right: 16,
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        pointerEvents: 'none',
      }}
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          data-testid={`toast-${t.variant}`}
          style={{
            pointerEvents: 'auto',
            minWidth: 260,
            maxWidth: 380,
            padding: '12px 16px',
            borderRadius: 12,
            color: 'white',
            fontSize: 14,
            fontWeight: 500,
            boxShadow: '0 12px 28px rgba(0,0,0,.35)',
            background:
              t.variant === 'error'
                ? 'linear-gradient(135deg,#dc2626,#b91c1c)'
                : t.variant === 'success'
                ? 'linear-gradient(135deg,#16a34a,#15803d)'
                : t.variant === 'warning'
                ? 'linear-gradient(135deg,#d97706,#b45309)'
                : 'linear-gradient(135deg,#2563eb,#1d4ed8)',
          }}
        >
          {t.message}
        </div>
      ))}
    </div>
  );
}
