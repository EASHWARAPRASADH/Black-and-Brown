import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomeView from './components/HomeView';
import ServicesView from './components/ServicesView';
import TrainingView from './components/TrainingView';
import AboutView from './components/AboutView';
import GalleryView from './components/GalleryView';
import BookingModal from './components/BookingModal';
import EnrollmentModal from './components/EnrollmentModal';
import ScrollingBanner from './components/ScrollingBanner';
import { Preloader, ScrollProgress, BackToTop, pageVariants } from './components/ui';
import { MenuItem } from './types';

const PAGE_TITLES: Record<string, string> = {
  home: 'Black & Brown — Salon & Academy | Haircut, Makeup & Beauty Training in Karaikal',
  services: 'Salon Services & Pricing | Black & Brown Karaikal',
  training: 'Beauty Academy Courses | Black & Brown Karaikal',
  gallery: 'Studio Portfolio & Lookbook | Black & Brown Karaikal',
  about: 'About the Studio & Founders | Black & Brown Karaikal'
};

export default function App() {
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [isBookingOpen, setIsBookingOpen] = useState<boolean>(false);
  const [isAcademyEnrollOpen, setIsAcademyEnrollOpen] = useState<boolean>(false);

  const [selectedServices, setSelectedServices] = useState<MenuItem[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);

  // Jump to top and update the tab title whenever the view changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
    document.title = PAGE_TITLES[currentPage] ?? PAGE_TITLES.home;
  }, [currentPage]);

  // Lock body scroll while a modal is open
  useEffect(() => {
    const open = isBookingOpen || isAcademyEnrollOpen;
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isBookingOpen, isAcademyEnrollOpen]);

  const handleOpenBookingWithServices = (services: MenuItem[]) => {
    setSelectedServices(services);
    setIsBookingOpen(true);
  };

  const handleOpenBookingGeneral = () => {
    setSelectedServices([]);
    setIsBookingOpen(true);
  };

  const handleOpenAcademyEnrollWithCourse = (courseId: string) => {
    setSelectedCourseId(courseId);
    setIsAcademyEnrollOpen(true);
  };

  const handleOpenAcademyEnrollGeneral = () => {
    setSelectedCourseId(null);
    setIsAcademyEnrollOpen(true);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'services':
        return <ServicesView onOpenBookingWithServices={handleOpenBookingWithServices} />;
      case 'training':
        return <TrainingView onOpenAcademyEnrollWithCourse={handleOpenAcademyEnrollWithCourse} />;
      case 'about':
        return <AboutView />;
      case 'gallery':
        return <GalleryView />;
      default:
        return (
          <HomeView
            setCurrentPage={setCurrentPage}
            onOpenBooking={handleOpenBookingGeneral}
            onOpenAcademyEnroll={handleOpenAcademyEnrollGeneral}
          />
        );
    }
  };

  return (
    <div id="app-root-container" className="flex flex-col min-h-screen bg-ink text-gold">
      <Preloader />
      <ScrollProgress />

      <ScrollingBanner />

      <Navbar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        onOpenBooking={handleOpenBookingGeneral}
        onOpenAcademyEnroll={handleOpenAcademyEnrollGeneral}
      />

      <main className="flex-grow relative">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={currentPage}
            variants={pageVariants}
            initial="initial"
            animate="enter"
            exit="exit"
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer
        setCurrentPage={setCurrentPage}
        onOpenBooking={handleOpenBookingGeneral}
        onOpenAcademyEnroll={handleOpenAcademyEnrollGeneral}
      />

      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        selectedServices={selectedServices}
        setSelectedServices={setSelectedServices}
      />

      <EnrollmentModal
        isOpen={isAcademyEnrollOpen}
        onClose={() => setIsAcademyEnrollOpen(false)}
        selectedCourseId={selectedCourseId}
      />

      <BackToTop />

      {/* WhatsApp floating chat */}
      <motion.a
        href="https://wa.me/916374854329?text=Hi%20Black%20%26%20Brown%20Salon%2C%20I%20would%20like%20to%20book%20an%20appointment."
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        initial={{ opacity: 0, scale: 0.6, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 1.8, type: 'spring', stiffness: 260, damping: 18 }}
        whileHover="hover"
        whileTap={{ scale: 0.94 }}
        className="group fixed bottom-6 right-6 z-40 flex items-center gap-0 rounded-full text-[#25D366]"
      >
        <motion.span
          variants={{ hover: { width: 'auto', opacity: 1, marginRight: 10, paddingLeft: 16, paddingRight: 8 } }}
          initial={{ width: 0, opacity: 0, marginRight: 0, paddingLeft: 0, paddingRight: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="hidden sm:inline-flex overflow-hidden whitespace-nowrap h-11 items-center glass rounded-full text-[11px] font-semibold tracking-[0.18em] uppercase text-cream"
        >
          Chat with us
        </motion.span>
        <span className="pulse-ring relative flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] text-white shadow-[0_12px_30px_-8px_rgba(37,211,102,0.6)] transition-colors duration-300 group-hover:bg-[#1ebe5b]">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
        </span>
      </motion.a>
    </div>
  );
}
