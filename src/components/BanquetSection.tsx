import React from 'react';
import { Sparkles, Users, Check, ArrowRight, Heart, Crown, Briefcase, Gift, GraduationCap, PartyPopper } from 'lucide-react';
import { EVENTS_DATA, BanquetEventType } from '../data/triumphData';

interface BanquetSectionProps {
  onSelectEventType: (eventName: string) => void;
}

export const BanquetSection: React.FC<BanquetSectionProps> = ({ onSelectEventType }) => {
  const getIcon = (name: string) => {
    switch (name) {
      case 'Heart': return <Heart className="w-5 h-5" />;
      case 'Crown': return <Crown className="w-5 h-5" />;
      case 'Briefcase': return <Briefcase className="w-5 h-5" />;
      case 'Gift': return <Gift className="w-5 h-5" />;
      case 'GraduationCap': return <GraduationCap className="w-5 h-5" />;
      case 'Users': return <Users className="w-5 h-5" />;
      case 'Sparkles': return <Sparkles className="w-5 h-5" />;
      default: return <PartyPopper className="w-5 h-5" />;
    }
  };

  return (
    <section id="banquets" className="py-20 lg:py-28 bg-[#F7F1E3] text-[#171513] relative overflow-hidden">
      {/* Decorative filigree accents */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-[#D8C08A]/25 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-[#C9A227]/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full border border-[#C9A227] bg-[#EFE3CC] mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#9A7617]" />
            <span className="text-xs uppercase tracking-widest text-[#9A7617] font-semibold">
              Форматы торжеств
            </span>
            <Sparkles className="w-3.5 h-3.5 text-[#9A7617]" />
          </div>
          <h2 className="font-cinzel text-3xl sm:text-4xl lg:text-5xl font-bold tracking-wide text-[#0B0A09] mb-3">
            БАНКЕТЫ И <span className="text-[#9A7617]">МЕРОПРИЯТИЯ</span>
          </h2>
          <p className="text-base sm:text-lg text-[#171513]/80 font-cormorant italic">
            «Каждому событию — персональное внимание, премиальный сервис и безупречный триумф»
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-[#C9A227] to-transparent mx-auto mt-4" />
        </div>

        {/* 8 Event Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {EVENTS_DATA.map((event) => (
            <div
              key={event.id}
              className="group flex flex-col rounded-sm bg-[#FFFFFF] border border-[#EFE3CC] hover:border-[#C9A227] shadow-sm hover:shadow-2xl transition-all duration-300 overflow-hidden"
            >
              {/* Event Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0A09]/75 via-transparent to-transparent" />
                
                {/* Event Category Icon */}
                <div className="absolute top-3 left-3 w-9 h-9 rounded-sm bg-[#0B0A09]/85 text-[#D8C08A] border border-[#C9A227]/40 flex items-center justify-center backdrop-blur-md">
                  {getIcon(event.iconName)}
                </div>

                <div className="absolute bottom-2.5 left-3 right-3 text-xs text-[#F7F1E3] font-medium flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-[#C9A227]" />
                  <span>{event.capacity}</span>
                </div>
              </div>

              {/* Event Body */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-cinzel text-lg font-bold text-[#0B0A09] group-hover:text-[#9A7617] transition-colors mb-1">
                    {event.title}
                  </h3>
                  <p className="text-xs text-[#9A7617] font-semibold mb-3">
                    {event.subtitle}
                  </p>
                  <p className="text-xs text-[#171513]/75 leading-relaxed mb-4">
                    {event.description}
                  </p>

                  {/* Features list */}
                  <div className="space-y-1.5 pt-2 border-t border-[#EFE3CC] mb-5">
                    {event.features.map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-[11px] text-[#171513]">
                        <Check className="w-3.5 h-3.5 text-[#9A7617] flex-shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Event CTA */}
                <button
                  onClick={() => onSelectEventType(event.title)}
                  className="w-full py-2.5 px-3 rounded-sm border border-[#9A7617] text-[#9A7617] group-hover:bg-[#9A7617] group-hover:text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Забронировать</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
