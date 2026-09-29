import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { AboutSection } from './components/AboutSection';
import { MenuSection } from './components/MenuSection';
import { MenuModal } from './components/MenuModal';
import { CalculatorSection, CalculationResult } from './components/CalculatorSection';
import { BanquetSection } from './components/BanquetSection';
import { HallSection } from './components/HallSection';
import { ServicesSection } from './components/ServicesSection';
import { GallerySection } from './components/GallerySection';
import { BookingSection } from './components/BookingSection';
import { SuccessModal } from './components/SuccessModal';
import { FAQSection } from './components/FAQSection';
import { ContactsSection } from './components/ContactsSection';
import { Footer } from './components/Footer';
import { FloatingWidgets } from './components/FloatingWidgets';
import { TriumphAIChat } from './components/TriumphAIChat';
import { MenuItem, MENUS_DATA } from './data/triumphData';

export default function App() {
  // Modal states
  const [selectedModalMenu, setSelectedModalMenu] = useState<MenuItem | null>(null);
  const [successBookingData, setSuccessBookingData] = useState<any | null>(null);

  // Active calculator menu state
  const [activeMenuId, setActiveMenuId] = useState<string>('menu-18000');

  // Transferred calculation data for the booking form
  const [calcDataForBooking, setCalcDataForBooking] = useState<CalculationResult | null>(null);

  // Scroll helpers
  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // When clicking "ВЫБРАТЬ" on a menu card or modal
  const handleSelectMenuFromCatalog = (menu: MenuItem) => {
    setActiveMenuId(menu.id);
    setSelectedModalMenu(null);
    scrollToSection('calculator');
  };

  // When clicking "ЗАБРОНИРОВАТЬ ЭТОТ БАНКЕТ" from calculator
  const handleProceedToBooking = (calc: CalculationResult) => {
    setCalcDataForBooking(calc);
    scrollToSection('booking');
  };

  // When an event type is chosen from the events or services section
  const handleSelectEventType = (eventName: string) => {
    scrollToSection('booking');
  };

  // When AI Assistant triggers navigation or action
  const handleNavigateFromAI = (sectionId: string, payload?: any) => {
    if (payload?.menuId) {
      setActiveMenuId(payload.menuId);
    }
    if (sectionId === 'booking' && payload) {
      const targetMenu =
        MENUS_DATA.find((m) => m.id === payload.menuId || m.price === payload.menuPrice) ||
        MENUS_DATA[3];
      const guests = payload.guestCount || 100;
      setCalcDataForBooking({
        selectedMenu: targetMenu,
        guestCount: guests,
        menuCost: guests * targetMenu.price,
        additionalServices: [
          'LED-экран сверхвысокого разрешения',
          'Музыкальная звуковая аппаратура и радиомикрофоны',
        ],
        totalCost: guests * targetMenu.price,
      });
    }
    scrollToSection(sectionId);
  };

  return (
    <div className="min-h-screen bg-[#0B0A09] text-[#F7F1E3] font-montserrat flex flex-col selection:bg-[#C9A227] selection:text-[#0B0A09]">
      {/* 1. Header Navigation */}
      <Navbar onOpenBooking={() => scrollToSection('booking')} />

      <main className="flex-1">
        {/* 2. Hero Section */}
        <Hero
          onOpenBooking={() => scrollToSection('booking')}
          onExploreMenu={() => scrollToSection('menu')}
        />

        {/* 3. About Section (Light Cream/Ivory Luxury) */}
        <AboutSection
          onOpenBooking={() => scrollToSection('booking')}
          onExploreHall={() => scrollToSection('hall')}
        />

        {/* 4. Menu Section (5 Verified Menus) */}
        <MenuSection
          onOpenModal={(menu) => setSelectedModalMenu(menu)}
          onSelectForCalculator={handleSelectMenuFromCatalog}
        />

        {/* 5. Interactive Banquet Calculator */}
        <CalculatorSection
          selectedMenuId={activeMenuId}
          onMenuChange={(id) => setActiveMenuId(id)}
          onProceedToBooking={handleProceedToBooking}
        />

        {/* 6. Banquets & Events Formats (Light Ivory Luxury) */}
        <BanquetSection onSelectEventType={handleSelectEventType} />

        {/* 7. Hall Architecture, Capacity & Equipment */}
        <HallSection onOpenBooking={() => scrollToSection('booking')} />

        {/* 8. Full Services (Light Ivory Luxury) */}
        <ServicesSection onSelectService={handleSelectEventType} />

        {/* 9. Interactive Filterable Photo Gallery with Lightbox */}
        <GallerySection />

        {/* 10. Booking Section with Calculator Synchronization */}
        <BookingSection
          incomingCalcData={calcDataForBooking}
          onBookingSuccess={(record) => setSuccessBookingData(record)}
        />

        {/* 11. FAQ Accordion (Light Ivory Luxury) */}
        <FAQSection />

        {/* 12. Contacts, Working Hours & Maps */}
        <ContactsSection onOpenBooking={() => scrollToSection('booking')} />
      </main>

      {/* 13. Footer */}
      <Footer />

      {/* Floating back-to-top, WhatsApp and LocalStorage bookings viewer */}
      <FloatingWidgets onOpenBooking={() => scrollToSection('booking')} />

      {/* Conversational AI Assistant: TRIUMPH AI */}
      <TriumphAIChat onNavigateTo={handleNavigateFromAI} />

      {/* Detailed Menu Modal */}
      <MenuModal
        menu={selectedModalMenu}
        onClose={() => setSelectedModalMenu(null)}
        onSelectForCalculator={handleSelectMenuFromCatalog}
      />

      {/* Success Booking Modal */}
      <SuccessModal
        isOpen={Boolean(successBookingData)}
        bookingData={successBookingData}
        onClose={() => setSuccessBookingData(null)}
      />
    </div>
  );
}
