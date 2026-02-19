// FILE PATH: src/pages/Shop.tsx
// Place this file at: src/pages/Shop.tsx
import { useState, useMemo } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CTASection from '../components/CTASection';
import { useCountry } from '../contexts/CountryContext';
import { useCart } from '../contexts/CartContext';
import { nigeriaProducts, canadaProducts, nigeriaCategories, canadaCategories, formatPrice, Product } from '@/data/shopData';

// ─── CART DRAWER ──────────────────────────────────────────────────────────────
const CartDrawer = () => {
  const { cart, removeFromCart, updateQuantity, cartTotal, cartCount, isCartOpen, setIsCartOpen } = useCart();
  const currency = cart[0]?.currency;

  return (
    <>
      {isCartOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
          onClick={() => setIsCartOpen(false)}
        />
      )}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${
          isCartOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <h2 className="font-montserrat font-bold text-xl text-gray-900">Your Cart</h2>
            {cartCount > 0 && (
              <span className="bg-primary text-white text-xs font-bold px-2 py-0.5 rounded-full">{cartCount}</span>
            )}
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <p className="font-montserrat font-semibold text-gray-500">Your cart is empty</p>
              <p className="text-sm text-gray-400 mt-1">Add some products to get started</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map(item => (
                <div key={item.id} className="flex gap-4 p-3 bg-gray-50 rounded-xl">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-poppins font-medium text-sm text-gray-900 truncate">{item.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{formatPrice(item.price, item.currency)}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-6 h-6 rounded-full bg-white border border-gray-200 flex items-center justify-center text-sm font-bold hover:bg-gray-100"
                      >−</button>
                      <span className="text-sm font-semibold w-4 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-6 h-6 rounded-full bg-white border border-gray-200 flex items-center justify-center text-sm font-bold hover:bg-gray-100"
                      >+</button>
                    </div>
                  </div>
                  <div className="flex flex-col items-end justify-between">
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-gray-300 hover:text-red-400 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                    <p className="text-sm font-bold text-gray-900">
                      {formatPrice(item.price * item.quantity, item.currency)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div className="p-6 border-t border-gray-100 bg-gray-50">
            <div className="flex justify-between items-center mb-4">
              <span className="font-poppins text-gray-600">Subtotal</span>
              <span className="font-montserrat font-bold text-xl text-gray-900">
                {currency && formatPrice(cartTotal, currency)}
              </span>
            </div>
            <button className="w-full bg-primary text-white font-montserrat font-bold py-4 rounded-xl hover:bg-primary/90 transition-colors">
              Proceed to Checkout
            </button>
            <p className="text-center text-xs text-gray-400 mt-3">Shipping & taxes calculated at checkout</p>
          </div>
        )}
      </div>
    </>
  );
};

// ─── PRODUCT CARD ─────────────────────────────────────────────────────────────
const ProductCard = ({ product }: { product: Product }) => {
  const { addToCart } = useCart();
  const [adding, setAdding] = useState(false);

  const handleAdd = () => {
    if (!product.inStock) return;
    setAdding(true);
    addToCart(product);
    setTimeout(() => setAdding(false), 800);
  };

  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-primary/30 hover:shadow-xl transition-all duration-300">
      <div className="relative overflow-hidden aspect-square bg-gray-50">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&q=80';
          }}
        />
        {product.featured && (
          <span className="absolute top-3 left-3 bg-primary text-white text-xs font-bold px-2.5 py-1 rounded-full">
            Featured
          </span>
        )}
        {!product.inStock && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
            <span className="bg-gray-800 text-white text-sm font-bold px-4 py-2 rounded-full">Out of Stock</span>
          </div>
        )}
      </div>

      <div className="p-5">
        <span className="text-xs font-semibold text-primary/70 uppercase tracking-wide">{product.category}</span>
        <h3 className="font-montserrat font-bold text-gray-900 mt-1 mb-2 leading-tight line-clamp-2">{product.name}</h3>
        <p className="text-sm text-gray-500 line-clamp-2 mb-4 leading-relaxed">{product.description}</p>

        <div className="flex items-center gap-1 mb-4">
          {[...Array(5)].map((_, i) => (
            <svg key={i} className={`w-3.5 h-3.5 ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
          <span className="text-xs text-gray-400 ml-1">({product.reviews})</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="font-montserrat font-extrabold text-xl text-gray-900">
            {formatPrice(product.price, product.currency)}
          </span>
          <button
            onClick={handleAdd}
            disabled={!product.inStock || adding}
            className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-200 ${
              product.inStock
                ? adding
                  ? 'bg-green-500 text-white scale-95'
                  : 'bg-primary text-white hover:bg-primary/90 hover:scale-105'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            {adding ? '✓ Added' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── MAIN SHOP PAGE ───────────────────────────────────────────────────────────
const Shop = () => {
  const { currentData } = useCountry();
  const { cartCount, setIsCartOpen } = useCart();

  const isNigeria = currentData.code === 'NG';
  const products = isNigeria ? nigeriaProducts : canadaProducts;
  const categories = isNigeria ? nigeriaCategories : canadaCategories;
  const countryName = isNigeria ? 'Nigeria' : 'Canada';
  const currencyLabel = isNigeria ? '₦ NGN' : 'CA$ CAD';

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [showInStock, setShowInStock] = useState(false);

  const filtered = useMemo(() => {
    let result = [...products];

    if (selectedCategory !== 'All') {
      result = result.filter(p => p.category === selectedCategory);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }
    if (showInStock) {
      result = result.filter(p => p.inStock);
    }
    result.sort((a, b) => {
      if (sortBy === 'featured') return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0;
    });

    return result;
  }, [products, selectedCategory, searchQuery, sortBy, showInStock]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <CartDrawer />

      {/* Hero */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-primary/10 via-primary/5 to-background-secondary relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`, backgroundSize: '40px 40px' }} />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block bg-primary/10 text-primary font-semibold text-sm px-4 py-1.5 rounded-full mb-4">
              {currencyLabel} · {countryName} Store
            </span>
            <h1 className="font-montserrat font-extrabold text-4xl md:text-5xl lg:text-6xl text-foreground mb-5">
              Shop {countryName}
            </h1>
            <p className="font-poppins text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Industrial supplies, construction materials, and commercial goods — sourced and delivered across {countryName}.
            </p>

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="inline-flex items-center gap-2 bg-primary text-white font-montserrat font-bold px-6 py-3 rounded-xl hover:bg-primary/90 transition-all hover:scale-105"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              View Cart
              {cartCount > 0 && (
                <span className="bg-white text-primary text-xs font-extrabold px-2 py-0.5 rounded-full">{cartCount}</span>
              )}
            </button>
          </div>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="sticky top-[72px] z-30 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            {/* Search */}
            <div className="relative w-full md:w-72">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-primary text-sm"
              />
            </div>

            {/* Categories */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 flex-1">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                    selectedCategory === cat
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Sort + In Stock */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showInStock}
                  onChange={e => setShowInStock(e.target.checked)}
                  className="w-4 h-4 accent-primary"
                />
                In Stock Only
              </label>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as typeof sortBy)}
                className="px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-primary bg-white"
              >
                <option value="featured">Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <p className="text-gray-500 text-sm">
              Showing <span className="font-semibold text-gray-900">{filtered.length}</span> products
              {selectedCategory !== 'All' && <span> in <span className="text-primary font-semibold">{selectedCategory}</span></span>}
            </p>
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <p className="font-montserrat font-semibold text-gray-500">No products found</p>
              <button onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }} className="mt-3 text-primary text-sm font-semibold hover:underline">
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filtered.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      <CTASection />
      <Footer />
    </div>
  );
};

export default Shop;
