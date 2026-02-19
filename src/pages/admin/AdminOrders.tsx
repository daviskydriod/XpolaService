// FILE PATH: src/pages/admin/AdminOrders.tsx
// Place this file at: src/pages/admin/AdminOrders.tsx
import { useState } from 'react';
import { useAdmin } from '../../contexts/AdminContext';
import { Order, formatPrice } from '@/data/shopData';

const statusConfig: Record<Order['status'], { color: string; label: string; next: Order['status'] | null }> = {
  pending:    { color: 'bg-yellow-100 text-yellow-700', label: 'Pending',    next: 'processing' },
  processing: { color: 'bg-blue-100 text-blue-700',    label: 'Processing', next: 'shipped' },
  shipped:    { color: 'bg-purple-100 text-purple-700', label: 'Shipped',   next: 'delivered' },
  delivered:  { color: 'bg-green-100 text-green-700',  label: 'Delivered',  next: null },
};

const OrderDetailModal = ({ order, onClose, onUpdateStatus }: { order: Order; onClose: () => void; onUpdateStatus: (id: string, status: Order['status']) => void }) => {
  const cfg = statusConfig[order.status];

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h2 className="font-montserrat font-bold text-xl text-gray-900">{order.id}</h2>
            <p className="text-sm text-gray-400">{order.date}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Customer */}
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-xs font-bold text-gray-400 uppercase mb-2">Customer</p>
            <p className="font-semibold text-gray-900">{order.customerName}</p>
            <p className="text-sm text-gray-500">{order.customerEmail}</p>
            <p className="text-sm text-gray-500 mt-1">{order.country === 'nigeria' ? '🇳🇬 Nigeria' : '🇨🇦 Canada'}</p>
          </div>

          {/* Items */}
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase mb-3">Order Items</p>
            <div className="space-y-3">
              {order.items.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded-lg bg-gray-100 flex-shrink-0"
                    onError={e => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&q=80'; }} />
                  <div className="flex-1">
                    <p className="font-semibold text-sm text-gray-900">{item.name}</p>
                    <p className="text-xs text-gray-400">Qty: {item.quantity} × {formatPrice(item.price, item.currency)}</p>
                  </div>
                  <p className="font-bold text-sm text-gray-900">{formatPrice(item.price * item.quantity, item.currency)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="flex justify-between items-center py-3 border-t border-gray-100">
            <span className="font-bold text-gray-900">Total</span>
            <span className="font-extrabold text-xl text-gray-900">
              {formatPrice(order.total, order.country === 'nigeria' ? 'NGN' : 'CAD')}
            </span>
          </div>

          {/* Status */}
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase mb-3">Status</p>
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1.5 rounded-full text-sm font-bold ${cfg.color}`}>{cfg.label}</span>
              {cfg.next && (
                <button
                  onClick={() => { onUpdateStatus(order.id, cfg.next!); onClose(); }}
                  className="flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
                >
                  Mark as {statusConfig[cfg.next].label} →
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AdminOrders = () => {
  const { orders, updateOrderStatus } = useAdmin();
  const [countryFilter, setCountryFilter] = useState<'all' | 'nigeria' | 'canada'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | Order['status']>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filtered = orders.filter(o => {
    const matchCountry = countryFilter === 'all' || o.country === countryFilter;
    const matchStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchCountry && matchStatus;
  });

  const counts = {
    all: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    processing: orders.filter(o => o.status === 'processing').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
  };

  return (
    <div className="space-y-6">
      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onUpdateStatus={updateOrderStatus}
        />
      )}

      <div>
        <h1 className="font-montserrat font-bold text-2xl text-gray-900">Orders</h1>
        <p className="text-gray-500 text-sm mt-0.5">{orders.length} total orders</p>
      </div>

      {/* Status tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {(['all', 'pending', 'processing', 'shipped', 'delivered'] as const).map(s => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              statusFilter === s ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <span className="capitalize">{s}</span>
            <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${statusFilter === s ? 'bg-white/20' : 'bg-white'}`}>
              {counts[s]}
            </span>
          </button>
        ))}
      </div>

      {/* Country filter */}
      <div className="flex gap-2">
        {(['all', 'nigeria', 'canada'] as const).map(c => (
          <button
            key={c}
            onClick={() => setCountryFilter(c)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold capitalize transition-all ${
              countryFilter === c ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {c === 'nigeria' ? '🇳🇬 ' : c === 'canada' ? '🇨🇦 ' : ''}{c}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wide">Order ID</th>
                <th className="text-left px-4 py-4 text-xs font-bold text-gray-500 uppercase tracking-wide">Customer</th>
                <th className="text-left px-4 py-4 text-xs font-bold text-gray-500 uppercase tracking-wide">Store</th>
                <th className="text-left px-4 py-4 text-xs font-bold text-gray-500 uppercase tracking-wide">Items</th>
                <th className="text-left px-4 py-4 text-xs font-bold text-gray-500 uppercase tracking-wide">Total</th>
                <th className="text-left px-4 py-4 text-xs font-bold text-gray-500 uppercase tracking-wide">Status</th>
                <th className="text-left px-4 py-4 text-xs font-bold text-gray-500 uppercase tracking-wide">Date</th>
                <th className="text-left px-4 py-4 text-xs font-bold text-gray-500 uppercase tracking-wide">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-gray-400 font-semibold">No orders found</td>
                </tr>
              ) : filtered.map(order => {
                const cfg = statusConfig[order.status];
                return (
                  <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-mono font-bold text-sm text-gray-900">{order.id}</span>
                    </td>
                    <td className="px-4 py-4">
                      <p className="font-semibold text-sm text-gray-900">{order.customerName}</p>
                      <p className="text-xs text-gray-400">{order.customerEmail}</p>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm">{order.country === 'nigeria' ? '🇳🇬 Nigeria' : '🇨🇦 Canada'}</span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm text-gray-600">{order.items.reduce((s, i) => s + i.quantity, 0)} items</span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="font-bold text-sm text-gray-900">
                        {formatPrice(order.total, order.country === 'nigeria' ? 'NGN' : 'CAD')}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${cfg.color}`}>{cfg.label}</span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm text-gray-500">{order.date}</span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="text-xs bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                        >
                          View
                        </button>
                        {cfg.next && (
                          <button
                            onClick={() => updateOrderStatus(order.id, cfg.next!)}
                            className="text-xs bg-primary/10 text-primary px-3 py-1.5 rounded-lg font-semibold hover:bg-primary/20 transition-colors"
                          >
                            → {statusConfig[cfg.next].label}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;
