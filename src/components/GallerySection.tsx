import React, { useState } from 'react';
import { Sparkles, Maximize2, Filter } from 'lucide-react';
import { GALLERY_DATA, GalleryItem } from '../data/triumphData';
import { LightboxModal } from './LightboxModal';

export const GallerySection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const categories = [
    { id: 'all', label: 'Все' },
    { id: 'hall', label: 'Зал' },
    { id: 'dishes', label: 'Блюда' },
    { id: 'weddings', label: 'Свадьбы' },
    { id: 'banquets', label: 'Банкеты' },
    { id: 'events', label: 'Мероприятия' },
    { id: 'interior', label: 'Интерьер' },
  ];

  const filteredItems = GALLERY_DATA.filter((item) => {
    if (activeCategory === 'all') return true;
    return item.category === activeCategory;
  });

  const handleOpenLightbox = (index: number) => {
    setLightboxIndex(index);
  };

  const handleCloseLightbox = () => {
    setLightboxIndex(null);
  };

  const handlePrev = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((prev) => (prev! > 0 ? prev! - 1 : filteredItems.length - 1));
    }
  };

  const handleNext = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((prev) => (prev! < filteredItems.length - 1 ? prev! + 1 : 0));
    }
  };

  const activeLightboxItem = lightboxIndex !== null ? filteredItems[lightboxIndex] : null;

  return (
    <section id="gallery" className="py-20 lg:py-28 bg-[#0B0A09] text-[#F7F1E3] relative overflow-hidden">
      {/* Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#C9A227]/5 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full border border-[#C9A227]/40 bg-[#171513] mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#C9A227]" />
            <span className="text-xs uppercase tracking-widest text-[#D8C08A] font-semibold">
              Фотогалерея
            </span>
            <Sparkles className="w-3.5 h-3.5 text-[#C9A227]" />
          </div>
          <h2 className="font-cinzel text-3xl sm:text-4xl lg:text-5xl font-bold tracking-wide text-[#F7F1E3] mb-3">
            ГАЛЕРЕЯ <span className="text-gradient-gold">TRIUMPH HALL</span>
          </h2>
          <p className="text-base sm:text-lg text-[#D8C08A] font-cormorant italic">
            «Погрузитесь в атмосферу блеска, гастрономического искусства и триумфальных моментов»
          </p>
          <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-[#C9A227] to-transparent mx-auto mt-4" />
        </div>

        {/* Categories Tab Buttons */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setActiveCategory(cat.id);
                setLightboxIndex(null);
              }}
              className={`px-4 sm:px-5 py-2 rounded-sm text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-gradient-to-r from-[#9A7617] to-[#C9A227] text-[#0B0A09] shadow-[0_0_15px_rgba(201,162,39,0.4)]'
                  : 'bg-[#171513] text-[#D8C08A] border border-[#C9A227]/25 hover:border-[#C9A227] hover:text-[#FFFFFF]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Gallery Image Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item, index) => (
            <div
              key={item.id}
              onClick={() => handleOpenLightbox(index)}
              className="group relative h-72 rounded-sm overflow-hidden border border-[#C9A227]/30 hover:border-[#C9A227] shadow-lg cursor-pointer bg-[#171513] transition-all duration-300"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B0A09]/90 via-[#0B0A09]/20 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />

              {/* Zoom icon button */}
              <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[#0B0A09]/80 border border-[#C9A227]/50 flex items-center justify-center text-[#D8C08A] opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                <Maximize2 className="w-4 h-4" />
              </div>

              {/* Caption */}
              <div className="absolute bottom-4 left-4 right-4">
                <span className="text-[10px] uppercase tracking-wider font-semibold text-[#C9A227] bg-[#0B0A09]/80 px-2 py-0.5 rounded border border-[#C9A227]/30 inline-block mb-1.5">
                  {item.categoryLabel}
                </span>
                <h3 className="font-cinzel text-base font-bold text-[#F7F1E3] group-hover:text-[#D8C08A] transition-colors leading-snug">
                  {item.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Component */}
      <LightboxModal
        item={activeLightboxItem}
        items={filteredItems}
        currentIndex={lightboxIndex || 0}
        onClose={handleCloseLightbox}
        onPrev={handlePrev}
        onNext={handleNext}
      />
    </section>
  );
};
