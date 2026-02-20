// FILE PATH: src/pages/Account.tsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth, SavedAddress } from '@/contexts/AuthContext';
import { useCountry } from '@/contexts/CountryContext';
import { fetchUserOrders, Order } from '@/lib/orderService';
import { formatPrice } from '@/data/shopData';

type Tab = 'orders' | 'profile' | 'addresses';

// ── Helpers ───────────────────────────────────────────────────────────────────
const statusColor: Record<Order['status'], string> = {
  paid:       'bg-blue-50 text-blue-700 border-blue-100',
  processing: 'bg-yellow-50 text-yellow-700 border-yellow-100',
  shipped:    'bg-purple-50 text-purple-700 border-purple-100',
  delivered:  'bg-green-50 text-green-700 border-green-100',
};

const statusLabel: Record<Order['status'], string> = {
  paid:       'Order Placed',
  processing: 'Processing',
  shipped:    'Shipped',
  delivered:  'Delivered',
};

const formatDate = (ts: Order['createdAt']) => {
  if (!ts) return '—';
  const d = (ts as { toDate: () => Date }).toDate?.() ?? new Date();
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
};

// ── Orders Tab ────────────────────────────────────────────────────────────────
const OrdersTab = ({ uid }: { uid: string }) => {
  const [orders,  setOrders]  = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    fetchUserOrders(uid)
      .then(setOrders)
      .finally(() => setLoading(false));
  }, [uid]);

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <svg className="w-6 h-6 animate-spin text-[#E02020]" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
      </svg>
    </div>
  );

  if (orders.length === 0) return (
    <div className="text-center py-16">
      <div className="w-16 h-16 bg-gray-50 flex items-center justify-center mx-auto mb-4">
        <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      </div>
      <h3 className="font-montserrat font-bold text-gray-900 mb-2">No orders yet</h3>
      <p className="font-poppins text-sm text-gray-400 mb-6">Your order history will appear here.</p>
      <Link to="/" className="inline-block bg-[#E02020] text-white font-montserrat font-bold px-6 py-3 text-xs uppercase tracking-widest hover:bg-[#c01a1a] transition-colors">
        Start Shopping
      </Link>
    </div>
  );

  return (
    <div className="space-y-3">
      {orders.map(order => (
        <div key={order.id} className="border border-gray-100">
          {/* Order header */}
          <button
            onClick={() => setExpanded(expanded === order.id ? null : order.id)}
            className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div>
                <p className="font-montserrat font-bold text-sm text-gray-900">
                  #{order.reference.slice(-12).toUpperCase()}
                </p>
                <p className="font-poppins text-xs text-gray-400 mt-0.5">{formatDate(order.createdAt)}</p>
              </div>
              <span className={`text-xs font-poppins font-semibold px-2.5 py-1 border ${statusColor[order.status]}`}>
                {statusLabel[order.status]}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-montserrat font-bold text-sm text-gray-900">
                {formatPrice(order.total, order.currency)}
              </span>
              <svg className={`w-4 h-4 text-gray-400 transition-transform ${expanded === order.id ? 'rotate-180' : ''}`}
                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </button>

          {/* Expanded order detail */}
          {expanded === order.id && (
            <div className="border-t border-gray-100 p-4 space-y-4 bg-gray-50">
              <div className="divide-y divide-gray-100 bg-white border border-gray-100">
                {order.items.map(item => (
                  <div key={item.id} className="flex items-center gap-3 p-3">
                    <img src={item.image} alt={item.name} className="w-12 h-12 object-cover bg-gray-100 flex-shrink-0"
                      onError={e => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&q=80'; }} />
                    <div className="flex-1 min-w-0">
                      <p className="font-poppins font-semibold text-sm text-gray-900 truncate">{item.name}</p>
                      <p className="font-poppins text-xs text-gray-400">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-montserrat font-bold text-sm text-gray-900 flex-shrink-0">
                      {formatPrice(item.price * item.quantity, item.currency)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs font-poppins">
                <div className="bg-white border border-gray-100 p-3">
                  <p className="text-gray-400 mb-1 font-semibold uppercase tracking-wider text-[10px]">Delivering to</p>
                  <p className="text-gray-800 font-semibold">{order.customerName}</p>
                  <p className="text-gray-500">{order.address}, {order.city}, {order.state}</p>
                  <p className="text-gray-500">{order.country}</p>
                </div>
                <div className="bg-white border border-gray-100 p-3">
                  <p className="text-gray-400 mb-1 font-semibold uppercase tracking-wider text-[10px]">Contact</p>
                  <p className="text-gray-800">{order.email}</p>
                  <p className="text-gray-500">{order.phone}</p>
                  <p className="text-gray-400 mt-1 font-mono text-[10px]">Ref: {order.reference}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

// ── Profile Tab ───────────────────────────────────────────────────────────────
const ProfileTab = () => {
  const { profile, updateUserProfile } = useAuth();
  const [firstName, setFirstName] = useState(profile?.firstName ?? '');
  const [lastName,  setLastName]  = useState(profile?.lastName  ?? '');
  const [phone,     setPhone]     = useState(profile?.phone     ?? '');
  const [saving,    setSaving]    = useState(false);
  const [saved,     setSaved]     = useState(false);

  const inputClass = "w-full px-4 py-3 border border-gray-200 text-sm font-poppins focus:outline-none focus:border-[#E02020] transition-colors text-gray-900 placeholder-gray-400";
  const labelClass = "block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 font-montserrat";

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateUserProfile({ firstName, lastName, phone });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-5 max-w-lg">
      <div className="flex gap-4">
        <div className="flex-1">
          <label className={labelClass}>First Name</label>
          <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} required className={inputClass} />
        </div>
        <div className="flex-1">
          <label className={labelClass}>Last Name</label>
          <input type="text" value={lastName} onChange={e => setLastName(e.target.value)} required className={inputClass} />
        </div>
      </div>
      <div>
        <label className={labelClass}>Email Address</label>
        <input type="email" value={profile?.email ?? ''} disabled
          className="w-full px-4 py-3 border border-gray-100 text-sm font-poppins text-gray-400 bg-gray-50 cursor-not-allowed" />
        <p className="font-poppins text-xs text-gray-400 mt-1">Email cannot be changed.</p>
      </div>
      <div>
        <label className={labelClass}>Phone Number</label>
        <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} required className={inputClass} />
      </div>

      <button type="submit" disabled={saving}
        className="bg-[#E02020] text-white font-montserrat font-bold px-8 py-3 text-sm uppercase tracking-widest hover:bg-[#c01a1a] transition-colors disabled:opacity-60 flex items-center gap-2">
        {saving ? (
          <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>Saving...</>
        ) : saved ? (
          <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>Saved!</>
        ) : 'Save Changes'}
      </button>
    </form>
  );
};

// ── Addresses Tab ─────────────────────────────────────────────────────────────
const AddressesTab = () => {
  const { profile, addAddress, updateAddress, deleteAddress, setDefaultAddress } = useAuth();
  const { currentData } = useCountry();
  const isNigeria = currentData.code === 'NG';

  const [showForm, setShowForm]   = useState(false);
  const [saving,   setSaving]     = useState(false);
  const [editId,   setEditId]     = useState<string | null>(null);

  const emptyForm = { label: '', address: '', city: '', state: '', isDefault: false };
  const [form, setForm] = useState(emptyForm);

  const inputClass = "w-full px-4 py-3 border border-gray-200 text-sm font-poppins focus:outline-none focus:border-[#E02020] transition-colors text-gray-900 placeholder-gray-400";
  const labelClass = "block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 font-montserrat";

  const openAdd = () => { setForm(emptyForm); setEditId(null); setShowForm(true); };
  const openEdit = (addr: SavedAddress) => {
    setForm({ label: addr.label, address: addr.address, city: addr.city, state: addr.state, isDefault: addr.isDefault });
    setEditId(addr.id);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editId) {
        await updateAddress(editId, form);
        if (form.isDefault) await setDefaultAddress(editId);
      } else {
        await addAddress(form);
      }
      setShowForm(false);
      setForm(emptyForm);
      setEditId(null);
    } finally {
      setSaving(false);
    }
  };

  const addresses = profile?.addresses ?? [];

  return (
    <div className="space-y-4">
      {/* Address list */}
      {addresses.length === 0 && !showForm && (
        <div className="text-center py-12 border border-dashed border-gray-200">
          <svg className="w-8 h-8 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <p className="font-poppins text-sm text-gray-400">No saved addresses yet.</p>
        </div>
      )}

      {addresses.map(addr => (
        <div key={addr.id} className={`border p-4 flex items-start justify-between gap-4 ${addr.isDefault ? 'border-[#E02020] bg-red-50' : 'border-gray-100'}`}>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-montserrat font-bold text-sm text-gray-900">{addr.label}</span>
              {addr.isDefault && (
                <span className="text-[10px] font-poppins font-semibold bg-[#E02020] text-white px-2 py-0.5">DEFAULT</span>
              )}
            </div>
            <p className="font-poppins text-sm text-gray-500">{addr.address}</p>
            <p className="font-poppins text-sm text-gray-500">{addr.city}, {addr.state}</p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {!addr.isDefault && (
              <button onClick={() => setDefaultAddress(addr.id)}
                className="font-poppins text-xs text-gray-400 hover:text-[#E02020] transition-colors">
                Set default
              </button>
            )}
            <button onClick={() => openEdit(addr)}
              className="font-poppins text-xs text-[#E02020] hover:underline">Edit</button>
            <button onClick={() => deleteAddress(addr.id)}
              className="font-poppins text-xs text-gray-400 hover:text-red-600 transition-colors">Delete</button>
          </div>
        </div>
      ))}

      {/* Add button */}
      {!showForm && (
        <button onClick={openAdd}
          className="w-full border border-dashed border-gray-200 py-4 flex items-center justify-center gap-2 font-poppins text-sm text-gray-400 hover:border-[#E02020] hover:text-[#E02020] transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add New Address
        </button>
      )}

      {/* Add / Edit form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="border border-gray-100 p-5 space-y-4 bg-gray-50">
          <h4 className="font-montserrat font-bold text-sm text-gray-900 uppercase tracking-widest">
            {editId ? 'Edit Address' : 'New Address'}
          </h4>
          <div>
            <label className={labelClass}>Label (e.g. Home, Office)</label>
            <input type="text" value={form.label} onChange={e => setForm(p => ({ ...p, label: e.target.value }))}
              placeholder="Home" required className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Street Address</label>
            <input type="text" value={form.address} onChange={e => setForm(p => ({ ...p, address: e.target.value }))}
              placeholder={isNigeria ? '12 Example Street' : '123 Maple Ave'} required className={inputClass} />
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className={labelClass}>City</label>
              <input type="text" value={form.city} onChange={e => setForm(p => ({ ...p, city: e.target.value }))}
                placeholder={isNigeria ? 'Lagos' : 'Toronto'} required className={inputClass} />
            </div>
            <div className="flex-1">
              <label className={labelClass}>{isNigeria ? 'State' : 'Province'}</label>
              <input type="text" value={form.state} onChange={e => setForm(p => ({ ...p, state: e.target.value }))}
                placeholder={isNigeria ? 'Lagos State' : 'Ontario'} required className={inputClass} />
            </div>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.isDefault} onChange={e => setForm(p => ({ ...p, isDefault: e.target.checked }))}
              className="accent-[#E02020]" />
            <span className="font-poppins text-sm text-gray-600">Set as default address</span>
          </label>
          <div className="flex gap-3">
            <button type="button" onClick={() => { setShowForm(false); setEditId(null); }}
              className="flex-1 border border-gray-200 text-gray-600 font-montserrat font-bold py-3 text-xs uppercase tracking-wide hover:bg-gray-100 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={saving}
              className="flex-1 bg-[#E02020] text-white font-montserrat font-bold py-3 text-xs uppercase tracking-widest hover:bg-[#c01a1a] transition-colors disabled:opacity-60">
              {saving ? 'Saving...' : editId ? 'Update' : 'Save Address'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

// ── Main Account Page ─────────────────────────────────────────────────────────
const Account = () => {
  const { user, profile, logout } = useAuth();
  const { currentData } = useCountry();
  const isNigeria = currentData.code === 'NG';

  const [tab, setTab] = useState<Tab>('orders');

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'orders',    label: 'My Orders',      icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z' },
    { id: 'profile',   label: 'Profile',        icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
    { id: 'addresses', label: 'Saved Addresses', icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z' },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="h-1 bg-[#E02020] mt-[72px]" />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">

          {/* Account header */}
          <div className="flex items-center justify-between mb-10">
            <div>
              <h1 className="font-montserrat font-extrabold text-3xl text-gray-900">My Account</h1>
              <p className="font-poppins text-sm text-gray-400 mt-1">
                {profile?.firstName} {profile?.lastName} · {user?.email} · Xpola {currentData.name} {isNigeria ? '🇳🇬' : '🇨🇦'}
              </p>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-2 border border-gray-200 text-gray-500 font-poppins text-xs font-semibold px-4 py-2.5 hover:border-red-200 hover:text-[#E02020] transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Sign Out
            </button>
          </div>

          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar tabs */}
            <div className="md:w-52 flex-shrink-0">
              <nav className="space-y-1">
                {tabs.map(t => (
                  <button
                    key={t.id}
                    onClick={() => setTab(t.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-poppins font-semibold transition-colors text-left ${
                      tab === t.id
                        ? 'bg-[#E02020] text-white'
                        : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={t.icon} />
                    </svg>
                    {t.label}
                  </button>
                ))}
              </nav>

              {/* Quick shop link */}
              <div className="mt-6 border border-gray-100 p-4">
                <p className="font-poppins text-xs text-gray-400 mb-3">Ready to shop?</p>
                <Link
                  to={isNigeria ? '/nigeria/shop' : '/canada/shop'}
                  className="block text-center bg-gray-900 text-white font-montserrat font-bold text-xs py-2.5 uppercase tracking-widest hover:bg-gray-700 transition-colors"
                >
                  Shop Now →
                </Link>
              </div>
            </div>

            {/* Tab content */}
            <div className="flex-1 min-w-0">
              <div className="bg-white border border-gray-100 shadow-sm p-6">
                <h2 className="font-montserrat font-bold text-sm text-gray-900 uppercase tracking-widest mb-6 pb-4 border-b border-gray-100">
                  {tabs.find(t => t.id === tab)?.label}
                </h2>
                {tab === 'orders'    && user && <OrdersTab uid={user.uid} />}
                {tab === 'profile'   && <ProfileTab />}
                {tab === 'addresses' && <AddressesTab />}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Account;
