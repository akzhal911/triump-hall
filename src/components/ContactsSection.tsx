import React from 'react';
import { Phone, MapPin, Clock, MessageCircle, Instagram, Sparkles, Navigation, Calendar } from 'lucide-react';
import { CONTACT_INFO } from '../data/triumphData';

interface ContactsSectionProps {
  onOpenBooking: () => void;
}

export const ContactsSection: React.FC<ContactsSectionProps> = ({ onOpenBooking }) => {
  return (
    <section id="contacts" className="py-20 lg:py-28 bg-[#0B0A09] text-[#F7F1E3] relative overflow-hidden border-t border-[#C9A227]/25">
      {/* Background radial gold glow */}
      <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#C9A227]/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full border border-[#C9A227]/40 bg-[#171513] mb-4">
            <MapPin className="w-3.5 h-3.5 text-[#C9A227]" />
            <span className="text-xs uppercase tracking-widest text-[#D8C08A] font-semibold">
              Связь и локация
            </span>
            <MapPin className="w-3.5 h-3.5 text-[#C9A227]" />
          </div>
          <h2 className="font-cinzel text-3xl sm:text-4xl lg:text-5xl font-bold tracking-wide text-[#F7F1E3] mb-3">
            КОНТАКТЫ И <span className="text-gradient-gold">ЛОКАЦИЯ</span>
          </h2>
          <p className="text-base sm:text-lg text-[#D8C08A] font-cormorant italic">
            «Мы ждем вас в TRIUMPH HALL — организуем ваше торжество на высшем уровне»
          </p>
          <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-[#C9A227] to-transparent mx-auto mt-4" />
        </div>

        {/* 2-Column Contact Info & Map Card Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          {/* Left Column: Direct Info (6 Cols) */}
          <div className="lg:col-span-6 space-y-6 flex flex-col justify-between">
            {/* Contact Details Card */}
            <div className="p-8 rounded-sm bg-[#171513] border border-[#C9A227]/40 shadow-xl space-y-6">
              {/* Phones Block */}
              <div>
                <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#D8C08A] font-bold mb-3">
                  <Phone className="w-4 h-4 text-[#C9A227]" />
                  <span>ТЕЛЕФОНЫ АДМИНИСТРАЦИИ</span>
                </div>
                <div className="space-y-2">
                  {CONTACT_INFO.phones.map((phone, idx) => (
                    <a
                      key={idx}
                      href={`tel:${phone.raw}`}
                      className="flex items-center justify-between p-3 rounded bg-[#0B0A09]/70 border border-[#C9A227]/20 hover:border-[#C9A227] text-sm sm:text-base font-semibold text-[#F7F1E3] hover:text-[#C9A227] transition-all group"
                    >
                      <span>{phone.display}</span>
                      <span className="text-xs uppercase tracking-wider text-[#D8C08A]/60 group-hover:text-[#C9A227]">
                        Позвонить →
                      </span>
                    </a>
                  ))}
                </div>
              </div>

              {/* Address Block */}
              <div>
                <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#D8C08A] font-bold mb-2">
                  <MapPin className="w-4 h-4 text-[#C9A227]" />
                  <span>АДРЕС В АТЫРАУ</span>
                </div>
                <div className="p-3.5 rounded bg-[#0B0A09]/70 border border-[#C9A227]/20">
                  <p className="text-sm font-semibold text-[#F7F1E3]">
                    г. Атырау, проспект Султан Бейбарыс, 526
                  </p>
                  <p className="text-xs text-[#D8C08A]/70 mt-1">
                    (в материалах также указано: район/улица Дангылы, 526)
                  </p>
                </div>
              </div>

              {/* Working Hours Block (Exact times from prompt!) */}
              <div>
                <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#D8C08A] font-bold mb-2">
                  <Clock className="w-4 h-4 text-[#C9A227]" />
                  <span>РЕЖИМ РАБОТЫ</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded bg-[#0B0A09]/70 border border-[#C9A227]/20">
                    <span className="font-semibold text-[#D8C08A] block">Будние дни:</span>
                    <span className="text-sm font-bold text-[#F7F1E3] mt-0.5 block">10:00 – 24:00</span>
                  </div>
                  <div className="p-3 rounded bg-[#0B0A09]/70 border border-[#C9A227]/20">
                    <span className="font-semibold text-[#D8C08A] block">Пятница, сб, вс:</span>
                    <span className="text-sm font-bold text-[#F7F1E3] mt-0.5 block">09:00 – 03:00</span>
                  </div>
                </div>
              </div>

              {/* Fast Action Buttons */}
              <div className="grid grid-cols-3 gap-3 pt-2">
                <a
                  href="tel:+77755309505"
                  className="py-3 px-2 rounded-sm bg-[#0B0A09] border border-[#C9A227]/50 hover:border-[#C9A227] text-[#D8C08A] hover:text-[#FFFFFF] text-xs font-bold uppercase tracking-wider flex flex-col items-center justify-center gap-1 transition-all"
                >
                  <Phone className="w-4 h-4 text-[#C9A227]" />
                  <span>ПОЗВОНИТЬ</span>
                </a>

                <a
                  href={CONTACT_INFO.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-2 rounded-sm bg-[#25D366]/20 border border-[#25D366]/40 hover:bg-[#25D366]/30 text-[#25D366] text-xs font-bold uppercase tracking-wider flex flex-col items-center justify-center gap-1 transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WHATSAPP</span>
                </a>

                <a
                  href={CONTACT_INFO.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-2 rounded-sm bg-[#E1306C]/20 border border-[#E1306C]/40 hover:bg-[#E1306C]/30 text-[#E1306C] text-xs font-bold uppercase tracking-wider flex flex-col items-center justify-center gap-1 transition-all"
                >
                  <Instagram className="w-4 h-4" />
                  <span>INSTAGRAM</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Exterior Card & Location Preview (6 Cols) */}
          <div className="lg:col-span-6 flex flex-col justify-between">
            <div className="p-8 rounded-sm bg-[#171513] border border-[#C9A227]/40 shadow-xl flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-cinzel text-xl font-bold text-[#F7F1E3] mb-2">
                  ПАРАДНЫЙ ВХОД И ПАРКИНГ
                </h3>
                <p className="text-xs text-[#D8C08A]/80 mb-4">
                  Охраняемая благоустроенная территория, удобный подъезд для свадебных кортежей и просторная парковка для гостей.
                </p>

                {/* Building exterior photo */}
                <div className="rounded-sm overflow-hidden border border-[#C9A227]/30 mb-6 relative group">
                  <img
                    src="/src/assets/images/triumph_hall_exterior_1790604391558.jpg"
                    alt="Вечерний фасад банкетного зала Triumph Hall в Атырау"
                    className="w-full h-56 sm:h-64 object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B0A09]/80 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 text-xs text-[#D8C08A] font-semibold flex items-center gap-1.5">
                    <Navigation className="w-3.5 h-3.5 text-[#C9A227]" />
                    <span>пр. Султан Бейбарыс, 526, Атырау</span>
                  </div>
                </div>
              </div>

              {/* Map Routing CTA */}
              <div className="p-4 rounded bg-[#0B0A09]/90 border border-[#C9A227]/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <span className="font-cinzel text-sm font-bold text-[#F7F1E3] block">
                    Построить маршрут
                  </span>
                  <span className="text-[11px] text-[#D8C08A]/75">
                    Откройте локацию в любимом навигаторе
                  </span>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <a
                    href="https://2gis.kz/atyrau"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-sm bg-[#0B0A09] border border-[#C9A227]/50 hover:border-[#C9A227] text-xs font-semibold text-[#D8C08A] hover:text-white transition-all text-center flex-1 sm:flex-initial"
                  >
                    2GIS
                  </a>
                  <a
                    href="https://yandex.kz/maps"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-sm bg-[#0B0A09] border border-[#C9A227]/50 hover:border-[#C9A227] text-xs font-semibold text-[#D8C08A] hover:text-white transition-all text-center flex-1 sm:flex-initial"
                  >
                    Яндекс.Карты
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
