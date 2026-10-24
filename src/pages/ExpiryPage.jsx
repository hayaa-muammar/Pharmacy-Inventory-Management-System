import React, { useState, useMemo } from 'react';
import { useInventory } from '../context/InventoryContext';
import { 
  AlertOctagon, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Trash2, 
  RotateCcw, 
  Package, 
  Download, 
  DollarSign,
  ArrowUpDown,
  Eye
} from 'lucide-react';

export default function ExpiryPage({ onOpenDetails }) {
  const { 
    medicines, 
    statistics, 
    quarantineAllExpired, 
    adjustStock, 
    setStockModal, 
    getDaysUntilExpiry, 
    getExpiryStatus,
    showToast 
  } = useInventory();

  const [activeTab, setActiveTab] = useState('ALL'); // 'ALL' | 'EXPIRED' | 'SOON' | 'SAFE'

  // Calculate detailed expiry telemetry
  const telemetry = useMemo(() => {
    let expiredUnits = 0;
    let expiredLoss = 0;
    let soonUnits = 0;
    let soonValue = 0;

    medicines.forEach(m => {
      const status = getExpiryStatus(m);
      const qty = Number(m.quantity) || 0;
      const price = Number(m.unitPrice) || 0;

      if (status === 'expired') {
        expiredUnits += qty;
        expiredLoss += qty * price;
      } else if (status === 'expiring-soon') {
        soonUnits += qty;
        soonValue += qty * price;
      }
    });

    return {
      expiredUnits,
      expiredLoss: Math.round(expiredLoss * 100) / 100,
      soonUnits,
      soonValue: Math.round(soonValue * 100) / 100
    };
  }, [medicines, getExpiryStatus]);

  // Filter medicines by tab
  const tabMedicines = useMemo(() => {
    return medicines.filter(m => {
      const status = getExpiryStatus(m);
      if (activeTab === 'EXPIRED') return status === 'expired';
      if (activeTab === 'SOON') return status === 'expiring-soon';
      if (activeTab === 'SAFE') return status === 'valid';
      return true;
    }).sort((a, b) => {
      // Soonest expiry date first
      return (a.expiryDate || '').localeCompare(b.expiryDate || '');
    });
  }, [medicines, activeTab, getExpiryStatus]);

  // Single batch write-off / zero out
  const handleSingleQuarantine = (med) => {
    if (med.quantity <= 0) {
      showToast(`"${med.name}" already has 0 units in stock.`, 'info');
      return;
    }
    adjustStock(med.id, -med.quantity, 'Quarantine & disposal due to expired batch date');
    showToast(`Quarantined ${med.quantity} expired units of ${med.name}.`, 'warning');
  };

  // Export Expiry Schedule
  const exportExpirySchedule = () => {
    const headers = ['ID', 'Medicine', 'Category', 'Quantity', 'ExpiryDate', 'DaysRemaining', 'Status', 'LossRiskValuation'];
    const rows = tabMedicines.map(m => {
      const days = getDaysUntilExpiry(m.expiryDate);
      const status = getExpiryStatus(m);
      const val = ((Number(m.quantity) || 0) * (Number(m.unitPrice) || 0)).toFixed(2);
      return [
        `"${m.id}"`,
        `"${(m.name || '').replace(/"/g, '""')}"`,
        `"${(m.category || '').replace(/"/g, '""')}"`,
        m.quantity,
        `"${m.expiryDate}"`,
        days,
        status,
        val
      ];
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `PharmaCare_Expiry_Audit_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Exported Expiry Audit Schedule to CSV.', 'success');
  };

  return (
    <div className="page-container">
      {/* Page Title */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.75rem' }}>
        <div>
          <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.85rem', fontWeight: 800, margin: '0 0 0.25rem', color: '#0f172a' }}>
            Expiry Monitoring Center
          </h2>
          <p style={{ margin: 0, color: '#64748b', fontSize: '0.92rem' }}>
            Proactive shelf-life surveillance, countdown telemetry, and bulk quarantine protocols
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button type="button" className="btn-secondary-outline" onClick={exportExpirySchedule}>
            <Download size={16} />
            <span>Export Expiry Audit</span>
          </button>

          {statistics.expired > 0 && (
            <button 
              type="button" 
              className="btn-danger-outline"
              style={{ background: '#dc2626', color: '#ffffff', borderColor: '#dc2626' }}
              onClick={quarantineAllExpired}
            >
              <AlertOctagon size={16} />
              <span>Quarantine All Expired ({statistics.expired})</span>
            </button>
          )}
        </div>
      </div>

      {/* Expiry KPI Cards */}
      <div className="kpi-cards-grid" style={{ marginBottom: '1.75rem' }}>
        {/* Expired Batches */}
        <div className="kpi-card" style={{ borderLeft: '4px solid #ef4444' }}>
          <div className="kpi-card-header">
            <span className="kpi-card-title">Expired Batches</span>
            <div className="kpi-icon-bubble danger">
              <AlertOctagon size={20} />
            </div>
          </div>
          <div className="kpi-card-value" style={{ color: '#dc2626' }}>{statistics.expired}</div>
          <div className="kpi-card-caption">{telemetry.expiredUnits} physical units require disposal</div>
        </div>

        {/* Expired Financial Loss */}
        <div className="kpi-card" style={{ borderLeft: '4px solid #f87171' }}>
          <div className="kpi-card-header">
            <span className="kpi-card-title">Expired Stock Value</span>
            <div className="kpi-icon-bubble danger">
              <DollarSign size={20} />
            </div>
          </div>
          <div className="kpi-card-value" style={{ color: '#991b1b' }}>
            ${telemetry.expiredLoss.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="kpi-card-caption">Estimated write-off loss from expired batches</div>
        </div>

        {/* Expiring Soon */}
        <div className="kpi-card" style={{ borderLeft: '4px solid #f59e0b' }}>
          <div className="kpi-card-header">
            <span className="kpi-card-title">Expiring in ≤ 90 Days</span>
            <div className="kpi-icon-bubble warning">
              <Clock size={20} />
            </div>
          </div>
          <div className="kpi-card-value" style={{ color: '#d97706' }}>{statistics.expiringSoon}</div>
          <div className="kpi-card-caption">{telemetry.soonUnits} units ($ {telemetry.soonValue.toFixed(2)}) prioritize dispensing</div>
        </div>

        {/* Safe Batches */}
        <div className="kpi-card" style={{ borderLeft: '4px solid #10b981' }}>
          <div className="kpi-card-header">
            <span className="kpi-card-title">Safe Batches (&gt; 90 Days)</span>
            <div className="kpi-icon-bubble success">
              <CheckCircle2 size={20} />
            </div>
          </div>
          <div className="kpi-card-value" style={{ color: '#059669' }}>
            {statistics.totalMedicines - statistics.expired - statistics.expiringSoon}
          </div>
          <div className="kpi-card-caption">Healthy shelf life remaining</div>
        </div>
      </div>

      {/* Tab Filter Navigation */}
      <div className="expiry-tabs">
        <button
          type="button"
          className={`expiry-tab-btn ${activeTab === 'ALL' ? 'active' : ''}`}
          onClick={() => setActiveTab('ALL')}
        >
          <span>Complete Expiry Schedule</span>
          <span style={{ 
            fontSize: '0.72rem', 
            padding: '0.15rem 0.5rem', 
            borderRadius: '9999px', 
            background: activeTab === 'ALL' ? '#e6f6f1' : '#f1f5f9',
            color: activeTab === 'ALL' ? '#075f4c' : '#64748b'
          }}>
            {medicines.length}
          </span>
        </button>

        <button
          type="button"
          className={`expiry-tab-btn ${activeTab === 'EXPIRED' ? 'active' : ''}`}
          onClick={() => setActiveTab('EXPIRED')}
        >
          <AlertOctagon size={16} color="#ef4444" />
          <span>Expired Batches Only</span>
          <span style={{ 
            fontSize: '0.72rem', 
            padding: '0.15rem 0.5rem', 
            borderRadius: '9999px', 
            background: '#fee2e2',
            color: '#991b1b',
            fontWeight: 700
          }}>
            {statistics.expired}
          </span>
        </button>

        <button
          type="button"
          className={`expiry-tab-btn ${activeTab === 'SOON' ? 'active' : ''}`}
          onClick={() => setActiveTab('SOON')}
        >
          <Clock size={16} color="#f59e0b" />
          <span>Expiring in ≤ 90 Days</span>
          <span style={{ 
            fontSize: '0.72rem', 
            padding: '0.15rem 0.5rem', 
            borderRadius: '9999px', 
            background: '#fef3c7',
            color: '#92400e',
            fontWeight: 700
          }}>
            {statistics.expiringSoon}
          </span>
        </button>

        <button
          type="button"
          className={`expiry-tab-btn ${activeTab === 'SAFE' ? 'active' : ''}`}
          onClick={() => setActiveTab('SAFE')}
        >
          <CheckCircle2 size={16} color="#10b981" />
          <span>Safe / Valid Batches</span>
        </button>
      </div>

      {/* Expiry Items List Table */}
      {tabMedicines.length === 0 ? (
        <div style={{
          background: '#ffffff',
          borderRadius: '16px',
          padding: '3.5rem 2rem',
          textAlign: 'center',
          border: '1px solid #e2e8f0',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)'
        }}>
          <ShieldCheck size={48} color="#10b981" style={{ marginBottom: '1rem' }} />
          <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.25rem', color: '#1e293b', margin: '0 0 0.5rem' }}>
            No Batches in This Category
          </h3>
          <p style={{ color: '#64748b', margin: 0, fontSize: '0.9rem' }}>
            There are currently no medicines matching the selected expiry tab filter.
          </p>
        </div>
      ) : (
        <div className="table-card-wrapper">
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Medicine</th>
                  <th>ID</th>
                  <th>Units In Stock</th>
                  <th>Batch Expiry Date</th>
                  <th>Days Remaining / Overdue</th>
                  <th>Status</th>
                  <th>Financial Exposure</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {tabMedicines.map(med => {
                  const status = getExpiryStatus(med);
                  const days = getDaysUntilExpiry(med.expiryDate);
                  const exposure = ((Number(med.quantity) || 0) * (Number(med.unitPrice) || 0)).toFixed(2);
                  const isExpired = status === 'expired';

                  return (
                    <tr 
                      key={med.id} 
                      style={isExpired && med.quantity > 0 ? { background: '#fff5f5' } : {}}
                    >
                      <td>
                        <div className="table-med-info">
                          <img
                            src={med.image || 'iimmgg/IMG_20260119_231802.jpg'}
                            alt={med.name}
                            className="table-med-thumb"
                            onError={(e) => { e.currentTarget.src = 'logo.svg'; }}
                          />
                          <div>
                            <strong style={{ color: isExpired ? '#991b1b' : '#0f172a', display: 'block' }}>
                              {med.name}
                            </strong>
                            <span style={{ fontSize: '0.78rem', color: '#64748b' }}>{med.category} &bull; {med.supplier}</span>
                          </div>
                        </div>
                      </td>

                      <td>
                        <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '0.82rem', color: '#075f4c' }}>
                          {med.id}
                        </span>
                      </td>

                      <td>
                        <strong style={{ fontSize: '1rem', color: med.quantity === 0 ? '#94a3b8' : '#0f172a' }}>
                          {med.quantity} units
                        </strong>
                      </td>

                      <td>
                        <strong style={{ color: isExpired ? '#dc2626' : '#334155' }}>
                          {med.expiryDate}
                        </strong>
                      </td>

                      <td>
                        {days < 0 ? (
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            padding: '0.25rem 0.65rem',
                            borderRadius: '9999px',
                            background: '#fee2e2',
                            color: '#991b1b',
                            fontWeight: 700,
                            fontSize: '0.78rem'
                          }}>
                            <AlertOctagon size={14} />
                            Overdue by {Math.abs(days)} days
                          </span>
                        ) : days <= 90 ? (
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            padding: '0.25rem 0.65rem',
                            borderRadius: '9999px',
                            background: '#fef3c7',
                            color: '#92400e',
                            fontWeight: 700,
                            fontSize: '0.78rem'
                          }}>
                            <Clock size={14} />
                            Expires in {days} days
                          </span>
                        ) : (
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            padding: '0.25rem 0.65rem',
                            borderRadius: '9999px',
                            background: '#d1fae5',
                            color: '#065f46',
                            fontWeight: 700,
                            fontSize: '0.78rem'
                          }}>
                            <CheckCircle2 size={14} />
                            {days} days remaining
                          </span>
                        )}
                      </td>

                      <td>
                        <span className={`status-pill ${status}`}>
                          {status === 'expired' && 'Expired'}
                          {status === 'expiring-soon' && 'Expiring Soon'}
                          {status === 'valid' && 'Safe'}
                        </span>
                      </td>

                      <td>
                        <span style={{ fontWeight: 700, color: isExpired && med.quantity > 0 ? '#dc2626' : '#334155' }}>
                          ${exposure}
                        </span>
                      </td>

                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                          {isExpired && med.quantity > 0 ? (
                            <button
                              type="button"
                              className="btn-danger-outline"
                              style={{ padding: '0.35rem 0.65rem', fontSize: '0.78rem' }}
                              onClick={() => handleSingleQuarantine(med)}
                              title="Zero out and quarantine this batch"
                            >
                              <Trash2 size={14} />
                              <span>Quarantine</span>
                            </button>
                          ) : (
                            <button
                              type="button"
                              className="btn-secondary-outline"
                              style={{ padding: '0.35rem 0.65rem', fontSize: '0.78rem' }}
                              onClick={() => setStockModal({ isOpen: true, medicine: med })}
                              title="Adjust Stock"
                            >
                              <ArrowUpDown size={14} />
                              <span>Adjust</span>
                            </button>
                          )}

                          <button
                            type="button"
                            className="btn-icon"
                            onClick={() => onOpenDetails(med)}
                            title="View Details"
                          >
                            <Eye size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
