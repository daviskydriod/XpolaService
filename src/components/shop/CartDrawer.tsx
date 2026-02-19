// FILE PATH: src/components/shop/CartDrawer.tsx
// Place this file at: src/components/shop/CartDrawer.tsx
import { useCart } from '@/contexts/CartContext';
import { formatPrice } from '@/data/shopData';

const CartDrawer = () => {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    cartTotal,
    cartCount,
    isCartOpen,
    setIsCartOpen,
  } = useCart();

  const currency = cart[0]?.currency;

  return (
    <>
      {/* Backdrop */}
      {isCartOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsCartOpen(false)}
        />
      )}

      {/* Drawer panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 shadow-2xl
          transform transition-transform duration-300 ease-in-out flex flex-col ${
          isCartOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Red top strip — Xpola brand */}
        <div className="h-1 bg-[#E02020]" />

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <h2 className="font-montserrat font-bold text-xl text-gray-900">Your Cart</h2>
            {cartCount > 0 && (
              <span className="bg-[#E02020] text-white text-xs font-bold px-2.5 py-0.5 rounded-full">
                {cartCount}
              </span>
            )}
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            aria-label="Close cart"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Item list */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-20 h-20 bg-red-50 flex items-center justify-center mb-5">
                <svg
                  className="w-9 h-9 text-[#E02020]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
              </div>
              <p className="font-montserrat font-bold text-gray-800 text-lg">Your cart is empty</p>
              <p className="font-poppins text-sm text-gray-400 mt-1">
                Browse our catalogue and add items
              </p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="mt-6 bg-[#E02020] text-white font-montserrat font-bold px-6 py-3 hover:bg-[#c01a1a] transition-colors text-sm uppercase tracking-wide"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-0 divide-y divide-gray-100">
              {cart.map(item => (
                <div key={item.id} className="flex gap-4 py-4">
                  {/* Thumbnail */}
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover flex-shrink-0 bg-gray-50"
                    onError={e => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&q=80';
                    }}
                  />

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <p className="font-poppins font-semibold text-sm text-gray-900 leading-snug">
                      {item.name}
                    </p>
                    <p className="text-xs font-semibold text-[#E02020] font-poppins mt-0.5">
                      {item.category}
                    </p>
                    <p className="font-montserrat font-bold text-sm text-gray-900 mt-1">
                      {formatPrice(item.price, item.currency)}
                    </p>

                    {/* Quantity stepper */}
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-7 h-7 border border-gray-200 flex items-center justify-center text-gray-600 hover:border-[#E02020] hover:text-[#E02020] transition-colors font-bold text-base"
                      >
                        −
                      </button>
                      <span className="w-5 text-center text-sm font-bold text-gray-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-7 h-7 border border-gray-200 flex items-center justify-center text-gray-600 hover:border-[#E02020] hover:text-[#E02020] transition-colors font-bold text-base"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Subtotal + remove */}
                  <div className="flex flex-col items-end justify-between flex-shrink-0">
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-gray-300 hover:text-[#E02020] transition-colors"
                      aria-label="Remove item"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                    <p className="font-montserrat font-bold text-gray-900 text-sm">
                      {formatPrice(item.price * item.quantity, item.currency)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="px-6 py-5 border-t border-gray-100 bg-gray-50">
            <div className="flex justify-between items-center mb-4">
              <span className="font-poppins text-gray-500 text-sm">Subtotal</span>
              <span className="font-montserrat font-extrabold text-2xl text-gray-900">
                {currency && formatPrice(cartTotal, currency)}
              </span>
            </div>
            <button className="w-full bg-[#E02020] text-white font-montserrat font-bold py-4 hover:bg-[#c01a1a] transition-colors uppercase tracking-widest text-sm">
              Proceed to Checkout
            </button>
            <p className="text-center text-xs text-gray-400 font-poppins mt-3">
              Shipping &amp; taxes calculated at checkout
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
