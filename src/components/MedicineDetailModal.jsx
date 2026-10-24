import React from 'react';
import { useInventory } from '../context/InventoryContext';
import { 
  X, 
  Package, 
  Calendar, 
  Building2, 
  DollarSign, 
  AlertTriangle, 
  Clock, 
  Edit3, 
  ArrowUpDown,
  History,
  ShieldCheck,
  AlertOctagon
} from 'lucide-react';

export default function MedicineDetailModal({ medicine, onClose, onEdit, onAdjustStock }) {
  const { 
    transactions, 
    getDaysUntilExpiry, 
    getExpiryStatus, 
    getStockStatus 
  } = useInventory();

  if (!medicine) return null;

  const stockStatus = getStockStatus(medicine);
  const expiryStatus = getExpiryStatus(medicine);
  const days = getDaysUntilExpiry(medicine.expiryDate);
  const totalValuation = ((Number(medicine.quantity) || 0) * (Number(medicine.unitPrice) || 0)).toFixed(2);

  // Filter transactions for this medicine
  const medTransactions = transactions.filter(t => t.medicineId === medicine.id).slice(0, 5);

  const percent = Math.min(100, Math.round(((medicine.quantity || 0) / Math.max(medicine.minStock * 2, 20)) * 100));

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-card large" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{
              background: '#043026',
              color: '#34d399',
              padding: '0.25rem 0.65rem',
              borderRadius: '6px',
              fontFamily: 'Outfit, sans-serif',
              fontWeight: 700,
              fontSize: '0.85rem'
            }}>
              {medicine.id}
            </span>
            <h3 className="modal-title">{medicine.name}</h3>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1.5rem',
            marginBottom: '1.5rem'
          }}>
            {/* Image Preview */}
            <div style={{
              position: 'relative',
              borderRadius: '12px',
              overflow: 'hidden',
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              height: '240px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {medicine.image ? (
                <img
                  src={medicine.image}
                  alt={medicine.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    if (e.currentTarget.nextElementSibling) {
                      e.currentTarget.nextElementSibling.style.display = 'flex';
                    }
                  }}
                />
              ) : null}
              <div 
                style={{ 
                  display: medicine.image ? 'none' : 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  gap: '0.5rem', 
                  color: '#075f4c' 
                }}
              >
                <Package size={48} />
                <span style={{ fontWeight: 700 }}>{medicine.name}</span>
              </div>

              {/* Status pills overlaid */}
              <div style={{ position: 'absolute', top: 12, left: 12 }}>
                <span className={`status-pill ${stockStatus}`}>
                  {stockStatus === 'in-stock' && 'In Stock'}
                  {stockStatus === 'low-stock' && 'Low Stock'}
                  {stockStatus === 'out-stock' && 'Out of Stock'}
                </span>
              </div>

              <div style={{ position: 'absolute', top: 12, right: 12 }}>
                <span className={`status-pill ${expiryStatus}`}>
                  {expiryStatus === 'expired' && 'Expired'}
                  {expiryStatus === 'expiring-soon' && 'Expiring Soon'}
                  {expiryStatus === 'valid' && 'Safe / Valid'}
                </span>
              </div>
            </div>

            {/* Quick Metrics & Specs */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '1.1rem'
              }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '0.75rem' }}>
                  <div>
                    <div style={{ fontSize: '0.76rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Current Units</div>
                    <div style={{ fontSize: '1.6rem', fontWeight: 800, color: stockStatus === 'out-stock' ? '#ef4444' : '#075f4c' }}>
                      {medicine.quantity} <span style={{ fontSize: '0.85rem', fontWeight: 500, color: '#64748b' }}>units</span>
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.76rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>SKU Valuation</div>
                    <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a' }}>
                      ${totalValuation}
                    </div>
                  </div>
                </div>

                {/* Stock Progress vs Safety Threshold */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#64748b', marginBottom: '0.3rem' }}>
                    <span>Threshold: {medicine.minStock} units</span>
                    <span>Safety Buffer: {percent}%</span>
                  </div>
                  <div className="med-stock-bar-wrap">
                    <div 
                      className={`med-stock-bar-fill ${stockStatus}`} 
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Data attributes list */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.65rem', fontSize: '0.85rem' }}>
                <div style={{ background: '#ffffff', border: '1px solid #f1f5f9', padding: '0.65rem 0.85rem', borderRadius: '8px' }}>
                  <div style={{ color: '#64748b', fontSize: '0.75rem' }}>Category</div>
                  <div style={{ fontWeight: 700, color: '#059669' }}>{medicine.category}</div>
                </div>

                <div style={{ background: '#ffffff', border: '1px solid #f1f5f9', padding: '0.65rem 0.85rem', borderRadius: '8px' }}>
                  <div style={{ color: '#64748b', fontSize: '0.75rem' }}>Unit Price</div>
                  <div style={{ fontWeight: 700, color: '#0f172a' }}>${Number(medicine.unitPrice || 0).toFixed(2)}</div>
                </div>

                <div style={{ background: '#ffffff', border: '1px solid #f1f5f9', padding: '0.65rem 0.85rem', borderRadius: '8px' }}>
                  <div style={{ color: '#64748b', fontSize: '0.75rem' }}>Supplier</div>
                  <div style={{ fontWeight: 600, color: '#334155' }}>{medicine.supplier || 'Standard Distributor'}</div>
                </div>

                <div style={{ background: '#ffffff', border: '1px solid #f1f5f9', padding: '0.65rem 0.85rem', borderRadius: '8px' }}>
                  <div style={{ color: '#64748b', fontSize: '0.75rem' }}>Expiry Schedule</div>
                  <div style={{ 
                    fontWeight: 700, 
                    color: days < 0 ? '#dc2626' : days <= 90 ? '#d97706' : '#059669' 
                  }}>
                    {medicine.expiryDate} {days < 0 ? `(${Math.abs(days)}d overdue)` : `(${days}d left)`}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          {medicine.description && (
            <div style={{
              background: '#f8fafc',
              borderRadius: '10px',
              padding: '1rem',
              marginBottom: '1.5rem',
              border: '1px solid #e2e8f0'
            }}>
              <h4 style={{ margin: '0 0 0.4rem', fontSize: '0.88rem', fontWeight: 700, color: '#334155' }}>
                Clinical Indications &amp; Usage Description
              </h4>
              <p style={{ margin: 0, fontSize: '0.88rem', color: '#475569', lineHeight: 1.6 }}>
                {medicine.description}
              </p>
            </div>
          )}

          {/* Stock History Audit Trail for this SKU */}
          <div>
            <h4 style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem', 
              margin: '0 0 0.75rem', 
              fontSize: '0.92rem', 
              color: '#0f172a',
              fontFamily: 'Outfit, sans-serif'
            }}>
              <History size={16} color="#075f4c" />
              Recent Movement History for this Medicine
            </h4>

            {medTransactions.length === 0 ? (
              <p style={{ fontSize: '0.85rem', color: '#94a3b8', fontStyle: 'italic', margin: 0 }}>
                No recent movements recorded for this medicine in current session.
              </p>
            ) : (
              <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                  <thead>
                    <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b' }}>
                      <th style={{ padding: '0.5rem 0.75rem', textAlign: 'left' }}>Action</th>
                      <th style={{ padding: '0.5rem 0.75rem', textAlign: 'left' }}>Quantity</th>
                      <th style={{ padding: '0.5rem 0.75rem', textAlign: 'left' }}>Stock Delta</th>
                      <th style={{ padding: '0.5rem 0.75rem', textAlign: 'left' }}>Reason</th>
                      <th style={{ padding: '0.5rem 0.75rem', textAlign: 'left' }}>Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {medTransactions.map(txn => (
                      <tr key={txn.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '0.5rem 0.75rem' }}>
                          <span style={{
                            padding: '0.15rem 0.45rem',
                            borderRadius: '4px',
                            fontWeight: 700,
                            fontSize: '0.72rem',
                            background: txn.type === 'IN' ? '#d1fae5' : '#fee2e2',
                            color: txn.type === 'IN' ? '#065f46' : '#991b1b'
                          }}>
                            {txn.type === 'IN' ? '+ RECEIPT' : '- DISPENSE'}
                          </span>
                        </td>
                        <td style={{ padding: '0.5rem 0.75rem', fontWeight: 600 }}>
                          {txn.delta} units
                        </td>
                        <td style={{ padding: '0.5rem 0.75rem', color: '#64748b' }}>
                          {txn.prevQty} &rarr; {txn.newQty}
                        </td>
                        <td style={{ padding: '0.5rem 0.75rem', color: '#334155' }}>
                          {txn.reason}
                        </td>
                        <td style={{ padding: '0.5rem 0.75rem', color: '#94a3b8' }}>
                          {new Date(txn.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="modal-footer">
          <button 
            type="button" 
            className="btn-secondary-outline" 
            onClick={() => { onClose(); onAdjustStock(medicine); }}
          >
            <ArrowUpDown size={16} />
            <span>Adjust Stock</span>
          </button>
          <button 
            type="button" 
            className="btn-primary-emerald" 
            onClick={() => { onClose(); onEdit(medicine); }}
          >
            <Edit3 size={16} />
            <span>Edit Details</span>
          </button>
        </div>
      </div>
    </div>
  );
}
