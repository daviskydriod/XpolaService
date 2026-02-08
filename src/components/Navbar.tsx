// FILE PATH: src/components/common/Navbar.tsx
// Place this file at: src/components/common/Navbar.tsx

import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Moon, Sun, ChevronDown } from "lucide-react";
import { useCountry } from "@/contexts/CountryContext";
import { useTheme } from "@/contexts/ThemeContext";
import logoWhite from "@/assets/logo-white.png";
import logoBlack from "@/assets/logo-black.png";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
  { label: "Projects", href: "/projects" },
  { label: "Contact", href: "/contact" },
];

const countries = [
  { code: "nigeria", name: "Nigeria", flag: "🇳🇬" },
  { code: "canada", name: "Canada", flag: "🇨🇦" },
];

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const { selectedCountry, setSelectedCountry } = useCountry();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const currentCountry = countries.find(c => c.code === selectedCountry);
  
  // Use white logo for dark theme, black logo for light theme
  const currentLogo = theme === 'dark' ? logoWhite : logoBlack;

  const isActivePage = (href: string) => {
    if (href === '/') return location.pathname === '/';
    return location.pathname.startsWith(href);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/95 backdrop-blur-md shadow-lg border-b border-border"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img 
              src={currentLogo} 
              alt="Xpola" 
              className="h-8 md:h-10 transition-opacity duration-300" 
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link, index) => (
              <Link
                key={index}
                to={link.href}
                className={`font-poppins text-sm transition-colors duration-200 hover:text-primary ${
                  isActivePage(link.href) ? 'text-primary font-semibold' : 'text-muted-foreground'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Side Controls */}
          <div className="flex items-center gap-4">
            {/* Country Selector */}
            <div className="relative">
              <button
                onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-background-secondary border border-border hover:border-primary transition-all duration-200"
              >
                <span className="text-xl">{currentCountry?.flag}</span>
                <span className="hidden sm:inline font-poppins text-sm text-foreground">
                  {currentCountry?.name}
                </span>
                <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${isCountryDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown */}
              {isCountryDropdownOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-background border border-border rounded-lg shadow-xl overflow-hidden">
                  {countries.map((country) => (
                    <button
                      key={country.code}
                      onClick={() => {
                        setSelectedCountry(country.code);
                        setIsCountryDropdownOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 font-poppins text-sm transition-colors ${
                        selectedCountry === country.code
                          ? 'bg-primary/10 text-primary'
                          : 'text-foreground hover:bg-background-secondary'
                      }`}
                    >
                      <span className="text-xl">{country.flag}</span>
                      <span>{country.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-background-secondary border border-border hover:border-primary transition-all duration-200"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-foreground" />
              ) : (
                <Moon className="w-5 h-5 text-foreground" />
              )}
            </button>

            {/* CTA Button */}
            <div className="hidden md:block">
              <Link
                to="/contact"
                className="font-poppins font-semibold text-sm text-white bg-primary hover:bg-primary/90 px-6 py-2.5 rounded-lg transition-all duration-300 hover:scale-105"
              >
                Get Started
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden w-10 h-10 flex items-center justify-center text-foreground"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-background/98 backdrop-blur-md border-t border-border">
          <div className="container mx-auto px-4 py-6 space-y-4">
            {navLinks.map((link, index) => (
              <Link
                key={index}
                to={link.href}
                className={`block font-poppins text-base transition-colors duration-200 hover:text-primary py-2 ${
                  isActivePage(link.href) ? 'text-primary font-semibold' : 'text-muted-foreground'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/contact"
              className="block font-poppins font-semibold text-center text-white bg-primary hover:bg-primary/90 px-6 py-3 rounded-lg transition-all duration-300 mt-4"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
