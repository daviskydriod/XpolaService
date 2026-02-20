// FILE PATH: src/pages/admin/AdminDashboard.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../../contexts/AdminContext';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Order } from '@/lib/orderService';
import AdminProducts from './AdminProducts';
import AdminOrders from './AdminOrders';

export type AdminView = 'overview' | 'products' | 'orders';

// ─── SIDEBAR ──────────────────────────────────────────────────────────────────
const Sidebar = ({
  view, setView, onLogout, isOpen, onClose,
}: {
  view: AdminView;
  setView: (v: AdminView) => void;
  onLogout: () => void;
  isOpen: boolean;
  onClose: () => void;
}) => {
  const navItems: { id: AdminView; label: string; icon: JSX.Element }[] = [
    {
      id: 'overview', label: 'Overview',
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />,
    },
    {
      id: 'products', label: 'Products',
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />,
    },
    {
      id: 'orders', label: 'Orders',
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />,
    },
  ];

  const content = (
    <aside className="w-64 bg-gray-900 min-h-screen flex flex-col h-full">
      {/* Logo */}
      <div className="p-5 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#E02020] rounded-lg flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <p className="font-montserrat font-bold text-white text-sm">Xpola Admin</p>
            <p className="text-gray-500 text-xs">Shop Management</p>
          </div>
        </div>
        {/* Close button — mobile only */}
        <button onClick={onClose} className="lg:hidden text-gray-400 hover:text-white">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => { setView(item.id); onClose(); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
              view === item.id
                ? 'bg-[#E02020] text-white'
                : 'text-gray-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {item.icon}
            </svg>
            {item.label}
          </button>
        ))}
      </nav>

      {/* Bottom */}
      <div className="p-4 border-t border-white/10 space-y-1">
        <a
          href="/"
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-white px-4 py-2.5 rounded-lg hover:bg-white/5 transition-all"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          View Website
        </a>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-2 text-sm text-red-400 hover:text-red-300 px-4 py-2.5 rounded-lg hover:bg-red-500/10 transition-all"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Logout
        </button>
      </div>
    </aside>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden lg:block flex-shrink-0">{content}</div>

      {/* Mobile drawer */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/60 z-40 lg:hidden"
            onClick={onClose}
          />
          <div className="fixed inset-y-0 left-0 z-50 lg:hidden">
            {content}
          </div>
        </>
      )}
    </>
  );
};

// ─── STAT CARD ────────────────────────────────────────────────────────────────
const StatCard = ({
  label, value, sub, color, icon,
}: {
  label: string; value: string; sub: string; color: string; icon: JSX.Element;
}) => (
  <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
    <div className={`w-11 h-11 ${color} rounded-xl flex items-center justify-center mb-3`}>
      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        {icon}
      </svg>
    </div>
    <p className="text-xl font-montserrat font-extrabold text-gray-900">{value}</p>
    <p className="text-sm font-semibold text-gray-700 mt-0.5">{label}</p>
    <p className="text-xs text-gray-400 mt-1">{sub}</p>
  </div>
);

// ─── OVERVIEW ─────────────────────────────────────────────────────────────────
const Overview = ({ setView }: { setView: (v: AdminView) => void }) => {
  const { products } = useAdmin();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
        const snap = await getDocs(q);
        setOrders(snap.docs.map(d => ({ id: d.id, ...d.data() } as Order)));
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingOrders(false);
      }
    };
    fetchOrders();
  }, []);

  const ngProducts    = products.filter(p => p.country === 'nigeria');
  const caProducts    = products.filter(p => p.country === 'canada');
  const ngOrders      = orders.filter(o => o.country?.toLowerCase().includes('niger'));
  const caOrders      = orders.filter(o => o.country?.toLowerCase().includes('canada'));
  const ngRevenue     = ngOrders.reduce((s, o) => s + o.total, 0);
  const caRevenue     = caOrders.reduce((s, o) => s + o.total, 0);
  const pendingOrders = orders.filter(o => o.status === 'paid' || o.status === 'processing').length;

  const statusStyle: Record<string, string> = {
    paid:       'bg-blue-100 text-blue-700',
    processing: 'bg-yellow-100 text-yellow-700',
    shipped:    'bg-purple-100 text-purple-700',
    delivered:  'bg-green-100 text-green-700',
  };

  const formatDate = (ts: Order['createdAt']) => {
    if (!ts) return '—';
    try {
      return (ts as { toDate: () => Date }).toDate().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch { return '—'; }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-montserrat font-bold text-xl md:text-2xl text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-500 text-sm mt-1">Welcome back, Admin. Here's what's happening.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          label="Nigeria Products" value={String(ngProducts.length)}
          sub={`${ngProducts.filter(p => p.inStock).length} in stock`} color="bg-green-500"
          icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />}
        />
        <StatCard
          label="Canada Products" value={String(caProducts.length)}
          sub={`${caProducts.filter(p => p.inStock).length} in stock`} color="bg-red-500"
          icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />}
        />
        <StatCard
          label="Total Orders" value={String(orders.length)}
          sub={`${pendingOrders} need attention`} color="bg-blue-500"
          icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />}
        />
        <StatCard
          label="NG Revenue" value={`₦${ngRevenue.toLocaleString()}`}
          sub={`CA$${caRevenue.toLocaleString()} CA`} color="bg-[#E02020]"
          icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />}
        />
      </div>

      {/* Two column */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Stores */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h2 className="font-montserrat font-bold text-gray-900 mb-4 text-sm uppercase tracking-wider">Stores at a Glance</h2>
          <div className="space-y-3">
            {[
              { flag: '🇳🇬', name: 'Nigeria Store', products: ngProducts.length, orders: ngOrders.length, revenue: `₦${ngRevenue.toLocaleString()}`, path: '/nigeria/shop' },
              { flag: '🇨🇦', name: 'Canada Store',  products: caProducts.length, orders: caOrders.length, revenue: `CA$${caRevenue.toLocaleString()}`, path: '/canada/shop' },
            ].map(store => (
              <div key={store.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{store.flag}</span>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{store.name}</p>
                    <p className="text-xs text-gray-500">{store.products} products · {store.orders} orders</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900 text-sm">{store.revenue}</p>
                  <a href={store.path} target="_blank" rel="noreferrer" className="text-xs text-[#E02020] hover:underline">View →</a>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex gap-3">
            <button onClick={() => setView('products')} className="flex-1 bg-[#E02020] text-white font-semibold py-2.5 rounded-xl text-sm hover:bg-red-700 transition-colors">
              Manage Products
            </button>
            <button onClick={() => setView('orders')} className="flex-1 bg-gray-100 text-gray-700 font-semibold py-2.5 rounded-xl text-sm hover:bg-gray-200 transition-colors">
              View Orders
            </button>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-montserrat font-bold text-gray-900 text-sm uppercase tracking-wider">Recent Orders</h2>
            <button onClick={() => setView('orders')} className="text-xs text-[#E02020] font-semibold hover:underline">View all →</button>
          </div>
          {loadingOrders ? (
            <div className="flex items-center justify-center py-8">
              <svg className="w-6 h-6 animate-spin text-[#E02020]" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
            </div>
          ) : orders.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">No orders yet.</p>
          ) : (
            <div className="space-y-2 overflow-hidden">
              {orders.slice(0, 6).map(order => (
                <div key={order.id} className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0 gap-2">
                  <div className="min-w-0">
                    <p className="font-semibold text-sm text-gray-900 truncate">{order.customerName}</p>
                    <p className="text-xs text-gray-400 truncate">{formatDate(order.createdAt)}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-bold text-sm text-gray-900">
                      {order.currency === 'NGN' ? '₦' : 'CA$'}{order.total?.toLocaleString()}
                    </p>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusStyle[order.status] ?? 'bg-gray-100 text-gray-600'}`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── MAIN DASHBOARD ───────────────────────────────────────────────────────────
const AdminDashboard = () => {
  const { isAuthenticated, logout } = useAdmin();
  const navigate = useNavigate();
  const [view,          setView]          = useState<AdminView>('overview');
  const [sidebarOpen,   setSidebarOpen]   = useState(false);

  if (!isAuthenticated) {
    navigate('/admin');
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/admin');
  };

  const viewLabels: Record<AdminView, string> = {
    overview: 'Overview',
    products: 'Products',
    orders:   'Orders',
  };

  return (
    <div className="flex min-h-screen bg-gray-50 overflow-hidden">
      <Sidebar
        view={view}
        setView={setView}
        onLogout={handleLogout}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile top bar */}
        <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100 sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen(true)}
            className="w-9 h-9 flex items-center justify-center rounded-lg bg-gray-100"
          >
            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-[#E02020] rounded flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="font-montserrat font-bold text-gray-900 text-sm">Xpola Admin</span>
          </div>
          <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded-lg">
            {viewLabels[view]}
          </span>
        </div>

        {/* Main content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
          {view === 'overview' && <Overview setView={setView} />}
          {view === 'products' && <AdminProducts />}
          {view === 'orders'   && <AdminOrders />}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
