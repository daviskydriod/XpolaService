// FILE PATH: src/pages/ShopCategory.tsx
// Place this file at: src/pages/ShopCategory.tsx
import { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useCountry } from '../contexts/CountryContext';
import { useCart } from '../contexts/CartContext';
import {
  nigeriaProducts, canadaProducts,
  nigeriaCategories, canadaCategories,
  formatPrice, Product,
} from '@/data/shopData';

type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'rating' | 'newest';

// ─── CATEGORY IMAGES ─────────────────────────────────────────────────────────
const CAT_IMAGES: Record<string, string> = {
  'Oil & Gas Supplies':         'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&q=80',
  'Construction Materials':     'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80',
  'General Commerce':           'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80',
  'E-Commerce Goods':           'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&q=80',
  'Mining Equipment':           'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80',
  'Industrial Supplies':        'https://images.unsplash.com/photo-1565793298595-6a879b1d9492?w=800&q=80',
  'Transportation & Logistics': 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=800&q=80',
  default:                      'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&q=80',
};

// ─── PRODUCT CARD ─────────────────────────────────────────────────────────────
const ProductCard = ({ product }: { product: Product }) => {
  const { addToCart } = useCart();
  const [adding, setAdding]     = useState(false);
  const [wishlist, setWishlist] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!product.inStock) return;
    setAdding(true);
    addToCart(product);
    setTimeout(() => setAdding(false), 900);
  };

  return (
    <Link
      to={`/shop/product/${product.id}`}
      className="group bg-white border border-gray-100 hover:border-red-200 hover:shadow-lg transition-all duration-300 flex flex-col"
    >
      {/* Image */}
      <div className="relative overflow-hidden bg-gray-50" style={{ paddingBottom: '68%' }}>
        <img
          src={product.image}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={e => { (e.target as HTMLImageElement).src = CAT_IMAGES.default; }}
        />
        {product.featured && (
          <span className="absolute top-3 left-3 bg-[#E02020] text-white text-[10px] font-bold px-2 py-1 uppercase tracking-wider font-montserrat">
            Featured
          </span>
        )}
        {!product.inStock && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
            <span className="bg-gray-900 text-white text-xs font-bold px-3 py-1.5 uppercase tracking-widest">
              Out of Stock
            </span>
          </div>
        )}
        <button
          onClick={e => { e.preventDefault(); setWishlist(v => !v); }}
          className="absolute top-3 right-3 w-8 h-8 bg-white shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full"
        >
          <svg className={`w-4 h-4 transition-colors ${wishlist ? 'text-[#E02020] fill-[#E02020]' : 'text-gray-400'}`} stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col flex-1">
        <p className="text-[10px] font-bold text-[#E02020] uppercase tracking-widest font-poppins mb-1">
          {product.category}
        </p>
        <h3 className="font-montserrat font-bold text-gray-900 text-sm leading-snug mb-2 line-clamp-2">
          {product.name}
        </h3>
        <p className="font-poppins text-xs text-gray-400 line-clamp-2 mb-3 leading-relaxed">
          {product.description}
        </p>

        {/* Stars */}
        <div className="flex items-center gap-1 mb-3">
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <svg key={i} className={`w-3 h-3 ${i < Math.floor(product.rating) ? 'text-amber-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="text-[10px] text-gray-400 font-poppins">({product.reviews})</span>
        </div>

        {/* Price + CTA */}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-50">
          <div>
            <p className="font-montserrat font-extrabold text-base text-gray-900">
              {formatPrice(product.price, product.currency)}
            </p>
            <p className={`text-[10px] font-semibold font-poppins mt-0.5 ${product.inStock ? 'text-green-600' : 'text-gray-400'}`}>
              {product.inStock ? '● In Stock' : '○ Out of Stock'}
            </p>
          </div>
          <button
            onClick={handleAdd}
            disabled={!product.inStock || adding}
            className={`font-montserrat font-bold text-[11px] px-3 py-2 uppercase tracking-wide transition-all duration-200 flex items-center gap-1.5 ${
              !product.inStock
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : adding
                ? 'bg-green-500 text-white'
                : 'bg-[#E02020] text-white hover:bg-[#c01a1a]'
            }`}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            {adding ? 'Added!' : 'Add'}
          </button>
        </div>
      </div>
    </Link>
  );
};

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
const ShopCategory = () => {
  const { currentData } = useCountry();
  const { cartCount, setIsCartOpen } = useCart();
  const [searchParams, setSearchParams] = useSearchParams();

  const isNigeria   = currentData.code === 'NG';
  const allProducts = isNigeria ? nigeriaProducts : canadaProducts;
  const allCats     = isNigeria ? nigeriaCategories : canadaCategories;
  const shopPath    = isNigeria ? '/nigeria/shop' : '/canada/shop';
  const countryName = isNigeria ? 'Nigeria' : 'Canada';

  // State
  const initialCat = searchParams.get('cat') || 'All';
  const [activeCat,  setActiveCat]  = useState(initialCat);
  const [sortBy,     setSortBy]     = useState<SortOption>('featured');
  const [showInStock, setShowInStock] = useState(false);
  const [search,     setSearch]     = useState('');
  const [priceMax,   setPriceMax]   = useState<number | ''>('');
  const [gridCols,   setGridCols]   = useState<3 | 4>(3);

  const maxPrice = Math.max(...allProducts.map(p => p.price));

  const filtered = useMemo(() => {
    let r = [...allProducts];
    if (activeCat !== 'All') r = r.filter(p => p.category === activeCat);
    if (search.trim()) {
      const q = search.toLowerCase();
      r = r.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }
    if (showInStock) r = r.filter(p => p.inStock);
    if (priceMax !== '') r = r.filter(p => p.price <= Number(priceMax));
    r.sort((a, b) => {
      if (sortBy === 'featured')  return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating')    return b.rating - a.rating;
      if (sortBy === 'newest')    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      return 0;
    });
    return r;
  }, [allProducts, activeCat, search, showInStock, priceMax, sortBy]);

  const selectCat = (cat: string) => {
    setActiveCat(cat);
    setSearchParams(cat !== 'All' ? { cat } : {});
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#f8f8f8]">
      <Navbar />

      {/* ── Category Hero Banner ── */}
      <div className="pt-[72px]">
        <div className="relative h-48 md:h-60 overflow-hidden bg-gray-900">
          <img
            src={activeCat !== 'All' ? (CAT_IMAGES[activeCat] || CAT_IMAGES.default) : 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&q=80'}
            alt={activeCat}
            className="w-full h-full object-cover opacity-30 transition-all duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 to-gray-900/40" />
          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#E02020]" />

          <div className="absolute inset-0 flex items-center">
            <div className="container mx-auto px-4 md:px-8">
              {/* Breadcrumb */}
              <div className="flex items-center gap-2 mb-4">
                <Link to="/" className="font-poppins text-xs text-gray-400 hover:text-white transition-colors">Home</Link>
                <span className="text-gray-600 text-xs">/</span>
                <Link to={shopPath} className="font-poppins text-xs text-gray-400 hover:text-white transition-colors">Shop</Link>
                <span className="text-gray-600 text-xs">/</span>
                <span className="font-poppins text-xs text-white font-semibold">Categories</span>
                {activeCat !== 'All' && (
                  <>
                    <span className="text-gray-600 text-xs">/</span>
                    <span className="font-poppins text-xs text-[#E02020] font-semibold">{activeCat}</span>
                  </>
                )}
              </div>

              <h1 className="font-montserrat font-extrabold text-white text-3xl md:text-4xl mb-2">
                {activeCat === 'All' ? `All Categories` : activeCat}
              </h1>
              <p className="font-poppins text-gray-300 text-sm">
                {filtered.length} products available in {countryName}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-8">
        <div className="flex gap-6">

          {/* ── Sidebar ── */}
          <aside className="w-60 flex-shrink-0 hidden lg:block">

            {/* Categories */}
            <div className="bg-white border border-gray-100 mb-4">
              <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                <h3 className="font-montserrat font-bold text-gray-900 text-sm uppercase tracking-wider">Categories</h3>
              </div>
              <div className="py-2">
                {allCats.map(cat => {
                  const count = cat === 'All' ? allProducts.length : allProducts.filter(p => p.category === cat).length;
                  return (
                    <button
                      key={cat}
                      onClick={() => selectCat(cat)}
                      className={`w-full flex items-center justify-between px-4 py-2.5 text-sm font-poppins transition-all ${
                        activeCat === cat
                          ? 'bg-red-50 text-[#E02020] font-bold border-l-2 border-[#E02020]'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <span>{cat}</span>
                      <span className={`text-xs font-bold px-2 py-0.5 ${activeCat === cat ? 'bg-[#E02020] text-white' : 'bg-gray-100 text-gray-500'}`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Price filter */}
            <div className="bg-white border border-gray-100 mb-4">
              <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                <h3 className="font-montserrat font-bold text-gray-900 text-sm uppercase tracking-wider">Max Price</h3>
              </div>
              <div className="p-4">
                <input
                  type="range"
                  min={0}
                  max={maxPrice}
                  value={priceMax === '' ? maxPrice : priceMax}
                  onChange={e => setPriceMax(Number(e.target.value))}
                  className="w-full accent-[#E02020]"
                />
                <div className="flex justify-between mt-2">
                  <span className="font-poppins text-xs text-gray-400">
                    {formatPrice(0, isNigeria ? 'NGN' : 'CAD')}
                  </span>
                  <span className="font-montserrat font-bold text-sm text-[#E02020]">
                    {formatPrice(priceMax === '' ? maxPrice : Number(priceMax), isNigeria ? 'NGN' : 'CAD')}
                  </span>
                </div>
                {priceMax !== '' && (
                  <button
                    onClick={() => setPriceMax('')}
                    className="mt-2 text-xs text-gray-400 hover:text-[#E02020] font-poppins transition-colors"
                  >
                    Reset price
                  </button>
                )}
              </div>
            </div>

            {/* Availability */}
            <div className="bg-white border border-gray-100 mb-4">
              <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                <h3 className="font-montserrat font-bold text-gray-900 text-sm uppercase tracking-wider">Availability</h3>
              </div>
              <div className="p-4 space-y-2.5">
                {[
                  { label: `All Products (${allProducts.filter(p => activeCat === 'All' || p.category === activeCat).length})`, value: false },
                  { label: `In Stock Only (${allProducts.filter(p => (activeCat === 'All' || p.category === activeCat) && p.inStock).length})`, value: true },
                ].map(opt => (
                  <label key={String(opt.value)} className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="radio"
                      checked={showInStock === opt.value}
                      onChange={() => setShowInStock(opt.value)}
                      className="accent-[#E02020]"
                    />
                    <span className="font-poppins text-sm text-gray-600">{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Category image preview */}
            {activeCat !== 'All' && (
              <div className="relative overflow-hidden h-36">
                <img
                  src={CAT_IMAGES[activeCat] || CAT_IMAGES.default}
                  alt={activeCat}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent flex items-end p-3">
                  <p className="font-montserrat font-bold text-white text-sm">{activeCat}</p>
                </div>
              </div>
            )}
          </aside>

          {/* ── Main content ── */}
          <div className="flex-1 min-w-0">

            {/* Mobile category scroll */}
            <div className="flex gap-2 overflow-x-auto pb-2 mb-5 lg:hidden">
              {allCats.map(cat => (
                <button
                  key={cat}
                  onClick={() => selectCat(cat)}
                  className={`flex-shrink-0 px-4 py-2 text-xs font-bold font-poppins border transition-all ${
                    activeCat === cat
                      ? 'bg-[#E02020] text-white border-[#E02020]'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-[#E02020]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Top bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 p-3 bg-white border border-gray-100">
              {/* Search */}
              <div className="relative w-full sm:w-64">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search in this category..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-gray-200 text-sm font-poppins focus:outline-none focus:border-[#E02020] transition-colors"
                />
              </div>

              <div className="flex items-center gap-3 flex-shrink-0">
                <span className="font-poppins text-xs text-gray-400">{filtered.length} results</span>

                {/* Sort */}
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value as SortOption)}
                  className="py-2 px-3 border border-gray-200 text-xs font-poppins focus:outline-none focus:border-[#E02020] bg-white"
                >
                  <option value="featured">Featured</option>
                  <option value="price-asc">Price: Low → High</option>
                  <option value="price-desc">Price: High → Low</option>
                  <option value="rating">Top Rated</option>
                  <option value="newest">Newest</option>
                </select>

                {/* Grid toggle */}
                <div className="flex border border-gray-200">
                  {([3, 4] as const).map(n => (
                    <button
                      key={n}
                      onClick={() => setGridCols(n)}
                      className={`w-8 h-8 flex items-center justify-center transition-colors ${gridCols === n ? 'bg-[#E02020] text-white' : 'text-gray-400 hover:text-gray-700'}`}
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
                        {n === 3
                          ? <><rect x="0" y="0" width="4" height="4" rx="0.5"/><rect x="6" y="0" width="4" height="4" rx="0.5"/><rect x="12" y="0" width="4" height="4" rx="0.5"/><rect x="0" y="6" width="4" height="4" rx="0.5"/><rect x="6" y="6" width="4" height="4" rx="0.5"/><rect x="12" y="6" width="4" height="4" rx="0.5"/></>
                          : <><rect x="0" y="0" width="3" height="3" rx="0.5"/><rect x="4.3" y="0" width="3" height="3" rx="0.5"/><rect x="8.6" y="0" width="3" height="3" rx="0.5"/><rect x="12.9" y="0" width="3" height="3" rx="0.5"/><rect x="0" y="4.3" width="3" height="3" rx="0.5"/><rect x="4.3" y="4.3" width="3" height="3" rx="0.5"/><rect x="8.6" y="4.3" width="3" height="3" rx="0.5"/><rect x="12.9" y="4.3" width="3" height="3" rx="0.5"/></>
                        }
                      </svg>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* All categories overview (when "All" selected) */}
            {activeCat === 'All' && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                {allCats.filter(c => c !== 'All').map(cat => {
                  const count = allProducts.filter(p => p.category === cat).length;
                  const inStock = allProducts.filter(p => p.category === cat && p.inStock).length;
                  return (
                    <button key={cat} onClick={() => selectCat(cat)}
                      className="group relative overflow-hidden text-left">
                      <div className="relative h-32 overflow-hidden">
                        <img src={CAT_IMAGES[cat] || CAT_IMAGES.default} alt={cat}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          onError={e => { (e.target as HTMLImageElement).src = CAT_IMAGES.default; }} />
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/85 via-gray-900/20 to-transparent" />
                        <div className="absolute inset-0 bg-[#E02020]/0 group-hover:bg-[#E02020]/20 transition-colors duration-300" />
                        <div className="absolute bottom-0 left-0 right-0 p-3">
                          <p className="font-montserrat font-bold text-white text-sm">{cat}</p>
                          <p className="font-poppins text-white/70 text-[10px] mt-0.5">{count} products · {inStock} in stock</p>
                          <span className="inline-flex items-center gap-1 font-poppins text-[10px] text-[#E02020] font-bold mt-1.5 bg-white px-2 py-0.5">
                            Browse →
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Product grid */}
            {filtered.length === 0 ? (
              <div className="text-center py-20 bg-white border border-gray-100">
                <div className="w-14 h-14 bg-red-50 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-7 h-7 text-[#E02020]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <p className="font-montserrat font-bold text-gray-800 text-lg">No products found</p>
                <p className="font-poppins text-sm text-gray-400 mt-1">Try adjusting your filters</p>
                <button
                  onClick={() => { setSearch(''); setShowInStock(false); setPriceMax(''); selectCat('All'); }}
                  className="mt-4 bg-[#E02020] text-white font-montserrat font-bold px-5 py-2.5 text-sm uppercase tracking-wide hover:bg-[#c01a1a] transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className={`grid gap-4 ${gridCols === 4 ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'}`}>
                {filtered.map(p => <ProductCard key={p.id} product={p} />)}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Cart FAB */}
      <button
        onClick={() => setIsCartOpen(true)}
        className="fixed bottom-6 right-6 z-30 bg-[#E02020] text-white w-14 h-14 rounded-full shadow-2xl flex items-center justify-center hover:bg-[#c01a1a] transition-all hover:scale-110"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
        {cartCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-gray-900 text-white text-[10px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center">
            {cartCount}
          </span>
        )}
      </button>

      <Footer />
    </div>
  );
};

export default ShopCategory;
