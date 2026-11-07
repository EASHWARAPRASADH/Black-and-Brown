import React, { useEffect, useState } from 'react';
import { Scissors, Phone, Mail, MapPin, ExternalLink, ArrowUpRight, Clock } from 'lucide-react';
import { CONTACT_INFO } from '../data';
import { Reveal, Stagger, StaggerItem } from './ui';

interface FooterProps {
  setCurrentPage: (page: string) => void;
  onOpenBooking: () => void;
  onOpenAcademyEnroll: () => void;
}

/** Mon–Sat 09:00–20:00, Sun 10:00–18:00 (mirrors CONTACT_INFO.hours). */
function isOpenNow(now: Date): boolean {
  const day = now.getDay(); // 0 = Sunday
  const minutes = now.getHours() * 60 + now.getMinutes();
  const [open, close] = day === 0 ? [10 * 60, 18 * 60] : [9 * 60, 20 * 60];
  return minutes >= open && minutes < close;
}

export default function Footer({ setCurrentPage, onOpenBooking, onOpenAcademyEnroll }: FooterProps) {
  const currentYear = new Date().getFullYear();
  const [open, setOpen] = useState<boolean>(() => isOpenNow(new Date()));

  useEffect(() => {
    const t = setInterval(() => setOpen(isOpenNow(new Date())), 60_000);
    return () => clearInterval(t);
  }, []);

  const quickLinks = [
    { id: 'home', label: 'Home Studio' },
    { id: 'services', label: 'Salon Services List' },
    { id: 'training', label: 'Academy Training Programs' },
    { id: 'gallery', label: 'Gallery Lookbook Portfolio' },
    { id: 'about', label: 'About Our Vision & Team' }
  ];

  const linkClass =
    'group inline-flex items-center gap-1.5 text-left text-xs text-gold/75 hover:text-cream transition-colors font-light';

  return (
    <footer id="app-footer" className="relative bg-ink text-gold overflow-hidden pt-20 pb-8">
      <div className="hairline absolute top-0 inset-x-0" />
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full bg-gold/5 blur-[150px] pointer-events-none" />

      {/* Oversized watermark */}
      <div aria-hidden className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-full text-center pointer-events-none select-none overflow-hidden">
        <span className="font-serif italic whitespace-nowrap text-[18vw] leading-none tracking-[0.1em] text-gradient-gold opacity-[0.04]">
          BLACK & BROWN
        </span>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Stagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-14" stagger={0.1}>
          {/* Brand */}
          <StaggerItem className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 glass rounded-xl text-gold">
                <Scissors className="h-5 w-5" />
              </div>
              <div>
                <span className="block font-serif text-xl tracking-[0.2em] text-cream">BLACK & BROWN</span>
                <p className="text-[8px] font-mono tracking-[0.3em] text-gold-deep uppercase -mt-0.5 font-semibold">Salon & Academy</p>
              </div>
            </div>
            <p className="text-xs text-gold/65 leading-relaxed font-light">
              Where style meets education. Our double vision blends award-winning master aesthetics practice with precision classroom academy paths, raising global fashion excellence directly in Karaikal.
            </p>
            <div className="pt-1">
              <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-gold-deep block mb-2 font-semibold">Core values</span>
              <div className="flex flex-wrap gap-2">
                {['Excellence', 'Inclusivity', 'Innovation', 'Growth'].map((val) => (
                  <span key={val} className="px-2.5 py-1 text-[9px] font-mono glass rounded-full text-gold/80">
                    {val}
                  </span>
                ))}
              </div>
            </div>
          </StaggerItem>

          {/* Quick links */}
          <StaggerItem className="space-y-5">
            <h3 className="font-serif text-sm tracking-[0.2em] text-gold-deep uppercase">Quick Links</h3>
            <div className="grid grid-cols-1 gap-2.5">
              {quickLinks.map((l) => (
                <button key={l.id} id={`footer-link-${l.id}`} onClick={() => setCurrentPage(l.id)} className={linkClass}>
                  <span className="link-underline">{l.label}</span>
                  <ArrowUpRight className="h-3 w-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                </button>
              ))}
              <button id="footer-link-book" onClick={onOpenBooking} className={`${linkClass} !text-gold hover:!text-cream`}>
                <span className="link-underline">Secure Salon Appointment</span>
                <ArrowUpRight className="h-3 w-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
              </button>
              <button id="footer-link-enroll" onClick={onOpenAcademyEnroll} className={`${linkClass} !text-gold hover:!text-cream`}>
                <span className="link-underline">Enroll in Academy Courses</span>
                <ArrowUpRight className="h-3 w-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
              </button>
            </div>
          </StaggerItem>

          {/* Contact */}
          <StaggerItem className="space-y-5">
            <h3 className="font-serif text-sm tracking-[0.2em] text-gold-deep uppercase">Contact Channels</h3>
            <div className="space-y-3.5">
              <a id="footer-phone-link" href={`tel:${CONTACT_INFO.phone.replace(/\s+/g, '')}`} className="flex items-start gap-3 group text-xs text-gold/75 hover:text-cream transition-colors">
                <span className="p-2 rounded-lg bg-ink-3 border border-gold/15 text-gold group-hover:bg-gold group-hover:text-ink group-hover:border-gold transition-all duration-300">
                  <Phone className="h-3.5 w-3.5" />
                </span>
                <span>
                  <span className="block text-[10px] font-mono text-gold/45 font-semibold uppercase tracking-wider">Phone Support</span>
                  <span className="font-mono">{CONTACT_INFO.phone}</span>
                </span>
              </a>

              <a id="footer-email-link" href={`mailto:${CONTACT_INFO.email}`} className="flex items-start gap-3 group text-xs text-gold/75 hover:text-cream transition-colors">
                <span className="p-2 rounded-lg bg-ink-3 border border-gold/15 text-gold group-hover:bg-gold group-hover:text-ink group-hover:border-gold transition-all duration-300">
                  <Mail className="h-3.5 w-3.5" />
                </span>
                <span>
                  <span className="block text-[10px] font-mono text-gold/45 font-semibold uppercase tracking-wider">Email Queries</span>
                  <span className="break-all">{CONTACT_INFO.email}</span>
                </span>
              </a>

              <div className="flex items-start gap-3 group text-xs text-gold/75">
                <span className="p-2 rounded-lg bg-ink-3 border border-gold/15 text-gold group-hover:bg-gold group-hover:text-ink group-hover:border-gold transition-all duration-300">
                  <MapPin className="h-3.5 w-3.5" />
                </span>
                <span>
                  <span className="block text-[10px] font-mono text-gold/45 font-semibold uppercase tracking-wider">Our Studio Address</span>
                  <p className="leading-relaxed font-light">{CONTACT_INFO.address}</p>
                </span>
              </div>
            </div>
          </StaggerItem>

          {/* Hours */}
          <StaggerItem className="space-y-5">
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-serif text-sm tracking-[0.2em] text-gold-deep uppercase">Opening Hours</h3>
              <span
                id="footer-open-status"
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-mono uppercase tracking-widest font-semibold glass ${
                  open ? 'text-emerald-400' : 'text-rose-300'
                }`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${open ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`} />
                {open ? 'Open now' : 'Closed now'}
              </span>
            </div>
            <div className="space-y-3 border-l border-gold/15 pl-4 py-1">
              {CONTACT_INFO.hours.map((schedule) => (
                <div key={schedule.days} className="text-xs flex items-start gap-2">
                  <Clock className="h-3.5 w-3.5 text-gold-deep mt-0.5 shrink-0" />
                  <div>
                    <span className="block text-[10px] font-mono text-gold/60 uppercase tracking-widest font-semibold">{schedule.days}</span>
                    <span className="text-cream/85 font-light block mt-0.5">{schedule.time}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="pt-1">
              <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1.5 font-semibold uppercase tracking-wider">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse inline-block" />
                Accepting Client Bookings
              </span>
            </div>
          </StaggerItem>
        </Stagger>

        {/* Map */}
        <Reveal className="mt-10">
          <h3 className="font-serif text-sm tracking-[0.2em] text-gold-deep uppercase mb-4">Find Us on the Map</h3>
          <div className="w-full h-64 sm:h-72 rounded-2xl gold-frame overflow-hidden shadow-2xl">
            <iframe
              title="Black & Brown Salon Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3912.235!2d79.835!3d10.928!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a5521b2d0e2e5e5%3A0x5b5b5b5b5b5b5b5b!2sKumaran%20Medical%2C%20Bharathiyar%20St%2C%20Thalatheru%2C%20Karaikal!5e0!3m2!1sen!2sin!4v1700000000000"
              width="100%"
              height="100%"
              style={{ border: 0, filter: 'grayscale(60%) invert(10%)' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <p className="text-[10px] text-gold/50 mt-3 font-light">
            Above Kumaran Medical, Bharathiyar St, Kennadiyar Street, Thalatheru, Karaikal, Puducherry — 609605
          </p>
        </Reveal>

        {/* Bottom bar */}
        <Reveal direction="none" delay={0.1} className="mt-14 pt-8 border-t border-gold/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-gold/50 font-mono">
          <div>&copy; {currentYear} BLACK & BROWN. All rights reserved. Registered Studio & Academy.</div>
          <div className="flex items-center gap-1.5">
            <span>Powered By</span>
            <a
              id="powerby-link"
              href="https://technosprint.com"
              target="_blank"
              rel="noreferrer"
              className="link-underline text-gold hover:text-cream font-semibold tracking-wider transition-colors inline-flex items-center gap-1"
            >
              Technosprint Info Solutions
              <ExternalLink className="h-3 w-3 inline" />
            </a>
          </div>
        </Reveal>
      </div>
    </footer>
  );
}
