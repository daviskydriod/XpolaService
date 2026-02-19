// FILE PATH: src/pages/admin/AdminDashboard.tsx
// Place this file at: src/pages/admin/AdminDashboard.tsx
import { useState, ReactNode } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { useAdmin } from '../../contexts/AdminContext';
import AdminProducts from './AdminProducts';
import AdminOrders from './AdminOrders';

// ─── SIDEBAR ──────────────────────────────────────────────────────────────────
type AdminView = 'overview' | 'products' | 'orders';

const Sidebar = ({ view, setView, onLogout }: { view: AdminView; setView: (v: AdminView) => void; onLogout: () => void }) => {
  const navItems: { id: AdminView; label: string; icon: string }[] = [
    { id: 'overview', label: 'Overview', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { id: 'products', label: 'Products', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
    { id: 'orders', label: 'Orders', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
  ];

  return (
    <aside className="w-64 bg-gray-900 min-h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <p className="font-montserrat font-bold text-white text-base">Xpola Admin</p>
            <p className="text-gray-500 text-xs">Shop Management</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => setView(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
              view === item.id
                ? 'bg-primary text-white'
                : 'text-gray-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
            </svg>
            {item.label}
          </button>
        ))}
      </nav>

      {/* Bottom */}
      <div className="p-4 border-t border-white/10">
        <a href="/" className="flex items-center gap-2 text-sm text-gray-400 hover:text-white px-4 py-2 rounded-lg hover:bg-white/5 transition-all mb-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          View Website
        </a>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-2 text-sm text-red-400 hover:text-red-300 px-4 py-2 rounded-lg hover:bg-red-500/10 transition-all"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Logout
        </button>
      </div>
    </aside>
  );
};

// ─── STAT CARD ────────────────────────────────────────────────────────────────
const StatCard = ({ label, value, sub, color, icon }: { label: string; value: string; sub: string; color: string; icon: string }) => (
  <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
    <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center mb-4`}>
      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
      </svg>
    </div>
    <p className="text-2xl font-montserrat font-extrabold text-gray-900">{value}</p>
    <p className="text-sm font-semibold text-gray-700 mt-0.5">{label}</p>
    <p className="text-xs text-gray-400 mt-1">{sub}</p>
  </div>
);

// ─── OVERVIEW ─────────────────────────────────────────────────────────────────
const Overview = ({ setView }: { setView: (v: AdminView) => void }) => {
  const { products, orders } = useAdmin();

  const ngProducts = products.filter(p => p.country === 'nigeria');
  const caProducts = products.filter(p => p.country === 'canada');
  const ngRevenue = orders.filter(o => o.country === 'nigeria').reduce((s, o) => s + o.total, 0);
  const caRevenue = orders.filter(o => o.country === 'canada').reduce((s, o) => s + o.total, 0);
  const pendingOrders = orders.filter(o => o.status === 'pending' || o.status === 'processing').length;

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700',
    processing: 'bg-blue-100 text-blue-700',
    shipped: 'bg-purple-100 text-purple-700',
    delivered: 'bg-green-100 text-green-700',
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-montserrat font-bold text-2xl text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-500 text-sm mt-1">Welcome back, Admin. Here's what's happening.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <StatCard label="Nigeria Products" value={String(ngProducts.length)} sub={`${ngProducts.filter(p => p.inStock).length} in stock`} color="bg-green-500" icon="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        <StatCard label="Canada Products" value={String(caProducts.length)} sub={`${caProducts.filter(p => p.inStock).length} in stock`} color="bg-red-500" icon="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        <StatCard label="Total Orders" value={String(orders.length)} sub={`${pendingOrders} pending/processing`} color="bg-blue-500" icon="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        <StatCard label="NG Revenue" value={`₦${ngRevenue.toLocaleString()}`} sub={`CA$${caRevenue.toLocaleString()} from Canada`} color="bg-primary" icon="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </div>

      {/* Two column: by country + recent orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Country breakdown */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-montserrat font-bold text-gray-900 mb-5">Stores at a Glance</h2>
          <div className="space-y-4">
            {[
              { flag: '🇳🇬', name: 'Nigeria Store', products: ngProducts.length, orders: orders.filter(o => o.country === 'nigeria').length, revenue: `₦${ngRevenue.toLocaleString()}`, path: '/nigeria/shop' },
              { flag: '🇨🇦', name: 'Canada Store', products: caProducts.length, orders: orders.filter(o => o.country === 'canada').length, revenue: `CA$${caRevenue.toLocaleString()}`, path: '/canada/shop' },
            ].map(store => (
              <div key={store.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{store.flag}</span>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{store.name}</p>
                    <p className="text-xs text-gray-500">{store.products} products · {store.orders} orders</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900 text-sm">{store.revenue}</p>
                  <a href={store.path} className="text-xs text-primary hover:underline">View store →</a>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 flex gap-3">
            <button onClick={() => setView('products')} className="flex-1 bg-primary text-white font-semibold py-2.5 rounded-xl text-sm hover:bg-primary/90 transition-colors">
              Manage Products
            </button>
            <button onClick={() => setView('orders')} className="flex-1 bg-gray-100 text-gray-700 font-semibold py-2.5 rounded-xl text-sm hover:bg-gray-200 transition-colors">
              View Orders
            </button>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-montserrat font-bold text-gray-900">Recent Orders</h2>
            <button onClick={() => setView('orders')} className="text-sm text-primary font-semibold hover:underline">View all</button>
          </div>
          <div className="space-y-3">
            {orders.slice(0, 5).map(order => (
              <div key={order.id} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                <div>
                  <p className="font-semibold text-sm text-gray-900">{order.customerName}</p>
                  <p className="text-xs text-gray-400">{order.id} · {order.country === 'nigeria' ? '🇳🇬' : '🇨🇦'} {order.date}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm text-gray-900">
                    {order.country === 'nigeria' ? `₦${order.total.toLocaleString()}` : `CA$${order.total.toLocaleString()}`}
                  </p>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusColors[order.status]}`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── MAIN DASHBOARD ───────────────────────────────────────────────────────────
const AdminDashboard = () => {
  const { isAuthenticated, logout } = useAdmin();
  const navigate = useNavigate();
  const [view, setView] = useState<AdminView>('overview');

  if (!isAuthenticated) {
    navigate('/admin');
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/admin');
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar view={view} setView={setView} onLogout={handleLogout} />

      <main className="flex-1 p-8 overflow-auto">
        {view === 'overview' && <Overview setView={setView} />}
        {view === 'products' && <AdminProducts />}
        {view === 'orders' && <AdminOrders />}
      </main>
    </div>
  );
};

export default AdminDashboard;
