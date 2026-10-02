import React, { useState } from 'react';
import { Instagram, ArrowUp, Phone } from 'lucide-react';
import { BusinessDetails } from '../data/cafeData';

interface FooterProps {
  businessInfo: BusinessDetails;
  onNavigate: (sectionId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ businessInfo, onNavigate }) => {
  const [showIgPlaceholderNote, setShowIgPlaceholderNote] = useState(false);

  const handleLinkClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    sectionId: string
  ) => {
    e.preventDefault();
    onNavigate(sectionId);
  };

  return (
    <footer className="bg-[#1D1411] text-[#FAF7F2] pt-16 pb-12 border-t border-[#32241F]">
      <div className="max-w-[1200px] mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-[#32241F]">
          {/* Brand Column */}
          <div className="md:col-span-5 space-y-4">
            <a
              href="#home"
              onClick={(e) => handleLinkClick(e, 'home')}
              className="inline-block font-serif-display text-3xl font-normal tracking-[0.14em] text-[#FAF7F2]"
            >
              CHÉRI CAFÉ
            </a>
            <p className="text-sm text-[#C8B9A6] max-w-sm leading-relaxed">
              A Little Taste of Something Special. Good coffee, beautiful
              moments and unforgettable flavours at Chéri Cafe & Eatery in New
              Usmanpura.
            </p>
            <div className="text-xs text-[#9E8B82] pt-1">
              CK Tower · Dashmesh Nagar, New Usmanpura · Chhatrapati
              Sambhajinagar
            </div>
          </div>

          {/* Navigation Column */}
          <div className="md:col-span-3 space-y-3">
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-[#C8B9A6]">
              Navigation
            </p>
            <ul className="space-y-2.5 text-sm text-[#E5DEC9]/90">
              {[
                { id: 'home', label: 'Home' },
                { id: 'story', label: 'Our Story' },
                { id: 'menu', label: 'Menu' },
                { id: 'gallery', label: 'Gallery' },
                { id: 'visit', label: 'Visit Us' },
                { id: 'contact', label: 'Contact Us' },
              ].map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    onClick={(e) => handleLinkClick(e, item.id)}
                    className="hover:text-[#FAF7F2] underline-offset-4 hover:underline transition-colors"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Location, Phone & Social Placeholder Column */}
          <div className="md:col-span-4 space-y-4">
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-[#C8B9A6]">
              Location & Connect
            </p>
            <p className="text-xs sm:text-sm text-[#E5DEC9]/90 leading-relaxed">
              Chéri Cafe & Eatery
              <br />
              1st Floor, CK Tower, Dashmesh Nagar Road,
              <br />
              near Tapadiya Innovations School, Dashmesh Nagar,
              <br />
              New Usmanpura, Chhatrapati Sambhajinagar, Maharashtra 431001
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <a
                href={`tel:${businessInfo.phone.replace(/\s+/g, '')}`}
                className="inline-flex items-center gap-2 text-xs text-[#E5DEC9] hover:text-[#FAF7F2] py-1.5 px-3 rounded-lg bg-[#2A1D19] border border-[#3E2D27] font-mono-tabular transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-[#C8B9A6]" />
                <span>{businessInfo.phone}</span>
              </a>

              <button
                type="button"
                onClick={() => setShowIgPlaceholderNote((prev) => !prev)}
                className="inline-flex items-center gap-2 text-xs text-[#E5DEC9] hover:text-[#FAF7F2] py-1.5 px-3 rounded-lg bg-[#2A1D19] border border-[#3E2D27] transition-colors cursor-pointer"
              >
                <Instagram className="w-3.5 h-3.5 text-[#C8B9A6]" />
                <span>@chericafe</span>
              </button>
            </div>

            {showIgPlaceholderNote && (
              <p className="text-xs text-[#C8B9A6] mt-2 leading-relaxed">
                Instagram link placeholder — update with the verified profile
                URL in the Visit Us section above.
              </p>
            )}
          </div>
        </div>

        {/* Bottom Copyright & Back to Top */}
        <div className="pt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-[#9E8B82]">
          <div>
            © {new Date().getFullYear()} Chéri Cafe & Eatery, New Usmanpura,
            Chhatrapati Sambhajinagar. All rights reserved.
          </div>

          <button
            type="button"
            onClick={() => onNavigate('home')}
            className="inline-flex items-center gap-1.5 text-[#C8B9A6] hover:text-[#FAF7F2] transition-colors self-start sm:self-auto cursor-pointer"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};
