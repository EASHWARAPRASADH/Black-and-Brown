import React, { Suspense, lazy, useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import {
  Scissors,
  Sparkles,
  Palette,
  Star,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Quote,
  MapPin,
  Clock,
  Phone,
  GraduationCap,
  Calendar,
  ArrowDown
} from 'lucide-react';
import {
  HERO_CONTENT,
  ABOUT_STUDIO,
  SERVICES_PREVIEW,
  TRAINING_PREVIEW,
  STATS,
  TESTIMONIALS,
  CONTACT_INFO,
  SERVICE_CATEGORIES,
  TEAM_MEMBERS
} from '../data';
import AnimatedNumber from './AnimatedNumber';
import {
  Reveal,
  Stagger,
  StaggerItem,
  TextReveal,
  SectionHeading,
  TiltCard,
  MagneticButton,
  ParallaxImage,
  Marquee,
  TiltedCard,
  CircularText,
  Aurora,
  EASE
} from './ui';

const Hero3DScene = lazy(() => import('./Hero3DScene'));

/** Real studio photos that float around the hero copy (desktop) / strip below it (mobile). */
const HERO_CARDS = [
  { src: '/img/gallery7.jpeg', tag: 'Colour', caption: 'Rose gold balayage', pos: 'left-[3%] xl:left-[6%] top-[12%]', size: 'w-[130px] h-[170px] xl:w-[170px] xl:h-[220px]', rotate: -8, depth: 1.5, delay: 0 },
  { src: '/img/gallery8.jpeg', tag: 'Nails', caption: 'Gel nail art', pos: 'left-[7%] xl:left-[12%] bottom-[12%]', size: 'w-[110px] h-[140px] xl:w-[140px] xl:h-[170px]', rotate: 6, depth: 0.8, delay: 1.2 },
  { src: '/img/gallery4.jpeg', tag: 'Bridal', caption: 'Floral bridal braid', pos: 'right-[3%] xl:right-[6%] top-[10%]', size: 'w-[125px] h-[165px] xl:w-[160px] xl:h-[210px]', rotate: 7, depth: 1.25, delay: 0.6 },
  { src: '/img/classtraining.png', tag: 'Academy', caption: 'Live model training', pos: 'right-[6%] xl:right-[11%] bottom-[10%]', size: 'w-[150px] h-[115px] xl:w-[190px] xl:h-[150px]', rotate: -5, depth: 1.0, delay: 1.8 }
];

interface HomeViewProps {
  setCurrentPage: (page: string) => void;
  onOpenBooking: () => void;
  onOpenAcademyEnroll: () => void;
}

const SERVICE_ICONS: Record<string, React.ReactNode> = {
  Scissors: <Scissors className="h-6 w-6" />,
  Sparkles: <Sparkles className="h-6 w-6" />,
  Palette: <Palette className="h-6 w-6" />
};

export default function HomeView({ setCurrentPage, onOpenBooking, onOpenAcademyEnroll }: HomeViewProps) {
  /* ---------- Hero pointer parallax ---------- */
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 50, damping: 18 });
  const sy = useSpring(my, { stiffness: 50, damping: 18 });
  const orbX = useTransform(sx, (v) => v * -2.2);
  const orbY = useTransform(sy, (v) => v * -2.2);

  const onHeroMove = (e: React.MouseEvent) => {
    const { innerWidth, innerHeight } = window;
    mx.set((e.clientX / innerWidth - 0.5) * 18);
    my.set((e.clientY / innerHeight - 0.5) * 18);
  };

  const onHeroTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      const touch = e.touches[0];
      const { innerWidth, innerHeight } = window;
      mx.set((touch.clientX / innerWidth - 0.5) * 18);
      my.set((touch.clientY / innerHeight - 0.5) * 18);
    }
  };

  /* Ambient floating oscillation when idle or on mobile */
  useEffect(() => {
    let frameId: number;
    const startTime = performance.now();
    const animateIdle = (now: number) => {
      const elapsed = (now - startTime) / 1000;
      const idleX = Math.sin(elapsed * 0.5) * 4;
      const idleY = Math.cos(elapsed * 0.4) * 3;
      if (Math.abs(mx.get()) < 6 && Math.abs(my.get()) < 6) {
        mx.set(idleX);
        my.set(idleY);
      }
      frameId = requestAnimationFrame(animateIdle);
    };
    frameId = requestAnimationFrame(animateIdle);
    return () => cancelAnimationFrame(frameId);
  }, [mx, my]);

  /* Load the WebGL scene on capable, motion-friendly devices */
  const [show3D, setShow3D] = useState(false);
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!reduce) setShow3D(true);
  }, []);

  const marqueeItems = [
    ...SERVICE_CATEGORIES.map((c) => c.title),
    'Kryolan Certified Makeup',
    'Live Model Training',
    'Bridal Styling'
  ];

  const goTo = (page: string) => setCurrentPage(page);

  return (
    <div id="home-view-container" className="overflow-x-hidden">
      {/* ================= HERO ================= */}
      <section
        id="hero-section"
        onMouseMove={onHeroMove}
        onTouchMove={onHeroTouchMove}
        className="relative min-h-[92vh] bg-ink flex items-center justify-center overflow-hidden py-20 px-4 grain"
      >
        {/* Aurora ribbons */}
        <Aurora intensity={0.28} />

        {/* Ambient orbs */}
        <motion.div style={{ x: orbX, y: orbY }} className="absolute inset-0 opacity-20 pointer-events-none">
          <motion.div
            animate={{ x: [0, 30, -20, 0], y: [0, -20, 15, 0] }}
            transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-[-20%] left-[-10%] w-[60%] h-[70%] rounded-full bg-gold blur-[150px]"
          />
          <motion.div
            animate={{ x: [0, -25, 20, 0], y: [0, 25, -15, 0] }}
            transition={{ duration: 17, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[70%] rounded-full bg-gold-deep blur-[130px]"
          />
        </motion.div>

        {/* Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.05 }}
          transition={{ duration: 2, delay: 0.8 }}
          className="absolute inset-0 pointer-events-none"
        >
          <div className="w-full h-full bg-[linear-gradient(to_right,#C5A880_1px,transparent_1px),linear-gradient(to_bottom,#C5A880_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_at_center,#000_30%,transparent_75%)]" />
        </motion.div>

        {/* Rotating rings */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 70, repeat: Infinity, ease: 'linear' }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] sm:w-[520px] sm:h-[520px] md:w-[760px] md:h-[760px] rounded-full border border-dashed border-gold/10 pointer-events-none"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 50, repeat: Infinity, ease: 'linear' }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[240px] h-[240px] sm:w-[360px] sm:h-[360px] md:w-[540px] md:h-[540px] rounded-full border border-gold/10 pointer-events-none"
        >
          <span className="absolute -top-1 left-1/2 h-2 w-2 rounded-full bg-gold shadow-[0_0_14px_3px_rgba(230,213,184,0.6)]" />
        </motion.div>

        {show3D && (
          <Suspense fallback={null}>
            <Hero3DScene />
          </Suspense>
        )}

        {/* Floating studio photo cards (desktop) */}
        <div className="hidden lg:block absolute inset-0 z-[5] pointer-events-none">
          {HERO_CARDS.map((card, i) => (
            <motion.div
              key={card.src}
              initial={{ opacity: 0, y: 40, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 1.1 + i * 0.15, duration: 0.9, ease: EASE }}
              className={`absolute pointer-events-auto ${card.pos} ${card.size}`}
            >
              <TiltedCard
                src={card.src}
                alt={card.caption}
                tag={card.tag}
                caption={card.caption}
                width="100%"
                height="100%"
                rotate={card.rotate}
                parallaxX={sx}
                parallaxY={sy}
                depth={card.depth}
                floatDelay={card.delay}
                onClick={() => goTo('gallery')}
              />
            </motion.div>
          ))}
        </div>

        {/* Vertical editorial label */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.6, duration: 1 }}
          className="hidden lg:flex absolute left-8 top-1/2 -translate-y-1/2 items-center gap-4 [writing-mode:vertical-rl] rotate-180 text-[9px] font-mono tracking-[0.4em] uppercase text-gold/40"
        >
          <span>Est. 2022</span>
          <span className="h-10 w-px bg-gold/30" />
          <span>Karaikal · Puducherry</span>
        </motion.div>

        {/* Hero content */}
        <motion.div style={{ x: sx, y: sy }} className="relative max-w-5xl mx-auto text-center z-10 space-y-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.1 }}
          >
            <motion.span
              animate={{
                boxShadow: [
                  '0 0 0px rgba(230,213,184,0)',
                  '0 0 24px rgba(230,213,184,0.18)',
                  '0 0 0px rgba(230,213,184,0)'
                ]
              }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-mono uppercase tracking-[0.25em] glass text-gold font-semibold"
            >
              <Sparkles className="h-3 w-3 text-gold-deep animate-pulse" /> Salon & Academy of Hair & Beauty
            </motion.span>
          </motion.div>

          <div className="space-y-3">
            <TextReveal
              as="h1"
              inView={false}
              text={HERO_CONTENT.heading}
              delay={0.25}
              stagger={0.09}
              className="font-serif text-[46px] sm:text-6xl md:text-[80px] lg:text-[74px] xl:text-[92px] font-light italic tracking-tight text-cream leading-[1.02]"
            />
            <motion.p
              initial={{ opacity: 0, y: 18, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 1, delay: 0.85, ease: EASE }}
              className="font-serif italic text-2xl sm:text-4xl md:text-5xl font-light tracking-wide text-shimmer"
            >
              {HERO_CONTENT.subheading}
            </motion.p>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.05, ease: EASE }}
            className="max-w-2xl mx-auto text-sm sm:text-base text-gold/70 font-light leading-relaxed tracking-wide"
          >
            {HERO_CONTENT.tagline}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2, ease: EASE }}
            className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <MagneticButton
              id="hero-cta-services"
              size="lg"
              onClick={() => goTo('services')}
              iconRight={<ArrowRight className="h-4 w-4" />}
              className="w-full sm:w-auto"
            >
              View Services Menu
            </MagneticButton>
            <MagneticButton
              id="hero-cta-training"
              size="lg"
              variant="outline"
              onClick={onOpenAcademyEnroll}
              icon={<GraduationCap className="h-4 w-4" />}
              className="w-full sm:w-auto"
            >
              Join Academy Training
            </MagneticButton>
          </motion.div>

          {/* Trust row: founders' avatars + proof points */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.4, ease: EASE }}
            className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <div className="flex -space-x-3">
              {TEAM_MEMBERS.map((m, i) => (
                <motion.img
                  key={m.name}
                  src={m.image}
                  alt={m.name}
                  referrerPolicy="no-referrer"
                  initial={{ opacity: 0, x: -10, scale: 0.6 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  transition={{ delay: 1.5 + i * 0.1, type: 'spring', stiffness: 260, damping: 18 }}
                  className="h-10 w-10 rounded-full border-2 border-ink object-cover shadow-lg"
                  style={{ zIndex: 10 - i }}
                />
              ))}
              <span className="h-10 w-10 rounded-full border-2 border-ink bg-gradient-to-br from-gold to-gold-deep text-ink text-[10px] font-bold flex items-center justify-center">
                +
              </span>
            </div>
            <div className="text-center sm:text-left">
              <span className="block text-xs sm:text-sm text-cream font-medium">
                Trusted by <AnimatedNumber value="500+" /> graduates & salon clients
              </span>
              <span className="block text-[9px] font-mono text-gold/50 uppercase tracking-[0.25em] mt-0.5">
                Kryolan certified · Est. 2022 · Karaikal
              </span>
            </div>
          </motion.div>

          {/* Mobile / tablet photo strip */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.1, delayChildren: 1.5 } }, hidden: {} }}
            className="lg:hidden flex items-end justify-center gap-3 pt-4"
          >
            {HERO_CARDS.map((card, i) => (
              <motion.button
                key={card.src}
                onClick={() => goTo('gallery')}
                variants={{
                  hidden: { opacity: 0, y: 30, rotate: 0 },
                  visible: {
                    opacity: 1,
                    y: [0, -6, 0],
                    rotate: [card.rotate * 0.6, card.rotate * 0.6 + (i % 2 === 0 ? 2 : -2), card.rotate * 0.6],
                    transition: {
                      y: { repeat: Infinity, duration: 3.5 + i * 0.5, ease: 'easeInOut', delay: 1.8 + i * 0.2 },
                      rotate: { repeat: Infinity, duration: 4 + i * 0.5, ease: 'easeInOut', delay: 1.8 + i * 0.2 },
                      opacity: { duration: 0.6, delay: 1.5 + i * 0.1 }
                    }
                  }
                }}
                whileTap={{ scale: 0.95 }}
                className={`relative overflow-hidden rounded-xl gold-frame shadow-2xl ${i % 2 === 0 ? 'h-24 w-[72px]' : 'h-20 w-[64px] mb-2'}`}
                aria-label={card.caption}
              >
                <img src={card.src} alt={card.caption} className="h-full w-full object-cover" />
                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/90 to-transparent px-1.5 pb-1 pt-4 text-[7px] font-mono uppercase tracking-widest text-gold text-left">
                  {card.tag}
                </span>
              </motion.button>
            ))}
          </motion.div>

          {/* Circular scroll badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.9, duration: 0.8, ease: EASE }}
            className="pt-4 flex justify-center"
          >
            <CircularText text="SCROLL · EXPLORE · BLACK & BROWN · " size={104} className="text-gold/50">
              <motion.span
                animate={{ y: [0, 5, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                className="h-10 w-10 rounded-full glass flex items-center justify-center text-gold"
              >
                <ArrowDown className="h-4 w-4" />
              </motion.span>
            </CircularText>
          </motion.div>
        </motion.div>

        {/* Floor location tag */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="hidden lg:flex absolute bottom-6 right-8 items-center gap-2 text-[9px] font-mono tracking-[0.3em] text-gold/40"
        >
          <span>KARAIKAL</span>
          <motion.span
            animate={{ scale: [1, 1.5, 1], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            className="h-1 w-1 bg-gold rounded-full"
          />
          <span>PUDUCHERRY</span>
        </motion.div>

        <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-ink to-transparent pointer-events-none" />
      </section>

      {/* ================= KEYWORD MARQUEE ================= */}
      <div className="relative border-y border-gold/10 bg-ink-2 py-5">
        <Marquee
          items={marqueeItems}
          className="font-serif italic text-lg sm:text-xl text-gold/55"
          separator={<Sparkles className="h-3.5 w-3.5 text-gold-deep/70" />}
        />
      </div>

      {/* ================= ABOUT PREVIEW ================= */}
      <section id="about-preview" className="relative py-28 px-4 bg-ink overflow-hidden">
        <div className="absolute -left-40 top-20 w-[480px] h-[480px] rounded-full bg-gold/5 blur-[120px] pointer-events-none" />
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-14 lg:gap-20 items-center">
            <div className="lg:col-span-7 space-y-7">
              <SectionHeading
                align="left"
                eyebrow="About Our Studio"
                title={ABOUT_STUDIO.title}
              />
              <Reveal delay={0.1}>
                <p className="text-gold/70 text-sm sm:text-base leading-relaxed font-light">{ABOUT_STUDIO.description}</p>
              </Reveal>

              <Stagger className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {[
                  { t: 'Master Stylists', d: 'Certified educators delivering luxury trends safely.' },
                  { t: 'Professional Academy', d: 'Intense programs launching high-paying beauty careers.' }
                ].map((item) => (
                  <StaggerItem key={item.t}>
                    <div className="group relative p-5 rounded-2xl bg-ink-3 border border-gold/10 hover:border-gold/40 transition-colors duration-500 overflow-hidden">
                      <span className="absolute left-0 top-4 bottom-4 w-[2px] bg-gradient-to-b from-gold to-gold-deep rounded-full" />
                      <span className="block font-serif text-lg text-cream">{item.t}</span>
                      <p className="text-xs text-gold/60 font-light mt-1.5 leading-relaxed">{item.d}</p>
                    </div>
                  </StaggerItem>
                ))}
              </Stagger>

              <Reveal delay={0.15}>
                <button
                  id="about-cta-more"
                  onClick={() => goTo('about')}
                  className="link-underline inline-flex items-center gap-2 group text-[11px] font-bold tracking-[0.22em] uppercase text-gold hover:text-cream transition-colors"
                >
                  Our Founders & Facilities Story
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </button>
              </Reveal>
            </div>

            <Reveal direction="left" distance={40} className="lg:col-span-5 relative">
              <div className="relative z-10 rounded-3xl gold-frame overflow-hidden shadow-[0_40px_80px_-30px_rgba(0,0,0,0.9)]">
                <ParallaxImage src="/img/product1.jpeg" alt="Black and Brown Salon Experience" className="h-[420px] sm:h-[480px]">
                  <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
                    <div>
                      <span className="text-[10px] font-mono tracking-[0.3em] block text-gold-deep font-bold">ESTD. 2022</span>
                      <span className="font-serif text-xl text-cream">Bespoke Hair & Skin Care</span>
                    </div>
                    <span className="glass rounded-full px-3 py-1.5 text-[9px] font-mono tracking-widest uppercase text-gold">Karaikal</span>
                  </div>
                </ParallaxImage>
              </div>
              <motion.div
                animate={{ rotate: [0, 1.5, 0, -1.5, 0] }}
                transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute top-6 -right-5 -bottom-5 left-6 border border-gold/25 rounded-3xl pointer-events-none"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, type: 'spring', stiffness: 200, damping: 16 }}
                className="absolute left-4 sm:-left-8 bottom-24 sm:bottom-16 z-20 glass rounded-2xl px-5 py-4 shadow-2xl animate-float"
              >
                <span className="block font-mono text-2xl font-bold text-cream">
                  <AnimatedNumber value="98%" />
                </span>
                <span className="block text-[9px] font-mono tracking-[0.25em] uppercase text-gold/60">Satisfaction</span>
              </motion.div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ================= SERVICES PREVIEW ================= */}
      <section id="services-preview-section" className="relative py-28 px-4 bg-ink-2 border-y border-gold/10 overflow-hidden">
        <div className="absolute right-0 top-0 w-[420px] h-[420px] bg-gold-deep/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="max-w-6xl mx-auto space-y-14">
          <SectionHeading
            eyebrow="What We Do Best"
            title="Salon Artistry Previews"
            description="We customize haircut shapes, hair conditioning formulas, and deep color balayages to look outstanding on you."
          />

          <Stagger className="grid grid-cols-1 md:grid-cols-3 gap-6" stagger={0.12}>
            {SERVICES_PREVIEW.map((srv, idx) => (
              <StaggerItem key={srv.title} className="h-full">
                <TiltCard
                  id={`home-service-card-${idx}`}
                  onClick={() => goTo('services')}
                  className="group h-full p-8 rounded-3xl bg-ink-3 border border-gold/10 hover:border-gold/40 transition-colors duration-500 flex flex-col justify-between cursor-pointer shadow-[0_30px_60px_-40px_rgba(0,0,0,0.9)]"
                >
                  <div className="space-y-5">
                    <div className="flex items-start justify-between">
                      <div className="p-3.5 w-fit rounded-2xl bg-ink border border-gold/20 text-gold group-hover:bg-gold group-hover:text-ink group-hover:border-gold transition-all duration-500 group-hover:rotate-[-6deg]">
                        {SERVICE_ICONS[srv.icon] ?? <Scissors className="h-6 w-6" />}
                      </div>
                      <span className="font-mono text-[11px] text-gold/30 tracking-[0.3em]">0{idx + 1}</span>
                    </div>
                    <h3 className="font-serif text-2xl text-cream group-hover:text-gradient-gold transition-colors">{srv.title}</h3>
                    <p className="text-sm text-gold/60 font-light leading-relaxed">{srv.description}</p>
                  </div>

                  <div className="pt-6 border-t border-gold/10 mt-8 flex items-center justify-between text-[11px] font-semibold tracking-[0.2em] uppercase text-gold/70">
                    <span className="group-hover:text-cream transition-colors">View Menu Price</span>
                    <span className="h-8 w-8 rounded-full border border-gold/20 flex items-center justify-center group-hover:bg-gold group-hover:text-ink transition-all duration-500">
                      <ArrowRight className="h-3.5 w-3.5 transition-transform duration-500 group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </TiltCard>
              </StaggerItem>
            ))}
          </Stagger>

          <Reveal className="text-center pt-2">
            <MagneticButton
              id="cta-view-full-services"
              variant="dark"
              onClick={() => goTo('services')}
              iconRight={<ArrowRight className="h-4 w-4" />}
            >
              Explore Full Menu & Combos
            </MagneticButton>
          </Reveal>
        </div>
      </section>

      {/* ================= ACADEMY + STATS ================= */}
      <section id="academy-preview-section" className="relative py-28 px-4 bg-ink text-cream overflow-hidden grain">
        <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[800px] h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-5">
              <Stagger className="grid grid-cols-2 gap-4" stagger={0.1}>
                {STATS.map((stat, idx) => (
                  <StaggerItem key={stat.label}>
                    <TiltCard
                      id={`home-stat-${idx}`}
                      maxTilt={5}
                      className="p-6 rounded-2xl bg-ink-3 border border-gold/10 hover:border-gold/40 text-center space-y-1 transition-colors duration-500"
                    >
                      <span className="block font-mono text-3xl sm:text-4xl font-extrabold text-cream tracking-tight">
                        <AnimatedNumber value={stat.value} />
                      </span>
                      <span className="block text-[10px] font-mono text-gold/50 uppercase tracking-[0.25em] font-semibold">
                        {stat.label}
                      </span>
                    </TiltCard>
                  </StaggerItem>
                ))}
                <StaggerItem className="col-span-2">
                  <div className="relative p-5 rounded-2xl gold-frame bg-ink-3/60 text-center overflow-hidden">
                    <Quote className="absolute -top-2 -left-1 h-10 w-10 text-gold/10 rotate-180" />
                    <span className="font-serif text-sm italic text-gold">“Techniques passed down from elite founders”</span>
                  </div>
                </StaggerItem>
              </Stagger>
            </div>

            <div className="lg:col-span-7 space-y-7">
              <SectionHeading align="left" eyebrow="Professional Academy" title={TRAINING_PREVIEW.title} />
              <Reveal>
                <p className="text-gold/70 text-sm sm:text-base font-light leading-relaxed">{TRAINING_PREVIEW.description}</p>
              </Reveal>

              <Stagger className="space-y-3 pt-1" stagger={0.1}>
                {[
                  'Hair Foundations, Advanced Cuts & Fade mastery',
                  'Chemical, balayage, highlight foils & skin analysis care',
                  'Social Media Reels, Portfolio curation & Salon Business fundamentals'
                ].map((line) => (
                  <StaggerItem key={line}>
                    <div className="flex items-center gap-3 group">
                      <span className="h-7 w-7 rounded-full bg-ink-3 border border-gold/20 flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-ink transition-all duration-500">
                        <CheckCircle2 className="h-4 w-4" />
                      </span>
                      <span className="text-sm text-gold/80 font-light">{line}</span>
                    </div>
                  </StaggerItem>
                ))}
              </Stagger>

              <Reveal delay={0.1} className="pt-3 flex flex-col sm:flex-row gap-4">
                <MagneticButton id="academy-preview-enroll-btn" onClick={onOpenAcademyEnroll} icon={<GraduationCap className="h-4 w-4" />}>
                  Apply Online Now
                </MagneticButton>
                <MagneticButton id="academy-preview-courses-btn" variant="outline" onClick={() => goTo('training')} iconRight={<ArrowRight className="h-4 w-4" />}>
                  Browse Academy Catalog
                </MagneticButton>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ================= TESTIMONIALS ================= */}
      <section id="testimonials-section" className="relative py-28 px-4 bg-ink-2 border-t border-gold/10">
        <div className="max-w-5xl mx-auto space-y-14">
          <SectionHeading eyebrow="Success Stories" title="Client & Graduate Love Notes" />

          <Stagger className="grid grid-cols-1 md:grid-cols-2 gap-6" stagger={0.15}>
            {TESTIMONIALS.map((t, idx) => (
              <StaggerItem key={t.author} className="h-full">
                <TiltCard
                  id={`home-testimonial-${idx}`}
                  maxTilt={4}
                  className="relative h-full p-8 sm:p-10 rounded-3xl bg-ink-3 border border-gold/10 hover:border-gold/35 transition-colors duration-500 flex flex-col justify-between"
                >
                  <motion.span
                    initial={{ opacity: 0, rotate: 160, scale: 0.6 }}
                    whileInView={{ opacity: 1, rotate: 180, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + idx * 0.1, type: 'spring', stiffness: 180, damping: 14 }}
                    className="absolute top-6 right-6"
                  >
                    <Quote className="h-12 w-12 text-gold/15" />
                  </motion.span>

                  <div className="space-y-5">
                    <div className="flex gap-1">
                      {[...Array(t.rating)].map((_, i) => (
                        <motion.span
                          key={i}
                          initial={{ opacity: 0, scale: 0, rotate: -40 }}
                          whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.25 + i * 0.07, type: 'spring', stiffness: 300, damping: 14 }}
                        >
                          <Star className="h-4 w-4 fill-gold-deep text-gold-deep" />
                        </motion.span>
                      ))}
                    </div>
                    <p className="font-serif italic text-base sm:text-lg text-cream/90 leading-relaxed font-light">“{t.text}”</p>
                  </div>

                  <div className="mt-8 pt-5 border-t border-gold/10 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="h-10 w-10 rounded-full bg-gradient-to-br from-gold to-bronze flex items-center justify-center font-serif text-ink font-bold">
                        {t.author.charAt(0)}
                      </span>
                      <div>
                        <span className="block text-sm font-semibold text-cream">{t.author}</span>
                        <span className="block text-[10px] font-mono text-gold/60 uppercase tracking-[0.2em] mt-0.5">{t.role}</span>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 text-[9px] font-mono glass rounded-full text-gold font-semibold uppercase tracking-widest">
                      Verified
                    </span>
                  </div>
                </TiltCard>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ================= CONTACT STRIP ================= */}
      <section id="contact-strip" className="relative overflow-hidden px-4 py-16 bg-ink border-y border-gold/15">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(230,213,184,0.08),transparent_55%),radial-gradient(ellipse_at_bottom_right,rgba(201,169,97,0.08),transparent_55%)] pointer-events-none" />
        <div className="relative max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-10">
          <Reveal direction="right" className="space-y-4 text-center lg:text-left">
            <h3 className="font-serif text-2xl sm:text-3xl text-cream tracking-tight">Ready to Upgrade Your Style or Career?</h3>
            <p className="text-sm text-gold/65 font-light max-w-xl">
              We are located above Kumaran Medical, Karaikal. Drop by or schedule in seconds.
            </p>
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 pt-1">
              {CONTACT_INFO.hours.map((h) => (
                <span key={h.days} className="inline-flex items-center gap-1.5 glass rounded-full px-3 py-1.5 text-[10px] font-mono text-gold/80">
                  <Clock className="h-3 w-3 text-gold-deep" />
                  {h.days}: {h.time}
                </span>
              ))}
              <span className="inline-flex items-center gap-1.5 glass rounded-full px-3 py-1.5 text-[10px] font-mono text-gold/80">
                <MapPin className="h-3 w-3 text-gold-deep" /> Thalatheru, Karaikal
              </span>
            </div>
          </Reveal>

          <Reveal direction="left" className="flex gap-4 shrink-0 w-full lg:w-auto flex-col sm:flex-row">
            <MagneticButton id="strip-book-btn" size="lg" onClick={onOpenBooking} icon={<Calendar className="h-4 w-4" />} className="w-full sm:w-auto">
              Book Salon Appointment
            </MagneticButton>
            <a
              id="strip-phone-btn"
              href={`tel:${CONTACT_INFO.phone.replace(/\s+/g, '')}`}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-9 py-4 border border-gold/30 text-gold hover:text-ink hover:bg-gold font-semibold text-xs tracking-[0.18em] uppercase transition-colors duration-300 rounded-full"
            >
              <Phone className="h-4 w-4" />
              Call {CONTACT_INFO.phone}
            </a>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
