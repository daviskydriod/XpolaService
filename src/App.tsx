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
import Checkout      from '@/pages/Checkout';
import OrderSuccess  from '@/pages/OrderSuccess';

// Admin
import AdminLogin     from '@/pages/admin/AdminLogin';
import AdminDashboard from '@/pages/admin/AdminDashboard';

// Nigeria service pages
import ConsultingNigeria   from '@/pages/nigeria/ConsultingService';
import OilGasNigeria       from '@/pages/nigeria/OilGasService';
import ConstructionNigeria from '@/pages/nigeria/ConstructionService';
import MiningNigeria       from '@/pages/nigeria/MiningService';
import CommerceNigeria     from '@/pages/nigeria/CommerceService';
import EcommerceNigeria    from '@/pages/nigeria/EcommerceService';
import LogisticsNigeria    from '@/pages/nigeria/LogisticsService';

// Canada service pages
import ConsultingCanada from '@/pages/canada/ConsultingService';
import OperationsCanada from '@/pages/canada/OperationsService';
import LogisticsCanada  from '@/pages/canada/LogisticsService';
import TradeCanada      from '@/pages/canada/TradeService';
import CommunityCanada  from '@/pages/canada/CommunityService';

import './styles/globals.css';

const App = () => (
  <ThemeProvider>
    <BrowserRouter>
      <CountryProvider>
        <CartProvider>
          <AdminProvider>
            <Routes>

              {/* ── Global Pages ── */}
              <Route path="/"         element={<Index />} />
              <Route path="/services" element={<Services />} />
              <Route path="/about"    element={<About />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/contact"  element={<Contact />} />

              {/* ── Shop / Checkout ── */}
              <Route path="/shop/product/:id" element={<ProductDetail />} />
              <Route path="/checkout"         element={<Checkout />} />
              <Route path="/order-success"    element={<OrderSuccess />} />

              {/* ── Nigeria ── */}
              <Route path="/nigeria"                       element={<Index />} />
              <Route path="/nigeria/about"                 element={<About />} />
              <Route path="/nigeria/services"              element={<Services />} />
              <Route path="/nigeria/projects"              element={<Projects />} />
              <Route path="/nigeria/contact"               element={<Contact />} />
              <Route path="/nigeria/shop"                  element={<Shop />} />
              <Route path="/nigeria/shop/categories"       element={<ShopCategory />} />
              <Route path="/nigeria/services/consulting"   element={<ConsultingNigeria />} />
              <Route path="/nigeria/services/oil-gas"      element={<OilGasNigeria />} />
              <Route path="/nigeria/services/construction" element={<ConstructionNigeria />} />
              <Route path="/nigeria/services/mining"       element={<MiningNigeria />} />
              <Route path="/nigeria/services/commerce"     element={<CommerceNigeria />} />
              <Route path="/nigeria/services/ecommerce"    element={<EcommerceNigeria />} />
              <Route path="/nigeria/services/logistics"    element={<LogisticsNigeria />} />

              {/* ── Canada ── */}
              <Route path="/canada"                        element={<Index />} />
              <Route path="/canada/about"                  element={<About />} />
              <Route path="/canada/services"               element={<Services />} />
              <Route path="/canada/projects"               element={<Projects />} />
              <Route path="/canada/contact"                element={<Contact />} />
              <Route path="/canada/shop"                   element={<Shop />} />
              <Route path="/canada/shop/categories"        element={<ShopCategory />} />
              <Route path="/canada/services/consulting"    element={<ConsultingCanada />} />
              <Route path="/canada/services/operations"    element={<OperationsCanada />} />
              <Route path="/canada/services/logistics"     element={<LogisticsCanada />} />
              <Route path="/canada/services/trade"         element={<TradeCanada />} />
              <Route path="/canada/services/community"     element={<CommunityCanada />} />

              {/* ── Admin ── */}
              <Route path="/admin"           element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />

              {/* ── 404 fallback ── */}
              <Route path="*" element={<Navigate to="/" replace />} />

            </Routes>
          </AdminProvider>
        </CartProvider>
      </CountryProvider>
    </BrowserRouter>
  </ThemeProvider>
);

export default App;
