// FILE PATH: src/pages/OrderSuccess.tsx
// Place this file at: src/pages/OrderSuccess.tsx
import { useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useCart } from '../contexts/CartContext';
import { formatPrice } from '@/data/shopData';

interface OrderSuccessState {
  reference: string;
  customerName: string;
  email: string;
  total: number;
  currency: 'NGN' | 'CAD';
  itemCount: number;
  country: string;
}

const OrderSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { clearCart } = useCart();

  const state = location.state as OrderSuccessState | null;

  // Clear cart on successful payment
  useEffect(() => {
    if (state?.reference) {
      clearCart();
    } else {
      // No state = someone navigated here directly, send them home
      navigate('/', { replace: true });
    }
  }, []);

  if (!state) return null;

  const shopPath = state.country === 'Nigeria' ? '/nigeria/shop' : '/canada/shop';

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Green top strip — success state */}
      <div className="h-1 bg-green-500 mt-[72px]" />

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-lg mx-auto">

          {/* Success card */}
          <div className="text-center mb-8">
            {/* Animated checkmark circle */}
            <div className="relative w-24 h-24 mx-auto mb-6">
              <div className="w-24 h-24 bg-green-50 border-4 border-green-500 flex items-center justify-center mx-auto">
                <svg
                  className="w-12 h-12 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>

            <h1 className="font-montserrat font-extrabold text-3xl text-gray-900 mb-2">
              Payment Successful!
            </h1>
            <p className="font-poppins text-gray-500 text-base">
              Thank you, <span className="font-semibold text-gray-900">{state.customerName}</span>.
              Your order has been received.
            </p>
          </div>

          {/* Order details card */}
          <div className="border border-gray-100 shadow-sm mb-6">
            {/* Red strip */}
            <div className="h-1 bg-[#E02020]" />

            <div className="p-6 space-y-4">
              {/* Reference */}
              <div className="flex items-start justify-between py-3 border-b border-gray-50">
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest font-montserrat mb-1">
                    Payment Reference
                  </p>
                  <p className="font-mono font-bold text-gray-900 text-sm break-all">
                    {state.reference}
                  </p>
                </div>
                <span className="flex-shrink-0 bg-green-50 text-green-700 border border-green-200 text-xs font-bold px-2.5 py-1 font-poppins ml-3">
                  CONFIRMED
                </span>
              </div>

              {/* Details grid */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Customer',  value: state.customerName },
                  { label: 'Email',     value: state.email        },
                  { label: 'Items',     value: `${state.itemCount} item${state.itemCount > 1 ? 's' : ''}` },
                  { label: 'Store',     value: `${state.country === 'Nigeria' ? '🇳🇬' : '🇨🇦'} ${state.country}` },
                ].map(item => (
                  <div key={item.label}>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest font-montserrat mb-0.5">
                      {item.label}
                    </p>
                    <p className="font-poppins text-sm text-gray-900 font-semibold">{item.value}</p>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="flex items-center justify-between pt-4 border-t-2 border-gray-900">
                <span className="font-montserrat font-bold text-gray-900 uppercase tracking-wide">
                  Amount Paid
                </span>
                <span className="font-montserrat font-extrabold text-2xl text-gray-900">
                  {formatPrice(state.total, state.currency)}
                </span>
              </div>
            </div>
          </div>

          {/* What happens next */}
          <div className="bg-gray-50 border border-gray-100 p-5 mb-8">
            <h3 className="font-montserrat font-bold text-gray-900 mb-3 text-sm uppercase tracking-widest">
              What happens next?
            </h3>
            <div className="space-y-3">
              {[
                { step: '1', text: 'A confirmation email has been sent to ' + state.email },
                { step: '2', text: 'Our team will review and process your order within 24 hours.' },
                { step: '3', text: 'You will receive a shipping update with your tracking details.' },
              ].map(item => (
                <div key={item.step} className="flex items-start gap-3">
                  <span className="w-6 h-6 bg-[#E02020] text-white text-xs font-bold flex items-center justify-center flex-shrink-0 font-montserrat">
                    {item.step}
                  </span>
                  <p className="font-poppins text-sm text-gray-600">{item.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to={shopPath}
              className="flex-1 bg-[#E02020] text-white font-montserrat font-bold py-4 text-sm uppercase tracking-widest hover:bg-[#c01a1a] transition-colors text-center"
            >
              Continue Shopping
            </Link>
            <Link
              to="/"
              className="flex-1 border border-gray-200 text-gray-700 font-montserrat font-bold py-4 text-sm uppercase tracking-wide hover:bg-gray-50 transition-colors text-center"
            >
              Back to Home
            </Link>
          </div>

          {/* Support note */}
          <p className="text-center font-poppins text-xs text-gray-400 mt-6">
            Questions? Contact us at{' '}
            <a href="mailto:support@xpola.com" className="text-[#E02020] hover:underline">
              support@xpola.com
            </a>
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default OrderSuccess;
