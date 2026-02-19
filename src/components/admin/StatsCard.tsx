// FILE PATH: src/components/admin/StatsCard.tsx
// Place this file at: src/components/admin/StatsCard.tsx
import { ReactNode } from 'react';

interface StatsCardProps {
  label: string;
  value: string;
  sub: string;
  icon: ReactNode;
  accent?: boolean; // red background variant
}

const StatsCard = ({ label, value, sub, icon, accent = false }: StatsCardProps) => {
  return (
    <div
      className={`p-6 border transition-all ${
        accent
          ? 'bg-[#E02020] border-[#c01a1a]'
          : 'bg-white border-gray-100 hover:border-red-200 hover:shadow-md'
      }`}
    >
      {/* Icon box */}
      <div
        className={`w-10 h-10 flex items-center justify-center mb-4 ${
          accent ? 'bg-white/20' : 'bg-red-50'
        }`}
      >
        <span className={accent ? 'text-white' : 'text-[#E02020]'}>{icon}</span>
      </div>

      {/* Value */}
      <p
        className={`font-montserrat font-extrabold text-3xl ${
          accent ? 'text-white' : 'text-gray-900'
        }`}
      >
        {value}
      </p>

      {/* Label */}
      <p
        className={`font-montserrat font-bold text-sm mt-1 ${
          accent ? 'text-white/90' : 'text-gray-700'
        }`}
      >
        {label}
      </p>

      {/* Sub-label */}
      <p
        className={`font-poppins text-xs mt-0.5 ${
          accent ? 'text-white/60' : 'text-gray-400'
        }`}
      >
        {sub}
      </p>
    </div>
  );
};

export default StatsCard;
