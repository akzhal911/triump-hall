import React from 'react';
import { Sparkles, Users, Tv, Volume2, Mic, Maximize2, Lamp, Layers, ShieldCheck } from 'lucide-react';

interface HallSectionProps {
  onOpenBooking: () => void;
}

export const HallSection: React.FC<HallSectionProps> = ({ onOpenBooking }) => {
  return (
    <section id="hall" className="py-20 lg:py-28 bg-[#0B0A09] text-[#F7F1E3] relative overflow-hidden">
      {/* Golden accent lighting */}
      <div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-[#C9A227]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full border border-[#C9A227]/40 bg-[#171513] mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#C9A227]" />
            <span className="text-xs uppercase tracking-widest text-[#D8C08A] font-semibold">
              Архитектура и оснащение
            </span>
            <Sparkles className="w-3.5 h-3.5 text-[#C9A227]" />
          </div>
          <h2 className="font-cinzel text-3xl sm:text-4xl lg:text-5xl font-bold tracking-wide text-[#F7F1E3] mb-3">
            НАШ <span className="text-gradient-gold">ЗАЛ</span>
          </h2>
          <p className="text-base sm:text-lg text-[#D8C08A] font-cormorant italic">
            «Пространство непревзойденного величия, современных мультимедиа и абсолютного комфорта»
          </p>
          <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-[#C9A227] to-transparent mx-auto mt-4" />
        </div>

        {/* 2 Capacity Format Showcase Cards (Strict separation as required!) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* Card 1: Banquet Hall Seating */}
          <div className="p-8 rounded-sm bg-[#171513] border-2 border-[#C9A227] shadow-[0_0_35px_rgba(201,162,39,0.25)] relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4">
              <span className="px-3 py-1 text-xs uppercase tracking-wider font-bold rounded-sm bg-gradient-to-r from-[#9A7617] to-[#C9A227] text-[#0B0A09]">
                ОСНОВНОЙ ФОРМАТ
              </span>
            </div>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-sm bg-[#0B0A09] border border-[#C9A227] flex items-center justify-center text-[#C9A227]">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-cinzel text-2xl font-bold text-[#F7F1E3]">
                  Банкетный зал
                </h3>
                <span className="text-xs text-[#D8C08A]">Торжественная банкетная посадка</span>
              </div>
            </div>

            <div className="my-6 p-4 rounded bg-[#0B0A09]/70 border border-[#C9A227]/30">
              <div className="text-xs uppercase tracking-wider text-[#D8C08A]/75 mb-1">
                Вместимость зала:
              </div>
              <div className="font-cinzel text-3xl sm:text-4xl font-bold text-gradient-gold">
                256–450 человек
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[#F7F1E3]/85 leading-relaxed mb-6">
              Идеальная геометрия для свадебных тоев, юбилеев и гала-ужинов. Просторные круглые столы, позолоченные стулья Кьявари, свободный обзор сцены и большой паркетный танцпол.
            </p>

            <ul className="space-y-2 text-xs text-[#D8C08A]">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C9A227]" />
                <span>Круглые столы с авторским декором и канделябрами</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C9A227]" />
                <span>Президиум для почетных гостей и молодоженов</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C9A227]" />
                <span>Отдельная комната невесты и гримерные для артистов</span>
              </li>
            </ul>
          </div>

          {/* Card 2: Seminars & Events format */}
          <div className="p-8 rounded-sm bg-[#171513] border border-[#C9A227]/40 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4">
              <span className="px-3 py-1 text-xs uppercase tracking-wider font-bold rounded-sm bg-[#0B0A09] text-[#D8C08A] border border-[#C9A227]/40">
                ДЕЛОВОЙ & КОНЦЕРТНЫЙ ФОРМАТ
              </span>
            </div>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-sm bg-[#0B0A09] border border-[#C9A227]/50 flex items-center justify-center text-[#C9A227]">
                <Layers className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-cinzel text-2xl font-bold text-[#F7F1E3]">
                  Аренда для мероприятий
                </h3>
                <span className="text-xs text-[#D8C08A]">Семинары, форумы, конференции</span>
              </div>
            </div>

            <div className="my-6 p-4 rounded bg-[#0B0A09]/70 border border-[#C9A227]/30">
              <div className="text-xs uppercase tracking-wider text-[#D8C08A]/75 mb-1">
                Масштаб событий:
              </div>
              <div className="font-cinzel text-3xl sm:text-4xl font-bold text-gradient-gold">
                от 200 до 5 000 человек
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[#F7F1E3]/85 leading-relaxed mb-6">
              Многофункциональное пространство комплекса позволяет организовывать масштабные обучающие семинары, региональные форумы, отраслевые выставки и массовые съезды.
            </p>

            <ul className="space-y-2 text-xs text-[#D8C08A]">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C9A227]" />
                <span>Театральная, кластерная или выставочная расстановка</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C9A227]" />
                <span>Входная группа с зоной регистрации и гардеробом</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C9A227]" />
                <span>Высокоскоростной Wi-Fi и техническое сопровождение инженеров</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Technical Equipment Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-16">
          <div className="lg:col-span-6 rounded-sm overflow-hidden border border-[#C9A227]/50 shadow-2xl">
            <img
              src="/src/assets/images/interior_stage_led_1790604135251.jpg"
              alt="Сцена и LED-экран в банкетном зале Triumph Hall"
              className="w-full h-[380px] object-cover hover:scale-105 transition-transform duration-700"
            />
          </div>

          <div className="lg:col-span-6 space-y-6">
            <div>
              <h3 className="font-cinzel text-2xl sm:text-3xl font-bold text-[#F7F1E3] mb-3">
                ТЕХНИЧЕСКОЕ ОСНАЩЕНИЕ <span className="text-[#C9A227]">ПРЕМИУМ-УРОВНЯ</span>
              </h3>
              <p className="text-xs sm:text-sm text-[#F7F1E3]/80 leading-relaxed">
                TRIUMPH HALL изначально спроектирован с учетом требований райдеров профессиональных артистов и звезд эстрады. Вам не нужно заказывать стороннюю дорогостоящую технику.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded bg-[#171513] border border-[#C9A227]/30">
                <div className="flex items-center gap-2 text-[#C9A227] mb-1 font-semibold text-sm">
                  <Tv className="w-4 h-4" />
                  <span>Широкий LED-экран</span>
                </div>
                <p className="text-xs text-[#D8C08A]/75">
                  Высокая четкость 4K, реалистичная цветопередача и трансляция видеоконтента без бликов.
                </p>
              </div>

              <div className="p-4 rounded bg-[#171513] border border-[#C9A227]/30">
                <div className="flex items-center gap-2 text-[#C9A227] mb-1 font-semibold text-sm">
                  <Volume2 className="w-4 h-4" />
                  <span>Концертный звук</span>
                </div>
                <p className="text-xs text-[#D8C08A]/75">
                  Линейные массивы с кристально чистым звучанием речи и мощными басами для танцев.
                </p>
              </div>

              <div className="p-4 rounded bg-[#171513] border border-[#C9A227]/30">
                <div className="flex items-center gap-2 text-[#C9A227] mb-1 font-semibold text-sm">
                  <Lamp className="w-4 h-4" />
                  <span>Световые головы и спецэффекты</span>
                </div>
                <p className="text-xs text-[#D8C08A]/75">
                  Динамические световые приборы Beam/Spot, заливка зала и праздничные лучи.
                </p>
              </div>

              <div className="p-4 rounded bg-[#171513] border border-[#C9A227]/30">
                <div className="flex items-center gap-2 text-[#C9A227] mb-1 font-semibold text-sm">
                  <Mic className="w-4 h-4" />
                  <span>Радиомикрофоны</span>
                </div>
                <p className="text-xs text-[#D8C08A]/75">
                  Беспроводные микрофонные базы для ведущих, поздравлений и вокальных номеров.
                </p>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={onOpenBooking}
                className="px-8 py-3.5 rounded-sm bg-gradient-to-r from-[#9A7617] via-[#C9A227] to-[#D8C08A] text-[#0B0A09] font-bold text-xs uppercase tracking-widest shadow-lg hover:shadow-[0_0_30px_rgba(201,162,39,0.6)] transition-all cursor-pointer"
              >
                Забронировать зал для вашего события
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
