import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';

interface ParallaxImageProps {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  strength?: number;
  children?: React.ReactNode;
}

/**
 * Image that drifts vertically as the page scrolls (subtle depth), with a
 * slight over-scale so the edges never show.
 */
export default function ParallaxImage({
  src,
  alt,
  className = '',
  imgClassName = '',
  strength = 40,
  children
}: ParallaxImageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [-strength, strength]);

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <motion.img
        referrerPolicy="no-referrer"
        src={src}
        alt={alt}
        style={{ y, scale: 1.12 }}
        className={`w-full h-full object-cover will-change-transform ${imgClassName}`}
      />
      {children}
    </div>
  );
}
