// FILE PATH: src/components/shop/ProductFilter.tsx
// Place this file at: src/components/shop/ProductFilter.tsx
import { SortOption } from '@/hooks/useShop';

interface ProductFilterProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (cat: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  sortBy: SortOption;
  onSortChange: (s: SortOption) => void;
  showInStock: boolean;
  onInStockChange: (v: boolean) => void;
}

const ProductFilter = ({
  categories,
  selectedCategory,
  onCategoryChange,
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  showInStock,
  onInStockChange,
}: ProductFilterProps) => {
  return (
    <div className="sticky top-[72px] z-30 bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-col md:flex-row gap-3 items-start md:items-center">

          {/* ── Search ── */}
          <div className="relative w-full md:w-60 flex-shrink-0">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={e => onSearchChange(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 text-sm font-poppins focus:outline-none focus:border-[#E02020] transition-colors"
            />
          </div>

          {/* ── Category pills ── */}
          <div className="flex items-center gap-1 overflow-x-auto pb-0.5 flex-1">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => onCategoryChange(cat)}
                className={`flex-shrink-0 px-4 py-2 text-sm font-semibold font-poppins transition-all border ${
                  selectedCategory === cat
                    ? 'bg-[#E02020] text-white border-[#E02020]'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-[#E02020] hover:text-[#E02020]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* ── Right controls ── */}
          <div className="flex items-center gap-4 flex-shrink-0">
            <label className="flex items-center gap-2 text-sm text-gray-600 font-poppins cursor-pointer select-none">
              <input
                type="checkbox"
                checked={showInStock}
                onChange={e => onInStockChange(e.target.checked)}
                className="w-4 h-4 accent-[#E02020]"
              />
              In Stock Only
            </label>

            <select
              value={sortBy}
              onChange={e => onSortChange(e.target.value as SortOption)}
              className="py-2 px-3 border border-gray-200 text-sm font-poppins focus:outline-none focus:border-[#E02020] bg-white"
            >
              <option value="featured">Featured</option>
              <option value="price-asc">Price: Low → High</option>
              <option value="price-desc">Price: High → Low</option>
              <option value="rating">Top Rated</option>
              <option value="newest">Newest</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductFilter;
