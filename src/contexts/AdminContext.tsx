// FILE PATH: src/contexts/AdminContext.tsx
// Place this file at: src/contexts/AdminContext.tsx
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, allProducts, dummyOrders, Order } from '@/data/shopData';

interface AdminContextType {
  isAuthenticated: boolean;
  login: (password: string) => boolean;
  logout: () => void;
  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'rating' | 'reviews'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  orders: Order[];
  updateOrderStatus: (id: string, status: Order['status']) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

const ADMIN_PASSWORD = 'xpola2024'; // Replace with env var when connecting to API

export const AdminProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() =>
    localStorage.getItem('xpola_admin_auth') === 'true'
  );

  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const stored = localStorage.getItem('xpola_products');
      return stored ? JSON.parse(stored) : allProducts;
    } catch { return allProducts; }
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const stored = localStorage.getItem('xpola_orders');
      return stored ? JSON.parse(stored) : dummyOrders;
    } catch { return dummyOrders; }
  });

  useEffect(() => {
    localStorage.setItem('xpola_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('xpola_orders', JSON.stringify(orders));
  }, [orders]);

  const login = (password: string) => {
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      localStorage.setItem('xpola_admin_auth', 'true');
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('xpola_admin_auth');
  };

  const addProduct = (productData: Omit<Product, 'id' | 'createdAt' | 'rating' | 'reviews'>) => {
    const newProduct: Product = {
      ...productData,
      id: `${productData.country.slice(0, 2)}-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      rating: 0,
      reviews: 0,
    };
    setProducts(prev => [newProduct, ...prev]);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const updateOrderStatus = (id: string, status: Order['status']) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
  };

  return (
    <AdminContext.Provider value={{
      isAuthenticated, login, logout,
      products, addProduct, updateProduct, deleteProduct,
      orders, updateOrderStatus,
    }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error('useAdmin must be used within AdminProvider');
  return ctx;
};
