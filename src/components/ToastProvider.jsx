import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastCtx = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const push = useCallback((type, message, duration = 5000) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, type, message }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), duration);
  }, []);

  const api = {
    success: (msg, d) => push('success', msg, d),
    error: (msg, d) => push('error', msg, d),
    info: (msg, d) => push('info', msg, d),
  };

  const bg = (type) =>
    type === 'success' ? '#198754' : type === 'error' ? '#dc3545' : '#0d6efd';

  return (
    <ToastCtx.Provider value={api}>
      {children}
      <div
        style={{
          position: 'fixed',
          right: 16,
          bottom: 16,
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          zIndex: 2000,
        }}
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            role='status'
            onClick={() => setToasts((x) => x.filter((i) => i.id !== t.id))}
            style={{
              minWidth: 260,
              maxWidth: 360,
              padding: '10px 12px',
              borderRadius: 8,
              color: 'white',
              background: bg(t.type),
              boxShadow: '0 8px 24px rgba(0,0,0,.2)',
              cursor: 'pointer',
            }}
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

export const useToast = () => useContext(ToastCtx);
