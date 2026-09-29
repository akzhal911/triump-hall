import React, { useState, useEffect } from 'react';
import { Phone, Menu, X, Calendar, Sparkles, MessageCircle, MapPin } from 'lucide-react';
import { CONTACT_INFO } from '../data/triumphData';

interface NavbarProps {
  onOpenBooking: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenBooking }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Top micro announcement bar */}
      <div className="bg-[#171513] text-[#D8C08A] text-xs py-1.5 px-4 border-b border-[#C9A227]/20 hidden md:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center tracking-wide">
          <div className="flex items-center space-x-6">
            <span className="flex items-center gap-1.5 text-[#F7F1E3]/80">
              <MapPin className="w-3.5 h-3.5 text-[#C9A227]" />
              г. Атырау, пр. Султан Бейбарыс, 526
            </span>
            <span className="text-[#C9A227]/40">|</span>
            <span className="text-[#F7F1E3]/80">Банкетный зал на 256–450 гостей</span>
          </div>
          <div className="flex items-center space-x-5">
            <a 
              href="tel:+77755309505" 
              className="hover:text-[#F0D98A] transition-colors flex items-center gap-1"
            >
              <Phone className="w-3.5 h-3.5 text-[#C9A227]" />
              8 775 530 95 05
            </a>
            <a 
              href={CONTACT_INFO.whatsapp} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-[#25D366] hover:underline flex items-center gap-1 font-medium"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              WhatsApp
            </a>
          </div>
        </div>
      </div>

      {/* Main sticky header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#0B0A09]/95 backdrop-blur-md py-3 shadow-[0_4px_30px_rgba(0,0,0,0.8)] border-b border-[#C9A227]/30'
            : 'bg-gradient-to-b from-[#0B0A09]/90 to-transparent py-5 md:top-7'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo */}
          <a
            href="#hero"
            onClick={(e) => {
              e.preventDefault();
              handleLinkClick('#hero');
            }}
            className="group flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-full border border-[#C9A227] flex items-center justify-center bg-gradient-to-br from-[#171513] to-[#0B0A09] shadow-[0_0_15px_rgba(201,162,39,0.3)] group-hover:border-[#F0D98A] transition-all">
              <span className="font-cinzel text-lg font-bold text-gradient-gold">T</span>
            </div>
            <div className="flex flex-col">
              <span className="font-cinzel text-xl sm:text-2xl font-bold tracking-widest text-[#F7F1E3] group-hover:text-[#D8C08A] transition-colors">
                TRIUMPH <span className="text-[#C9A227]">HALL</span>
              </span>
              <span className="text-[10px] tracking-[0.25em] text-[#D8C08A]/80 uppercase -mt-0.5">
                Банкетный зал в Атырау
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center space-x-5 text-sm font-medium">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick(link.href);
                }}
                className="text-[#F7F1E3]/85 hover:text-[#C9A227] transition-colors relative py-1 text-xs tracking-wider uppercase font-montserrat hover:after:w-full after:w-0 after:h-[2px] after:bg-[#C9A227] after:absolute after:bottom-0 after:left-0 after:transition-all after:duration-300"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right Action buttons */}
          <div className="hidden lg:flex items-center space-x-4">
            <a
              href="tel:+77755309505"
              className="flex items-center gap-2 text-xs text-[#D8C08A] hover:text-white px-3 py-2 border border-[#C9A227]/40 rounded-sm hover:border-[#C9A227] transition-all"
            >
              <Phone className="w-3.5 h-3.5 text-[#C9A227]" />
              <span className="font-semibold tracking-wider">8 775 530 95 05</span>
            </a>

            <button
              onClick={onOpenBooking}
              className="relative group overflow-hidden px-5 py-2.5 rounded-sm bg-gradient-to-r from-[#9A7617] via-[#C9A227] to-[#D8C08A] text-[#0B0A09] font-bold text-xs uppercase tracking-widest shadow-[0_0_20px_rgba(201,162,39,0.4)] hover:shadow-[0_0_30px_rgba(201,162,39,0.7)] transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <span className="relative z-10 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                ЗАБРОНИРОВАТЬ
              </span>
              <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            </button>
          </div>

          {/* Mobile hamburger button */}
          <div className="flex items-center gap-3 xl:hidden">
            <button
              onClick={onOpenBooking}
              className="px-3 py-1.5 rounded-sm bg-gradient-to-r from-[#9A7617] to-[#C9A227] text-[#0B0A09] font-bold text-[11px] uppercase tracking-wider"
            >
              БРОНЬ
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#D8C08A] hover:text-white rounded-md border border-[#C9A227]/30 hover:border-[#C9A227] transition-all focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile slide-down menu */}
        {mobileMenuOpen && (
          <div className="xl:hidden bg-[#0B0A09]/98 border-b border-[#C9A227]/30 backdrop-blur-xl px-6 py-6 transition-all duration-300 shadow-2xl">
            <div className="flex flex-col space-y-3 pb-6 border-b border-[#C9A227]/20">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleLinkClick(link.href);
                  }}
                  className="text-base text-[#F7F1E3] hover:text-[#C9A227] py-2 border-b border-[#171513] font-medium flex items-center justify-between"
                >
                  <span>{link.label}</span>
                  <span className="text-[#C9A227]/40 text-xs">→</span>
                </a>
              ))}
            </div>

            <div className="pt-5 flex flex-col gap-3">
              <div className="text-xs text-[#D8C08A] flex flex-col gap-1">
                <span className="font-semibold text-[#F7F1E3]">Телефоны для бронирования:</span>
                <a href="tel:+77755309505" className="hover:text-[#C9A227]">8 775 530 95 05</a>
                <a href="tel:+77753020810" className="hover:text-[#C9A227]">8 775 302 08 10</a>
                <a href="tel:+77015480850" className="hover:text-[#C9A227]">8 701 548 08 50</a>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <a
                  href={CONTACT_INFO.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 px-4 rounded text-center text-xs font-semibold bg-[#25D366]/20 border border-[#25D366]/40 text-[#25D366] flex items-center justify-center gap-1.5"
                >
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp
                </a>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenBooking();
                  }}
                  className="py-2.5 px-4 rounded text-center text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-[#9A7617] to-[#C9A227] text-[#0B0A09] flex items-center justify-center gap-1.5"
                >
                  <Calendar className="w-4 h-4" />
                  Забронировать
                </button>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
