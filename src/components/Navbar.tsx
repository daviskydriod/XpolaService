// FILE PATH: src/components/common/Navbar.tsx
import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Moon, Sun, ChevronDown, ShoppingCart, User, LogOut, Package } from "lucide-react";
import { useCountry } from "@/contexts/CountryContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import CartDrawer from "@/components/CartDrawer";
import logoWhite from "@/assets/logo-white.png";
import logoBlack from "@/assets/logo-black.png";

const countries = [
  { code: "nigeria", name: "Nigeria", flag: "🇳🇬" },
  { code: "canada",  name: "Canada",  flag: "🇨🇦" },
];

const Navbar = () => {
  const [isScrolled,             setIsScrolled]             = useState(false);
  const [isMobileMenuOpen,       setIsMobileMenuOpen]       = useState(false);
  const [isCountryDropdownOpen,  setIsCountryDropdownOpen]  = useState(false);
  const [isAccountDropdownOpen,  setIsAccountDropdownOpen]  = useState(false);
  const [isCartOpen,             setIsCartOpen]             = useState(false); // ← NEW

  const { selectedCountry, setSelectedCountry } = useCountry();
  const { theme, toggleTheme }                  = useTheme();
  const { cart }                                = useCart();
  const { user, profile, logout }               = useAuth();
  const location  = useLocation();
  const navigate  = useNavigate();

  const accountRef = useRef<HTMLDivElement>(null);

  const navLinks = [
    { label: "Home",     href: `/${selectedCountry}`          },
    { label: "Services", href: `/${selectedCountry}/services` },
    { label: "Shop",     href: `/${selectedCountry}/shop`     },
    { label: "About",    href: `/${selectedCountry}/about`    },
    { label: "Projects", href: `/${selectedCountry}/projects` },
    { label: "Contact",  href: `/${selectedCountry}/contact`  },
  ];

  const cartCount = cart?.reduce((sum, item) => sum + item.quantity, 0) ?? 0;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsAccountDropdownOpen(false);
    setIsCountryDropdownOpen(false);
    setIsCartOpen(false);
  }, [location]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) {
        setIsAccountDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentCountry = countries.find(c => c.code === selectedCountry);
  const currentLogo    = theme === "dark" ? logoWhite : logoBlack;

  const isActivePage = (href: string) => {
    if (href === "/") return location.pathname === "/";
    return location.pathname.startsWith(href);
  };

  const handleLogout = async () => {
    setIsAccountDropdownOpen(false);
    await logout();
    navigate("/");
  };

  return (
    <>
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
              <img src={currentLogo} alt="Xpola" className="h-8 md:h-10 transition-opacity duration-300" />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link, i) => (
                <Link
                  key={i}
                  to={link.href}
                  className={`font-poppins text-sm transition-colors duration-200 hover:text-primary ${
                    isActivePage(link.href) ? "text-primary font-semibold" : "text-muted-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Right Side Controls */}
            <div className="flex items-center gap-3">

              {/* Country Selector */}
              <div className="relative">
                <button
                  onClick={() => { setIsCountryDropdownOpen(!isCountryDropdownOpen); setIsAccountDropdownOpen(false); }}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-background-secondary border border-border hover:border-primary transition-all duration-200"
                >
                  <span className="text-xl">{currentCountry?.flag}</span>
                  <span className="hidden sm:inline font-poppins text-sm text-foreground">{currentCountry?.name}</span>
                  <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${isCountryDropdownOpen ? "rotate-180" : ""}`} />
                </button>

                {isCountryDropdownOpen && (
                  <div className="absolute top-full right-0 mt-2 w-48 bg-background border border-border rounded-lg shadow-xl overflow-hidden z-50">
                    {countries.map(country => (
                      <button
                        key={country.code}
                        onClick={() => { setSelectedCountry(country.code); setIsCountryDropdownOpen(false); }}
                        className={`w-full flex items-center gap-3 px-4 py-3 font-poppins text-sm transition-colors ${
                          selectedCountry === country.code
                            ? "bg-primary/10 text-primary"
                            : "text-foreground hover:bg-background-secondary"
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
                {theme === "dark"
                  ? <Sun  className="w-5 h-5 text-foreground" />
                  : <Moon className="w-5 h-5 text-foreground" />
                }
              </button>

              {/* ← CHANGED: was <Link to={checkoutPath}>, now opens CartDrawer */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 rounded-lg bg-background-secondary border border-border hover:border-primary transition-all duration-200"
                aria-label="Open cart"
              >
                <ShoppingCart className="w-5 h-5 text-foreground" />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-primary text-white text-[10px] font-montserrat font-bold rounded-full flex items-center justify-center">
                    {cartCount > 9 ? "9+" : cartCount}
                  </span>
                )}
              </button>

              {/* Account — logged in */}
              {user ? (
                <div className="relative" ref={accountRef}>
                  <button
                    onClick={() => { setIsAccountDropdownOpen(!isAccountDropdownOpen); setIsCountryDropdownOpen(false); }}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-background-secondary border border-border hover:border-primary transition-all duration-200"
                  >
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-[10px] font-montserrat font-bold">
                        {profile?.firstName?.[0]?.toUpperCase() ?? user.email?.[0]?.toUpperCase() ?? "U"}
                      </span>
                    </div>
                    <span className="hidden sm:inline font-poppins text-sm text-foreground max-w-[80px] truncate">
                      {profile?.firstName ?? "Account"}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${isAccountDropdownOpen ? "rotate-180" : ""}`} />
                  </button>

                  {isAccountDropdownOpen && (
                    <div className="absolute top-full right-0 mt-2 w-52 bg-background border border-border rounded-lg shadow-xl overflow-hidden z-50">
                      <div className="px-4 py-3 border-b border-border bg-background-secondary">
                        <p className="font-poppins font-semibold text-sm text-foreground truncate">
                          {profile?.firstName} {profile?.lastName}
                        </p>
                        <p className="font-poppins text-xs text-muted-foreground truncate mt-0.5">
                          {user.email}
                        </p>
                      </div>
                      <Link to="/account"
                        className="flex items-center gap-3 px-4 py-3 font-poppins text-sm text-foreground hover:bg-background-secondary hover:text-primary transition-colors">
                        <User className="w-4 h-4" />
                        My Account
                      </Link>
                      <Link to="/account" state={{ tab: "orders" }}
                        className="flex items-center gap-3 px-4 py-3 font-poppins text-sm text-foreground hover:bg-background-secondary hover:text-primary transition-colors">
                        <Package className="w-4 h-4" />
                        My Orders
                      </Link>
                      <div className="border-t border-border">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-3 font-poppins text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg bg-background-secondary border border-border hover:border-primary transition-all duration-200"
                >
                  <User className="w-5 h-5 text-foreground" />
                  <span className="font-poppins text-sm text-foreground">Sign In</span>
                </Link>
              )}

              {/* CTA Button */}
              <div className="hidden md:block">
                <Link
                  to="/contact"
                  className="font-poppins font-semibold text-sm text-white bg-primary hover:bg-primary/90 px-6 py-2.5 rounded-lg transition-all duration-300 hover:scale-105"
                >
                  Get Started
                </Link>
              </div>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden w-10 h-10 flex items-center justify-center text-foreground"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-background/98 backdrop-blur-md border-t border-border">
            <div className="container mx-auto px-4 py-6 space-y-1">
              {navLinks.map((link, i) => (
                <Link
                  key={i}
                  to={link.href}
                  className={`block font-poppins text-base transition-colors duration-200 hover:text-primary py-2.5 border-b border-border/40 ${
                    isActivePage(link.href) ? "text-primary font-semibold" : "text-muted-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              <div className="pt-4 space-y-2">
                {/* ← Mobile: cart button opens drawer too */}
                <button
                  onClick={() => { setIsCartOpen(true); setIsMobileMenuOpen(false); }}
                  className="w-full flex items-center gap-3 font-poppins text-sm text-foreground hover:text-primary py-2.5 transition-colors border-b border-border/40"
                >
                  <ShoppingCart className="w-4 h-4" />
                  Cart
                  {cartCount > 0 && (
                    <span className="ml-auto bg-primary text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                      {cartCount > 9 ? "9+" : cartCount}
                    </span>
                  )}
                </button>

                {user ? (
                  <>
                    <div className="flex items-center gap-3 py-2 px-3 bg-background-secondary rounded-lg">
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-xs font-montserrat font-bold">
                          {profile?.firstName?.[0]?.toUpperCase() ?? "U"}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p className="font-poppins font-semibold text-sm text-foreground truncate">
                          {profile?.firstName} {profile?.lastName}
                        </p>
                        <p className="font-poppins text-xs text-muted-foreground truncate">{user.email}</p>
                      </div>
                    </div>
                    <Link to="/account"
                      className="flex items-center gap-3 font-poppins text-sm text-foreground hover:text-primary py-2.5 transition-colors">
                      <User className="w-4 h-4" /> My Account
                    </Link>
                    <Link to="/account" state={{ tab: "orders" }}
                      className="flex items-center gap-3 font-poppins text-sm text-foreground hover:text-primary py-2.5 transition-colors">
                      <Package className="w-4 h-4" /> My Orders
                    </Link>
                    <button onClick={handleLogout}
                      className="flex items-center gap-3 font-poppins text-sm text-red-500 py-2.5 w-full transition-colors">
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </>
                ) : (
                  <Link to="/login"
                    className="flex items-center justify-center gap-2 font-poppins font-semibold text-sm text-foreground border border-border hover:border-primary px-6 py-3 rounded-lg transition-all duration-200">
                    <User className="w-4 h-4" /> Sign In / Register
                  </Link>
                )}

                <Link
                  to="/contact"
                  className="block font-poppins font-semibold text-center text-white bg-primary hover:bg-primary/90 px-6 py-3 rounded-lg transition-all duration-300 mt-2"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* CartDrawer — outside <nav> so it renders above everything */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};

export default Navbar;
