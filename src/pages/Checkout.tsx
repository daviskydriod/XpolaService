// FILE PATH: src/pages/Checkout.tsx
// Place this file at: src/pages/Checkout.tsx
//
// SETUP: No extra npm install needed.
// Add to your .env:  VITE_PAYSTACK_PUBLIC_KEY=pk_test_xxxxxxxxxxxxxxxx
//
// react-paystack has been replaced with a lightweight inline hook
// that loads Paystack's own JS directly — no duplicate-React crash.

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useCart } from '../contexts/CartContext';
import { useCountry } from '../contexts/CountryContext';
import { formatPrice } from '@/data/shopData';

// ── Paystack inline loader (replaces react-paystack) ─────────────────────────
declare global {
  interface Window {
    PaystackPop: {
      setup: (opts: Record<string, unknown>) => { openIframe: () => void };
    };
  }
}

function loadPaystackScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.PaystackPop) { resolve(); return; }
    const existing = document.querySelector(
      'script[src="https://js.paystack.co/v1/inline.js"]'
    );
    if (existing) { existing.addEventListener('load', () => resolve()); return; }
    const s = document.createElement('script');
    s.src = 'https://js.paystack.co/v1/inline.js';
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error('Paystack script failed to load'));
    document.head.appendChild(s);
  });
}

interface PaystackConfig {
  email: string;
  amount: number;          // in kobo / pesewas (price × 100)
  currency: string;
  publicKey: string;
  firstname?: string;
  lastname?: string;
  phone?: string;
  reference?: string;
  metadata?: Record<string, unknown>;
}

function usePaystackPayment(config: PaystackConfig) {
  return function initializePayment(
    onSuccess: (ref: { reference: string }) => void,
    onClose: () => void
  ) {
    loadPaystackScript()
      .then(() => {
        const handler = window.PaystackPop.setup({
          key: config.publicKey,
          email: config.email,
          amount: config.amount,
          currency: config.currency,
          ref:
            config.reference ??
            `xpola_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
          firstname: config.firstname,
          lastname: config.lastname,
          phone: config.phone,
          metadata: config.metadata ?? {},
          callback: onSuccess,
          onClose,
        });
        handler.openIframe();
      })
      .catch(err => console.error('Paystack error:', err));
  };
}
// ─────────────────────────────────────────────────────────────────────────────

// ── Types ─────────────────────────────────────────────────────────────────────
interface CustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
}

const EMPTY_INFO: CustomerInfo = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  state: '',
};

type Step = 'info' | 'review' | 'payment';

// ── Step Indicator ────────────────────────────────────────────────────────────
const StepBar = ({ current }: { current: Step }) => {
  const steps: { id: Step; label: string }[] = [
    { id: 'info',    label: 'Your Details' },
    { id: 'review',  label: 'Review Order' },
    { id: 'payment', label: 'Payment'      },
  ];
  const idx = steps.findIndex(s => s.id === current);

  return (
    <div className="flex items-center justify-center gap-0 mb-10">
      {steps.map((step, i) => (
        <div key={step.id} className="flex items-center">
          {/* Circle */}
          <div className="flex flex-col items-center">
            <div
              className={`w-9 h-9 flex items-center justify-center font-montserrat font-bold text-sm transition-all ${
                i < idx
                  ? 'bg-green-500 text-white'
                  : i === idx
                  ? 'bg-[#E02020] text-white'
                  : 'bg-gray-100 text-gray-400'
              }`}
            >
              {i < idx ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                i + 1
              )}
            </div>
            <span
              className={`mt-1.5 text-xs font-poppins font-semibold whitespace-nowrap ${
                i === idx ? 'text-[#E02020]' : i < idx ? 'text-green-600' : 'text-gray-400'
              }`}
            >
              {step.label}
            </span>
          </div>
          {/* Connector */}
          {i < steps.length - 1 && (
            <div
              className={`w-16 md:w-24 h-0.5 mx-1 mb-5 transition-all ${
                i < idx ? 'bg-green-500' : 'bg-gray-200'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
};

// ── Field component ────────────────────────────────────────────────────────────
const Field = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = true,
  half = false,
}: {
  label: string;
  name: keyof CustomerInfo;
  type?: string;
  value: string;
  onChange: (name: keyof CustomerInfo, value: string) => void;
  placeholder?: string;
  required?: boolean;
  half?: boolean;
}) => (
  <div className={half ? 'flex-1' : 'w-full'}>
    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 font-montserrat">
      {label} {required && <span className="text-[#E02020]">*</span>}
    </label>
    <input
      type={type}
      value={value}
      onChange={e => onChange(name, e.target.value)}
      placeholder={placeholder}
      required={required}
      className="w-full px-4 py-3 border border-gray-200 text-sm font-poppins focus:outline-none focus:border-[#E02020] transition-colors text-gray-900 placeholder-gray-400"
    />
  </div>
);

// ── Step 1: Customer Info ─────────────────────────────────────────────────────
const CustomerInfoStep = ({
  info,
  onChange,
  onNext,
}: {
  info: CustomerInfo;
  onChange: (name: keyof CustomerInfo, value: string) => void;
  onNext: () => void;
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex gap-4">
        <Field label="First Name" name="firstName" value={info.firstName} onChange={onChange} placeholder="John"  half />
        <Field label="Last Name"  name="lastName"  value={info.lastName}  onChange={onChange} placeholder="Doe"   half />
      </div>
      <Field label="Email Address"    name="email"   type="email" value={info.email}   onChange={onChange} placeholder="john@example.com" />
      <Field label="Phone Number"     name="phone"   type="tel"   value={info.phone}   onChange={onChange} placeholder="+234 800 000 0000" />
      <Field label="Delivery Address" name="address"              value={info.address} onChange={onChange} placeholder="12 Example Street" />
      <div className="flex gap-4">
        <Field label="City"  name="city"  value={info.city}  onChange={onChange} placeholder="Lagos"      half />
        <Field label="State" name="state" value={info.state} onChange={onChange} placeholder="Lagos State" half />
      </div>

      <button
        type="submit"
        className="w-full bg-[#E02020] text-white font-montserrat font-bold py-4 hover:bg-[#c01a1a] transition-colors uppercase tracking-widest text-sm mt-2"
      >
        Continue to Review →
      </button>
    </form>
  );
};

// ── Step 2: Order Review ──────────────────────────────────────────────────────
const ReviewStep = ({
  info,
  onBack,
  onNext,
}: {
  info: CustomerInfo;
  onBack: () => void;
  onNext: () => void;
}) => {
  const { cart, cartTotal } = useCart();
  const currency = cart[0]?.currency;

  return (
    <div className="space-y-6">
      {/* Order items */}
      <div>
        <h3 className="font-montserrat font-bold text-gray-900 mb-4 text-sm uppercase tracking-widest">
          Order Items ({cart.length})
        </h3>
        <div className="border border-gray-100 divide-y divide-gray-50">
          {cart.map(item => (
            <div key={item.id} className="flex items-center gap-4 p-4">
              <img
                src={item.image}
                alt={item.name}
                className="w-14 h-14 object-cover flex-shrink-0 bg-gray-50"
                onError={e => {
                  (e.target as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&q=80';
                }}
              />
              <div className="flex-1 min-w-0">
                <p className="font-poppins font-semibold text-sm text-gray-900 truncate">{item.name}</p>
                <p className="font-poppins text-xs text-[#E02020] font-semibold">{item.category}</p>
                <p className="font-poppins text-xs text-gray-400 mt-0.5">Qty: {item.quantity}</p>
              </div>
              <p className="font-montserrat font-bold text-sm text-gray-900 flex-shrink-0">
                {formatPrice(item.price * item.quantity, item.currency)}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Total */}
      <div className="bg-gray-50 border border-gray-100 p-4">
        <div className="flex justify-between items-center">
          <span className="font-montserrat font-bold text-gray-700 uppercase tracking-wide text-sm">Total</span>
          <span className="font-montserrat font-extrabold text-2xl text-gray-900">
            {currency && formatPrice(cartTotal, currency)}
          </span>
        </div>
        <p className="font-poppins text-xs text-gray-400 mt-1">Shipping calculated after payment</p>
      </div>

      {/* Delivery info summary */}
      <div className="border border-gray-100 p-4">
        <h3 className="font-montserrat font-bold text-gray-900 mb-3 text-sm uppercase tracking-widest">
          Delivering To
        </h3>
        <div className="space-y-1">
          <p className="font-poppins text-sm font-semibold text-gray-900">{info.firstName} {info.lastName}</p>
          <p className="font-poppins text-sm text-gray-500">{info.email}</p>
          <p className="font-poppins text-sm text-gray-500">{info.phone}</p>
          <p className="font-poppins text-sm text-gray-500">{info.address}, {info.city}, {info.state}</p>
        </div>
        <button
          onClick={onBack}
          className="mt-3 font-poppins text-xs text-[#E02020] font-semibold hover:underline"
        >
          ← Edit details
        </button>
      </div>

      {/* Buttons */}
      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="flex-1 border border-gray-200 text-gray-700 font-montserrat font-bold py-3.5 text-sm uppercase tracking-wide hover:bg-gray-50 transition-colors"
        >
          ← Back
        </button>
        <button
          onClick={onNext}
          className="flex-1 bg-[#E02020] text-white font-montserrat font-bold py-3.5 text-sm uppercase tracking-widest hover:bg-[#c01a1a] transition-colors"
        >
          Proceed to Pay →
        </button>
      </div>
    </div>
  );
};

// ── Step 3: Payment ───────────────────────────────────────────────────────────
const PaymentStep = ({
  info,
  onBack,
  onSuccess,
}: {
  info: CustomerInfo;
  onBack: () => void;
  onSuccess: (ref: string) => void;
}) => {
  const { cart, cartTotal } = useCart();
  const { currentData } = useCountry();
  const isNigeria = currentData.code === 'NG';
  const currency = cart[0]?.currency;

  // ── usePaystackPayment is now the LOCAL hook above — no react-paystack import ──
  const initializePayment = usePaystackPayment({
    email: info.email,
    amount: cartTotal * 100,                          // kobo / pesewas
    currency: isNigeria ? 'NGN' : 'GHS',
    publicKey:
      import.meta.env.VITE_PAYSTACK_PUBLIC_KEY ||
      'pk_test_d16f014e0c3a56d1c0ae9849a956b35cbe10eb56',
    firstname: info.firstName,
    lastname: info.lastName,
    phone: info.phone,
    reference: `xpola_${new Date().getTime()}_${Math.random().toString(36).slice(2, 7)}`,
    metadata: {
      custom_fields: [
        { display_name: 'Customer Phone',   variable_name: 'phone',   value: info.phone },
        { display_name: 'Delivery Address', variable_name: 'address', value: info.address },
        { display_name: 'City',             variable_name: 'city',    value: info.city },
        { display_name: 'State',            variable_name: 'state',   value: info.state },
        { display_name: 'Country Store',    variable_name: 'country', value: currentData.name },
        { display_name: 'Items Count',      variable_name: 'items',   value: String(cart.length) },
      ],
    },
  });

  const handlePay = () => {
    initializePayment(
      (reference: { reference: string }) => onSuccess(reference.reference),
      () => { /* user closed modal — stay on page */ }
    );
  };

  return (
    <div className="space-y-6">
      {/* Order summary mini */}
      <div className="bg-gray-50 border border-gray-100 p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-montserrat font-bold text-gray-900 text-sm uppercase tracking-widest">
            Order Summary
          </h3>
          <button onClick={onBack} className="font-poppins text-xs text-[#E02020] font-semibold hover:underline">
            ← Edit
          </button>
        </div>
        <div className="space-y-2">
          {cart.map(item => (
            <div key={item.id} className="flex justify-between text-sm">
              <span className="font-poppins text-gray-600 truncate max-w-[220px]">
                {item.name} × {item.quantity}
              </span>
              <span className="font-montserrat font-semibold text-gray-900 flex-shrink-0 ml-2">
                {formatPrice(item.price * item.quantity, item.currency)}
              </span>
            </div>
          ))}
        </div>
        <div className="border-t border-gray-200 mt-3 pt-3 flex justify-between">
          <span className="font-montserrat font-bold text-gray-900 uppercase tracking-wide text-sm">Total</span>
          <span className="font-montserrat font-extrabold text-xl text-gray-900">
            {currency && formatPrice(cartTotal, currency)}
          </span>
        </div>
      </div>

      {/* Delivery info mini */}
      <div className="border border-gray-100 p-5">
        <h3 className="font-montserrat font-bold text-gray-900 mb-2 text-sm uppercase tracking-widest">
          Delivering To
        </h3>
        <p className="font-poppins text-sm text-gray-700 font-semibold">
          {info.firstName} {info.lastName}
        </p>
        <p className="font-poppins text-sm text-gray-500">
          {info.address}, {info.city}, {info.state}
        </p>
        <p className="font-poppins text-sm text-gray-500">{info.email} · {info.phone}</p>
      </div>

      {/* Paystack CTA */}
      <div className="border border-gray-100 p-5 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <p className="font-poppins text-sm text-gray-600 font-semibold">Secured by Paystack</p>
        </div>
        <p className="font-poppins text-xs text-gray-400 mb-6">
          You'll be redirected to Paystack's secure checkout to complete your payment via card, bank transfer, or USSD.
        </p>

        <button
          onClick={handlePay}
          className="w-full bg-[#E02020] text-white font-montserrat font-bold py-5 hover:bg-[#c01a1a] transition-colors text-base uppercase tracking-widest flex items-center justify-center gap-3"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
          Pay {currency && formatPrice(cartTotal, currency)}
        </button>

        {/* Payment method badges */}
        <div className="flex items-center justify-center gap-3 mt-4">
          {['Visa', 'Mastercard', 'Bank Transfer', 'USSD'].map(m => (
            <span key={m} className="text-xs font-poppins text-gray-400 border border-gray-100 px-2 py-0.5">
              {m}
            </span>
          ))}
        </div>
      </div>

      <button
        onClick={onBack}
        className="w-full border border-gray-200 text-gray-600 font-montserrat font-bold py-3 text-sm uppercase tracking-wide hover:bg-gray-50 transition-colors"
      >
        ← Back to Review
      </button>
    </div>
  );
};

// ── Main Checkout Page ────────────────────────────────────────────────────────
const Checkout = () => {
  const { cart, cartTotal } = useCart();
  const { currentData } = useCountry();
  const navigate = useNavigate();

  const [step, setStep] = useState<Step>('info');
  const [info, setInfo] = useState<CustomerInfo>(EMPTY_INFO);

  const handleInfoChange = (name: keyof CustomerInfo, value: string) => {
    setInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleSuccess = (reference: string) => {
    navigate('/order-success', {
      state: {
        reference,
        customerName: `${info.firstName} ${info.lastName}`,
        email: info.email,
        total: cartTotal,
        currency: cart[0]?.currency,
        itemCount: cart.reduce((s, i) => s + i.quantity, 0),
        country: currentData.name,
      },
    });
  };

  // Empty cart guard
  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="container mx-auto px-4 pt-40 pb-20 text-center">
          <div className="w-20 h-20 bg-red-50 flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-[#E02020]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <h1 className="font-montserrat font-bold text-2xl text-gray-900 mb-3">Your cart is empty</h1>
          <p className="font-poppins text-gray-500 mb-8">Add some products before checking out.</p>
          <Link
            to={currentData.code === 'NG' ? '/nigeria/shop' : '/canada/shop'}
            className="inline-block bg-[#E02020] text-white font-montserrat font-bold px-8 py-4 hover:bg-[#c01a1a] transition-colors uppercase tracking-widest text-sm"
          >
            Continue Shopping
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Red brand strip under navbar */}
      <div className="h-1 bg-[#E02020] mt-[72px]" />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Page title */}
          <div className="text-center mb-10">
            <h1 className="font-montserrat font-extrabold text-3xl md:text-4xl text-gray-900 mb-2">
              Checkout
            </h1>
            <p className="font-poppins text-gray-500 text-sm">
              Complete your order from Xpola {currentData.name} Store
            </p>
          </div>

          {/* Step bar */}
          <StepBar current={step} />

          {/* Step content */}
          <div className="bg-white border border-gray-100 shadow-sm p-6 md:p-8">
            {step === 'info' && (
              <CustomerInfoStep
                info={info}
                onChange={handleInfoChange}
                onNext={() => setStep('review')}
              />
            )}
            {step === 'review' && (
              <ReviewStep
                info={info}
                onBack={() => setStep('info')}
                onNext={() => setStep('payment')}
              />
            )}
            {step === 'payment' && (
              <PaymentStep
                info={info}
                onBack={() => setStep('review')}
                onSuccess={handleSuccess}
              />
            )}
          </div>

          {/* Trust badges */}
          <div className="flex items-center justify-center gap-6 mt-8">
            {[
              { icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z', label: 'Secure Checkout' },
              { icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z', label: 'Verified by Paystack' },
              { icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z', label: 'Multiple Payment Options' },
            ].map(b => (
              <div key={b.label} className="flex items-center gap-1.5 text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={b.icon} />
                </svg>
                <span className="font-poppins text-xs">{b.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Checkout;
