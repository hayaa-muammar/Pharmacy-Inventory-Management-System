import React, { useEffect } from 'react';
import { useInventory } from '../context/InventoryContext';
import { AlertTriangle, X } from 'lucide-react';

export default function ConfirmModal() {
  const { confirmDialog, closeConfirm } = useInventory();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!confirmDialog.isOpen) return;
      if (e.key === 'Escape') closeConfirm();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [confirmDialog.isOpen, closeConfirm]);

  if (!confirmDialog.isOpen) return null;

  const isDanger = confirmDialog.confirmType === 'danger';

  return (
    <div className="modal-overlay" onClick={closeConfirm} role="dialog" aria-modal="true">
      <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              background: isDanger ? '#fee2e2' : '#fef3c7',
              color: isDanger ? '#dc2626' : '#d97706',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <AlertTriangle size={20} />
            </div>
            <h3 className="modal-title" style={{ fontSize: '1.15rem' }}>
              {confirmDialog.title || 'Confirmation Required'}
            </h3>
          </div>
          <button type="button" className="modal-close-btn" onClick={closeConfirm} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        <div className="modal-body" style={{ color: '#475569', fontSize: '0.94rem', lineHeight: 1.6 }}>
          {confirmDialog.message}
        </div>

        <div className="modal-footer">
          <button type="button" className="btn-secondary-outline" onClick={closeConfirm}>
            Cancel
          </button>
          <button
            type="button"
            className={isDanger ? 'btn-danger-outline' : 'btn-primary-emerald'}
            style={isDanger ? { background: '#dc2626', color: '#ffffff', borderColor: '#dc2626' } : {}}
            onClick={() => {
              if (confirmDialog.onConfirm) confirmDialog.onConfirm();
            }}
          >
            {confirmDialog.confirmText || 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
}
