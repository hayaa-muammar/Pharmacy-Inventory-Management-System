import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { INITIAL_MEDICINES } from '../data/initialMedicines';

const InventoryContext = createContext();

const STORAGE_KEY = 'pharmacare_react_inventory_v2';
const TXN_KEY = 'pharmacare_react_transactions_v2';

export function InventoryProvider({ children }) {
  // Load medicines from localStorage or fallback to initial seed
  const [medicines, setMedicines] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to parse stored medicines:', e);
    }
    return INITIAL_MEDICINES;
  });

  // Load transactions audit log
  const [transactions, setTransactions] = useState(() => {
    try {
      const stored = localStorage.getItem(TXN_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.warn('Failed to parse transactions:', e);
    }
    // Initial sample activity history
    return [
      {
        id: 'TXN-DEMO-01',
        medicineId: 'MED-1001',
        medicineName: 'Panadol Extra 500mg',
        type: 'IN',
        delta: 25,
        prevQty: 60,
        newQty: 85,
        reason: 'Monthly replenishment shipment from GSK',
        timestamp: new Date(Date.now() - 3600000 * 2).toISOString()
      },
      {
        id: 'TXN-DEMO-02',
        medicineId: 'MED-1011',
        medicineName: 'ORS Rehydration Salts Sachets',
        type: 'IN',
        delta: 50,
        prevQty: 60,
        newQty: 110,
        reason: 'Emergency hydration stock intake',
        timestamp: new Date(Date.now() - 3600000 * 6).toISOString()
      },
      {
        id: 'TXN-DEMO-03',
        medicineId: 'MED-1003',
        medicineName: 'Maalox Oral Suspension',
        type: 'OUT',
        delta: 12,
        prevQty: 12,
        newQty: 0,
        reason: 'Prescription dispensations (Depleted to 0)',
        timestamp: new Date(Date.now() - 3600000 * 18).toISOString()
      },
      {
        id: 'TXN-DEMO-04',
        medicineId: 'MED-1014',
        medicineName: 'Hydrocortisone Cream 1%',
        type: 'OUT',
        delta: 8,
        prevQty: 11,
        newQty: 3,
        reason: 'Hospital outpatient clinic order',
        timestamp: new Date(Date.now() - 3600000 * 24).toISOString()
      }
    ];
  });

  // Toast notifications state
  const [toasts, setToasts] = useState([]);

  // Confirmation modal state
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Confirm',
    confirmType: 'danger',
    onConfirm: null
  });

  // Quick Stock Adjustment modal state
  const [stockModal, setStockModal] = useState({
    isOpen: false,
    medicine: null
  });

  // Persist medicines to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(medicines));
    } catch (e) {
      console.error('Failed to save medicines to localStorage:', e);
    }
  }, [medicines]);

  // Persist transactions to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(TXN_KEY, JSON.stringify(transactions));
    } catch (e) {
      console.error('Failed to save transactions to localStorage:', e);
    }
  }, [transactions]);

  // Helper: Toast trigger
  const showToast = (message, type = 'info', duration = 3500) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, duration);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Helper: Open confirm dialog
  const confirmAction = ({ title, message, confirmText = 'Confirm', confirmType = 'danger', onConfirm }) => {
    setConfirmDialog({
      isOpen: true,
      title,
      message,
      confirmText,
      confirmType,
      onConfirm: () => {
        setConfirmDialog(prev => ({ ...prev, isOpen: false }));
        if (onConfirm) onConfirm();
      }
    });
  };

  const closeConfirm = () => {
    setConfirmDialog(prev => ({ ...prev, isOpen: false, onConfirm: null }));
  };

  // Helper: Days until expiry
  const getDaysUntilExpiry = (expiryDateStr) => {
    if (!expiryDateStr) return 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [y, m, d] = expiryDateStr.split('-').map(Number);
    const target = new Date(y, m - 1, d);
    target.setHours(0, 0, 0, 0);

    const diff = target.getTime() - today.getTime();
    return Math.round(diff / (1000 * 60 * 60 * 24));
  };

  // Helper: Expiry status
  const getExpiryStatus = (medicine) => {
    if (!medicine || !medicine.expiryDate) return 'valid';
    const days = getDaysUntilExpiry(medicine.expiryDate);
    if (days < 0) return 'expired';
    if (days <= 90) return 'expiring-soon';
    return 'valid';
  };

  // Helper: Stock status
  const getStockStatus = (medicine) => {
    if (!medicine) return 'out-stock';
    const qty = Number(medicine.quantity) || 0;
    const min = Number(medicine.minStock) || 10;
    if (qty <= 0) return 'out-stock';
    if (qty <= min) return 'low-stock';
    return 'in-stock';
  };

  // Helper: Record an audit transaction
  const recordTransaction = (medicineId, medicineName, type, delta, prevQty, newQty, reason) => {
    const txn = {
      id: 'TXN-' + Date.now().toString(36).toUpperCase() + '-' + Math.floor(Math.random() * 1000),
      medicineId,
      medicineName,
      type, // 'IN' | 'OUT' | 'ADJUST'
      delta: Math.abs(delta),
      prevQty,
      newQty,
      reason: reason || 'Inventory update',
      timestamp: new Date().toISOString()
    };
    setTransactions(prev => [txn, ...prev.slice(0, 99)]);
  };

  // Generate unique collision-free ID
  const generateUniqueId = () => {
    let max = 1000;
    medicines.forEach(m => {
      if (m.id && m.id.startsWith('MED-')) {
        const num = parseInt(m.id.replace('MED-', ''), 10);
        if (!isNaN(num) && num > max) max = num;
      }
    });
    return `MED-${max + 1}`;
  };

  // CRUD: Add Medicine
  const addMedicine = (data) => {
    if (!data.name || !data.name.trim()) throw new Error('Medicine name is required.');
    if (!data.category || !data.category.trim()) throw new Error('Category is required.');

    const qty = Number(data.quantity);
    if (isNaN(qty) || qty < 0 || !Number.isInteger(qty)) throw new Error('Quantity must be a non-negative whole integer.');

    const minStock = Number(data.minStock);
    if (isNaN(minStock) || minStock < 0 || !Number.isInteger(minStock)) throw new Error('Minimum stock threshold must be a non-negative integer.');

    const price = Number(data.unitPrice);
    if (isNaN(price) || price < 0) throw new Error('Unit price must be a valid positive number.');

    if (!data.expiryDate || !/^\d{4}-\d{2}-\d{2}$/.test(data.expiryDate)) throw new Error('A valid expiry date (YYYY-MM-DD) is required.');

    const id = data.id && !medicines.some(m => m.id === data.id) ? data.id : generateUniqueId();

    const newMed = {
      id,
      name: data.name.trim(),
      category: data.category.trim(),
      quantity: qty,
      minStock,
      unitPrice: Math.round(price * 100) / 100,
      expiryDate: data.expiryDate,
      supplier: (data.supplier || 'Standard Supplier').trim(),
      image: data.image || 'iimmgg/IMG_20260119_231802.jpg',
      description: (data.description || '').trim(),
      createdAt: new Date().toISOString()
    };

    setMedicines(prev => [newMed, ...prev]);
    recordTransaction(newMed.id, newMed.name, 'IN', qty, 0, qty, 'Initial stock intake');
    showToast(`"${newMed.name}" added to inventory successfully.`, 'success');
    return newMed;
  };

  // CRUD: Update Medicine
  const updateMedicine = (id, data) => {
    let updatedMed = null;
    let txnToRecord = null;

    setMedicines(prev => {
      const idx = prev.findIndex(m => m.id === id);
      if (idx === -1) throw new Error(`Medicine ${id} not found.`);

      const existing = { ...prev[idx], ...data, updatedAt: new Date().toISOString() };
      if (data.quantity !== undefined && data.quantity !== prev[idx].quantity) {
        const diff = data.quantity - prev[idx].quantity;
        txnToRecord = {
          id: existing.id,
          name: existing.name,
          type: diff > 0 ? 'IN' : 'OUT',
          diff: Math.abs(diff),
          prevQty: prev[idx].quantity,
          newQty: data.quantity,
          reason: 'Manual quantity edit'
        };
      }
      updatedMed = existing;
      const copy = [...prev];
      copy[idx] = existing;
      return copy;
    });

    if (txnToRecord) {
      recordTransaction(
        txnToRecord.id,
        txnToRecord.name,
        txnToRecord.type,
        txnToRecord.diff,
        txnToRecord.prevQty,
        txnToRecord.newQty,
        txnToRecord.reason
      );
    }

    showToast(`"${updatedMed?.name || id}" updated successfully.`, 'success');
    return updatedMed;
  };

  // CRUD: Delete Medicine
  const deleteMedicine = (id) => {
    const med = medicines.find(m => m.id === id);
    if (!med) return;

    confirmAction({
      title: 'Delete Medicine Record?',
      message: `Are you sure you want to delete "${med.name}" (${med.id}) permanently? This action cannot be reversed.`,
      confirmText: 'Delete Record',
      confirmType: 'danger',
      onConfirm: () => {
        setMedicines(prev => prev.filter(m => m.id !== id));
        recordTransaction(med.id, med.name, 'OUT', med.quantity, med.quantity, 0, 'Medicine removed from inventory system');
        showToast(`"${med.name}" was deleted from inventory.`, 'info');
      }
    });
  };

  // Stock Adjustment: Stock In or Stock Out
  const adjustStock = (id, delta, reason) => {
    const med = medicines.find(m => m.id === id);
    if (!med) throw new Error(`Medicine ${id} not found.`);

    const numDelta = Number(delta);
    if (isNaN(numDelta) || !Number.isInteger(numDelta)) throw new Error('Adjustment must be an integer.');

    const newQty = med.quantity + numDelta;
    if (newQty < 0) throw new Error(`Cannot dispense ${Math.abs(numDelta)} units. Only ${med.quantity} in stock.`);

    setMedicines(prev => prev.map(m => {
      if (m.id === id) {
        return { ...m, quantity: newQty, updatedAt: new Date().toISOString() };
      }
      return m;
    }));

    recordTransaction(
      med.id,
      med.name,
      numDelta >= 0 ? 'IN' : 'OUT',
      Math.abs(numDelta),
      med.quantity,
      newQty,
      reason || (numDelta >= 0 ? 'Restock inventory receipt' : 'Customer prescription dispensation')
    );

    showToast(`Stock updated for ${med.name}: now ${newQty} units.`, 'success');
  };

  // Bulk quarantine all expired batches
  const quarantineAllExpired = () => {
    const expiredList = medicines.filter(m => getExpiryStatus(m) === 'expired' && m.quantity > 0);
    if (expiredList.length === 0) {
      showToast('No active expired medicines found to quarantine.', 'info');
      return;
    }

    confirmAction({
      title: 'Quarantine All Expired Batches?',
      message: `Zero out stock for all ${expiredList.length} expired medicine batches and log them as quarantined/disposed?`,
      confirmText: 'Quarantine Batches',
      confirmType: 'danger',
      onConfirm: () => {
        expiredList.forEach(m => {
          recordTransaction(m.id, m.name, 'OUT', m.quantity, m.quantity, 0, 'Quarantined and written off due to expiration');
        });
        setMedicines(prev => prev.map(m => {
          if (getExpiryStatus(m) === 'expired' && m.quantity > 0) {
            return { ...m, quantity: 0, updatedAt: new Date().toISOString() };
          }
          return m;
        }));
        showToast(`Successfully quarantined ${expiredList.length} expired batches.`, 'success');
      }
    });
  };

  // Reset to sample demonstration dataset
  const resetToDemo = () => {
    confirmAction({
      title: 'Restore Default Demo Inventory?',
      message: 'This will reset all medicines and transaction history back to the comprehensive 52-record demo dataset. Any custom records will be replaced.',
      confirmText: 'Restore Demo Data',
      confirmType: 'danger',
      onConfirm: () => {
        setMedicines(INITIAL_MEDICINES);
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(TXN_KEY);
        showToast('Demo dataset restored with 52 realistic medicine records.', 'success');
      }
    });
  };

  // Dynamic Statistics
  const statistics = useMemo(() => {
    let totalUnits = 0;
    let totalValue = 0;
    let outOfStock = 0;
    let lowStock = 0;
    let inStock = 0;
    let expired = 0;
    let expiringSoon = 0;
    const categoryMap = {};

    medicines.forEach(m => {
      const q = Number(m.quantity) || 0;
      const p = Number(m.unitPrice) || 0;
      totalUnits += q;
      totalValue += q * p;

      // Category counts & value
      const cat = m.category || 'Uncategorized';
      if (!categoryMap[cat]) categoryMap[cat] = { count: 0, units: 0, value: 0 };
      categoryMap[cat].count += 1;
      categoryMap[cat].units += q;
      categoryMap[cat].value += q * p;

      // Stock status
      const s = getStockStatus(m);
      if (s === 'out-stock') outOfStock++;
      else if (s === 'low-stock') lowStock++;
      else inStock++;

      // Expiry status
      const e = getExpiryStatus(m);
      if (e === 'expired') expired++;
      else if (e === 'expiring-soon') expiringSoon++;
    });

    return {
      totalMedicines: medicines.length,
      totalUnits,
      totalValue: Math.round(totalValue * 100) / 100,
      outOfStock,
      lowStock,
      inStock,
      expired,
      expiringSoon,
      categoriesCount: Object.keys(categoryMap).length,
      categoryMap
    };
  }, [medicines]);

  return (
    <InventoryContext.Provider value={{
      medicines,
      transactions,
      statistics,
      toasts,
      showToast,
      removeToast,
      confirmDialog,
      confirmAction,
      closeConfirm,
      stockModal,
      setStockModal,
      addMedicine,
      updateMedicine,
      deleteMedicine,
      adjustStock,
      quarantineAllExpired,
      resetToDemo,
      getDaysUntilExpiry,
      getExpiryStatus,
      getStockStatus
    }}>
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventory() {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error('useInventory must be used within an InventoryProvider');
  }
  return context;
}
