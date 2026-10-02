import React from 'react';
import { motion } from 'motion/react';
import { CAFE_IMAGES } from '../data/cafeData';
import { SmartImage } from './SmartImage';

interface AboutSectionProps {
  onNavigate: (sectionId: string) => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ onNavigate }) => {
  return (
    <section
      id="story"
      className="py-20 sm:py-28 bg-[#FAF7F2] border-b border-[#E5DEC9]/70"
    >
      <div className="max-w-[1200px] mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Editorial Photography Composition */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 relative"
          >
            <div className="relative rounded-2xl overflow-hidden border border-[#E2D9C5] bg-[#F3EDE3] shadow-[0_12px_36px_rgba(35,24,21,0.06)]">
              <div className="aspect-[4/3] w-full overflow-hidden">
                <SmartImage
                  src={CAFE_IMAGES.interior}
                  alt="Warm European-inspired interior of Chéri Café with travertine tables and soft lighting"
                  fallbackLabel="Chéri Café Interior"
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-[1.02]"
                />
              </div>
              <div className="px-5 py-3.5 bg-[#F3EDE3] border-t border-[#E5DEC9] flex items-center justify-between text-xs text-[#6B564E]">
                <span>Warm Interiors · Thoughtful Seating</span>
                <span>Osmanpura</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Editorial Narrative */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.55, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6"
          >
            <div className="flex items-center gap-2 text-xs tracking-[0.14em] uppercase text-[#6E2632] font-medium mb-4">
              <span>Our Story</span>
              <span aria-hidden="true">·</span>
              <span>The Chéri Experience</span>
            </div>

            <h2 className="font-serif-display text-3xl sm:text-5xl text-[#231815] font-normal leading-[1.12] text-balance mb-6">
              More Than Just a Café.
            </h2>

            <div className="space-y-5 text-[15px] sm:text-base text-[#5A463F] leading-[1.7] max-w-[62ch]">
              <p>
                Nestled in the heart of Osmanpura, Chhatrapati Sambhajinagar,
                Chéri Café was envisioned as a welcoming retreat from the rush
                of everyday life—a space where the simple pleasure of a well-made
                cup of coffee meets warm, unhurried hospitality.
              </p>

              <p>
                Inspired by the timeless charm of contemporary European cafés
                and shaped for local gatherings, our focus is straightforward:
                comforting food, expressive beverages, and an atmosphere that
                invites you to linger a little longer.
              </p>

              <p>
                Whether you are beginning your morning over a quiet espresso,
                meeting friends for an afternoon bite, or sharing dessert as
                evening settles in, every detail at Chéri Café is arranged to
                make your time at the table feel special.
              </p>
            </div>

            {/* Quiet Editorial Highlights (Unboxed Typography with Hairline Rule) */}
            <div className="mt-9 pt-7 border-t border-[#E5DEC9] grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div>
                <p className="font-serif-display text-xl text-[#231815] font-medium">
                  Crafted Coffee
                </p>
                <p className="text-xs text-[#846F67] mt-1 leading-relaxed">
                  Hot & cold beverages prepared with care.
                </p>
              </div>
              <div>
                <p className="font-serif-display text-xl text-[#231815] font-medium">
                  Savoury & Sweet
                </p>
                <p className="text-xs text-[#846F67] mt-1 leading-relaxed">
                  Starters, mains, and indulgent desserts.
                </p>
              </div>
              <div>
                <p className="font-serif-display text-xl text-[#231815] font-medium">
                  Unhurried Space
                </p>
                <p className="text-xs text-[#846F67] mt-1 leading-relaxed">
                  Designed for conversation & calm moments.
                </p>
              </div>
            </div>

            <div className="mt-8">
              <button
                type="button"
                onClick={() => onNavigate('visit')}
                className="inline-flex items-center gap-2 text-sm font-medium text-[#6E2632] hover:text-[#4D1720] underline underline-offset-8 decoration-[#6E2632]/40 hover:decoration-[#6E2632] transition-colors cursor-pointer"
              >
                Plan Your Visit to Osmanpura
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
