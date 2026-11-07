import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence, animate } from 'motion/react';
import { Scissors, Sparkles, AlertCircle, ShoppingBag, Plus, Minus, Check, Calendar, ArrowRight } from 'lucide-react';
import { SERVICE_CATEGORIES, COMBO_OFFERS } from '../data';
import { MenuItem } from '../types';
import { Reveal, SectionHeading, TiltCard, MagneticButton, EASE } from './ui';

interface ServicesViewProps {
  onOpenBookingWithServices: (services: MenuItem[], comboId?: string) => void;
}

type TabType = 'all' | 'men' | 'women' | 'combos';

const TABS: { id: TabType; label: string }[] = [
  { id: 'all', label: 'View All' },
  { id: 'men', label: "Men's Lounge" },
  { id: 'women', label: "Women's Salon" },
  { id: 'combos', label: 'Value Combos' }
];

const listVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05, delayChildren: 0.05 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } }
};

/** Rupee total that tweens between values instead of jumping. */
function AnimatedTotal({ value }: { value: number }) {
  const [display, setDisplay] = useState(value);
  useEffect(() => {
    const controls = animate(display, value, {
      duration: 0.5,
      ease: EASE,
      onUpdate: (v) => setDisplay(Math.round(v))
    });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);
  return <span className="tabular-nums">₹{display}</span>;
}

export default function ServicesView({ onOpenBookingWithServices }: ServicesViewProps) {
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [cart, setCart] = useState<MenuItem[]>([]);
  const [selectedCombo, setSelectedCombo] = useState<string | null>(null);

  const filteredCategories = SERVICE_CATEGORIES.filter((cat) => {
    if (activeTab === 'men') return cat.gender === 'men';
    if (activeTab === 'women') return cat.gender === 'women';
    if (activeTab === 'combos') return false;
    return true;
  });

  const toggleCartItem = (item: MenuItem) => {
    if (selectedCombo) {
      setSelectedCombo(null);
      setCart([item]);
      return;
    }
    const exists = cart.find((i) => i.name === item.name);
    if (exists) {
      setCart(cart.filter((i) => i.name !== item.name));
    } else {
      setCart([...cart, item]);
    }
  };

  const selectCombo = (comboId: string, comboName: string, comboPrice: number) => {
    setSelectedCombo(comboId);
    const comboItem: MenuItem = {
      name: comboName,
      price: comboPrice,
      description: 'Discounted Special Styling Bundle'
    };
    setCart([comboItem]);
  };

  const isSelected = (itemName: string) => cart.some((i) => i.name === itemName);

  const calculateSubtotal = () => cart.reduce((acc, curr) => acc + Number(curr.price), 0);

  const handleCheckout = () => {
    if (cart.length === 0) return;
    onOpenBookingWithServices(cart, selectedCombo || undefined);
  };

  const clearCart = () => {
    setCart([]);
    setSelectedCombo(null);
  };

  const showCombos = activeTab === 'all' || activeTab === 'combos';

  return (
    <div id="services-view-root" className="relative py-20 px-4 bg-ink min-h-screen overflow-hidden">
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-gold/5 blur-[140px] rounded-full pointer-events-none" />

      <div className="relative max-w-7xl mx-auto space-y-12">
        <SectionHeading
          as="h1"
          eyebrow="The Service Menu"
          title="Bespoke Treatments"
          description="Select and pair precision cuts, nourishing traditional massage oils, custom skin de-tan therapy, or deep balayage highlights. Tap items to build your grooming ritual and calculate the estimated price dynamically."
        />

        {/* Tabs */}
        <Reveal delay={0.1} className="flex justify-center">
          <div className="inline-flex flex-wrap items-center justify-center gap-1 p-1.5 glass rounded-full">
            {TABS.map((tab) => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`service-tab-${tab.id}`}
                  onClick={() => {
                    setActiveTab(tab.id);
                    if (tab.id === 'men' || tab.id === 'women') clearCart();
                  }}
                  className={`relative px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.18em] rounded-full transition-colors duration-300 ${
                    active ? 'text-ink' : 'text-gold/70 hover:text-cream'
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="service-tab-pill"
                      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                      className="absolute inset-0 rounded-full bg-gradient-to-r from-gold via-cream to-gold-deep shadow-[0_8px_24px_-10px_rgba(230,213,184,0.6)]"
                    />
                  )}
                  <span className="relative z-10">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Menu */}
          <div className="lg:col-span-8 space-y-14">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4, ease: EASE }}
                className="space-y-14"
              >
                {/* Combos */}
                {showCombos && (
                  <div id="combos-section" className="space-y-6">
                    <div className="flex items-center justify-between gap-4">
                      <h2 className="font-serif text-2xl sm:text-3xl text-cream flex items-center gap-3">
                        <Sparkles className="h-5 w-5 text-gold-deep" /> Premium Combo Packages
                      </h2>
                      <span className="shrink-0 text-[10px] font-mono text-ink bg-gradient-to-r from-gold to-gold-deep px-3 py-1 rounded-full uppercase tracking-[0.2em] font-bold">
                        Best Value
                      </span>
                    </div>
                    <div className="hairline" />

                    <motion.div
                      variants={listVariants}
                      initial="hidden"
                      animate="visible"
                      className="grid grid-cols-1 md:grid-cols-3 gap-5"
                    >
                      {COMBO_OFFERS.map((combo) => {
                        const active = selectedCombo === combo.id;
                        return (
                          <motion.div key={combo.id} variants={itemVariants} className="h-full">
                            <TiltCard
                              id={`combo-card-${combo.id}`}
                              maxTilt={5}
                              className={`relative h-full p-6 rounded-3xl flex flex-col justify-between transition-all duration-500 ${
                                active
                                  ? 'gold-frame bg-ink-4 shadow-[0_0_50px_-12px_rgba(230,213,184,0.45)]'
                                  : 'bg-ink-3 border border-gold/10 hover:border-gold/40'
                              }`}
                            >
                              <div className="space-y-4">
                                <div className="flex justify-between items-start gap-3">
                                  <h3 className="font-serif text-lg text-cream leading-tight">{combo.name.split(':')[0]}</h3>
                                  <span
                                    className={`shrink-0 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                                      active ? 'bg-gold text-ink border-gold' : 'border-gold/30 text-gold-deep'
                                    }`}
                                  >
                                    Save ₹{combo.originalPrice - combo.price}
                                  </span>
                                </div>
                                <p className="text-xs italic text-gold-deep font-medium">{combo.name.split(':')[1]}</p>
                                <ul className="text-xs space-y-2 font-light text-gold/80">
                                  {combo.services.map((srv, i) => (
                                    <li key={i} className="flex items-center gap-2">
                                      <span className="h-5 w-5 rounded-full bg-ink border border-gold/20 flex items-center justify-center">
                                        <Check className="h-3 w-3 text-gold" />
                                      </span>
                                      <span>{srv}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              <div className="mt-6 pt-4 border-t border-gold/10 flex items-center justify-between">
                                <div>
                                  <span className="block text-[10px] font-mono text-gold/35 line-through">₹{combo.originalPrice}</span>
                                  <span className="font-mono text-xl font-bold text-cream">₹{combo.price}</span>
                                </div>
                                <motion.button
                                  id={`select-combo-btn-${combo.id}`}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    selectCombo(combo.id, combo.name, combo.price);
                                  }}
                                  className={`px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] rounded-full transition-all duration-300 ${
                                    active
                                      ? 'bg-gradient-to-r from-gold via-cream to-gold-deep text-ink'
                                      : 'border border-gold/30 text-gold hover:bg-gold hover:text-ink'
                                  }`}
                                >
                                  {active ? 'Selected' : 'Select Package'}
                                </motion.button>
                              </div>
                            </TiltCard>
                          </motion.div>
                        );
                      })}
                    </motion.div>
                  </div>
                )}

                {/* Categories */}
                {filteredCategories.map((category) => (
                  <div key={category.id} id={`category-block-${category.id}`} className="space-y-6">
                    <div className="flex items-center justify-between gap-4">
                      <h2 className="font-serif text-2xl sm:text-3xl text-cream">{category.title}</h2>
                      <span className="shrink-0 text-[10px] font-mono tracking-[0.2em] uppercase px-3 py-1 rounded-full font-semibold border border-gold/25 text-gold-deep bg-ink-3">
                        {category.gender === 'men' ? "Men's Area" : "Women's Area"}
                      </span>
                    </div>
                    <div className="hairline" />

                    <motion.div
                      variants={listVariants}
                      initial="hidden"
                      animate="visible"
                      className="grid grid-cols-1 md:grid-cols-2 gap-4"
                    >
                      {category.items.map((item) => {
                        const activeSelect = isSelected(item.name);
                        return (
                          <motion.div
                            key={item.name}
                            id={`service-item-${item.name.replace(/\s+/g, '-')}`}
                            variants={itemVariants}
                            whileTap={{ scale: 0.98 }}
                            whileHover={{ y: -2 }}
                            onClick={() => toggleCartItem(item)}
                            animate={{
                              borderColor: activeSelect ? 'rgba(230,213,184,0.8)' : 'rgba(230,213,184,0.1)',
                              boxShadow: activeSelect
                                ? '0 0 40px -10px rgba(230,213,184,0.35)'
                                : '0 0 0px 0px rgba(230,213,184,0)'
                            }}
                            className={`p-5 rounded-2xl border cursor-pointer flex justify-between gap-4 select-none transition-colors duration-300 ${
                              activeSelect ? 'bg-ink-4' : 'bg-ink-3 hover:bg-ink-4'
                            }`}
                          >
                            <div className="space-y-1.5 max-w-[75%]">
                              <h3 className={`font-serif text-base tracking-wide ${activeSelect ? 'text-cream' : 'text-cream/90'}`}>
                                {item.name}
                              </h3>
                              {item.description && (
                                <p className="text-xs font-light line-clamp-2 text-gold/55">{item.description}</p>
                              )}
                            </div>

                            <div className="flex flex-col items-end justify-between min-w-[20%]">
                              <span className={`font-mono font-bold text-base ${activeSelect ? 'text-gold' : 'text-gold-deep'}`}>
                                ₹{item.price}
                              </span>
                              <span
                                className={`h-7 w-7 rounded-full flex items-center justify-center transition-colors duration-300 ${
                                  activeSelect ? 'bg-gold text-ink' : 'border border-gold/25 text-gold'
                                }`}
                              >
                                <AnimatePresence mode="wait" initial={false}>
                                  <motion.span
                                    key={activeSelect ? 'check' : 'plus'}
                                    initial={{ scale: 0, rotate: -90 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    exit={{ scale: 0, rotate: 90 }}
                                    transition={{ type: 'spring', stiffness: 400, damping: 18 }}
                                    className="flex"
                                  >
                                    {activeSelect ? <Check className="h-3.5 w-3.5 stroke-[3px]" /> : <Plus className="h-3.5 w-3.5" />}
                                  </motion.span>
                                </AnimatePresence>
                              </span>
                            </div>
                          </motion.div>
                        );
                      })}
                    </motion.div>
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Cart */}
          <div className="lg:col-span-4 lg:sticky lg:top-28 space-y-5">
            <Reveal direction="left" delay={0.2}>
              <div id="cart-invoice-widget" className="glass rounded-3xl p-6 text-cream shadow-[0_40px_80px_-30px_rgba(0,0,0,0.9)] relative overflow-hidden">
                <div className="absolute -top-20 -right-20 w-48 h-48 bg-gold/10 blur-[60px] rounded-full pointer-events-none" />

                <div className="relative flex items-center justify-between border-b border-gold/10 pb-4">
                  <div className="flex items-center gap-2.5">
                    <span className="h-9 w-9 rounded-full bg-ink border border-gold/20 flex items-center justify-center">
                      <ShoppingBag className="h-4 w-4 text-gold" />
                    </span>
                    <h3 className="font-serif text-lg">Booking Estimator</h3>
                  </div>
                  <AnimatePresence>
                    {cart.length > 0 && (
                      <motion.button
                        key="clear"
                        id="clear-cart-btn"
                        initial={{ opacity: 0, x: 8 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 8 }}
                        onClick={clearCart}
                        className="link-underline text-[10px] font-mono text-gold/50 hover:text-gold uppercase tracking-[0.18em] font-semibold"
                      >
                        Clear All
                      </motion.button>
                    )}
                  </AnimatePresence>
                </div>

                <AnimatePresence mode="wait" initial={false}>
                  {cart.length === 0 ? (
                    <motion.div
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="py-12 text-center space-y-4"
                    >
                      <div className="flex justify-center text-gold/30 animate-float">
                        <Scissors className="h-12 w-12 stroke-1" />
                      </div>
                      <p className="text-xs text-gold/50 leading-relaxed font-light max-w-[220px] mx-auto">
                        No services selected yet. Tap any service card to estimate pricing.
                      </p>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="filled"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-6 mt-4"
                    >
                      <div className="max-h-[220px] overflow-y-auto space-y-1 pr-2 scrollbar-thin">
                        <AnimatePresence initial={false}>
                          {cart.map((item) => (
                            <motion.div
                              key={item.name}
                              layout
                              initial={{ opacity: 0, x: -14, height: 0 }}
                              animate={{ opacity: 1, x: 0, height: 'auto' }}
                              exit={{ opacity: 0, x: 14, height: 0 }}
                              transition={{ duration: 0.35, ease: EASE }}
                              className="overflow-hidden"
                            >
                              <div className="flex items-start justify-between text-xs py-2.5 border-b border-gold/10">
                                <div className="max-w-[70%]">
                                  <span className="font-semibold text-cream block">{item.name}</span>
                                  <span className="text-[9px] text-gold/40 font-mono">Salon Care Session</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="font-mono text-gold font-semibold">₹{item.price}</span>
                                  <motion.button
                                    id={`remove-cart-item-${item.name.replace(/\s+/g, '-')}`}
                                    whileTap={{ scale: 0.85 }}
                                    onClick={() => toggleCartItem(item)}
                                    aria-label={`Remove ${item.name}`}
                                    className="h-6 w-6 rounded-full border border-gold/15 flex items-center justify-center text-gold/50 hover:text-rose-400 hover:border-rose-400/50 transition-colors"
                                  >
                                    <Minus className="h-3 w-3" />
                                  </motion.button>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </div>

                      <div className="border-t border-gold/10 pt-4 space-y-2">
                        <div className="flex justify-between text-xs text-gold/60 font-light">
                          <span>Services Selected</span>
                          <span className="font-mono">{cart.length}</span>
                        </div>
                        <div className="flex justify-between text-xs text-gold/60 font-light">
                          <span>SGST + CGST (0%)</span>
                          <span className="font-mono">₹0</span>
                        </div>
                        <div className="flex justify-between items-baseline border-t border-gold/10 pt-3">
                          <span className="text-cream font-serif text-sm">Total Estimate</span>
                          <span className="font-mono text-gradient-gold text-2xl font-bold">
                            <AnimatedTotal value={calculateSubtotal()} />
                          </span>
                        </div>
                      </div>

                      <MagneticButton
                        id="checkout-book-button"
                        full
                        onClick={handleCheckout}
                        icon={<Calendar className="h-4 w-4" />}
                        iconRight={<ArrowRight className="h-3.5 w-3.5" />}
                      >
                        Book & Secure Seat Now
                      </MagneticButton>
                      <span className="text-[10px] font-mono text-gold/35 block text-center uppercase tracking-[0.2em]">
                        No advance payment required
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Reveal>

            <Reveal direction="left" delay={0.3}>
              <div className="p-5 bg-ink-3 border border-gold/10 rounded-2xl flex gap-3 text-xs text-gold/70 font-light">
                <AlertCircle className="h-5 w-5 text-gold-deep shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-medium text-cream block">Flexible Booking Policy</span>
                  <p className="leading-relaxed">
                    Need to change your hours? Reschedule online or by calling us directly up to 2 hours before your appointment with no penalty.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </div>
  );
}
