// FILE PATH: src/pages/admin/AdminProducts.tsx
import { useState, useRef } from 'react';
import { useAdmin } from '../../contexts/AdminContext';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '@/lib/firebase';

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  country: 'nigeria' | 'canada';
  currency: string;
  image: string;
  inStock: boolean;
  featured?: boolean;
}

const EMPTY_PRODUCT: Omit<Product, 'id'> = {
  name: '', price: 0, description: '', category: '',
  country: 'nigeria', currency: 'NGN', image: '', inStock: true, featured: false,
};

const CATEGORIES_NG = ['Electronics', 'Fashion', 'Food & Drinks', 'Health & Beauty', 'Home & Living', 'Sports', 'Other'];
const CATEGORIES_CA = ['Electronics', 'Fashion', 'Groceries', 'Health & Beauty', 'Home & Garden', 'Sports', 'Other'];

// ─── IMAGE UPLOAD ─────────────────────────────────────────────────────────────
const ImageUploader = ({
  currentImage,
  onUpload,
  uploading,
  setUploading,
  progress,
  setProgress,
}: {
  currentImage: string;
  onUpload: (url: string) => void;
  uploading: boolean;
  setUploading: (v: boolean) => void;
  progress: number;
  setProgress: (v: number) => void;
}) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState(currentImage);
  const [error, setError] = useState('');

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) return setError('Only image files are allowed.');
    if (file.size > 5 * 1024 * 1024) return setError('Image must be under 5MB.');
    setError('');

    // Local preview
    const reader = new FileReader();
    reader.onload = e => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);

    // Upload to Firebase Storage
    setUploading(true);
    const storageRef = ref(storage, `products/${Date.now()}_${file.name.replace(/\s/g, '_')}`);
    const task = uploadBytesResumable(storageRef, file);

    task.on(
      'state_changed',
      snap => setProgress(Math.round((snap.bytesTransferred / snap.totalBytes) * 100)),
      err => { setError('Upload failed: ' + err.message); setUploading(false); },
      async () => {
        const url = await getDownloadURL(task.snapshot.ref);
        onUpload(url);
        setUploading(false);
        setProgress(0);
      },
    );
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  return (
    <div className="space-y-2">
      <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest">
        Product Image
      </label>

      {/* Drop zone */}
      <div
        onDrop={handleDrop}
        onDragOver={e => e.preventDefault()}
        onClick={() => fileRef.current?.click()}
        className="relative border-2 border-dashed border-gray-200 rounded-xl overflow-hidden cursor-pointer hover:border-[#E02020] transition-colors group"
        style={{ minHeight: 160 }}
      >
        {preview ? (
          <div className="relative">
            <img src={preview} alt="Preview" className="w-full h-40 object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <p className="text-white text-sm font-semibold">Click to change</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-40 text-gray-400">
            <svg className="w-10 h-10 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-sm font-medium">Click or drag image here</p>
            <p className="text-xs mt-1">PNG, JPG, WEBP up to 5MB</p>
          </div>
        )}

        {/* Progress overlay */}
        {uploading && (
          <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-3">
            <svg className="w-8 h-8 text-white animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            <div className="w-32 bg-white/20 rounded-full h-1.5">
              <div className="bg-white h-1.5 rounded-full transition-all" style={{ width: `${progress}%` }} />
            </div>
            <p className="text-white text-xs font-semibold">{progress}%</p>
          </div>
        )}
      </div>

      {/* Or paste URL */}
      <input
        type="url"
        placeholder="Or paste image URL..."
        value={preview.startsWith('data:') ? '' : preview}
        onChange={e => { setPreview(e.target.value); onUpload(e.target.value); }}
        className="w-full px-3 py-2 border border-gray-200 text-xs rounded-lg focus:outline-none focus:border-[#E02020] text-gray-700 placeholder-gray-400"
      />

      {error && <p className="text-xs text-red-500">{error}</p>}
      <input ref={fileRef} type="file" accept="image/*" className="hidden"
        onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
    </div>
  );
};

// ─── PRODUCT FORM ─────────────────────────────────────────────────────────────
const ProductForm = ({
  initial,
  onSave,
  onCancel,
}: {
  initial: Omit<Product, 'id'> & { id?: string };
  onSave: (p: Omit<Product, 'id'> & { id?: string }) => void;
  onCancel: () => void;
}) => {
  const [form, setForm]       = useState(initial);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress]   = useState(0);

  const set = (k: keyof typeof form, v: unknown) =>
    setForm(prev => ({ ...prev, [k]: v }));

  const cats = form.country === 'nigeria' ? CATEGORIES_NG : CATEGORIES_CA;

  const inputClass = "w-full px-3 py-2.5 border border-gray-200 text-sm rounded-lg focus:outline-none focus:border-[#E02020] text-gray-900 placeholder-gray-400";
  const labelClass = "block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5";

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-5">
      <h3 className="font-montserrat font-bold text-gray-900 text-base">
        {form.id ? 'Edit Product' : 'Add New Product'}
      </h3>

      {/* Image uploader */}
      <ImageUploader
        currentImage={form.image}
        onUpload={url => set('image', url)}
        uploading={uploading}
        setUploading={setUploading}
        progress={progress}
        setProgress={setProgress}
      />

      {/* Name */}
      <div>
        <label className={labelClass}>Product Name *</label>
        <input type="text" value={form.name} onChange={e => set('name', e.target.value)}
          placeholder="e.g. Wireless Headphones" required className={inputClass} />
      </div>

      {/* Price + Currency */}
      <div className="flex gap-3">
        <div className="flex-1">
          <label className={labelClass}>Price *</label>
          <input type="number" min="0" step="0.01" value={form.price}
            onChange={e => set('price', parseFloat(e.target.value) || 0)}
            placeholder="0.00" required className={inputClass} />
        </div>
        <div className="w-28">
          <label className={labelClass}>Currency</label>
          <select value={form.currency} onChange={e => set('currency', e.target.value)} className={inputClass}>
            <option value="NGN">NGN (₦)</option>
            <option value="CAD">CAD ($)</option>
          </select>
        </div>
      </div>

      {/* Country + Category */}
      <div className="flex gap-3">
        <div className="flex-1">
          <label className={labelClass}>Country *</label>
          <select value={form.country}
            onChange={e => {
              const c = e.target.value as 'nigeria' | 'canada';
              set('country', c);
              set('currency', c === 'nigeria' ? 'NGN' : 'CAD');
              set('category', '');
            }}
            className={inputClass}
          >
            <option value="nigeria">🇳🇬 Nigeria</option>
            <option value="canada">🇨🇦 Canada</option>
          </select>
        </div>
        <div className="flex-1">
          <label className={labelClass}>Category *</label>
          <select value={form.category} onChange={e => set('category', e.target.value)} className={inputClass}>
            <option value="">Select…</option>
            {cats.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {/* Description */}
      <div>
        <label className={labelClass}>Description</label>
        <textarea value={form.description} onChange={e => set('description', e.target.value)}
          placeholder="Product description..." rows={3}
          className={inputClass + ' resize-none'} />
      </div>

      {/* Toggles */}
      <div className="flex gap-6">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={form.inStock}
            onChange={e => set('inStock', e.target.checked)}
            className="w-4 h-4 accent-[#E02020]" />
          <span className="text-sm font-semibold text-gray-700">In Stock</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={!!form.featured}
            onChange={e => set('featured', e.target.checked)}
            className="w-4 h-4 accent-[#E02020]" />
          <span className="text-sm font-semibold text-gray-700">Featured</span>
        </label>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onCancel}
          className="flex-1 border border-gray-200 text-gray-600 font-semibold py-3 rounded-xl text-sm hover:bg-gray-50 transition-colors">
          Cancel
        </button>
        <button
          type="button"
          disabled={uploading || !form.name || !form.category}
          onClick={() => onSave(form)}
          className="flex-1 bg-[#E02020] text-white font-semibold py-3 rounded-xl text-sm hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {form.id ? 'Save Changes' : 'Add Product'}
        </button>
      </div>
    </div>
  );
};

// ─── MAIN AdminProducts ───────────────────────────────────────────────────────
const AdminProducts = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useAdmin();
  const [editing,   setEditing]   = useState<(Omit<Product, 'id'> & { id?: string }) | null>(null);
  const [search,    setSearch]    = useState('');
  const [filterCountry, setFilterCountry] = useState<'all' | 'nigeria' | 'canada'>('all');
  const [filterStock,   setFilterStock]   = useState<'all' | 'in' | 'out'>('all');
  const [deleteId,  setDeleteId]  = useState<string | null>(null);

  const filtered = products.filter(p => {
    const matchSearch  = p.name.toLowerCase().includes(search.toLowerCase()) ||
                         p.category.toLowerCase().includes(search.toLowerCase());
    const matchCountry = filterCountry === 'all' || p.country === filterCountry;
    const matchStock   = filterStock === 'all' ||
                         (filterStock === 'in' && p.inStock) ||
                         (filterStock === 'out' && !p.inStock);
    return matchSearch && matchCountry && matchStock;
  });

  const handleSave = (p: Omit<Product, 'id'> & { id?: string }) => {
    if (p.id) {
      updateProduct(p.id, p);
    } else {
      addProduct(p as Omit<Product, 'id'>);
    }
    setEditing(null);
  };

  const handleDelete = (id: string) => {
    deleteProduct(id);
    setDeleteId(null);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-montserrat font-bold text-xl text-gray-900">Products</h1>
          <p className="text-gray-500 text-sm">{products.length} total products</p>
        </div>
        <button
          onClick={() => setEditing({ ...EMPTY_PRODUCT })}
          className="flex items-center gap-2 bg-[#E02020] text-white font-semibold px-4 py-2.5 rounded-xl text-sm hover:bg-red-700 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Product
        </button>
      </div>

      {/* Form (when adding/editing) */}
      {editing && (
        <ProductForm
          initial={editing}
          onSave={handleSave}
          onCancel={() => setEditing(null)}
        />
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search products..." 
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#E02020] text-gray-900"
          />
        </div>
        <select value={filterCountry} onChange={e => setFilterCountry(e.target.value as typeof filterCountry)}
          className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#E02020] text-gray-700 bg-white">
          <option value="all">All Countries</option>
          <option value="nigeria">🇳🇬 Nigeria</option>
          <option value="canada">🇨🇦 Canada</option>
        </select>
        <select value={filterStock} onChange={e => setFilterStock(e.target.value as typeof filterStock)}
          className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#E02020] text-gray-700 bg-white">
          <option value="all">All Stock</option>
          <option value="in">In Stock</option>
          <option value="out">Out of Stock</option>
        </select>
      </div>

      {/* Product Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
          <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          <p className="text-gray-500 font-semibold">No products found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(product => (
            <div key={product.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              {/* Image */}
              <div className="relative h-44 bg-gray-100">
                {product.image ? (
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
                {/* Badges */}
                <div className="absolute top-2 left-2 flex gap-1.5">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${product.inStock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                    {product.inStock ? 'In Stock' : 'Out of Stock'}
                  </span>
                  {product.featured && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700">Featured</span>
                  )}
                </div>
                <span className="absolute top-2 right-2 text-lg">
                  {product.country === 'nigeria' ? '🇳🇬' : '🇨🇦'}
                </span>
              </div>

              {/* Info */}
              <div className="p-4">
                <p className="font-semibold text-gray-900 text-sm truncate">{product.name}</p>
                <p className="text-xs text-gray-400 mt-0.5">{product.category}</p>
                <p className="font-montserrat font-bold text-gray-900 mt-2">
                  {product.currency === 'NGN' ? '₦' : 'CA$'}{product.price?.toLocaleString()}
                </p>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => setEditing({ ...product })}
                    className="flex-1 flex items-center justify-center gap-1.5 border border-gray-200 text-gray-600 font-semibold py-2 rounded-lg text-xs hover:bg-gray-50 transition-colors"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit
                  </button>
                  <button
                    onClick={() => setDeleteId(product.id)}
                    className="flex-1 flex items-center justify-center gap-1.5 border border-red-100 text-red-500 font-semibold py-2 rounded-lg text-xs hover:bg-red-50 transition-colors"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete confirm modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="font-montserrat font-bold text-gray-900 text-center mb-2">Delete Product?</h3>
            <p className="text-sm text-gray-500 text-center mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)}
                className="flex-1 border border-gray-200 text-gray-600 font-semibold py-2.5 rounded-xl text-sm hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={() => handleDelete(deleteId)}
                className="flex-1 bg-red-600 text-white font-semibold py-2.5 rounded-xl text-sm hover:bg-red-700">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
