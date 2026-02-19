// FILE PATH: src/components/admin/AdminSidebar.tsx
// Place this file at: src/components/admin/AdminSidebar.tsx

export type AdminView = 'overview' | 'products' | 'orders';

interface AdminSidebarProps {
  view: AdminView;
  setView: (v: AdminView) => void;
  onLogout: () => void;
}

const NAV_ITEMS: { id: AdminView; label: string; iconPath: string }[] = [
  {
    id: 'overview',
    label: 'Overview',
    iconPath:
      'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
  },
  {
    id: 'products',
    label: 'Products',
    iconPath:
      'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4',
  },
  {
    id: 'orders',
    label: 'Orders',
    iconPath:
      'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
  },
];

const AdminSidebar = ({ view, setView, onLogout }: AdminSidebarProps) => {
  return (
    <aside className="w-64 bg-gray-950 border-r border-gray-800 min-h-screen flex flex-col flex-shrink-0">
      {/* Brand red strip */}
      <div className="h-1 bg-[#E02020]" />

      {/* Logo */}
      <div className="px-6 py-6 border-b border-gray-800">
        <a href="/" className="inline-block">
          <span className="font-montserrat font-extrabold text-2xl text-white tracking-tight">
            xp<span className="text-[#E02020]">ola</span>
          </span>
        </a>
        <p className="text-gray-600 text-xs font-poppins mt-0.5 uppercase tracking-widest">
          Admin Panel
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-3 space-y-1">
        {NAV_ITEMS.map(item => (
          <button
            key={item.id}
            onClick={() => setView(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold font-poppins transition-all ${
              view === item.id
                ? 'bg-[#E02020] text-white'
                : 'text-gray-500 hover:bg-gray-900 hover:text-white'
            }`}
          >
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.iconPath} />
            </svg>
            {item.label}
          </button>
        ))}
      </nav>

      {/* Bottom links */}
      <div className="px-3 py-4 border-t border-gray-800 space-y-1">
        {/* Nigeria store link */}
        <a
          href="/nigeria/shop"
          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-500 hover:text-white hover:bg-gray-900 transition-all font-poppins"
        >
          <span className="text-base">🇳🇬</span>
          Nigeria Store
        </a>
        {/* Canada store link */}
        <a
          href="/canada/shop"
          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-500 hover:text-white hover:bg-gray-900 transition-all font-poppins"
        >
          <span className="text-base">🇨🇦</span>
          Canada Store
        </a>

        {/* View website */}
        <a
          href="/"
          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-500 hover:text-white hover:bg-gray-900 transition-all font-poppins"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
          View Website
        </a>

        {/* Logout */}
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-700 hover:text-[#E02020] hover:bg-red-950 transition-all font-poppins"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          Logout
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
