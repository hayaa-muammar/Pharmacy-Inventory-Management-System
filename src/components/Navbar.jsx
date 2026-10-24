import React from 'react';
import { useInventory } from '../context/InventoryContext';
import { 
  LayoutDashboard, 
  Package, 
  Clock, 
  BarChart3, 
  Plus, 
  RotateCcw,
  AlertTriangle
} from 'lucide-react';

export default function Navbar({ activePage, setActivePage, onOpenAddMedicine }) {
  const { statistics, resetToDemo } = useInventory();
  const alertCount = statistics.expired + statistics.lowStock;

  return (
    <header className="react-header">
      <div className="header-inner">
        {/* Brand */}
        <div 
          className="brand-wrapper" 
          onClick={() => setActivePage('dashboard')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && setActivePage('dashboard')}
        >
          <img src="logo.svg" alt="PharmaCare" className="brand-logo" />
          <div className="brand-title">
            Pharma<span className="accent-text">Care</span>
            <span className="brand-badge">React Pro</span>
          </div>
        </div>

        {/* Navigation items */}
        <nav aria-label="Main navigation">
          <ul className="react-nav">
            <li>
              <button 
                type="button"
                className={`nav-item-btn ${activePage === 'dashboard' ? 'active' : ''}`}
                onClick={() => setActivePage('dashboard')}
              >
                <LayoutDashboard size={18} />
                <span>Dashboard</span>
              </button>
            </li>

            <li>
              <button 
                type="button"
                className={`nav-item-btn ${activePage === 'inventory' ? 'active' : ''}`}
                onClick={() => setActivePage('inventory')}
              >
                <Package size={18} />
                <span>Inventory</span>
                <span className="nav-counter-badge" style={{ background: '#059669', boxShadow: 'none' }}>
                  {statistics.totalMedicines}
                </span>
              </button>
            </li>

            <li>
              <button 
                type="button"
                className={`nav-item-btn ${activePage === 'expiry' ? 'active' : ''}`}
                onClick={() => setActivePage('expiry')}
              >
                <Clock size={18} />
                <span>Expiry Radar</span>
                {statistics.expired > 0 ? (
                  <span className="nav-counter-badge" title={`${statistics.expired} expired medicines`}>
                    {statistics.expired}
                  </span>
                ) : statistics.expiringSoon > 0 ? (
                  <span className="nav-counter-badge warning" title={`${statistics.expiringSoon} medicines expiring soon`}>
                    {statistics.expiringSoon}
                  </span>
                ) : null}
              </button>
            </li>

            <li>
              <button 
                type="button"
                className={`nav-item-btn ${activePage === 'analytics' ? 'active' : ''}`}
                onClick={() => setActivePage('analytics')}
              >
                <BarChart3 size={18} />
                <span>Analytics</span>
              </button>
            </li>
          </ul>
        </nav>

        {/* Header Actions */}
        <div className="header-right-actions">
          <button
            type="button"
            className="btn-accent-mint"
            onClick={onOpenAddMedicine}
            title="Add a new medicine record to inventory"
          >
            <Plus size={18} />
            <span>Add Medicine</span>
          </button>

          <button
            type="button"
            className="btn-secondary-outline"
            style={{ 
              borderColor: 'rgba(255, 255, 255, 0.2)', 
              color: '#e2e8f0', 
              background: 'rgba(255, 255, 255, 0.05)',
              padding: '0.55rem 0.85rem' 
            }}
            onClick={resetToDemo}
            title="Reset to original 52 demonstration medicines"
          >
            <RotateCcw size={16} />
            <span style={{ fontSize: '0.82rem' }}>Reset Demo</span>
          </button>
        </div>
      </div>
    </header>
  );
}
