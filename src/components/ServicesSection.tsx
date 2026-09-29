import React from 'react';
import { Sparkles, Utensils, Heart, Briefcase, Crown, Gift, GraduationCap, Users, Presentation, ArrowRight } from 'lucide-react';

interface ServicesSectionProps {
  onSelectService: (serviceName: string) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onSelectService }) => {
  const servicesList = [
    {
      title: 'Банкет',
      tagline: 'Изысканный банкетный стол',
      description: 'Авторская подача холодных закусок, салатов, горячих национальных блюд, свежей выпечки и десертов от команды шеф-повара.',
      icon: Utensils,
    },
    {
      title: 'Свадьба',
      tagline: 'Торжество вашей мечты',
      description: 'Организация свадьбы и проводов невесты (Ұзату той) под ключ с роскошным президиумом, светом, музыкой и безупречным таймингом.',
      icon: Heart,
    },
    {
      title: 'Корпоратив',
      tagline: 'Статусный корпоративный вечер',
      description: 'Торжественные мероприятия для компаний и корпораций: банкетное обслуживание, брендирование на LED-экране, шоу-программа и награждения.',
      icon: Briefcase,
    },
    {
      title: 'Юбилей',
      tagline: 'Почтенный юбилей',
      description: 'Празднование значимых дат и юбилеев в атмосфере тепла и почтения к традициям казахского дастархана.',
      icon: Crown,
    },
    {
      title: 'День рождения',
      tagline: 'Яркий и душевный праздник',
      description: 'Праздник в кругу самых близких людей с авторскими блюдами, музыкальным сопровождением и праздничным тортом.',
      icon: Gift,
    },
    {
      title: 'Семинар',
      tagline: 'Профессиональное обучение',
      description: 'Предоставление зала с ультрасовременным экраном и акустикой для проведения обучающих программ и мастер-классов.',
      icon: GraduationCap,
    },
    {
      title: 'Конференция',
      tagline: 'Деловые форумы и съезды',
      description: 'Площадка для встреч предпринимателей, научных форумов и конференций с техническим сервисом инженеров.',
      icon: Users,
    },
    {
      title: 'Презентация',
      tagline: 'Премьеры и презентации',
      description: 'Эффектное визуальное шоу на широком экране для презентации новых продуктов, брендов и архитектурных проектов.',
      icon: Presentation,
    },
  ];

  return (
    <section id="services" className="py-20 lg:py-28 bg-[#F7F1E3] text-[#171513] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full border border-[#C9A227] bg-[#EFE3CC] mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#9A7617]" />
            <span className="text-xs uppercase tracking-widest text-[#9A7617] font-semibold">
              Полный спектр услуг
            </span>
            <Sparkles className="w-3.5 h-3.5 text-[#9A7617]" />
          </div>
          <h2 className="font-cinzel text-3xl sm:text-4xl lg:text-5xl font-bold tracking-wide text-[#0B0A09] mb-3">
            ВСЁ ДЛЯ <span className="text-[#9A7617]">ВАШЕГО ПРАЗДНИКА</span>
          </h2>
          <p className="text-base sm:text-lg text-[#171513]/80 font-cormorant italic">
            «От разработки меню и сервировки столов до мультимедийного шоу и координации мероприятия»
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-[#C9A227] to-transparent mx-auto mt-4" />
        </div>

        {/* 8 Service Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {servicesList.map((service, index) => {
            const IconComp = service.icon;
            return (
              <div
                key={index}
                className="p-6 rounded-sm bg-[#FFFFFF] border border-[#EFE3CC] hover:border-[#C9A227] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="w-12 h-12 rounded-sm bg-[#EFE3CC] text-[#9A7617] flex items-center justify-center mb-4 group-hover:bg-[#9A7617] group-hover:text-white transition-colors">
                    <IconComp className="w-6 h-6" />
                  </div>
                  <h3 className="font-cinzel text-xl font-bold text-[#0B0A09] group-hover:text-[#9A7617] transition-colors mb-1">
                    {service.title}
                  </h3>
                  <span className="text-xs text-[#9A7617] font-semibold uppercase tracking-wider block mb-3">
                    {service.tagline}
                  </span>
                  <p className="text-xs sm:text-sm text-[#171513]/75 leading-relaxed mb-6">
                    {service.description}
                  </p>
                </div>

                <button
                  onClick={() => onSelectService(service.title)}
                  className="w-full py-2 px-3 rounded-sm border border-[#EFE3CC] group-hover:border-[#9A7617] text-xs font-bold uppercase tracking-wider text-[#9A7617] group-hover:bg-[#9A7617] group-hover:text-white transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Заказать услугу</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
