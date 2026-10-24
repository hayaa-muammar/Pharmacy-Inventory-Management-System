/**
 * PharmaCare Application Controller
 * Page routing, event handling, search/filter/sort, CRUD modals, and reactive rendering
 */

(function (window, document) {
    'use strict';

    const App = {
        currentPage: 'home',
        inventoryViewMode: 'grid', // 'grid' | 'table'
        filterState: {
            search: '',
            category: 'all',
            stockStatus: 'all',
            expiryStatus: 'all',
            sortBy: 'name',
            sortOrder: 'asc'
        },

        init() {
            // Determine active page
            const path = window.location.pathname.toLowerCase();
            if (path.includes('inventory.html')) {
                this.currentPage = 'inventory';
            } else if (path.includes('expiry.html')) {
                this.currentPage = 'expiry';
            } else {
                this.currentPage = 'home';
            }

            // Sync navigation & badges
            window.PharmaUI.initGlobalListeners();
            window.PharmaUI.syncNavigation();

            // Run page-specific initializer
            if (this.currentPage === 'home') {
                this.initHomePage();
            } else if (this.currentPage === 'inventory') {
                this.initInventoryPage();
            } else if (this.currentPage === 'expiry') {
                this.initExpiryPage();
            }

            // Subscribe to store updates
            window.addEventListener('pharmacare:data-changed', () => {
                if (this.currentPage === 'home') {
                    this.renderHomeStats();
                    this.renderRecentActivities();
                    this.renderCriticalAlerts();
                } else if (this.currentPage === 'inventory') {
                    this.renderInventory();
                } else if (this.currentPage === 'expiry') {
                    this.renderExpiryPage();
                }
            });
        },

        /* =========================================================================
         * HOME / DASHBOARD PAGE LOGIC
         * ========================================================================= */
        initHomePage() {
            this.renderHomeStats();
            this.renderStockHealthBreakdown();
            this.renderCriticalAlerts();
            this.renderRecentActivities();
            this.bindHomeEvents();
        },

        renderHomeStats() {
            const stats = window.PharmaStore.getStatistics();

            const statElements = {
                'stat-total-meds': stats.totalMedicines,
                'stat-total-units': stats.totalUnits.toLocaleString(),
                'stat-total-value': window.PharmaUI.formatCurrency(stats.totalValue),
                'stat-out-stock': stats.outOfStock,
                'stat-low-stock': stats.lowStock,
                'stat-expired': stats.expired,
                'stat-expiring-soon': stats.expiringSoon
            };

            for (const [id, val] of Object.entries(statElements)) {
                const el = document.getElementById(id);
                if (el) el.textContent = val;
            }
        },

        renderStockHealthBreakdown() {
            const container = document.getElementById('stock-health-container');
            if (!container) return;

            const stats = window.PharmaStore.getStatistics();
            const total = stats.totalMedicines || 1;
            const inStockPct = Math.round((stats.inStock / total) * 100);
            const lowStockPct = Math.round((stats.lowStock / total) * 100);
            const outStockPct = Math.round((stats.outOfStock / total) * 100);

            container.innerHTML = `
                <div class="health-meter-bar">
                    <div class="health-seg seg-healthy" style="width: ${inStockPct}%" title="In Stock: ${inStockPct}%"></div>
                    <div class="health-seg seg-low" style="width: ${lowStockPct}%" title="Low Stock: ${lowStockPct}%"></div>
                    <div class="health-seg seg-out" style="width: ${outStockPct}%" title="Out of Stock: ${outStockPct}%"></div>
                </div>
                <div class="health-legend">
                    <span class="legend-item"><span class="dot dot-healthy"></span> In Stock: <strong>${stats.inStock}</strong> (${inStockPct}%)</span>
                    <span class="legend-item"><span class="dot dot-low"></span> Low Stock: <strong>${stats.lowStock}</strong> (${lowStockPct}%)</span>
                    <span class="legend-item"><span class="dot dot-out"></span> Out of Stock: <strong>${stats.outOfStock}</strong> (${outStockPct}%)</span>
                </div>
            `;
        },

        renderCriticalAlerts() {
            const listEl = document.getElementById('critical-alerts-list');
            if (!listEl) return;

            const allMeds = window.PharmaStore.getAll();
            const alerts = [];

            allMeds.forEach(m => {
                const expStatus = window.PharmaStore.getExpiryStatus(m);
                const stockStatus = window.PharmaStore.getStockStatus(m);

                if (expStatus === 'expired') {
                    alerts.push({
                        type: 'danger',
                        icon: '⚠',
                        med: m,
                        title: `${m.name} is EXPIRED`,
                        sub: `Batch expiry was ${window.PharmaUI.formatDate(m.expiryDate)} (${window.PharmaStore.getDaysUntilExpiry(m.expiryDate)} days ago)`
                    });
                } else if (stockStatus === 'out-stock') {
                    alerts.push({
                        type: 'danger',
                        icon: '✕',
                        med: m,
                        title: `${m.name} is OUT OF STOCK`,
                        sub: `0 units remaining (Min threshold: ${m.minStock})`
                    });
                } else if (expStatus === 'expiring-soon') {
                    const days = window.PharmaStore.getDaysUntilExpiry(m.expiryDate);
                    alerts.push({
                        type: 'warning',
                        icon: '⏱',
                        med: m,
                        title: `${m.name} expiring soon`,
                        sub: `Expires on ${window.PharmaUI.formatDate(m.expiryDate)} (${days} days remaining)`
                    });
                } else if (stockStatus === 'low-stock') {
                    alerts.push({
                        type: 'warning',
                        icon: '⚠',
                        med: m,
                        title: `${m.name} is low on stock`,
                        sub: `Current stock: ${m.quantity} / Min: ${m.minStock} units`
                    });
                }
            });

            if (alerts.length === 0) {
                listEl.innerHTML = `
                    <div class="empty-notice-box">
                        <span class="empty-icon">✓</span>
                        <p>All stock levels and expiry schedules are in good standing!</p>
                    </div>
                `;
                return;
            }

            // Display top 5 urgent alerts
            const displayAlerts = alerts.slice(0, 5);
            listEl.innerHTML = displayAlerts.map(a => `
                <div class="alert-item alert-${a.type}">
                    <span class="alert-icon">${a.icon}</span>
                    <div class="alert-details">
                        <span class="alert-title">${a.title}</span>
                        <span class="alert-sub">${a.sub}</span>
                    </div>
                    <a href="inventory.html" class="btn btn-sm btn-outline">Review</a>
                </div>
            `).join('');
        },

        renderRecentActivities() {
            const tableBody = document.getElementById('recent-activity-tbody');
            if (!tableBody) return;

            const txns = window.PharmaStore.loadTransactions();
            if (txns.length === 0) {
                tableBody.innerHTML = `<tr><td colspan="5" class="text-center text-muted">No stock movements recorded yet.</td></tr>`;
                return;
            }

            const recent = txns.slice(0, 6);
            tableBody.innerHTML = recent.map(t => {
                const date = new Date(t.timestamp);
                const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' ' + date.toLocaleDateString([], { month: 'short', day: 'numeric' });
                const isPositive = t.type === 'IN';
                const badgeClass = isPositive ? 'badge-in-stock' : 'badge-out-stock';
                const sign = isPositive ? '+' : '-';

                return `
                    <tr>
                        <td><strong>${t.medicineName}</strong></td>
                        <td><span class="badge ${badgeClass}">${t.type}</span></td>
                        <td><strong class="${isPositive ? 'text-success' : 'text-danger'}">${sign}${t.delta} units</strong></td>
                        <td>${t.reason}</td>
                        <td class="text-muted"><small>${timeStr}</small></td>
                    </tr>
                `;
            }).join('');
        },

        bindHomeEvents() {
            const resetBtn = document.getElementById('btn-reset-demo-data');
            if (resetBtn) {
                resetBtn.addEventListener('click', () => {
                    window.PharmaUI.confirm({
                        title: 'Restore Demo Inventory?',
                        message: 'This will reset all medicines and transaction history back to the initial sample dataset. Any manual changes will be lost.',
                        confirmText: 'Restore Demo Data',
                        confirmType: 'danger',
                        onConfirm: () => {
                            window.PharmaStore.resetToDemo();
                            window.PharmaUI.showToast('Demo inventory restored successfully.', 'success');
                        }
                    });
                });
            }
        },

        /* =========================================================================
         * INVENTORY PAGE LOGIC
         * ========================================================================= */
        initInventoryPage() {
            this.populateCategoryFilter();
            this.populateImageSelector();
            this.bindInventoryEvents();
            this.renderInventory();
        },

        populateCategoryFilter() {
            const select = document.getElementById('filter-category');
            if (!select) return;

            const medicines = window.PharmaStore.getAll();
            const categories = new Set(PREDEFINED_CATEGORIES);
            medicines.forEach(m => {
                if (m.category) categories.add(m.category);
            });

            // Preserve current selection
            const current = this.filterState.category;
            select.innerHTML = '<option value="all">All Categories</option>';

            Array.from(categories).sort().forEach(cat => {
                const opt = document.createElement('option');
                opt.value = cat;
                opt.textContent = cat;
                if (cat === current) opt.selected = true;
                select.appendChild(opt);
            });
        },

        populateImageSelector() {
            const select = document.getElementById('medicine-image-select');
            if (!select) return;

            select.innerHTML = AVAILABLE_MEDICINE_IMAGES.map(img => `
                <option value="${img.path}">${img.label} (${img.path.split('/').pop()})</option>
            `).join('');

            const previewImg = document.getElementById('medicine-form-img-preview');
            if (previewImg && select.value) {
                previewImg.src = select.value;
            }

            select.addEventListener('change', (e) => {
                if (previewImg) previewImg.src = e.target.value;
            });
        },

        bindInventoryEvents() {
            // Live Search
            const searchInput = document.getElementById('inventory-search-input');
            const searchClearBtn = document.getElementById('search-clear-btn');
            if (searchInput) {
                searchInput.addEventListener('input', (e) => {
                    this.filterState.search = e.target.value;
                    if (searchClearBtn) {
                        searchClearBtn.style.display = e.target.value ? 'inline-flex' : 'none';
                    }
                    this.renderInventory();
                });
            }

            if (searchClearBtn) {
                searchClearBtn.addEventListener('click', () => {
                    if (searchInput) {
                        searchInput.value = '';
                        this.filterState.search = '';
                        searchClearBtn.style.display = 'none';
                        this.renderInventory();
                        searchInput.focus();
                    }
                });
            }

            // Category Filter
            const catSelect = document.getElementById('filter-category');
            if (catSelect) {
                catSelect.addEventListener('change', (e) => {
                    this.filterState.category = e.target.value;
                    this.renderInventory();
                });
            }

            // Stock Status Filter
            const stockSelect = document.getElementById('filter-stock-status');
            if (stockSelect) {
                stockSelect.addEventListener('change', (e) => {
                    this.filterState.stockStatus = e.target.value;
                    this.renderInventory();
                });
            }

            // Expiry Status Filter
            const expirySelect = document.getElementById('filter-expiry-status');
            if (expirySelect) {
                expirySelect.addEventListener('change', (e) => {
                    this.filterState.expiryStatus = e.target.value;
                    this.renderInventory();
                });
            }

            // Sorting Select
            const sortSelect = document.getElementById('filter-sort-by');
            if (sortSelect) {
                sortSelect.addEventListener('change', (e) => {
                    const [by, order] = e.target.value.split(':');
                    this.filterState.sortBy = by;
                    this.filterState.sortOrder = order || 'asc';
                    this.renderInventory();
                });
            }

            // Clear All Filters Button
            const clearBtn = document.getElementById('btn-clear-filters');
            if (clearBtn) {
                clearBtn.addEventListener('click', () => {
                    this.resetFilters();
                });
            }

            // View Mode Toggle (Grid vs Table)
            const btnGridView = document.getElementById('btn-view-grid');
            const btnTableView = document.getElementById('btn-view-table');

            if (btnGridView && btnTableView) {
                btnGridView.addEventListener('click', () => {
                    this.inventoryViewMode = 'grid';
                    btnGridView.classList.add('active');
                    btnTableView.classList.remove('active');
                    this.renderInventory();
                });

                btnTableView.addEventListener('click', () => {
                    this.inventoryViewMode = 'table';
                    btnTableView.classList.add('active');
                    btnGridView.classList.remove('active');
                    this.renderInventory();
                });
            }

            // Add Medicine Button
            const addBtn = document.getElementById('btn-add-medicine');
            if (addBtn) {
                addBtn.addEventListener('click', () => {
                    this.openMedicineModal('add');
                });
            }

            // Reset Demo Data Button
            const resetBtn = document.getElementById('btn-reset-inventory');
            if (resetBtn) {
                resetBtn.addEventListener('click', () => {
                    window.PharmaUI.confirm({
                        title: 'Restore Default Inventory?',
                        message: 'Are you sure you want to restore the default 15 medicines? Any changes or newly added items will be replaced.',
                        confirmText: 'Restore Default Data',
                        confirmType: 'danger',
                        onConfirm: () => {
                            window.PharmaStore.resetToDemo();
                            this.populateCategoryFilter();
                            this.resetFilters();
                            window.PharmaUI.showToast('Inventory reset to default demonstration data.', 'success');
                        }
                    });
                });
            }

            // Form Submit for Add/Edit
            const form = document.getElementById('medicine-form');
            if (form) {
                form.addEventListener('submit', (e) => {
                    e.preventDefault();
                    this.handleMedicineFormSubmit();
                });
            }

            // Form Submit for Stock Adjustment
            const stockForm = document.getElementById('stock-adjust-form');
            if (stockForm) {
                stockForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    this.handleStockAdjustSubmit();
                });
            }
        },

        resetFilters() {
            this.filterState = {
                search: '',
                category: 'all',
                stockStatus: 'all',
                expiryStatus: 'all',
                sortBy: 'name',
                sortOrder: 'asc'
            };

            const searchInput = document.getElementById('inventory-search-input');
            if (searchInput) searchInput.value = '';

            const searchClearBtn = document.getElementById('search-clear-btn');
            if (searchClearBtn) searchClearBtn.style.display = 'none';

            const catSelect = document.getElementById('filter-category');
            if (catSelect) catSelect.value = 'all';

            const stockSelect = document.getElementById('filter-stock-status');
            if (stockSelect) stockSelect.value = 'all';

            const expSelect = document.getElementById('filter-expiry-status');
            if (expSelect) expSelect.value = 'all';

            const sortSelect = document.getElementById('filter-sort-by');
            if (sortSelect) sortSelect.value = 'name:asc';

            this.renderInventory();
        },

        renderInventory() {
            const list = window.PharmaStore.query(this.filterState);
            const totalMeds = window.PharmaStore.getAll().length;

            // Summary text
            const countEl = document.getElementById('inventory-results-count');
            if (countEl) {
                countEl.textContent = `Showing ${list.length} of ${totalMeds} medicines`;
            }

            const gridContainer = document.getElementById('inventory-grid-container');
            const tableContainer = document.getElementById('inventory-table-container');
            const emptyState = document.getElementById('inventory-empty-state');

            if (!gridContainer || !tableContainer) return;

            if (list.length === 0) {
                gridContainer.style.display = 'none';
                tableContainer.style.display = 'none';
                if (emptyState) emptyState.style.display = 'block';
                return;
            }

            if (emptyState) emptyState.style.display = 'none';

            if (this.inventoryViewMode === 'grid') {
                gridContainer.style.display = 'grid';
                tableContainer.style.display = 'none';
                this.renderCardsGrid(list, gridContainer);
            } else {
                gridContainer.style.display = 'none';
                tableContainer.style.display = 'block';
                this.renderDataTable(list, tableContainer);
            }
        },

        renderCardsGrid(list, container) {
            container.innerHTML = list.map(med => {
                const stockStatus = window.PharmaStore.getStockStatus(med);
                const expiryStatus = window.PharmaStore.getExpiryStatus(med);
                const days = window.PharmaStore.getDaysUntilExpiry(med.expiryDate);

                // Determine border and top bar styling matching original classes
                let cardStatusClass = 'in-stock';
                if (expiryStatus === 'expired') {
                    cardStatusClass = 'expired';
                } else if (stockStatus === 'out-stock') {
                    cardStatusClass = 'out-stock';
                } else if (stockStatus === 'low-stock') {
                    cardStatusClass = 'low-stock';
                }

                const stockPct = Math.min(100, Math.round(((med.quantity || 0) / (Math.max(med.minStock * 2, 20))) * 100));

                return `
                    <div class="item-card ${cardStatusClass}" data-id="${med.id}">
                        <div class="card-badges-row">
                            <span class="card-id-tag">${med.id}</span>
                            <div class="card-badges-group">
                                ${window.PharmaUI.getExpiryBadge(med)}
                                ${window.PharmaUI.getStockBadge(med)}
                            </div>
                        </div>

                        <div class="image img">
                            <img src="${med.image || 'iimmgg/IMG_20260119_231802.jpg'}" 
                                 alt="${med.name}" 
                                 loading="lazy"
                                 onerror="this.src='iimmgg/IMG_20260119_231802.jpg'">
                        </div>

                        <div class="card-info">
                            <h3 class="card-med-title" title="${med.name}">${med.name}</h3>
                            <div class="card-meta">
                                <span class="meta-label">Category:</span>
                                <span class="meta-value">${med.category}</span>
                            </div>
                            <div class="card-meta">
                                <span class="meta-label">Unit Price:</span>
                                <span class="meta-value price-tag">${window.PharmaUI.formatCurrency(med.unitPrice)}</span>
                            </div>
                            <div class="card-meta">
                                <span class="meta-label">Expiry:</span>
                                <span class="meta-value ${expiryStatus === 'expired' ? 'text-danger font-bold' : ''}">
                                    ${window.PharmaUI.formatDate(med.expiryDate)}
                                </span>
                            </div>

                            <div class="card-stock-meter">
                                <div class="meter-info">
                                    <span>Stock: <strong>${med.quantity}</strong> units</span>
                                    <small class="text-muted">Min: ${med.minStock}</small>
                                </div>
                                <div class="meter-track">
                                    <div class="meter-fill fill-${stockStatus}" style="width: ${stockPct}%"></div>
                                </div>
                            </div>
                        </div>

                        <div class="card-actions-bar">
                            <button type="button" class="btn btn-sm btn-outline-primary" data-action="adjust-stock" data-id="${med.id}" title="Adjust Stock">
                                &plusmn; Stock
                            </button>
                            <button type="button" class="btn btn-sm btn-secondary" data-action="view-details" data-id="${med.id}" title="View Details">
                                View
                            </button>
                            <button type="button" class="btn btn-sm btn-secondary" data-action="edit-med" data-id="${med.id}" title="Edit Medicine">
                                Edit
                            </button>
                            <button type="button" class="btn btn-sm btn-icon-danger" data-action="delete-med" data-id="${med.id}" title="Delete Medicine" aria-label="Delete">
                                &times;
                            </button>
                        </div>
                    </div>
                `;
            }).join('');

            this.bindCardActions(container);
        },

        renderDataTable(list, container) {
            const tbody = container.querySelector('tbody');
            if (!tbody) return;

            tbody.innerHTML = list.map(med => {
                const stockStatus = window.PharmaStore.getStockStatus(med);
                const expiryStatus = window.PharmaStore.getExpiryStatus(med);

                return `
                    <tr data-id="${med.id}" class="${expiryStatus === 'expired' ? 'row-expired' : (stockStatus === 'out-stock' ? 'row-out-stock' : '')}">
                        <td class="col-id"><strong>${med.id}</strong></td>
                        <td class="col-name">
                            <div class="table-med-preview">
                                <img src="${med.image || 'iimmgg/IMG_20260119_231802.jpg'}" alt="" class="table-thumb" onerror="this.src='iimmgg/IMG_20260119_231802.jpg'">
                                <div>
                                    <div class="table-med-name">${med.name}</div>
                                    <small class="text-muted">${med.supplier || 'Standard'}</small>
                                </div>
                            </div>
                        </td>
                        <td><span class="category-pill">${med.category}</span></td>
                        <td>
                            <div class="table-stock-cell">
                                <strong>${med.quantity}</strong>
                                <small class="text-muted">/ min ${med.minStock}</small>
                                ${window.PharmaUI.getStockBadge(med)}
                            </div>
                        </td>
                        <td><strong>${window.PharmaUI.formatCurrency(med.unitPrice)}</strong></td>
                        <td>
                            <div class="table-expiry-cell">
                                <span>${window.PharmaUI.formatDate(med.expiryDate)}</span>
                                ${window.PharmaUI.getExpiryBadge(med)}
                            </div>
                        </td>
                        <td class="col-actions text-right">
                            <div class="btn-group">
                                <button type="button" class="btn btn-sm btn-outline-primary" data-action="adjust-stock" data-id="${med.id}" title="Adjust Stock">&plusmn; Stock</button>
                                <button type="button" class="btn btn-sm btn-secondary" data-action="view-details" data-id="${med.id}" title="View Details">View</button>
                                <button type="button" class="btn btn-sm btn-secondary" data-action="edit-med" data-id="${med.id}" title="Edit Medicine">Edit</button>
                                <button type="button" class="btn btn-sm btn-icon-danger" data-action="delete-med" data-id="${med.id}" title="Delete">&times;</button>
                            </div>
                        </td>
                    </tr>
                `;
            }).join('');

            this.bindCardActions(tbody);
        },

        bindCardActions(parentEl) {
            parentEl.querySelectorAll('[data-action]').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const action = e.currentTarget.getAttribute('data-action');
                    const id = e.currentTarget.getAttribute('data-id');
                    if (!id) return;

                    if (action === 'adjust-stock') {
                        this.openStockAdjustModal(id);
                    } else if (action === 'view-details') {
                        this.openDetailsModal(id);
                    } else if (action === 'edit-med') {
                        this.openMedicineModal('edit', id);
                    } else if (action === 'delete-med') {
                        this.handleDeleteMedicine(id);
                    }
                });
            });
        },

        /* =========================================================================
         * MODAL ACTIONS: ADD / EDIT / DELETE / ADJUST / VIEW
         * ========================================================================= */
        openMedicineModal(mode, id = null) {
            const modal = document.getElementById('medicine-modal');
            const titleEl = document.getElementById('medicine-modal-title');
            const form = document.getElementById('medicine-form');
            if (!modal || !form) return;

            form.reset();
            document.getElementById('medicine-mode').value = mode;

            if (mode === 'edit' && id) {
                const med = window.PharmaStore.getById(id);
                if (!med) {
                    window.PharmaUI.showToast('Medicine not found', 'error');
                    return;
                }

                titleEl.textContent = `Edit Medicine: ${med.name}`;
                document.getElementById('medicine-id').value = med.id;
                document.getElementById('medicine-name').value = med.name || '';
                document.getElementById('medicine-category').value = med.category || '';
                document.getElementById('medicine-quantity').value = med.quantity !== undefined ? med.quantity : 0;
                document.getElementById('medicine-min-stock').value = med.minStock !== undefined ? med.minStock : 10;
                document.getElementById('medicine-unit-price').value = med.unitPrice !== undefined ? med.unitPrice : 0;
                document.getElementById('medicine-expiry-date').value = med.expiryDate || '';
                document.getElementById('medicine-supplier').value = med.supplier || '';
                document.getElementById('medicine-description').value = med.description || '';

                const imgSelect = document.getElementById('medicine-image-select');
                if (imgSelect) {
                    imgSelect.value = med.image || AVAILABLE_MEDICINE_IMAGES[0].path;
                }

                const preview = document.getElementById('medicine-form-img-preview');
                if (preview) {
                    preview.src = med.image || AVAILABLE_MEDICINE_IMAGES[0].path;
                }
            } else {
                titleEl.textContent = 'Add New Medicine';
                document.getElementById('medicine-id').value = window.PharmaStore.generateUniqueId();
                document.getElementById('medicine-min-stock').value = 10;
                document.getElementById('medicine-quantity').value = 20;
                document.getElementById('medicine-unit-price').value = '5.00';

                // Default expiry date = today + 1 year
                const d = new Date();
                d.setFullYear(d.getFullYear() + 1);
                document.getElementById('medicine-expiry-date').value = d.toISOString().split('T')[0];

                const imgSelect = document.getElementById('medicine-image-select');
                if (imgSelect) {
                    imgSelect.selectedIndex = 0;
                    const preview = document.getElementById('medicine-form-img-preview');
                    if (preview) preview.src = imgSelect.value;
                }
            }

            window.PharmaUI.openModal('medicine-modal');
        },

        handleMedicineFormSubmit() {
            const mode = document.getElementById('medicine-mode').value;
            const id = document.getElementById('medicine-id').value;

            const payload = {
                id,
                name: document.getElementById('medicine-name').value.trim(),
                category: document.getElementById('medicine-category').value.trim(),
                quantity: parseInt(document.getElementById('medicine-quantity').value, 10),
                minStock: parseInt(document.getElementById('medicine-min-stock').value, 10),
                unitPrice: parseFloat(document.getElementById('medicine-unit-price').value),
                expiryDate: document.getElementById('medicine-expiry-date').value,
                supplier: document.getElementById('medicine-supplier').value.trim(),
                image: document.getElementById('medicine-image-select').value,
                description: document.getElementById('medicine-description').value.trim()
            };

            try {
                if (mode === 'add') {
                    window.PharmaStore.add(payload);
                    window.PharmaUI.showToast(`"${payload.name}" has been added to inventory.`, 'success');
                } else {
                    window.PharmaStore.update(id, payload);
                    window.PharmaUI.showToast(`"${payload.name}" updated successfully.`, 'success');
                }

                window.PharmaUI.closeModal('medicine-modal');
                this.populateCategoryFilter();
                this.renderInventory();
            } catch (err) {
                window.PharmaUI.showToast(err.message, 'error');
            }
        },

        handleDeleteMedicine(id) {
            const med = window.PharmaStore.getById(id);
            if (!med) return;

            window.PharmaUI.confirm({
                title: 'Delete Medicine Record?',
                message: `Are you sure you want to permanently delete "${med.name}" (${med.id}) from the inventory? This cannot be undone.`,
                confirmText: 'Delete Record',
                confirmType: 'danger',
                onConfirm: () => {
                    try {
                        window.PharmaStore.delete(id);
                        window.PharmaUI.showToast(`"${med.name}" was removed from inventory.`, 'info');
                        this.populateCategoryFilter();
                        this.renderInventory();
                    } catch (err) {
                        window.PharmaUI.showToast(err.message, 'error');
                    }
                }
            });
        },

        openStockAdjustModal(id) {
            const med = window.PharmaStore.getById(id);
            if (!med) return;

            document.getElementById('stock-adjust-med-id').value = med.id;
            document.getElementById('stock-adjust-title').textContent = `Adjust Stock: ${med.name}`;
            document.getElementById('stock-adjust-current-qty').textContent = `${med.quantity} units`;
            document.getElementById('stock-adjust-qty').value = 5;
            document.getElementById('stock-adjust-reason').value = '';

            // Default radio
            const inRadio = document.querySelector('input[name="stock-adjust-type"][value="IN"]');
            if (inRadio) inRadio.checked = true;

            window.PharmaUI.openModal('stock-adjust-modal');
        },

        handleStockAdjustSubmit() {
            const id = document.getElementById('stock-adjust-med-id').value;
            const type = document.querySelector('input[name="stock-adjust-type"]:checked').value;
            const amount = parseInt(document.getElementById('stock-adjust-qty').value, 10);
            const reason = document.getElementById('stock-adjust-reason').value.trim();

            if (isNaN(amount) || amount <= 0) {
                window.PharmaUI.showToast('Please enter a valid positive adjustment quantity.', 'error');
                return;
            }

            const delta = type === 'IN' ? amount : -amount;

            try {
                const updated = window.PharmaStore.adjustStock(id, delta, reason);
                window.PharmaUI.showToast(
                    `Stock updated for ${updated.name}: New quantity is ${updated.quantity} units.`,
                    'success'
                );
                window.PharmaUI.closeModal('stock-adjust-modal');
                this.renderInventory();
            } catch (err) {
                window.PharmaUI.showToast(err.message, 'error');
            }
        },

        openDetailsModal(id) {
            const med = window.PharmaStore.getById(id);
            if (!med) return;

            const modal = document.getElementById('details-modal');
            if (!modal) return;

            const stockStatus = window.PharmaStore.getStockStatus(med);
            const expiryStatus = window.PharmaStore.getExpiryStatus(med);
            const days = window.PharmaStore.getDaysUntilExpiry(med.expiryDate);
            const valuation = (med.quantity || 0) * (med.unitPrice || 0);

            document.getElementById('details-med-title').textContent = med.name;
            document.getElementById('details-med-id').textContent = med.id;
            document.getElementById('details-med-category').textContent = med.category;
            document.getElementById('details-med-price').textContent = window.PharmaUI.formatCurrency(med.unitPrice);
            document.getElementById('details-med-supplier').textContent = med.supplier || 'Standard Supplier';
            document.getElementById('details-med-expiry').textContent = window.PharmaUI.formatDate(med.expiryDate);
            document.getElementById('details-med-days-remaining').textContent = window.PharmaUI.formatDaysRemaining(days);
            document.getElementById('details-med-qty').textContent = `${med.quantity} units (Threshold: ${med.minStock})`;
            document.getElementById('details-med-valuation').textContent = window.PharmaUI.formatCurrency(valuation);
            document.getElementById('details-med-description').textContent = med.description || 'No specific clinical instructions provided.';

            const img = document.getElementById('details-med-img');
            if (img) img.src = med.image || 'iimmgg/IMG_20260119_231802.jpg';

            const badgeBox = document.getElementById('details-med-badges');
            if (badgeBox) {
                badgeBox.innerHTML = `
                    ${window.PharmaUI.getStockBadge(med)}
                    ${window.PharmaUI.getExpiryBadge(med)}
                `;
            }

            // Quick action button in modal
            const editBtn = document.getElementById('details-action-edit');
            if (editBtn) {
                editBtn.onclick = () => {
                    window.PharmaUI.closeModal('details-modal');
                    this.openMedicineModal('edit', med.id);
                };
            }

            const adjustBtn = document.getElementById('details-action-adjust');
            if (adjustBtn) {
                adjustBtn.onclick = () => {
                    window.PharmaUI.closeModal('details-modal');
                    this.openStockAdjustModal(med.id);
                };
            }

            window.PharmaUI.openModal('details-modal');
        },

        /* =========================================================================
         * EXPIRY MONITORING PAGE LOGIC
         * ========================================================================= */
        initExpiryPage() {
            this.bindExpiryEvents();
            this.renderExpiryPage();
        },

        bindExpiryEvents() {
            const filterTabs = document.querySelectorAll('.expiry-tab-btn');
            filterTabs.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    filterTabs.forEach(b => b.classList.remove('active'));
                    e.currentTarget.classList.add('active');
                    this.renderExpiryPage();
                });
            });

            // Action to quarantine/dispose all expired medicines
            const clearExpiredBtn = document.getElementById('btn-quarantine-all-expired');
            if (clearExpiredBtn) {
                clearExpiredBtn.addEventListener('click', () => {
                    const stats = window.PharmaStore.getStatistics();
                    if (stats.expired === 0) {
                        window.PharmaUI.showToast('No expired medicines to quarantine.', 'info');
                        return;
                    }

                    window.PharmaUI.confirm({
                        title: 'Quarantine & Write-Off Expired Stock?',
                        message: `You are about to zero out stock for all ${stats.expired} expired medicine batches and mark them as quarantined for disposal. Proceed?`,
                        confirmText: 'Quarantine All Expired',
                        confirmType: 'danger',
                        onConfirm: () => {
                            const medicines = window.PharmaStore.getAll();
                            let updatedCount = 0;
                            medicines.forEach(m => {
                                if (window.PharmaStore.getExpiryStatus(m) === 'expired' && m.quantity > 0) {
                                    window.PharmaStore.adjustStock(m.id, -m.quantity, 'Quarantined and written off due to expiry');
                                    updatedCount++;
                                }
                            });
                            window.PharmaUI.showToast(`Quarantined ${updatedCount} expired batches successfully.`, 'success');
                            this.renderExpiryPage();
                        }
                    });
                });
            }
        },

        renderExpiryPage() {
            const stats = window.PharmaStore.getStatistics();

            // Update Metric Stat Badges
            const expCountEl = document.getElementById('expiry-metric-expired');
            if (expCountEl) expCountEl.textContent = stats.expired;

            const soonCountEl = document.getElementById('expiry-metric-soon');
            if (soonCountEl) soonCountEl.textContent = stats.expiringSoon;

            const validCountEl = document.getElementById('expiry-metric-valid');
            if (validCountEl) validCountEl.textContent = stats.totalMedicines - stats.expired - stats.expiringSoon;

            // Determine active filter tab
            const activeTab = document.querySelector('.expiry-tab-btn.active');
            const tabFilter = activeTab ? activeTab.getAttribute('data-filter') : 'critical';

            const allMeds = window.PharmaStore.getAll();
            let displayList = [];

            if (tabFilter === 'expired-only') {
                displayList = allMeds.filter(m => window.PharmaStore.getExpiryStatus(m) === 'expired');
            } else if (tabFilter === 'soon-only') {
                displayList = allMeds.filter(m => window.PharmaStore.getExpiryStatus(m) === 'expiring-soon');
            } else if (tabFilter === 'all') {
                displayList = [...allMeds].sort((a, b) => new Date(a.expiryDate) - new Date(b.expiryDate));
            } else {
                // 'critical' = expired + expiring soon
                displayList = allMeds.filter(m => {
                    const st = window.PharmaStore.getExpiryStatus(m);
                    return st === 'expired' || st === 'expiring-soon';
                }).sort((a, b) => new Date(a.expiryDate) - new Date(b.expiryDate));
            }

            const gridContainer = document.getElementById('expiry-items-grid');
            const emptyNotice = document.getElementById('expiry-empty-notice');

            if (!gridContainer) return;

            if (displayList.length === 0) {
                gridContainer.style.display = 'none';
                if (emptyNotice) emptyNotice.style.display = 'block';
                return;
            }

            if (emptyNotice) emptyNotice.style.display = 'none';
            gridContainer.style.display = 'grid';

            gridContainer.innerHTML = displayList.map(med => {
                const expStatus = window.PharmaStore.getExpiryStatus(med);
                const days = window.PharmaStore.getDaysUntilExpiry(med.expiryDate);
                const isOverdue = days < 0;

                return `
                    <div class="item-card ${expStatus === 'expired' ? 'expired' : 'expiring-card'}">
                        <div class="card-badges-row">
                            <span class="card-id-tag">${med.id}</span>
                            ${window.PharmaUI.getExpiryBadge(med)}
                        </div>

                        <div class="image img">
                            <img src="${med.image || 'iimmgg/IMG_20260119_231802.jpg'}" 
                                 alt="${med.name}" 
                                 loading="lazy"
                                 onerror="this.src='iimmgg/IMG_20260119_231802.jpg'">
                        </div>

                        <div class="card-info">
                            <h3 class="card-med-title">${med.name}</h3>
                            <p><strong>Category: </strong>${med.category}</p>
                            <p><strong>Stock Remaining: </strong>${med.quantity} units</p>
                            <p><strong>Expiry Date: </strong><span class="${isOverdue ? 'text-danger font-bold' : 'text-warning font-bold'}">${window.PharmaUI.formatDate(med.expiryDate)}</span></p>
                            
                            <div class="expiry-countdown-pill ${isOverdue ? 'pill-expired' : 'pill-soon'}">
                                ${window.PharmaUI.formatDaysRemaining(days)}
                            </div>
                        </div>

                        <div class="card-actions-bar">
                            <button type="button" class="btn btn-sm btn-outline-danger" data-action="quarantine-one" data-id="${med.id}">
                                Write Off / Zero Stock
                            </button>
                            <a href="inventory.html" class="btn btn-sm btn-secondary">
                                View in Inventory
                            </a>
                        </div>
                    </div>
                `;
            }).join('');

            // Bind single item quarantine
            gridContainer.querySelectorAll('[data-action="quarantine-one"]').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const id = e.currentTarget.getAttribute('data-id');
                    const med = window.PharmaStore.getById(id);
                    if (!med) return;

                    window.PharmaUI.confirm({
                        title: `Zero Stock for ${med.name}?`,
                        message: `Zero out current stock (${med.quantity} units) and log as written-off disposal?`,
                        confirmText: 'Zero Out Stock',
                        confirmType: 'danger',
                        onConfirm: () => {
                            window.PharmaStore.adjustStock(id, -med.quantity, 'Disposed and zeroed due to expiration');
                            window.PharmaUI.showToast(`Stock for ${med.name} zeroed out.`, 'info');
                            this.renderExpiryPage();
                        }
                    });
                });
            });
        }
    };

    // Auto-run on DOMContentLoaded
    document.addEventListener('DOMContentLoaded', () => {
        App.init();
    });

    window.PharmaApp = App;
})(window, document);
