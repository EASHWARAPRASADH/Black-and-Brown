import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Award, Search, GraduationCap, ChevronDown, Sparkles, CalendarCheck, Clock, ArrowUpRight } from 'lucide-react';
import { TRAINING_WHY, TRAINING_COURSES, TRAINING_JOURNEY } from '../data';
import { Reveal, Stagger, StaggerItem, SectionHeading, TiltCard, MagneticButton, EASE, viewportOnce } from './ui';

interface TrainingViewProps {
  onOpenAcademyEnrollWithCourse: (courseId: string) => void;
}

const CATEGORY_LABEL: Record<string, string> = {
  hair: 'Hairdressing',
  skin: 'Skin Aesthetics',
  chemical: 'Chemical & Tone Color',
  business: 'Salon Business'
};

const BENEFIT_ICONS = [
  <Award className="h-5 w-5" key="award" />,
  <Sparkles className="h-5 w-5" key="sparkles" />,
  <GraduationCap className="h-5 w-5" key="grad" />
];

export default function TrainingView({ onOpenAcademyEnrollWithCourse }: TrainingViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedCourseId, setExpandedCourseId] = useState<string | null>(null);

  const filteredCourses = TRAINING_COURSES.filter((course) => {
    const matchCat = selectedCategory === 'all' || course.category === selectedCategory;
    const q = searchQuery.toLowerCase();
    const matchQuery = course.title.toLowerCase().includes(q) || course.description.toLowerCase().includes(q);
    return matchCat && matchQuery;
  });

  const toggleSyllabus = (courseId: string) => {
    setExpandedCourseId(expandedCourseId === courseId ? null : courseId);
  };

  const categories = [
    { id: 'all', label: 'All Fields' },
    { id: 'hair', label: 'Haircutting & Barbery' },
    { id: 'skin', label: 'Skin & Facials' },
    { id: 'chemical', label: 'Chemicals & Color' },
    { id: 'business', label: 'Salon Business' }
  ];

  return (
    <div id="training-view-root" className="relative py-20 px-4 bg-ink min-h-screen overflow-hidden">
      <div className="absolute -right-40 top-10 w-[520px] h-[520px] rounded-full bg-gold/5 blur-[130px] pointer-events-none" />
      <div className="absolute -left-40 bottom-40 w-[420px] h-[420px] rounded-full bg-gold-deep/5 blur-[120px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto space-y-20">
        {/* ============ HEADER ============ */}
        <SectionHeading
          as="h1"
          eyebrow="The Barber & Stylist Academy"
          title="Master Your Craft"
          description="Beginner-friendly and advanced specialization courses designed by our founders Mrs. Nandhini Mohamed and Mr. Gul Mohamed. Our mission is to raise the standards of excellence in Southern India through intense hands-on training, live models, and solid Salon Business Fundamentals."
          className="max-w-3xl"
        />

        {/* ============ WHY TRAIN ============ */}
        <Stagger id="academy-benefits" className="grid grid-cols-1 md:grid-cols-3 gap-6" stagger={0.12}>
          {TRAINING_WHY.map((benefit, idx) => (
            <StaggerItem key={benefit.title} className="h-full">
              <TiltCard
                id={`benefit-card-${idx}`}
                className="group h-full p-8 rounded-3xl bg-ink-3 border border-gold/10 hover:border-gold/40 transition-colors duration-500 flex flex-col justify-between shadow-[0_30px_60px_-40px_rgba(0,0,0,0.9)]"
              >
                <div className="space-y-5">
                  <div className="flex items-start justify-between">
                    <motion.div
                      whileHover={{ rotateY: 180 }}
                      transition={{ duration: 0.6, ease: EASE }}
                      style={{ transformStyle: 'preserve-3d' }}
                      className="p-3.5 w-fit rounded-2xl bg-gradient-to-br from-gold via-cream to-gold-deep text-ink shadow-[0_10px_30px_-10px_rgba(230,213,184,0.5)] group-hover:-rotate-6 transition-transform duration-500"
                    >
                      {BENEFIT_ICONS[idx]}
                    </motion.div>
                    <span className="font-mono text-[11px] text-gold/30 tracking-[0.3em]">0{idx + 1}</span>
                  </div>
                  <h3 className="font-serif text-2xl text-cream group-hover:text-gradient-gold transition-colors">{benefit.title}</h3>
                  <p className="text-sm text-gold/60 leading-relaxed font-light">{benefit.description}</p>
                </div>
                <div className="pt-6 border-t border-gold/10 mt-8 text-[10px] font-mono text-gold-deep uppercase tracking-[0.25em] font-semibold flex items-center gap-2">
                  <span className="h-1 w-1 rounded-full bg-gold-deep" />
                  Academy Standard
                </div>
              </TiltCard>
            </StaggerItem>
          ))}
        </Stagger>

        {/* ============ CATALOG ============ */}
        <section id="courses-explorer" className="space-y-8">
          <Reveal className="border-b border-gold/10 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-5">
            <div className="space-y-2">
              <span className="inline-flex items-center gap-3 text-[11px] font-mono tracking-[0.3em] text-gold-deep uppercase font-semibold">
                <span className="h-px w-6 bg-gold-deep/60" /> Curriculum
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-cream tracking-tight">Interactive Curriculum Catalog</h2>
              <p className="text-sm text-gold/60 font-light">
                Filter by styling category or type of chemical treatment to explore program details and syllabus.
              </p>
            </div>

            <motion.div whileFocus={{ scale: 1.01 }} className="relative w-full md:w-80 group">
              <input
                id="course-search-field"
                type="text"
                placeholder="Search programs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full glass rounded-full pl-11 pr-4 py-3 text-sm text-cream placeholder:text-gold/30 focus:outline-none focus:border-gold/60 focus:shadow-[0_0_0_4px_rgba(230,213,184,0.08)] transition-all duration-300"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gold/50 group-focus-within:text-gold transition-colors" />
            </motion.div>
          </Reveal>

          {/* Filter chips */}
          <Reveal delay={0.05} className="flex flex-wrap gap-2">
            {categories.map((cat) => {
              const active = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  id={`cat-filter-btn-${cat.id}`}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`relative px-4 py-2 text-[11px] font-semibold rounded-full uppercase tracking-[0.18em] transition-colors duration-300 border ${
                    active ? 'text-ink border-transparent' : 'text-gold/75 border-gold/15 hover:text-cream hover:border-gold/40'
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="training-filter-pill"
                      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                      className="absolute inset-0 rounded-full bg-gradient-to-r from-gold via-cream to-gold-deep shadow-[0_8px_24px_-10px_rgba(230,213,184,0.6)]"
                    />
                  )}
                  <span className="relative z-10">{cat.label}</span>
                </button>
              );
            })}
          </Reveal>

          {/* Courses */}
          {filteredCourses.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 16, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5, ease: EASE }}
              className="p-12 text-center glass rounded-3xl max-w-md mx-auto space-y-3"
            >
              <Search className="h-8 w-8 text-gold/30 mx-auto" />
              <p className="text-base font-serif italic text-gold/80">No training programs match your criteria.</p>
              <button
                id="reset-filter-btn"
                onClick={() => {
                  setSelectedCategory('all');
                  setSearchQuery('');
                }}
                className="link-underline text-[11px] font-bold font-mono tracking-[0.2em] uppercase text-gold hover:text-cream"
              >
                Show All Class Programs
              </button>
            </motion.div>
          ) : (
            <motion.div layout className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AnimatePresence mode="popLayout">
                {filteredCourses.map((course) => {
                  const isExpanded = expandedCourseId === course.id;
                  return (
                    <motion.div
                      layout
                      key={course.id}
                      id={`course-card-${course.id}`}
                      initial={{ opacity: 0, y: 24, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.94 }}
                      transition={{ duration: 0.45, ease: EASE }}
                      className="group bg-ink-3 border border-gold/10 hover:border-gold/40 rounded-3xl transition-colors duration-500 overflow-hidden flex flex-col justify-between shadow-[0_30px_60px_-40px_rgba(0,0,0,0.9)]"
                    >
                      <div>
                        {course.image && (
                          <div className="relative overflow-hidden h-52">
                            <img
                              src={course.image}
                              alt={course.title}
                              className="w-full h-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-ink-3 via-ink-3/30 to-transparent" />
                            <span className="absolute top-4 left-4 glass rounded-full px-3 py-1 text-[9px] font-mono uppercase tracking-[0.2em] text-gold font-semibold">
                              {CATEGORY_LABEL[course.category]}
                            </span>
                          </div>
                        )}

                        <div className="p-6 sm:p-8 space-y-4">
                          <div className="flex items-start justify-between gap-4">
                            <div className="space-y-1.5">
                              {!course.image && (
                                <span className="inline-block glass rounded-full px-3 py-1 text-[9px] font-mono uppercase tracking-[0.2em] text-gold font-semibold">
                                  {CATEGORY_LABEL[course.category]}
                                </span>
                              )}
                              <h3 className="font-serif text-xl sm:text-2xl text-cream group-hover:text-gradient-gold transition-colors">
                                {course.title}
                              </h3>
                            </div>
                            <div className="text-right shrink-0">
                              <span className="block text-[9px] font-mono text-gold/50 uppercase tracking-[0.25em] font-semibold mb-1">
                                Course Span
                              </span>
                              <span className="inline-flex items-center gap-1.5 font-mono text-xs font-bold text-ink bg-gradient-to-r from-gold to-gold-deep px-3 py-1.5 rounded-full">
                                <Clock className="h-3 w-3" />
                                {course.duration}
                              </span>
                            </div>
                          </div>

                          <p className="text-sm text-gold/65 font-light leading-relaxed">{course.description}</p>

                          <div className="pt-1">
                            <button
                              id={`toggle-syllabus-${course.id}`}
                              onClick={() => toggleSyllabus(course.id)}
                              aria-expanded={isExpanded}
                              className="flex items-center gap-2 text-[11px] font-bold tracking-[0.18em] uppercase text-gold hover:text-cream transition-colors focus:outline-none"
                            >
                              <motion.span
                                animate={{ rotate: isExpanded ? 180 : 0 }}
                                transition={{ duration: 0.4, ease: EASE }}
                                className="h-6 w-6 rounded-full border border-gold/30 flex items-center justify-center"
                              >
                                <ChevronDown className="h-3.5 w-3.5" />
                              </motion.span>
                              {isExpanded ? 'Hide Core Syllabus' : `View Course Syllabus (${course.syllabus.length} Modules)`}
                            </button>

                            <AnimatePresence initial={false}>
                              {isExpanded && (
                                <motion.div
                                  key="syllabus"
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.45, ease: EASE }}
                                  className="overflow-hidden"
                                >
                                  <div className="mt-4 p-5 rounded-2xl bg-ink border border-gold/10 text-xs">
                                    <span className="block font-mono font-bold text-[9px] text-gold-deep uppercase tracking-[0.25em] mb-3 pb-2 border-b border-gold/10">
                                      Weekly Syllabus Modules
                                    </span>
                                    <motion.ul
                                      initial="hidden"
                                      animate="visible"
                                      variants={{ visible: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } }, hidden: {} }}
                                      className="space-y-2.5 font-light"
                                    >
                                      {course.syllabus.map((topic, i) => (
                                        <motion.li
                                          key={i}
                                          variants={{ hidden: { opacity: 0, x: -12 }, visible: { opacity: 1, x: 0 } }}
                                          className="flex items-start gap-3 text-gold/80"
                                        >
                                          <span className="font-mono text-gold-deep font-bold shrink-0">W{i + 1}</span>
                                          <span>{topic}</span>
                                        </motion.li>
                                      ))}
                                    </motion.ul>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>
                      </div>

                      <div className="px-6 sm:px-8 py-4 bg-ink border-t border-gold/10 flex items-center justify-between gap-3">
                        <span className="text-[10px] font-mono text-emerald-400 font-semibold uppercase tracking-[0.18em] flex items-center gap-2">
                          <span className="relative flex h-2 w-2">
                            <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                          </span>
                          Interviews Available
                        </span>
                        <MagneticButton
                          id={`enroll-course-btn-${course.id}`}
                          size="sm"
                          onClick={() => onOpenAcademyEnrollWithCourse(course.id)}
                          icon={<CalendarCheck className="h-3.5 w-3.5" />}
                        >
                          Apply For Course
                        </MagneticButton>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          )}
        </section>

        {/* ============ ROADMAP ============ */}
        <section id="training-process" className="relative py-12 border-t border-gold/10 space-y-14">
          <SectionHeading
            eyebrow="Your Training Roadmap"
            title="The Journey to Becoming a Master"
            description="We guide students step-by-step from digital inquiry to fully qualified salon specialist."
          />

          <div className="relative">
            {/* Animated connector (desktop) */}
            <svg
              aria-hidden
              className="hidden lg:block absolute left-0 right-0 top-[52px] w-full h-2 pointer-events-none"
              viewBox="0 0 1000 8"
              preserveAspectRatio="none"
            >
              <line x1="0" y1="4" x2="1000" y2="4" stroke="rgba(230,213,184,0.08)" strokeWidth="1" />
              <motion.line
                x1="0"
                y1="4"
                x2="1000"
                y2="4"
                stroke="url(#journey-gradient)"
                strokeWidth="2"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={viewportOnce}
                transition={{ duration: 2.2, ease: EASE, delay: 0.2 }}
              />
              <defs>
                <linearGradient id="journey-gradient" x1="0" x2="1" y1="0" y2="0">
                  <stop offset="0%" stopColor="#C9A961" />
                  <stop offset="50%" stopColor="#F3EAD9" />
                  <stop offset="100%" stopColor="#C9A961" />
                </linearGradient>
              </defs>
            </svg>

            <Stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-5" stagger={0.12}>
              {TRAINING_JOURNEY.map((step) => (
                <StaggerItem key={step.step} className="h-full">
                  <motion.div
                    id={`journey-step-${step.step}`}
                    whileHover={{ y: -8 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                    className="group relative h-full p-6 bg-ink-3 border border-gold/10 hover:border-gold/40 rounded-3xl space-y-3 transition-colors duration-500 overflow-hidden"
                  >
                    <span className="hidden lg:block absolute top-[46px] left-1/2 -translate-x-1/2 h-3 w-3 rounded-full bg-ink border-2 border-gold-deep group-hover:bg-gold group-hover:shadow-[0_0_14px_3px_rgba(230,213,184,0.5)] transition-all duration-500" />
                    <span className="font-mono text-4xl font-extrabold text-gold/15 group-hover:text-gold/60 transition-colors duration-500 block pt-4 lg:pt-6">
                      {step.step}
                    </span>
                    <h3 className="font-serif text-base text-cream">{step.title}</h3>
                    <p className="text-[11px] text-gold/60 leading-relaxed font-light">{step.text}</p>
                    <ArrowUpRight className="absolute top-5 right-5 h-4 w-4 text-gold/20 group-hover:text-gold transition-colors" />
                  </motion.div>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>
      </div>
    </div>
  );
}
