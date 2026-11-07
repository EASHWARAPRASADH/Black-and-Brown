import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';

type Variant = 'solid' | 'outline' | 'ghost' | 'dark';

interface MagneticButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onDrag' | 'onDragStart' | 'onDragEnd' | 'onAnimationStart'> {
  children: React.ReactNode;
  variant?: Variant;
  strength?: number;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  full?: boolean;
}

const base =
  'relative inline-flex items-center justify-center gap-2 font-semibold uppercase tracking-[0.18em] rounded-full select-none overflow-hidden transition-colors duration-300 will-change-transform';

const sizes = {
  sm: 'px-5 py-2.5 text-[10px]',
  md: 'px-7 py-3.5 text-[11px]',
  lg: 'px-9 py-4 text-xs'
};

const variants: Record<Variant, string> = {
  solid:
    'bg-gradient-to-r from-gold via-cream to-gold-deep text-ink shadow-[0_10px_30px_-10px_rgba(230,213,184,0.45)] hover:shadow-[0_16px_40px_-10px_rgba(230,213,184,0.6)]',
  outline: 'border border-gold/50 text-gold hover:bg-gold hover:text-ink hover:border-gold',
  ghost: 'text-gold hover:text-cream',
  dark: 'bg-ink-3 text-cream border border-gold/15 hover:border-gold/50'
};

/** Pill button that leans toward the cursor and ripples on press. */
export default function MagneticButton({
  children,
  variant = 'solid',
  strength = 0.35,
  icon,
  iconRight,
  size = 'md',
  full = false,
  className = '',
  ...rest
}: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 18, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 220, damping: 18, mass: 0.6 });

  const onMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };

  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.button
      ref={ref}
      style={{ x: sx, y: sy }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      whileTap={{ scale: 0.96 }}
      className={`group/btn ${base} ${sizes[size]} ${variants[variant]} ${full ? 'w-full' : ''} ${className}`}
      {...rest}
    >
      {/* sheen */}
      {variant === 'solid' && (
        <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 ease-out group-hover/btn:translate-x-full" />
      )}
      {icon && <span className="relative shrink-0">{icon}</span>}
      <span className="relative">{children}</span>
      {iconRight && (
        <span className="relative shrink-0 transition-transform duration-300 group-hover/btn:translate-x-1">{iconRight}</span>
      )}
    </motion.button>
  );
}
