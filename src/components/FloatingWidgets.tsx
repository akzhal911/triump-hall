import React, { useState, useEffect } from 'react';
import { ArrowUp, MessageCircle, Phone, CalendarCheck, X, Trash2 } from 'lucide-react';
import { CONTACT_INFO } from '../data/triumphData';

interface FloatingWidgetsProps {
  onOpenBooking: () => void;
}

export const FloatingWidgets: React.FC<FloatingWidgetsProps> = ({ onOpenBooking }) => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showBookingsModal, setShowBookingsModal] = useState(false);
  const [storedBookings, setStoredBookings] = useState<any[]>([]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenBookings = () => {
    try {
      const raw = localStorage.getItem('triumph_hall_bookings');
      setStoredBookings(raw ? JSON.parse(raw) : []);
    } catch {
      setStoredBookings([]);
    }
    setShowBookingsModal(true);
  };

  const handleClearBookings = () => {
    localStorage.removeItem('triumph_hall_bookings');
    setStoredBookings([]);
  };

  return (
    <>
      {/* Left Bottom Corner: Quick WhatsApp and Bookings History */}
      <div className="fixed bottom-6 left-6 z-40 flex items-center gap-3">
        {/* WhatsApp Direct Chat Button */}
        <a
          href={CONTACT_INFO.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="w-12 h-12 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-[0_4px_20px_rgba(37,211,102,0.4)] hover:shadow-[0_4px_25px_rgba(37,211,102,0.7)] transition-all transform hover:scale-110"
          title="Написать в WhatsApp"
          aria-label="Chat on WhatsApp"
        >
          <MessageCircle className="w-6 h-6" />
        </a>

        {/* Bookings Storage History Button */}
        <button
          onClick={handleOpenBookings}
          className="w-11 h-11 rounded-full bg-[#171513] text-[#D8C08A] hover:text-white border border-[#C9A227]/50 hover:border-[#C9A227] flex items-center justify-center shadow-lg transition-all transform hover:scale-105 cursor-pointer relative"
          title="История заявок (localStorage)"
          aria-label="View local bookings"
        >
          <CalendarCheck className="w-5 h-5 text-[#C9A227]" />
        </button>
      </div>

      {/* Back to top button positioned neatly above bottom-right */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-24 right-6 z-40 w-10 h-10 rounded-full bg-[#0B0A09]/90 text-[#D8C08A] hover:text-white border border-[#C9A227]/60 hover:border-[#C9A227] flex items-center justify-center shadow-xl transition-all transform hover:-translate-y-1 cursor-pointer"
          aria-label="Back to top"
          title="Наверх"
        >
          <ArrowUp className="w-4 h-4 text-[#C9A227]" />
        </button>
      )}

      {/* Bookings Modal Drawer */}
      {showBookingsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B0A09]/90 backdrop-blur-md">
          <div className="relative w-full max-w-2xl bg-[#171513] text-[#F7F1E3] rounded-sm border-2 border-[#C9A227] p-6 shadow-2xl max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-[#C9A227]/30">
              <div>
                <h3 className="font-cinzel text-xl font-bold text-[#F7F1E3]">
                  СОХРАНЁННЫЕ ЗАЯВКИ
                </h3>
                <span className="text-xs text-[#D8C08A]/75">
                  Демонстрационное хранилище заявок (localStorage)
                </span>
              </div>
              <button
                onClick={() => setShowBookingsModal(false)}
                className="p-1.5 text-[#D8C08A] hover:text-white rounded border border-[#C9A227]/40"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto my-4 space-y-3 pr-2">
              {storedBookings.length === 0 ? (
                <div className="text-center py-10 text-xs text-[#D8C08A]/70">
                  Пока нет оформленных заявок. Отправьте тестовую заявку через форму калькулятора или бронирования!
                </div>
              ) : (
                storedBookings.map((b) => (
                  <div
                    key={b.id}
                    className="p-4 rounded bg-[#0B0A09] border border-[#C9A227]/30 text-xs space-y-1.5"
                  >
                    <div className="flex justify-between items-center text-[#D8C08A] font-semibold">
                      <span>№ {b.id}</span>
                      <span className="text-[10px] text-[#F7F1E3]/60">{new Date(b.createdAt).toLocaleString('ru-RU')}</span>
                    </div>
                    <div className="text-sm font-bold text-[#F7F1E3]">
                      {b.name} — <a href={`tel:${b.phone}`} className="text-[#C9A227] hover:underline">{b.phone}</a>
                    </div>
                    <div className="text-[#F7F1E3]/80">
                      Событие: <span className="text-[#D8C08A]">{b.eventType}</span> | Дата: {b.date || 'Уточняется'} {b.time}
                    </div>
                    <div className="text-[#F7F1E3]/80">
                      Меню: <span className="text-[#F0D98A]">{b.menuName}</span> | Гостей: {b.guestCount}
                    </div>
                    <div className="font-cinzel font-bold text-[#F0D98A] text-sm pt-1">
                      Итого: {Number(b.totalCost).toLocaleString('ru-RU')} ₸
                    </div>
                    {b.services && b.services.length > 0 && (
                      <div className="text-[11px] text-[#D8C08A]/70">
                        Опции: {b.services.join(', ')}
                      </div>
                    )}
                    {b.comment && (
                      <div className="text-[11px] text-[#F7F1E3]/60 italic">
                        «{b.comment}»
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            <div className="pt-3 border-t border-[#C9A227]/30 flex justify-between items-center">
              {storedBookings.length > 0 && (
                <button
                  onClick={handleClearBookings}
                  className="px-3 py-1.5 rounded text-xs text-red-300 hover:text-red-100 flex items-center gap-1 hover:bg-red-950/40 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Очистить список</span>
                </button>
              )}
              <button
                onClick={() => setShowBookingsModal(false)}
                className="ml-auto px-5 py-2 rounded bg-[#C9A227] text-[#0B0A09] font-bold text-xs uppercase cursor-pointer"
              >
                Закрыть
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
