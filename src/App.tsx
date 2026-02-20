// FILE PATH: src/App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider }   from '@/contexts/ThemeContext';
import { CountryProvider } from '@/contexts/CountryContext';
import { CartProvider }    from '@/contexts/CartContext';
import { AdminProvider }   from '@/contexts/AdminContext';

const App = () => {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <CountryProvider>
          <CartProvider>
            <AdminProvider>
              <Routes>
                <Route path="*" element={<div style={{ padding: '2rem', fontSize: '2rem' }}>Providers working ✅</div>} />
              </Routes>
            </AdminProvider>
          </CartProvider>
        </CountryProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
