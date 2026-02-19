// FILE PATH: src/components/admin/AdminProductForm.tsx
// Place this file at: src/components/admin/AdminProductForm.tsx
import { useState } from 'react';
import { Product, nigeriaCategories, canadaCategories } from '@/data/shopData';

export interface ProductFormData {
  name: string;
  description: string;
  price: string;
  country: 'nigeria' | 'canada';
  category: string;
  image: string;
  inStock: boolean;
  featured: boolean;
}

export const emptyProductForm: ProductFormData = {
  name: '',
  description: '',
  price: '',
  country: 'nigeria',
  category: 'Oil & Gas Supplies',
  image: '',
  inStock: true,
  featured: false,
};

interface AdminProductFormProps {
  initial?: Product;
  onSave: (data: ProductFormData) => void;
  onClose: () => void;
}

const AdminProductForm = ({ initial, onSave, onClose }: AdminProductFormProps) => {
  const [form, setForm] = useState<ProductFormData>(
    initial
      ? { ...initial, price: String(initial.price) }
      : emptyProductForm
  );
  const [imgError, setImgError] = useState(false);

  const categories =
    form.country === 'nigeria' ? nigeriaCategories.slice(1) : canadaCategories.slice(1);

  const set = (key: keyof ProductFormData, value: string | boolean) =>
    setForm(prev => ({ ...prev, [key]: value }));

  const handleCountryChange = (country: 'nigeria' | 'canada') => {
    const cats =
      country === 'nigeria' ? nigeriaCategories.slice(1) : canadaCategories.slice(1);
    setForm(prev => ({ ...prev, country, category: cats[0] }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Red brand strip */}
        <div className="h-1 bg-[#E02020]" />

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <h2 className="font-montserrat font-bold text-xl text-gray-900">
            {initial ? 'Edit Product' : 'Add New Product'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Store selector */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 font-montserrat">
              Store *
            </label>
            <div className="flex gap-3">
              {(['nigeria', 'canada'] as const).map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => handleCountryChange(c)}
                  className={`flex-1 py-3 border-2 text-sm font-bold font-montserrat uppercase tracking-wide transition-all ${
                    form.country === c
                      ? 'border-[#E02020] bg-[#E02020] text-white'
                      : 'border-gray-200 text-gray-500 hover:border-gray-400'
                  }`}
                >
                  {c === 'nigeria' ? '🇳🇬 ' : '🇨🇦 '}
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Product name */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 font-montserrat">
              Product Name *
            </label>
            <input
              type="text"
              value={form.name}
              onChange={e => set('name', e.target.value)}
              required
              placeholder="e.g. Industrial Safety Helmet"
              className="w-full px-4 py-3 border border-gray-200 focus:outline-none focus:border-[#E02020] text-sm font-poppins transition-colors"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 font-montserrat">
              Description *
            </label>
            <textarea
              value={form.description}
              onChange={e => set('description', e.target.value)}
              required
              rows={3}
              placeholder="Describe the product clearly..."
              className="w-full px-4 py-3 border border-gray-200 focus:outline-none focus:border-[#E02020] text-sm font-poppins resize-none transition-colors"
            />
          </div>

          {/* Price + Category */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 font-montserrat">
                Price ({form.country === 'nigeria' ? '₦' : 'CA$'}) *
              </label>
              <input
                type="number"
                value={form.price}
                onChange={e => set('price', e.target.value)}
                required
                min="0"
                placeholder="0"
                className="w-full px-4 py-3 border border-gray-200 focus:outline-none focus:border-[#E02020] text-sm font-poppins transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 font-montserrat">
                Category *
              </label>
              <select
                value={form.category}
                onChange={e => set('category', e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 focus:outline-none focus:border-[#E02020] text-sm font-poppins bg-white transition-colors"
              >
                {categories.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 font-montserrat">
              Image URL
            </label>
            <input
              type="url"
              value={form.image}
              onChange={e => { set('image', e.target.value); setImgError(false); }}
              placeholder="https://..."
              className="w-full px-4 py-3 border border-gray-200 focus:outline-none focus:border-[#E02020] text-sm font-poppins transition-colors"
            />
            {form.image && !imgError && (
              <img
                src={form.image}
                alt="preview"
                className="mt-2 w-full h-36 object-cover border border-gray-100"
                onError={() => setImgError(true)}
              />
            )}
          </div>

          {/* Toggles */}
          <div className="flex gap-6 pt-1">
            {[
              { key: 'inStock' as keyof ProductFormData, label: 'In Stock' },
              { key: 'featured' as keyof ProductFormData, label: 'Mark as Featured' },
            ].map(toggle => (
              <label key={toggle.key} className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form[toggle.key] as boolean}
                  onChange={e => set(toggle.key, e.target.checked)}
                  className="w-4 h-4 accent-[#E02020]"
                />
                <span className="text-sm font-semibold text-gray-700 font-poppins">
                  {toggle.label}
                </span>
              </label>
            ))}
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 pt-2 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 border border-gray-200 text-sm font-bold text-gray-600 font-montserrat hover:bg-gray-50 transition-colors uppercase tracking-wide"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 bg-[#E02020] text-white text-sm font-bold font-montserrat hover:bg-[#c01a1a] transition-colors uppercase tracking-wide"
            >
              {initial ? 'Update Product' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminProductForm;
