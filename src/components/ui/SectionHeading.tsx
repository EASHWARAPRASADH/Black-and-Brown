import React from 'react';
import { motion } from 'motion/react';
import { EASE, viewportOnce } from './motion';
import { Reveal } from './Reveal';

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  as?: 'h1' | 'h2';
  className?: string;
  light?: boolean;
  titleClassName?: string;
}

/** Eyebrow + serif title + animated hairline + optional description. */
export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'center',
  as = 'h2',
  className = '',
  titleClassName = ''
}: SectionHeadingProps) {
  const isCenter = align === 'center';
  const Title = as;

  return (
    <div className={`${isCenter ? 'text-center mx-auto' : 'text-left'} ${className}`}>
      {eyebrow && (
        <Reveal direction="none" blur={false} duration={0.6}>
          <span className="inline-flex items-center gap-3 text-[11px] font-mono tracking-[0.3em] text-gold-deep uppercase font-semibold">
            <span className="h-px w-6 bg-gold-deep/60" />
            {eyebrow}
            {isCenter && <span className="h-px w-6 bg-gold-deep/60" />}
          </span>
        </Reveal>
      )}

      <Reveal delay={0.08} className="mt-4">
        <Title
          className={`font-serif text-cream leading-[1.05] tracking-tight ${
            as === 'h1' ? 'text-4xl sm:text-5xl md:text-6xl' : 'text-3xl sm:text-4xl md:text-[44px]'
          } ${titleClassName}`}
        >
          {title}
        </Title>
      </Reveal>

      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: 1 }}
        viewport={viewportOnce}
        transition={{ duration: 0.9, delay: 0.25, ease: EASE }}
        style={{ transformOrigin: isCenter ? '50% 50%' : '0% 50%' }}
        className={`mt-5 h-px w-20 bg-gradient-to-r from-gold-deep via-gold to-gold-deep ${isCenter ? 'mx-auto' : ''}`}
      />

      {description && (
        <Reveal delay={0.2} className="mt-5">
          <p className="text-sm sm:text-[15px] text-cream/65 font-light leading-relaxed max-w-2xl mx-auto">
            {description}
          </p>
        </Reveal>
      )}
    </div>
  );
}
