import React, { useState } from 'react';
import { useInventory } from '../context/InventoryContext';
import { 
  Package, 
  DollarSign, 
  AlertTriangle, 
  AlertOctagon, 
  Clock, 
  TrendingUp, 
  ShieldCheck, 
  ArrowRight, 
  Activity, 
  Plus, 
  ArrowDownLeft, 
  ArrowUpRight,
  Layers,
  CheckCircle2
} from 'lucide-react';

export default function DashboardPage({ setActivePage, onOpenAddMedicine, onOpenDetails }) {
  const { 
    medicines, 
    transactions, 
    statistics, 
    quarantineAllExpired, 
    getStockStatus, 
    getExpiryStatus 
  } = useInventory();

  const [txnFilter, setTxnFilter] = useState('ALL'); // 'ALL' | 'IN' | 'OUT'

  // Proportions for stock health bar
  const totalMeds = statistics.totalMedicines || 1;
  const inStockPct = Math.round((statistics.inStock / totalMeds) * 100);
  const lowStockPct = Math.round((statistics.lowStock / totalMeds) * 100);
  const outStockPct = 100 - inStockPct - lowStockPct;

  // Filtered transactions
  const filteredTransactions = transactions.filter(t => {
    if (txnFilter === 'IN') return t.type === 'IN';
    if (txnFilter === 'OUT') return t.type === 'OUT';
    return true;
  }).slice(0, 8);

  // Top 5 categories by SKU count
  const topCategories = Object.entries(statistics.categoryMap || {})
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 6);

  return (
    <div>
      {/* Hero Strip */}
      <section className="react-hero">
        <div className="hero-inner">
          <div>
            <div className="hero-pill-badge">
              <ShieldCheck size={16} />
              <span>Real-Time Clinical Telemetry &bull; Version 2.0</span>
            </div>
            <h1 className="hero-title">
              Precision Pharmacy <br />
              <span className="gradient-text">Inventory Management</span>
            </h1>
            <p className="hero-subtitle">
              Intelligent medication safety, stockout prevention, and automated expiry tracking. 
              Safeguarding patient supply chains with instantaneous telemetry.
            </p>
            <div className="hero-actions">
              <button 
                type="button" 
                className="btn-accent-mint"
                onClick={() => setActivePage('inventory')}
              >
                <Package size={18} />
                <span>Open Inventory Manager</span>
              </button>
              <button 
                type="button" 
                className="btn-secondary-outline"
                style={{ background: 'rgba(255, 255, 255, 0.1)', color: '#ffffff', borderColor: 'rgba(255, 255, 255, 0.25)' }}
                onClick={() => setActivePage('expiry')}
              >
                <Clock size={18} />
                <span>Review Expiry Radar</span>
              </button>
              <button 
                type="button" 
                className="btn-secondary-outline"
                style={{ background: 'rgba(255, 255, 255, 0.1)', color: '#ffffff', borderColor: 'rgba(255, 255, 255, 0.25)' }}
                onClick={onOpenAddMedicine}
              >
                <Plus size={18} />
                <span>New Medicine</span>
              </button>
            </div>
          </div>

          {/* Quick Hero Stat Cards */}
          <div className="hero-quick-stats">
            <div className="hero-stat-card">
              <div className="hero-stat-number">{statistics.totalMedicines}</div>
              <div className="hero-stat-label">Active SKUs</div>
            </div>
            <div className="hero-stat-card">
              <div className="hero-stat-number">{statistics.totalUnits.toLocaleString()}</div>
              <div className="hero-stat-label">Units in Dispensary</div>
            </div>
            <div className="hero-stat-card">
              <div className="hero-stat-number">${statistics.totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
              <div className="hero-stat-label">Stock Valuation</div>
            </div>
            <div className="hero-stat-card">
              <div className="hero-stat-number" style={{ color: statistics.expired > 0 ? '#f87171' : '#34d399' }}>
                {statistics.expired}
              </div>
              <div className="hero-stat-label">Expired Batches</div>
            </div>
          </div>
        </div>
      </section>

      <div className="page-container">
        {/* Priority Action Banners */}
        <div className="priority-banners-grid">
          {statistics.expired > 0 && (
            <div className="priority-banner danger">
              <div className="priority-content">
                <AlertOctagon size={28} />
                <div>
                  <div className="priority-title">Urgent: {statistics.expired} Expired Batches Detected</div>
                  <div className="priority-text">Expired pharmaceuticals must be quarantined and removed from patient dispensing shelves.</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <button 
                  type="button" 
                  className="btn-danger-outline"
                  onClick={quarantineAllExpired}
                  style={{ background: '#dc2626', color: '#ffffff', borderColor: '#dc2626' }}
                >
                  Quarantine All Expired
                </button>
              </div>
            </div>
          )}

          {statistics.lowStock > 0 && (
            <div className="priority-banner warning">
              <div className="priority-content">
                <AlertTriangle size={28} />
                <div>
                  <div className="priority-title">Replenishment Alert: {statistics.lowStock} Low Stock Items</div>
                  <div className="priority-text">Stock is at or below minimum clinical threshold. Reorder before stockouts occur.</div>
                </div>
              </div>
              <button 
                type="button" 
                className="btn-secondary-outline"
                style={{ borderColor: '#d97706', color: '#92400e', background: '#ffffff' }}
                onClick={() => setActivePage('inventory')}
              >
                Inspect Low Stock
              </button>
            </div>
          )}

          {statistics.expired === 0 && statistics.lowStock === 0 && (
            <div className="priority-banner success">
              <div className="priority-content">
                <CheckCircle2 size={28} />
                <div>
                  <div className="priority-title">Dispensary Health Optimal</div>
                  <div className="priority-text">Zero expired batches detected and all medications maintain safe operational buffer levels.</div>
                </div>
              </div>
              <button 
                type="button" 
                className="btn-secondary-outline"
                onClick={() => setActivePage('inventory')}
              >
                Browse Inventory
              </button>
            </div>
          )}
        </div>

        {/* Dynamic KPI Stat Cards */}
        <div className="kpi-cards-grid">
          {/* Total SKUs */}
          <div className="kpi-card" onClick={() => setActivePage('inventory')} style={{ cursor: 'pointer' }}>
            <div className="kpi-card-header">
              <span className="kpi-card-title">Total Medicines</span>
              <div className="kpi-icon-bubble primary">
                <Package size={20} />
              </div>
            </div>
            <div className="kpi-card-value">{statistics.totalMedicines}</div>
            <div className="kpi-card-caption">Spanning {statistics.categoriesCount} therapeutic categories</div>
          </div>

          {/* Total Units in Stock */}
          <div className="kpi-card">
            <div className="kpi-card-header">
              <span className="kpi-card-title">Total Stock Units</span>
              <div className="kpi-icon-bubble info">
                <Layers size={20} />
              </div>
            </div>
            <div className="kpi-card-value">{statistics.totalUnits.toLocaleString()}</div>
            <div className="kpi-card-caption">Physical doses, bottles &amp; blister packs</div>
          </div>

          {/* Total Inventory Valuation */}
          <div className="kpi-card" onClick={() => setActivePage('analytics')} style={{ cursor: 'pointer' }}>
            <div className="kpi-card-header">
              <span className="kpi-card-title">Inventory Valuation</span>
              <div className="kpi-icon-bubble success">
                <DollarSign size={20} />
              </div>
            </div>
            <div className="kpi-card-value">
              ${statistics.totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="kpi-card-caption">Total acquisition / retail portfolio value</div>
          </div>

          {/* Low Stock Items */}
          <div className="kpi-card" onClick={() => setActivePage('inventory')} style={{ cursor: 'pointer' }}>
            <div className="kpi-card-header">
              <span className="kpi-card-title">Low Stock Alert</span>
              <div className="kpi-icon-bubble warning">
                <AlertTriangle size={20} />
              </div>
            </div>
            <div className="kpi-card-value" style={{ color: statistics.lowStock > 0 ? '#d97706' : '#0f172a' }}>
              {statistics.lowStock}
            </div>
            <div className="kpi-card-caption">At or below safety threshold level</div>
          </div>

          {/* Expired Batches */}
          <div className="kpi-card" onClick={() => setActivePage('expiry')} style={{ cursor: 'pointer' }}>
            <div className="kpi-card-header">
              <span className="kpi-card-title">Expired Batches</span>
              <div className="kpi-icon-bubble danger">
                <AlertOctagon size={20} />
              </div>
            </div>
            <div className="kpi-card-value" style={{ color: statistics.expired > 0 ? '#dc2626' : '#0f172a' }}>
              {statistics.expired}
            </div>
            <div className="kpi-card-caption">Batches requiring quarantine disposal</div>
          </div>

          {/* Expiring Soon */}
          <div className="kpi-card" onClick={() => setActivePage('expiry')} style={{ cursor: 'pointer' }}>
            <div className="kpi-card-header">
              <span className="kpi-card-title">Expiring Soon</span>
              <div className="kpi-icon-bubble warning">
                <Clock size={20} />
              </div>
            </div>
            <div className="kpi-card-value" style={{ color: statistics.expiringSoon > 0 ? '#d97706' : '#0f172a' }}>
              {statistics.expiringSoon}
            </div>
            <div className="kpi-card-caption">Batches expiring within 90 days</div>
          </div>
        </div>

        {/* Stock Health Progress Meter */}
        <div className="health-meter-card">
          <div className="health-meter-header">
            <h3 className="health-meter-title">
              <Activity size={20} color="#075f4c" />
              Stock Availability &amp; Safety Distribution
            </h3>
            <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
              {statistics.inStock} of {statistics.totalMedicines} items fully safe
            </span>
          </div>

          <div className="health-segmented-bar">
            <div className="health-segment in-stock" style={{ width: `${inStockPct}%` }} title={`Safe In-Stock: ${inStockPct}%`} />
            <div className="health-segment low-stock" style={{ width: `${lowStockPct}%` }} title={`Low Stock: ${lowStockPct}%`} />
            <div className="health-segment out-stock" style={{ width: `${outStockPct}%` }} title={`Out of Stock: ${outStockPct}%`} />
          </div>

          <div className="health-legend">
            <div className="health-legend-item">
              <div className="legend-dot in-stock" />
              <span>Optimal Stock ({statistics.inStock} items &bull; {inStockPct}%)</span>
            </div>
            <div className="health-legend-item">
              <div className="legend-dot low-stock" />
              <span>Low Stock Threshold ({statistics.lowStock} items &bull; {lowStockPct}%)</span>
            </div>
            <div className="health-legend-item">
              <div className="legend-dot out-stock" />
              <span>Depleted / 0 Units ({statistics.outOfStock} items &bull; {outStockPct}%)</span>
            </div>
          </div>
        </div>

        {/* Two-Column Layout: Category Distribution & Live Movements */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
          {/* Category Distribution Glance */}
          <div className="analytics-card">
            <div className="analytics-card-title">
              <span>Therapeutic Categories Breakdown</span>
              <button 
                type="button" 
                className="btn-secondary-outline"
                style={{ fontSize: '0.8rem', padding: '0.35rem 0.65rem' }}
                onClick={() => setActivePage('analytics')}
              >
                <span>Full Report</span>
                <ArrowRight size={14} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {topCategories.map(([catName, data]) => {
                const pct = Math.round((data.count / statistics.totalMedicines) * 100);
                return (
                  <div key={catName} className="cat-progress-item">
                    <div className="cat-progress-header">
                      <span className="cat-progress-name">{catName}</span>
                      <span className="cat-progress-val">
                        <strong>{data.count} SKUs</strong> &bull; {data.units} units (${data.value.toFixed(0)})
                      </span>
                    </div>
                    <div className="cat-progress-bar">
                      <div className="cat-progress-fill" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Stock Movement History */}
          <div className="analytics-card">
            <div className="analytics-card-title">
              <span>Recent Stock Movements</span>
              <div style={{ display: 'flex', gap: '0.3rem' }}>
                {['ALL', 'IN', 'OUT'].map(type => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setTxnFilter(type)}
                    style={{
                      border: 'none',
                      background: txnFilter === type ? '#075f4c' : '#f1f5f9',
                      color: txnFilter === type ? '#ffffff' : '#64748b',
                      padding: '0.3rem 0.6rem',
                      borderRadius: '6px',
                      fontSize: '0.76rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {filteredTransactions.length === 0 ? (
              <p style={{ color: '#94a3b8', fontStyle: 'italic', padding: '1rem 0' }}>
                No stock transactions logged yet.
              </p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#64748b', textAlign: 'left' }}>
                      <th style={{ padding: '0.6rem 0.5rem' }}>Type</th>
                      <th style={{ padding: '0.6rem 0.5rem' }}>Medicine</th>
                      <th style={{ padding: '0.6rem 0.5rem' }}>Quantity</th>
                      <th style={{ padding: '0.6rem 0.5rem' }}>Reason</th>
                      <th style={{ padding: '0.6rem 0.5rem' }}>Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTransactions.map(t => (
                      <tr key={t.id} style={{ borderBottom: '1px solid #f8fafc' }}>
                        <td style={{ padding: '0.65rem 0.5rem' }}>
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                            padding: '0.2rem 0.5rem',
                            borderRadius: '4px',
                            fontWeight: 700,
                            fontSize: '0.72rem',
                            background: t.type === 'IN' ? '#d1fae5' : '#fee2e2',
                            color: t.type === 'IN' ? '#065f46' : '#991b1b'
                          }}>
                            {t.type === 'IN' ? <ArrowDownLeft size={13} /> : <ArrowUpRight size={13} />}
                            {t.type}
                          </span>
                        </td>
                        <td style={{ padding: '0.65rem 0.5rem', fontWeight: 600, color: '#1e293b' }}>
                          {t.medicineName}
                        </td>
                        <td style={{ padding: '0.65rem 0.5rem', fontWeight: 700 }}>
                          {t.type === 'IN' ? `+${t.delta}` : `-${t.delta}`}
                        </td>
                        <td style={{ padding: '0.65rem 0.5rem', color: '#64748b' }}>
                          {t.reason}
                        </td>
                        <td style={{ padding: '0.65rem 0.5rem', color: '#94a3b8', whiteSpace: 'nowrap' }}>
                          {new Date(t.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
