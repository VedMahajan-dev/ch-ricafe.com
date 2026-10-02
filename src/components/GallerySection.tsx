import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { GALLERY_ITEMS, GalleryItem } from '../data/cafeData';
import { SmartImage } from './SmartImage';

const GALLERY_FILTERS: Array<{
  id: 'All' | GalleryItem['category'];
  label: string;
}> = [
  { id: 'All', label: 'All Moments' },
  { id: 'Coffee', label: 'Coffee Photography' },
  { id: 'Food', label: 'Food Photography' },
  { id: 'Desserts', label: 'Desserts' },
  { id: 'Interiors', label: 'Café Interiors' },
  { id: 'Atmosphere', label: 'Customer Experience' },
];

export const GallerySection: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<
    'All' | GalleryItem['category']
  >('All');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const visibleItems =
    activeFilter === 'All'
      ? GALLERY_ITEMS
      : GALLERY_ITEMS.filter((item) => item.category === activeFilter);

  useEffect(() => {
    if (lightboxIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setLightboxIndex(null);
      } else if (e.key === 'ArrowRight') {
        setLightboxIndex((prev) =>
          prev === null ? null : (prev + 1) % visibleItems.length
        );
      } else if (e.key === 'ArrowLeft') {
        setLightboxIndex((prev) =>
          prev === null
            ? null
            : (prev - 1 + visibleItems.length) % visibleItems.length
        );
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, visibleItems.length]);

  const currentLightboxItem =
    lightboxIndex !== null && visibleItems[lightboxIndex]
      ? visibleItems[lightboxIndex]
      : null;

  return (
    <section
      id="gallery"
      className="py-20 sm:py-28 bg-[#FAF7F2] border-b border-[#E5DEC9]"
    >
      <div className="max-w-[1200px] mx-auto px-5 sm:px-8">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div className="max-w-xl">
            <div className="flex items-center gap-2 text-xs tracking-[0.14em] uppercase text-[#6E2632] font-medium mb-3">
              <span>Visual Journal</span>
              <span aria-hidden="true">·</span>
              <span>Food, Drinks & Space</span>
            </div>
            <h2 className="font-serif-display text-3xl sm:text-5xl text-[#231815] font-normal leading-[1.12] text-balance">
              Inside Chéri Café.
            </h2>
          </div>

          {/* Interactive Gallery Category Filter Buttons */}
          <div
            role="tablist"
            aria-label="Gallery Categories"
            className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0"
          >
            {GALLERY_FILTERS.map((filter) => {
              const isSelected = activeFilter === filter.id;
              return (
                <button
                  key={filter.id}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => {
                    setActiveFilter(filter.id);
                    setLightboxIndex(null);
                  }}
                  className={`px-3.5 py-2 text-xs font-medium rounded-lg transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer ${
                    isSelected
                      ? 'bg-[#6E2632] text-[#FAF7F2]'
                      : 'bg-[#F3EDE3] text-[#5A463F] hover:text-[#231815] hover:bg-[#EAE1D3]'
                  }`}
                >
                  {filter.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Asymmetric Editorial Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {visibleItems.map((item, idx) => {
            const spanClass =
              activeFilter === 'All' ? item.aspectClass : 'md:col-span-6';
            const heightClass =
              activeFilter === 'All' && item.id === 'gal-morning'
                ? 'aspect-[16/9] sm:aspect-[21/9]'
                : 'aspect-[4/3]';

            return (
              <figure
                key={item.id}
                onClick={() => setLightboxIndex(idx)}
                className={`${spanClass} group relative rounded-2xl overflow-hidden bg-[#F3EDE3] border border-[#E5DEC9] cursor-pointer`}
              >
                <div className={`${heightClass} w-full overflow-hidden`}>
                  <SmartImage
                    src={item.imageUrl}
                    alt={`${item.title} — ${item.categoryLabel} at Chéri Café`}
                    fallbackLabel={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                  />
                </div>

                {/* Measured Scrim Overlay */}
                <div
                  className="absolute inset-0 bg-gradient-to-t from-[#18100D]/80 via-[#18100D]/20 to-transparent opacity-85 group-hover:opacity-95 transition-opacity duration-200"
                  aria-hidden="true"
                />

                {/* Top-Right Expand Affordance Icon */}
                <button
                  type="button"
                  aria-label={`View ${item.title} in full screen lightbox`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setLightboxIndex(idx);
                  }}
                  className="absolute top-4 right-4 w-9 h-9 rounded-lg bg-[#18100D]/55 text-[#FAF7F2] backdrop-blur-xs flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity duration-150 cursor-pointer"
                >
                  <Maximize2 className="w-4 h-4 stroke-[1.75]" />
                </button>

                {/* Caption Overlay */}
                <figcaption className="absolute bottom-0 inset-x-0 p-5 sm:p-6 text-[#FAF7F2]">
                  <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.12em] text-[#E6DEC8]/90 mb-1">
                    <span>{item.categoryLabel}</span>
                    <span aria-hidden="true">·</span>
                    <span>Chéri Café</span>
                  </div>
                  <h3 className="font-serif-display text-2xl sm:text-[26px] font-normal text-[#FAF7F2] leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#E8DFD3]/90 mt-1 max-w-xl">
                    {item.caption}
                  </p>
                </figcaption>
              </figure>
            );
          })}
        </div>
      </div>

      {/* Lightbox Modal */}
      {currentLightboxItem && lightboxIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={currentLightboxItem.title}
          className="fixed inset-0 z-50 bg-[#140D0A]/95 backdrop-blur-md flex flex-col justify-between p-4 sm:p-8"
          onClick={() => setLightboxIndex(null)}
        >
          {/* Lightbox Top Bar */}
          <div
            className="max-w-[1200px] w-full mx-auto flex items-center justify-between text-[#FAF7F2]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 text-xs text-[#D6C9B8]">
              <span className="font-mono-tabular">
                {String(lightboxIndex + 1).padStart(2, '0')} /{' '}
                {String(visibleItems.length).padStart(2, '0')}
              </span>
              <span aria-hidden="true">·</span>
              <span>{currentLightboxItem.categoryLabel}</span>
            </div>

            <button
              type="button"
              onClick={() => setLightboxIndex(null)}
              aria-label="Close lightbox"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#FAF7F2]/10 hover:bg-[#FAF7F2]/20 text-xs font-medium text-[#FAF7F2] transition-colors cursor-pointer"
            >
              <span>Close</span>
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Center Image & Navigation Controls */}
          <div
            className="relative max-w-5xl w-full mx-auto my-auto flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {visibleItems.length > 1 && (
              <button
                type="button"
                aria-label="Previous photograph"
                onClick={() =>
                  setLightboxIndex(
                    (lightboxIndex - 1 + visibleItems.length) %
                      visibleItems.length
                  )
                }
                className="absolute left-2 sm:-left-14 z-10 w-11 h-11 rounded-full bg-[#FAF7F2]/12 hover:bg-[#FAF7F2]/25 text-[#FAF7F2] flex items-center justify-center transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}

            <div className="rounded-xl overflow-hidden border border-[#FAF7F2]/15 bg-[#1D1411] max-h-[72vh] flex items-center justify-center">
              <SmartImage
                src={currentLightboxItem.imageUrl}
                alt={currentLightboxItem.title}
                className="max-h-[72vh] w-auto object-contain"
              />
            </div>

            {visibleItems.length > 1 && (
              <button
                type="button"
                aria-label="Next photograph"
                onClick={() =>
                  setLightboxIndex((lightboxIndex + 1) % visibleItems.length)
                }
                className="absolute right-2 sm:-right-14 z-10 w-11 h-11 rounded-full bg-[#FAF7F2]/12 hover:bg-[#FAF7F2]/25 text-[#FAF7F2] flex items-center justify-center transition-colors cursor-pointer"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Lightbox Caption Footer */}
          <div
            className="max-w-3xl w-full mx-auto text-center text-[#FAF7F2]"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-serif-display text-2xl sm:text-3xl font-normal">
              {currentLightboxItem.title}
            </h3>
            <p className="text-xs sm:text-sm text-[#D6C9B8] mt-1">
              {currentLightboxItem.caption}
            </p>
          </div>
        </div>
      )}
    </section>
  );
};
