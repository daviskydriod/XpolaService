import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { CountryProvider } from '@/contexts/CountryContext';
import Index from '@/pages/Index';
import Services from '@/pages/Services';
import About from '@/pages/About';
import Projects from '@/pages/Projects';
import Contact from '@/pages/Contact';

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
      <CountryProvider>
        <BrowserRouter>
          <Routes>
            {/* Main Pages */}
            <Route path="/" element={<Index />} />
            <Route path="/services" element={<Services />} />
            <Route path="/about" element={<About />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/contact" element={<Contact />} />
            
            {/* Nigeria Service Pages */}
            <Route path="/nigeria/services/consulting" element={<ConsultingNigeria />} />
            <Route path="/nigeria/services/oil-gas" element={<OilGasNigeria />} />
            <Route path="/nigeria/services/construction" element={<ConstructionNigeria />} />
            <Route path="/nigeria/services/mining" element={<MiningNigeria />} />
            <Route path="/nigeria/services/commerce" element={<CommerceNigeria />} />
            <Route path="/nigeria/services/ecommerce" element={<EcommerceNigeria />} />
            <Route path="/nigeria/services/logistics" element={<LogisticsNigeria />} />
            
            {/* Canada Service Pages */}
            <Route path="/canada/services/consulting" element={<ConsultingCanada />} />
            <Route path="/canada/services/operations" element={<OperationsCanada />} />
            <Route path="/canada/services/logistics" element={<LogisticsCanada />} />
            <Route path="/canada/services/trade" element={<TradeCanada />} />
            <Route path="/canada/services/community" element={<CommunityCanada />} />
            
            {/* 404 - Catch all */}
            <Route path="*" element={<Index />} />
          </Routes>
        </BrowserRouter>
      </CountryProvider>
    </ThemeProvider>
  );
};

export default App;
