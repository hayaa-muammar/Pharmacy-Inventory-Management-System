import React, { useState, useMemo } from 'react';
import { useInventory } from '../context/InventoryContext';
import { 
  Search, 
  Filter, 
  LayoutGrid, 
  List, 
  Plus, 
  Download, 
  RotateCcw, 
  ArrowUpDown, 
  Edit3, 
  Trash2, 
  Eye, 
  AlertTriangle, 
  AlertOctagon, 
  CheckCircle2, 
  Clock, 
  X,
  Package
} from 'lucide-react';

export default function InventoryPage({ 
  onOpenAddMedicine, 
  onOpenEditMedicine, 
  onOpenDetails 
}) {
  const { 
    medicines, 
    deleteMedicine, 
    setStockModal, 
    getDaysUntilExpiry, 
    getExpiryStatus, 
    getStockStatus,
    showToast 
  } = useInventory();

  // Search & Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [stockFilter, setStockFilter] = useState('ALL');
  const [expiryFilter, setExpiryFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('name-asc');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'

  // Extract unique categories dynamically
  const categories = useMemo(() => {
    const set = new Set();
    medicines.forEach(m => {
      if (m.category) set.add(m.category);
    });
    return Array.from(set).sort();
  }, [medicines]);

  // Filtering and Sorting logic
  const filteredMedicines = useMemo(() => {
    return medicines.filter(m => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = (m.name || '').toLowerCase().includes(q);
        const matchesId = (m.id || '').toLowerCase().includes(q);
        const matchesCat = (m.category || '').toLowerCase().includes(q);
        const matchesSup = (m.supplier || '').toLowerCase().includes(q);
        const matchesDesc = (m.description || '').toLowerCase().includes(q);
        if (!matchesName && !matchesId && !matchesCat && !matchesSup && !matchesDesc) {
          return false;
        }
      }

      // Category
      if (selectedCategory !== 'ALL' && m.category !== selectedCategory) {
        return false;
      }

      // Stock Status
      if (stockFilter !== 'ALL') {
        const s = getStockStatus(m);
        if (stockFilter === 'in-stock' && s !== 'in-stock') return false;
        if (stockFilter === 'low-stock' && s !== 'low-stock') return false;
        if (stockFilter === 'out-stock' && s !== 'out-stock') return false;
      }

      // Expiry Status
      if (expiryFilter !== 'ALL') {
        const e = getExpiryStatus(m);
        if (expiryFilter === 'valid' && e !== 'valid') return false;
        if (expiryFilter === 'expiring-soon' && e !== 'expiring-soon') return false;
        if (expiryFilter === 'expired' && e !== 'expired') return false;
      }

      return true;
    }).sort((a, b) => {
      switch (sortBy) {
        case 'name-asc':
          return (a.name || '').localeCompare(b.name || '');
        case 'name-desc':
          return (b.name || '').localeCompare(a.name || '');
        case 'qty-asc':
          return (Number(a.quantity) || 0) - (Number(b.quantity) || 0);
        case 'qty-desc':
          return (Number(b.quantity) || 0) - (Number(a.quantity) || 0);
        case 'price-asc':
          return (Number(a.unitPrice) || 0) - (Number(b.unitPrice) || 0);
        case 'price-desc':
          return (Number(b.unitPrice) || 0) - (Number(a.unitPrice) || 0);
        case 'expiry-asc':
          return (a.expiryDate || '').localeCompare(b.expiryDate || '');
        case 'expiry-desc':
          return (b.expiryDate || '').localeCompare(a.expiryDate || '');
        default:
          return 0;
      }
    });
  }, [medicines, searchQuery, selectedCategory, stockFilter, expiryFilter, sortBy, getStockStatus, getExpiryStatus]);

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('ALL');
    setStockFilter('ALL');
    setExpiryFilter('ALL');
    setSortBy('name-asc');
  };

  const isFiltered = searchQuery || selectedCategory !== 'ALL' || stockFilter !== 'ALL' || expiryFilter !== 'ALL' || sortBy !== 'name-asc';

  // Export to CSV
  const exportToCSV = () => {
    if (filteredMedicines.length === 0) {
      showToast('No medicine records to export.', 'warning');
      return;
    }

    const headers = ['ID', 'Name', 'Category', 'Quantity', 'MinStock', 'UnitPrice', 'Valuation', 'ExpiryDate', 'Supplier', 'Description'];
    const rows = filteredMedicines.map(m => [
      `"${m.id}"`,
      `"${(m.name || '').replace(/"/g, '""')}"`,
      `"${(m.category || '').replace(/"/g, '""')}"`,
      m.quantity,
      m.minStock,
      m.unitPrice,
      ((Number(m.quantity) || 0) * (Number(m.unitPrice) || 0)).toFixed(2),
      `"${m.expiryDate}"`,
      `"${(m.supplier || '').replace(/"/g, '""')}"`,
      `"${(m.description || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `PharmaCare_Inventory_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Exported ${filteredMedicines.length} medicine records to CSV.`, 'success');
  };

  return (
    <div className="page-container">
      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.75rem' }}>
        <div>
          <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.85rem', fontWeight: 800, margin: '0 0 0.25rem', color: '#0f172a' }}>
            Medicine Inventory Manager
          </h2>
          <p style={{ margin: 0, color: '#64748b', fontSize: '0.92rem' }}>
            Real-time catalog monitoring, stock dispensation, and batch safety management
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button type="button" className="btn-secondary-outline" onClick={exportToCSV} title="Export filtered records to CSV spreadsheet">
            <Download size={16} />
            <span>Export CSV</span>
          </button>
          <button type="button" className="btn-accent-mint" onClick={onOpenAddMedicine}>
            <Plus size={18} />
            <span>Add Medicine</span>
          </button>
        </div>
      </div>

      {/* Control & Filter Bar */}
      <div className="inventory-controls">
        <div className="controls-row-top">
          {/* Search Box */}
          <div className="search-box-wrapper">
            <Search size={18} className="search-icon-inside" />
            <input
              type="text"
              placeholder="Search by name, ID, category, or supplier..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button 
                type="button" 
                className="search-clear-btn" 
                onClick={() => setSearchQuery('')}
                title="Clear search"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* View Mode Toggle */}
          <div className="controls-view-actions">
            <div className="view-mode-toggle">
              <button
                type="button"
                className={`view-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
                title="Interactive Card Grid View"
              >
                <LayoutGrid size={16} />
                <span>Cards</span>
              </button>
              <button
                type="button"
                className={`view-toggle-btn ${viewMode === 'table' ? 'active' : ''}`}
                onClick={() => setViewMode('table')}
                title="High-Density Table View"
              >
                <List size={16} />
                <span>Table</span>
              </button>
            </div>
          </div>
        </div>

        {/* Filter Dropdowns Row */}
        <div className="controls-row-filters">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#64748b', fontSize: '0.84rem', fontWeight: 600 }}>
            <Filter size={15} />
            <span>Filters:</span>
          </div>

          {/* Category Filter */}
          <select 
            className="filter-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="ALL">All Categories ({categories.length})</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          {/* Stock Status Filter */}
          <select 
            className="filter-select"
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
          >
            <option value="ALL">Stock: All Levels</option>
            <option value="in-stock">In Stock (Safe)</option>
            <option value="low-stock">Low Stock (≤ Threshold)</option>
            <option value="out-stock">Out of Stock (0 Units)</option>
          </select>

          {/* Expiry Status Filter */}
          <select 
            className="filter-select"
            value={expiryFilter}
            onChange={(e) => setExpiryFilter(e.target.value)}
          >
            <option value="ALL">Expiry: All Batches</option>
            <option value="valid">Safe / Valid (&gt; 90d)</option>
            <option value="expiring-soon">Expiring Soon (&le; 90d)</option>
            <option value="expired">Expired Batches</option>
          </select>

          {/* Sort By */}
          <select 
            className="filter-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="name-asc">Name (A &rarr; Z)</option>
            <option value="name-desc">Name (Z &rarr; A)</option>
            <option value="qty-asc">Stock (Low &rarr; High)</option>
            <option value="qty-desc">Stock (High &rarr; Low)</option>
            <option value="price-asc">Price (Low &rarr; High)</option>
            <option value="price-desc">Price (High &rarr; Low)</option>
            <option value="expiry-asc">Expiry (Soonest first)</option>
            <option value="expiry-desc">Expiry (Furthest first)</option>
          </select>

          {/* Reset Filters button */}
          {isFiltered && (
            <button 
              type="button" 
              className="btn-secondary-outline"
              onClick={resetFilters}
              style={{ padding: '0.45rem 0.75rem', fontSize: '0.8rem', color: '#dc2626', borderColor: '#fca5a5' }}
            >
              <RotateCcw size={14} />
              <span>Reset Filters</span>
            </button>
          )}

          <div style={{ marginLeft: 'auto', fontSize: '0.86rem', color: '#64748b', fontWeight: 600 }}>
            Showing <strong>{filteredMedicines.length}</strong> of {medicines.length} medicines
          </div>
        </div>
      </div>

      {/* Main Content: Grid vs Table */}
      {filteredMedicines.length === 0 ? (
        <div style={{
          background: '#ffffff',
          borderRadius: '16px',
          padding: '4rem 2rem',
          textAlign: 'center',
          border: '1px solid #e2e8f0',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)'
        }}>
          <Package size={52} color="#94a3b8" style={{ marginBottom: '1rem' }} />
          <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.35rem', color: '#1e293b', margin: '0 0 0.5rem' }}>
            No Matching Medicines Found
          </h3>
          <p style={{ color: '#64748b', maxWidth: '420px', margin: '0 auto 1.5rem', fontSize: '0.92rem' }}>
            No pharmaceutical records match your current search query and active filters.
          </p>
          <button type="button" className="btn-primary-emerald" onClick={resetFilters}>
            <RotateCcw size={16} />
            <span>Clear All Filters</span>
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        /* Card Grid View */
        <div className="medicine-cards-grid">
          {filteredMedicines.map(med => {
            const stockStatus = getStockStatus(med);
            const expiryStatus = getExpiryStatus(med);
            const days = getDaysUntilExpiry(med.expiryDate);
            const maxUnits = Math.max(med.minStock * 2, 20);
            const percent = Math.min(100, Math.round(((med.quantity || 0) / maxUnits) * 100));

            return (
              <div key={med.id} className="med-card">
                {/* Photo & Overlays */}
                <div className="med-card-img-wrap">
                  {med.image ? (
                    <img 
                      src={med.image} 
                      alt={med.name} 
                      className="med-card-img"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        if (e.currentTarget.nextElementSibling) {
                          e.currentTarget.nextElementSibling.style.display = 'flex';
                        }
                      }} 
                    />
                  ) : null}
                  <div className="med-card-img-fallback" style={{ display: med.image ? 'none' : 'flex' }}>
                    <Package size={36} />
                    <span>{med.name}</span>
                  </div>

                  <span className="med-card-badge-top-left">{med.id}</span>

                  <div className="med-card-badge-top-right">
                    <span className={`status-pill ${stockStatus}`}>
                      {stockStatus === 'in-stock' && 'In Stock'}
                      {stockStatus === 'low-stock' && 'Low Stock'}
                      {stockStatus === 'out-stock' && 'Out of Stock'}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="med-card-body">
                  <div className="med-card-category">{med.category}</div>
                  <h3 className="med-card-name" title={med.name}>{med.name}</h3>
                  <div className="med-card-supplier">{med.supplier || 'Standard Distributor'}</div>

                  {/* Stock Level Meta */}
                  <div className="med-stock-meta">
                    <div className="med-stock-meta-row">
                      <span style={{ color: '#64748b' }}>Stock Quantity:</span>
                      <span className={`med-stock-qty ${stockStatus}`}>
                        {med.quantity} <span style={{ fontSize: '0.78rem', color: '#64748b' }}>units</span>
                      </span>
                    </div>

                    <div className="med-stock-bar-wrap">
                      <div className={`med-stock-bar-fill ${stockStatus}`} style={{ width: `${percent}%` }} />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.76rem', color: '#94a3b8', marginTop: '0.35rem' }}>
                      <span>Min Threshold: {med.minStock}</span>
                      <span>Safe Buffer: {percent}%</span>
                    </div>
                  </div>

                  {/* Pricing and Expiry row */}
                  <div className="med-card-details-row">
                    <div>
                      <span style={{ color: '#64748b', fontSize: '0.76rem' }}>Price: </span>
                      <strong className="med-card-price">${Number(med.unitPrice || 0).toFixed(2)}</strong>
                    </div>

                    <div>
                      <span className={`status-pill ${expiryStatus}`}>
                        {expiryStatus === 'expired' ? (
                          <>
                            <AlertOctagon size={12} />
                            <span>Expired ({Math.abs(days)}d)</span>
                          </>
                        ) : expiryStatus === 'expiring-soon' ? (
                          <>
                            <Clock size={12} />
                            <span>Exp in {days}d</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle2 size={12} />
                            <span>Safe ({days}d)</span>
                          </>
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="med-card-actions">
                    <button
                      type="button"
                      className="btn-secondary-outline"
                      style={{ flex: 1, padding: '0.45rem 0.65rem', fontSize: '0.82rem' }}
                      onClick={() => setStockModal({ isOpen: true, medicine: med })}
                      title="Stock In or Stock Out"
                    >
                      <ArrowUpDown size={15} />
                      <span>Adjust Stock</span>
                    </button>

                    <button
                      type="button"
                      className="btn-icon"
                      onClick={() => onOpenDetails(med)}
                      title="View Details"
                    >
                      <Eye size={16} />
                    </button>

                    <button
                      type="button"
                      className="btn-icon"
                      onClick={() => onOpenEditMedicine(med)}
                      title="Edit Record"
                    >
                      <Edit3 size={16} />
                    </button>

                    <button
                      type="button"
                      className="btn-icon danger"
                      onClick={() => deleteMedicine(med.id)}
                      title="Delete Record"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* High Density Table View */
        <div className="table-card-wrapper">
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Medicine</th>
                  <th>ID</th>
                  <th>Category</th>
                  <th>Unit Price</th>
                  <th>Stock Level</th>
                  <th>Safety Status</th>
                  <th>Expiry Schedule</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredMedicines.map(med => {
                  const stockStatus = getStockStatus(med);
                  const expiryStatus = getExpiryStatus(med);
                  const days = getDaysUntilExpiry(med.expiryDate);

                  return (
                    <tr key={med.id}>
                      <td>
                        <div className="table-med-info">
                          <img
                            src={med.image || 'iimmgg/IMG_20260119_231802.jpg'}
                            alt={med.name}
                            className="table-med-thumb"
                            onError={(e) => { e.currentTarget.src = 'logo.svg'; }}
                          />
                          <div>
                            <strong style={{ color: '#0f172a', display: 'block' }}>{med.name}</strong>
                            <span style={{ fontSize: '0.78rem', color: '#64748b' }}>{med.supplier}</span>
                          </div>
                        </div>
                      </td>

                      <td>
                        <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '0.82rem', color: '#075f4c' }}>
                          {med.id}
                        </span>
                      </td>

                      <td>
                        <span style={{
                          padding: '0.2rem 0.5rem',
                          borderRadius: '6px',
                          background: '#f1f5f9',
                          fontWeight: 600,
                          fontSize: '0.78rem',
                          color: '#334155'
                        }}>
                          {med.category}
                        </span>
                      </td>

                      <td>
                        <strong style={{ color: '#0f172a' }}>${Number(med.unitPrice || 0).toFixed(2)}</strong>
                      </td>

                      <td>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.35rem' }}>
                          <strong style={{ fontSize: '1.05rem', color: stockStatus === 'out-stock' ? '#ef4444' : '#0f172a' }}>
                            {med.quantity}
                          </strong>
                          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>/ min {med.minStock}</span>
                        </div>
                      </td>

                      <td>
                        <span className={`status-pill ${stockStatus}`}>
                          {stockStatus === 'in-stock' && 'In Stock'}
                          {stockStatus === 'low-stock' && 'Low Stock'}
                          {stockStatus === 'out-stock' && 'Out of Stock'}
                        </span>
                      </td>

                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                          <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>{med.expiryDate}</span>
                          <span className={`status-pill ${expiryStatus}`} style={{ width: 'fit-content' }}>
                            {days < 0 ? `${Math.abs(days)}d Overdue` : `${days}d Left`}
                          </span>
                        </div>
                      </td>

                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                          <button
                            type="button"
                            className="btn-icon"
                            onClick={() => setStockModal({ isOpen: true, medicine: med })}
                            title="Adjust Stock"
                          >
                            <ArrowUpDown size={15} />
                          </button>
                          <button
                            type="button"
                            className="btn-icon"
                            onClick={() => onOpenDetails(med)}
                            title="View Details"
                          >
                            <Eye size={15} />
                          </button>
                          <button
                            type="button"
                            className="btn-icon"
                            onClick={() => onOpenEditMedicine(med)}
                            title="Edit Record"
                          >
                            <Edit3 size={15} />
                          </button>
                          <button
                            type="button"
                            className="btn-icon danger"
                            onClick={() => deleteMedicine(med.id)}
                            title="Delete"
                          >
                            <Trash2 size={15} />
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
