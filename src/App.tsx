// FILE PATH: src/App.tsx
// Place this file at: src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { CountryProvider } from '@/contexts/CountryContext';
import { CartProvider } from '@/contexts/CartContext';
import { AdminProvider } from '@/contexts/AdminContext';

// Global pages
import Index from '@/pages/Index';
import Services from '@/pages/Services';
import About from '@/pages/About';
import Projects from '@/pages/Projects';
import Contact from '@/pages/Contact';

// Shop, Checkout & Admin pages
import Shop from '@/pages/Shop';
import Checkout from '@/pages/Checkout';
import OrderSuccess from '@/pages/OrderSuccess';
import AdminLogin from '@/pages/admin/AdminLogin';
import AdminDashboard from '@/pages/admin/AdminDashboard';

// Nigeria service pages
import ConsultingNigeria from '@/pages/nigeria/ConsultingService';
import OilGasNigeria from '@/pages/nigeria/OilGasService';
import ConstructionNigeria from '@/pages/nigeria/ConstructionService';
import MiningNigeria from '@/pages/nigeria/MiningService';
import CommerceNigeria from '@/pages/nigeria/CommerceService';
import EcommerceNigeria from '@/pages/nigeria/EcommerceService';
import LogisticsNigeria from '@/pages/nigeria/LogisticsService';

// Canada service pages
import ConsultingCanada from '@/pages/canada/ConsultingService';
import OperationsCanada from '@/pages/canada/OperationsService';
import LogisticsCanada from '@/pages/canada/LogisticsService';
import TradeCanada from '@/pages/canada/TradeService';
import CommunityCanada from '@/pages/canada/CommunityService';

import './styles/globals.css';

const App = () => {
  return (
    <ThemeProvider>
      <AdminProvider>
        <CartProvider>
          <BrowserRouter>
            <CountryProvider>
              <Routes>
                {/* ── Global Pages ── */}
                <Route path="/"         element={<Index />} />
                <Route path="/services" element={<Services />} />
                <Route path="/about"    element={<About />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/contact"  element={<Contact />} />

                {/* ── Checkout Flow (shared across both countries) ── */}
                <Route path="/checkout"      element={<Checkout />} />
                <Route path="/order-success" element={<OrderSuccess />} />

                {/* ── Nigeria Main Pages ── */}
                <Route path="/nigeria"          element={<Index />} />
                <Route path="/nigeria/about"    element={<About />} />
                <Route path="/nigeria/services" element={<Services />} />
                <Route path="/nigeria/projects" element={<Projects />} />
                <Route path="/nigeria/contact"  element={<Contact />} />

                {/* ── Nigeria Shop ── */}
                <Route path="/nigeria/shop" element={<Shop />} />

                {/* ── Nigeria Service Pages ── */}
                <Route path="/nigeria/services/consulting"   element={<ConsultingNigeria />} />
                <Route path="/nigeria/services/oil-gas"      element={<OilGasNigeria />} />
                <Route path="/nigeria/services/construction" element={<ConstructionNigeria />} />
                <Route path="/nigeria/services/mining"       element={<MiningNigeria />} />
                <Route path="/nigeria/services/commerce"     element={<CommerceNigeria />} />
                <Route path="/nigeria/services/ecommerce"    element={<EcommerceNigeria />} />
                <Route path="/nigeria/services/logistics"    element={<LogisticsNigeria />} />

                {/* ── Canada Main Pages ── */}
                <Route path="/canada"          element={<Index />} />
                <Route path="/canada/about"    element={<About />} />
                <Route path="/canada/services" element={<Services />} />
                <Route path="/canada/projects" element={<Projects />} />
                <Route path="/canada/contact"  element={<Contact />} />

                {/* ── Canada Shop ── */}
                <Route path="/canada/shop" element={<Shop />} />

                {/* ── Canada Service Pages ── */}
                <Route path="/canada/services/consulting" element={<ConsultingCanada />} />
                <Route path="/canada/services/operations" element={<OperationsCanada />} />
                <Route path="/canada/services/logistics"  element={<LogisticsCanada />} />
                <Route path="/canada/services/trade"      element={<TradeCanada />} />
                <Route path="/canada/services/community"  element={<CommunityCanada />} />

                {/* ── Admin ── */}
                <Route path="/admin"           element={<AdminLogin />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />

                {/* ── 404 Catch-all ── */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </CountryProvider>
          </BrowserRouter>
        </CartProvider>
      </AdminProvider>
    </ThemeProvider>
  );
};

export default App;
