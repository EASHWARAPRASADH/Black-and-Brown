import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  maxTilt?: number;
  scale?: number;
  spotlight?: boolean;
  onClick?: () => void;
  style?: React.CSSProperties;
}

/**
 * 3D-tilt card that follows the cursor with spring physics and exposes
 * --mx / --my CSS variables so the `.spotlight` utility can draw a cursor glow.
 */
export default function TiltCard({
  children,
  className = '',
  id,
  maxTilt = 7,
  scale = 1.015,
  spotlight = true,
  onClick,
  style
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);

  const rotateX = useSpring(useTransform(py, [0, 1], [maxTilt, -maxTilt]), { stiffness: 200, damping: 22 });
  const rotateY = useSpring(useTransform(px, [0, 1], [-maxTilt, maxTilt]), { stiffness: 200, damping: 22 });

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    px.set(x);
    py.set(y);
    el.style.setProperty('--mx', `${x * 100}%`);
    el.style.setProperty('--my', `${y * 100}%`);
  };

  const handleLeave = () => {
    px.set(0.5);
    py.set(0.5);
  };

  return (
    <motion.div
      ref={ref}
      id={id}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      onClick={onClick}
      whileHover={{ scale }}
      transition={{ type: 'spring', stiffness: 260, damping: 24 }}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d', transformPerspective: 1000, ...style }}
      className={`${spotlight ? 'spotlight' : ''} ${className}`}
    >
      {children}
    </motion.div>
  );
}
