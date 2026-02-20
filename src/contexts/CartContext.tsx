// FILE PATH: src/contexts/CartContext.tsx
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, CartItem } from '@/data/shopData';

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product) => boolean; // returns false if blocked
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  blockedMessage: string | null;
  clearBlockedMessage: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('xpola_cart') || '[]');
    } catch { return []; }
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [blockedMessage, setBlockedMessage] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('xpola_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: Product): boolean => {
    // ── Block mixing Nigeria & Canada products ──
    if (cart.length > 0) {
      const cartCountry = cart[0].country; // 'nigeria' or 'canada'
      if (product.country !== cartCountry) {
        const cartStoreName  = cartCountry === 'nigeria' ? 'Nigeria 🇳🇬' : 'Canada 🇨🇦';
        const itemStoreName  = product.country === 'nigeria' ? 'Nigeria 🇳🇬' : 'Canada 🇨🇦';
        setBlockedMessage(
          `You already have items from the ${cartStoreName} store in your cart. Please clear your cart before adding items from the ${itemStoreName} store.`
        );
        setIsCartOpen(true);
        return false;
      }
    }

    setCart(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) {
        return prev.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
    return true;
  };

  const removeFromCart = (id: string) => setCart(prev => prev.filter(i => i.id !== id));

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) { removeFromCart(id); return; }
    setCart(prev => prev.map(i => i.id === id ? { ...i, quantity } : i));
  };

 const clearCart = () => {
  setCart([]);
  localStorage.removeItem('cart'); // ← this line is critical if you persist the cart
};
  const clearBlockedMessage = () => setBlockedMessage(null);

  const cartTotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{
      cart, addToCart, removeFromCart, updateQuantity, clearCart,
      cartTotal, cartCount, isCartOpen, setIsCartOpen,
      blockedMessage, clearBlockedMessage,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
