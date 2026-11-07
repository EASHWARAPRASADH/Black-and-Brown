import type { Variants, Transition } from 'motion/react';

/** Signature easing used across the site (expo-out feel). */
export const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export const spring: Transition = { type: 'spring', stiffness: 260, damping: 26, mass: 0.8 };
export const softSpring: Transition = { type: 'spring', stiffness: 140, damping: 20 };

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28, filter: 'blur(6px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.8, ease: EASE }
  }
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.8, ease: EASE } }
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.94 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: EASE } }
};

export const slideLeft: Variants = {
  hidden: { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: EASE } }
};

export const slideRight: Variants = {
  hidden: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: EASE } }
};

export const staggerContainer = (stagger = 0.08, delay = 0.05): Variants => ({
  hidden: {},
  visible: { transition: { staggerChildren: stagger, delayChildren: delay } }
});

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: EASE } }
};

export const viewportOnce = { once: true, margin: '-60px' } as const;

/** Page-level transition used when switching between the single-page views. */
/*
 * Note: no `filter` here on purpose. A filter (even blur(0px)) left on the
 * page wrapper turns it into the containing block for `position: fixed`
 * descendants (lightboxes, overlays), which would then center inside the
 * tall page instead of the viewport.
 */
export const pageVariants: Variants = {
  initial: { opacity: 0, y: 18 },
  enter: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
  exit: { opacity: 0, y: -12, transition: { duration: 0.3, ease: EASE } }
};
