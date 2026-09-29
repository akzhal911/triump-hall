import React, { useState, useEffect } from 'react';
import { Calendar, Phone, Mail, Clock, Users, Utensils, MessageSquare, Send, Sparkles, ShieldCheck, Check } from 'lucide-react';
import { MENUS_DATA, EVENTS_DATA } from '../data/triumphData';
import { CalculationResult } from './CalculatorSection';

interface BookingSectionProps {
  incomingCalcData: CalculationResult | null;
  onBookingSuccess: (bookingRecord: any) => void;
}

export const BookingSection: React.FC<BookingSectionProps> = ({
  incomingCalcData,
  onBookingSuccess,
}) => {
  // Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('18:00');
  const [guestCount, setGuestCount] = useState<number>(100);
  const [eventType, setEventType] = useState('Свадьба (Үйлену той)');
  const [selectedMenuId, setSelectedMenuId] = useState('menu-18000');
  const [selectedServices, setSelectedServices] = useState<string[]>([
    'LED-экран сверхвысокого разрешения',
    'Музыкальная звуковая аппаратура и радиомикрофоны'
  ]);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Synchronize when coming from the calculator
  useEffect(() => {
    if (incomingCalcData) {
      setSelectedMenuId(incomingCalcData.selectedMenu.id);
      setGuestCount(incomingCalcData.guestCount);
      if (incomingCalcData.additionalServices.length > 0) {
        setSelectedServices(incomingCalcData.additionalServices);
      }
    }
  }, [incomingCalcData]);

  const activeMenu = MENUS_DATA.find((m) => m.id === selectedMenuId) || MENUS_DATA[3];
  const calculatedMenuCost = guestCount * activeMenu.price;
  const calculatedTotal = calculatedMenuCost;

  const availableServices = [
    'LED-экран сверхвысокого разрешения',
    'Музыкальная звуковая аппаратура и радиомикрофоны',
    'Декор зала и флористика столов',
    'Профессиональный фотограф / видеограф',
    'Праздничный ведущий / Тамада с программой',
    'DJ со световым сопровождением',
    'Дизайнерская тематическая фотозона'
  ];

  const handleToggleService = (srv: string) => {
    if (selectedServices.includes(srv)) {
      setSelectedServices(selectedServices.filter((s) => s !== srv));
    } else {
      setSelectedServices([...selectedServices, srv]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!name.trim()) {
      setErrorMessage('Пожалуйста, укажите ваше имя.');
      return;
    }
    if (!phone.trim() || phone.trim().length < 6) {
      setErrorMessage('Пожалуйста, укажите корректный контактный номер телефона.');
      return;
    }

    setIsSubmitting(true);

    const bookingRecord = {
      id: 'BK-' + Date.now(),
      createdAt: new Date().toISOString(),
      name,
      phone,
      email,
      date,
      time,
      guestCount,
      eventType,
      menuId: selectedMenuId,
      menuName: `${activeMenu.name} (${activeMenu.price.toLocaleString('ru-RU')} ₸)`,
      menuCost: calculatedMenuCost,
      totalCost: calculatedTotal,
      services: selectedServices,
      comment,
    };

    // Save to localStorage for client-side persistence
    try {
      const existingStr = localStorage.getItem('triumph_hall_bookings');
      const existingList = existingStr ? JSON.parse(existingStr) : [];
      existingList.unshift(bookingRecord);
      localStorage.setItem('triumph_hall_bookings', JSON.stringify(existingList));
    } catch (err) {
      console.warn('LocalStorage save error:', err);
    }

    setTimeout(() => {
      setIsSubmitting(false);
      onBookingSuccess(bookingRecord);
    }, 600);
  };

  return (
    <section id="booking" className="py-20 lg:py-28 bg-[#0B0A09] text-[#F7F1E3] relative overflow-hidden">
      {/* Background glow and subtle luxury patterns */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-[#C9A227]/5 rounded-full blur-[180px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full border border-[#C9A227]/40 bg-[#171513] mb-4">
            <Calendar className="w-3.5 h-3.5 text-[#C9A227]" />
            <span className="text-xs uppercase tracking-widest text-[#D8C08A] font-semibold">
              Онлайн бронирование
            </span>
            <Calendar className="w-3.5 h-3.5 text-[#C9A227]" />
          </div>
          <h2 className="font-cinzel text-3xl sm:text-4xl lg:text-5xl font-bold tracking-wide text-[#F7F1E3] mb-3">
            ЗАБРОНИРУЙТЕ <span className="text-gradient-gold">TRIUMPH HALL</span>
          </h2>
          <p className="text-base sm:text-lg text-[#D8C08A] font-cormorant italic">
            «Закрепите желанную дату для вашего грандиозного торжества прямо сейчас»
          </p>
          <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-[#C9A227] to-transparent mx-auto mt-4" />
        </div>

        {/* 2-Column Booking Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Main Booking Form (7 Cols) */}
          <div className="lg:col-span-7 bg-[#171513] p-6 sm:p-10 rounded-sm border border-[#C9A227]/40 shadow-2xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              {errorMessage && (
                <div className="p-3.5 rounded bg-red-950/60 border border-red-500/50 text-red-200 text-xs">
                  {errorMessage}
                </div>
              )}

              {/* Personal Info Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#D8C08A] mb-1.5">
                    Ваше имя <span className="text-[#C9A227]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Айбек или Гульнара"
                    className="w-full px-4 py-3 bg-[#0B0A09] border border-[#C9A227]/30 rounded-sm text-sm text-[#F7F1E3] placeholder-[#F7F1E3]/30 focus:outline-none focus:border-[#C9A227] focus:ring-1 focus:ring-[#C9A227]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#D8C08A] mb-1.5">
                    Контактный телефон <span className="text-[#C9A227]">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+7 (7XX) XXX-XX-XX"
                    className="w-full px-4 py-3 bg-[#0B0A09] border border-[#C9A227]/30 rounded-sm text-sm text-[#F7F1E3] placeholder-[#F7F1E3]/30 focus:outline-none focus:border-[#C9A227] focus:ring-1 focus:ring-[#C9A227]"
                  />
                </div>
              </div>

              {/* Email & Event Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#D8C08A] mb-1.5">
                    Электронная почта
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="example@mail.kz"
                    className="w-full px-4 py-3 bg-[#0B0A09] border border-[#C9A227]/30 rounded-sm text-sm text-[#F7F1E3] placeholder-[#F7F1E3]/30 focus:outline-none focus:border-[#C9A227] focus:ring-1 focus:ring-[#C9A227]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#D8C08A] mb-1.5">
                    Тип мероприятия
                  </label>
                  <select
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value)}
                    className="w-full px-4 py-3 bg-[#0B0A09] border border-[#C9A227]/30 rounded-sm text-sm text-[#F7F1E3] focus:outline-none focus:border-[#C9A227] focus:ring-1 focus:ring-[#C9A227]"
                  >
                    <option value="Свадьба (Үйлену той)">Свадьба (Үйлену той)</option>
                    <option value="Проводы невесты (Ұзату той)">Проводы невесты (Ұзату той)</option>
                    <option value="Юбилей (Мерейтой)">Юбилей (Мерейтой)</option>
                    <option value="Корпоратив">Корпоратив</option>
                    <option value="День рождения / Тұсаукесер">День рождения / Тұсаукесер</option>
                    <option value="Садақа мәзірі">Садақа мәзірі</option>
                    <option value="Семинар / Тренинг">Семинар / Тренинг</option>
                    <option value="Конференция / Форум">Конференция / Форум</option>
                    <option value="Презентация бренда">Презентация бренда</option>
                  </select>
                </div>
              </div>

              {/* Date, Time, Guests */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#D8C08A] mb-1.5">
                    Дата события
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-3 bg-[#0B0A09] border border-[#C9A227]/30 rounded-sm text-sm text-[#F7F1E3] focus:outline-none focus:border-[#C9A227]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#D8C08A] mb-1.5">
                    Время начала
                  </label>
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full px-3 py-3 bg-[#0B0A09] border border-[#C9A227]/30 rounded-sm text-sm text-[#F7F1E3] focus:outline-none focus:border-[#C9A227]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#D8C08A] mb-1.5">
                    Гостей (1–450)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={450}
                    value={guestCount}
                    onChange={(e) => setGuestCount(Math.max(1, Math.min(450, parseInt(e.target.value, 10) || 1)))}
                    className="w-full px-3 py-3 bg-[#0B0A09] border border-[#C9A227]/30 rounded-sm text-sm text-[#F7F1E3] font-bold text-center focus:outline-none focus:border-[#C9A227]"
                  />
                </div>
              </div>

              {/* Selected Menu Dropdown */}
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#D8C08A] mb-1.5">
                  Выбранный вариант меню
                </label>
                <select
                  value={selectedMenuId}
                  onChange={(e) => setSelectedMenuId(e.target.value)}
                  className="w-full px-4 py-3 bg-[#0B0A09] border border-[#C9A227]/30 rounded-sm text-sm text-[#F0D98A] font-semibold focus:outline-none focus:border-[#C9A227]"
                >
                  {MENUS_DATA.map((menu) => (
                    <option key={menu.id} value={menu.id}>
                      {menu.name} — {menu.price.toLocaleString('ru-RU')} ₸ / чел
                    </option>
                  ))}
                </select>
              </div>

              {/* Additional Services Checklist */}
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#D8C08A] mb-2">
                  Дополнительные услуги
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {availableServices.map((srv, idx) => {
                    const checked = selectedServices.includes(srv);
                    return (
                      <label
                        key={idx}
                        onClick={() => handleToggleService(srv)}
                        className={`flex items-center gap-2.5 p-2 rounded border cursor-pointer transition-colors ${
                          checked
                            ? 'bg-[#0B0A09] border-[#C9A227] text-[#F7F1E3]'
                            : 'bg-[#0B0A09]/40 border-[#C9A227]/20 text-[#D8C08A]/75'
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded flex items-center justify-center border ${
                            checked ? 'bg-[#C9A227] border-[#C9A227] text-[#0B0A09]' : 'border-[#C9A227]/40'
                          }`}
                        >
                          {checked && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <span className="truncate">{srv}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Comment */}
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#D8C08A] mb-1.5">
                  Особые пожелания или комментарий
                </label>
                <textarea
                  rows={3}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Укажите пожелания по рассадке столов, таймингу или специальным блюдам..."
                  className="w-full px-4 py-3 bg-[#0B0A09] border border-[#C9A227]/30 rounded-sm text-sm text-[#F7F1E3] placeholder-[#F7F1E3]/30 focus:outline-none focus:border-[#C9A227]"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 px-6 rounded-sm bg-gradient-to-r from-[#9A7617] via-[#C9A227] to-[#D8C08A] text-[#0B0A09] font-bold text-sm uppercase tracking-widest shadow-[0_0_25px_rgba(201,162,39,0.5)] hover:shadow-[0_0_35px_rgba(201,162,39,0.8)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span className="animate-pulse">ОТПРАВКА ЗАЯВКИ...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>ОТПРАВИТЬ ЗАЯВКУ</span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-[#D8C08A]/70 text-center">
                <ShieldCheck className="w-4 h-4 text-[#C9A227] flex-shrink-0" />
                <span>Отправка заявки не обязывает к оплате — менеджер перезвонит для согласования</span>
              </div>
            </form>
          </div>

          {/* Right Live Info Box (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Auto Transfer Banner */}
            {incomingCalcData && (
              <div className="p-4 rounded-sm bg-[#C9A227]/10 border border-[#C9A227] text-xs text-[#D8C08A] flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-[#C9A227] flex-shrink-0" />
                <div>
                  <strong className="text-[#F7F1E3] block">Данные перенесены из калькулятора</strong>
                  Меню: {activeMenu.name}, гостей: {guestCount}.
                </div>
              </div>
            )}

            {/* Calculated Order Summary Card */}
            <div className="p-6 rounded-sm bg-[#171513] border border-[#C9A227]/40 shadow-xl">
              <h4 className="font-cinzel text-lg font-bold text-[#F7F1E3] mb-4 pb-2 border-b border-[#C9A227]/20">
                ПРЕДВАРИТЕЛЬНЫЙ РАСЧЁТ
              </h4>

              <div className="space-y-3 text-xs sm:text-sm">
                <div className="flex justify-between">
                  <span className="text-[#D8C08A]/75">Выбранное меню:</span>
                  <span className="font-semibold text-[#F7F1E3] text-right">{activeMenu.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#D8C08A]/75">Тариф меню:</span>
                  <span className="font-semibold text-[#F0D98A]">{activeMenu.price.toLocaleString('ru-RU')} ₸ / чел</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#D8C08A]/75">Количество гостей:</span>
                  <span className="font-semibold text-[#F7F1E3]">{guestCount} персон</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#D8C08A]/75">Стоимость меню:</span>
                  <span className="font-semibold text-[#F0D98A]">{calculatedMenuCost.toLocaleString('ru-RU')} ₸</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#D8C08A]/75">Доп. опций выбрано:</span>
                  <span className="font-semibold text-[#F7F1E3]">{selectedServices.length}</span>
                </div>

                <div className="pt-3 border-t border-[#C9A227]/30 flex justify-between items-baseline">
                  <span className="font-cinzel text-xs uppercase tracking-wider font-bold text-[#D8C08A]">
                    Итоговая сумма:
                  </span>
                  <span className="font-cinzel text-2xl font-bold text-gradient-gold">
                    {calculatedTotal.toLocaleString('ru-RU')} ₸
                  </span>
                </div>
              </div>
            </div>

            {/* Manager Direct Contacts Box */}
            <div className="p-6 rounded-sm bg-[#171513] border border-[#C9A227]/30">
              <h4 className="font-cinzel text-base font-bold text-[#F7F1E3] mb-2">
                Нужна срочная консультация?
              </h4>
              <p className="text-xs text-[#D8C08A]/80 leading-relaxed mb-4">
                Свяжитесь напрямую с администратором банкетного зала TRIUMPH HALL в Атырау:
              </p>
              <div className="space-y-2 text-xs">
                <a href="tel:+77755309505" className="flex items-center gap-2 text-[#F7F1E3] hover:text-[#C9A227] font-semibold">
                  <Phone className="w-3.5 h-3.5 text-[#C9A227]" />
                  <span>8 775 530 95 05</span>
                </a>
                <a href="tel:+77753020810" className="flex items-center gap-2 text-[#F7F1E3] hover:text-[#C9A227] font-semibold">
                  <Phone className="w-3.5 h-3.5 text-[#C9A227]" />
                  <span>8 775 302 08 10</span>
                </a>
                <a href="tel:+77015480850" className="flex items-center gap-2 text-[#F7F1E3] hover:text-[#C9A227] font-semibold">
                  <Phone className="w-3.5 h-3.5 text-[#C9A227]" />
                  <span>8 701 548 08 50</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
