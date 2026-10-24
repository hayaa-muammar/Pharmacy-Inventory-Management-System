import React, { useState } from 'react';
import { useInventory } from './context/InventoryContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Toast from './components/Toast';
import ConfirmModal from './components/ConfirmModal';
import StockAdjustModal from './components/StockAdjustModal';
import MedicineDetailModal from './components/MedicineDetailModal';
import MedicineFormModal from './components/MedicineFormModal';

import DashboardPage from './pages/DashboardPage';
import InventoryPage from './pages/InventoryPage';
import ExpiryPage from './pages/ExpiryPage';
import AnalyticsPage from './pages/AnalyticsPage';

export default function App() {
  const [activePage, setActivePage] = useState('dashboard');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState(null);
  const [detailMedicine, setDetailMedicine] = useState(null);

  const { setStockModal } = useInventory();

  // Handlers for modals
  const handleOpenAddMedicine = () => {
    setEditingMedicine(null);
    setIsFormOpen(true);
  };

  const handleOpenEditMedicine = (medicine) => {
    setEditingMedicine(medicine);
    setIsFormOpen(true);
  };

  const handleOpenDetails = (medicine) => {
    setDetailMedicine(medicine);
  };

  const handleAdjustStock = (medicine) => {
    setStockModal({ isOpen: true, medicine });
  };

  return (
    <div className="app-layout">
      {/* Top Navbar */}
      <Navbar
        activePage={activePage}
        setActivePage={setActivePage}
        onOpenAddMedicine={handleOpenAddMedicine}
      />

      {/* Main Content Pages */}
      <main className="main-content">
        {activePage === 'dashboard' && (
          <DashboardPage
            setActivePage={setActivePage}
            onOpenAddMedicine={handleOpenAddMedicine}
            onOpenDetails={handleOpenDetails}
          />
        )}

        {activePage === 'inventory' && (
          <InventoryPage
            onOpenAddMedicine={handleOpenAddMedicine}
            onOpenEditMedicine={handleOpenEditMedicine}
            onOpenDetails={handleOpenDetails}
          />
        )}

        {activePage === 'expiry' && (
          <ExpiryPage
            onOpenDetails={handleOpenDetails}
          />
        )}

        {activePage === 'analytics' && (
          <AnalyticsPage
            onOpenDetails={handleOpenDetails}
            onAdjustStock={handleAdjustStock}
          />
        )}
      </main>

      {/* Global Footer */}
      <Footer setActivePage={setActivePage} />

      {/* Global Modals & Overlays */}
      <Toast />
      <ConfirmModal />
      <StockAdjustModal />

      {/* Medicine Form Modal (Add / Edit) */}
      <MedicineFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingMedicine(null);
        }}
        medicineToEdit={editingMedicine}
      />

      {/* Medicine Details Modal */}
      <MedicineDetailModal
        medicine={detailMedicine}
        onClose={() => setDetailMedicine(null)}
        onEdit={(med) => {
          setDetailMedicine(null);
          handleOpenEditMedicine(med);
        }}
        onAdjustStock={(med) => {
          setDetailMedicine(null);
          handleAdjustStock(med);
        }}
      />
    </div>
  );
}
