// FILE PATH: src/components/admin/ProductTable.tsx
// Place this file at: src/components/admin/ProductTable.tsx
import { useState } from 'react';
import { Product, formatPrice } from '@/data/shopData';

interface ProductTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
}

const ProductTable = ({ products, onEdit, onDelete }: ProductTableProps) => {
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  if (products.length === 0) {
    return (
      <div className="bg-white border border-gray-100 py-16 text-center">
        <div className="w-16 h-16 bg-red-50 flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-[#E02020]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        </div>
        <p className="font-montserrat font-bold text-gray-700 text-lg">No products found</p>
        <p className="font-poppins text-sm text-gray-400 mt-1">Try adjusting your search or filter</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              {['Product', 'Category', 'Price', 'Store', 'Status', 'Actions'].map(h => (
                <th
                  key={h}
                  className="text-left px-5 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest font-montserrat whitespace-nowrap"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-50">
            {products.map(product => (
              <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                {/* Product */}
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-11 h-11 object-cover flex-shrink-0 bg-gray-100"
                      onError={e => {
                        (e.target as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&q=80';
                      }}
                    />
                    <div>
                      <p className="font-poppins font-semibold text-sm text-gray-900 max-w-[180px] truncate">
                        {product.name}
                      </p>
                      <p className="font-poppins text-xs text-gray-400 font-mono">{product.id}</p>
                    </div>
                  </div>
                </td>

                {/* Category */}
                <td className="px-5 py-4">
                  <span className="font-poppins text-xs font-semibold text-[#E02020] bg-red-50 border border-red-100 px-2.5 py-1">
                    {product.category}
                  </span>
                </td>

                {/* Price */}
                <td className="px-5 py-4">
                  <span className="font-montserrat font-bold text-sm text-gray-900">
                    {formatPrice(product.price, product.currency)}
                  </span>
                </td>

                {/* Store */}
                <td className="px-5 py-4">
                  <span className="font-poppins text-sm text-gray-600">
                    {product.country === 'nigeria' ? '🇳🇬 Nigeria' : '🇨🇦 Canada'}
                  </span>
                </td>

                {/* Status badges */}
                <td className="px-5 py-4">
                  <div className="flex flex-col gap-1">
                    <span
                      className={`font-poppins text-xs font-bold px-2 py-0.5 border w-fit ${
                        product.inStock
                          ? 'bg-green-50 text-green-700 border-green-200'
                          : 'bg-red-50 text-red-600 border-red-200'
                      }`}
                    >
                      {product.inStock ? 'In Stock' : 'Out of Stock'}
                    </span>
                    {product.featured && (
                      <span className="font-poppins text-xs font-bold px-2 py-0.5 border bg-yellow-50 text-yellow-700 border-yellow-200 w-fit">
                        Featured
                      </span>
                    )}
                  </div>
                </td>

                {/* Actions */}
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    {/* Edit button */}
                    <button
                      onClick={() => onEdit(product)}
                      className="w-8 h-8 bg-gray-100 text-gray-600 flex items-center justify-center hover:bg-gray-200 transition-colors"
                      title="Edit product"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </button>

                    {/* Delete — requires confirmation */}
                    {deleteConfirm === product.id ? (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => { onDelete(product.id); setDeleteConfirm(null); }}
                          className="text-xs bg-[#E02020] text-white px-2.5 py-1.5 font-bold font-montserrat hover:bg-[#c01a1a] transition-colors uppercase tracking-wide"
                        >
                          Delete
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(null)}
                          className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1.5 hover:bg-gray-200 transition-colors font-poppins"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirm(product.id)}
                        className="w-8 h-8 bg-red-50 text-[#E02020] flex items-center justify-center hover:bg-red-100 transition-colors"
                        title="Delete product"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductTable;
