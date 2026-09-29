import React, { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { GalleryItem } from '../data/triumphData';

interface LightboxModalProps {
  item: GalleryItem | null;
  items: GalleryItem[];
  currentIndex: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

export const LightboxModal: React.FC<LightboxModalProps> = ({
  item,
  items,
  currentIndex,
  onClose,
  onPrev,
  onNext,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onPrev, onNext]);

  if (!item) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#0B0A09]/95 backdrop-blur-xl animate-in fade-in duration-200"
      onClick={onClose}
    >
      {/* Close button (X) */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2.5 rounded-full bg-[#171513] text-[#D8C08A] hover:text-white border border-[#C9A227]/40 hover:border-[#C9A227] transition-all cursor-pointer z-50"
        aria-label="Close lightbox"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Prev button (←) */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onPrev();
        }}
        className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-[#171513]/80 hover:bg-[#171513] text-[#D8C08A] hover:text-white border border-[#C9A227]/40 hover:border-[#C9A227] transition-all cursor-pointer z-50"
        aria-label="Previous image"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      {/* Next button (→) */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onNext();
        }}
        className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-[#171513]/80 hover:bg-[#171513] text-[#D8C08A] hover:text-white border border-[#C9A227]/40 hover:border-[#C9A227] transition-all cursor-pointer z-50"
        aria-label="Next image"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Main Image Container */}
      <div
        className="relative max-w-5xl max-h-[85vh] flex flex-col items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative rounded-sm overflow-hidden border-2 border-[#C9A227]/60 shadow-[0_0_50px_rgba(201,162,39,0.35)]">
          <img
            src={item.image}
            alt={item.title}
            className="max-h-[72vh] w-auto object-contain select-none"
          />
        </div>

        {/* Caption bar */}
        <div className="mt-4 text-center max-w-2xl px-4">
          <div className="flex items-center justify-center gap-3 mb-1">
            <span className="text-xs uppercase tracking-widest text-[#D8C08A] bg-[#171513] px-2.5 py-0.5 rounded border border-[#C9A227]/30">
              {item.categoryLabel}
            </span>
            <span className="text-xs text-[#D8C08A]/60 font-mono">
              {currentIndex + 1} / {items.length}
            </span>
          </div>
          <h3 className="font-cinzel text-lg sm:text-xl font-bold text-[#F7F1E3]">
            {item.title}
          </h3>
          <p className="text-xs sm:text-sm text-[#D8C08A]/80 mt-1">
            {item.description}
          </p>
        </div>
      </div>
    </div>
  );
};
