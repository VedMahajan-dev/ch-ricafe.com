import React from 'react';
import { motion } from 'motion/react';
import { Coffee, Sparkles, Users } from 'lucide-react';
import { WHY_VISIT_FEATURES } from '../data/cafeData';

export const WhyVisitUs: React.FC = () => {
  const icons = [
    <Coffee key="coffee" className="w-5 h-5 text-[#6E2632] stroke-[1.5]" />,
    <Sparkles key="atmosphere" className="w-5 h-5 text-[#6E2632] stroke-[1.5]" />,
    <Users key="moments" className="w-5 h-5 text-[#6E2632] stroke-[1.5]" />,
  ];

  return (
    <section className="py-20 sm:py-24 bg-[#F3EDE3] border-b border-[#E5DEC9]">
      <div className="max-w-[1200px] mx-auto px-5 sm:px-8">
        {/* Section Header */}
        <div className="max-w-2xl mb-12 sm:mb-16">
          <div className="flex items-center gap-2 text-xs tracking-[0.14em] uppercase text-[#6E2632] font-medium mb-3">
            <span>Why Visit Us</span>
            <span aria-hidden="true">·</span>
            <span>Hospitality First</span>
          </div>
          <h2 className="font-serif-display text-3xl sm:text-5xl text-[#231815] font-normal leading-[1.12] text-balance">
            Thoughtfully Designed Around Your Time at the Table.
          </h2>
        </div>

        {/* Three Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {WHY_VISIT_FEATURES.map((feature, idx) => (
            <motion.article
              key={feature.index}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{
                duration: 0.5,
                delay: idx * 0.08,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="bg-[#FAF7F2] rounded-2xl p-7 sm:p-8 border border-[#E5DEC9] flex flex-col justify-between transition-transform duration-200 hover:-translate-y-0.5"
            >
              <div>
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#EFE8DC]">
                  <span className="font-serif-display text-lg italic text-[#846F67]">
                    {feature.index}.
                  </span>
                  <div
                    className="w-10 h-10 rounded-xl bg-[#F3EDE3] flex items-center justify-center"
                    aria-hidden="true"
                  >
                    {icons[idx]}
                  </div>
                </div>

                <h3 className="font-serif-display text-2xl sm:text-[26px] text-[#231815] font-medium mb-3 leading-snug">
                  {feature.title}
                </h3>

                <p className="text-[15px] text-[#5A463F] leading-[1.65]">
                  {feature.description}
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-[#EFE8DC]/80 text-xs text-[#846F67]">
                {feature.detail}
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};
