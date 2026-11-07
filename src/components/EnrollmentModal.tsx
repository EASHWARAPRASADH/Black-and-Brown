import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, GraduationCap, Calendar, Check, Send, MessageCircle, Mail, ArrowRight, Loader2 } from 'lucide-react';
import { TRAINING_COURSES, CONTACT_INFO } from '../data';
import { MagneticButton, EASE } from './ui';
import { WHATSAPP_NUMBER, SentVia, submitRequest, toDateInput, formatDate, isSlotOpen, isValidEmail, isValidPhone } from '../utils/contactForm';

// Minutes after midnight, so a slot can be checked against opening hours.
const INTERVIEW_SLOTS = [
  { value: 'Morning (10:00 AM)', minutes: 600 },
  { value: 'Lunch Hour (01:00 PM)', minutes: 780 },
  { value: 'Afternoon (03:00 PM)', minutes: 900 },
  { value: 'Evening (05:30 PM)', minutes: 1050 }
];

interface EnrollmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCourseId: string | null;
}

const inputClass =
  'w-full bg-ink-3 border border-gold/15 rounded-xl px-4 py-2.5 text-cream placeholder:text-gold/30 focus:outline-none focus:border-gold focus:shadow-[0_0_0_4px_rgba(230,213,184,0.08)] transition-all duration-300';
const selectClass = `${inputClass} [&>option]:bg-ink-3 font-semibold`;
const labelClass = 'block text-[10px] font-mono text-gold/60 uppercase tracking-[0.22em] font-semibold mb-1.5';
const errorClass = 'text-rose-400 font-mono text-[10px] mt-1 block';

const stepVariants = {
  initial: { opacity: 0, x: 24 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.4, ease: EASE } },
  exit: { opacity: 0, x: -24, transition: { duration: 0.25, ease: EASE } }
};

export default function EnrollmentModal({ isOpen, onClose, selectedCourseId }: EnrollmentModalProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    studentName: '',
    studentEmail: '',
    studentPhone: '',
    courseId: '',
    experience: 'None - Beginner',
    interviewDate: '',
    interviewTime: 'Morning (10:00 AM)',
    goals: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [studentKey, setStudentKey] = useState('');
  const [sentVia, setSentVia] = useState<SentVia | null>(null);
  const [sending, setSending] = useState(false);
  const [submitFailed, setSubmitFailed] = useState(false);
  const [honeypot, setHoneypot] = useState('');
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedCourseId) {
      setFormData((prev) => ({ ...prev, courseId: selectedCourseId }));
    } else if (TRAINING_COURSES.length > 0 && !formData.courseId) {
      setFormData((prev) => ({ ...prev, courseId: TRAINING_COURSES[0].id }));
    }
  }, [selectedCourseId, isOpen]);

  useEffect(() => {
    if (step === 2 && !formData.interviewDate) {
      const nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 3);
      setFormData((prev) => ({ ...prev, interviewDate: toDateInput(nextWeek) }));
    }
    // Each step starts at the top, which matters on short phone screens.
    overlayRef.current?.scrollTo({ top: 0 });
  }, [step]);

  const activeCourse = TRAINING_COURSES.find((c) => c.id === formData.courseId);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const next = { ...prev, [name]: value };
      // Drop a chosen time if it has already passed on the new date.
      if (name === 'interviewDate') {
        const slot = INTERVIEW_SLOTS.find((s) => s.value === prev.interviewTime);
        if (slot && !isSlotOpen(value, slot.minutes)) next.interviewTime = '';
      }
      return next;
    });
    setErrors((prev) => {
      const copy = { ...prev };
      delete copy[name];
      if (name === 'interviewDate') delete copy.interviewTime;
      return copy;
    });
  };

  const validateStep1 = () => {
    const nextErrors: Record<string, string> = {};
    if (formData.studentName.trim().length < 2) nextErrors.studentName = 'Student Name is required';
    if (!isValidEmail(formData.studentEmail)) nextErrors.studentEmail = 'Valid email is required';
    if (!isValidPhone(formData.studentPhone)) nextErrors.studentPhone = 'Valid contact phone is required';
    if (!formData.courseId) nextErrors.courseId = 'Please select a training program';

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 1) {
      if (validateStep1()) setStep(2);
    } else if (step === 2) {
      if (!formData.interviewDate) {
        setErrors({ interviewDate: 'Please choose an interview date' });
      } else if (formData.interviewDate < toDateInput(new Date())) {
        setErrors({ interviewDate: 'Please choose today or a later date.' });
      } else if (!formData.interviewTime) {
        setErrors({ interviewTime: 'Please select an interview time.' });
      } else if (!isSlotOpen(formData.interviewDate, INTERVIEW_SLOTS.find((s) => s.value === formData.interviewTime)?.minutes ?? 0)) {
        setErrors({ interviewTime: 'That time is not available on this date. Please pick another.' });
      } else {
        setErrors({});
        const randKey = 'BBA-' + Math.floor(1000 + Math.random() * 9000);
        setStudentKey(randKey);
        setSubmitFailed(false);
        setStep(3);
      }
    }
  };

  const handleResetClose = () => {
    setStep(1);
    setFormData({
      studentName: '',
      studentEmail: '',
      studentPhone: '',
      courseId: selectedCourseId || TRAINING_COURSES[0]?.id || '',
      experience: 'None - Beginner',
      interviewDate: '',
      interviewTime: 'Morning (10:00 AM)',
      goals: ''
    });
    setErrors({});
    setSentVia(null);
    setSubmitFailed(false);
    setHoneypot('');
    onClose();
  };

  // X, Escape and backdrop keep what was typed unless the request already went out.
  const handleDismiss = () => {
    if (sending) return;
    if (sentVia) {
      handleResetClose();
      return;
    }
    setStep(1);
    setErrors({});
    setSubmitFailed(false);
    onClose();
  };

  const handleSubmit = async () => {
    if (sending) return;
    setSending(true);
    setSubmitFailed(false);
    const ok = await submitRequest({
      type: 'enrollment',
      ref: studentKey,
      name: formData.studentName,
      email: formData.studentEmail,
      phone: formData.studentPhone,
      course: activeCourse?.title,
      duration: activeCourse?.duration,
      experience: formData.experience,
      date: formData.interviewDate,
      time: formData.interviewTime,
      goals: formData.goals,
      website: honeypot
    });
    setSending(false);
    if (ok) setSentVia('Website');
    else setSubmitFailed(true);
  };

  // Escape closes the modal
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleDismiss();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, selectedCourseId, sentVia, sending]);

  const buildEnrollmentMessage = () =>
    `Hi Black & Brown Academy, I would like to apply for a course.\n\n` +
    `Ref: ${studentKey}\n` +
    `Name: ${formData.studentName.trim()}\n` +
    `Phone: ${formData.studentPhone.trim()}\n` +
    `Email: ${formData.studentEmail.trim()}\n\n` +
    `Course: ${activeCourse?.title || 'To be discussed'}${activeCourse ? ` (${activeCourse.duration})` : ''}\n` +
    `Experience: ${formData.experience}\n\n` +
    `Preferred interview date: ${formatDate(formData.interviewDate)}\n` +
    `Preferred interview time: ${formData.interviewTime}\n\n` +
    `Career goals: ${formData.goals.trim() || 'None provided'}`;

  const buildEnrollmentWhatsApp = () =>
    `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(buildEnrollmentMessage())}`;

  const buildEnrollmentMailto = () => {
    const subject = encodeURIComponent(`New Academy Application — ${formData.studentName.trim()} — ${activeCourse?.title || 'Course to be discussed'}`);
    return `mailto:${CONTACT_INFO.email}?subject=${subject}&body=${encodeURIComponent(buildEnrollmentMessage())}`;
  };

  const stepTitles = ['Student Profile', 'Admission Setup', 'Send to the Academy'];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="enroll-backdrop"
          ref={overlayRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/85 backdrop-blur-md overflow-y-auto font-sans"
        >
          <div className="absolute inset-0" onClick={handleDismiss} aria-hidden />

          <motion.div
            id="enroll-modal-box"
            role="dialog"
            aria-modal="true"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97, transition: { duration: 0.2 } }}
            transition={{ type: 'spring', stiffness: 260, damping: 24 }}
            className="relative bg-ink-2 gold-frame w-full max-w-lg rounded-3xl shadow-[0_40px_90px_-30px_rgba(0,0,0,0.95)] overflow-hidden my-auto"
          >
            {/* Header */}
            <div className="bg-ink-3 p-6 flex items-center justify-between border-b border-gold/10">
              <div className="flex items-center gap-3">
                <motion.div
                  initial={{ rotate: -10, scale: 0.8 }}
                  animate={{ rotate: 0, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 16, delay: 0.1 }}
                  className="p-2.5 rounded-2xl bg-gradient-to-br from-gold via-cream to-gold-deep text-ink shadow-lg"
                >
                  <GraduationCap className="h-5 w-5" />
                </motion.div>
                <div>
                  <h2 className="font-serif text-lg text-cream tracking-wide">
                    {step === 3 ? (sentVia === 'Website' ? 'Request Sent' : sentVia ? 'Almost Done' : 'Review & Send') : 'Apply to Cosmetology Academy'}
                  </h2>
                  <span className="text-[10px] font-mono text-gold-deep uppercase tracking-[0.22em] font-semibold block">
                    Step {step}: {stepTitles[step - 1]}
                  </span>
                </div>
              </div>
              <motion.button
                id="close-enroll-modal-btn"
                onClick={handleDismiss}
                whileHover={{ rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                className="text-gold/70 hover:text-cream p-2 glass rounded-full transition-colors focus:outline-none"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </motion.button>
            </div>

            {/* Progress */}
            <div className="px-6 pt-4 flex gap-2">
              {[1, 2, 3].map((s) => (
                <div key={s} className="h-1 flex-1 rounded-full bg-gold/10 overflow-hidden">
                  <motion.div
                    initial={false}
                    animate={{ scaleX: step >= s ? 1 : 0 }}
                    transition={{ duration: 0.5, ease: EASE }}
                    style={{ transformOrigin: '0% 50%' }}
                    className="h-full w-full bg-gradient-to-r from-gold-deep via-gold to-cream"
                  />
                </div>
              ))}
            </div>

            {/* Content */}
            <div className="p-6 overflow-hidden">
              <AnimatePresence mode="wait" initial={false}>
                {step === 1 && (
                  <motion.div key="step-1" variants={stepVariants} initial="initial" animate="animate" exit="exit" className="space-y-4">
                    <div className="relative bg-ink-3 border border-gold/10 p-4 rounded-2xl text-xs space-y-1.5 overflow-hidden">
                      <span className="absolute left-0 top-3 bottom-3 w-[2px] bg-gradient-to-b from-gold to-gold-deep rounded-full" />
                      <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-gold-deep font-bold block">Why Register with us?</span>
                      <p className="font-light text-gold/70 leading-relaxed">
                        Our professional courses combine 20% theory syllabus with 80% practical live model styling, including professional certifications and direct placement pipelines.
                      </p>
                    </div>

                    <div className="space-y-3.5 text-xs">
                      {/* Hidden from people. Bots that fill it are ignored by the server. */}
                      <input
                        type="text"
                        name="website"
                        tabIndex={-1}
                        autoComplete="off"
                        aria-hidden="true"
                        value={honeypot}
                        onChange={(e) => setHoneypot(e.target.value)}
                        className="absolute -left-[9999px] h-0 w-0 opacity-0"
                      />
                      <div>
                        <label className={labelClass}>Select Your Training Program *</label>
                        <select id="enroll-field-course" name="courseId" value={formData.courseId} onChange={handleInputChange} className={selectClass}>
                          {TRAINING_COURSES.map((course) => (
                            <option key={course.id} value={course.id}>
                              {course.title} ({course.duration})
                            </option>
                          ))}
                        </select>
                        {errors.courseId && <span className={errorClass}>{errors.courseId}</span>}
                      </div>

                      <div>
                        <label className={labelClass}>Your Full Name *</label>
                        <input
                          id="enroll-field-name"
                          type="text"
                          name="studentName"
                          value={formData.studentName}
                          onChange={handleInputChange}
                          placeholder="Enter full name"
                          className={inputClass}
                        />
                        {errors.studentName && <span className={errorClass}>{errors.studentName}</span>}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className={labelClass}>Student Email *</label>
                          <input
                            id="enroll-field-email"
                            type="email"
                            name="studentEmail"
                            value={formData.studentEmail}
                            onChange={handleInputChange}
                            placeholder="e.g. name@student.com"
                            className={inputClass}
                          />
                          {errors.studentEmail && <span className={errorClass}>{errors.studentEmail}</span>}
                        </div>
                        <div>
                          <label className={labelClass}>Mobile contact *</label>
                          <input
                            id="enroll-field-phone"
                            type="tel"
                            name="studentPhone"
                            value={formData.studentPhone}
                            onChange={handleInputChange}
                            placeholder="+91 63748 54329"
                            className={inputClass}
                          />
                          {errors.studentPhone && <span className={errorClass}>{errors.studentPhone}</span>}
                        </div>
                      </div>

                      <div>
                        <label className={labelClass}>Previous Styling / Barber Experience</label>
                        <select id="enroll-field-experience" name="experience" value={formData.experience} onChange={handleInputChange} className={`${inputClass} [&>option]:bg-ink-3`}>
                          <option value="None - Beginner">None - Absolute Beginner (Highly Welcome)</option>
                          <option value="1-2 Years Practical">1 - 2 Years Basic Practice</option>
                          <option value="3+ Years Professional">3+ Years Advanced Professional seeking certification</option>
                        </select>
                      </div>
                    </div>

                    <div className="pt-2">
                      <MagneticButton id="enroll-step1-next" full onClick={handleNext} iconRight={<ArrowRight className="h-4 w-4" />}>
                        Schedule Admission Interview
                      </MagneticButton>
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div key="step-2" variants={stepVariants} initial="initial" animate="animate" exit="exit" className="space-y-5 text-xs">
                    <div className="p-4 bg-ink-3 border border-gold/10 rounded-2xl space-y-1">
                      <span className="font-semibold text-cream block">What is the Creative Interview?</span>
                      <p className="font-light text-gold/65 leading-relaxed">
                        An informal 15-minute conversation with Mrs. Nandhini Mohamed or Mr. Gul Mohamed to match your goals, establish program options, and configure student kit sizing.
                      </p>
                    </div>

                    <div>
                      <label className={labelClass}>Preferred Interview Date *</label>
                      <div className="relative">
                        <input
                          id="enroll-field-date"
                          type="date"
                          name="interviewDate"
                          value={formData.interviewDate}
                          onChange={handleInputChange}
                          className={`${inputClass} font-mono [color-scheme:dark]`}
                          min={toDateInput(new Date())}
                        />
                        <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gold/40 pointer-events-none" />
                      </div>
                      {errors.interviewDate && <span className={errorClass}>{errors.interviewDate}</span>}
                    </div>

                    <div>
                      <label className={labelClass}>Preferred Time *</label>
                      <select id="enroll-field-time" name="interviewTime" value={formData.interviewTime} onChange={handleInputChange} className={selectClass}>
                        <option value="" disabled>
                          Select a time
                        </option>
                        {INTERVIEW_SLOTS.map((slot) => (
                          <option key={slot.value} value={slot.value} disabled={!isSlotOpen(formData.interviewDate, slot.minutes)}>
                            {slot.value}
                          </option>
                        ))}
                      </select>
                      {formData.interviewDate && !INTERVIEW_SLOTS.some((s) => isSlotOpen(formData.interviewDate, s.minutes)) && (
                        <span className="text-gold/60 font-mono text-[10px] mt-1 block">No times left on this date. Please pick another day.</span>
                      )}
                      {errors.interviewTime && <span className={errorClass}>{errors.interviewTime}</span>}
                    </div>

                    <div>
                      <label className={labelClass}>Tell Us About Your Career Ambitions</label>
                      <textarea
                        id="enroll-field-goals"
                        name="goals"
                        value={formData.goals}
                        onChange={handleInputChange}
                        placeholder="e.g. want to establish a premium mens barber salon in Puducherry or specialize in balayage color highlights..."
                        className={`${inputClass} h-20 resize-none font-sans`}
                      />
                    </div>

                    <div className="pt-2 flex gap-3">
                      <motion.button
                        id="enroll-step2-back"
                        type="button"
                        whileTap={{ scale: 0.96 }}
                        onClick={() => setStep(1)}
                        className="w-1/3 py-3 border border-gold/25 text-gold hover:text-cream hover:border-gold/60 font-semibold rounded-full text-center transition-colors text-[11px] uppercase tracking-[0.18em]"
                      >
                        Back
                      </motion.button>
                      <MagneticButton id="enroll-step2-finalize" onClick={handleNext} className="w-2/3">
                        Review Application
                      </MagneticButton>
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div key="step-3" variants={stepVariants} initial="initial" animate="animate" exit="exit" className="space-y-6">
                    <div className="text-center space-y-2">
                      <motion.div
                        initial={{ scale: 0, rotate: -30 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: 'spring', stiffness: 260, damping: 14, delay: 0.15 }}
                        className="h-14 w-14 rounded-full flex items-center justify-center mx-auto bg-gradient-to-br from-gold to-gold-deep text-ink shadow-[0_0_40px_-8px_rgba(230,213,184,0.7)]"
                      >
                        {sentVia ? <Check className="h-7 w-7 stroke-[3px]" /> : <Send className="h-6 w-6" />}
                      </motion.div>
                      <h3 className="font-serif text-2xl text-cream">{sentVia === 'Website' ? 'Request Received' : sentVia ? 'Press Send to Finish' : 'One Last Step'}</h3>
                      <p className="text-xs text-gold/65 font-light px-6">
                        {sentVia === 'Website'
                          ? `The academy has your application and will contact you to confirm your interview. Your reference is ${studentKey}.`
                          : sentVia
                          ? `${sentVia} should now be open with your application. Press Send there, and the academy will confirm your interview.`
                          : 'Your application has not been sent yet. Check the details, then send it to the academy.'}
                      </p>
                    </div>

                    <div className="space-y-2">
                      {!sentVia && (
                        <motion.button
                          id="enroll-submit-btn"
                          type="button"
                          disabled={sending}
                          onClick={handleSubmit}
                          whileTap={{ scale: 0.97 }}
                          className="flex items-center justify-center gap-2 w-full py-3.5 bg-gradient-to-r from-gold via-cream to-gold-deep text-ink font-semibold text-[11px] tracking-[0.18em] uppercase rounded-full text-center shadow-[0_10px_30px_-10px_rgba(230,213,184,0.5)] disabled:opacity-70 disabled:cursor-wait"
                        >
                          {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                          {sending ? 'Sending...' : 'Send Application'}
                        </motion.button>
                      )}
                      {submitFailed && (
                        <p id="enroll-submit-error" role="alert" className="text-center text-xs text-rose-300 bg-rose-500/10 border border-rose-400/25 rounded-2xl px-4 py-3 leading-relaxed">
                          We could not send your application from the website. Please send it on WhatsApp or by email below, or call us.
                        </p>
                      )}
                      {sentVia !== 'Website' && (
                        <div className={`space-y-2 ${sending ? 'pointer-events-none opacity-50' : ''}`}>
                      <motion.a
                        id="enroll-whatsapp-send-btn"
                        href={buildEnrollmentWhatsApp()}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => setSentVia('WhatsApp')}
                        whileTap={{ scale: 0.97 }}
                        className={`flex items-center justify-center gap-2 w-full py-3.5 font-semibold text-[11px] tracking-[0.18em] uppercase rounded-full transition-colors text-center ${submitFailed || sentVia ? 'bg-gradient-to-r from-emerald-500 to-emerald-700 text-white hover:from-emerald-400 hover:to-emerald-600 shadow-[0_10px_30px_-10px_rgba(16,185,129,0.6)]' : 'border border-gold/25 text-gold hover:bg-ink-3'}`}
                      >
                        <MessageCircle className="h-4 w-4" />
                        Send on WhatsApp
                      </motion.a>
                      <motion.a
                        id="enroll-email-send-btn"
                        href={buildEnrollmentMailto()}
                        onClick={() => setSentVia('Your email app')}
                        whileTap={{ scale: 0.97 }}
                        className="flex items-center justify-center gap-2 w-full py-3.5 border border-gold/25 text-gold hover:bg-ink-3 font-semibold text-[11px] tracking-[0.18em] uppercase rounded-full transition-colors text-center"
                      >
                        <Mail className="h-4 w-4" />
                        Send by Email
                      </motion.a>
                        </div>
                      )}
                      {sentVia ? (
                        <motion.button
                          id="enroll-confirmed-done"
                          onClick={handleResetClose}
                          whileTap={{ scale: 0.97 }}
                          className="w-full py-3.5 bg-gradient-to-r from-gold via-cream to-gold-deep text-ink font-semibold text-[11px] tracking-[0.18em] uppercase rounded-full text-center"
                        >
                          Done, Return to Academy
                        </motion.button>
                      ) : (
                        <motion.button
                          id="enroll-step3-back"
                          type="button"
                          disabled={sending}
                          onClick={() => setStep(2)}
                          whileTap={{ scale: 0.97 }}
                          className="w-full py-2.5 text-gold/70 hover:text-cream font-semibold text-[11px] tracking-[0.18em] uppercase text-center transition-colors"
                        >
                          Back to Edit
                        </motion.button>
                      )}
                      <p className="pt-1 text-center text-[11px] text-gold/50 font-light">
                        Prefer to talk? Call{' '}
                        <a href={`tel:${CONTACT_INFO.phone.replace(/\s+/g, '')}`} className="text-gold hover:text-cream underline underline-offset-2">
                          {CONTACT_INFO.phone}
                        </a>
                      </p>
                    </div>

                    <motion.div
                      id="academy-badge-confirmed"
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, ease: EASE, delay: 0.3 }}
                      className="relative gold-frame bg-ink-3 rounded-2xl p-5 text-cream font-mono overflow-hidden shadow-2xl"
                    >
                      <div className="absolute -top-2 -right-2 p-4 opacity-[0.06] pointer-events-none">
                        <GraduationCap className="h-28 w-28" />
                      </div>

                      <div className="flex justify-between items-center border-b border-gold/15 pb-2 mb-4">
                        <span className="text-[10px] text-gold font-bold tracking-widest">BLACK & BROWN ACADEMY</span>
                        <span className="text-[10px] font-sans font-bold text-gold-deep">APPLICATION</span>
                      </div>

                      <div className="space-y-3 text-xs leading-relaxed">
                        <div className="flex justify-between">
                          <span className="text-gold/50">REFERENCE:</span>
                          <span className="text-gold font-bold">{studentKey}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gold/50">STUDENT NAME:</span>
                          <span className="text-cream font-bold">{formData.studentName.toUpperCase()}</span>
                        </div>
                        <div className="flex justify-between border-t border-gold/10 pt-2">
                          <span className="text-gold/50">PROGRAM PATH:</span>
                          <span className="text-cream font-bold text-right">{activeCourse?.title || 'General Spec'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gold/50">COURSE TERM:</span>
                          <span className="text-cream">{activeCourse?.duration || '1-3 Months'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gold/50">EXPERIENCE:</span>
                          <span className="text-cream">{formData.experience}</span>
                        </div>
                        <div className="flex justify-between border-t border-gold/10 pt-2">
                          <span className="text-gold/50">PREFERRED DATE:</span>
                          <span className="text-gold font-bold text-right">{formatDate(formData.interviewDate)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gold/50">PREFERRED TIME:</span>
                          <span className="text-gold font-bold text-right">{formData.interviewTime}</span>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-gold/15 text-center text-[8px] text-gold/40 font-bold tracking-[0.25em]">
                        ★ THANK YOU FOR APPLYING ★
                      </div>
                    </motion.div>

                    <div className="bg-ink-3 p-4 border border-gold/10 rounded-2xl text-xs space-y-2 font-sans leading-relaxed">
                      <span className="font-semibold text-cream block">Admission checklist & kit detail:</span>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 font-light text-[11px] text-gold/70">
                        {[
                          'Original education certificate copy',
                          'Full premium academy textbook kit',
                          'Personal scissors brush toolkit dispatch',
                          'Digital access pipeline setup instructions'
                        ].map((item) => (
                          <li key={item} className="flex items-start gap-2">
                            <span className="mt-1.5 h-1 w-1 rounded-full bg-gold-deep shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
