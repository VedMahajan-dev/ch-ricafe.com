import React from 'react';
import { motion } from 'motion/react';
import { ArrowDownRight, MapPin } from 'lucide-react';
import { CAFE_IMAGES } from '../data/cafeData';
import { SmartImage } from './SmartImage';

interface HeroProps {
  onNavigate: (sectionId: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ onNavigate }) => {
  return (
    <section
      id="home"
      className="relative w-full min-h-[86vh] lg:min-h-[88vh] flex items-end overflow-hidden bg-[#1D1411]"
    >
      {/* Background High-Resolution Photograph */}
      <div className="absolute inset-0 z-0">
        <SmartImage
          src={CAFE_IMAGES.hero}
          alt="Artisanal flat white coffee and golden croissant on a sunlit travertine table at Chéri Café"
          fallbackLabel="Chéri Café — Morning Espresso & Viennoiserie"
          className="w-full h-full object-cover object-center scale-[1.01] transition-transform duration-700"
        />
        {/* Measured Contrast Scrim for WCAG AA Legibility */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-[#160F0C]/90 via-[#160F0C]/55 to-[#160F0C]/30"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-[#160F0C]/75 via-[#160F0C]/30 to-transparent"
          aria-hidden="true"
        />
      </div>

      {/* Editorial Foreground Content */}
      <div className="relative z-10 w-full max-w-[1200px] mx-auto px-5 sm:px-8 pt-28 pb-16 sm:pb-20 lg:pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-2xl"
        >
          {/* Quiet Unboxed Editorial Kicker */}
          <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm tracking-[0.12em] uppercase text-[#E6DEC8]/90 mb-5 font-medium">
            <span>Chéri Café</span>
            <span aria-hidden="true">·</span>
            <span>Osmanpura, Chhatrapati Sambhajinagar</span>
          </div>

          {/* Main Heading */}
          <h1 className="font-serif-display text-4xl sm:text-6xl lg:text-[68px] font-normal text-[#FAF7F2] leading-[1.06] tracking-[-0.01em] text-balance mb-6">
            A Little Taste of{' '}
            <span className="italic font-normal text-[#F3E5D8]">
              Something Special.
            </span>
          </h1>

          {/* Supporting Text */}
          <p className="text-base sm:text-lg lg:text-[19px] text-[#E8DFD3]/95 leading-[1.65] max-w-[54ch] mb-9 font-normal tracking-[0.01em]">
            Good coffee, beautiful moments and unforgettable flavours. Welcome
            to Chéri Café.
          </p>

          {/* Primary & Secondary Action Buttons */}
          <div className="flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={() => onNavigate('menu')}
              className="inline-flex items-center gap-2.5 px-7 py-3.5 text-sm font-medium tracking-wide text-[#FAF7F2] bg-[#6E2632] hover:bg-[#581D27] rounded-lg transition-all duration-150 shadow-sm whitespace-nowrap cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FAF7F2]"
            >
              <span>Explore Our Menu</span>
              <ArrowDownRight className="w-4 h-4 stroke-[1.75]" />
            </button>

            <button
              type="button"
              onClick={() => onNavigate('visit')}
              className="inline-flex items-center gap-2 px-7 py-3.5 text-sm font-medium tracking-wide text-[#FAF7F2] bg-[#FAF7F2]/12 hover:bg-[#FAF7F2]/22 border border-[#FAF7F2]/35 rounded-lg backdrop-blur-xs transition-all duration-150 whitespace-nowrap cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FAF7F2]"
            >
              <MapPin className="w-4 h-4 stroke-[1.75] text-[#E6DEC8]" />
              <span>Find Us</span>
            </button>
          </div>
        </motion.div>

        {/* Quiet Editorial Footnote Strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="mt-14 pt-6 border-t border-[#FAF7F2]/15 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs text-[#D6C9B8]/85"
        >
          <div className="flex flex-wrap items-center gap-2">
            <span>Specialty Coffee</span>
            <span aria-hidden="true">·</span>
            <span>All-Day Café Plates</span>
            <span aria-hidden="true">·</span>
            <span>Desserts & Conversations</span>
          </div>
          <div className="text-[#D6C9B8]/80">
            Osmanpura · Chhatrapati Sambhajinagar, Maharashtra, India
          </div>
        </motion.div>
      </div>
    </section>
  );
};
