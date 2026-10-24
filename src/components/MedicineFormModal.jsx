import React, { useState, useEffect } from 'react';
import { useInventory } from '../context/InventoryContext';
import { AVAILABLE_CATEGORIES, AVAILABLE_IMAGES } from '../data/initialMedicines';
import { X, Save, Plus, AlertCircle, Image as ImageIcon } from 'lucide-react';

export default function MedicineFormModal({ isOpen, onClose, medicineToEdit = null }) {
  const { addMedicine, updateMedicine, showToast } = useInventory();
  const isEditing = Boolean(medicineToEdit);

  const [formData, setFormData] = useState({
    name: '',
    category: 'Analgesic',
    quantity: '25',
    minStock: '10',
    unitPrice: '5.00',
    expiryDate: '',
    supplier: 'GlaxoSmithKline (GSK)',
    image: 'iimmgg/IMG_20260119_231802.jpg',
    description: ''
  });

  const [error, setError] = useState('');

  useEffect(() => {
    if (medicineToEdit) {
      setFormData({
        name: medicineToEdit.name || '',
        category: medicineToEdit.category || 'Analgesic',
        quantity: String(medicineToEdit.quantity ?? 0),
        minStock: String(medicineToEdit.minStock ?? 10),
        unitPrice: String(medicineToEdit.unitPrice ?? '5.00'),
        expiryDate: medicineToEdit.expiryDate || '',
        supplier: medicineToEdit.supplier || '',
        image: medicineToEdit.image || 'iimmgg/IMG_20260119_231802.jpg',
        description: medicineToEdit.description || ''
      });
      setError('');
    } else {
      // Default future date (approx 1.5 years ahead)
      const future = new Date();
      future.setFullYear(future.getFullYear() + 1);
      const defaultExp = future.toISOString().split('T')[0];

      setFormData({
        name: '',
        category: 'Analgesic',
        quantity: '30',
        minStock: '10',
        unitPrice: '6.50',
        expiryDate: defaultExp,
        supplier: 'GlaxoSmithKline (GSK)',
        image: 'iimmgg/IMG_20260119_231802.jpg',
        description: ''
      });
      setError('');
    }
  }, [medicineToEdit, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    try {
      if (isEditing) {
        updateMedicine(medicineToEdit.id, {
          name: formData.name,
          category: formData.category,
          quantity: parseInt(formData.quantity, 10),
          minStock: parseInt(formData.minStock, 10),
          unitPrice: parseFloat(formData.unitPrice),
          expiryDate: formData.expiryDate,
          supplier: formData.supplier,
          image: formData.image,
          description: formData.description
        });
      } else {
        addMedicine(formData);
      }
      onClose();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-card large" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              background: '#e6f6f1',
              color: '#075f4c',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {isEditing ? <Save size={18} /> : <Plus size={20} />}
            </div>
            <div>
              <h3 className="modal-title">
                {isEditing ? `Edit Record: ${medicineToEdit.id}` : 'Add New Pharmaceutical Record'}
              </h3>
              <p style={{ margin: '0.15rem 0 0', fontSize: '0.82rem', color: '#64748b' }}>
                {isEditing ? 'Update medicine specifications, stock levels, or expiry.' : 'Enter complete medicine details to register in the pharmacy inventory system.'}
              </p>
            </div>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
            {error && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                background: '#fee2e2',
                color: '#991b1b',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                fontSize: '0.88rem',
                marginBottom: '1.25rem'
              }}>
                <AlertCircle size={18} style={{ flexShrink: 0 }} />
                <span>{error}</span>
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
              {/* Medicine Name */}
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
                  Brand &amp; Generic Medicine Name *
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="e.g., Augmentin 1g (Amoxicillin/Clavulanate)"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '0.7rem 0.85rem',
                    fontSize: '0.95rem',
                    border: '1px solid #cbd5e1',
                    borderRadius: '8px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {/* Category */}
              <div>
                <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
                  Therapeutic Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '0.7rem 0.85rem',
                    fontSize: '0.92rem',
                    border: '1px solid #cbd5e1',
                    borderRadius: '8px',
                    boxSizing: 'border-box',
                    background: '#ffffff'
                  }}
                >
                  {AVAILABLE_CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Supplier */}
              <div>
                <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
                  Pharmaceutical Supplier / Manufacturer
                </label>
                <input
                  type="text"
                  name="supplier"
                  placeholder="e.g., GlaxoSmithKline (GSK)"
                  value={formData.supplier}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '0.7rem 0.85rem',
                    fontSize: '0.92rem',
                    border: '1px solid #cbd5e1',
                    borderRadius: '8px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {/* Initial Stock Quantity */}
              <div>
                <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
                  Current Stock Units *
                </label>
                <input
                  type="number"
                  name="quantity"
                  min="0"
                  step="1"
                  value={formData.quantity}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '0.7rem 0.85rem',
                    fontSize: '0.95rem',
                    fontWeight: 700,
                    border: '1px solid #cbd5e1',
                    borderRadius: '8px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {/* Safety Threshold */}
              <div>
                <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
                  Minimum Safety Threshold (Alert level) *
                </label>
                <input
                  type="number"
                  name="minStock"
                  min="0"
                  step="1"
                  value={formData.minStock}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '0.7rem 0.85rem',
                    fontSize: '0.95rem',
                    border: '1px solid #cbd5e1',
                    borderRadius: '8px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {/* Unit Price */}
              <div>
                <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
                  Unit Retail Price ($ USD) *
                </label>
                <input
                  type="number"
                  name="unitPrice"
                  min="0"
                  step="0.01"
                  value={formData.unitPrice}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '0.7rem 0.85rem',
                    fontSize: '0.95rem',
                    fontWeight: 700,
                    border: '1px solid #cbd5e1',
                    borderRadius: '8px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {/* Expiry Date */}
              <div>
                <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
                  Batch Expiry Date (YYYY-MM-DD) *
                </label>
                <input
                  type="date"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '0.7rem 0.85rem',
                    fontSize: '0.95rem',
                    border: '1px solid #cbd5e1',
                    borderRadius: '8px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {/* Verified Product Photo Selection with live preview */}
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
                  Packaging &amp; Bottle Photo (Verified local asset)
                </label>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <select
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    style={{
                      flex: 1,
                      padding: '0.7rem 0.85rem',
                      fontSize: '0.92rem',
                      border: '1px solid #cbd5e1',
                      borderRadius: '8px',
                      background: '#ffffff'
                    }}
                  >
                    {AVAILABLE_IMAGES.map(img => (
                      <option key={img.path} value={img.path}>
                        {img.label} ({img.path.replace('iimmgg/', '')})
                      </option>
                    ))}
                  </select>

                  {/* Thumbnail preview */}
                  <div style={{
                    width: '54px',
                    height: '54px',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    border: '1px solid #cbd5e1',
                    background: '#f1f5f9',
                    flexShrink: 0
                  }}>
                    <img
                      src={formData.image}
                      alt="Selected preview"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                  </div>
                </div>
              </div>

              {/* Clinical Description / Memo */}
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
                  Clinical Indications &amp; Dosage Description
                </label>
                <textarea
                  name="description"
                  rows={3}
                  placeholder="Enter therapeutic indications, formulation specifics, or storage warnings..."
                  value={formData.description}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '0.7rem 0.85rem',
                    fontSize: '0.9rem',
                    fontFamily: 'Inter, sans-serif',
                    border: '1px solid #cbd5e1',
                    borderRadius: '8px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary-outline" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary-emerald">
              <Save size={18} />
              <span>{isEditing ? 'Save Changes' : 'Register Medicine'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
