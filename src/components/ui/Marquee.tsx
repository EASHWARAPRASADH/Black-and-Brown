import React from 'react';

interface MarqueeProps {
  items: string[];
  className?: string;
  speedClass?: string;
  separator?: React.ReactNode;
}

/** Edge-faded infinite ticker. Content is duplicated so the loop is seamless. */
export default function Marquee({ items, className = '', separator }: MarqueeProps) {
  const doubled = [...items, ...items];
  return (
    <div className={`relative overflow-hidden mask-x select-none ${className}`} aria-hidden>
      <div className="animate-marquee-50 whitespace-nowrap">
        {doubled.map((item, i) => (
          <span key={i} className="inline-flex items-center gap-6 pr-6">
            <span>{item}</span>
            {separator ?? <span className="h-1 w-1 rounded-full bg-gold-deep/60" />}
          </span>
        ))}
      </div>
    </div>
  );
}
