// FILE PATH: src/pages/admin/AdminProducts.tsx
// Place this file at: src/pages/admin/AdminProducts.tsx
import { useState } from 'react';
import { useAdmin } from '../../contexts/AdminContext';
import { Product, nigeriaCategories, canadaCategories, formatPrice } from '@/data/shopData';

type FormData = {
  name: string;
  description: string;
  price: string;
  country: 'nigeria' | 'canada';
  category: string;
  image: string;
  inStock: boolean;
  featured: boolean;
};

const emptyForm: FormData = {
  name: '',
  description: '',
  price: '',
  country: 'nigeria',
  category: 'Oil & Gas Supplies',
  image: '',
  inStock: true,
  featured: false,
};

// ─── PRODUCT FORM MODAL ───────────────────────────────────────────────────────
const ProductFormModal = ({
  initial,
  onSave,
  onClose,
}: {
  initial?: Product;
  onSave: (data: FormData) => void;
  onClose: () => void;
}) => {
  const [form, setForm] = useState<FormData>(
    initial
      ? { ...initial, price: String(initial.price) }
      : emptyForm
  );

  const categories = form.country === 'nigeria' ? nigeriaCategories.slice(1) : canadaCategories.slice(1);

  const set = (key: keyof FormData, value: string | boolean) =>
    setForm(prev => ({ ...prev, [key]: value }));

  const handleCountryChange = (country: 'nigeria' | 'canada') => {
    const cats = country === 'nigeria' ? nigeriaCategories.slice(1) : canadaCategories.slice(1);
    setForm(prev => ({ ...prev, country, category: cats[0] }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="font-montserrat font-bold text-xl text-gray-900">
            {initial ? 'Edit Product' : 'Add New Product'}
          </h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Country */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Country Store</label>
            <div className="flex gap-3">
              {(['nigeria', 'canada'] as const).map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => handleCountryChange(c)}
                  className={`flex-1 py-2.5 rounded-xl border-2 text-sm font-bold capitalize transition-all ${
                    form.country === c
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-gray-200 text-gray-500 hover:border-gray-300'
                  }`}
                >
                  {c === 'nigeria' ? '🇳🇬' : '🇨🇦'} {c}
                </button>
              ))}
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Product Name *</label>
            <input
              type="text"
              value={form.name}
              onChange={e => set('name', e.target.value)}
              required
              placeholder="e.g. Industrial Safety Helmet"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-primary text-sm"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Description *</label>
            <textarea
              value={form.description}
              onChange={e => set('description', e.target.value)}
              required
              rows={3}
              placeholder="Describe the product..."
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-primary text-sm resize-none"
            />
          </div>

          {/* Price + Category */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Price ({form.country === 'nigeria' ? '₦ NGN' : 'CA$'}) *
              </label>
              <input
                type="number"
                value={form.price}
                onChange={e => set('price', e.target.value)}
                required
                min="0"
                placeholder="0"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-primary text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Category *</label>
              <select
                value={form.category}
                onChange={e => set('category', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-primary text-sm bg-white"
              >
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          {/* Image */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Image URL</label>
            <input
              type="url"
              value={form.image}
              onChange={e => set('image', e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-primary text-sm"
            />
            {form.image && (
              <img src={form.image} alt="preview" className="mt-2 w-full h-32 object-cover rounded-lg" onError={e => (e.currentTarget.style.display = 'none')} />
            )}
          </div>

          {/* Toggles */}
          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.inStock} onChange={e => set('inStock', e.target.checked)} className="w-4 h-4 accent-primary" />
              <span className="text-sm font-semibold text-gray-700">In Stock</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.featured} onChange={e => set('featured', e.target.checked)} className="w-4 h-4 accent-primary" />
              <span className="text-sm font-semibold text-gray-700">Featured</span>
            </label>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-3 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50">
              Cancel
            </button>
            <button type="submit" className="flex-1 py-3 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/90 transition-colors">
              {initial ? 'Update Product' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ─── MAIN ADMIN PRODUCTS ──────────────────────────────────────────────────────
const AdminProducts = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useAdmin();
  const [countryFilter, setCountryFilter] = useState<'all' | 'nigeria' | 'canada'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | undefined>();
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const filtered = products.filter(p => {
    const matchCountry = countryFilter === 'all' || p.country === countryFilter;
    const matchSearch = !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCountry && matchSearch;
  });

  const handleSave = (form: FormData) => {
    if (editProduct) {
      updateProduct(editProduct.id, {
        ...form,
        price: Number(form.price),
        currency: form.country === 'nigeria' ? 'NGN' : 'CAD',
      });
    } else {
      addProduct({
        ...form,
        price: Number(form.price),
        currency: form.country === 'nigeria' ? 'NGN' : 'CAD',
      });
    }
    setShowModal(false);
    setEditProduct(undefined);
  };

  const handleEdit = (product: Product) => {
    setEditProduct(product);
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    deleteProduct(id);
    setDeleteConfirm(null);
  };

  return (
    <div className="space-y-6">
      {showModal && (
        <ProductFormModal
          initial={editProduct}
          onSave={handleSave}
          onClose={() => { setShowModal(false); setEditProduct(undefined); }}
        />
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-montserrat font-bold text-2xl text-gray-900">Products</h1>
          <p className="text-gray-500 text-sm mt-0.5">{products.length} total products across both stores</p>
        </div>
        <button
          onClick={() => { setEditProduct(undefined); setShowModal(true); }}
          className="flex items-center gap-2 bg-primary text-white font-montserrat font-bold px-5 py-2.5 rounded-xl hover:bg-primary/90 transition-all hover:scale-105"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-xs">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-primary text-sm"
          />
        </div>
        <div className="flex gap-2">
          {(['all', 'nigeria', 'canada'] as const).map(c => (
            <button
              key={c}
              onClick={() => setCountryFilter(c)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold capitalize transition-all ${
                countryFilter === c ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {c === 'nigeria' ? '🇳🇬 ' : c === 'canada' ? '🇨🇦 ' : ''}{c}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wide">Product</th>
                <th className="text-left px-4 py-4 text-xs font-bold text-gray-500 uppercase tracking-wide">Category</th>
                <th className="text-left px-4 py-4 text-xs font-bold text-gray-500 uppercase tracking-wide">Price</th>
                <th className="text-left px-4 py-4 text-xs font-bold text-gray-500 uppercase tracking-wide">Store</th>
                <th className="text-left px-4 py-4 text-xs font-bold text-gray-500 uppercase tracking-wide">Status</th>
                <th className="text-left px-4 py-4 text-xs font-bold text-gray-500 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-400">
                    <p className="font-semibold">No products found</p>
                  </td>
                </tr>
              ) : filtered.map(product => (
                <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-10 h-10 object-cover rounded-lg flex-shrink-0 bg-gray-100"
                        onError={e => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&q=80'; }}
                      />
                      <div>
                        <p className="font-semibold text-sm text-gray-900 max-w-[200px] truncate">{product.name}</p>
                        <p className="text-xs text-gray-400">{product.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-lg font-medium">{product.category}</span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="font-bold text-sm text-gray-900">{formatPrice(product.price, product.currency)}</span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-sm">{product.country === 'nigeria' ? '🇳🇬 Nigeria' : '🇨🇦 Canada'}</span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex flex-col gap-1">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full w-fit ${product.inStock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                        {product.inStock ? 'In Stock' : 'Out of Stock'}
                      </span>
                      {product.featured && (
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full w-fit bg-yellow-100 text-yellow-700">Featured</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(product)}
                        className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100 transition-colors"
                        title="Edit"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      {deleteConfirm === product.id ? (
                        <div className="flex items-center gap-1">
                          <button onClick={() => handleDelete(product.id)} className="text-xs bg-red-500 text-white px-2 py-1 rounded-lg font-bold hover:bg-red-600">Confirm</button>
                          <button onClick={() => setDeleteConfirm(null)} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-lg hover:bg-gray-200">Cancel</button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDeleteConfirm(product.id)}
                          className="w-8 h-8 rounded-lg bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100 transition-colors"
                          title="Delete"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminProducts;
