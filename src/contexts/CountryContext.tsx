// FILE PATH: src/contexts/CountryContext.tsx
// Place this file at: src/contexts/CountryContext.tsx

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { countryData, CountryData } from '@/data/countryData';

// Context type
interface CountryContextType {
  selectedCountry: string;
  setSelectedCountry: (country: string) => void;
  currentData: CountryData;
  allCountries: { code: string; name: string; flag: string }[];
}

// Create context
const CountryContext = createContext<CountryContextType | undefined>(undefined);

// Provider component
export const CountryProvider = ({ children }: { children: ReactNode }) => {
  const [selectedCountry, setSelectedCountry] = useState<string>('nigeria');
  const location = useLocation();

  // Detect country from URL path on route change
  useEffect(() => {
    const path = location.pathname;
    
    if (path.startsWith('/canada')) {
      setSelectedCountry('canada');
    } else if (path.startsWith('/nigeria')) {
      setSelectedCountry('nigeria');
    } else {
      // Default to Nigeria for global routes (/)
      setSelectedCountry('nigeria');
    }
  }, [location.pathname]);

  // Get current country data based on selection
  const currentData = countryData[selectedCountry] || countryData.nigeria;

  // Available countries
  const allCountries = [
    { code: 'nigeria', name: 'Nigeria', flag: '🇳🇬' },
    { code: 'canada', name: 'Canada', flag: '🇨🇦' },
  ];

  const value = {
    selectedCountry,
    setSelectedCountry,
    currentData,
    allCountries,
  };

  return (
    <CountryContext.Provider value={value}>
      {children}
    </CountryContext.Provider>
  );
};

// Hook to use the context
export const useCountry = () => {
  const context = useContext(CountryContext);
  if (context === undefined) {
    throw new Error('useCountry must be used within a CountryProvider');
  }
  return context;
};

// Re-export types
export type { CountryData };
