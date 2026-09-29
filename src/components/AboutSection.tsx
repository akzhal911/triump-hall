import React from 'react';
import { Users, Utensils, Tv, Volume2, Building2, UserCheck, CheckCircle2, Sparkles } from 'lucide-react';

interface AboutSectionProps {
  onOpenBooking: () => void;
  onExploreHall: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ onOpenBooking, onExploreHall }) => {
  const advantages = [
    {
      icon: Users,
      title: '256–450 гостей',
      desc: 'Идеальная вместимость и комфортная круглая банкетная рассадка без стеснения.'
    },
    {
      icon: Utensils,
      title: 'Профессиональная сервировка',
      desc: 'Премиальный фарфор, королевские приборы, бокалы из хрусталя и текстиль высшего качества.'
    },
    {
      icon: Tv,
      title: 'LED-экран',
      desc: 'Широкоформатный мультимедийный видеоэкран сверхвысокого разрешения для клипов и презентаций.'
    },
    {
      icon: Volume2,
      title: 'Музыкальная аппаратура',
      desc: 'Концертная звуковая система, радиомикрофоны и сценическое световое сопровождение.'
    },
    {
      icon: Building2,
      title: 'Большой банкетный зал',
      desc: 'Высокие потолки с золотыми хрустальными люстрами, просторный танцпол и величественная сцена.'
    },
    {
      icon: UserCheck,
      title: 'Профессиональное обслуживание',
      desc: 'Опытная банкетная служба, метрдотели и вышколенный персонал для идеального проведения банкета.'
    }
  ];

  const eventTypes = [
    'Свадебные мероприятия (Үйлену той, Ұзату)',
    'Юбилеи и памятные даты (Мерейтой)',
    'Корпоративные вечера и гала-ужины',
    'Дни рождения и семейные праздники',
    'Семинары и бизнес-тренинги',
    'Конференции и деловые форумы',
    'Презентации брендов и новых проектов',
    'Садақа мәзірі мен дәстүрлі астар'
  ];

  return (
    <section id="about" className="py-20 lg:py-28 bg-[#F7F1E3] text-[#171513] relative overflow-hidden">
      {/* Subtle luxury background filigree accent */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#D8C08A]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#C9A227]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full border border-[#C9A227] bg-[#EFE3CC] mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#9A7617]" />
            <span className="text-xs uppercase tracking-widest text-[#9A7617] font-semibold">
              О банкетном зале
            </span>
            <Sparkles className="w-3.5 h-3.5 text-[#9A7617]" />
          </div>
          <h2 className="font-cinzel text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0B0A09] mb-4 tracking-wide">
            ПРОСТРАНСТВО ДЛЯ <span className="text-[#9A7617]">ВАЖНЫХ МОМЕНТОВ</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-[#C9A227] to-transparent mx-auto mb-4" />
          <p className="text-base sm:text-lg text-[#171513]/80 font-cormorant italic text-center max-w-2xl mx-auto">
            «TRIUMPH HALL — это место, где каждое торжество становится историческим триумфом, наполненным радостью, роскошью и гостеприимством.»
          </p>
        </div>

        {/* Big visual & text grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center mb-20">
          {/* Left: Luxury Image with frame */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-sm overflow-hidden shadow-2xl border-4 border-[#EFE3CC] group">
              <img
                src="/src/assets/images/banquet_table_setting_1790604147189.jpg"
                alt="Интерьер и сервировка столов в Triumph Hall Атырау"
                className="w-full h-[420px] sm:h-[480px] object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B0A09]/70 via-transparent to-transparent" />
              
              {/* Floating badge */}
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded bg-[#0B0A09]/90 border border-[#C9A227]/50 backdrop-blur-md text-[#F7F1E3]">
                <div className="text-xs uppercase tracking-widest text-[#D8C08A] font-medium">
                  Премиум класс в Атырау
                </div>
                <div className="font-cinzel text-lg font-bold text-[#F7F1E3]">
                  Королевская обстановка для 256–450 персон
                </div>
              </div>
            </div>

            {/* Accent backdrop border */}
            <div className="hidden sm:block absolute -bottom-4 -right-4 w-full h-full border-2 border-[#C9A227] -z-10 rounded-sm" />
          </div>

          {/* Right: Narrative Description */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-4 text-[#171513]/90 text-sm sm:text-base leading-relaxed">
              <p className="font-semibold text-lg sm:text-xl text-[#0B0A09]">
                Добро пожаловать в TRIUMPH HALL — один из самых величественных и респектабельных банкетных залов города Атырау.
              </p>
              <p>
                Мы создали уникальный дворец торжеств, в котором гармонично сочетаются европейская архитектурная элегантность, благородное золото, передовые сценические технологии и щедрые традиции казахского гостеприимства.
              </p>
              <p>
                Здесь с одинаковым блеском и размахом проходят грандиозные <strong>свадебные тои</strong>, статусные <strong>юбилеи</strong>, корпоративные балы крупных компаний, презентации мирового уровня, а также камерные семейные события и поминальные обеды (<strong>Садақа мәзірі</strong>) с полным соблюдением всех канонов.
              </p>
            </div>

            {/* Events checklist */}
            <div className="pt-2">
              <h4 className="font-cinzel text-sm uppercase tracking-wider font-bold text-[#0B0A09] mb-3">
                Мы организуем под ключ:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm font-medium">
                {eventTypes.map((event, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-[#171513]">
                    <CheckCircle2 className="w-4 h-4 text-[#9A7617] flex-shrink-0" />
                    <span>{event}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-4 pt-4">
              <button
                onClick={onOpenBooking}
                className="px-6 py-3 rounded-sm bg-[#0B0A09] hover:bg-[#171513] text-[#D8C08A] font-bold text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer"
              >
                Забронировать дату
              </button>
              <button
                onClick={onExploreHall}
                className="px-6 py-3 rounded-sm border border-[#9A7617] text-[#9A7617] hover:bg-[#EFE3CC] font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
              >
                Узнать параметры зала
              </button>
            </div>
          </div>
        </div>

        {/* 6 Key Advantages Grid */}
        <div className="pt-8">
          <div className="text-center mb-10">
            <h3 className="font-cinzel text-2xl sm:text-3xl font-bold text-[#0B0A09]">
              ПРЕИМУЩЕСТВА TRIUMPH HALL
            </h3>
            <p className="text-sm text-[#171513]/70 mt-1">
              Всё продумано до мелочей для беззаботного проведения праздника
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {advantages.map((adv, index) => {
              const IconComp = adv.icon;
              return (
                <div
                  key={index}
                  className="p-6 rounded-sm bg-[#FFFFFF] border border-[#EFE3CC] hover:border-[#C9A227] shadow-sm hover:shadow-xl transition-all duration-300 group"
                >
                  <div className="w-12 h-12 rounded-sm bg-[#EFE3CC] text-[#9A7617] flex items-center justify-center mb-4 group-hover:bg-[#9A7617] group-hover:text-[#FFFFFF] transition-colors">
                    <IconComp className="w-6 h-6" />
                  </div>
                  <h4 className="font-cinzel text-lg font-bold text-[#0B0A09] mb-2 group-hover:text-[#9A7617] transition-colors">
                    {adv.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-[#171513]/75 leading-relaxed">
                    {adv.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
