import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'motion/react';
import { Menu, X, Calendar, GraduationCap, ArrowUpRight } from 'lucide-react';
import { EASE } from './ui/motion';

interface NavbarProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  onOpenBooking: () => void;
  onOpenAcademyEnroll: () => void;
}

const navLinks = [
  { id: 'home', label: 'Home' },
  { id: 'services', label: 'Salon Services' },
  { id: 'training', label: 'Training Academy' },
  { id: 'gallery', label: 'Gallery' },
  { id: 'about', label: 'About Studio' }
];

export default function Navbar({ currentPage, setCurrentPage, onOpenBooking, onOpenAcademyEnroll }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (y) => setScrolled(y > 24));

  // Lock scroll while the mobile drawer is open
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  const handleNavClick = (pageId: string) => {
    setCurrentPage(pageId);
    setIsOpen(false);
  };

  return (
    <motion.nav
      id="app-navbar"
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: EASE, delay: 0.2 }}
      className={`sticky top-0 z-50 transition-all duration-500 border-b ${
        scrolled
          ? 'glass border-gold/15 shadow-[0_10px_40px_-20px_rgba(0,0,0,0.9)]'
          : 'bg-ink/80 border-gold/10 backdrop-blur-md'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex items-center justify-between transition-all duration-500 ${scrolled ? 'h-16' : 'h-20'}`}>
          {/* Brand */}
          <motion.button
            id="navbar-brand"
            onClick={() => handleNavClick('home')}
            whileHover="hover"
            className="flex items-center gap-3 group text-left"
          >
            <motion.div
              variants={{ hover: { rotate: -4, scale: 1.04 } }}
              transition={{ type: 'spring', stiffness: 300, damping: 18 }}
              className={`rounded-xl border border-gold/30 group-hover:border-gold transition-colors duration-300 overflow-hidden shadow-lg ${
                scrolled ? 'h-10 w-10' : 'h-12 w-12 sm:h-14 sm:w-14'
              }`}
            >
              <img src="/img/logo.jpeg" alt="Black & Brown Logo" className="h-full w-full object-cover" />
            </motion.div>
            <div className="hidden sm:block">
              <span className="block whitespace-nowrap font-serif text-lg xl:text-2xl font-light italic tracking-[0.2em] xl:tracking-[0.25em] text-cream group-hover:text-gradient-gold transition-colors duration-300">
                BLACK & BROWN
              </span>
              <p className="text-[9px] font-mono tracking-[0.35em] text-gold-deep uppercase -mt-1 font-semibold">
                Salon & Academy
              </p>
            </div>
          </motion.button>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-8">
            <div className="flex items-center gap-1 relative">
              {navLinks.map((link) => {
                const active = currentPage === link.id;
                return (
                  <button
                    key={link.id}
                    id={`nav-link-${link.id}`}
                    onClick={() => handleNavClick(link.id)}
                    className={`relative px-4 py-2 text-[13px] font-medium tracking-wide rounded-full transition-colors duration-300 ${
                      active ? 'text-ink' : 'text-gold/80 hover:text-cream'
                    }`}
                  >
                    {active && (
                      <motion.span
                        layoutId="nav-active-pill"
                        transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                        className="absolute inset-0 rounded-full bg-gradient-to-r from-gold via-cream to-gold-deep shadow-[0_8px_24px_-10px_rgba(230,213,184,0.6)]"
                      />
                    )}
                    <span className="relative z-10">{link.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-3 pl-6 border-l border-gold/15">
              <motion.button
                id="cta-join-academy-navbar"
                onClick={onOpenAcademyEnroll}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.96 }}
                className="flex items-center gap-2 px-4 py-2.5 text-[11px] font-semibold tracking-[0.18em] uppercase border border-gold/40 text-gold hover:bg-gold hover:text-ink transition-colors duration-300 rounded-full"
              >
                <GraduationCap className="h-4 w-4" />
                Join Academy
              </motion.button>
              <motion.button
                id="cta-book-appointment-navbar"
                onClick={onOpenBooking}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.96 }}
                className="group/book relative overflow-hidden flex items-center gap-2 px-5 py-2.5 text-[11px] font-semibold tracking-[0.18em] uppercase bg-gradient-to-r from-gold via-cream to-gold-deep text-ink rounded-full shadow-[0_10px_30px_-10px_rgba(230,213,184,0.5)]"
              >
                <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/50 to-transparent transition-transform duration-700 group-hover/book:translate-x-full" />
                <Calendar className="h-4 w-4 relative" />
                <span className="relative">Book Services</span>
                <ArrowUpRight className="h-3.5 w-3.5 relative transition-transform duration-300 group-hover/book:translate-x-0.5 group-hover/book:-translate-y-0.5" />
              </motion.button>
            </div>
          </div>

          {/* Mobile controls */}
          <div className="flex items-center lg:hidden gap-2">
            <motion.button
              id="mobile-book-btn"
              onClick={onOpenBooking}
              whileTap={{ scale: 0.92 }}
              className="p-2.5 bg-gradient-to-r from-gold to-gold-deep text-ink rounded-full shadow-lg"
              title="Book Services"
              aria-label="Book Services"
            >
              <Calendar className="h-4 w-4" />
            </motion.button>
            <motion.button
              id="mobile-menu-toggle"
              onClick={() => setIsOpen(!isOpen)}
              whileTap={{ scale: 0.92 }}
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isOpen}
              className="p-2.5 text-gold hover:text-cream glass rounded-full"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={isOpen ? 'x' : 'menu'}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="block"
                >
                  {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </motion.span>
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="mobile-drawer"
            id="mobile-menu-drawer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.45, ease: EASE }}
            className="lg:hidden overflow-hidden border-t border-gold/10 bg-ink/95 backdrop-blur-xl"
          >
            <motion.div
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={{ visible: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } }, hidden: {} }}
              className="px-4 pt-4 pb-6 space-y-4"
            >
              <div className="flex flex-col gap-1">
                {navLinks.map((link) => (
                  <motion.button
                    key={link.id}
                    id={`mobile-nav-link-${link.id}`}
                    variants={{ hidden: { opacity: 0, x: -16 }, visible: { opacity: 1, x: 0 } }}
                    onClick={() => handleNavClick(link.id)}
                    className={`py-3 px-4 text-left text-sm font-medium rounded-xl transition-colors flex items-center justify-between ${
                      currentPage === link.id
                        ? 'text-ink bg-gradient-to-r from-gold to-gold-deep font-semibold'
                        : 'text-gold/85 hover:text-cream hover:bg-ink-3'
                    }`}
                  >
                    {link.label}
                    <ArrowUpRight className="h-4 w-4 opacity-60" />
                  </motion.button>
                ))}
              </div>

              <motion.div
                variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
                className="border-t border-gold/10 pt-4 flex flex-col sm:flex-row gap-3"
              >
                <button
                  id="mobile-join-academy-btn"
                  onClick={() => {
                    setIsOpen(false);
                    onOpenAcademyEnroll();
                  }}
                  className="w-full flex items-center justify-center gap-2 py-3 text-[11px] font-semibold tracking-[0.18em] uppercase border border-gold/50 text-gold hover:bg-gold/10 rounded-full transition-colors"
                >
                  <GraduationCap className="h-4 w-4" />
                  Join Academy Training
                </button>
                <button
                  id="mobile-book-services-btn"
                  onClick={() => {
                    setIsOpen(false);
                    onOpenBooking();
                  }}
                  className="w-full flex items-center justify-center gap-2 py-3 text-[11px] font-semibold tracking-[0.18em] uppercase bg-gradient-to-r from-gold via-cream to-gold-deep text-ink rounded-full shadow-lg"
                >
                  <Calendar className="h-4 w-4" />
                  Book Salon Session
                </button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
