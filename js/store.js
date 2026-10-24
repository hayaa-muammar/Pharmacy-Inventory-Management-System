/**
 * PharmaCare Store
 * Centralized State Management, Persistence, CRUD, Stock Operations, and Metrics
 */

(function (window) {
    'use strict';

    const STORAGE_KEY = 'pharmacare_inventory_v1';
    const TXN_KEY = 'pharmacare_transactions_v1';

    // System reference date - matches system runtime or today
    const getTodayDateString = () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const PharmaStore = {
        getTodayString() {
            return getTodayDateString();
        },

        // Calculate days between today and a target date
        getDaysUntilExpiry(expiryDateStr) {
            if (!expiryDateStr) return 0;
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const [y, m, d] = expiryDateStr.split('-').map(Number);
            const target = new Date(y, m - 1, d);
            target.setHours(0, 0, 0, 0);

            const diffTime = target.getTime() - today.getTime();
            return Math.round(diffTime / (1000 * 60 * 60 * 24));
        },

        // Determine expiry status: 'expired' | 'expiring-soon' | 'valid'
        getExpiryStatus(medicine) {
            if (!medicine || !medicine.expiryDate) return 'valid';
            const days = this.getDaysUntilExpiry(medicine.expiryDate);
            if (days < 0) return 'expired';
            if (days <= 90) return 'expiring-soon';
            return 'valid';
        },

        // Determine stock status: 'out-stock' | 'low-stock' | 'in-stock'
        getStockStatus(medicine) {
            if (!medicine) return 'out-stock';
            const qty = Number(medicine.quantity) || 0;
            const min = Number(medicine.minStock) || 10;
            if (qty <= 0) return 'out-stock';
            if (qty <= min) return 'low-stock';
            return 'in-stock';
        },

        // Initialize medicines data safely
        loadMedicines() {
            try {
                const stored = localStorage.getItem(STORAGE_KEY);
                if (stored) {
                    const parsed = JSON.parse(stored);
                    if (Array.isArray(parsed) && parsed.length > 0) {
                        return parsed;
                    }
                }
            } catch (err) {
                console.warn('PharmaStore: Failed to read from localStorage, using seed data.', err);
            }

            // Fallback / initial setup
            this.saveMedicines(INITIAL_MEDICINES);
            return [...INITIAL_MEDICINES];
        },

        // Save medicines to localStorage
        saveMedicines(medicines) {
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(medicines));
                window.dispatchEvent(new CustomEvent('pharmacare:data-changed', { detail: { count: medicines.length } }));
                return true;
            } catch (err) {
                console.error('PharmaStore: Failed to save to localStorage.', err);
                return false;
            }
        },

        // Load stock movement transactions
        loadTransactions() {
            try {
                const stored = localStorage.getItem(TXN_KEY);
                if (stored) {
                    const parsed = JSON.parse(stored);
                    if (Array.isArray(parsed)) return parsed;
                }
            } catch (err) {
                console.warn('PharmaStore: Failed to read transactions.', err);
            }
            return [];
        },

        // Save transactions
        saveTransactions(txns) {
            try {
                localStorage.setItem(TXN_KEY, JSON.stringify(txns));
            } catch (err) {
                console.error('PharmaStore: Failed to save transaction log.', err);
            }
        },

        // Record a transaction log item
        recordTransaction(medicineId, medicineName, type, delta, prevQty, newQty, reason) {
            const txns = this.loadTransactions();
            const record = {
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
            txns.unshift(record);
            // Cap history to 100 entries
            if (txns.length > 100) txns.length = 100;
            this.saveTransactions(txns);
            return record;
        },

        // Generate unique Collision-free Medicine ID
        generateUniqueId() {
            const medicines = this.loadMedicines();
            let maxNum = 1000;
            medicines.forEach(m => {
                if (m.id && m.id.startsWith('MED-')) {
                    const num = parseInt(m.id.replace('MED-', ''), 10);
                    if (!isNaN(num) && num > maxNum) {
                        maxNum = num;
                    }
                }
            });
            return `MED-${maxNum + 1}`;
        },

        // Get all medicines
        getAll() {
            return this.loadMedicines();
        },

        // Get single medicine by ID
        getById(id) {
            const medicines = this.loadMedicines();
            return medicines.find(m => m.id === id) || null;
        },

        // Add a new medicine with validation
        add(data) {
            if (!data.name || !data.name.trim()) {
                throw new Error('Medicine name is required.');
            }
            if (!data.category || !data.category.trim()) {
                throw new Error('Category is required.');
            }

            const qty = Number(data.quantity);
            if (isNaN(qty) || qty < 0 || !Number.isInteger(qty)) {
                throw new Error('Quantity must be a non-negative whole integer.');
            }

            const minStock = Number(data.minStock);
            if (isNaN(minStock) || minStock < 0 || !Number.isInteger(minStock)) {
                throw new Error('Minimum stock threshold must be a non-negative whole integer.');
            }

            const price = Number(data.unitPrice);
            if (isNaN(price) || price < 0) {
                throw new Error('Unit price must be a valid positive number.');
            }

            if (!data.expiryDate || !/^\d{4}-\d{2}-\d{2}$/.test(data.expiryDate)) {
                throw new Error('A valid expiry date (YYYY-MM-DD) is required.');
            }

            const medicines = this.loadMedicines();
            const id = data.id && !medicines.some(m => m.id === data.id)
                ? data.id
                : this.generateUniqueId();

            const newMedicine = {
                id,
                name: data.name.trim(),
                category: data.category.trim(),
                quantity: qty,
                minStock: minStock,
                unitPrice: Math.round(price * 100) / 100,
                expiryDate: data.expiryDate,
                supplier: (data.supplier || 'Standard Supplier').trim(),
                image: data.image || 'iimmgg/IMG_20260119_231802.jpg',
                description: (data.description || '').trim(),
                createdAt: new Date().toISOString()
            };

            medicines.push(newMedicine);
            this.saveMedicines(medicines);

            this.recordTransaction(
                newMedicine.id,
                newMedicine.name,
                'IN',
                qty,
                0,
                qty,
                'Initial stock creation'
            );

            return newMedicine;
        },

        // Update an existing medicine
        update(id, data) {
            const medicines = this.loadMedicines();
            const index = medicines.findIndex(m => m.id === id);
            if (index === -1) {
                throw new Error(`Medicine with ID ${id} was not found.`);
            }

            const existing = medicines[index];

            if (data.name !== undefined) {
                if (!data.name || !data.name.trim()) throw new Error('Medicine name cannot be empty.');
                existing.name = data.name.trim();
            }

            if (data.category !== undefined) {
                if (!data.category || !data.category.trim()) throw new Error('Category cannot be empty.');
                existing.category = data.category.trim();
            }

            if (data.quantity !== undefined) {
                const qty = Number(data.quantity);
                if (isNaN(qty) || qty < 0 || !Number.isInteger(qty)) {
                    throw new Error('Quantity must be a non-negative whole integer.');
                }
                const diff = qty - existing.quantity;
                if (diff !== 0) {
                    this.recordTransaction(
                        existing.id,
                        existing.name,
                        diff > 0 ? 'IN' : 'OUT',
                        Math.abs(diff),
                        existing.quantity,
                        qty,
                        'Manual quantity adjustment'
                    );
                }
                existing.quantity = qty;
            }

            if (data.minStock !== undefined) {
                const min = Number(data.minStock);
                if (isNaN(min) || min < 0 || !Number.isInteger(min)) {
                    throw new Error('Minimum stock threshold must be a non-negative whole integer.');
                }
                existing.minStock = min;
            }

            if (data.unitPrice !== undefined) {
                const price = Number(data.unitPrice);
                if (isNaN(price) || price < 0) {
                    throw new Error('Unit price must be a valid positive number.');
                }
                existing.unitPrice = Math.round(price * 100) / 100;
            }

            if (data.expiryDate !== undefined) {
                if (!data.expiryDate || !/^\d{4}-\d{2}-\d{2}$/.test(data.expiryDate)) {
                    throw new Error('A valid expiry date (YYYY-MM-DD) is required.');
                }
                existing.expiryDate = data.expiryDate;
            }

            if (data.supplier !== undefined) {
                existing.supplier = data.supplier.trim();
            }

            if (data.image !== undefined) {
                existing.image = data.image;
            }

            if (data.description !== undefined) {
                existing.description = data.description.trim();
            }

            existing.updatedAt = new Date().toISOString();
            medicines[index] = existing;
            this.saveMedicines(medicines);

            return existing;
        },

        // Delete a medicine
        delete(id) {
            const medicines = this.loadMedicines();
            const index = medicines.findIndex(m => m.id === id);
            if (index === -1) {
                throw new Error(`Medicine with ID ${id} does not exist.`);
            }

            const removed = medicines[index];
            medicines.splice(index, 1);
            this.saveMedicines(medicines);

            this.recordTransaction(
                removed.id,
                removed.name,
                'OUT',
                removed.quantity,
                removed.quantity,
                0,
                'Medicine record deleted from inventory'
            );

            return removed;
        },

        // Adjust stock with delta (positive for addition, negative for reduction)
        adjustStock(id, delta, reason) {
            const medicines = this.loadMedicines();
            const med = medicines.find(m => m.id === id);
            if (!med) {
                throw new Error(`Medicine with ID ${id} was not found.`);
            }

            const numDelta = Number(delta);
            if (isNaN(numDelta) || !Number.isInteger(numDelta)) {
                throw new Error('Stock adjustment quantity must be an integer.');
            }

            const prevQty = Number(med.quantity) || 0;
            const newQty = prevQty + numDelta;

            if (newQty < 0) {
                throw new Error(`Insufficient stock. Current stock is ${prevQty}, cannot reduce by ${Math.abs(numDelta)}.`);
            }

            med.quantity = newQty;
            med.updatedAt = new Date().toISOString();
            this.saveMedicines(medicines);

            this.recordTransaction(
                med.id,
                med.name,
                numDelta >= 0 ? 'IN' : 'OUT',
                Math.abs(numDelta),
                prevQty,
                newQty,
                reason || (numDelta >= 0 ? 'Restock shipment received' : 'Dispensed to customer')
            );

            return med;
        },

        // Calculate dynamic dashboard statistics
        getStatistics() {
            const medicines = this.loadMedicines();
            let totalUnits = 0;
            let totalValue = 0;
            let outOfStock = 0;
            let lowStock = 0;
            let inStock = 0;
            let expired = 0;
            let expiringSoon = 0;
            const categories = new Set();

            medicines.forEach(med => {
                const qty = Number(med.quantity) || 0;
                const price = Number(med.unitPrice) || 0;
                totalUnits += qty;
                totalValue += qty * price;

                if (med.category) categories.add(med.category);

                const stockStatus = this.getStockStatus(med);
                if (stockStatus === 'out-stock') outOfStock++;
                else if (stockStatus === 'low-stock') lowStock++;
                else inStock++;

                const expiryStatus = this.getExpiryStatus(med);
                if (expiryStatus === 'expired') expired++;
                else if (expiryStatus === 'expiring-soon') expiringSoon++;
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
                categoriesCount: categories.size
            };
        },

        // Query medicines with search, filtering, and sorting
        query({ search = '', category = 'all', stockStatus = 'all', expiryStatus = 'all', sortBy = 'name', sortOrder = 'asc' }) {
            let list = this.loadMedicines();

            // 1. Text Search (name, id, category, supplier)
            if (search && search.trim() !== '') {
                const q = search.trim().toLowerCase();
                list = list.filter(m =>
                    (m.name && m.name.toLowerCase().includes(q)) ||
                    (m.id && m.id.toLowerCase().includes(q)) ||
                    (m.category && m.category.toLowerCase().includes(q)) ||
                    (m.supplier && m.supplier.toLowerCase().includes(q))
                );
            }

            // 2. Category Filter
            if (category && category !== 'all') {
                list = list.filter(m => m.category === category);
            }

            // 3. Stock Status Filter
            if (stockStatus && stockStatus !== 'all') {
                list = list.filter(m => this.getStockStatus(m) === stockStatus);
            }

            // 4. Expiry Status Filter
            if (expiryStatus && expiryStatus !== 'all') {
                list = list.filter(m => this.getExpiryStatus(m) === expiryStatus);
            }

            // 5. Sorting
            list.sort((a, b) => {
                let comparison = 0;
                if (sortBy === 'name') {
                    comparison = (a.name || '').localeCompare(b.name || '');
                } else if (sortBy === 'quantity') {
                    comparison = (Number(a.quantity) || 0) - (Number(b.quantity) || 0);
                } else if (sortBy === 'price') {
                    comparison = (Number(a.unitPrice) || 0) - (Number(b.unitPrice) || 0);
                } else if (sortBy === 'expiry') {
                    const dateA = new Date(a.expiryDate || '9999-12-31').getTime();
                    const dateB = new Date(b.expiryDate || '9999-12-31').getTime();
                    comparison = dateA - dateB;
                } else if (sortBy === 'id') {
                    comparison = (a.id || '').localeCompare(b.id || '');
                }

                return sortOrder === 'desc' ? -comparison : comparison;
            });

            return list;
        },

        // Restore demo dataset
        resetToDemo() {
            localStorage.removeItem(STORAGE_KEY);
            localStorage.removeItem(TXN_KEY);
            this.saveMedicines(INITIAL_MEDICINES);
            return [...INITIAL_MEDICINES];
        }
    };

    window.PharmaStore = PharmaStore;
})(window);
