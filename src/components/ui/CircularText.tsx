import React from 'react';
import { motion } from 'motion/react';

interface CircularTextProps {
  text: string;
  size?: number;
  duration?: number;
  className?: string;
  children?: React.ReactNode;
  reverse?: boolean;
}

/** React-Bits style rotating circular text with an optional centered element. */
export default function CircularText({ text, size = 120, duration = 18, className = '', children, reverse = false }: CircularTextProps) {
  const id = React.useId();
  const r = size / 2 - 10;
  return (
    <div className={`relative inline-flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      <motion.svg
        viewBox={`0 0 ${size} ${size}`}
        width={size}
        height={size}
        animate={{ rotate: reverse ? -360 : 360 }}
        transition={{ duration, repeat: Infinity, ease: 'linear' }}
        className="absolute inset-0"
      >
        <defs>
          <path id={id} d={`M ${size / 2},${size / 2} m -${r},0 a ${r},${r} 0 1,1 ${r * 2},0 a ${r},${r} 0 1,1 -${r * 2},0`} />
        </defs>
        <text className="fill-current font-mono uppercase" style={{ fontSize: size * 0.085, letterSpacing: '0.32em' }}>
          <textPath href={`#${id}`} startOffset="0">
            {text}
          </textPath>
        </text>
      </motion.svg>
      <div className="relative z-10 flex items-center justify-center">{children}</div>
    </div>
  );
}
