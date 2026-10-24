import React from 'react';
import { useInventory } from '../context/InventoryContext';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export default function Toast() {
  const { toasts, removeToast } = useInventory();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toasts-container" role="region" aria-label="Notifications">
      {toasts.map(toast => {
        let Icon = Info;
        let iconColor = '#3b82f6';
        if (toast.type === 'success') {
          Icon = CheckCircle2;
          iconColor = '#10b981';
        } else if (toast.type === 'warning') {
          Icon = AlertTriangle;
          iconColor = '#f59e0b';
        } else if (toast.type === 'danger' || toast.type === 'error') {
          Icon = AlertCircle;
          iconColor = '#ef4444';
        }

        return (
          <div key={toast.id} className={`toast-item ${toast.type || 'info'}`} role="alert">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <Icon size={18} color={iconColor} style={{ flexShrink: 0 }} />
              <span className="toast-text">{toast.message}</span>
            </div>
            <button
              type="button"
              onClick={() => removeToast(toast.id)}
              style={{
                background: 'none',
                border: 'none',
                color: '#94a3b8',
                cursor: 'pointer',
                padding: '0.2rem',
                display: 'flex',
                alignItems: 'center'
              }}
              aria-label="Close notification"
            >
              <X size={15} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
