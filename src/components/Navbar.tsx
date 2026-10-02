import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

interface NavbarProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  selectedItemsCount: number;
}

const NAV_LINKS = [
  { id: 'home', label: 'Home' },
  { id: 'story', label: 'Our Story' },
  { id: 'menu', label: 'Menu' },
  { id: 'gallery', label: 'Gallery' },
  { id: 'visit', label: 'Visit Us' },
] as const;

export const Navbar: React.FC<NavbarProps> = ({
  activeSection,
  onNavigate,
  selectedItemsCount,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 16);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    onNavigate(id);
  };

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-colors duration-200 ${
        scrolled
          ? 'bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#E5DEC9] shadow-[0_2px_20px_rgba(35,24,21,0.04)]'
          : 'bg-[#FAF7F2]/90 backdrop-blur-sm border-b border-[#E5DEC9]/60'
      }`}
    >
      <div className="max-w-[1200px] mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#home"
          onClick={(e) => handleLinkClick(e, 'home')}
          className="font-serif-display text-2xl sm:text-[26px] font-semibold tracking-[0.14em] text-[#231815] whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#6E2632]"
        >
          CHÉRI CAFÉ
        </a>

        {/* Zone 2: 5 clean text navigation links */}
        <nav
          aria-label="Primary Navigation"
          className="hidden md:flex items-center gap-7 lg:gap-9"
        >
          {NAV_LINKS.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={(e) => handleLinkClick(e, link.id)}
                className={`relative py-1 text-sm font-medium whitespace-nowrap transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#6E2632] ${
                  isActive
                    ? 'text-[#6E2632]'
                    : 'text-[#5A463F] hover:text-[#231815]'
                } after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1.5px] after:bg-[#6E2632] after:transition-transform after:duration-200 after:origin-left ${
                  isActive
                    ? 'after:scale-x-100'
                    : 'after:scale-x-0 hover:after:scale-x-100'
                }`}
              >
                {link.label}
              </a>
            );
          })}
        </nav>

        {/* Zone 3: Primary action & Mobile Menu Trigger */}
        <div className="flex items-center gap-3">
          <a
            href="#contact"
            onClick={(e) => handleLinkClick(e, 'contact')}
            className="hidden md:inline-flex items-center justify-center px-5 py-2.5 text-xs font-medium tracking-wider uppercase text-[#FAF7F2] bg-[#6E2632] hover:bg-[#561C26] rounded-lg transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6E2632]"
          >
            {selectedItemsCount > 0
              ? `Contact Us (${selectedItemsCount})`
              : 'Contact Us'}
          </a>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className="md:hidden inline-flex items-center justify-center w-11 h-11 rounded-lg text-[#231815] hover:bg-[#F3EDE3] transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-[#6E2632]"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5 stroke-[1.75]" />
            ) : (
              <Menu className="w-5 h-5 stroke-[1.75]" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Animated Navigation Drawer */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-200 ease-out bg-[#FAF7F2] border-b border-[#E5DEC9] ${
          mobileMenuOpen
            ? 'max-h-[400px] opacity-100 py-5 px-6 shadow-lg'
            : 'max-h-0 opacity-0 py-0 px-6 border-b-0 pointer-events-none'
        }`}
      >
        <nav aria-label="Mobile Navigation" className="flex flex-col space-y-3">
          {NAV_LINKS.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={(e) => handleLinkClick(e, link.id)}
                className={`py-2.5 text-base font-medium border-b border-[#EFE8DC] transition-colors duration-150 ${
                  isActive ? 'text-[#6E2632] font-semibold' : 'text-[#231815]'
                }`}
              >
                {link.label}
              </a>
            );
          })}
          <div className="pt-2">
            <a
              href="#contact"
              onClick={(e) => handleLinkClick(e, 'contact')}
              className="w-full inline-flex items-center justify-center px-5 py-3 text-xs font-medium tracking-wider uppercase text-[#FAF7F2] bg-[#6E2632] hover:bg-[#561C26] rounded-lg transition-colors duration-150 whitespace-nowrap"
            >
              {selectedItemsCount > 0
                ? `Contact Us · ${selectedItemsCount} Saved`
                : 'Contact Us'}
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
};
