import React from 'react';
import { motion } from 'motion/react';

interface AuroraProps {
  className?: string;
  intensity?: number;
}

/**
 * React-Bits style "Aurora" backdrop: three blurred, slowly morphing gold /
 * bronze ribbons. Pure CSS + motion, no WebGL, so it is cheap on mobile.
 */
export default function Aurora({ className = '', intensity = 0.35 }: AuroraProps) {
  const ribbons = [
    { color: 'rgba(230,213,184,0.9)', w: '70%', h: '45%', top: '-10%', left: '-10%', dur: 22, path: { x: [0, 120, -60, 0], y: [0, 40, -30, 0], rotate: [0, 12, -8, 0] } },
    { color: 'rgba(201,169,97,0.85)', w: '55%', h: '50%', top: '30%', left: '45%', dur: 26, path: { x: [0, -90, 70, 0], y: [0, -60, 40, 0], rotate: [0, -10, 14, 0] } },
    { color: 'rgba(61,43,31,1)', w: '60%', h: '40%', top: '55%', left: '-5%', dur: 30, path: { x: [0, 80, -40, 0], y: [0, -30, 50, 0], rotate: [0, 8, -12, 0] } }
  ];

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`} style={{ opacity: intensity }} aria-hidden>
      {ribbons.map((r, i) => (
        <motion.div
          key={i}
          animate={r.path}
          transition={{ duration: r.dur, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            width: r.w,
            height: r.h,
            top: r.top,
            left: r.left,
            background: `radial-gradient(ellipse at center, ${r.color} 0%, transparent 65%)`,
            filter: 'blur(60px)'
          }}
          className="absolute rounded-[50%] mix-blend-screen will-change-transform"
        />
      ))}
    </div>
  );
}
