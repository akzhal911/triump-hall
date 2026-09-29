import React from 'react';
import { CheckCircle, Calendar, Phone, Sparkles, X, User } from 'lucide-react';

interface SuccessModalProps {
  isOpen: boolean;
  bookingData: any;
  onClose: () => void;
}

export const SuccessModal: React.FC<SuccessModalProps> = ({ isOpen, bookingData, onClose }) => {
  if (!isOpen || !bookingData) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B0A09]/90 backdrop-blur-md animate-in fade-in duration-300">
      <div 
        className="relative w-full max-w-lg bg-[#171513] text-[#F7F1E3] rounded-sm border-2 border-[#C9A227] shadow-[0_0_60px_rgba(201,162,39,0.4)] p-6 sm:p-8 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-[#D8C08A] hover:text-white border border-[#C9A227]/30 hover:border-[#C9A227] transition-all cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Success Icon */}
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#9A7617] to-[#C9A227] mx-auto flex items-center justify-center shadow-[0_0_25px_rgba(201,162,39,0.6)] mb-5 text-[#0B0A09]">
          <CheckCircle className="w-9 h-9 stroke-[2.5]" />
        </div>

        {/* Title */}
        <h3 className="font-cinzel text-2xl sm:text-3xl font-bold tracking-wider text-[#F7F1E3] mb-2">
          ЗАЯВКА <span className="text-gradient-gold">ПРИНЯТА</span>
        </h3>

        <p className="text-sm sm:text-base text-[#D8C08A] font-cormorant italic mb-6">
          «Спасибо! Менеджер TRIUMPH HALL свяжется с вами для подтверждения деталей.»
        </p>

        {/* Reservation summary card */}
        <div className="bg-[#0B0A09]/80 rounded p-4 border border-[#C9A227]/30 text-left text-xs sm:text-sm space-y-2 mb-6">
          <div className="flex justify-between border-b border-[#C9A227]/20 pb-1.5">
            <span className="text-[#D8C08A]/70">Заявитель:</span>
            <span className="font-semibold text-[#F7F1E3]">{bookingData.name}</span>
          </div>
          <div className="flex justify-between border-b border-[#C9A227]/20 pb-1.5">
            <span className="text-[#D8C08A]/70">Телефон:</span>
            <span className="font-semibold text-[#F7F1E3]">{bookingData.phone}</span>
          </div>
          <div className="flex justify-between border-b border-[#C9A227]/20 pb-1.5">
            <span className="text-[#D8C08A]/70">Формат события:</span>
            <span className="font-semibold text-[#F7F1E3]">{bookingData.eventType}</span>
          </div>
          <div className="flex justify-between border-b border-[#C9A227]/20 pb-1.5">
            <span className="text-[#D8C08A]/70">Дата и время:</span>
            <span className="font-semibold text-[#F7F1E3]">{bookingData.date || 'Уточняется'} ({bookingData.time || 'Вечер'})</span>
          </div>
          <div className="flex justify-between border-b border-[#C9A227]/20 pb-1.5">
            <span className="text-[#D8C08A]/70">Количество гостей:</span>
            <span className="font-semibold text-[#F7F1E3]">{bookingData.guestCount} персон</span>
          </div>
          <div className="flex justify-between border-b border-[#C9A227]/20 pb-1.5">
            <span className="text-[#D8C08A]/70">Выбранное меню:</span>
            <span className="font-semibold text-[#F0D98A]">{bookingData.menuName}</span>
          </div>
          <div className="flex justify-between pt-1">
            <span className="text-[#D8C08A] font-bold">Ориентировочная сумма:</span>
            <span className="font-cinzel text-base font-bold text-gradient-gold">
              {Number(bookingData.totalCost).toLocaleString('ru-RU')} ₸
            </span>
          </div>
        </div>

        {/* CTA Button */}
        <button
          onClick={onClose}
          className="w-full py-3.5 px-6 rounded-sm bg-gradient-to-r from-[#9A7617] via-[#C9A227] to-[#D8C08A] text-[#0B0A09] font-bold text-xs uppercase tracking-widest shadow-lg hover:shadow-[0_0_30px_rgba(201,162,39,0.5)] transition-all cursor-pointer"
        >
          ОТЛИЧНО, ЗАКРЫТЬ
        </button>
      </div>
    </div>
  );
};
