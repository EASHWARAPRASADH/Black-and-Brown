import React from 'react';
import { Tag, Sparkles, ShoppingBag, Users } from 'lucide-react';

export default function ScrollingBanner() {
  const announcements = [
    {
      icon: <Tag className="h-3 w-3 text-gold-deep" />,
      text: 'SPECIAL OFFER: Flat 10% OFF on all Combo Packages (Use Coupon: BBCOMBO10)'
    },
    {
      icon: <ShoppingBag className="h-3 w-3 text-gold-deep" />,
      text: 'PRODUCT SALE: Authorized Kryolan International professional makeup, stylers, and premium textbook kits in stock!'
    },
    {
      icon: <Users className="h-3 w-3 text-gold-deep" />,
      text: 'STAFF PROVIDE: We place certified and trained beauty therapy graduates, style gurus, & modern barbers in premium global salons!'
    },
    {
      icon: <Sparkles className="h-3 w-3 text-gold-deep" />,
      text: 'ACADEMY DIRECTIVE: Regular admissions open for live practical cosmetology courses under master trainers!'
    }
  ];

  const repeated = [...announcements, ...announcements, ...announcements];

  return (
    <div
      id="scrolling-promo-banner"
      className="relative z-50 overflow-hidden select-none bg-ink border-b border-bronze/60 py-2.5 text-[11px] font-mono tracking-widest text-gold mask-x"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
      <div className="flex whitespace-nowrap">
        <div className="flex shrink-0 items-center gap-16 px-4 animate-scroll-marquee">
          {repeated.map((item, index) => (
            <div key={index} className="flex items-center gap-2.5">
              {item.icon}
              <span className="font-semibold uppercase">{item.text}</span>
              <span className="h-1.5 w-1.5 rounded-full bg-gold/30 mx-2" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
