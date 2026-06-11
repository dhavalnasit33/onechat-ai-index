'use client';

import { useEffect, useState } from 'react';
import { CheckCircle, AlertCircle, ShieldX, X, Info } from 'lucide-react';

interface ToastItem {
  id: number;
  title: string;
  description?: string;
  variant: string;
  duration: number;
}

export default function ToastRenderer() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    let idCounter = 0;

    const handler = (e: Event) => {
      const { title, description, variant = 'default', duration = 3500 } = (e as CustomEvent).detail;
      const id = ++idCounter;

      setToasts((prev) => [...prev, { id, title, description, variant, duration }]);

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    };

    window.addEventListener('onechat:toast', handler);
    return () => window.removeEventListener('onechat:toast', handler);
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        maxWidth: 380,
        pointerEvents: 'none',
      }}
    >
      {toasts.map((toast) => {
        const isDestructive = toast.variant === 'destructive';
        const isWarning = toast.variant === 'warning';
        const isSuccess = toast.variant === 'success';

        const borderColor = isDestructive
          ? '#e53935'
          : isWarning
          ? '#f59e0b'
          : isSuccess
          ? '#22c55e'
          : '#6C56E5';

        const iconColor = borderColor;

        const Icon = isDestructive
          ? AlertCircle
          : isWarning
          ? ShieldX
          : isSuccess
          ? CheckCircle
          : Info;

        return (
          <div
            key={toast.id}
            style={{
              pointerEvents: 'all',
              display: 'flex',
              alignItems: 'flex-start',
              gap: 12,
              background: '#ffffff',
              border: `1px solid ${borderColor}33`,
              borderLeft: `4px solid ${borderColor}`,
              borderRadius: 10,
              padding: '12px 16px',
              boxShadow: '0 4px 24px rgba(0,0,0,0.10), 0 1px 4px rgba(0,0,0,0.06)',
              animation: 'toastSlideUp 0.3s ease',
              minWidth: 280,
            }}
          >
            <div style={{ flexShrink: 0, marginTop: 1 }}>
              <Icon size={18} color={iconColor} />
            </div>
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: '#111827',
                  marginBottom: toast.description ? 3 : 0,
                  lineHeight: 1.4,
                }}
              >
                {toast.title}
              </div>
              {toast.description && (
                <div style={{ fontSize: 12, color: '#6b7280', lineHeight: 1.5 }}>
                  {toast.description}
                </div>
              )}
            </div>
            <button
              onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#9ca3af',
                padding: 2,
                flexShrink: 0,
              }}
            >
              <X size={14} />
            </button>
          </div>
        );
      })}

      <style>{`
        @keyframes toastSlideUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
