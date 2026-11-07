import React, { useEffect, useRef, useState } from 'react';
import { useInView, animate } from 'motion/react';

interface AnimatedNumberProps {
  value: string;
  duration?: number;
}

/**
 * Counts up to the numeric portion of `value` (e.g. "500+" -> 0..500 + "+")
 * the first time it scrolls into view, using an expo-out curve.
 */
export default function AnimatedNumber({ value, duration = 1.8 }: AnimatedNumberProps) {
  const numericMatch = value.match(/\d+/);
  const numericVal = numericMatch ? parseInt(numericMatch[0], 10) : 0;
  const hasValue = numericMatch !== null;
  const prefix = hasValue ? value.substring(0, numericMatch.index) : '';
  const suffix = hasValue ? value.substring((numericMatch.index ?? 0) + numericMatch[0].length) : value;

  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });

  useEffect(() => {
    if (!isInView || !hasValue) return;
    const controls = animate(0, numericVal, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setCount(Math.round(v))
    });
    return () => controls.stop();
  }, [isInView, numericVal, hasValue, duration]);

  return (
    <span ref={ref} className="inline-flex items-baseline tabular-nums">
      {prefix}
      {hasValue ? count : value}
      <span className="text-gold-deep">{suffix}</span>
    </span>
  );
}
