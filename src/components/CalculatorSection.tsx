import React, { useState } from 'react';
import { Calculator, Plus, Minus, Check, Sparkles, Gift, HelpCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { MenuItem, MENUS_DATA } from '../data/triumphData';

interface AdditionalService {
  id: string;
  name: string;
  category: 'tech' | 'creative';
  isTechGift: boolean;
}

const ADDITIONAL_SERVICES: AdditionalService[] = [
  { id: 'srv-led', name: 'LED-экран сверхвысокого разрешения', category: 'tech', isTechGift: true },
  { id: 'srv-sound', name: 'Музыкальная звуковая аппаратура и радиомикрофоны', category: 'tech', isTechGift: true },
  { id: 'srv-decor', name: 'Декор зала и флористика столов', category: 'creative', isTechGift: false },
  { id: 'srv-photo', name: 'Профессиональный фотограф / видеограф', category: 'creative', isTechGift: false },
  { id: 'srv-host', name: 'Праздничный ведущий / Тамада с программой', category: 'creative', isTechGift: false },
  { id: 'srv-dj', name: 'DJ со световым сопровождением', category: 'creative', isTechGift: false },
  { id: 'srv-photozone', name: 'Дизайнерская тематическая фотозона', category: 'creative', isTechGift: false },
];

export interface CalculationResult {
  selectedMenu: MenuItem;
  guestCount: number;
  menuCost: number;
  additionalServices: string[];
  totalCost: number;
}

interface CalculatorSectionProps {
  selectedMenuId: string;
  onMenuChange: (menuId: string) => void;
  onProceedToBooking: (calc: CalculationResult) => void;
}

export const CalculatorSection: React.FC<CalculatorSectionProps> = ({
  selectedMenuId,
  onMenuChange,
  onProceedToBooking,
}) => {
  const [guestCount, setGuestCount] = useState<number>(100);
  const [selectedServices, setSelectedServices] = useState<string[]>([
    'srv-led',
    'srv-sound'
  ]);

  // Find active menu
  const activeMenu = MENUS_DATA.find((m) => m.id === selectedMenuId) || MENUS_DATA[2];

  // Calculation formula
  const menuCost = guestCount * activeMenu.price;
  const totalCost = menuCost; // additional options have no fixed surcharge in prompt, they are free gift or price on request

  const handleGuestChange = (val: number) => {
    if (isNaN(val)) return;
    const clamped = Math.max(1, Math.min(450, val));
    setGuestCount(clamped);
  };

  const toggleService = (srvId: string) => {
    if (selectedServices.includes(srvId)) {
      setSelectedServices(selectedServices.filter((id) => id !== srvId));
    } else {
      setSelectedServices([...selectedServices, srvId]);
    }
  };

  const handleBookNow = () => {
    const serviceNames = selectedServices.map((id) => {
      const srv = ADDITIONAL_SERVICES.find((s) => s.id === id);
      return srv ? srv.name : id;
    });

    onProceedToBooking({
      selectedMenu: activeMenu,
      guestCount,
      menuCost,
      additionalServices: serviceNames,
      totalCost,
    });
  };

  return (
    <section id="calculator" className="py-20 lg:py-28 bg-[#171513] text-[#F7F1E3] relative overflow-hidden border-t border-b border-[#C9A227]/20">
      {/* Decorative gradient backdrops */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[#C9A227]/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-[#D8C08A]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full border border-[#C9A227]/40 bg-[#0B0A09] mb-4">
            <Calculator className="w-3.5 h-3.5 text-[#C9A227]" />
            <span className="text-xs uppercase tracking-widest text-[#D8C08A] font-semibold">
              Онлайн калькулятор
            </span>
            <Calculator className="w-3.5 h-3.5 text-[#C9A227]" />
          </div>
          <h2 className="font-cinzel text-3xl sm:text-4xl lg:text-5xl font-bold tracking-wide text-[#F7F1E3] mb-3">
            РАССЧИТАЙТЕ СТОИМОСТЬ <span className="text-gradient-gold">БАНКЕТА</span>
          </h2>
          <p className="text-base sm:text-lg text-[#D8C08A] font-cormorant italic">
            «Прозрачный и точный расчет бюджета вашего торжества в TRIUMPH HALL»
          </p>
          <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-[#C9A227] to-transparent mx-auto mt-4" />
        </div>

        {/* 2-Column Calculator Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Interactive Steps (7 Cols) */}
          <div className="lg:col-span-7 space-y-8 bg-[#0B0A09]/70 p-6 sm:p-8 rounded-sm border border-[#C9A227]/30 shadow-2xl backdrop-blur-md">
            
            {/* STEP 1: Выберите меню */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-gradient-to-br from-[#9A7617] to-[#C9A227] text-[#0B0A09] font-bold text-xs flex items-center justify-center">
                    1
                  </span>
                  <h3 className="font-cinzel text-lg sm:text-xl font-bold text-[#F7F1E3] tracking-wide">
                    ВЫБЕРИТЕ МЕНЮ
                  </h3>
                </div>
                <span className="text-xs text-[#D8C08A]/75">
                  5 вариантов на выбор
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {MENUS_DATA.map((menu) => {
                  const isSelected = menu.id === activeMenu.id;
                  return (
                    <button
                      key={menu.id}
                      onClick={() => onMenuChange(menu.id)}
                      className={`p-3.5 rounded-sm text-left transition-all relative border cursor-pointer ${
                        isSelected
                          ? 'bg-[#171513] border-[#C9A227] shadow-[0_0_20px_rgba(201,162,39,0.3)] ring-1 ring-[#C9A227]'
                          : 'bg-[#171513]/50 border-[#C9A227]/20 hover:border-[#C9A227]/60'
                      }`}
                    >
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-[#C9A227] text-[#0B0A09] flex items-center justify-center">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      )}
                      <div className="font-cinzel text-lg font-bold text-gradient-gold">
                        {menu.price.toLocaleString('ru-RU')} ₸
                      </div>
                      <div className="text-xs font-semibold text-[#F7F1E3] truncate mt-0.5">
                        {menu.name}
                      </div>
                      <div className="text-[11px] text-[#D8C08A]/70 mt-1">
                        {menu.price === 7000 ? 'Садақа мәзірі' : `${menu.salads}`}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* STEP 2: Количество гостей */}
            <div className="pt-4 border-t border-[#C9A227]/20">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-gradient-to-br from-[#9A7617] to-[#C9A227] text-[#0B0A09] font-bold text-xs flex items-center justify-center">
                    2
                  </span>
                  <h3 className="font-cinzel text-lg sm:text-xl font-bold text-[#F7F1E3] tracking-wide">
                    КОЛИЧЕСТВО ГОСТЕЙ
                  </h3>
                </div>
                <span className="text-xs text-[#D8C08A]">
                  Зал от 1 до 450 гостей
                </span>
              </div>

              {/* Counter Control: [- 50 +] */}
              <div className="flex flex-col sm:flex-row items-center gap-4 bg-[#171513] p-4 rounded-sm border border-[#C9A227]/30">
                <div className="flex items-center justify-center gap-3 w-full sm:w-auto">
                  <button
                    onClick={() => handleGuestChange(guestCount - 10)}
                    disabled={guestCount <= 1}
                    className="w-12 h-12 rounded-sm bg-[#0B0A09] border border-[#C9A227]/50 hover:border-[#C9A227] hover:bg-[#C9A227]/10 text-[#F7F1E3] font-bold text-lg flex items-center justify-center transition-all disabled:opacity-30 cursor-pointer"
                    aria-label="Decrease guests"
                  >
                    <Minus className="w-5 h-5" />
                  </button>

                  <div className="relative">
                    <input
                      type="number"
                      min={1}
                      max={450}
                      value={guestCount}
                      onChange={(e) => handleGuestChange(parseInt(e.target.value, 10))}
                      className="w-28 h-12 text-center text-2xl font-bold font-cinzel text-[#F0D98A] bg-[#0B0A09] border border-[#C9A227] rounded-sm focus:outline-none focus:ring-2 focus:ring-[#C9A227]"
                    />
                    <span className="text-[10px] text-[#D8C08A]/70 uppercase block text-center mt-1">
                      персон
                    </span>
                  </div>

                  <button
                    onClick={() => handleGuestChange(guestCount + 10)}
                    disabled={guestCount >= 450}
                    className="w-12 h-12 rounded-sm bg-[#0B0A09] border border-[#C9A227]/50 hover:border-[#C9A227] hover:bg-[#C9A227]/10 text-[#F7F1E3] font-bold text-lg flex items-center justify-center transition-all disabled:opacity-30 cursor-pointer"
                    aria-label="Increase guests"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>

                {/* Range Slider for ultra-smooth drag */}
                <div className="flex-1 w-full pl-2">
                  <input
                    type="range"
                    min={1}
                    max={450}
                    value={guestCount}
                    onChange={(e) => handleGuestChange(parseInt(e.target.value, 10))}
                    className="w-full accent-[#C9A227] cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] text-[#D8C08A]/70 mt-1 font-mono">
                    <span>1 гость</span>
                    <span>150</span>
                    <span>256 (банкет)</span>
                    <span>450 макс</span>
                  </div>
                </div>
              </div>

              {/* Quick Preset Buttons */}
              <div className="flex flex-wrap items-center gap-2 mt-3">
                <span className="text-xs text-[#D8C08A]/70 mr-1">Быстрый выбор:</span>
                {[50, 100, 150, 200, 256, 350, 450].map((preset) => (
                  <button
                    key={preset}
                    onClick={() => handleGuestChange(preset)}
                    className={`px-2.5 py-1 text-xs rounded border transition-all cursor-pointer ${
                      guestCount === preset
                        ? 'bg-[#C9A227] text-[#0B0A09] font-bold border-[#C9A227]'
                        : 'bg-[#0B0A09] text-[#D8C08A] border-[#C9A227]/30 hover:border-[#C9A227]'
                    }`}
                  >
                    {preset} гостей
                  </button>
                ))}
              </div>
            </div>

            {/* STEP 3: Дополнительные услуги */}
            <div className="pt-4 border-t border-[#C9A227]/20">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-gradient-to-br from-[#9A7617] to-[#C9A227] text-[#0B0A09] font-bold text-xs flex items-center justify-center">
                    3
                  </span>
                  <h3 className="font-cinzel text-lg sm:text-xl font-bold text-[#F7F1E3] tracking-wide">
                    ДОПОЛНИТЕЛЬНЫЕ УСЛУГИ
                  </h3>
                </div>
                <span className="text-xs text-[#D8C08A]/70">
                  Отметьте необходимые опции
                </span>
              </div>

              <div className="space-y-2.5">
                {ADDITIONAL_SERVICES.map((srv) => {
                  const isChecked = selectedServices.includes(srv.id);
                  const isFreeGift = srv.isTechGift && activeMenu.hasFreeTechGift;

                  return (
                    <label
                      key={srv.id}
                      onClick={() => toggleService(srv.id)}
                      className={`flex items-center justify-between p-3 rounded-sm border cursor-pointer transition-all ${
                        isChecked
                          ? 'bg-[#171513] border-[#C9A227]/60'
                          : 'bg-[#171513]/40 border-[#C9A227]/20 hover:border-[#C9A227]/40'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-5 h-5 rounded flex items-center justify-center border transition-all ${
                            isChecked
                              ? 'bg-[#C9A227] border-[#C9A227] text-[#0B0A09]'
                              : 'border-[#C9A227]/40 bg-[#0B0A09]'
                          }`}
                        >
                          {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                        <span className="text-xs sm:text-sm text-[#F7F1E3] font-medium">
                          {srv.name}
                        </span>
                      </div>

                      <div className="text-right">
                        {isFreeGift ? (
                          <span className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-bold text-[#D8C08A] bg-[#C9A227]/20 px-2 py-0.5 rounded border border-[#C9A227]/40">
                            <Gift className="w-3 h-3 text-[#C9A227]" />
                            Бесплатно от заведения
                          </span>
                        ) : (
                          <span className="text-[11px] sm:text-xs text-[#D8C08A]/70 italic">
                            Цена по запросу
                          </span>
                        )}
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Live Calculation Summary Card (5 Cols) */}
          <div className="lg:col-span-5 sticky top-24">
            <div className="p-6 sm:p-8 rounded-sm bg-gradient-to-b from-[#171513] to-[#0B0A09] border-2 border-[#C9A227] shadow-[0_0_35px_rgba(201,162,39,0.35)] relative overflow-hidden">
              <div className="flex items-center justify-between pb-4 border-b border-[#C9A227]/30 mb-6">
                <div>
                  <h4 className="font-cinzel text-xl font-bold text-[#F7F1E3]">
                    ИТОГ РАСЧЁТА
                  </h4>
                  <p className="text-xs text-[#D8C08A]/75 mt-0.5">
                    TRIUMPH HALL Атырау
                  </p>
                </div>
                <div className="w-10 h-10 rounded-full border border-[#C9A227]/60 flex items-center justify-center bg-[#0B0A09]">
                  <Sparkles className="w-5 h-5 text-[#C9A227]" />
                </div>
              </div>

              {/* Exact breakdown blocks as requested */}
              <div className="space-y-4 text-xs sm:text-sm">
                {/* Block 1: Selected Menu */}
                <div className="p-3.5 rounded bg-[#0B0A09]/70 border border-[#C9A227]/20 flex justify-between items-center">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[#D8C08A] block font-semibold">
                      ВЫБРАННОЕ МЕНЮ
                    </span>
                    <span className="font-cinzel font-bold text-[#F7F1E3] text-sm sm:text-base">
                      {activeMenu.name}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-cinzel font-bold text-[#F0D98A] text-base">
                      {activeMenu.price.toLocaleString('ru-RU')} ₸
                    </span>
                    <span className="text-[10px] text-[#D8C08A]/70 block">/ человек</span>
                  </div>
                </div>

                {/* Block 2: Guest Count */}
                <div className="p-3.5 rounded bg-[#0B0A09]/70 border border-[#C9A227]/20 flex justify-between items-center">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[#D8C08A] block font-semibold">
                      КОЛИЧЕСТВО ГОСТЕЙ
                    </span>
                    <span className="text-xs text-[#D8C08A]/70">
                      Банкетная посадка
                    </span>
                  </div>
                  <div className="text-right font-cinzel text-2xl font-bold text-[#F7F1E3]">
                    {guestCount}
                  </div>
                </div>

                {/* Block 3: Menu Cost */}
                <div className="p-3.5 rounded bg-[#0B0A09]/70 border border-[#C9A227]/20 flex justify-between items-center">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[#D8C08A] block font-semibold">
                      СТОИМОСТЬ МЕНЮ
                    </span>
                    <span className="text-[11px] text-[#D8C08A]/70 font-mono">
                      {guestCount} × {activeMenu.price.toLocaleString('ru-RU')} ₸
                    </span>
                  </div>
                  <div className="text-right font-cinzel text-lg sm:text-xl font-bold text-[#F0D98A]">
                    {menuCost.toLocaleString('ru-RU')} ₸
                  </div>
                </div>

                {/* Block 4: Additional Services */}
                <div className="p-3.5 rounded bg-[#0B0A09]/70 border border-[#C9A227]/20 flex justify-between items-center">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[#D8C08A] block font-semibold">
                      ДОПОЛНИТЕЛЬНЫЕ УСЛУГИ
                    </span>
                    <span className="text-[11px] text-[#D8C08A]/70">
                      {selectedServices.length} выбрано {activeMenu.hasFreeTechGift ? '(включая подарок)' : ''}
                    </span>
                  </div>
                  <div className="text-right font-semibold text-[#F7F1E3] text-sm">
                    0 ₸
                    <span className="text-[10px] text-[#D8C08A]/60 block font-normal">доп. по запросу</span>
                  </div>
                </div>

                {/* Block 5: Grand Total */}
                <div className="mt-6 pt-4 border-t-2 border-[#C9A227] flex justify-between items-end">
                  <div>
                    <span className="font-cinzel text-xs uppercase tracking-widest text-[#D8C08A] block font-bold">
                      ИТОГО
                    </span>
                    <span className="text-[11px] text-[#F7F1E3]/70">
                      Мгновенный автоматический расчёт
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-cinzel text-3xl sm:text-4xl font-bold text-gradient-gold block">
                      {totalCost.toLocaleString('ru-RU')} ₸
                    </span>
                  </div>
                </div>
              </div>

              {/* CTA Button: ЗАБРОНИРОВАТЬ ЭТОТ БАНКЕТ */}
              <button
                onClick={handleBookNow}
                className="w-full mt-6 py-4 px-6 rounded-sm bg-gradient-to-r from-[#9A7617] via-[#C9A227] to-[#D8C08A] text-[#0B0A09] font-bold text-sm uppercase tracking-widest shadow-[0_0_25px_rgba(201,162,39,0.5)] hover:shadow-[0_0_35px_rgba(201,162,39,0.8)] transition-all flex items-center justify-center gap-2 transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer group"
              >
                <span>ЗАБРОНИРОВАТЬ ЭТОТ БАНКЕТ</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-[#D8C08A]/70">
                <ShieldCheck className="w-4 h-4 text-[#C9A227]" />
                <span>Данные автоматически перенесутся в форму бронирования</span>
              </div>

              {/* Verified Examples Reference Tooltip bar */}
              <div className="mt-6 pt-4 border-t border-[#C9A227]/20 text-[11px] text-[#D8C08A]/60 space-y-1">
                <div className="font-medium text-[#D8C08A]">Примеры расчетов:</div>
                <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 font-mono text-[10px]">
                  <span>• 50 × 8 000 = 400 000 ₸</span>
                  <span>• 100 × 15 000 = 1 500 000 ₸</span>
                  <span>• 150 × 18 000 = 2 700 000 ₸</span>
                  <span>• 200 × 23 000 = 4 600 000 ₸</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
