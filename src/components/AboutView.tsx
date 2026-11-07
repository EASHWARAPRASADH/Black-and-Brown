import React from 'react';
import { motion } from 'motion/react';
import { Check, Building, Scissors, ShieldCheck, Sparkles, Users, Target, Lightbulb, TrendingUp } from 'lucide-react';
import { OUR_STORY, MISSION_STATEMENT, CORE_VALUES, TEAM_MEMBERS, FACILITIES } from '../data';
import { Reveal, Stagger, StaggerItem, TextReveal, SectionHeading, TiltCard, ParallaxImage, EASE, viewportOnce } from './ui';

const VALUE_ICONS: Record<string, React.ReactNode> = {
  Excellence: <Target className="h-4 w-4" />,
  Inclusivity: <Users className="h-4 w-4" />,
  Innovation: <Lightbulb className="h-4 w-4" />,
  Growth: <TrendingUp className="h-4 w-4" />
};

const MILESTONES = [
  { label: '2022', text: 'Studio founded with two styling chairs' },
  { label: 'Academy', text: 'Professional training launched' },
  { label: 'Today', text: 'Premier destination for services & training' }
];

export default function AboutView() {
  return (
    <div id="about-view-root" className="relative py-20 px-4 bg-ink min-h-screen overflow-hidden">
      <div className="absolute -left-40 top-40 w-[520px] h-[520px] rounded-full bg-gold/5 blur-[140px] pointer-events-none" />
      <div className="absolute -right-40 bottom-40 w-[480px] h-[480px] rounded-full bg-gold-deep/5 blur-[140px] pointer-events-none" />

      <div className="relative max-w-6xl mx-auto space-y-24">
        {/* ================= STORY ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-14 items-center">
          <div className="lg:col-span-7 space-y-7">
            <SectionHeading as="h1" align="left" eyebrow="Our Foundations" title="Our Creative Story" />

            <Reveal delay={0.1}>
              <p className="text-sm sm:text-base text-gold/70 leading-relaxed font-light">{OUR_STORY.text}</p>
            </Reveal>

            <Reveal delay={0.15}>
              <div className="relative rounded-3xl gold-frame overflow-hidden shadow-[0_40px_80px_-30px_rgba(0,0,0,0.9)]">
                <ParallaxImage src="/img/creative-story.jpeg" alt="Black & Brown Creative Story" className="h-[220px] sm:h-[280px]">
                  <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/10 to-transparent" />
                  <span className="absolute bottom-4 left-4 font-mono text-[10px] tracking-[0.3em] text-gold-deep font-bold uppercase">
                    Our Journey in Color
                  </span>
                </ParallaxImage>
              </div>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="relative p-6 sm:p-7 glass gold-frame rounded-3xl overflow-hidden">
                <div className="absolute -top-4 -right-4 opacity-[0.07] pointer-events-none animate-spin-slow">
                  <Scissors className="h-28 w-28 text-gold" />
                </div>
                <span className="block text-[9px] font-mono tracking-[0.3em] text-gold-deep uppercase font-bold mb-3">Mission Statement</span>
                <TextReveal
                  as="p"
                  text={`“${MISSION_STATEMENT}”`}
                  stagger={0.025}
                  className="font-serif italic text-base sm:text-lg leading-relaxed text-cream/90"
                />
              </div>
            </Reveal>
          </div>

          {/* Founder portraits */}
          <Reveal direction="left" distance={40} className="lg:col-span-5 relative">
            <div className="grid grid-cols-2 gap-4">
              {[
                { src: '/img/msnandhani-about.jpeg', name: 'Mrs. Nandhini Mohamed', role: 'Co-Founder & Makeup Expert' },
                { src: '/img/gul-about.jpeg', name: 'Mr. Gul Mohamed', role: 'Co-Founder & Academy Director' }
              ].map((p, i) => (
                <div key={p.name} className={`relative z-10 rounded-3xl gold-frame overflow-hidden shadow-2xl ${i === 1 ? 'lg:translate-y-10' : ''}`}>
                  <ParallaxImage src={p.src} alt={`${p.name} — Co-Founder`} className="h-[240px] sm:h-[300px]" strength={30}>
                    <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3">
                      <span className="block font-serif text-sm text-cream">{p.name}</span>
                      <span className="block font-mono text-[9px] tracking-[0.2em] text-gold-deep uppercase font-bold">{p.role}</span>
                    </div>
                  </ParallaxImage>
                </div>
              ))}
            </div>
            <motion.div
              animate={{ rotate: [0, 1.5, 0, -1.5, 0] }}
              transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute top-4 -right-4 -bottom-4 left-4 border border-gold/25 rounded-3xl pointer-events-none"
            />
          </Reveal>
        </div>

        {/* ================= MILESTONES ================= */}
        <section id="story-milestones" className="relative">
          <div className="relative grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-4">
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={viewportOnce}
              transition={{ duration: 1.4, ease: EASE }}
              style={{ transformOrigin: '0% 50%' }}
              className="hidden sm:block absolute top-[14px] left-[16%] right-[16%] h-px bg-gradient-to-r from-gold-deep via-gold to-gold-deep"
            />
            {MILESTONES.map((m, i) => (
              <Reveal key={m.label} delay={0.25 + i * 0.2} className="relative flex sm:flex-col items-center gap-4 sm:gap-5 sm:text-center">
                <motion.span
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={viewportOnce}
                  transition={{ delay: 0.35 + i * 0.25, type: 'spring', stiffness: 260, damping: 16 }}
                  className="relative h-7 w-7 rounded-full bg-ink border border-gold flex items-center justify-center shrink-0"
                >
                  <span className="h-2.5 w-2.5 rounded-full bg-gold shadow-[0_0_12px_2px_rgba(230,213,184,0.6)]" />
                </motion.span>
                <div>
                  <span className="block font-mono text-[11px] tracking-[0.3em] uppercase text-gold-deep font-bold">{m.label}</span>
                  <span className="block font-serif text-base text-cream mt-1">{m.text}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ================= CORE VALUES ================= */}
        <section id="values-grid-wrapper" className="space-y-12 border-t border-gold/10 pt-20">
          <SectionHeading
            eyebrow="Standard Guidelines"
            title="Underlying Core Values"
            description="We operate and teach with four fundamental principles that form our studio's DNA."
          />

          <Stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5" stagger={0.1}>
            {CORE_VALUES.map((val, idx) => (
              <StaggerItem key={val.title} className="h-full">
                <TiltCard
                  id={`value-tile-${idx}`}
                  maxTilt={6}
                  className="group h-full p-6 rounded-3xl bg-ink-3 border border-gold/10 hover:border-gold/40 transition-colors duration-500"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2.5 rounded-xl bg-ink border border-gold/20 text-gold group-hover:bg-gold group-hover:text-ink group-hover:border-gold transition-all duration-500 group-hover:rotate-[-10deg]">
                      {VALUE_ICONS[val.title] ?? <Check className="h-4 w-4" />}
                    </div>
                    <h3 className="font-serif text-lg text-cream group-hover:text-gradient-gold transition-colors">{val.title}</h3>
                  </div>
                  <p className="text-xs text-gold/65 leading-relaxed font-light">{val.desc}</p>
                  <span className="block mt-5 font-mono text-[10px] text-gold/30 tracking-[0.3em]">0{idx + 1}</span>
                </TiltCard>
              </StaggerItem>
            ))}
          </Stagger>
        </section>

        {/* ================= TEAM ================= */}
        <section id="instructors-squad" className="space-y-12 border-t border-gold/10 pt-20">
          <SectionHeading
            eyebrow="Master Educators"
            title="Meet the Art Directors"
            description="Licensed founders and senior color specialists who balance active salon clientele with deep student tutoring."
          />

          <Stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" stagger={0.12}>
            {TEAM_MEMBERS.map((stylist, idx) => (
              <StaggerItem key={stylist.name} className="h-full">
                <TiltCard
                  id={`team-card-${idx}`}
                  maxTilt={4}
                  className="group h-full rounded-3xl bg-ink-3 border border-gold/10 hover:border-gold/40 overflow-hidden transition-colors duration-500 flex flex-col shadow-[0_30px_60px_-40px_rgba(0,0,0,0.9)]"
                >
                  <div className="relative overflow-hidden bg-ink-2 h-80">
                    <img
                      referrerPolicy="no-referrer"
                      src={stylist.image}
                      alt={stylist.name}
                      className="w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/10 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-500" />
                    <div className="absolute bottom-4 left-4 translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                      <span className="inline-flex items-center gap-1.5 text-[10px] font-mono text-gold uppercase tracking-widest font-semibold glass px-3 py-1.5 rounded-full">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Available for bookings
                      </span>
                    </div>
                  </div>

                  <div className="p-6 space-y-2 flex-1">
                    <div>
                      <h3 className="font-serif text-xl text-cream group-hover:text-gradient-gold transition-colors">{stylist.name}</h3>
                      <span className="text-[10px] font-mono text-gold-deep font-semibold uppercase tracking-[0.2em] block mt-1">{stylist.role}</span>
                    </div>
                    <p className="text-xs text-gold/65 leading-relaxed font-light pt-2">{stylist.bio}</p>
                  </div>

                  <div className="h-1 bg-ink-4 overflow-hidden">
                    <span className="block h-full bg-gradient-to-r from-gold-deep via-gold to-cream origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-700 ease-out" />
                  </div>
                </TiltCard>
              </StaggerItem>
            ))}
          </Stagger>
        </section>

        {/* ================= FACILITIES ================= */}
        <section id="facilities-exploration" className="space-y-12 border-t border-gold/10 pt-20">
          <SectionHeading
            eyebrow="The Luxury Space"
            title="World-Class Karaikal Facilities"
            description="Our salon and classroom academy covers premium zones detailed to guarantee absolute client safety and premium practical action."
          />

          <Stagger className="grid grid-cols-1 md:grid-cols-2 gap-5" stagger={0.1}>
            {FACILITIES.map((facility, idx) => (
              <StaggerItem key={facility.name} className="h-full">
                <TiltCard
                  id={`facility-tile-${idx}`}
                  maxTilt={4}
                  className="group h-full flex gap-5 p-6 rounded-3xl bg-ink-3 border border-gold/10 hover:border-gold/40 transition-colors duration-500"
                >
                  <div className="p-3.5 rounded-2xl bg-ink border border-gold/20 text-gold w-fit h-fit shrink-0 group-hover:bg-gold group-hover:text-ink group-hover:border-gold transition-all duration-500">
                    <Building className="h-5 w-5" />
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="font-serif text-lg text-cream">{facility.name}</h3>
                    <p className="text-xs text-gold/65 leading-relaxed font-light">{facility.desc}</p>
                  </div>
                </TiltCard>
              </StaggerItem>
            ))}
          </Stagger>

          <Reveal>
            <div className="relative p-8 gold-frame bg-ink-3/70 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden grain">
              <div className="relative space-y-2 text-center md:text-left">
                <span className="inline-flex items-center gap-2 text-[11px] font-mono text-gold-deep uppercase tracking-[0.3em] font-semibold">
                  <ShieldCheck className="h-4 w-4" /> Hygiene Assured
                </span>
                <p className="text-xs sm:text-sm text-gold/70 font-light max-w-2xl leading-relaxed">
                  We strictly use medical-grade UV sterilizers for all metal scissors, combs, hair clippers, and single-use towels. Both customers and students enjoy clean ambient environments.
                </p>
              </div>
              <span className="relative inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-gold/40 text-[10px] uppercase font-mono tracking-[0.25em] shrink-0 text-shimmer">
                <Sparkles className="h-3.5 w-3.5 text-gold-deep" />
                100% Certified Safe
              </span>
            </div>
          </Reveal>
        </section>
      </div>
    </div>
  );
}
