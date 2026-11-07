import React, { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { X, Eye, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { SectionHeading, TiltCard, MagneticButton, EASE } from './ui';

interface GalleryItem {
  id: string;
  category: 'cuts' | 'color' | 'skin' | 'academy' | 'bridal' | 'nails';
  title: string;
  technique: string;
  image: string;
  description: string;
}

const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'g-1',
    category: 'bridal',
    title: "Bridal Prep & Threading Session",
    technique: "Precision eyebrow threading, upper-lip cleanup, pre-event glow",
    image: "/img/gallery.jpeg",
    description: "A detailed pre-bridal grooming session focusing on meticulous threading, facial hair removal, and skin priming for a flawless makeup base."
  },
  {
    id: 'g-2',
    category: 'cuts',
    title: "Glamorous Wave Styling",
    technique: "Volume blow-dry, soft curl setting, flexible hold spray",
    image: "/img/gallery2.jpeg",
    description: "Elegant cascading waves crafted with a round brush blowout, delivering a glossy, camera-ready finish perfect for evening events and celebrations."
  },
  {
    id: 'g-3',
    category: 'cuts',
    title: "Red Light Hair & Scalp Therapy",
    technique: "LED scalp phototherapy, follicle stimulation, nourishing serum finish",
    image: "/img/gallery3.jpeg",
    description: "A non-invasive red light scalp treatment using therapeutic wavelengths to stimulate follicles, strengthen roots, and promote healthier, thicker hair growth."
  },
  {
    id: 'g-4',
    category: 'bridal',
    title: "Bridal Floral Braid Hair Do",
    technique: "Back-combing, three-strand braid, fresh floral pinning",
    image: "/img/gallery4.jpeg",
    description: "A traditional South Indian bridal long braid adorned with white floral garlands and jeweled accessories for a sacred wedding-day look."
  },
  {
    id: 'g-5',
    category: 'cuts',
    title: "Silk Press Straight Cut Styling",
    technique: "Deep cleanse, heat protectant, ceramic flat-iron press",
    image: "/img/gallery5.jpeg",
    description: "A transformative silk press treatment leaving natural hair bone-straight, silky, and frizz-free with mirror-like shine for weeks."
  },
  {
    id: 'g-6',
    category: 'color',
    title: "Cherry Red Highlight Streaks",
    technique: "Weave foils, bold pigment deposit, acidic gloss seal",
    image: "/img/gallery6.jpeg",
    description: "Vibrant cherry-red highlights woven through dark hair for a striking, high-contrast statement that turns heads at every angle."
  },
  {
    id: 'g-7',
    category: 'color',
    title: "Rose Gold Ombre Balayage",
    technique: "Freehand sweep, pink-toned melt, hydration gloss finish",
    image: "/img/gallery7.jpeg",
    description: "A dreamy rose-gold ombre painted from mid-lengths to ends, blending seamlessly into natural black roots for a soft, romantic gradient."
  },
  {
    id: 'g-8',
    category: 'nails',
    title: "Classic Black Gel Nail Art",
    technique: "Cuticle push, gel base coat, opaque black pigment, UV seal",
    image: "/img/gallery8.jpeg",
    description: "A bold, chip-resistant black gel manicure with a glossy mirror finish — the ultimate statement of modern elegance and edge."
  },
  {
    id: 'g-9',
    category: 'academy',
    title: "Mrs. Nandhini Mohamed — Co-Founder",
    technique: "Kryolan Certified Makeup Expert & Academy Director",
    image: "/img/msnandhani.jpeg",
    description: "Mrs. Nandhini Mohamed, Co-Founder & Master Makeup Expert at Black & Brown. 15+ years of industry experience, certified by Kryolan International, previously Studio Eleven Manager (Chennai)."
  },
  {
    id: 'g-10',
    category: 'academy',
    title: "Live Academy Class Session",
    technique: "In-studio hands-on training with live models and professional tools",
    image: "/img/classtraining.png",
    description: "Students practicing precision cuts and styling techniques on live models under direct supervision of master instructors inside the Karaikal studio training floor."
  },
  {
    id: 'g-11',
    category: 'academy',
    title: "Advanced Cutting Workshop",
    technique: "Clipper-over-comb, fading mechanics, and sectioning drills",
    image: "/img/classtraining1.png",
    description: "An intensive advanced men's cutting workshop where students master fade mechanics, clipper-over-comb techniques, and precision tapering on real clients."
  },
  {
    id: 'g-12',
    category: 'academy',
    title: "Student Practice Session",
    technique: "Hands-on model training with professional supervision",
    image: "/img/classttaining2.jpeg",
    description: "Academy students performing live haircuts on training models, receiving real-time feedback and technique corrections from senior stylists."
  },
  {
    id: 'g-13',
    category: 'academy',
    title: "Creative Texturing Class",
    technique: "Razor sliding, point cutting, and French styling methods",
    image: "/img/classttaining3.jpeg",
    description: "A creative texturing module focusing on modern shags, layers, curtain flows, and razor-slide techniques built to frame facial elements beautifully."
  },
  {
    id: 'g-14',
    category: 'academy',
    title: "Salon Floor Training",
    technique: "Live client simulation, consultation, and chair-side etiquette",
    image: "/img/classttaining4.jpeg",
    description: "Students shadowing senior stylists on the active salon floor, learning real client consultation, service pricing, and professional chair-side etiquette."
  },
  {
    id: 'g-15',
    category: 'academy',
    title: "Kit & Tool Orientation",
    technique: "Professional scissor, brush, and product toolkit familiarization",
    image: "/img/classttaining5.jpeg",
    description: "New students receiving their premium academy toolkit — including professional scissors, brushes, combs, and product sets for the duration of their course."
  },
  {
    id: 'g-16',
    category: 'color',
    title: "Creative Color Story",
    technique: "Custom color formulation, dimensional toning, and glossy seal",
    image: "/img/creative-story.jpeg",
    description: "A stunning creative color transformation showcasing bespoke formulation, dimensional toning, and a high-gloss finish for a truly unique client look."
  },
  {
    id: 'g-17',
    category: 'academy',
    title: "Mr. Gul Mohamed — Co-Founder",
    technique: "Master Stylist & Academy Director",
    image: "/img/gul.jpeg",
    description: "Mr. Gul Mohamed, Co-Founder of Black & Brown Salon & Academy. Expert in precision cutting, advanced styling, and salon business operations with over a decade of hands-on experience."
  }
];

type Filter = 'all' | GalleryItem['category'];

const FILTERS: { id: Filter; label: string }[] = [
  { id: 'all', label: 'All Creations' },
  { id: 'cuts', label: 'Precision Cuts' },
  { id: 'color', label: 'Color & Balayage' },
  { id: 'skin', label: 'Skincare' },
  { id: 'bridal', label: 'Bridal' },
  { id: 'nails', label: 'Nail Art' },
  { id: 'academy', label: 'Academy Work' }
];

const CATEGORY_SHORT: Record<GalleryItem['category'], string> = {
  cuts: 'Precision Cut',
  color: 'Hair Colouring',
  skin: 'Skincare',
  bridal: 'Bridal',
  nails: 'Nail Art',
  academy: 'Academy'
};

const CATEGORY_LONG: Record<GalleryItem['category'], string> = {
  cuts: 'Sculpting & Cuts Menu',
  color: 'Tint & Chemistry Menu',
  skin: 'Skincare & Restoration',
  bridal: 'Bridal & Special Occasions',
  nails: 'Nail Art & Care',
  academy: 'Academy Live Practice'
};

const pad = (n: number) => String(n).padStart(2, '0');

export default function GalleryView() {
  const [activeFilter, setActiveFilter] = useState<Filter>('all');
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const filteredItems = activeFilter === 'all' ? GALLERY_ITEMS : GALLERY_ITEMS.filter((item) => item.category === activeFilter);
  const selectedItem = selectedIndex !== null ? filteredItems[selectedIndex] : null;

  const close = useCallback(() => setSelectedIndex(null), []);
  const step = useCallback(
    (dir: 1 | -1) => {
      setSelectedIndex((i) => {
        if (i === null || filteredItems.length === 0) return i;
        return (i + dir + filteredItems.length) % filteredItems.length;
      });
    },
    [filteredItems.length]
  );

  // Keyboard + body scroll lock while the lightbox is open
  useEffect(() => {
    if (selectedIndex === null) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [selectedIndex, close, step]);

  const countFor = (f: Filter) => (f === 'all' ? GALLERY_ITEMS.length : GALLERY_ITEMS.filter((i) => i.category === f).length);

  return (
    <div id="gallery-view-root" className="relative py-20 px-4 bg-ink min-h-screen overflow-hidden">
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full bg-gold/5 blur-[140px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto space-y-12">
        <div id="gallery-header-section">
          <SectionHeading
            as="h1"
            eyebrow="The Lookbook"
            title="Studio Portfolio"
            description="Browse real, unfiltered aesthetics generated directly inside Black & Brown salon rooms and live academy training setups."
          />
        </div>

        {/* Filter pills */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.2 }}
          className="flex flex-wrap items-center justify-center gap-1.5 max-w-3xl mx-auto p-1.5 glass rounded-full"
        >
          {FILTERS.map((tab) => {
            const active = activeFilter === tab.id;
            return (
              <button
                key={tab.id}
                id={`gallery-tab-${tab.id}`}
                onClick={() => {
                  setActiveFilter(tab.id);
                  setSelectedIndex(null);
                }}
                className={`relative px-4 py-2 text-[11px] font-medium tracking-wide rounded-full transition-colors duration-300 flex items-center gap-2 ${
                  active ? 'text-ink' : 'text-gold/75 hover:text-cream'
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="gallery-active-pill"
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-gold via-cream to-gold-deep"
                  />
                )}
                <span className="relative z-10">{tab.label}</span>
                <span
                  className={`relative z-10 font-mono text-[9px] px-1.5 py-0.5 rounded-full ${
                    active ? 'bg-ink/15 text-ink' : 'bg-gold/10 text-gold/60'
                  }`}
                >
                  {countFor(tab.id)}
                </span>
              </button>
            );
          })}
        </motion.div>

        {/* Bento grid */}
        <motion.div layout id="gallery-portfolio-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item, index) => {
              const wide = index % 5 === 0;
              return (
                <motion.div
                  layout
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.92, y: 16 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.92, y: 10 }}
                  transition={{ duration: 0.45, ease: EASE, delay: Math.min(index * 0.04, 0.4) }}
                  className={wide ? 'lg:col-span-2' : ''}
                >
                  <TiltCard
                    id={`gallery-item-card-${item.id}`}
                    maxTilt={5}
                    onClick={() => setSelectedIndex(index)}
                    className="group relative h-full rounded-3xl bg-ink-3 border border-gold/10 hover:border-gold/40 overflow-hidden cursor-pointer transition-colors duration-500 shadow-[0_30px_60px_-40px_rgba(0,0,0,0.9)] flex flex-col"
                  >
                    <div className={`relative overflow-hidden bg-ink-2 ${wide ? 'aspect-square lg:aspect-[2/1]' : 'aspect-square'}`}>
                      <motion.img
                        layoutId={`gallery-img-${item.id}`}
                        referrerPolicy="no-referrer"
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-500" />

                      <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <span className="p-3 glass text-gold rounded-full flex items-center justify-center shadow-lg translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                          <Eye className="h-5 w-5" />
                        </span>
                        <span className="text-[10px] font-mono uppercase tracking-widest text-cream glass px-3 py-1.5 rounded-full translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75">
                          Spec Sheet
                        </span>
                      </div>

                      <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[8px] font-mono uppercase tracking-[0.2em] glass text-gold font-bold">
                        {CATEGORY_SHORT[item.category]}
                      </span>
                      <span className="absolute top-3 right-3 font-mono text-[10px] text-gold/40 tracking-[0.3em]">{pad(index + 1)}</span>
                    </div>

                    <div className="p-5 space-y-1.5 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-serif text-lg text-cream line-clamp-1 group-hover:text-gradient-gold transition-colors">{item.title}</h3>
                        <p className="font-mono text-[9px] uppercase tracking-wider text-gold/50 line-clamp-1">{item.technique}</p>
                      </div>
                      <p className="text-[11px] text-gold/60 line-clamp-2 leading-relaxed pt-2 border-t border-gold/10 mt-2 font-light">
                        {item.description}
                      </p>
                    </div>
                  </TiltCard>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {/* Lightbox (portaled to <body> so page-transition transforms/filters never clip it) */}
        {createPortal(
        <AnimatePresence>
          {selectedItem && selectedIndex !== null && (
            <motion.div
              key="gallery-lightbox"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/92 backdrop-blur-xl overflow-y-auto"
            >
              <div className="absolute inset-0 cursor-zoom-out" onClick={close} />

              {/* Prev / next */}
              <button
                aria-label="Previous"
                onClick={() => step(-1)}
                className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-20 h-11 w-11 rounded-full glass text-gold hover:text-ink hover:bg-gold transition-colors flex items-center justify-center"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                aria-label="Next"
                onClick={() => step(1)}
                className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-20 h-11 w-11 rounded-full glass text-gold hover:text-ink hover:bg-gold transition-colors flex items-center justify-center"
              >
                <ChevronRight className="h-5 w-5" />
              </button>

              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.96, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 20 }}
                transition={{ duration: 0.45, ease: EASE }}
                className="relative gold-frame bg-ink-3 w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden z-10 grid grid-cols-1 md:grid-cols-2"
              >
                {/* Visual half */}
                <div className="relative aspect-square md:aspect-auto md:h-[560px] bg-ink overflow-hidden">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.img
                      key={selectedItem.id}
                      layoutId={`gallery-img-${selectedItem.id}`}
                      referrerPolicy="no-referrer"
                      src={selectedItem.image}
                      alt={selectedItem.title}
                      initial={{ opacity: 0, scale: 1.04 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.4, ease: EASE }}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </AnimatePresence>
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent md:hidden" />
                  <span className="absolute bottom-4 left-4 font-mono text-[11px] tracking-[0.3em] text-gold glass px-3 py-1.5 rounded-full">
                    {pad(selectedIndex + 1)} / {pad(filteredItems.length)}
                  </span>
                </div>

                {/* Spec sheet */}
                <motion.div
                  key={`spec-${selectedItem.id}`}
                  initial="hidden"
                  animate="visible"
                  variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.07, delayChildren: 0.15 } } }}
                  className="p-7 sm:p-9 flex flex-col justify-between gap-6 text-cream"
                >
                  <div className="space-y-5">
                    <motion.div variants={{ hidden: { opacity: 0, x: 20 }, visible: { opacity: 1, x: 0 } }} className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-gold uppercase tracking-[0.2em] glass px-3 py-1.5 rounded-full font-bold">
                        {CATEGORY_LONG[selectedItem.category]}
                      </span>
                      <button
                        onClick={close}
                        aria-label="Close"
                        className="p-2 rounded-full glass text-gold hover:text-ink hover:bg-gold transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </motion.div>

                    <motion.div variants={{ hidden: { opacity: 0, x: 20 }, visible: { opacity: 1, x: 0 } }} className="space-y-1">
                      <h2 className="font-serif text-3xl text-cream leading-tight">{selectedItem.title}</h2>
                      <p className="font-mono text-[10px] uppercase tracking-widest text-gold/60 italic">{selectedItem.technique}</p>
                    </motion.div>

                    <motion.div variants={{ hidden: { scaleX: 0 }, visible: { scaleX: 1 } }} style={{ transformOrigin: '0% 50%' }} className="hairline" />

                    <motion.p
                      variants={{ hidden: { opacity: 0, x: 20 }, visible: { opacity: 1, x: 0 } }}
                      className="text-sm text-gold/75 leading-relaxed font-light"
                    >
                      {selectedItem.description}
                    </motion.p>
                  </div>

                  <div className="space-y-4">
                    <motion.div
                      variants={{ hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0 } }}
                      className="relative glass rounded-2xl p-4 text-xs space-y-1 overflow-hidden"
                    >
                      <span className="absolute left-0 top-3 bottom-3 w-[2px] bg-gradient-to-b from-gold to-gold-deep rounded-full" />
                      <span className="font-mono text-[9px] uppercase tracking-widest text-gold-deep font-bold flex items-center gap-1.5">
                        <Sparkles className="h-3 w-3" /> Treatment Specs
                      </span>
                      <p className="text-[11px] text-gold/75 font-light">
                        This creation was customized directly inside Karaikal Studio rooms using high-end protective sealants. Time allocated: 45–90 mins depending on texture setup.
                      </p>
                    </motion.div>

                    <motion.div variants={{ hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0 } }}>
                      <MagneticButton id="gallery-lightbox-close" full onClick={close}>
                        Close Lookbook Spec
                      </MagneticButton>
                    </motion.div>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
        )}
      </div>
    </div>
  );
}
