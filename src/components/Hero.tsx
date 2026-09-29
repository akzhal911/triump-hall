import React from 'react';
import { Calendar, UtensilsCrossed, ChevronDown, Sparkles, Tv, Users, Award, MapPin } from 'lucide-react';

interface HeroProps {
  onOpenBooking: () => void;
  onExploreMenu: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenBooking, onExploreMenu }) => {
  return (
    <section id="hero" className="relative min-h-[100vh] flex flex-col justify-center items-center text-center pt-28 pb-16 px-4 overflow-hidden">
      {/* Background Image with Dark Vignette and Golden Ambiance */}
      <div className="absolute inset-0 z-0">
        <img
          src="/src/assets/images/hero_triumph_hall_1790604119182.jpg"
          alt="Интерьер банкетного зала Triumph Hall в Атырау"
          className="w-full h-full object-cover object-center scale-105 animate-[pulse_10s_ease-in-out_infinite]"
        />
        {/* Layered dark radial overlays to create cinematic depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0A09] via-[#0B0A09]/75 to-[#0B0A09]/80" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(11,10,9,0.85)_80%)]" />
        {/* Warm golden light shimmer */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#C9A227]/10 rounded-full blur-[120px] pointer-events-none" />
      </div>

      {/* Decorative Top Crest */}
      <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#C9A227]/40 bg-[#171513]/70 backdrop-blur-md mb-6 shadow-[0_0_15px_rgba(201,162,39,0.2)]">
          <Sparkles className="w-3.5 h-3.5 text-[#C9A227]" />
          <span className="text-xs uppercase tracking-[0.3em] text-[#D8C08A] font-medium">
            Банкетный зал в Атырау
          </span>
          <Sparkles className="w-3.5 h-3.5 text-[#C9A227]" />
        </div>

        {/* Brand Name */}
        <h1 className="font-cinzel text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-wider text-[#F7F1E3] mb-4 drop-shadow-[0_4px_25px_rgba(0,0,0,0.9)]">
          TRIUMPH <span className="text-gradient-gold">HALL</span>
        </h1>

        {/* Main Slogan */}
        <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-cinzel font-semibold tracking-wide text-[#F7F1E3] mb-4">
          «ВАШЕ СОБЫТИЕ. <span className="text-[#C9A227]">НАШ ТРИУМФ.»</span>
        </div>

        {/* Secondary Slogan & Description */}
        <p className="text-lg sm:text-xl font-cormorant italic text-[#D8C08A] mb-3">
          «Для вашего торжества, для вашего праздника.»
        </p>
        <p className="max-w-2xl text-sm sm:text-base text-[#F7F1E3]/85 font-montserrat leading-relaxed mb-10">
          Премиальный банкетный зал в Атырау для свадеб, торжеств, корпоративов и особенных событий. Безупречный сервис, высокая кухня и величественная атмосфера триумфа.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 w-full sm:w-auto mb-16">
          <button
            onClick={onOpenBooking}
            className="w-full sm:w-auto px-8 py-4 rounded-sm bg-gradient-to-r from-[#9A7617] via-[#C9A227] to-[#D8C08A] text-[#0B0A09] font-bold text-sm uppercase tracking-widest shadow-[0_0_30px_rgba(201,162,39,0.5)] hover:shadow-[0_0_45px_rgba(201,162,39,0.8)] transition-all transform hover:-translate-y-1 active:translate-y-0 flex items-center justify-center gap-2 group cursor-pointer"
          >
            <Calendar className="w-4 h-4 group-hover:rotate-12 transition-transform" />
            <span>ЗАБРОНИРОВАТЬ</span>
          </button>

          <button
            onClick={onExploreMenu}
            className="w-full sm:w-auto px-8 py-4 rounded-sm border border-[#C9A227] bg-[#171513]/60 backdrop-blur-md text-[#F7F1E3] hover:text-[#0B0A09] hover:bg-gradient-to-r hover:from-[#D8C08A] hover:to-[#C9A227] font-semibold text-sm uppercase tracking-widest shadow-lg transition-all transform hover:-translate-y-1 active:translate-y-0 flex items-center justify-center gap-2 cursor-pointer"
          >
            <UtensilsCrossed className="w-4 h-4 text-[#C9A227] group-hover:text-[#0B0A09]" />
            <span>ПОСМОТРЕТЬ МЕНЮ</span>
          </button>
        </div>

        {/* Key Metrics Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 w-full max-w-4xl">
          {/* Metric 1 */}
          <div className="p-4 rounded-sm bg-[#171513]/70 backdrop-blur-md border border-[#C9A227]/30 hover:border-[#C9A227] transition-all hover:bg-[#171513]/90 group">
            <div className="flex justify-center mb-2">
              <Users className="w-5 h-5 text-[#C9A227] group-hover:scale-110 transition-transform" />
            </div>
            <div className="font-cinzel text-xl sm:text-2xl font-bold text-gradient-gold">
              256–450
            </div>
            <div className="text-xs uppercase tracking-wider text-[#D8C08A]/80 font-medium mt-0.5">
              гостей
            </div>
          </div>

          {/* Metric 2 */}
          <div className="p-4 rounded-sm bg-[#171513]/70 backdrop-blur-md border border-[#C9A227]/30 hover:border-[#C9A227] transition-all hover:bg-[#171513]/90 group">
            <div className="flex justify-center mb-2">
              <Tv className="w-5 h-5 text-[#C9A227] group-hover:scale-110 transition-transform" />
            </div>
            <div className="font-cinzel text-xl sm:text-2xl font-bold text-gradient-gold">
              LED
            </div>
            <div className="text-xs uppercase tracking-wider text-[#D8C08A]/80 font-medium mt-0.5">
              экран
            </div>
          </div>

          {/* Metric 3 */}
          <div className="p-4 rounded-sm bg-[#171513]/70 backdrop-blur-md border border-[#C9A227]/30 hover:border-[#C9A227] transition-all hover:bg-[#171513]/90 group">
            <div className="flex justify-center mb-2">
              <Award className="w-5 h-5 text-[#C9A227] group-hover:scale-110 transition-transform" />
            </div>
            <div className="font-cinzel text-xl sm:text-2xl font-bold text-gradient-gold">
              PREMIUM
            </div>
            <div className="text-xs uppercase tracking-wider text-[#D8C08A]/80 font-medium mt-0.5">
              банкет
            </div>
          </div>

          {/* Metric 4 */}
          <div className="p-4 rounded-sm bg-[#171513]/70 backdrop-blur-md border border-[#C9A227]/30 hover:border-[#C9A227] transition-all hover:bg-[#171513]/90 group">
            <div className="flex justify-center mb-2">
              <MapPin className="w-5 h-5 text-[#C9A227] group-hover:scale-110 transition-transform" />
            </div>
            <div className="font-cinzel text-xl sm:text-2xl font-bold text-gradient-gold">
              АТЫРАУ
            </div>
            <div className="text-xs uppercase tracking-wider text-[#D8C08A]/80 font-medium mt-0.5">
              Казахстан
            </div>
          </div>
        </div>
      </div>

      {/* Down arrow link */}
      <div className="relative z-10 mt-12 animate-bounce">
        <a
          href="#about"
          className="text-[#D8C08A]/60 hover:text-[#C9A227] transition-colors p-2 inline-block"
          aria-label="Scroll to About section"
        >
          <ChevronDown className="w-6 h-6" />
        </a>
      </div>
    </section>
  );
};
