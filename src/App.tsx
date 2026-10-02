/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  INITIAL_MENU_ITEMS,
  INITIAL_BUSINESS_INFO,
  MenuItem,
  BusinessDetails,
} from './data/cafeData';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { AboutSection } from './components/AboutSection';
import { WhyVisitUs } from './components/WhyVisitUs';
import { MenuSection } from './components/MenuSection';
import { GallerySection } from './components/GallerySection';
import { VisitUsSection } from './components/VisitUsSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';

const MENU_STORAGE_KEY = 'cheri_cafe_menu_v2';
const BUSINESS_STORAGE_KEY = 'cheri_cafe_business_v2';

export default function App() {
  const [activeSection, setActiveSection] = useState<string>('home');

  // Complete 180-item online-listed Menu State (persisted in localStorage for easy editing)
  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => {
    try {
      const saved = localStorage.getItem(MENU_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // Fallback to initial menu items
    }
    return INITIAL_MENU_ITEMS;
  });

  // Business Details State (persisted in localStorage)
  const [businessInfo, setBusinessInfo] = useState<BusinessDetails>(() => {
    try {
      const saved = localStorage.getItem(BUSINESS_STORAGE_KEY);
      if (saved) {
        return { ...INITIAL_BUSINESS_INFO, ...JSON.parse(saved) };
      }
    } catch {
      // Fallback to initial business details
    }
    return INITIAL_BUSINESS_INFO;
  });

  // Guest's bookmarked menu items for enquiry
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);

  useEffect(() => {
    try {
      localStorage.setItem(MENU_STORAGE_KEY, JSON.stringify(menuItems));
    } catch {
      // Ignore storage errors
    }
  }, [menuItems]);

  useEffect(() => {
    try {
      localStorage.setItem(BUSINESS_STORAGE_KEY, JSON.stringify(businessInfo));
    } catch {
      // Ignore storage errors
    }
  }, [businessInfo]);

  // Scroll Spy for Active Section Highlighting in Sticky Navbar
  useEffect(() => {
    const sectionIds = ['home', 'story', 'menu', 'gallery', 'visit', 'contact'];
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 160;
      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const el = document.getElementById(sectionIds[i]);
        if (el && el.offsetTop <= scrollPosition) {
          setActiveSection(sectionIds[i]);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleToggleSelectItem = (id: string) => {
    setSelectedItemIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const selectedMenuItems = menuItems.filter((item) =>
    selectedItemIds.includes(item.id)
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#231815] selection:bg-[#6E2632] selection:text-[#FAF7F2]">
      {/* Sticky Navigation Bar */}
      <Navbar
        activeSection={activeSection}
        onNavigate={handleNavigate}
        selectedItemsCount={selectedItemIds.length}
      />

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <Hero onNavigate={handleNavigate} />

        {/* About / Our Story Section */}
        <AboutSection onNavigate={handleNavigate} />

        {/* Why Visit Us Section */}
        <WhyVisitUs />

        {/* Complete 33-Category Interactive & Editable Menu Section */}
        <MenuSection
          items={menuItems}
          onUpdateItems={setMenuItems}
          onResetItems={() => {
            setMenuItems(INITIAL_MENU_ITEMS);
            setSelectedItemIds([]);
          }}
          selectedItemIds={selectedItemIds}
          onToggleSelectItem={handleToggleSelectItem}
          onNavigateToContact={() => handleNavigate('contact')}
        />

        {/* Food & Drinks Gallery with Lightbox */}
        <GallerySection />

        {/* Visit Us Section (CK Tower, Dashmesh Nagar, New Usmanpura) */}
        <VisitUsSection
          businessInfo={businessInfo}
          onUpdateBusinessInfo={setBusinessInfo}
          onResetBusinessInfo={() => setBusinessInfo(INITIAL_BUSINESS_INFO)}
        />

        {/* Contact & Validated Enquiry Section */}
        <ContactSection
          businessInfo={businessInfo}
          selectedMenuItems={selectedMenuItems}
          onClearSelectedItems={() => setSelectedItemIds([])}
        />
      </main>

      {/* Minimalist Editorial Footer */}
      <Footer businessInfo={businessInfo} onNavigate={handleNavigate} />
    </div>
  );
}
