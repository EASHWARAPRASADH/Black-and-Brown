import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { EASE } from './motion';

const SESSION_KEY = 'bb-preloader-shown';

/**
 * Short brand intro curtain. Plays once per browser session so returning
 * navigation within the same tab is instant.
 */
export default function Preloader() {
  const [show, setShow] = useState<boolean>(() => {
    try {
      return !sessionStorage.getItem(SESSION_KEY);
    } catch {
      return true;
    }
  });

  useEffect(() => {
    if (!show) return;
    document.body.style.overflow = 'hidden';
    const t = setTimeout(() => {
      try {
        sessionStorage.setItem(SESSION_KEY, '1');
      } catch {
        /* ignore */
      }
      setShow(false);
      document.body.style.overflow = '';
    }, 1500);
    return () => {
      clearTimeout(t);
      document.body.style.overflow = '';
    };
  }, [show]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="preloader"
          id="brand-preloader"
          className="fixed inset-0 z-[100] bg-ink flex flex-col items-center justify-center overflow-hidden"
          exit={{ y: '-100%', transition: { duration: 0.8, ease: EASE } }}
        >
          <div className="absolute inset-0 grain" />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, filter: 'blur(8px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            transition={{ duration: 0.8, ease: EASE }}
            className="relative flex flex-col items-center gap-4"
          >
            <motion.img
              src="/img/logo.jpeg"
              alt="Black & Brown"
              className="h-16 w-16 rounded-xl object-cover border border-gold/40 shadow-2xl"
              initial={{ rotate: -6 }}
              animate={{ rotate: 0 }}
              transition={{ duration: 0.8, ease: EASE }}
            />
            <div className="text-center">
              <span className="block font-serif italic text-2xl tracking-[0.3em] text-gradient-gold">BLACK & BROWN</span>
              <span className="block text-[9px] font-mono tracking-[0.4em] text-gold/60 uppercase mt-1">Salon & Academy</span>
            </div>
          </motion.div>

          <div className="absolute bottom-16 w-40 h-px bg-gold/15 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-gold-deep via-gold to-cream"
              initial={{ x: '-100%' }}
              animate={{ x: '0%' }}
              transition={{ duration: 1.3, ease: EASE }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
