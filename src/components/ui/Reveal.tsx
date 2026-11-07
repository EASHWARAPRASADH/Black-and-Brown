import React from 'react';
import { motion, type Variants } from 'motion/react';
import { EASE, viewportOnce, staggerContainer, staggerItem } from './motion';

type Direction = 'up' | 'down' | 'left' | 'right' | 'none';

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  direction?: Direction;
  distance?: number;
  blur?: boolean;
  once?: boolean;
  as?: 'div' | 'section' | 'span' | 'li' | 'p';
  id?: string;
  style?: React.CSSProperties;
}

/**
 * Scroll-triggered reveal. Fades + slides + un-blurs an element the first time
 * it enters the viewport.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  duration = 0.8,
  direction = 'up',
  distance = 28,
  blur = true,
  once = true,
  as = 'div',
  id,
  style
}: RevealProps) {
  const offset = {
    up: { y: distance },
    down: { y: -distance },
    left: { x: distance },
    right: { x: -distance },
    none: {}
  }[direction];

  const variants: Variants = {
    hidden: { opacity: 0, ...offset, filter: blur ? 'blur(6px)' : 'none' },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      filter: 'blur(0px)',
      transition: { duration, delay, ease: EASE }
    }
  };

  const Tag = motion[as] as typeof motion.div;

  return (
    <Tag
      id={id}
      style={style}
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: viewportOnce.margin }}
    >
      {children}
    </Tag>
  );
}

interface StaggerProps {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
  delay?: number;
  id?: string;
}

/** Container that staggers its <StaggerItem/> children when scrolled into view. */
export function Stagger({ children, className, stagger = 0.08, delay = 0.05, id }: StaggerProps) {
  return (
    <motion.div
      id={id}
      className={className}
      variants={staggerContainer(stagger, delay)}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
    >
      {children}
    </motion.div>
  );
}

interface StaggerItemProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
}

export function StaggerItem({ children, className, id, onClick, style }: StaggerItemProps) {
  return (
    <motion.div id={id} className={className} variants={staggerItem} onClick={onClick} style={style}>
      {children}
    </motion.div>
  );
}

interface TextRevealProps {
  text: string;
  className?: string;
  wordClassName?: string;
  delay?: number;
  stagger?: number;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
  once?: boolean;
  inView?: boolean;
}

/**
 * Word-by-word mask reveal (each word slides up out of a clipped box).
 * Set inView=false to play immediately on mount (e.g. hero).
 */
export function TextReveal({
  text,
  className,
  wordClassName,
  delay = 0,
  stagger = 0.06,
  as = 'span',
  once = true,
  inView = true
}: TextRevealProps) {
  const words = text.split(' ');
  const Tag = motion[as] as typeof motion.span;

  const container: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: stagger, delayChildren: delay } }
  };
  const word: Variants = {
    hidden: { y: '110%', opacity: 0, rotateX: -35 },
    visible: { y: '0%', opacity: 1, rotateX: 0, transition: { duration: 0.9, ease: EASE } }
  };

  const triggerProps = inView
    ? { whileInView: 'visible', viewport: { once, margin: '-40px' } }
    : { animate: 'visible' };

  return (
    <Tag className={className} variants={container} initial="hidden" {...triggerProps} aria-label={text}>
      {words.map((w, i) => (
        <span key={i} className="inline-block overflow-hidden align-bottom pb-[0.12em] -mb-[0.12em]" aria-hidden>
          <motion.span
            variants={word}
            className={`inline-block will-change-transform ${wordClassName ?? ''}`}
            style={{ transformOrigin: '50% 100%' }}
          >
            {w}
          </motion.span>
          {i < words.length - 1 ? <span className="inline-block">&nbsp;</span> : null}
        </span>
      ))}
    </Tag>
  );
}
