import React, { useState } from 'react';
import {
  MapPin,
  Clock,
  Phone,
  Navigation,
  Edit3,
  Check,
  Copy,
  Map,
} from 'lucide-react';
import { BusinessDetails } from '../data/cafeData';

interface VisitUsSectionProps {
  businessInfo: BusinessDetails;
  onUpdateBusinessInfo: (updated: BusinessDetails) => void;
  onResetBusinessInfo: () => void;
}

export const VisitUsSection: React.FC<VisitUsSectionProps> = ({
  businessInfo,
  onUpdateBusinessInfo,
  onResetBusinessInfo,
}) => {
  const [isEditingDetails, setIsEditingDetails] = useState(false);
  const [draft, setDraft] = useState<BusinessDetails>(businessInfo);
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [showInteractiveMap, setShowInteractiveMap] = useState(true);

  const openEditor = () => {
    setDraft({ ...businessInfo });
    setIsEditingDetails(true);
  };

  const handleSaveDetails = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateBusinessInfo(draft);
    setIsEditingDetails(false);
  };

  const handleCopyAddress = async () => {
    const textToCopy = `${businessInfo.legalOrListingName}, ${businessInfo.fullAddress} | Phone: ${businessInfo.phone}`;
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopiedAddress(true);
      setTimeout(() => setCopiedAddress(false), 2500);
    } catch {
      setCopiedAddress(true);
      setTimeout(() => setCopiedAddress(false), 2500);
    }
  };

  const googleMapsDirectionsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    businessInfo.googleMapsQuery
  )}`;

  const googleMapsEmbedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(
    'CK Tower, Dashmesh Nagar Road, New Usmanpura, Chhatrapati Sambhajinagar, Maharashtra 431001'
  )}&t=&z=16&ie=UTF8&iwloc=&output=embed`;

  return (
    <section
      id="visit"
      className="py-20 sm:py-28 bg-[#F3EDE3] border-b border-[#E5DEC9]"
    >
      <div className="max-w-[1200px] mx-auto px-5 sm:px-8">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-xs tracking-[0.14em] uppercase text-[#6E2632] font-medium mb-3">
              <span>Visit Us</span>
              <span aria-hidden="true">·</span>
              <span>Dashmesh Nagar, New Usmanpura</span>
            </div>
            <h2 className="font-serif-display text-3xl sm:text-5xl text-[#231815] font-normal leading-[1.12] text-balance">
              Find Your Table at Chéri Café.
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() =>
                isEditingDetails ? setIsEditingDetails(false) : openEditor()
              }
              className={`inline-flex items-center gap-2 px-4 py-2.5 text-xs font-medium rounded-lg border transition-colors cursor-pointer whitespace-nowrap ${
                isEditingDetails
                  ? 'bg-[#231815] text-[#FAF7F2] border-[#231815]'
                  : 'bg-[#FAF7F2] text-[#231815] border-[#DED4C1] hover:bg-[#EAE1D3]'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>
                {isEditingDetails
                  ? 'Close Details Editor'
                  : 'Edit Hours & Business Details'}
              </span>
            </button>
          </div>
        </div>

        {/* Inline Editor for Opening Hours & Business Information */}
        {isEditingDetails && (
          <form
            onSubmit={handleSaveDetails}
            className="mb-12 p-6 sm:p-8 rounded-2xl bg-[#FAF7F2] border-2 border-[#6E2632] space-y-5"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#E5DEC9]">
              <div>
                <h3 className="font-serif-display text-2xl text-[#231815]">
                  Edit Café Location, Hours & Contact
                </h3>
                <p className="text-xs text-[#6B564E] mt-0.5">
                  Update operating hours, address, or contact details below.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  onResetBusinessInfo();
                  setIsEditingDetails(false);
                }}
                className="text-xs text-[#6E2632] underline hover:text-[#4D1720] self-start sm:self-auto cursor-pointer"
              >
                Reset to Default Listing
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-medium text-[#231815] mb-1.5">
                  Full Street Address
                </label>
                <input
                  type="text"
                  value={draft.fullAddress}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      fullAddress: e.target.value,
                    })
                  }
                  className="w-full px-3.5 py-2 text-sm bg-[#F3EDE3] border border-[#D8CBB5] rounded-lg text-[#231815] focus:outline-none focus:border-[#6E2632]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#231815] mb-1.5">
                  Opening Hours
                </label>
                <input
                  type="text"
                  value={draft.openingHours}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      openingHours: e.target.value,
                    })
                  }
                  className="w-full px-3.5 py-2 text-sm bg-[#F3EDE3] border border-[#D8CBB5] rounded-lg text-[#231815] focus:outline-none focus:border-[#6E2632]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#231815] mb-1.5">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={draft.phone}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      phone: e.target.value,
                      whatsappNumber: e.target.value.replace(/\D/g, ''),
                    })
                  }
                  className="w-full px-3.5 py-2 text-sm bg-[#F3EDE3] border border-[#D8CBB5] rounded-lg text-[#231815] focus:outline-none focus:border-[#6E2632]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#231815] mb-1.5">
                  Instagram Handle / URL
                </label>
                <input
                  type="text"
                  value={draft.instagramHandlePlaceholder}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      instagramHandlePlaceholder: e.target.value,
                    })
                  }
                  className="w-full px-3.5 py-2 text-sm bg-[#F3EDE3] border border-[#D8CBB5] rounded-lg text-[#231815] focus:outline-none focus:border-[#6E2632]"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-[#E5DEC9]">
              <label className="inline-flex items-center gap-2 text-xs text-[#231815] cursor-pointer">
                <input
                  type="checkbox"
                  checked={draft.isHoursConfirmed}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      isHoursConfirmed: e.target.checked,
                    })
                  }
                  className="accent-[#6E2632]"
                />
                <span>Mark opening hours as directly confirmed with café</span>
              </label>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditingDetails(false)}
                  className="px-4 py-2 text-xs text-[#5A463F] hover:text-[#231815] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-medium bg-[#6E2632] text-[#FAF7F2] rounded-lg hover:bg-[#561C26] cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Save Changes</span>
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Two-Column Layout: Details Left, Map Integration Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column: Verified Location, Opening Hours & Phone */}
          <div className="lg:col-span-5 bg-[#FAF7F2] rounded-2xl p-7 sm:p-9 border border-[#E5DEC9] flex flex-col justify-between">
            <div className="space-y-7">
              <div>
                <p className="text-xs uppercase tracking-[0.14em] text-[#846F67] mb-1">
                  Destination
                </p>
                <h3 className="font-serif-display text-3xl text-[#231815] font-medium">
                  {businessInfo.legalOrListingName}
                </h3>
                <p className="text-sm text-[#5A463F] mt-1">
                  {businessInfo.neighborhood}, {businessInfo.city}
                </p>
              </div>

              {/* Address Block */}
              <div className="pt-5 border-t border-[#EFE8DC] flex items-start gap-3.5">
                <MapPin className="w-5 h-5 text-[#6E2632] shrink-0 mt-0.5 stroke-[1.6]" />
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#231815]">
                    <span>Address</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-normal text-[#846F67] capitalize">
                      CK Tower, New Usmanpura
                    </span>
                  </div>
                  <p className="text-sm text-[#231815] mt-1.5 leading-relaxed">
                    1st Floor, CK Tower, Dashmesh Nagar Road,
                    <br />
                    near Tapadiya Innovations School,
                    <br />
                    Dashmesh Nagar, New Usmanpura,
                    <br />
                    Chhatrapati Sambhajinagar, Maharashtra 431001, India.
                  </p>
                </div>
              </div>

              {/* Opening Hours Block (Labeled "Please confirm") */}
              <div className="pt-5 border-t border-[#EFE8DC] flex items-start gap-3.5">
                <Clock className="w-5 h-5 text-[#6E2632] shrink-0 mt-0.5 stroke-[1.6]" />
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#231815]">
                    <span>Opening Hours</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-normal text-[#6E2632] capitalize">
                      {businessInfo.isHoursConfirmed
                        ? 'Confirmed'
                        : 'Please Confirm'}
                    </span>
                  </div>
                  <p className="text-sm text-[#231815] font-medium mt-1.5">
                    Approx. {businessInfo.openingHours}
                  </p>
                  {!businessInfo.isHoursConfirmed && (
                    <p className="text-xs text-[#846F67] mt-1 italic">
                      {businessInfo.openingHoursNote}
                    </p>
                  )}
                </div>
              </div>

              {/* Contact Number Block */}
              <div className="pt-5 border-t border-[#EFE8DC] flex items-start gap-3.5">
                <Phone className="w-5 h-5 text-[#6E2632] shrink-0 mt-0.5 stroke-[1.6]" />
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#231815]">
                    <span>Phone</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-normal text-[#846F67] capitalize">
                      Direct Line
                    </span>
                  </div>
                  <a
                    href={`tel:${businessInfo.phone.replace(/\s+/g, '')}`}
                    className="inline-block text-base text-[#231815] hover:text-[#6E2632] font-mono-tabular font-medium mt-1.5 transition-colors"
                  >
                    {businessInfo.phone}
                  </a>
                </div>
              </div>
            </div>

            {/* Directions & Copy Actions */}
            <div className="mt-9 pt-6 border-t border-[#EFE8DC] flex flex-wrap items-center gap-3">
              <a
                href={googleMapsDirectionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 text-xs font-medium tracking-wider uppercase bg-[#6E2632] text-[#FAF7F2] hover:bg-[#561C26] rounded-lg transition-colors whitespace-nowrap"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Get Directions</span>
              </a>

              <button
                type="button"
                onClick={handleCopyAddress}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-3 text-xs font-medium bg-[#F3EDE3] text-[#231815] hover:bg-[#E7DEC9] rounded-lg transition-colors whitespace-nowrap cursor-pointer"
              >
                {copiedAddress ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#1E6F3D]" />
                    <span>Address Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-[#6B564E]" />
                    <span>Copy Full Address</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Column: Google Maps View for CK Tower, Dashmesh Nagar Road, New Usmanpura */}
          <div className="lg:col-span-7 bg-[#FAF7F2] rounded-2xl border border-[#E5DEC9] overflow-hidden flex flex-col justify-between min-h-[440px]">
            <div className="px-6 py-4 bg-[#FAF7F2] border-b border-[#EFE8DC] flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs text-[#5A463F]">
                <Map className="w-4 h-4 text-[#6E2632]" />
                <span className="font-medium text-[#231815]">
                  CK Tower · Dashmesh Nagar Road, New Usmanpura
                </span>
              </div>

              <button
                type="button"
                onClick={() => setShowInteractiveMap((prev) => !prev)}
                className="text-xs font-medium text-[#6E2632] hover:text-[#4D1720] underline underline-offset-4 cursor-pointer"
              >
                {showInteractiveMap
                  ? 'Show Address Card View'
                  : 'Show Interactive Map'}
              </button>
            </div>

            {showInteractiveMap ? (
              <div className="relative flex-1 w-full min-h-[360px] bg-[#EAE1D3]">
                <iframe
                  title="Google Maps — Chéri Cafe & Eatery, CK Tower, New Usmanpura, Chhatrapati Sambhajinagar"
                  src={googleMapsEmbedUrl}
                  className="w-full h-full min-h-[360px] border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            ) : (
              <div className="relative flex-1 p-8 sm:p-10 bg-gradient-to-br from-[#F5EFE6] via-[#EDE4D5] to-[#E5D9C5] flex flex-col items-center justify-center text-center">
                <div
                  className="absolute inset-0 opacity-25 pointer-events-none"
                  style={{
                    backgroundImage:
                      'linear-gradient(to right, #C8B9A6 1px, transparent 1px), linear-gradient(to bottom, #C8B9A6 1px, transparent 1px)',
                    backgroundSize: '48px 48px',
                  }}
                  aria-hidden="true"
                />

                <div className="relative z-10 max-w-md bg-[#FAF7F2]/95 backdrop-blur-xs p-7 rounded-2xl border border-[#DFD5C3] shadow-sm">
                  <div className="w-11 h-11 rounded-full bg-[#6E2632]/10 text-[#6E2632] flex items-center justify-center mx-auto mb-4">
                    <MapPin className="w-5 h-5 stroke-[1.75]" />
                  </div>

                  <p className="text-[11px] uppercase tracking-[0.14em] text-[#6E2632] font-medium mb-1">
                    New Usmanpura · 431001
                  </p>
                  <h4 className="font-serif-display text-2xl text-[#231815] font-medium">
                    Chéri Cafe & Eatery
                  </h4>
                  <p className="text-xs text-[#5A463F] mt-2 leading-relaxed">
                    1st Floor, CK Tower, Dashmesh Nagar Road, near Tapadiya
                    Innovations School, Dashmesh Nagar, New Usmanpura,
                    Chhatrapati Sambhajinagar, Maharashtra 431001.
                  </p>

                  <div className="mt-5 pt-4 border-t border-[#EFE8DC] flex flex-wrap items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => setShowInteractiveMap(true)}
                      className="px-4 py-2 text-xs font-medium bg-[#231815] text-[#FAF7F2] rounded-lg hover:bg-[#3A2924] transition-colors cursor-pointer"
                    >
                      View Interactive Map
                    </button>
                    <a
                      href={googleMapsDirectionsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 text-xs font-medium bg-[#F3EDE3] text-[#231815] border border-[#D8CBB5] rounded-lg hover:bg-[#E7DEC9] transition-colors"
                    >
                      Open in Google Maps
                    </a>
                  </div>
                </div>
              </div>
            )}

            <div className="px-6 py-3.5 bg-[#FAF7F2] border-t border-[#EFE8DC] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-[#846F67]">
              <span>
                Near Tapadiya Innovations School · Dashmesh Nagar, New Usmanpura
              </span>
              <span className="font-mono-tabular">PIN 431001</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
