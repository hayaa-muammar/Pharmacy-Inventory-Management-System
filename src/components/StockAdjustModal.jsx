import React, { useState, useEffect } from 'react';
import { useInventory } from '../context/InventoryContext';
import { ArrowDownLeft, ArrowUpRight, X, AlertCircle } from 'lucide-react';

export default function StockAdjustModal() {
  const { stockModal, setStockModal, adjustStock, showToast } = useInventory();
  const [operation, setOperation] = useState('IN'); // 'IN' or 'OUT'
  const [delta, setDelta] = useState('10');
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  const medicine = stockModal.medicine;

  useEffect(() => {
    if (stockModal.isOpen) {
      setOperation('IN');
      setDelta('10');
      setReason('');
      setError('');
    }
  }, [stockModal.isOpen]);

  if (!stockModal.isOpen || !medicine) return null;

  const currentQty = Number(medicine.quantity) || 0;
  const numDelta = parseInt(delta, 10) || 0;
  const projectedQty = operation === 'IN' ? currentQty + numDelta : currentQty - numDelta;

  const handleClose = () => {
    setStockModal({ isOpen: false, medicine: null });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (isNaN(numDelta) || numDelta <= 0) {
      setError('Please specify a positive whole quantity greater than 0.');
      return;
    }

    if (operation === 'OUT' && numDelta > currentQty) {
      setError(`Cannot dispense ${numDelta} units. Only ${currentQty} units available in stock.`);
      return;
    }

    try {
      const finalDelta = operation === 'IN' ? numDelta : -numDelta;
      const finalReason = reason.trim() || (operation === 'IN' ? 'Stock replenishment shipment' : 'Prescription dispensation');
      adjustStock(medicine.id, finalDelta, finalReason);
      handleClose();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="modal-overlay" onClick={handleClose} role="dialog" aria-modal="true">
      <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px' }}>
        <div className="modal-header">
          <div>
            <h3 className="modal-title">Adjust Stock Level</h3>
            <p style={{ margin: '0.2rem 0 0', fontSize: '0.84rem', color: '#64748b' }}>
              {medicine.name} &bull; <strong style={{ color: '#075f4c' }}>{medicine.id}</strong>
            </p>
          </div>
          <button type="button" className="modal-close-btn" onClick={handleClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Operation Type Switcher */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={() => { setOperation('IN'); setError(''); }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem',
                  borderRadius: '10px',
                  border: operation === 'IN' ? '2px solid #10b981' : '1px solid #e2e8f0',
                  background: operation === 'IN' ? '#ecfdf5' : '#ffffff',
                  color: operation === 'IN' ? '#065f46' : '#64748b',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <ArrowDownLeft size={18} color={operation === 'IN' ? '#10b981' : '#64748b'} />
                <span>Stock In (Add)</span>
              </button>

              <button
                type="button"
                onClick={() => { setOperation('OUT'); setError(''); }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem',
                  borderRadius: '10px',
                  border: operation === 'OUT' ? '2px solid #ef4444' : '1px solid #e2e8f0',
                  background: operation === 'OUT' ? '#fef2f2' : '#ffffff',
                  color: operation === 'OUT' ? '#991b1b' : '#64748b',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <ArrowUpRight size={18} color={operation === 'OUT' ? '#ef4444' : '#64748b'} />
                <span>Stock Out (Dispense)</span>
              </button>
            </div>

            {/* Current vs Projected Stock Indicator */}
            <div style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-around',
              textAlign: 'center'
            }}>
              <div>
                <div style={{ fontSize: '0.78rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Current Stock</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a' }}>{currentQty}</div>
              </div>
              <div style={{ fontSize: '1.2rem', color: '#94a3b8' }}>&rarr;</div>
              <div>
                <div style={{ fontSize: '0.78rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Projected Stock</div>
                <div style={{ 
                  fontSize: '1.4rem', 
                  fontWeight: 800, 
                  color: projectedQty < 0 ? '#ef4444' : projectedQty <= (medicine.minStock || 10) ? '#f59e0b' : '#10b981' 
                }}>
                  {projectedQty}
                </div>
              </div>
            </div>

            {/* Quantity Input */}
            <div>
              <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, color: '#334155', marginBottom: '0.4rem' }}>
                Quantity to {operation === 'IN' ? 'Receive' : 'Dispense'}
              </label>
              <input
                type="number"
                min="1"
                value={delta}
                onChange={(e) => setDelta(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  fontSize: '1.05rem',
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 700,
                  border: '1px solid #cbd5e1',
                  borderRadius: '8px',
                  boxSizing: 'border-box'
                }}
                required
              />
            </div>

            {/* Reason Presets & Custom Input */}
            <div>
              <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, color: '#334155', marginBottom: '0.4rem' }}>
                Reason / Clinical Memo
              </label>
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
                {(operation === 'IN'
                  ? ['Supplier delivery', 'Returned by ward', 'Inventory count adjustment']
                  : ['Prescription fulfillment', 'Ward transfer', 'Damaged / Expired disposal']
                ).map(preset => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setReason(preset)}
                    style={{
                      fontSize: '0.76rem',
                      padding: '0.25rem 0.6rem',
                      background: '#f1f5f9',
                      border: '1px solid #e2e8f0',
                      borderRadius: '6px',
                      color: '#475569',
                      cursor: 'pointer'
                    }}
                  >
                    + {preset}
                  </button>
                ))}
              </div>
              <input
                type="text"
                placeholder={operation === 'IN' ? 'e.g., Monthly batch order received' : 'e.g., Outpatient prescription RX-894'}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  fontSize: '0.88rem',
                  fontFamily: 'Inter, sans-serif',
                  border: '1px solid #cbd5e1',
                  borderRadius: '8px',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {/* Error Message */}
            {error && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: '#fee2e2',
                color: '#991b1b',
                padding: '0.75rem',
                borderRadius: '8px',
                fontSize: '0.86rem'
              }}>
                <AlertCircle size={18} style={{ flexShrink: 0 }} />
                <span>{error}</span>
              </div>
            )}
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary-outline" onClick={handleClose}>
              Cancel
            </button>
            <button
              type="submit"
              className={operation === 'IN' ? 'btn-accent-mint' : 'btn-danger-outline'}
              style={operation === 'OUT' ? { background: '#ef4444', color: '#ffffff', borderColor: '#ef4444' } : {}}
            >
              {operation === 'IN' ? `Confirm Stock Receipt (+${numDelta || 0})` : `Confirm Dispensation (-${numDelta || 0})`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
