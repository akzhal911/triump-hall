import React, { useState } from 'react';
import { Phone, MapPin, Instagram, MessageCircle, Heart, Shield, FileText, X } from 'lucide-react';
import { CONTACT_INFO } from '../data/triumphData';

export const Footer: React.FC = () => {
  const [legalModalTitle, setLegalModalTitle] = useState<string | null>(null);

  const navLinks = [
    { label: 'Главная', href: '#hero' },
    { label: 'О нас', href: '#about' },
    { label: 'Меню', href: '#menu' },
    { label: 'Банкет', href: '#banquets' },
    { label: 'Залы', href: '#hall' },
    { label: 'Услуги', href: '#services' },
    { label: 'Галерея', href: '#gallery' },
    { label: 'Калькулятор', href: '#calculator' },
    { label: 'FAQ', href: '#faq' },
    { label: 'Контакты', href: '#contacts' },
  ];

  const handleLinkClick = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <footer className="bg-[#0B0A09] text-[#F7F1E3] border-t-2 border-[#C9A227] pt-16 pb-12 relative overflow-hidden">
        {/* Subtle background golden aura */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#C9A227]/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-[#C9A227]/20">
            {/* Column 1: Brand & Slogans */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full border border-[#C9A227] flex items-center justify-center bg-[#171513]">
                  <span className="font-cinzel text-lg font-bold text-gradient-gold">T</span>
                </div>
                <div>
                  <h3 className="font-cinzel text-xl font-bold text-[#F7F1E3] tracking-wider">
                    TRIUMPH <span className="text-[#C9A227]">HALL</span>
                  </h3>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[#D8C08A] block">
                    Банкетный зал в Атырау
                  </span>
                </div>
              </div>

              <p className="font-cinzel text-sm text-[#F7F1E3] font-semibold">
                «ВАШЕ СОБЫТИЕ. НАШ ТРИУМФ.»
              </p>
              <p className="text-xs text-[#D8C08A]/75 font-cormorant italic">
                «Для вашего торжества, для вашего праздника.»
              </p>
              <p className="text-xs text-[#F7F1E3]/70 leading-relaxed">
                Премиальное банкетное пространство в Атырау для проведения свадебных тоев, юбилеев, форумов и частных торжеств на 256–450 персон.
              </p>
            </div>

            {/* Column 2: Navigation Links */}
            <div>
              <h4 className="font-cinzel text-sm font-bold text-[#D8C08A] uppercase tracking-wider mb-4">
                Навигация
              </h4>
              <ul className="grid grid-cols-2 gap-2 text-xs">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      onClick={(e) => {
                        e.preventDefault();
                        handleLinkClick(link.href);
                      }}
                      className="text-[#F7F1E3]/80 hover:text-[#C9A227] transition-colors py-1 block"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Contact details */}
            <div>
              <h4 className="font-cinzel text-sm font-bold text-[#D8C08A] uppercase tracking-wider mb-4">
                Контакты
              </h4>
              <ul className="space-y-2.5 text-xs text-[#F7F1E3]/85">
                <li className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-[#C9A227] flex-shrink-0 mt-0.5" />
                  <span>г. Атырау, пр. Султан Бейбарыс, 526</span>
                </li>
                {CONTACT_INFO.phones.map((p, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-[#C9A227] flex-shrink-0" />
                    <a href={`tel:${p.raw}`} className="hover:text-[#C9A227]">
                      {p.display}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 4: Hours & Socials */}
            <div>
              <h4 className="font-cinzel text-sm font-bold text-[#D8C08A] uppercase tracking-wider mb-4">
                Режим работы
              </h4>
              <div className="space-y-2 text-xs text-[#F7F1E3]/80 mb-6">
                <div>
                  <span className="text-[#D8C08A] block font-medium">Будние дни:</span>
                  <span>10:00 – 24:00</span>
                </div>
                <div>
                  <span className="text-[#D8C08A] block font-medium">Пт, сб, вс:</span>
                  <span>09:00 – 03:00</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <a
                  href={CONTACT_INFO.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-sm bg-[#171513] border border-[#C9A227]/40 hover:border-[#C9A227] flex items-center justify-center text-[#25D366] hover:bg-[#25D366]/10 transition-colors"
                  aria-label="WhatsApp"
                >
                  <MessageCircle className="w-4 h-4" />
                </a>
                <a
                  href={CONTACT_INFO.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-sm bg-[#171513] border border-[#C9A227]/40 hover:border-[#C9A227] flex items-center justify-center text-[#E1306C] hover:bg-[#E1306C]/10 transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Copyright & Legal Links */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#D8C08A]/70 gap-4">
            <div>
              © 2026 TRIUMPH HALL. Все права защищены.
            </div>

            <div className="flex items-center space-x-6">
              <button
                onClick={() => setLegalModalTitle('Политика конфиденциальности')}
                className="hover:text-[#C9A227] transition-colors cursor-pointer"
              >
                Политика конфиденциальности
              </button>
              <span>|</span>
              <button
                onClick={() => setLegalModalTitle('Условия использования')}
                className="hover:text-[#C9A227] transition-colors cursor-pointer"
              >
                Условия использования
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Legal terms modal */}
      {legalModalTitle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B0A09]/90 backdrop-blur-md">
          <div className="relative w-full max-w-xl bg-[#171513] text-[#F7F1E3] rounded-sm border border-[#C9A227] p-6 shadow-2xl">
            <button
              onClick={() => setLegalModalTitle(null)}
              className="absolute top-4 right-4 p-1.5 text-[#D8C08A] hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-cinzel text-xl font-bold text-[#F7F1E3] mb-4">
              {legalModalTitle}
            </h3>
            <div className="text-xs text-[#F7F1E3]/80 space-y-3 leading-relaxed max-h-72 overflow-y-auto pr-2">
              <p>
                Банкетный зал TRIUMPH HALL гарантирует конфиденциальность предоставленных контактных данных (имя, номер телефона, дата события) и обязуется использовать их исключительно для согласования деталей бронирования и проведения вашего торжества.
              </p>
              <p>
                Бронирование даты закрепляется за заказчиком после согласования условий и заключения официального договора с администрацией TRIUMPH HALL в Атырау.
              </p>
            </div>
            <button
              onClick={() => setLegalModalTitle(null)}
              className="mt-6 w-full py-2.5 rounded bg-gradient-to-r from-[#9A7617] to-[#C9A227] text-[#0B0A09] font-bold text-xs uppercase"
            >
              Понятно
            </button>
          </div>
        </div>
      )}
    </>
  );
};
