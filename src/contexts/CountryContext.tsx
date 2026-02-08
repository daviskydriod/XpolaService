// FILE PATH: src/contexts/CountryContext.tsx
// Place this file at: src/contexts/CountryContext.tsx

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Type definitions
interface Sector {
  title: string;
  description: string;
  icon: string;
  link: string;
}

interface Testimonial {
  quote: string;
  name: string;
  title: string;
  company: string;
  rating: number;
}

interface CountryData {
  name: string;
  code: string;
  hero: {
    title: string;
    subtitle: string;
    cta: string;
  };
  about: {
    title: string;
    description: string[];
    mission: string;
    vision: string;
  };
  stats: {
    projects: string;
    clients: string;
    experience: string;
    satisfaction: string;
  };
  sectors: Sector[];
  whyChoose: {
    title: string;
    reasons: Array<{
      title: string;
      description: string;
      icon: string;
    }>;
  };
  testimonials: Testimonial[];
  contact: {
    email: string[];
    phone: string[];
    hours: string[];
    address: string;
  };
  footer: {
    tagline: string;
    compliance: string;
  };
}

// Nigeria Data
const nigeriaData: CountryData = {
  name: 'Nigeria',
  code: 'nigeria',
  hero: {
    title: 'Empowering Nigerian Businesses for Global Success',
    subtitle: 'Comprehensive solutions across energy, construction, trade, and logistics sectors',
    cta: 'Explore Our Services',
  },
  about: {
    title: 'Leading the Way in Nigerian Industry',
    description: [
      'Xpola Services Nigeria is a premier multi-sector conglomerate delivering excellence across oil & gas, construction, mining, commerce, e-commerce, and logistics.',
      'With over a decade of experience in the Nigerian market, we combine local expertise with international standards to drive sustainable growth and innovation.',
    ],
    mission: 'To empower Nigerian businesses through integrated solutions that drive economic growth and sustainable development.',
    vision: 'To be Nigeria\'s most trusted partner in industrial and commercial excellence.',
  },
  stats: {
    projects: '150+',
    clients: '500+',
    experience: '10+',
    satisfaction: '98%',
  },
  sectors: [
    {
      title: 'Business Consulting',
      description: 'Strategic consulting services for business growth and optimization',
      icon: 'briefcase',
      link: '/nigeria/services/consulting',
    },
    {
      title: 'Oil & Gas',
      description: 'Comprehensive energy solutions and infrastructure development',
      icon: 'fuel',
      link: '/nigeria/services/oil-gas',
    },
    {
      title: 'Construction',
      description: 'Large-scale construction and infrastructure projects',
      icon: 'building',
      link: '/nigeria/services/construction',
    },
    {
      title: 'Mining',
      description: 'Sustainable mining operations and mineral extraction',
      icon: 'gem',
      link: '/nigeria/services/mining',
    },
    {
      title: 'General Commerce',
      description: 'Trade facilitation and commercial partnerships',
      icon: 'shopping-cart',
      link: '/nigeria/services/commerce',
    },
    {
      title: 'E-commerce',
      description: 'Digital commerce platforms and online retail solutions',
      icon: 'globe',
      link: '/nigeria/services/ecommerce',
    },
    {
      title: 'Logistics',
      description: 'Supply chain management and transportation services',
      icon: 'truck',
      link: '/nigeria/services/logistics',
    },
  ],
  whyChoose: {
    title: 'Why Choose Xpola Nigeria',
    reasons: [
      {
        title: 'Local Expertise',
        description: 'Deep understanding of Nigerian market dynamics and regulations',
        icon: 'map',
      },
      {
        title: 'Proven Track Record',
        description: '150+ successful projects across multiple sectors',
        icon: 'award',
      },
      {
        title: 'Integrated Solutions',
        description: 'End-to-end services from consulting to implementation',
        icon: 'layers',
      },
      {
        title: 'Sustainable Practices',
        description: 'Committed to environmental and social responsibility',
        icon: 'leaf',
      },
    ],
  },
  testimonials: [
    {
      quote: 'Xpola transformed our supply chain operations, reducing costs by 30% while improving delivery times. Their expertise in Nigerian logistics is unmatched.',
      name: 'Chidi Okonkwo',
      title: 'CEO',
      company: 'PalmTech Industries',
      rating: 5,
    },
    {
      quote: 'Working with Xpola on our mining project was seamless. They brought international standards to our Nigerian operations.',
      name: 'Amina Bello',
      title: 'Operations Director',
      company: 'NorthStar Mining',
      rating: 5,
    },
    {
      quote: 'Their e-commerce platform helped us reach customers across Nigeria. The results exceeded our expectations.',
      name: 'Tunde Adeleke',
      title: 'Founder',
      company: 'AfriStyle Fashion',
      rating: 5,
    },
  ],
  contact: {
    email: ['nigeria@xpola.com', 'info.ng@xpola.com'],
    phone: ['+234 1 234 5678', '+234 800 XPOLA NG'],
    hours: ['Monday - Friday: 8:00 AM - 6:00 PM WAT', 'Saturday: 9:00 AM - 2:00 PM WAT'],
    address: 'Lagos, Nigeria',
  },
  footer: {
    tagline: 'Empowering Nigerian businesses through excellence and innovation.',
    compliance: 'Registered with the Corporate Affairs Commission (CAC). All services comply with Nigerian regulations and international standards.',
  },
};

// Canada Data
const canadaData: CountryData = {
  name: 'Canada',
  code: 'canada',
  hero: {
    title: 'Driving Canadian Innovation Forward',
    subtitle: 'Excellence in business consulting, operations, logistics, and community development',
    cta: 'Discover Our Solutions',
  },
  about: {
    title: 'Your Partner in Canadian Business Excellence',
    description: [
      'Xpola Services Canada brings world-class business solutions to the Canadian market, specializing in consulting, operational excellence, logistics, and community engagement.',
      'We combine global best practices with deep Canadian market knowledge to help businesses thrive in competitive landscapes.',
    ],
    mission: 'To drive Canadian business success through innovative solutions and sustainable growth strategies.',
    vision: 'To be Canada\'s premier partner for integrated business solutions and community development.',
  },
  stats: {
    projects: '100+',
    clients: '300+',
    experience: '8+',
    satisfaction: '99%',
  },
  sectors: [
    {
      title: 'Business Consulting',
      description: 'Strategic advisory and business transformation services',
      icon: 'briefcase',
      link: '/canada/services/consulting',
    },
    {
      title: 'Operations Management',
      description: 'Operational excellence and process optimization',
      icon: 'settings',
      link: '/canada/services/operations',
    },
    {
      title: 'Logistics Solutions',
      description: 'Advanced supply chain and distribution management',
      icon: 'truck',
      link: '/canada/services/logistics',
    },
    {
      title: 'International Trade',
      description: 'Cross-border trade facilitation and market access',
      icon: 'globe',
      link: '/canada/services/trade',
    },
    {
      title: 'Community Development',
      description: 'Social impact and community engagement programs',
      icon: 'users',
      link: '/canada/services/community',
    },
  ],
  whyChoose: {
    title: 'Why Choose Xpola Canada',
    reasons: [
      {
        title: 'Canadian Expertise',
        description: 'Deep knowledge of Canadian business environment and regulations',
        icon: 'map',
      },
      {
        title: 'Innovative Solutions',
        description: 'Cutting-edge approaches to modern business challenges',
        icon: 'zap',
      },
      {
        title: 'Client-Focused',
        description: 'Tailored solutions designed around your specific needs',
        icon: 'target',
      },
      {
        title: 'Sustainable Impact',
        description: 'Committed to long-term value and community benefit',
        icon: 'leaf',
      },
    ],
  },
  testimonials: [
    {
      quote: 'Xpola helped us streamline our operations across three provinces. Their expertise saved us millions and improved efficiency dramatically.',
      name: 'Sarah Thompson',
      title: 'VP Operations',
      company: 'Northern Logistics Inc',
      rating: 5,
    },
    {
      quote: 'The consulting team at Xpola brought fresh perspectives that transformed our business model. Highly recommended.',
      name: 'Michael Chen',
      title: 'CEO',
      company: 'TechVentures Ltd',
      rating: 5,
    },
    {
      quote: 'Their community development program created lasting impact in our region. True partners in sustainable growth.',
      name: 'Jennifer Martin',
      title: 'Executive Director',
      company: 'Community First Foundation',
      rating: 5,
    },
  ],
  contact: {
    email: ['canada@xpola.com', 'info.ca@xpola.com'],
    phone: ['+1 (416) 123-4567', '+1 (800) XPOLA CA'],
    hours: ['Monday - Friday: 9:00 AM - 6:00 PM EST', 'Saturday: 10:00 AM - 2:00 PM EST'],
    address: 'Toronto, Ontario, Canada',
  },
  footer: {
    tagline: 'Partnering with Canadian businesses for sustainable success.',
    compliance: 'Federally incorporated in Canada. All operations comply with Canadian federal and provincial regulations.',
  },
};

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

  // Get current country data based on selection
  const currentData = selectedCountry === 'canada' ? canadaData : nigeriaData;

  // Available countries
  const allCountries = [
    { code: 'nigeria', name: 'Nigeria', flag: '🇳🇬' },
    { code: 'canada', name: 'Canada', flag: '🇨🇦' },
  ];

  // Persist country selection to localStorage
  useEffect(() => {
    const savedCountry = localStorage.getItem('selectedCountry');
    if (savedCountry && (savedCountry === 'nigeria' || savedCountry === 'canada')) {
      setSelectedCountry(savedCountry);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('selectedCountry', selectedCountry);
  }, [selectedCountry]);

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

export type { CountryData, Sector, Testimonial };
