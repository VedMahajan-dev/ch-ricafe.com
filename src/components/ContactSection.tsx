import React, { useState, useEffect } from 'react';
import {
  Phone,
  Instagram,
  MessageCircle,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Sparkles,
  MapPin,
} from 'lucide-react';
import { BusinessDetails, MenuItem } from '../data/cafeData';

interface ContactSectionProps {
  businessInfo: BusinessDetails;
  selectedMenuItems: MenuItem[];
  onClearSelectedItems: () => void;
}

interface FormErrors {
  name?: string;
  phone?: string;
  message?: string;
}

interface SavedEnquiry {
  id: string;
  name: string;
  phone: string;
  message: string;
  timestamp: string;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  businessInfo,
  selectedMenuItems,
  onClearSelectedItems,
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [submittedEnquiry, setSubmittedEnquiry] = useState<SavedEnquiry | null>(
    null
  );
  const [copiedEnquiry, setCopiedEnquiry] = useState(false);
  const [instagramNotice, setInstagramNotice] = useState(false);

  // Allow one-click insertion of selected menu items into the message
  const handleAppendSelectedItems = () => {
    if (selectedMenuItems.length === 0) return;
    const itemLines = selectedMenuItems
      .map((item) => `• ${item.name} (₹${item.priceInr})`)
      .join('\n');
    const addition = `Hello Chéri Café,\nI would like to enquire about visiting and the following menu items:\n${itemLines}\n\n`;
    setMessage((prev) => (prev.trim() ? `${prev}\n\n${addition}` : addition));
  };

  useEffect(() => {
    if (selectedMenuItems.length > 0 && !message.trim() && !submittedEnquiry) {
      const names = selectedMenuItems.map((i) => i.name).join(', ');
      setMessage(
        `Hello Chéri Café, I would like to enquire about visiting your café in New Usmanpura and learning more about: ${names}.`
      );
    }
  }, [selectedMenuItems]);

  const validateForm = (): boolean => {
    const nextErrors: FormErrors = {};
    const trimmedName = name.trim();
    const trimmedPhone = phone.trim();
    const trimmedMessage = message.trim();

    if (!trimmedName || trimmedName.length < 2) {
      nextErrors.name = 'Please enter your full name (at least 2 characters).';
    }

    const digitsOnly = trimmedPhone.replace(/\D/g, '');
    if (
      !trimmedPhone ||
      digitsOnly.length < 10 ||
      digitsOnly.length > 15 ||
      !/^[+\d\s\-()]+$/.test(trimmedPhone)
    ) {
      nextErrors.phone =
        'Please enter a valid 10-digit Indian mobile number or phone number.';
    }

    if (!trimmedMessage || trimmedMessage.length < 8) {
      nextErrors.message =
        'Please enter a short message or enquiry (at least 8 characters).';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const record: SavedEnquiry = {
      id: `ENQ-${Date.now().toString().slice(-5)}`,
      name: name.trim(),
      phone: phone.trim(),
      message: message.trim(),
      timestamp: new Date().toLocaleString('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }),
    };

    setSubmittedEnquiry(record);
    setErrors({});
  };

  const handleCopyFormattedEnquiry = async () => {
    if (!submittedEnquiry) return;
    const formatted = `Chéri Café Enquiry (${submittedEnquiry.id})\nName: ${submittedEnquiry.name}\nPhone: ${submittedEnquiry.phone}\nMessage: ${submittedEnquiry.message}`;
    try {
      await navigator.clipboard.writeText(formatted);
      setCopiedEnquiry(true);
      setTimeout(() => setCopiedEnquiry(false), 2500);
    } catch {
      setCopiedEnquiry(true);
      setTimeout(() => setCopiedEnquiry(false), 2500);
    }
  };

  const whatsappText =
    message.trim() ||
    'Hello Chéri Cafe & Eatery (New Usmanpura, Chhatrapati Sambhajinagar), I would like to enquire about visiting.';

  const whatsappUrl = `https://wa.me/${
    businessInfo.whatsappNumber || '917588672309'
  }?text=${encodeURIComponent(whatsappText)}`;

  return (
    <section
      id="contact"
      className="py-20 sm:py-28 bg-[#FAF7F2] border-b border-[#E5DEC9]"
    >
      <div className="max-w-[1200px] mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Direct Contact Channels */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <div className="flex items-center gap-2 text-xs tracking-[0.14em] uppercase text-[#6E2632] font-medium mb-3">
                <span>Get in Touch</span>
                <span aria-hidden="true">·</span>
                <span>Enquiries & Table Notes</span>
              </div>
              <h2 className="font-serif-display text-3xl sm:text-5xl text-[#231815] font-normal leading-[1.12] text-balance mb-4">
                We Would Love to Hear From You.
              </h2>
              <p className="text-[15px] text-[#5A463F] leading-[1.65]">
                Have a question about our menu prices, planning a gathering in
                New Usmanpura, or looking to connect with Chéri Cafe & Eatery?
                Reach out directly below.
              </p>
            </div>

            {/* Contact Channel Cards */}
            <div className="space-y-4">
              {/* Phone Number Card */}
              <div className="p-5 rounded-2xl bg-[#F3EDE3] border border-[#E5DEC9] flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] border border-[#E5DEC9] flex items-center justify-center shrink-0 text-[#6E2632]">
                  <Phone className="w-4 h-4 stroke-[1.75]" />
                </div>
                <div>
                  <div className="flex items-center gap-2 text-xs text-[#846F67]">
                    <span className="font-semibold uppercase tracking-wider text-[#231815]">
                      Phone
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>Chéri Cafe & Eatery</span>
                  </div>
                  <a
                    href={`tel:${businessInfo.phone.replace(/\s+/g, '')}`}
                    className="inline-block text-base font-medium text-[#231815] hover:text-[#6E2632] font-mono-tabular mt-1 transition-colors"
                  >
                    {businessInfo.phone}
                  </a>
                </div>
              </div>

              {/* Address Summary Card */}
              <div className="p-5 rounded-2xl bg-[#F3EDE3] border border-[#E5DEC9] flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] border border-[#E5DEC9] flex items-center justify-center shrink-0 text-[#6E2632]">
                  <MapPin className="w-4 h-4 stroke-[1.75]" />
                </div>
                <div>
                  <div className="flex items-center gap-2 text-xs text-[#846F67]">
                    <span className="font-semibold uppercase tracking-wider text-[#231815]">
                      Location
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>New Usmanpura, 431001</span>
                  </div>
                  <p className="text-xs sm:text-sm text-[#5A463F] mt-1 leading-relaxed">
                    1st Floor, CK Tower, Dashmesh Nagar Road, near Tapadiya
                    Innovations School, Dashmesh Nagar, New Usmanpura,
                    Chhatrapati Sambhajinagar.
                  </p>
                </div>
              </div>

              {/* Instagram Link Placeholder */}
              <div className="p-5 rounded-2xl bg-[#F3EDE3] border border-[#E5DEC9] flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] border border-[#E5DEC9] flex items-center justify-center shrink-0 text-[#6E2632]">
                    <Instagram className="w-4 h-4 stroke-[1.75]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-xs text-[#846F67]">
                      <span className="font-semibold uppercase tracking-wider text-[#231815]">
                        Instagram
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>Link Placeholder</span>
                    </div>
                    <p className="text-sm text-[#231815] mt-1">
                      {businessInfo.instagramHandlePlaceholder}
                    </p>
                    {instagramNotice && (
                      <p className="text-xs text-[#6E2632] mt-2 leading-relaxed">
                        Official Instagram profile URL placeholder — update with
                        the verified @chericafe link in the Visit Us section.
                      </p>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setInstagramNotice((prev) => !prev)}
                  className="px-3 py-1.5 text-xs font-medium text-[#6E2632] bg-[#FAF7F2] border border-[#DFD5C3] rounded-lg hover:bg-[#EAE1D3] transition-colors shrink-0 cursor-pointer"
                >
                  {instagramNotice ? 'Hide Note' : 'View Note'}
                </button>
              </div>

              {/* WhatsApp Contact Button */}
              <div className="pt-2">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-4 text-xs sm:text-sm font-medium tracking-wider uppercase bg-[#231815] text-[#FAF7F2] hover:bg-[#382722] rounded-xl transition-colors"
                >
                  <MessageCircle className="w-4 h-4 stroke-[1.75] text-[#E6DEC8]" />
                  <span>Chat on WhatsApp ({businessInfo.phone})</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Validated Enquiry Form */}
          <div className="lg:col-span-7 bg-[#F3EDE3] rounded-2xl p-7 sm:p-10 border border-[#E5DEC9]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-6 mb-6 border-b border-[#E2D8C5]">
              <div>
                <h3 className="font-serif-display text-2xl sm:text-3xl text-[#231815] font-normal">
                  Send an Enquiry
                </h3>
                <p className="text-xs text-[#6B564E] mt-1">
                  Complete your details below. All fields are validated before
                  preparing your message.
                </p>
              </div>
              <span className="text-xs text-[#846F67]">
                New Usmanpura · Chhatrapati Sambhajinagar
              </span>
            </div>

            {/* Selected Menu Items Pill-Free Summary Bar */}
            {selectedMenuItems.length > 0 && (
              <div className="mb-6 p-4 rounded-xl bg-[#FAF7F2] border border-[#DFD5C3] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="text-xs text-[#5A463F]">
                  <span className="font-semibold text-[#231815]">
                    Saved Menu Items ({selectedMenuItems.length}):
                  </span>{' '}
                  {selectedMenuItems.map((i) => i.name).join(' · ')}
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <button
                    type="button"
                    onClick={handleAppendSelectedItems}
                    className="inline-flex items-center gap-1 text-xs font-medium text-[#6E2632] hover:underline cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Insert in Message</span>
                  </button>
                  <button
                    type="button"
                    onClick={onClearSelectedItems}
                    className="text-xs text-[#846F67] hover:text-[#231815] cursor-pointer"
                  >
                    Clear
                  </button>
                </div>
              </div>
            )}

            {submittedEnquiry ? (
              <div
                role="status"
                aria-live="polite"
                className="bg-[#FAF7F2] rounded-2xl p-6 sm:p-8 border border-[#D4C7B4] space-y-5"
              >
                <div className="flex items-start gap-3.5">
                  <CheckCircle2 className="w-6 h-6 text-[#1E6F3D] shrink-0 mt-0.5" />
                  <div>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-[#6B564E] mb-1">
                      <span className="font-mono-tabular font-medium text-[#231815]">
                        Reference {submittedEnquiry.id}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{submittedEnquiry.timestamp}</span>
                    </div>
                    <h4 className="font-serif-display text-2xl text-[#231815]">
                      Enquiry Validated & Ready
                    </h4>
                    <p className="text-xs sm:text-sm text-[#5A463F] mt-2 leading-relaxed">
                      Your form details have been validated and saved locally in
                      this browser session. Since no backend email server is
                      connected, your message has{' '}
                      <strong className="font-semibold text-[#231815]">
                        not
                      </strong>{' '}
                      been automatically sent. You can copy your formatted
                      enquiry below or send it directly via WhatsApp to{' '}
                      <span className="font-mono-tabular font-medium text-[#231815]">
                        {businessInfo.phone}
                      </span>
                      .
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#F3EDE3] border border-[#E5DEC9] text-xs text-[#231815] space-y-1.5 font-sans-body">
                  <div>
                    <span className="text-[#846F67]">Name:</span>{' '}
                    <span className="font-medium">{submittedEnquiry.name}</span>
                  </div>
                  <div>
                    <span className="text-[#846F67]">Phone:</span>{' '}
                    <span className="font-mono-tabular font-medium">
                      {submittedEnquiry.phone}
                    </span>
                  </div>
                  <div className="pt-1">
                    <span className="text-[#846F67] block mb-1">Message:</span>
                    <p className="text-[#5A463F] whitespace-pre-line leading-relaxed">
                      {submittedEnquiry.message}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <button
                      type="button"
                      onClick={handleCopyFormattedEnquiry}
                      className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-medium bg-[#6E2632] text-[#FAF7F2] rounded-lg hover:bg-[#561C26] transition-colors cursor-pointer"
                    >
                      {copiedEnquiry ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Copied to Clipboard</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Formatted Enquiry</span>
                        </>
                      )}
                    </button>

                    <a
                      href={`https://wa.me/${
                        businessInfo.whatsappNumber || '917588672309'
                      }?text=${encodeURIComponent(
                        `Hello Chéri Café,\nName: ${submittedEnquiry.name}\nPhone: ${submittedEnquiry.phone}\nEnquiry: ${submittedEnquiry.message}`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-medium bg-[#231815] text-[#FAF7F2] rounded-lg hover:bg-[#382722] transition-colors"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>Send via WhatsApp</span>
                    </a>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setSubmittedEnquiry(null);
                      setName('');
                      setPhone('');
                      setMessage('');
                    }}
                    className="px-3 py-2 text-xs font-medium text-[#5A463F] hover:text-[#231815] underline underline-offset-4 cursor-pointer"
                  >
                    Write Another Enquiry
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Name Field */}
                  <div>
                    <label
                      htmlFor="enquiry-name"
                      className="block text-xs font-medium text-[#231815] mb-2"
                    >
                      Your Name <span className="text-[#6E2632]">*</span>
                    </label>
                    <input
                      id="enquiry-name"
                      type="text"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        if (errors.name)
                          setErrors({ ...errors, name: undefined });
                      }}
                      placeholder="e.g. Aarav Deshmukh"
                      aria-invalid={Boolean(errors.name)}
                      className={`w-full px-4 py-3 text-sm bg-[#FAF7F2] border rounded-xl text-[#231815] placeholder:text-[#9E8B82] focus:outline-none transition-colors ${
                        errors.name
                          ? 'border-[#9E2A2B] focus:border-[#9E2A2B]'
                          : 'border-[#DED4C1] focus:border-[#6E2632]'
                      }`}
                    />
                    {errors.name && (
                      <p className="mt-1.5 text-xs text-[#9E2A2B] flex items-center gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{errors.name}</span>
                      </p>
                    )}
                  </div>

                  {/* Phone Number Field */}
                  <div>
                    <label
                      htmlFor="enquiry-phone"
                      className="block text-xs font-medium text-[#231815] mb-2"
                    >
                      Phone Number <span className="text-[#6E2632]">*</span>
                    </label>
                    <input
                      id="enquiry-phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value);
                        if (errors.phone)
                          setErrors({ ...errors, phone: undefined });
                      }}
                      placeholder="e.g. +91 98765 43210"
                      aria-invalid={Boolean(errors.phone)}
                      className={`w-full px-4 py-3 text-sm bg-[#FAF7F2] border rounded-xl text-[#231815] font-mono-tabular placeholder:font-sans-body placeholder:text-[#9E8B82] focus:outline-none transition-colors ${
                        errors.phone
                          ? 'border-[#9E2A2B] focus:border-[#9E2A2B]'
                          : 'border-[#DED4C1] focus:border-[#6E2632]'
                      }`}
                    />
                    {errors.phone && (
                      <p className="mt-1.5 text-xs text-[#9E2A2B] flex items-center gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{errors.phone}</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Message Field */}
                <div>
                  <label
                    htmlFor="enquiry-message"
                    className="block text-xs font-medium text-[#231815] mb-2"
                  >
                    Your Message or Enquiry{' '}
                    <span className="text-[#6E2632]">*</span>
                  </label>
                  <textarea
                    id="enquiry-message"
                    rows={4}
                    value={message}
                    onChange={(e) => {
                      setMessage(e.target.value);
                      if (errors.message)
                        setErrors({ ...errors, message: undefined });
                    }}
                    placeholder="Tell us how we can help—table enquiries, menu questions, or feedback..."
                    aria-invalid={Boolean(errors.message)}
                    className={`w-full px-4 py-3 text-sm bg-[#FAF7F2] border rounded-xl text-[#231815] placeholder:text-[#9E8B82] focus:outline-none transition-colors ${
                      errors.message
                        ? 'border-[#9E2A2B] focus:border-[#9E2A2B]'
                        : 'border-[#DED4C1] focus:border-[#6E2632]'
                    }`}
                  />
                  {errors.message && (
                    <p className="mt-1.5 text-xs text-[#9E2A2B] flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{errors.message}</span>
                    </p>
                  )}
                </div>

                <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <p className="text-xs text-[#6B564E]">
                    Local validation active · No unverified background send.
                  </p>
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center px-7 py-3.5 text-xs font-medium tracking-wider uppercase bg-[#6E2632] text-[#FAF7F2] hover:bg-[#561C26] rounded-xl transition-colors whitespace-nowrap cursor-pointer"
                  >
                    Validate & Prepare Enquiry
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
