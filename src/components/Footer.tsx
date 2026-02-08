// FILE PATH: src/components/common/Footer.tsx
// Place this file at: src/components/common/Footer.tsx

import { useState } from "react";
import { Linkedin, Twitter, Facebook, Instagram } from "lucide-react";
import { useCountry } from "@/contexts/CountryContext";
import { useTheme } from "@/contexts/ThemeContext";
import logoWhite from "@/assets/logo-white.png";
import logoBlack from "@/assets/logo-black.png";

const quickLinks = [
  { label: "About Us", href: "#about" },
  { label: "Our Services", href: "#sectors" },
  { label: "Projects", href: "#projects" },
  { label: "Careers", href: "#careers" },
  { label: "Contact", href: "#contact" },
];

const socialLinks = [
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Instagram, href: "#", label: "Instagram" },
];

const legalLinks = [
  { label: "Privacy Policy", href: "#privacy" },
  { label: "Terms of Service", href: "#terms" },
  { label: "Cookie Policy", href: "#cookies" },
];

const Footer = () => {
  const { currentData, selectedCountry } = useCountry();
  const { theme } = useTheme();
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle subscription
    setEmail("");
  };

  // Generate service links from sectors
  const serviceLinks = currentData.sectors.map(sector => ({
    label: sector.title,
    href: sector.link,
  }));

  // Use white logo for dark theme, black logo for light theme
  const currentLogo = theme === 'dark' ? logoWhite : logoBlack;

  return (
    <footer className="bg-background pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-12">
          {/* Column 1: Company Info */}
          <div className="lg:col-span-1">
            <img 
              src={currentLogo} 
              alt="Xpola" 
              className="h-10 md:h-12 mb-5 transition-opacity duration-300" 
            />
            <p className="font-poppins text-sm text-muted-foreground mb-6 max-w-xs">
              {currentData.footer.tagline}
            </p>
            {/* Social Links */}
            <div className="flex gap-3">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 rounded-lg bg-background-secondary border border-border flex items-center justify-center transition-all duration-300 hover:border-primary hover:bg-primary/10"
                >
                  <social.icon className="w-[18px] h-[18px] text-muted-foreground transition-colors hover:text-primary" />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="font-montserrat font-bold text-base text-foreground mb-5">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="font-poppins text-sm text-muted-foreground transition-all duration-200 hover:text-primary hover:pl-1"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Services */}
          <div>
            <h4 className="font-montserrat font-bold text-base text-foreground mb-5">
              Our Services
            </h4>
            <ul className="space-y-3">
              {serviceLinks.slice(0, 7).map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="font-poppins text-sm text-muted-foreground transition-all duration-200 hover:text-primary hover:pl-1"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div>
            <h4 className="font-montserrat font-bold text-base text-foreground mb-5">
              Stay Updated
            </h4>
            <p className="font-poppins text-sm text-muted-foreground mb-4">
              Subscribe for industry insights and company updates
            </p>
            <form onSubmit={handleSubscribe} className="space-y-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                className="w-full h-11 px-4 bg-background-secondary border border-border rounded-lg font-poppins text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none transition-colors"
                required
              />
              <button
                type="submit"
                className="w-full h-11 bg-primary text-white hover:bg-primary/90 font-poppins font-semibold text-sm rounded-lg transition-all duration-300 hover:-translate-y-0.5"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-border pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Copyright */}
            <p className="font-poppins text-xs text-muted-foreground/60">
              © 2026 Xpola Services Limited ({currentData.name}). All Rights Reserved.
            </p>

            {/* Legal Links */}
            <div className="flex gap-6">
              {legalLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className="font-poppins text-xs text-muted-foreground transition-all duration-200 hover:text-primary hover:underline"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Compliance Note */}
          <p className="font-poppins text-[11px] text-muted-foreground/50 text-center mt-6">
            {currentData.footer.compliance}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
