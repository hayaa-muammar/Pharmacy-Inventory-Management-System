/**
 * PharmaCare UI Helpers
 * Toast notifications, Modals, Confirmation Dialogs, Formatters, Badges & Navigation Sync
 */

(function (window) {
    'use strict';

    const PharmaUI = {
        // Format Currency ($X.XX)
        formatCurrency(num) {
            const val = Number(num) || 0;
            return '$' + val.toFixed(2);
        },

        // Format Date (e.g. 2026-11-20 -> Nov 20, 2026)
        formatDate(dateStr) {
            if (!dateStr) return 'N/A';
            const parts = dateStr.split('-');
            if (parts.length !== 3) return dateStr;
            const [y, m, d] = parts.map(Number);
            const date = new Date(y, m - 1, d);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        },

        // Format Days Remaining relative to today
        formatDaysRemaining(days) {
            if (days < 0) {
                const abs = Math.abs(days);
                return `Expired ${abs} day${abs === 1 ? '' : 's'} ago`;
            }
            if (days === 0) return 'Expires today';
            if (days === 1) return 'Expires tomorrow';
            if (days <= 90) return `Expires in ${days} days`;
            const months = Math.round(days / 30);
            return `Valid (${months} months left)`;
        },

        // Render stock badge HTML
        getStockBadge(medicine) {
            const status = window.PharmaStore.getStockStatus(medicine);
            const qty = Number(medicine.quantity) || 0;
            const min = Number(medicine.minStock) || 10;

            if (status === 'out-stock') {
                return `<span class="badge badge-out-stock" title="0 units remaining"><i class="badge-icon">✕</i> Out of Stock</span>`;
            }
            if (status === 'low-stock') {
                return `<span class="badge badge-low-stock" title="Threshold: ${min} units"><i class="badge-icon">⚠</i> Low Stock (${qty})</span>`;
            }
            return `<span class="badge badge-in-stock" title="${qty} units available"><i class="badge-icon">✓</i> In Stock (${qty})</span>`;
        },

        // Render expiry badge HTML
        getExpiryBadge(medicine) {
            const status = window.PharmaStore.getExpiryStatus(medicine);
            const days = window.PharmaStore.getDaysUntilExpiry(medicine.expiryDate);

            if (status === 'expired') {
                return `<span class="badge badge-expired" title="${this.formatDaysRemaining(days)}"><i class="badge-icon">⚠</i> Expired</span>`;
            }
            if (status === 'expiring-soon') {
                return `<span class="badge badge-expiring" title="${this.formatDaysRemaining(days)}"><i class="badge-icon">⏱</i> Expiring Soon (${days}d)</span>`;
            }
            return `<span class="badge badge-valid" title="${this.formatDaysRemaining(days)}"><i class="badge-icon">✓</i> Valid</span>`;
        },

        // Toast Notification System
        showToast(message, type = 'info', duration = 3500) {
            let container = document.getElementById('toast-container');
            if (!container) {
                container = document.createElement('div');
                container.id = 'toast-container';
                container.className = 'toast-container';
                container.setAttribute('aria-live', 'polite');
                document.body.appendChild(container);
            }

            const toast = document.createElement('div');
            toast.className = `toast toast-${type}`;

            const icons = {
                success: '✓',
                error: '✕',
                warning: '⚠',
                info: 'ℹ'
            };

            toast.innerHTML = `
                <span class="toast-icon">${icons[type] || 'ℹ'}</span>
                <span class="toast-message">${message}</span>
                <button type="button" class="toast-close" aria-label="Dismiss">&times;</button>
            `;

            const removeToast = () => {
                toast.classList.add('toast-fade-out');
                setTimeout(() => {
                    if (toast.parentElement) toast.parentElement.removeChild(toast);
                }, 300);
            };

            toast.querySelector('.toast-close').addEventListener('click', removeToast);

            container.appendChild(toast);

            setTimeout(removeToast, duration);
        },

        // Open Modal Dialog
        openModal(modalId) {
            const modal = document.getElementById(modalId);
            if (!modal) return;
            modal.classList.add('modal-open');
            modal.setAttribute('aria-hidden', 'false');
            document.body.classList.add('modal-backdrop-active');

            // Find first input or button and focus
            const focusable = modal.querySelector('input:not([type="hidden"]), select, textarea, button.btn-primary, button.modal-close-btn');
            if (focusable) {
                setTimeout(() => focusable.focus(), 80);
            }
        },

        // Close Modal Dialog
        closeModal(modalId) {
            const modal = typeof modalId === 'string' ? document.getElementById(modalId) : modalId;
            if (!modal) return;
            modal.classList.remove('modal-open');
            modal.setAttribute('aria-hidden', 'true');

            // Check if any other modal is open
            if (!document.querySelector('.modal.modal-open')) {
                document.body.classList.remove('modal-backdrop-active');
            }
        },

        // General Confirmation Dialog
        confirm({ title = 'Confirm Action', message = 'Are you sure you want to proceed?', confirmText = 'Confirm', confirmType = 'danger', onConfirm }) {
            let modal = document.getElementById('confirm-modal');
            if (!modal) {
                modal = document.createElement('div');
                modal.id = 'confirm-modal';
                modal.className = 'modal';
                modal.setAttribute('role', 'dialog');
                modal.setAttribute('aria-modal', 'true');
                modal.setAttribute('aria-hidden', 'true');
                modal.innerHTML = `
                    <div class="modal-dialog modal-dialog-sm">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h3 id="confirm-modal-title" class="modal-title">Confirm</h3>
                                <button type="button" class="modal-close-btn" data-close aria-label="Close dialog">&times;</button>
                            </div>
                            <div class="modal-body">
                                <p id="confirm-modal-message" class="confirm-message"></p>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-close>Cancel</button>
                                <button type="button" id="confirm-modal-action-btn" class="btn">Proceed</button>
                            </div>
                        </div>
                    </div>
                `;
                document.body.appendChild(modal);

                modal.querySelectorAll('[data-close]').forEach(btn => {
                    btn.addEventListener('click', () => PharmaUI.closeModal(modal));
                });

                modal.addEventListener('click', (e) => {
                    if (e.target === modal) PharmaUI.closeModal(modal);
                });
            }

            document.getElementById('confirm-modal-title').textContent = title;
            document.getElementById('confirm-modal-message').textContent = message;

            const actionBtn = document.getElementById('confirm-modal-action-btn');
            actionBtn.textContent = confirmText;
            actionBtn.className = `btn btn-${confirmType}`;

            // Replace button to clear previous event listeners cleanly
            const newBtn = actionBtn.cloneNode(true);
            actionBtn.parentNode.replaceChild(newBtn, actionBtn);

            newBtn.addEventListener('click', () => {
                PharmaUI.closeModal(modal);
                if (typeof onConfirm === 'function') {
                    onConfirm();
                }
            });

            this.openModal('confirm-modal');
        },

        // Sync and highlight active page in header navigation
        syncNavigation() {
            const path = window.location.pathname;
            const filename = path.substring(path.lastIndexOf('/') + 1) || 'index.html';

            const links = document.querySelectorAll('.top-bar nav ul li a');
            links.forEach(link => {
                const href = link.getAttribute('href');
                if (href === filename || (filename === '' && href === 'index.html')) {
                    link.classList.add('active');
                    link.setAttribute('aria-current', 'page');
                } else {
                    link.classList.remove('active');
                    link.removeAttribute('aria-current');
                }
            });

            this.updateNavBadges();
        },

        // Update Nav counter badges for expired and low-stock alerts
        updateNavBadges() {
            if (!window.PharmaStore) return;
            const stats = window.PharmaStore.getStatistics();

            // Expiry link badge
            const expiryLink = document.querySelector('.top-bar nav a[href="expiry.html"]');
            if (expiryLink) {
                let badge = expiryLink.querySelector('.nav-badge');
                if (!badge) {
                    badge = document.createElement('span');
                    badge.className = 'nav-badge nav-badge-danger';
                    expiryLink.appendChild(badge);
                }
                const totalAlerts = stats.expired + stats.expiringSoon;
                if (totalAlerts > 0) {
                    badge.textContent = totalAlerts;
                    badge.title = `${stats.expired} expired, ${stats.expiringSoon} expiring soon`;
                    badge.style.display = 'inline-flex';
                } else {
                    badge.style.display = 'none';
                }
            }

            // Inventory link badge
            const inventoryLink = document.querySelector('.top-bar nav a[href="inventory.html"]');
            if (inventoryLink) {
                let badge = inventoryLink.querySelector('.nav-badge');
                if (!badge) {
                    badge = document.createElement('span');
                    badge.className = 'nav-badge nav-badge-warning';
                    inventoryLink.appendChild(badge);
                }
                const stockAlerts = stats.lowStock + stats.outOfStock;
                if (stockAlerts > 0) {
                    badge.textContent = stockAlerts;
                    badge.title = `${stats.outOfStock} out of stock, ${stats.lowStock} low stock`;
                    badge.style.display = 'inline-flex';
                } else {
                    badge.style.display = 'none';
                }
            }
        },

        // Initialize global modal keyboard listeners (ESC key)
        initGlobalListeners() {
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    const openModal = document.querySelector('.modal.modal-open');
                    if (openModal) {
                        PharmaUI.closeModal(openModal);
                    }
                }
            });

            // Delegate backdrop clicks
            document.addEventListener('click', (e) => {
                if (e.target.classList.contains('modal') && e.target.classList.contains('modal-open')) {
                    PharmaUI.closeModal(e.target);
                }
                if (e.target.closest('[data-modal-close]')) {
                    const modal = e.target.closest('.modal');
                    if (modal) PharmaUI.closeModal(modal);
                }
            });

            // Listen for store data updates
            window.addEventListener('pharmacare:data-changed', () => {
                this.updateNavBadges();
            });
        }
    };

    window.PharmaUI = PharmaUI;
})(window);
