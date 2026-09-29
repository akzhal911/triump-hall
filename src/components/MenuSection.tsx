import React, { useState } from 'react';
import { Sparkles, Eye, Check, Gift, Utensils, ArrowRight } from 'lucide-react';
import { MenuItem, MENUS_DATA } from '../data/triumphData';

interface MenuSectionProps {
  onOpenModal: (menu: MenuItem) => void;
  onSelectForCalculator: (menu: MenuItem) => void;
}

export const MenuSection: React.FC<MenuSectionProps> = ({ onOpenModal, onSelectForCalculator }) => {
  const [filter, setFilter] = useState<'all' | 'holiday' | 'sadaka' | 'vip'>('all');

  const filteredMenus = MENUS_DATA.filter((menu) => {
    if (filter === 'sadaka') return menu.price === 7000;
    if (filter === 'vip') return menu.price >= 18000;
    if (filter === 'holiday') return menu.price >= 8000;
    return true;
  });

  return (
    <section id="menu" className="py-20 lg:py-28 bg-[#0B0A09] text-[#F7F1E3] relative overflow-hidden">
      {/* Background radial gold glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-[#C9A227]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full border border-[#C9A227]/40 bg-[#171513] mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#C9A227]" />
            <span className="text-xs uppercase tracking-widest text-[#D8C08A] font-semibold">
              Банкетная гастрономия
            </span>
            <Sparkles className="w-3.5 h-3.5 text-[#C9A227]" />
          </div>
          <h2 className="font-cinzel text-3xl sm:text-4xl lg:text-5xl font-bold tracking-wide text-[#F7F1E3] mb-3">
            ПРАЗДНИЧНОЕ <span className="text-gradient-gold">МЕНЮ</span>
          </h2>
          <p className="text-base sm:text-lg text-[#D8C08A] font-cormorant italic">
            «Выберите меню, которое подходит именно вашему мероприятию.»
          </p>
          <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-[#C9A227] to-transparent mx-auto mt-4" />
        </div>

        {/* Filter Navigation Tabs */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-14">
          {[
            { id: 'all', label: 'Все варианты (5)' },
            { id: 'holiday', label: 'Праздничные банкеты' },
            { id: 'vip', label: 'VIP и Фирменные' },
            { id: 'sadaka', label: 'Садақа мәзірі' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as any)}
              className={`px-5 py-2 rounded-sm text-xs sm:text-sm font-semibold tracking-wider uppercase transition-all cursor-pointer ${
                filter === tab.id
                  ? 'bg-gradient-to-r from-[#9A7617] to-[#C9A227] text-[#0B0A09] shadow-[0_0_15px_rgba(201,162,39,0.4)]'
                  : 'bg-[#171513] text-[#D8C08A] border border-[#C9A227]/30 hover:border-[#C9A227] hover:text-[#F7F1E3]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 5 Menu Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredMenus.map((menu) => (
            <div
              key={menu.id}
              className={`group flex flex-col rounded-sm bg-[#171513] border transition-all duration-300 overflow-hidden ${
                menu.popular
                  ? 'border-[#C9A227] shadow-[0_0_30px_rgba(201,162,39,0.3)] transform md:-translate-y-2'
                  : 'border-[#C9A227]/30 hover:border-[#C9A227] hover:shadow-[0_0_25px_rgba(201,162,39,0.2)]'
              }`}
            >
              {/* Card Image Banner */}
              <div className="relative h-56 sm:h-64 overflow-hidden">
                <img
                  src={menu.image}
                  alt={menu.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#171513] via-transparent to-[#0B0A09]/40" />

                {/* Badge top-left */}
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider rounded-sm bg-[#0B0A09]/90 text-[#D8C08A] border border-[#C9A227]/40 backdrop-blur-md">
                    {menu.badge || 'TRIUMPH'}
                  </span>
                </div>

                {/* Popular banner if applicable */}
                {menu.popular && (
                  <div className="absolute top-4 right-4">
                    <span className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider rounded-sm bg-gradient-to-r from-[#9A7617] to-[#C9A227] text-[#0B0A09] shadow-md">
                      ПОПУЛЯРНОЕ
                    </span>
                  </div>
                )}

                {/* Price Display on Image */}
                <div className="absolute bottom-3 left-4 right-4 flex items-baseline justify-between">
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-cinzel text-3xl font-bold text-gradient-gold">
                      {menu.price.toLocaleString('ru-RU')} ₸
                    </span>
                    <span className="text-xs text-[#D8C08A] uppercase tracking-wider">
                      / {menu.price === 7000 ? 'адам' : 'чел'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Content Body */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-cinzel text-xl font-bold text-[#F7F1E3] group-hover:text-[#D8C08A] transition-colors mb-2">
                    {menu.name}
                  </h3>

                  {menu.langNote && (
                    <p className="text-xs text-[#D8C08A]/80 font-cormorant italic mb-4">
                      {menu.langNote}
                    </p>
                  )}

                  {/* Highlights list */}
                  <div className="space-y-2.5 text-xs text-[#F7F1E3]/90 mb-5 border-t border-b border-[#C9A227]/15 py-3">
                    <div className="flex items-start gap-2">
                      <Utensils className="w-4 h-4 text-[#C9A227] flex-shrink-0 mt-0.5" />
                      <span>
                        <strong className="text-[#D8C08A]">Салаты:</strong> {menu.salads}
                      </span>
                    </div>

                    <div className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-[#C9A227] flex-shrink-0 mt-0.5" />
                      <span>
                        <strong className="text-[#D8C08A]">Холодные закуски:</strong> {menu.coldAppetizers.slice(0, 3).join(', ')}...
                      </span>
                    </div>

                    <div className="flex items-start gap-2">
                      <Sparkles className="w-4 h-4 text-[#C9A227] flex-shrink-0 mt-0.5" />
                      <span>
                        <strong className="text-[#D8C08A]">Горячие блюда:</strong> {menu.hotDishes[0]}
                      </span>
                    </div>
                  </div>

                  {/* Gift badge if available */}
                  {menu.hasFreeTechGift && (
                    <div className="mb-6 p-2.5 rounded bg-[#0B0A09] border border-[#C9A227]/40 text-[11px] text-[#D8C08A] flex items-center gap-2">
                      <Gift className="w-4 h-4 text-[#C9A227] flex-shrink-0" />
                      <span>
                        <strong>Подарок:</strong> LED-экран и аппаратура — бесплатно
                      </span>
                    </div>
                  )}
                  {menu.price === 7000 && (
                    <div className="mb-6 p-2.5 rounded bg-[#0B0A09] border border-[#C9A227]/20 text-[11px] text-[#D8C08A]/90 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#C9A227] flex-shrink-0" />
                      <span>Дәстүрге сай дайындалған тағамдар мен шай</span>
                    </div>
                  )}
                </div>

                {/* Card CTA Buttons */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    onClick={() => onOpenModal(menu)}
                    className="py-2.5 px-3 rounded-sm border border-[#C9A227]/40 hover:border-[#C9A227] text-xs font-semibold uppercase tracking-wider text-[#D8C08A] hover:text-[#FFFFFF] bg-[#0B0A09] hover:bg-[#171513] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-[#C9A227]" />
                    <span>СОСТАВ</span>
                  </button>

                  <button
                    onClick={() => onSelectForCalculator(menu)}
                    className="py-2.5 px-3 rounded-sm bg-gradient-to-r from-[#9A7617] to-[#C9A227] text-[#0B0A09] hover:from-[#C9A227] hover:to-[#D8C08A] font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1 shadow-md cursor-pointer group/btn"
                  >
                    <span>ВЫБРАТЬ</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom prompt note */}
        <div className="mt-14 text-center p-6 rounded-sm bg-[#171513] border border-[#C9A227]/30 max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-left">
            <h4 className="font-cinzel text-base font-bold text-[#F7F1E3]">
              Индивидуальное банкетное меню
            </h4>
            <p className="text-xs text-[#D8C08A]/80 mt-0.5">
              Хотите составить персональный перечень блюд или добавить фирменные угощения?
            </p>
          </div>
          <a
            href="tel:+77755309505"
            className="px-5 py-2.5 rounded-sm border border-[#C9A227] text-xs font-bold uppercase tracking-wider text-[#C9A227] hover:bg-[#C9A227] hover:text-[#0B0A09] transition-all whitespace-nowrap cursor-pointer"
          >
            Обсудить с шефом
          </a>
        </div>
      </div>
    </section>
  );
};
