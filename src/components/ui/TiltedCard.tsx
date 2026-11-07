import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform, type MotionValue } from 'motion/react';

interface TiltedCardProps {
  src: string;
  alt: string;
  caption?: string;
  tag?: string;
  width?: number | string;
  height?: number | string;
  rotate?: number;
  className?: string;
  style?: React.CSSProperties;
  /** Optional external parallax values (e.g. hero pointer springs). */
  parallaxX?: MotionValue<number>;
  parallaxY?: MotionValue<number>;
  depth?: number;
  floatDelay?: number;
  onClick?: () => void;
}

/**
 * React-Bits style image card: tilts toward the cursor, lifts on hover,
 * drifts with an optional parallax source and floats gently at rest.
 */
export default function TiltedCard({
  src,
  alt,
  caption,
  tag,
  width = 180,
  height = 220,
  rotate = 0,
  className = '',
  style,
  parallaxX,
  parallaxY,
  depth = 1,
  floatDelay = 0,
  onClick
}: TiltedCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(py, [0, 1], [12, -12]), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useTransform(px, [0, 1], [-12, 12]), { stiffness: 200, damping: 20 });

  const fallbackX = useMotionValue(0);
  const fallbackY = useMotionValue(0);
  const x = useTransform(parallaxX ?? fallbackX, (v) => v * depth);
  const y = useTransform(parallaxY ?? fallbackY, (v) => v * depth);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width);
    py.set((e.clientY - r.top) / r.height);
  };
  const onLeave = () => {
    px.set(0.5);
    py.set(0.5);
  };

  return (
    <motion.div style={{ x, y, width, height, ...style }} className={`relative ${className}`}>
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 6 + depth, repeat: Infinity, ease: 'easeInOut', delay: floatDelay }}
        className="h-full w-full"
      >
        <motion.div
          ref={ref}
          onMouseMove={onMove}
          onMouseLeave={onLeave}
          onClick={onClick}
          initial={{ rotate }}
          whileHover={{ scale: 1.06, rotate: 0, zIndex: 20 }}
          style={{ rotateX, rotateY, transformStyle: 'preserve-3d', transformPerspective: 900 }}
          transition={{ type: 'spring', stiffness: 220, damping: 20 }}
          className="group relative h-full w-full rounded-2xl overflow-hidden gold-frame shadow-[0_30px_60px_-25px_rgba(0,0,0,0.95)] bg-ink-3 cursor-pointer"
        >
          <img src={src} alt={alt} referrerPolicy="no-referrer" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/10 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/0 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          {tag && (
            <span className="absolute top-3 left-3 glass rounded-full px-2.5 py-1 text-[8px] font-mono tracking-[0.25em] uppercase text-gold">
              {tag}
            </span>
          )}
          {caption && (
            <span className="absolute bottom-3 left-3 right-3 font-serif italic text-sm text-cream leading-tight" style={{ transform: 'translateZ(30px)' }}>
              {caption}
            </span>
          )}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
