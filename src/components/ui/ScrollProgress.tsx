import React from 'react';
import { motion, useScroll, useSpring } from 'motion/react';

/** Thin gold line at the very top of the page tracking scroll progress. */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 24, restDelta: 0.001 });

  return (
    <motion.div
      aria-hidden
      style={{ scaleX, transformOrigin: '0% 50%' }}
      className="fixed top-0 left-0 right-0 h-[2px] z-[60] bg-gradient-to-r from-gold-deep via-gold to-cream pointer-events-none"
    />
  );
}
