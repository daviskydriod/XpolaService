// FILE PATH: src/pages/ProductDetail.tsx
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CartDrawer from '../components/CartDrawer';
import { useCountry } from '../contexts/CountryContext';
import { useCart } from '../contexts/CartContext';
import {
  nigeriaProducts, canadaProducts,
  formatPrice, Product,
} from '@/data/shopData';

// ─── RELATED PRODUCT CARD (mini) ─────────────────────────────────────────────
const RelatedCard = ({ product }: { product: Product }) => {
  const { addToCart } = useCart();
  const [adding, setAdding] = useState(false);

  return (
    <Link
      to={`/shop/product/${product.id}`}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="group bg-white border border-gray-100 hover:border-red-200 hover:shadow-lg transition-all duration-300 flex flex-col"
    >
      <div className="relative overflow-hidden bg-gray-50" style={{ paddingBottom: '72%' }}>
        <img
          src={product.image}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={e => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&q=80'; }}
        />
        {product.featured && (
          <span className="absolute top-2 left-2 bg-[#E02020] text-white text-[9px] font-bold px-2 py-0.5 uppercase tracking-wider font-montserrat">Featured</span>
        )}
      </div>
      <div className="p-3">
        <p className="text-[9px] font-bold text-[#E02020] uppercase tracking-widest font-poppins mb-0.5">{product.category}</p>
        <p className="font-montserrat font-bold text-gray-900 text-xs line-clamp-2 leading-snug mb-2">{product.name}</p>
        <div className="flex items-center justify-between">
          <span className="font-montserrat font-extrabold text-sm text-gray-900">{formatPrice(product.price, product.currency)}</span>
          <button
            onClick={e => {
              e.preventDefault();
              setAdding(true);
              addToCart(product);
              setTimeout(() => setAdding(false), 900);
            }}
            disabled={!product.inStock || adding}
            className={`font-montserrat font-bold text-[10px] px-2.5 py-1.5 uppercase tracking-wide transition-all ${
              !product.inStock ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : adding ? 'bg-green-500 text-white' : 'bg-[#E02020] text-white hover:bg-[#c01a1a]'
            }`}
          >
            {adding ? '✓' : '+ Add'}
          </button>
        </div>
      </div>
    </Link>
  );
};

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentData } = useCountry();
  const { addToCart, setIsCartOpen, cartCount } = useCart();

  const isNigeria   = currentData.code === 'NG';
  const allProducts = isNigeria ? nigeriaProducts : canadaProducts;
  const shopPath    = isNigeria ? '/nigeria/shop' : '/canada/shop';
  const countryName = isNigeria ? 'Nigeria' : 'Canada';

  const product = [...nigeriaProducts, ...canadaProducts].find(p => p.id === id);

  const [qty,       setQty]       = useState(1);
  const [adding,    setAdding]    = useState(false);
  const [added,     setAdded]     = useState(false);
  const [activeTab, setActiveTab] = useState<'description' | 'specs' | 'shipping'>('description');
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => { window.scrollTo({ top: 0 }); }, [id]);

  if (!product) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <CartDrawer />
        <div className="container mx-auto px-4 pt-40 pb-20 text-center">
          <div className="w-20 h-20 bg-red-50 flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-[#E02020]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="font-montserrat font-bold text-2xl text-gray-900 mb-3">Product Not Found</h1>
          <p className="font-poppins text-gray-500 mb-8">This product doesn't exist or may have been removed.</p>
          <Link to={shopPath} className="inline-block bg-[#E02020] text-white font-montserrat font-bold px-8 py-4 hover:bg-[#c01a1a] transition-colors uppercase tracking-widest text-sm">
            Back to Shop
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const related = allProducts
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    if (!product.inStock) return;
    setAdding(true);
    for (let i = 0; i < qty; i++) addToCart(product);
    setTimeout(() => {
      setAdding(false);
      setAdded(true);
      setTimeout(() => setAdded(false), 2500);
    }, 600);
  };

  const handleBuyNow = () => {
    if (!product.inStock) return;
    for (let i = 0; i < qty; i++) addToCart(product);
    navigate('/checkout');
  };

  const images = [
    product.image,
    `${product.image.split('?')[0]}?w=400&q=80&crop=top`,
    `${product.image.split('?')[0]}?w=400&q=80&crop=center`,
  ];

  const SPECS: Record<string, string> = product.country === 'nigeria'
    ? { Standard: 'ISO / ANSI Certified', Origin: 'Verified Supplier', Warranty: '12 months', Country: 'Nigeria', Currency: 'NGN (₦)' }
    : { Standard: 'ASTM / CSA Certified', Origin: 'Verified Supplier', Warranty: '24 months', Country: 'Canada', Currency: 'CAD (CA$)' };

  return (
    <div className="min-h-screen bg-[#f8f8f8]">
      <Navbar />
      <CartDrawer />

      <div className="pt-[72px]">

        {/* ── Breadcrumb ── */}
        <div className="bg-white border-b border-gray-100">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center gap-2 text-xs font-poppins flex-wrap">
              <Link to="/" className="text-gray-400 hover:text-[#E02020] transition-colors">Home</Link>
              <span className="text-gray-300">/</span>
              <Link to={shopPath} className="text-gray-400 hover:text-[#E02020] transition-colors">Shop</Link>
              <span className="text-gray-300">/</span>
              <Link to={`${shopPath}/categories?cat=${encodeURIComponent(product.category)}`} className="text-gray-400 hover:text-[#E02020] transition-colors">{product.category}</Link>
              <span className="text-gray-300">/</span>
              <span className="text-gray-600 font-semibold line-clamp-1 max-w-[200px]">{product.name}</span>
            </div>
          </div>
        </div>

        {/* ── Main product section ── */}
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 bg-white border border-gray-100 p-6 md:p-8">

            {/* Left — Image gallery */}
            <div>
              <div className="relative overflow-hidden bg-gray-50 mb-3" style={{ paddingBottom: '72%' }}>
                <img
                  src={images[activeImg]}
                  alt={product.name}
                  className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
                  onError={e => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&q=80'; }}
                />
                <div className="absolute top-4 left-4 flex flex-col gap-1.5">
                  {product.featured && (
                    <span className="bg-amber-500 text-white text-xs font-bold px-2.5 py-1 uppercase tracking-wider font-montserrat">Featured</span>
                  )}
                  {!product.inStock && (
                    <span className="bg-gray-900 text-white text-xs font-bold px-2.5 py-1 uppercase tracking-wider font-montserrat">Out of Stock</span>
                  )}
                </div>
                <div className="absolute bottom-3 right-3 bg-black/40 text-white text-[10px] font-poppins px-2 py-1 flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                  Zoom
                </div>
              </div>

              <div className="flex gap-2">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`relative w-20 h-16 overflow-hidden flex-shrink-0 border-2 transition-all ${activeImg === i ? 'border-[#E02020]' : 'border-gray-200 hover:border-gray-400'}`}
                  >
                    <img src={img} alt={`View ${i + 1}`} className="w-full h-full object-cover"
                      onError={e => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&q=80'; }} />
                  </button>
                ))}
              </div>

              <div className="mt-4 flex items-center gap-2 text-sm font-poppins text-gray-500">
                <span className="text-base">{product.country === 'nigeria' ? '🇳🇬' : '🇨🇦'}</span>
                <span>Available in <strong className="text-gray-900">{product.country === 'nigeria' ? 'Nigeria' : 'Canada'}</strong> store</span>
              </div>
            </div>

            {/* Right — Product info */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-4 h-0.5 bg-[#E02020]" />
                <span className="font-poppins text-xs font-bold text-[#E02020] uppercase tracking-widest">{product.category}</span>
              </div>

              <h1 className="font-montserrat font-extrabold text-2xl md:text-3xl text-gray-900 leading-tight mb-4">
                {product.name}
              </h1>

              <div className="flex items-center gap-3 mb-5 pb-5 border-b border-gray-100">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'text-amber-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="font-poppins text-sm text-gray-600 font-semibold">{product.rating} / 5</span>
                <span className="font-poppins text-sm text-gray-400">({product.reviews} reviews)</span>
                <span className={`ml-auto text-xs font-bold px-2.5 py-1 font-poppins border ${product.inStock ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-600 border-red-200'}`}>
                  {product.inStock ? '● In Stock' : '○ Out of Stock'}
                </span>
              </div>

              <div className="mb-6">
                <p className="font-montserrat font-extrabold text-4xl text-gray-900">
                  {formatPrice(product.price, product.currency)}
                </p>
                <p className="font-poppins text-sm text-gray-400 mt-1">Per unit · Price excludes delivery</p>
              </div>

              <p className="font-poppins text-sm text-gray-600 leading-relaxed mb-6">{product.description}</p>

              {product.inStock && (
                <div className="flex items-center gap-4 mb-6">
                  <span className="font-montserrat font-bold text-sm text-gray-700 uppercase tracking-wide">Quantity</span>
                  <div className="flex items-center border border-gray-200">
                    <button onClick={() => setQty(q => Math.max(1, q - 1))}
                      className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-[#E02020] hover:bg-red-50 transition-colors font-bold text-lg border-r border-gray-200">
                      −
                    </button>
                    <span className="w-12 text-center font-montserrat font-bold text-gray-900">{qty}</span>
                    <button onClick={() => setQty(q => q + 1)}
                      className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-[#E02020] hover:bg-red-50 transition-colors font-bold text-lg border-l border-gray-200">
                      +
                    </button>
                  </div>
                  {qty > 1 && (
                    <span className="font-poppins text-sm text-gray-500">
                      = <strong className="text-gray-900">{formatPrice(product.price * qty, product.currency)}</strong>
                    </span>
                  )}
                </div>
              )}

              <div className="flex gap-3 mb-6">
                <button
                  onClick={handleAddToCart}
                  disabled={!product.inStock || adding}
                  className={`flex-1 flex items-center justify-center gap-2 font-montserrat font-bold py-4 text-sm uppercase tracking-widest transition-all ${
                    !product.inStock
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : added
                      ? 'bg-green-500 text-white'
                      : adding
                      ? 'bg-[#E02020]/80 text-white'
                      : 'bg-[#E02020] text-white hover:bg-[#c01a1a]'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={added ? "M5 13l4 4L19 7" : "M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"} />
                  </svg>
                  {added ? 'Added to Cart!' : adding ? 'Adding...' : 'Add to Cart'}
                </button>

                <button
                  onClick={handleBuyNow}
                  disabled={!product.inStock}
                  className="flex-1 bg-gray-900 text-white font-montserrat font-bold py-4 text-sm uppercase tracking-widest hover:bg-gray-800 transition-colors disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  Buy Now
                </button>
              </div>

              {/* ── Added confirmation — opens CartDrawer on click ── */}
              {added && (
                <div className="flex items-center justify-between bg-green-50 border border-green-200 px-4 py-3 mb-4">
                  <span className="font-poppins text-sm text-green-700 font-semibold">
                    ✓ {qty > 1 ? `${qty} items` : 'Item'} added to cart
                  </span>
                  <button
                    onClick={() => setIsCartOpen(true)}
                    className="font-montserrat font-bold text-xs text-[#E02020] uppercase tracking-wide hover:underline"
                  >
                    View Cart →
                  </button>
                </div>
              )}

              <div className="grid grid-cols-3 gap-3 pt-5 border-t border-gray-100">
                {[
                  { icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z', label: 'Quality Assured' },
                  { icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z', label: 'Secure Payment' },
                  { icon: 'M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4', label: 'Fast Delivery' },
                ].map(b => (
                  <div key={b.label} className="flex flex-col items-center text-center gap-1.5">
                    <div className="w-9 h-9 bg-red-50 flex items-center justify-center">
                      <svg className="text-[#E02020]" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: '18px', height: '18px' }}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={b.icon} />
                      </svg>
                    </div>
                    <span className="font-poppins text-[10px] text-gray-500 font-semibold leading-tight">{b.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Tabs ── */}
          <div className="mt-6 bg-white border border-gray-100">
            <div className="flex border-b border-gray-100">
              {(['description', 'specs', 'shipping'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-4 font-montserrat font-bold text-sm uppercase tracking-wide transition-all border-b-2 ${
                    activeTab === tab ? 'border-[#E02020] text-[#E02020]' : 'border-transparent text-gray-500 hover:text-gray-800'
                  }`}
                >
                  {tab === 'description' ? 'Description' : tab === 'specs' ? 'Specifications' : 'Shipping & Returns'}
                </button>
              ))}
            </div>

            <div className="p-6 md:p-8">
              {activeTab === 'description' && (
                <div className="max-w-3xl">
                  <h3 className="font-montserrat font-bold text-lg text-gray-900 mb-4">About This Product</h3>
                  <p className="font-poppins text-gray-600 leading-relaxed text-sm mb-4">{product.description}</p>
                  <p className="font-poppins text-gray-600 leading-relaxed text-sm">
                    This product is sourced directly from verified suppliers in {countryName} and undergoes quality
                    checks before dispatch. Xpola guarantees product authenticity and condition on delivery.
                    For bulk orders or custom requirements, please contact our sales team.
                  </p>
                  <div className="mt-6 bg-red-50 border-l-4 border-[#E02020] p-4">
                    <p className="font-montserrat font-bold text-gray-900 text-sm mb-1">Need bulk pricing?</p>
                    <p className="font-poppins text-sm text-gray-600">
                      Contact us for volume discounts on orders of 10+ units.{' '}
                      <Link to="/contact" className="text-[#E02020] font-semibold hover:underline">Get a quote →</Link>
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'specs' && (
                <div className="max-w-xl">
                  <h3 className="font-montserrat font-bold text-lg text-gray-900 mb-5">Technical Specifications</h3>
                  <div className="divide-y divide-gray-100">
                    {Object.entries({
                      ...SPECS,
                      'Product ID':   product.id,
                      'Rating':       `${product.rating} / 5 (${product.reviews} reviews)`,
                      'Availability': product.inStock ? 'In Stock' : 'Out of Stock',
                      'Added':        new Date(product.createdAt).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' }),
                    }).map(([key, val]) => (
                      <div key={key} className="flex items-center py-3">
                        <span className="font-poppins font-semibold text-sm text-gray-500 w-40 flex-shrink-0">{key}</span>
                        <span className="font-poppins text-sm text-gray-900">{val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'shipping' && (
                <div className="max-w-2xl space-y-5">
                  <h3 className="font-montserrat font-bold text-lg text-gray-900">Shipping & Returns</h3>
                  {[
                    {
                      icon: 'M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4',
                      title: 'Delivery',
                      body: `We ship to all states across ${countryName}. Standard delivery takes 3–5 business days. Express options available at checkout. Bulk orders may require additional lead time.`,
                    },
                    {
                      icon: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15',
                      title: 'Returns Policy',
                      body: 'Items may be returned within 7 days of delivery if they arrive damaged, defective, or not as described. Please contact our support team with photos of the issue.',
                    },
                    {
                      icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
                      title: 'Quality Guarantee',
                      body: 'All products are sourced from vetted suppliers and inspected before dispatch. If you receive an item that does not meet our quality standard, we will replace or refund it at no cost.',
                    },
                  ].map(item => (
                    <div key={item.title} className="flex gap-4 p-4 border border-gray-100">
                      <div className="w-10 h-10 bg-red-50 flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-[#E02020]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                        </svg>
                      </div>
                      <div>
                        <p className="font-montserrat font-bold text-gray-900 text-sm mb-1">{item.title}</p>
                        <p className="font-poppins text-sm text-gray-500 leading-relaxed">{item.body}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ── Related Products ── */}
          {related.length > 0 && (
            <div className="mt-8">
              <div className="flex items-end justify-between mb-5">
                <div>
                  <h2 className="font-montserrat font-extrabold text-2xl text-gray-900">Related Products</h2>
                  <p className="font-poppins text-sm text-gray-500 mt-0.5">More from {product.category}</p>
                </div>
                <Link
                  to={`${shopPath}/categories?cat=${encodeURIComponent(product.category)}`}
                  className="font-poppins text-sm text-[#E02020] font-semibold hover:underline flex items-center gap-1"
                >
                  View all
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </Link>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {related.map(p => <RelatedCard key={p.id} product={p} />)}
              </div>
            </div>
          )}
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

export default ProductDetail;
