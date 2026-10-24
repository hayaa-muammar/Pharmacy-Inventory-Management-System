import React from 'react';
import { useInventory } from '../context/InventoryContext';
import { ShieldCheck, Heart, Database, Clock } from 'lucide-react';

export default function Footer({ setActivePage }) {
  const { statistics } = useInventory();

  return (
    <footer style={{
      background: '#04221b',
      borderTop: '1px solid rgba(52, 211, 153, 0.2)',
      color: '#94a3b8',
      padding: '2.5rem 1.5rem 2rem',
      fontSize: '0.88rem'
    }}>
      <div style={{
        maxWidth: '1380px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '2rem',
        marginBottom: '2rem'
      }}>
        {/* Brand column */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.85rem' }}>
            <img src="logo.svg" alt="PharmaCare" style={{ width: '28px', height: '28px' }} />
            <span style={{ color: '#ffffff', fontWeight: 800, fontSize: '1.2rem', fontFamily: 'Outfit, sans-serif' }}>
              Pharma<span style={{ color: '#34d399' }}>Care</span>
            </span>
          </div>
          <p style={{ lineHeight: 1.6, color: '#cbd5e1', fontSize: '0.85rem' }}>
            Enterprise Pharmacy Inventory & Medication Safety Telemetry System. Engineered for hospital dispensaries and community pharmacies.
          </p>
        </div>

        {/* Live System Stats */}
        <div>
          <h4 style={{ color: '#ffffff', fontSize: '0.92rem', marginBottom: '0.75rem', fontWeight: 700 }}>
            System Status
          </h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.84rem' }}>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10b981' }}>
              <ShieldCheck size={16} /> All Systems Operational
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Database size={16} /> {statistics.totalMedicines} Active Pharmaceutical SKUs
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Clock size={16} /> Real-time LocalStorage Persistence
            </li>
          </ul>
        </div>

        {/* Quick Navigation */}
        <div>
          <h4 style={{ color: '#ffffff', fontSize: '0.92rem', marginBottom: '0.75rem', fontWeight: 700 }}>
            Quick Navigation
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', fontSize: '0.85rem' }}>
            <button 
              onClick={() => { setActivePage('dashboard'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              style={{ background: 'none', border: 'none', color: '#94a3b8', textAlign: 'left', cursor: 'pointer', padding: 0 }}
            >
              • Dashboard Overview
            </button>
            <button 
              onClick={() => { setActivePage('inventory'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              style={{ background: 'none', border: 'none', color: '#94a3b8', textAlign: 'left', cursor: 'pointer', padding: 0 }}
            >
              • Medicine Inventory Manager
            </button>
            <button 
              onClick={() => { setActivePage('expiry'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              style={{ background: 'none', border: 'none', color: '#94a3b8', textAlign: 'left', cursor: 'pointer', padding: 0 }}
            >
              • Expiry Monitoring Radar
            </button>
            <button 
              onClick={() => { setActivePage('analytics'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              style={{ background: 'none', border: 'none', color: '#94a3b8', textAlign: 'left', cursor: 'pointer', padding: 0 }}
            >
              • Analytics & Reports
            </button>
          </div>
        </div>
      </div>

      <div style={{
        maxWidth: '1380px',
        margin: '0 auto',
        paddingTop: '1.5rem',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        fontSize: '0.8rem',
        color: '#64748b'
      }}>
        <div>
          &copy; {new Date().getFullYear()} PharmaCare. All rights reserved. Professional Healthcare Solution.
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          Built with React 18 &amp; Vite <span style={{ color: '#34d399' }}>&#9679;</span> Zero External CDN Dependency
        </div>
      </div>
    </footer>
  );
}
