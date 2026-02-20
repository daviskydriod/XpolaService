// FILE PATH: src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider }   from '@/contexts/ThemeContext';
import { CountryProvider } from '@/contexts/CountryContext';
import { CartProvider }    from '@/contexts/CartContext';
import { AdminProvider }   from '@/contexts/AdminContext';

// Global pages
import Index    from '@/pages/Index';
import Services from '@/pages/Services';
import About    from '@/pages/About';
import Projects from '@/pages/Projects';
import Contact  from '@/pages/Contact';

// Shop flow
import Shop          from '@/pages/Shop';
import ShopCategory  from '@/pages/ShopCategory';
import ProductDetail from '@/pages/ProductDetail';

// Admin
import AdminLogin     from '@/pages/admin/AdminLogin';
import AdminDashboard from '@/pages/admin/AdminDashboard';

import './styles/globals.css';

const App = () => {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <CountryProvider>
          <CartProvider>
            <AdminProvider>
              <Routes>
                <Route path="/"         element={<Index />} />
                <Route path="/services" element={<Services />} />
                <Route path="/about"    element={<About />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/contact"  element={<Contact />} />
                <Route path="/shop/product/:id" element={<ProductDetail />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </AdminProvider>
          </CartProvider>
        </CountryProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
