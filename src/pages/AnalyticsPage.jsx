import React, { useMemo } from 'react';
import { useInventory } from '../context/InventoryContext';
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  Package, 
  AlertTriangle, 
  ArrowDownLeft, 
  ArrowUpRight, 
  Download, 
  Layers,
  Printer
} from 'lucide-react';

export default function AnalyticsPage({ onOpenDetails, onAdjustStock }) {
  const { medicines, transactions, statistics, showToast } = useInventory();

  // Category breakdown calculation
  const categoryAnalytics = useMemo(() => {
    const map = {};
    medicines.forEach(m => {
      const cat = m.category || 'Other';
      const qty = Number(m.quantity) || 0;
      const price = Number(m.unitPrice) || 0;
      const val = qty * price;

      if (!map[cat]) {
        map[cat] = {
          category: cat,
          skus: 0,
          totalUnits: 0,
          totalValue: 0,
          inStock: 0,
          lowStock: 0,
          outStock: 0
        };
      }

      map[cat].skus += 1;
      map[cat].totalUnits += qty;
      map[cat].totalValue += val;

      if (qty === 0) map[cat].outStock += 1;
      else if (qty <= (m.minStock || 10)) map[cat].lowStock += 1;
      else map[cat].inStock += 1;
    });

    return Object.values(map).sort((a, b) => b.totalValue - a.totalValue);
  }, [medicines]);

  // Top 5 Highest Valuation Medicines
  const topValuedMeds = useMemo(() => {
    return [...medicines]
      .map(m => ({
        ...m,
        valuation: (Number(m.quantity) || 0) * (Number(m.unitPrice) || 0)
      }))
      .sort((a, b) => b.valuation - a.valuation)
      .slice(0, 5);
  }, [medicines]);

  // Critical Low Stock Reorder List
  const reorderList = useMemo(() => {
    return medicines
      .filter(m => (Number(m.quantity) || 0) <= (Number(m.minStock) || 10))
      .map(m => {
        const targetSafe = (Number(m.minStock) || 10) * 3;
        const deficit = Math.max(0, targetSafe - (Number(m.quantity) || 0));
        return {
          ...m,
          targetSafe,
          deficit,
          orderCost: deficit * (Number(m.unitPrice) || 0)
        };
      })
      .sort((a, b) => b.deficit - a.deficit);
  }, [medicines]);

  // Stock Movement Totals
  const movementStats = useMemo(() => {
    let inboundUnits = 0;
    let outboundUnits = 0;

    transactions.forEach(t => {
      const d = Number(t.delta) || 0;
      if (t.type === 'IN') inboundUnits += d;
      if (t.type === 'OUT') outboundUnits += d;
    });

    return {
      inboundUnits,
      outboundUnits,
      totalTxns: transactions.length
    };
  }, [transactions]);

  const handlePrint = () => {
    window.print();
  };

  const exportAnalyticsCSV = () => {
    const headers = ['Category', 'SKUs', 'TotalUnits', 'TotalValue', 'AverageUnitPrice', 'InStock', 'LowStock', 'OutStock'];
    const rows = categoryAnalytics.map(c => [
      `"${c.category}"`,
      c.skus,
      c.totalUnits,
      c.totalValue.toFixed(2),
      (c.totalValue / Math.max(c.totalUnits, 1)).toFixed(2),
      c.inStock,
      c.lowStock,
      c.outStock
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `PharmaCare_Category_Analytics_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Category Analytics exported to CSV.', 'success');
  };

  return (
    <div className="page-container">
      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.75rem' }}>
        <div>
          <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.85rem', fontWeight: 800, margin: '0 0 0.25rem', color: '#0f172a' }}>
            Pharmacy Analytics &amp; Clinical Reports
          </h2>
          <p style={{ margin: 0, color: '#64748b', fontSize: '0.92rem' }}>
            Portfolio valuation, category asset distribution, reorder calculations, and logistics throughput
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button type="button" className="btn-secondary-outline" onClick={handlePrint}>
            <Printer size={16} />
            <span>Print Report</span>
          </button>
          <button type="button" className="btn-primary-emerald" onClick={exportAnalyticsCSV}>
            <Download size={16} />
            <span>Export Analytics CSV</span>
          </button>
        </div>
      </div>

      {/* Top Level Metric Summary Cards */}
      <div className="kpi-cards-grid" style={{ marginBottom: '2rem' }}>
        <div className="kpi-card">
          <div className="kpi-card-header">
            <span className="kpi-card-title">Portfolio Valuation</span>
            <div className="kpi-icon-bubble success">
              <DollarSign size={20} />
            </div>
          </div>
          <div className="kpi-card-value">${statistics.totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          <div className="kpi-card-caption">Across {statistics.totalUnits.toLocaleString()} physical doses</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-card-header">
            <span className="kpi-card-title">Total Inbound Units</span>
            <div className="kpi-icon-bubble success">
              <ArrowDownLeft size={20} />
            </div>
          </div>
          <div className="kpi-card-value" style={{ color: '#059669' }}>
            +{movementStats.inboundUnits}
          </div>
          <div className="kpi-card-caption">Restocked across audit timeline</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-card-header">
            <span className="kpi-card-title">Total Outbound Units</span>
            <div className="kpi-icon-bubble danger">
              <ArrowUpRight size={20} />
            </div>
          </div>
          <div className="kpi-card-value" style={{ color: '#991b1b' }}>
            -{movementStats.outboundUnits}
          </div>
          <div className="kpi-card-caption">Dispensed or written off</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-card-header">
            <span className="kpi-card-title">Stock Deficit Count</span>
            <div className="kpi-icon-bubble warning">
              <AlertTriangle size={20} />
            </div>
          </div>
          <div className="kpi-card-value" style={{ color: reorderList.length > 0 ? '#d97706' : '#059669' }}>
            {reorderList.length}
          </div>
          <div className="kpi-card-caption">SKUs requiring immediate reorder</div>
        </div>
      </div>

      {/* Two-Column Layout: Top Valued Medicines & Stock Reorder List */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        {/* Top 5 Valued Medicines */}
        <div className="analytics-card">
          <h3 className="analytics-card-title">
            <span>Top 5 Highest Valuation Medicines</span>
            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>By SKU Total Capital</span>
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {topValuedMeds.map((med, index) => (
              <div 
                key={med.id}
                onClick={() => onOpenDetails(med)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.75rem',
                  borderRadius: '10px',
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  cursor: 'pointer',
                  transition: 'background 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '9999px',
                    background: '#075f4c',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '0.8rem'
                  }}>
                    #{index + 1}
                  </div>
                  <div>
                    <strong style={{ color: '#0f172a', fontSize: '0.92rem', display: 'block' }}>{med.name}</strong>
                    <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                      {med.quantity} units &bull; ${med.unitPrice.toFixed(2)}/unit
                    </span>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.15rem', fontWeight: 800, color: '#075f4c' }}>
                    ${med.valuation.toFixed(2)}
                  </div>
                  <span style={{ fontSize: '0.74rem', color: '#64748b' }}>Portfolio Share</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Priority Reorder Action List */}
        <div className="analytics-card">
          <h3 className="analytics-card-title">
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertTriangle size={18} color="#d97706" />
              Low Stock Reorder Recommendations
            </span>
            <span style={{ fontSize: '0.8rem', color: '#d97706', fontWeight: 700 }}>
              {reorderList.length} items flagged
            </span>
          </h3>

          {reorderList.length === 0 ? (
            <p style={{ color: '#059669', fontStyle: 'italic', padding: '1rem 0' }}>
              All medications currently meet or exceed safe operational inventory thresholds.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '360px', overflowY: 'auto' }}>
              {reorderList.map(med => (
                <div 
                  key={med.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem',
                    borderRadius: '10px',
                    background: med.quantity === 0 ? '#fef2f2' : '#fffbeb',
                    border: `1px solid ${med.quantity === 0 ? '#fecaca' : '#fde68a'}`
                  }}
                >
                  <div>
                    <strong style={{ color: med.quantity === 0 ? '#991b1b' : '#92400e', fontSize: '0.9rem', display: 'block' }}>
                      {med.name}
                    </strong>
                    <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                      In Stock: <strong>{med.quantity}</strong> / Min: {med.minStock} &bull; Deficit: <strong>{med.deficit} units</strong>
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0f172a' }}>
                        ${med.orderCost.toFixed(2)}
                      </div>
                      <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Estimated Cost</span>
                    </div>

                    <button
                      type="button"
                      className="btn-accent-mint"
                      style={{ padding: '0.35rem 0.65rem', fontSize: '0.78rem' }}
                      onClick={() => onAdjustStock(med)}
                    >
                      Reorder
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Complete Therapeutic Category Breakdown Table */}
      <div className="table-card-wrapper">
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #e2e8f0' }}>
          <h3 style={{ margin: 0, fontFamily: 'Outfit, sans-serif', fontSize: '1.15rem', color: '#0f172a' }}>
            Complete Category Breakdown &amp; Financial Valuation
          </h3>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>SKUs</th>
                <th>Total Units</th>
                <th>Category Valuation</th>
                <th>Avg Unit Price</th>
                <th>In Stock</th>
                <th>Low Stock</th>
                <th>Depleted</th>
              </tr>
            </thead>
            <tbody>
              {categoryAnalytics.map(cat => (
                <tr key={cat.category}>
                  <td>
                    <strong style={{ color: '#075f4c', fontSize: '0.92rem' }}>{cat.category}</strong>
                  </td>
                  <td>
                    <span style={{ fontWeight: 600 }}>{cat.skus}</span>
                  </td>
                  <td>
                    <strong style={{ color: '#0f172a' }}>{cat.totalUnits.toLocaleString()}</strong>
                  </td>
                  <td>
                    <strong style={{ color: '#0f172a' }}>
                      ${cat.totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </strong>
                  </td>
                  <td>
                    <span style={{ color: '#64748b' }}>
                      ${(cat.totalValue / Math.max(cat.totalUnits, 1)).toFixed(2)}
                    </span>
                  </td>
                  <td>
                    <span className="status-pill in-stock">{cat.inStock}</span>
                  </td>
                  <td>
                    {cat.lowStock > 0 ? (
                      <span className="status-pill low-stock">{cat.lowStock}</span>
                    ) : (
                      <span style={{ color: '#94a3b8' }}>0</span>
                    )}
                  </td>
                  <td>
                    {cat.outStock > 0 ? (
                      <span className="status-pill out-stock">{cat.outStock}</span>
                    ) : (
                      <span style={{ color: '#94a3b8' }}>0</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
