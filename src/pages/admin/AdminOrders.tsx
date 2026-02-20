// FILE PATH: src/pages/admin/AdminOrders.tsx
import { useState, useEffect } from 'react';
import {
  collection, getDocs, query, orderBy,
  doc, updateDoc, serverTimestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Order } from '@/lib/orderService';

// ─── TYPES ────────────────────────────────────────────────────────────────────
type OrderStatus = 'paid' | 'processing' | 'shipped' | 'delivered';

interface TrackingEvent {
  status: OrderStatus;
  message: string;
  timestamp: string;
}

interface FullOrder extends Order {
  trackingNumber?: string;
  trackingEvents?: TrackingEvent[];
  notes?: string;
}

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const STATUS_STYLES: Record<OrderStatus, string> = {
  paid:       'bg-blue-100 text-blue-700 border-blue-200',
  processing: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  shipped:    'bg-purple-100 text-purple-700 border-purple-200',
  delivered:  'bg-green-100 text-green-700 border-green-200',
};

const STATUS_LABELS: Record<OrderStatus, string> = {
  paid:       'Order Placed',
  processing: 'Processing',
  shipped:    'Shipped',
  delivered:  'Delivered',
};

const TRACKING_MESSAGES: Record<OrderStatus, string> = {
  paid:       'Order received and payment confirmed.',
  processing: 'Order is being prepared for shipment.',
  shipped:    'Order has been shipped and is on its way.',
  delivered:  'Order has been delivered successfully.',
};

const STATUS_ORDER: OrderStatus[] = ['paid', 'processing', 'shipped', 'delivered'];

const formatDate = (ts: Order['createdAt']) => {
  if (!ts) return '—';
  try {
    return (ts as { toDate: () => Date }).toDate().toLocaleDateString('en-GB', {
      day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
    });
  } catch { return '—'; }
};

// ─── ORDER DETAIL MODAL ───────────────────────────────────────────────────────
const OrderDetailModal = ({
  order,
  onClose,
  onUpdateStatus,
  onUpdateTracking,
}: {
  order: FullOrder;
  onClose: () => void;
  onUpdateStatus: (id: string, status: OrderStatus) => Promise<void>;
  onUpdateTracking: (id: string, trackingNumber: string, notes: string) => Promise<void>;
}) => {
  const [status,         setStatus]         = useState<OrderStatus>(order.status as OrderStatus);
  const [trackingNumber, setTrackingNumber] = useState(order.trackingNumber ?? '');
  const [notes,          setNotes]          = useState(order.notes ?? '');
  const [saving,         setSaving]         = useState(false);
  const [saved,          setSaved]          = useState(false);

  const currentStatusIdx = STATUS_ORDER.indexOf(status);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onUpdateStatus(order.id, status);
      await onUpdateTracking(order.id, trackingNumber, notes);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } finally {
      setSaving(false);
    }
  };

  const inputClass = "w-full px-3 py-2.5 border border-gray-200 text-sm rounded-lg focus:outline-none focus:border-[#E02020] text-gray-900 placeholder-gray-400";

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-start justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-2xl my-4 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div>
            <h2 className="font-montserrat font-bold text-gray-900">Order Details</h2>
            <p className="text-xs text-gray-400 mt-0.5 font-mono">#{order.reference}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors">
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-5 space-y-6 overflow-y-auto max-h-[80vh]">

          {/* ── Tracking Progress ── */}
          <div>
            <h3 className="font-montserrat font-bold text-sm text-gray-700 uppercase tracking-wider mb-4">Order Tracking</h3>
            <div className="relative">
              {/* Progress line */}
              <div className="absolute top-4 left-4 right-4 h-0.5 bg-gray-200 z-0" />
              <div
                className="absolute top-4 left-4 h-0.5 bg-[#E02020] z-0 transition-all duration-500"
                style={{ width: `${(currentStatusIdx / (STATUS_ORDER.length - 1)) * (100 - 8)}%` }}
              />
              <div className="relative flex justify-between z-10">
                {STATUS_ORDER.map((s, i) => {
                  const done    = i <= currentStatusIdx;
                  const current = i === currentStatusIdx;
                  return (
                    <div key={s} className="flex flex-col items-center gap-2" style={{ width: '25%' }}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                        done ? 'bg-[#E02020] border-[#E02020]' : 'bg-white border-gray-300'
                      } ${current ? 'ring-4 ring-red-100' : ''}`}>
                        {done ? (
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <div className="w-2 h-2 rounded-full bg-gray-300" />
                        )}
                      </div>
                      <span className={`text-[10px] font-semibold text-center leading-tight ${done ? 'text-[#E02020]' : 'text-gray-400'}`}>
                        {STATUS_LABELS[s]}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ── Update Status ── */}
          <div className="bg-gray-50 rounded-xl p-4 space-y-4">
            <h3 className="font-montserrat font-bold text-sm text-gray-700 uppercase tracking-wider">Update Order</h3>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Status</label>
              <div className="grid grid-cols-2 gap-2">
                {STATUS_ORDER.map(s => (
                  <button
                    key={s}
                    onClick={() => setStatus(s)}
                    className={`py-2 px-3 rounded-lg text-xs font-bold border transition-all ${
                      status === s
                        ? STATUS_STYLES[s] + ' ring-2 ring-offset-1 ring-current'
                        : 'border-gray-200 text-gray-500 hover:bg-gray-100'
                    }`}
                  >
                    {STATUS_LABELS[s]}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Tracking Number</label>
              <input type="text" value={trackingNumber} onChange={e => setTrackingNumber(e.target.value)}
                placeholder="e.g. TRK123456789NG" className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Admin Notes</label>
              <textarea value={notes} onChange={e => setNotes(e.target.value)}
                placeholder="Internal notes about this order..." rows={2}
                className={inputClass + ' resize-none'} />
            </div>
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full bg-[#E02020] text-white font-semibold py-3 rounded-xl text-sm hover:bg-red-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
            >
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
          </div>

          {/* ── Customer Info ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="border border-gray-100 rounded-xl p-4">
              <h3 className="font-montserrat font-bold text-xs text-gray-500 uppercase tracking-wider mb-3">Customer</h3>
              <p className="font-semibold text-gray-900 text-sm">{order.customerName}</p>
              <p className="text-sm text-gray-500 mt-1">{order.email}</p>
              <p className="text-sm text-gray-500">{order.phone}</p>
            </div>
            <div className="border border-gray-100 rounded-xl p-4">
              <h3 className="font-montserrat font-bold text-xs text-gray-500 uppercase tracking-wider mb-3">Delivery Address</h3>
              <p className="text-sm text-gray-700">{order.address}</p>
              <p className="text-sm text-gray-700">{order.city}, {order.state}</p>
              <p className="text-sm text-gray-500">{order.country}</p>
            </div>
          </div>

          {/* ── Order Items ── */}
          <div>
            <h3 className="font-montserrat font-bold text-xs text-gray-500 uppercase tracking-wider mb-3">Items Ordered</h3>
            <div className="border border-gray-100 rounded-xl overflow-hidden divide-y divide-gray-50">
              {order.items?.map(item => (
                <div key={item.id} className="flex items-center gap-3 p-3">
                  <img src={item.image} alt={item.name}
                    className="w-12 h-12 object-cover rounded-lg bg-gray-100 flex-shrink-0"
                    onError={e => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&q=80'; }} />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-gray-900 truncate">{item.name}</p>
                    <p className="text-xs text-gray-400">{item.category} · Qty: {item.quantity}</p>
                  </div>
                  <p className="font-bold text-sm text-gray-900 flex-shrink-0">
                    {item.currency === 'NGN' ? '₦' : 'CA$'}{(item.price * item.quantity).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center mt-3 px-3">
              <span className="font-semibold text-gray-600 text-sm">Total</span>
              <span className="font-montserrat font-extrabold text-gray-900">
                {order.currency === 'NGN' ? '₦' : 'CA$'}{order.total?.toLocaleString()}
              </span>
            </div>
          </div>

          {/* ── Tracking History ── */}
          {order.trackingEvents && order.trackingEvents.length > 0 && (
            <div>
              <h3 className="font-montserrat font-bold text-xs text-gray-500 uppercase tracking-wider mb-3">Tracking History</h3>
              <div className="space-y-2">
                {order.trackingEvents.map((ev, i) => (
                  <div key={i} className={`flex gap-3 p-3 rounded-lg border ${STATUS_STYLES[ev.status]}`}>
                    <div className="flex-1">
                      <p className="font-semibold text-xs">{STATUS_LABELS[ev.status]}</p>
                      <p className="text-xs opacity-80 mt-0.5">{ev.message}</p>
                    </div>
                    <p className="text-xs opacity-60 flex-shrink-0">{ev.timestamp}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── MAIN AdminOrders ─────────────────────────────────────────────────────────
const AdminOrders = () => {
  const [orders,    setOrders]    = useState<FullOrder[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [selected,  setSelected]  = useState<FullOrder | null>(null);
  const [search,    setSearch]    = useState('');
  const [filterStatus,  setFilterStatus]  = useState<'all' | OrderStatus>('all');
  const [filterCountry, setFilterCountry] = useState<'all' | 'ng' | 'ca'>('all');

  // Load orders from Firestore
  const loadOrders = async () => {
    setLoading(true);
    try {
      const q    = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      setOrders(snap.docs.map(d => ({ id: d.id, ...d.data() } as FullOrder)));
    } catch (e) {
      console.error('Failed to load orders:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadOrders(); }, []);

  // Update order status in Firestore + add tracking event
  const handleUpdateStatus = async (orderId: string, status: OrderStatus) => {
    const orderRef = doc(db, 'orders', orderId);
    const event: TrackingEvent = {
      status,
      message:   TRACKING_MESSAGES[status],
      timestamp: new Date().toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
    };
    const existing = orders.find(o => o.id === orderId);
    const events   = [...(existing?.trackingEvents ?? [])];
    // Only add if status changed
    if (!events.some(e => e.status === status)) events.push(event);

    await updateDoc(orderRef, {
      status,
      trackingEvents: events,
      updatedAt: serverTimestamp(),
    });
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status, trackingEvents: events } : o));
    if (selected?.id === orderId) setSelected(prev => prev ? { ...prev, status, trackingEvents: events } : prev);
  };

  const handleUpdateTracking = async (orderId: string, trackingNumber: string, notes: string) => {
    await updateDoc(doc(db, 'orders', orderId), { trackingNumber, notes, updatedAt: serverTimestamp() });
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, trackingNumber, notes } : o));
    if (selected?.id === orderId) setSelected(prev => prev ? { ...prev, trackingNumber, notes } : prev);
  };

  // Filter
  const filtered = orders.filter(o => {
    const search_lower = search.toLowerCase();
    const matchSearch  = !search ||
      o.customerName?.toLowerCase().includes(search_lower) ||
      o.reference?.toLowerCase().includes(search_lower) ||
      o.email?.toLowerCase().includes(search_lower) ||
      o.trackingNumber?.toLowerCase().includes(search_lower);
    const matchStatus  = filterStatus === 'all' || o.status === filterStatus;
    const matchCountry = filterCountry === 'all' ||
      (filterCountry === 'ng' && o.currency === 'NGN') ||
      (filterCountry === 'ca' && o.currency === 'CAD');
    return matchSearch && matchStatus && matchCountry;
  });

  // Stats
  const stats: Record<string, number> = {
    total:      orders.length,
    paid:       orders.filter(o => o.status === 'paid').length,
    processing: orders.filter(o => o.status === 'processing').length,
    shipped:    orders.filter(o => o.status === 'shipped').length,
    delivered:  orders.filter(o => o.status === 'delivered').length,
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-montserrat font-bold text-xl text-gray-900">Orders</h1>
          <p className="text-gray-500 text-sm">{orders.length} total orders from Firestore</p>
        </div>
        <button onClick={loadOrders}
          className="flex items-center gap-2 border border-gray-200 text-gray-600 font-semibold px-4 py-2.5 rounded-xl text-sm hover:bg-gray-50 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {[
          { key: 'total',      label: 'Total',      color: 'bg-gray-100 text-gray-700'   },
          { key: 'paid',       label: 'Placed',     color: 'bg-blue-100 text-blue-700'   },
          { key: 'processing', label: 'Processing', color: 'bg-yellow-100 text-yellow-700' },
          { key: 'shipped',    label: 'Shipped',    color: 'bg-purple-100 text-purple-700' },
          { key: 'delivered',  label: 'Delivered',  color: 'bg-green-100 text-green-700' },
        ].map(s => (
          <div key={s.key} className={`${s.color} rounded-xl p-3 text-center`}>
            <p className="font-montserrat font-extrabold text-xl">{stats[s.key]}</p>
            <p className="text-xs font-semibold mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search name, reference, email or tracking..."
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#E02020] text-gray-900" />
        </div>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value as typeof filterStatus)}
          className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#E02020] text-gray-700 bg-white">
          <option value="all">All Statuses</option>
          <option value="paid">Order Placed</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
        </select>
        <select value={filterCountry} onChange={e => setFilterCountry(e.target.value as typeof filterCountry)}
          className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#E02020] text-gray-700 bg-white">
          <option value="all">All Countries</option>
          <option value="ng">🇳🇬 Nigeria</option>
          <option value="ca">🇨🇦 Canada</option>
        </select>
      </div>

      {/* Orders Table / Cards */}
      {loading ? (
        <div className="flex items-center justify-center py-20 bg-white rounded-2xl border border-gray-100">
          <svg className="w-8 h-8 animate-spin text-[#E02020]" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
          <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p className="text-gray-500 font-semibold">No orders found</p>
          <p className="text-gray-400 text-sm mt-1">Try adjusting your filters</p>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    {['Reference', 'Customer', 'Date', 'Items', 'Total', 'Status', 'Tracking', 'Action'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map(order => (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <p className="font-mono text-xs text-gray-600">{order.reference?.slice(-10).toUpperCase()}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{order.currency === 'NGN' ? '🇳🇬' : '🇨🇦'}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-semibold text-sm text-gray-900 whitespace-nowrap">{order.customerName}</p>
                        <p className="text-xs text-gray-400 truncate max-w-[140px]">{order.email}</p>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">{formatDate(order.createdAt)}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{order.items?.length ?? 0} items</td>
                      <td className="px-4 py-3">
                        <p className="font-bold text-sm text-gray-900 whitespace-nowrap">
                          {order.currency === 'NGN' ? '₦' : 'CA$'}{order.total?.toLocaleString()}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${STATUS_STYLES[order.status as OrderStatus] ?? 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                          {STATUS_LABELS[order.status as OrderStatus] ?? order.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {order.trackingNumber ? (
                          <p className="font-mono text-xs text-purple-700 bg-purple-50 px-2 py-0.5 rounded">{order.trackingNumber}</p>
                        ) : (
                          <p className="text-xs text-gray-300">—</p>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => setSelected(order)}
                          className="flex items-center gap-1.5 text-xs font-semibold text-[#E02020] hover:underline whitespace-nowrap"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Manage
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-3">
            {filtered.map(order => (
              <div key={order.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{order.customerName}</p>
                    <p className="font-mono text-xs text-gray-400 mt-0.5">#{order.reference?.slice(-10).toUpperCase()}</p>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border flex-shrink-0 ${STATUS_STYLES[order.status as OrderStatus] ?? 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                    {STATUS_LABELS[order.status as OrderStatus] ?? order.status}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm mb-3">
                  <span className="text-gray-500 text-xs">{formatDate(order.createdAt)}</span>
                  <span className="font-montserrat font-bold text-gray-900">
                    {order.currency === 'NGN' ? '₦' : 'CA$'}{order.total?.toLocaleString()}
                  </span>
                </div>
                {order.trackingNumber && (
                  <p className="font-mono text-xs text-purple-700 bg-purple-50 px-2 py-1 rounded mb-3">
                    📦 {order.trackingNumber}
                  </p>
                )}
                <button
                  onClick={() => setSelected(order)}
                  className="w-full bg-[#E02020] text-white font-semibold py-2.5 rounded-xl text-sm hover:bg-red-700 transition-colors"
                >
                  Manage Order →
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Detail Modal */}
      {selected && (
        <OrderDetailModal
          order={selected}
          onClose={() => setSelected(null)}
          onUpdateStatus={handleUpdateStatus}
          onUpdateTracking={handleUpdateTracking}
        />
      )}
    </div>
  );
};

export default AdminOrders;
