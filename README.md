# PharmaCare - Pharmacy Inventory & Medication Safety Telemetry System

A state-of-the-art Pharmacy Inventory Management System built with **React 18**, **Vite**, and semantic **Vanilla CSS3**, featuring live inventory telemetry, automated batch expiry surveillance, and clinical analytics.

The original zero-dependency Vanilla HTML5/JS edition is also preserved in `reference_html/` and `index.vanilla.html`.

---

## 🚀 How to Run Locally

### Option 1: Modern React Application (Recommended)
1. Open PowerShell or Terminal in the project directory:
   ```bash
   cd "c:\Users\Abu Ahmad\Desktop\pharmacare-project"
   ```
2. Start the local Vite development server:
   ```bash
   npm run dev
   ```
   Open **`http://localhost:3000`** in Google Chrome, Microsoft Edge, or Firefox.

3. To create or test a production bundle:
   ```bash
   npm run build
   npm run preview
   ```
   Open **`http://localhost:4173`** to test the compiled static distribution.

### Option 2: Standalone Offline Vanilla Version (No Node.js Required)
1. Navigate to `c:\Users\Abu Ahmad\Desktop\pharmacare-project\reference_html` (or `index.vanilla.html` in the root).
2. Double-click `index.html`.
3. Runs purely offline in any web browser with `localStorage` persistence.

---

## 📁 Project Architecture & File Structure

```
pharmacare-project/
├── index.html                  # Vite React SPA entry point with Google Fonts & root mount
├── index.vanilla.html          # Preserved root mirror of standalone vanilla dashboard
├── reference_html/             # Complete preserved archive of original vanilla HTML pages
│   ├── index.html              # Vanilla Dashboard
│   ├── inventory.html          # Vanilla Inventory Manager
│   └── expiry.html             # Vanilla Expiry Monitor
├── src/                        # Modular React 18 Application
│   ├── main.jsx                # Application root mount and provider integration
│   ├── App.jsx                 # Page controller, layout management, and global modals
│   ├── context/
│   │   └── InventoryContext.jsx # React Context for state, CRUD, stock movements, and telemetry
│   ├── data/
│   │   └── initialMedicines.js # Expanded 52-medicine pharmaceutical dataset across 14 categories
│   ├── components/
│   │   ├── Navbar.jsx          # Header with live alert badges, navigation links, and quick actions
│   │   ├── Footer.jsx          # Professional healthcare footer with system status & telemetry
│   │   ├── Toast.jsx           # Non-blocking animated toast notifications
│   │   ├── ConfirmModal.jsx    # Accessible modal dialog for safe confirmation of destructive actions
│   │   ├── StockAdjustModal.jsx # Stock In / Stock Out modal with validation & reason presets
│   │   ├── MedicineDetailModal.jsx # SKU details, batch countdown, stock bar, and movement history
│   │   └── MedicineFormModal.jsx   # Add / Edit form with category selector & photo picker
│   ├── pages/
│   │   ├── DashboardPage.jsx   # Modernized homepage with KPI cards, health meter & activity log
│   │   ├── InventoryPage.jsx   # Dual Grid/Table view, live search, multi-filters, sorting, CSV export
│   │   ├── ExpiryPage.jsx      # Expiry Radar, financial loss calculations & bulk quarantine
│   │   └── AnalyticsPage.jsx   # Clinical reports, category breakdown & safety stock reorder list
│   └── styles/
│       └── react-enhancements.css # Component styles, glassmorphism, animations & responsive grid
├── style.css                   # Core healthcare CSS design system (tokens, colors, base styles)
├── public/                     # Static distribution assets copied on build
│   ├── logo.svg                # Vector SVG branding icon
│   └── iimmgg/                 # Verified medicine packaging photos
├── iimmgg/                     # Root photo library (15 verified photos + hero banner)
├── js/                         # Preserved modular vanilla scripts (store.js, ui.js, app.js, data.js)
├── package.json                # Dependencies: react, react-dom, lucide-react, vite
├── vite.config.js              # Vite configuration with React plugin & port 3000
├── dist/                       # Compiled production build
└── README.txt                  # Plain-text quick reference
```

---

## ✨ System Capabilities & Implemented Features

### 1. Modernized Homepage & Clinical Dashboard
- **Telemetry Hero Section:** Displays operational status badge, hero headline, quick stats (Active SKUs, Units in Dispensary, Stock Valuation, Expired Count), and instant jump shortcuts.
- **Dynamic KPI Stat Cards:** Total Medicines, Total Units in Stock, Portfolio Valuation ($), In-Stock Safe Batches, Low Stock Warnings, Expired Batches, and Batches Expiring in &le; 90 Days.
- **Stock Health Distribution Meter:** Visual segmented proportional bar demonstrating percentage of optimal vs low vs out-of-stock items.
- **Priority Action Banners:** Instant alert triggers for expired batches (with 1-click quarantine) and low-stock alerts.
- **Category Quick Glance:** Mini progress breakdown across top therapeutic drug classes.
- **Recent Movements Audit Trail:** Filterable log of recent inbound receipts and outbound dispensations.

### 2. Comprehensive Medicine Inventory Manager (`/inventory`)
- **Expanded 52-Record Pharmaceutical Dataset:** 52 realistic medicines across 14 categories (Analgesics, Antibiotics, Antacids, Cardiology, Dermatology, Diabetes, Gastric, Hydration, NSAIDs, Ophthalmology, Pain Relief, Respiratory, Supplements).
- **Dual View Modes:**
  - **Interactive Cards Grid:** Rich cards with verified photo preview, ID pill, status badges, stock level bar vs threshold, unit price, and expiry countdown.
  - **High-Density Table View:** Compact data table with column headers, thumbnail previews, and direct action icons.
- **Live Search & Multi-Filters:** Search by name, ID, category, supplier, or description; filter by category, stock status, or expiry status.
- **Multi-Field Sorting:** Name (A-Z, Z-A), Stock (Low-High, High-Low), Unit Price (Low-High, High-Low), Expiry Date (Soonest first, Furthest first).
- **CSV Data Export:** One-click download of filtered inventory records as a formatted `.csv` spreadsheet.
- **Add / Edit Medicine Modal:** Field validations, category suggestions, supplier, unit price, minimum safety threshold, expiry date, photo selection, and clinical notes.
- **Medicine Details Modal:** High-resolution preview, SKU valuation, stock health progress bar, supplier information, and movement history.

### 3. Expiry Monitoring Center (`/expiry`)
- **Automated Expiry Calculation:** Live calculation of exact days remaining or days overdue relative to current date.
- **Financial Risk Telemetry:** Calculates total units expired and estimated dollar write-off loss.
- **Schedule Tabs:**
  - *Complete Schedule* (all items sorted by soonest expiry date)
  - *Expired Batches Only* (urgent quarantine needed)
  - *Expiring in &le; 90 Days* (prioritize dispensing)
  - *Safe Batches* (adequate shelf life)
- **1-Click Batch Quarantine:** Confirmation modal to zero out all expired stock and create audit trail records in a single step.
- **Single-Item Quarantine / Write-Off:** Direct quarantine button on individual expired rows.

### 4. Analytics & Clinical Reports (`/analytics`)
- **Portfolio Financial Valuation:** Total capital tied up in pharmaceutical stock.
- **Category Asset Breakdown Table:** SKUs, Units in Stock, Category Valuation ($), Average Unit Price, and health breakdown per category.
- **Top 5 Highest Value Medicines:** Quick identification of high-cost inventory assets.
- **Safety Stock Reorder Recommendations:** Calculates inventory deficit and estimated restock cost for every medicine at or below safety threshold.
- **Logistics Throughput:** Total inbound restocked units vs outbound dispensed units.
- **Printable Reports:** Built-in print styling for clinical review meetings.

### 5. Stock Adjustments & Movement Audit
- **Quick Adjust Modal:** Easily Stock In (receive shipment) or Stock Out (dispense).
- **Negative Stock Prevention:** Strict validation prevents dispensing more units than currently in stock.
- **Clinical Reason Presets:** Shortcut buttons for common reasons (e.g., supplier shipment, prescription fulfillment, ward transfer, expired disposal).
- **Audit Logging:** Every adjustment records previous quantity, new quantity, delta, timestamp, and memo.

### 6. Data Persistence & Safety
- **Browser LocalStorage:** Automatically saves inventory and transaction history (`pharmacare_react_inventory_v2` and `pharmacare_react_transactions_v2`).
- **Demo Data Restoration:** "Reset Demo" button safely restores the complete 52-record sample dataset at any time.

---

## 🛠️ Verification & Build Status

The application has been compiled and validated locally:
- **`npm run build`**: Finished cleanly with 0 errors (`dist/` created with optimized JS/CSS bundles and copied public assets).
- **Development Server**: Configured on port `3000`.
- **Preview Server**: Configured and validated.
