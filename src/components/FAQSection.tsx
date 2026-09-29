import React, { useState } from 'react';
import { Sparkles, ChevronDown, HelpCircle } from 'lucide-react';
import { FAQ_DATA, FAQItem } from '../data/triumphData';

export const FAQSection: React.FC = () => {
  const [openId, setOpenId] = useState<string | null>('faq-1');

  const toggleAccordion = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section id="faq" className="py-20 lg:py-28 bg-[#F7F1E3] text-[#171513] relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full border border-[#C9A227] bg-[#EFE3CC] mb-4">
            <HelpCircle className="w-3.5 h-3.5 text-[#9A7617]" />
            <span className="text-xs uppercase tracking-widest text-[#9A7617] font-semibold">
              Частые вопросы
            </span>
            <HelpCircle className="w-3.5 h-3.5 text-[#9A7617]" />
          </div>
          <h2 className="font-cinzel text-3xl sm:text-4xl lg:text-5xl font-bold tracking-wide text-[#0B0A09] mb-3">
            ВОПРОСЫ И <span className="text-[#9A7617]">ОТВЕТЫ</span>
          </h2>
          <p className="text-base sm:text-lg text-[#171513]/80 font-cormorant italic">
            «Всё, что вам нужно знать об организации банкета в TRIUMPH HALL в Атырау»
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-[#C9A227] to-transparent mx-auto mt-4" />
        </div>

        {/* 12 Accordion items */}
        <div className="space-y-3.5">
          {FAQ_DATA.map((item: FAQItem) => {
            const isOpen = openId === item.id;
            return (
              <div
                key={item.id}
                className="rounded-sm bg-[#FFFFFF] border border-[#EFE3CC] shadow-sm hover:border-[#C9A227] transition-all overflow-hidden"
              >
                <button
                  onClick={() => toggleAccordion(item.id)}
                  className="w-full py-4 px-5 text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <span className="font-cinzel text-base sm:text-lg font-bold text-[#0B0A09] hover:text-[#9A7617] transition-colors">
                    {item.question}
                  </span>
                  <div
                    className={`w-7 h-7 rounded-full bg-[#EFE3CC] flex items-center justify-center text-[#9A7617] transition-transform duration-300 flex-shrink-0 ${
                      isOpen ? 'rotate-180 bg-[#9A7617] text-white' : ''
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-[#171513]/85 leading-relaxed border-t border-[#EFE3CC]/60 bg-[#FAFAF8]">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
