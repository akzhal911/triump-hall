import React from 'react';
import { X, Gift, Utensils, Check, Sparkles, Calculator, ShieldCheck } from 'lucide-react';
import { MenuItem } from '../data/triumphData';

interface MenuModalProps {
  menu: MenuItem | null;
  onClose: () => void;
  onSelectForCalculator: (menu: MenuItem) => void;
}

export const MenuModal: React.FC<MenuModalProps> = ({ menu, onClose, onSelectForCalculator }) => {
  if (!menu) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B0A09]/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto bg-[#171513] text-[#F7F1E3] rounded-sm border-2 border-[#C9A227] shadow-[0_0_50px_rgba(201,162,39,0.3)] p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-[#0B0A09] text-[#D8C08A] hover:text-white border border-[#C9A227]/40 hover:border-[#C9A227] transition-all cursor-pointer z-10"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="border-b border-[#C9A227]/30 pb-6 mb-6">
          <div className="flex flex-wrap items-center gap-3 mb-2">
            <span className="px-3 py-1 text-xs uppercase tracking-widest font-semibold rounded-full bg-[#C9A227]/20 text-[#D8C08A] border border-[#C9A227]/40">
              {menu.badge || 'TRIUMPH HALL'}
            </span>
            {menu.popular && (
              <span className="px-3 py-1 text-xs uppercase tracking-widest font-semibold rounded-full bg-gradient-to-r from-[#9A7617] to-[#C9A227] text-[#0B0A09]">
                ХИТ ВЫБОРА
              </span>
            )}
          </div>

          <h3 className="font-cinzel text-2xl sm:text-4xl font-bold text-[#F7F1E3] tracking-wide">
            {menu.name}
          </h3>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="font-cinzel text-3xl sm:text-4xl font-bold text-gradient-gold">
              {menu.price.toLocaleString('ru-RU')} ₸
            </span>
            <span className="text-sm text-[#D8C08A]/80 uppercase tracking-wider">
              / {menu.price === 7000 ? 'адам' : 'человек'}
            </span>
          </div>
          {menu.langNote && (
            <p className="text-xs sm:text-sm text-[#D8C08A]/75 italic mt-1 font-cormorant">
              {menu.langNote}
            </p>
          )}
        </div>

        {/* Menu Composition Sections */}
        <div className="space-y-6 text-sm sm:text-base">
          {/* 1. Salads */}
          <div className="p-4 rounded bg-[#0B0A09]/60 border border-[#C9A227]/20">
            <div className="flex items-center gap-2 font-cinzel text-[#C9A227] text-sm uppercase tracking-wider font-bold mb-2">
              <Utensils className="w-4 h-4" />
              <span>{menu.price === 7000 ? 'САЛАТТАР' : 'САЛАТЫ'}</span>
            </div>
            <p className="text-[#F7F1E3] font-medium pl-6">
              {menu.salads}
            </p>
          </div>

          {/* 2. Cold Appetizers */}
          <div className="p-4 rounded bg-[#0B0A09]/60 border border-[#C9A227]/20">
            <div className="flex items-center gap-2 font-cinzel text-[#C9A227] text-sm uppercase tracking-wider font-bold mb-3">
              <Sparkles className="w-4 h-4" />
              <span>{menu.price === 7000 ? 'САЛҚЫН ТІСКЕБАСАРЛАР' : 'ХОЛОДНЫЕ ЗАКУСКИ'}</span>
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-2">
              {menu.coldAppetizers.map((item, idx) => (
                <li key={idx} className="flex items-center gap-2 text-xs sm:text-sm text-[#F7F1E3]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C9A227]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 3. Hot Dishes */}
          <div className="p-4 rounded bg-[#0B0A09]/60 border border-[#C9A227]/20">
            <div className="flex items-center gap-2 font-cinzel text-[#C9A227] text-sm uppercase tracking-wider font-bold mb-3">
              <Utensils className="w-4 h-4" />
              <span>{menu.price === 7000 ? 'ЫСТЫҚ ТАҒАМДАР' : 'ГОРЯЧИЕ БЛЮДА'}</span>
            </div>
            <ul className="space-y-1.5 pl-2">
              {menu.hotDishes.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-[#F7F1E3] font-medium">
                  <Check className="w-4 h-4 text-[#C9A227] flex-shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 4. Bakery & Pastry */}
          <div className="p-4 rounded bg-[#0B0A09]/60 border border-[#C9A227]/20">
            <div className="flex items-center gap-2 font-cinzel text-[#C9A227] text-sm uppercase tracking-wider font-bold mb-3">
              <Sparkles className="w-4 h-4" />
              <span>{menu.price === 7000 ? 'НАН ӨНІМДЕРІ' : 'ХЛЕБНЫЕ ИЗДЕЛИЯ И ВЫПЕЧКА'}</span>
            </div>
            <div className="flex flex-wrap gap-2 pl-2">
              {menu.bakery.map((item, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded bg-[#171513] border border-[#C9A227]/30 text-xs sm:text-sm text-[#F7F1E3]"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* 5. Sweets & Desserts (if present) */}
          {menu.sweets && menu.sweets.length > 0 && (
            <div className="p-4 rounded bg-[#0B0A09]/60 border border-[#C9A227]/20">
              <div className="flex items-center gap-2 font-cinzel text-[#C9A227] text-sm uppercase tracking-wider font-bold mb-3">
                <Sparkles className="w-4 h-4" />
                <span>{menu.price === 7000 ? 'ТӘТТІЛЕР' : 'ДЕСЕРТЫ И СЛАДОСТИ'}</span>
              </div>
              <div className="flex flex-wrap gap-2 pl-2">
                {menu.sweets.map((item, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded bg-[#171513] border border-[#C9A227]/30 text-xs sm:text-sm text-[#D8C08A]"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 6. Drinks */}
          <div className="p-4 rounded bg-[#0B0A09]/60 border border-[#C9A227]/20">
            <div className="flex items-center gap-2 font-cinzel text-[#C9A227] text-sm uppercase tracking-wider font-bold mb-3">
              <Sparkles className="w-4 h-4" />
              <span>{menu.price === 7000 ? 'СУСЫНДАР' : 'НАПИТКИ'}</span>
            </div>
            <div className="flex flex-wrap gap-2 pl-2">
              {menu.drinks.map((item, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded bg-[#171513] border border-[#C9A227]/30 text-xs sm:text-sm text-[#F7F1E3]"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* Venue Gift */}
          {menu.gift && (
            <div className="p-4 rounded bg-gradient-to-r from-[#9A7617]/20 to-[#C9A227]/10 border border-[#C9A227] flex items-start gap-3">
              <Gift className="w-5 h-5 text-[#C9A227] flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-cinzel text-xs uppercase tracking-wider font-bold text-[#D8C08A] block">
                  ПОДАРОК ДЛЯ ВАС:
                </span>
                <span className="text-sm font-semibold text-[#F7F1E3]">
                  {menu.gift}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="mt-8 pt-6 border-t border-[#C9A227]/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-[#D8C08A]/70 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#C9A227]" />
            <span>Официальное меню TRIUMPH HALL Атырау без скрытых доплат</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="w-1/2 sm:w-auto px-5 py-2.5 rounded-sm border border-[#C9A227]/40 hover:border-[#C9A227] text-xs uppercase tracking-wider text-[#D8C08A] transition-colors cursor-pointer"
            >
              Закрыть
            </button>
            <button
              onClick={() => onSelectForCalculator(menu)}
              className="w-1/2 sm:w-auto px-6 py-2.5 rounded-sm bg-gradient-to-r from-[#9A7617] via-[#C9A227] to-[#D8C08A] text-[#0B0A09] font-bold text-xs uppercase tracking-wider shadow-lg hover:shadow-[0_0_25px_rgba(201,162,39,0.5)] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Calculator className="w-4 h-4" />
              ВЫБРАТЬ И РАССЧИТАТЬ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
