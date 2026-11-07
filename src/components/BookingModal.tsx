import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar, Check, Mail, Ticket, Scissors, ArrowRight, Send, MessageCircle, Loader2 } from 'lucide-react';
import { MenuItem } from '../types';
import { TEAM_MEMBERS, CONTACT_INFO } from '../data';
import { EASE } from './ui';
import { WHATSAPP_NUMBER, SentVia, submitRequest, toDateInput, formatDate, isSlotOpen, isValidEmail, isValidPhone } from '../utils/contactForm';

// Minutes after midnight, so a slot can be checked against opening hours.
const TIME_SLOTS = [
  { label: '09:30 AM', minutes: 570 },
  { label: '11:00 AM', minutes: 660 },
  { label: '12:30 PM', minutes: 750 },
  { label: '02:00 PM', minutes: 840 },
  { label: '03:30 PM', minutes: 930 },
  { label: '05:00 PM', minutes: 1020 },
  { label: '06:30 PM', minutes: 1110 }
];

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedServices: MenuItem[];
  setSelectedServices: React.Dispatch<React.SetStateAction<MenuItem[]>>;
}

const inputCls =
  'w-full bg-ink-3 border border-gold/15 focus:border-gold rounded-xl px-3.5 py-2.5 text-cream placeholder:text-gold/30 focus:outline-none transition-colors duration-300';
const labelCls = 'block text-[10px] font-mono text-gold/60 uppercase tracking-[0.2em] font-semibold mb-1.5';
const errCls = 'text-rose-400 font-mono text-[10px] mt-1 block';

const stepVariants = {
  initial: { opacity: 0, x: 24 },
  enter: { opacity: 1, x: 0, transition: { duration: 0.4, ease: EASE } },
  exit: { opacity: 0, x: -24, transition: { duration: 0.25, ease: EASE } }
};

export default function BookingModal({ isOpen, onClose, selectedServices }: BookingModalProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    stylist: 'Any Stylist',
    notes: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [ticketId, setTicketId] = useState('');
  const [sentVia, setSentVia] = useState<SentVia | null>(null);
  const [sending, setSending] = useState(false);
  const [submitFailed, setSubmitFailed] = useState(false);
  const [honeypot, setHoneypot] = useState('');
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (step === 2 && !formData.date) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setFormData((prev) => ({ ...prev, date: toDateInput(tomorrow) }));
    }
    // Each step starts at the top, which matters on short phone screens.
    overlayRef.current?.scrollTo({ top: 0 });
  }, [step]);

  const handleResetClose = () => {
    setStep(1);
    setFormData({
      name: '',
      email: '',
      phone: '',
      date: '',
      time: '',
      stylist: 'Any Stylist',
      notes: ''
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
      type: 'booking',
      ref: ticketId,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      date: formData.date,
      time: formData.time,
      stylist: formData.stylist,
      notes: formData.notes,
      services: selectedServices.map((s) => ({ name: s.name, price: s.price })),
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, sentVia, sending]);

  const totalAmount = selectedServices.reduce((acc, curr) => acc + Number(curr.price), 0);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const next = { ...prev, [name]: value };
      // Drop a chosen slot if the new date has no such slot (Sunday hours, past times).
      if (name === 'date') {
        const slot = TIME_SLOTS.find((s) => s.label === prev.time);
        if (slot && !isSlotOpen(value, slot.minutes)) next.time = '';
      }
      return next;
    });
    setErrors((prev) => {
      const copy = { ...prev };
      delete copy[name];
      if (name === 'date') delete copy.dateOrTime;
      return copy;
    });
  };

  const validateStep1 = () => {
    const nextErrors: Record<string, string> = {};
    if (formData.name.trim().length < 2) nextErrors.name = 'Full Name is required';
    if (!isValidEmail(formData.email)) nextErrors.email = 'Valid email address is required';
    if (!isValidPhone(formData.phone)) nextErrors.phone = 'Valid contact phone is required';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 1) {
      if (validateStep1()) setStep(2);
    } else if (step === 2) {
      if (!formData.date || !formData.time) {
        setErrors({ dateOrTime: 'Please select both appointment date and time slot.' });
      } else if (formData.date < toDateInput(new Date())) {
        setErrors({ dateOrTime: 'Please choose today or a later date.' });
      } else if (!isSlotOpen(formData.date, TIME_SLOTS.find((s) => s.label === formData.time)?.minutes ?? 0)) {
        setErrors({ dateOrTime: 'That time is not available on this date. Please pick another slot.' });
      } else {
        setErrors({});
        const randId = 'BB-' + Math.floor(100000 + Math.random() * 900000);
        setTicketId(randId);
        setSubmitFailed(false);
        setStep(3);
      }
    }
  };

  const totalLabel = totalAmount === 0 ? 'To be decided at the chair' : `₹${totalAmount}`;

  const buildBookingMessage = () => {
    const servicesList =
      selectedServices.length > 0
        ? selectedServices.map((s) => `• ${s.name} — ₹${s.price}`).join('\n')
        : '• Custom Style Allocation (to be decided at chair)';
    return (
      `Hi Black & Brown, I would like to book an appointment.\n\n` +
      `Ref: ${ticketId}\n` +
      `Name: ${formData.name.trim()}\n` +
      `Phone: ${formData.phone.trim()}\n` +
      `Email: ${formData.email.trim()}\n\n` +
      `Date: ${formatDate(formData.date)}\n` +
      `Time: ${formData.time}\n` +
      `Stylist: ${formData.stylist}\n\n` +
      `Services:\n${servicesList}\n\n` +
      `Estimated total: ${totalLabel}\n\n` +
      `Notes: ${formData.notes.trim() || 'None'}`
    );
  };

  const buildBookingWhatsApp = () =>
    `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(buildBookingMessage())}`;

  const buildBookingMailto = () => {
    const subject = encodeURIComponent(`New Booking Request — ${formData.name.trim()} — ${formatDate(formData.date)}`);
    return `mailto:${CONTACT_INFO.email}?subject=${subject}&body=${encodeURIComponent(buildBookingMessage())}`;
  };

  const stepLabels = ['Contact', 'Schedule', 'Send'];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="booking-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          ref={overlayRef}
          onClick={handleDismiss}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/85 backdrop-blur-md overflow-y-auto"
        >
          <motion.div
            id="booking-modal-box"
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97, transition: { duration: 0.2 } }}
            transition={{ type: 'spring', stiffness: 260, damping: 24 }}
            className="relative bg-ink-2 gold-frame w-full max-w-lg rounded-3xl shadow-[0_50px_100px_-30px_rgba(0,0,0,0.95)] overflow-hidden my-auto"
          >
            {/* Header */}
            <div className="bg-ink-3 text-cream p-6 flex items-center justify-between border-b border-gold/10">
              <div className="flex items-center gap-3">
                <span className="h-10 w-10 rounded-full bg-ink border border-gold/25 flex items-center justify-center">
                  <Scissors className="h-5 w-5 text-gold" />
                </span>
                <div>
                  <h2 className="font-serif text-lg tracking-wide">
                    {step === 3 ? (sentVia === 'Website' ? 'Request Sent' : sentVia ? 'Almost Done' : 'Review & Send') : 'Reserve Salon Care Session'}
                  </h2>
                  <span className="text-[10px] font-mono text-gold-deep uppercase tracking-[0.2em] font-semibold block">
                    {step === 1 && 'Step 1: Your Details'}
                    {step === 2 && 'Step 2: Schedule & Stylist Select'}
                    {step === 3 && 'Step 3: Send to the Salon'}
                  </span>
                </div>
              </div>
              <motion.button
                id="close-booking-modal-btn"
                onClick={handleDismiss}
                whileHover={{ rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                className="h-9 w-9 rounded-full glass text-gold/80 hover:text-cream flex items-center justify-center"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </motion.button>
            </div>

            {/* Step progress */}
            <div className="px-6 pt-5 flex items-center gap-2">
              {stepLabels.map((label, i) => {
                const n = i + 1;
                const done = step > n;
                const current = step === n;
                return (
                  <div key={label} className="flex-1 space-y-1.5">
                    <div className="h-1 rounded-full bg-gold/10 overflow-hidden">
                      <motion.div
                        initial={false}
                        animate={{ width: done || current ? '100%' : '0%' }}
                        transition={{ duration: 0.5, ease: EASE }}
                        className={`h-full rounded-full ${done ? 'bg-gold' : 'bg-gradient-to-r from-gold-deep to-gold'}`}
                      />
                    </div>
                    <span
                      className={`block text-[9px] font-mono uppercase tracking-[0.2em] ${
                        current ? 'text-cream' : done ? 'text-gold' : 'text-gold/35'
                      }`}
                    >
                      {label}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Content */}
            <div className="p-6">
              <AnimatePresence mode="wait" initial={false}>
                {step === 1 && (
                  <motion.div key="step1" variants={stepVariants} initial="initial" animate="enter" exit="exit" className="space-y-5">
                    {selectedServices.length > 0 ? (
                      <div className="bg-ink-3 border-l-2 border-gold p-4 rounded-r-2xl text-xs space-y-1.5">
                        <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-gold-deep font-bold block">
                          Pre-selected Services
                        </span>
                        <div className="max-h-[85px] overflow-y-auto space-y-1 text-cream scrollbar-thin">
                          {selectedServices.map((srv) => (
                            <div key={srv.name} className="flex justify-between font-medium">
                              <span>• {srv.name}</span>
                              <span className="font-mono text-gold">₹{srv.price}</span>
                            </div>
                          ))}
                        </div>
                        <div className="border-t border-gold/10 pt-1.5 mt-1.5 flex justify-between font-bold text-sm">
                          <span className="font-serif text-cream">Subtotal Estimate</span>
                          <span className="font-mono text-gradient-gold text-base">₹{totalAmount}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 bg-ink-3 border border-gold/15 rounded-2xl text-gold/80 text-xs flex gap-2">
                        <span className="font-bold text-gold-deep">Note:</span>
                        <span>No specific service was selected. Our lead stylist will configure customized treatments directly at the chair upon arrival.</span>
                      </div>
                    )}

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
                        <label className={labelCls}>Your Full Name *</label>
                        <input
                          id="booking-field-name"
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Enter full name"
                          className={inputCls}
                        />
                        {errors.name && <span className={errCls}>{errors.name}</span>}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className={labelCls}>Email Address *</label>
                          <input
                            id="booking-field-email"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="you@example.com"
                            className={inputCls}
                          />
                          {errors.email && <span className={errCls}>{errors.email}</span>}
                        </div>
                        <div>
                          <label className={labelCls}>Phone Number *</label>
                          <input
                            id="booking-field-phone"
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            placeholder="+91 63748 54329"
                            className={inputCls}
                          />
                          {errors.phone && <span className={errCls}>{errors.phone}</span>}
                        </div>
                      </div>
                    </div>

                    <motion.button
                      id="booking-step1-next"
                      onClick={handleNext}
                      whileTap={{ scale: 0.97 }}
                      className="group w-full py-3.5 bg-gradient-to-r from-gold via-cream to-gold-deep text-ink font-semibold text-[11px] uppercase tracking-[0.18em] rounded-full flex items-center justify-center gap-2 shadow-[0_10px_30px_-10px_rgba(230,213,184,0.5)]"
                    >
                      Configure Schedule & Stylist
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </motion.button>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div key="step2" variants={stepVariants} initial="initial" animate="enter" exit="exit" className="space-y-5 text-xs">
                    <div>
                      <label className={labelCls}>Select Date *</label>
                      <div className="relative">
                        <input
                          id="booking-field-date"
                          type="date"
                          name="date"
                          value={formData.date}
                          onChange={handleInputChange}
                          className={`${inputCls} font-mono [color-scheme:dark]`}
                          min={toDateInput(new Date())}
                        />
                        <Calendar className="absolute right-3.5 top-3 h-4 w-4 text-gold/50 pointer-events-none" />
                      </div>
                    </div>

                    <div>
                      <label className={labelCls}>Select Preferred Hourly Slot *</label>
                      <div className="grid grid-cols-4 gap-2">
                        {TIME_SLOTS.map(({ label: slot, minutes }) => {
                          const active = formData.time === slot;
                          const available = isSlotOpen(formData.date, minutes);
                          return (
                            <motion.button
                              key={slot}
                              id={`time-slot-${slot.replace(/\s+/g, '')}`}
                              type="button"
                              disabled={!available}
                              whileTap={{ scale: 0.94 }}
                              onClick={() => {
                                setFormData((prev) => ({ ...prev, time: slot }));
                                setErrors((prev) => {
                                  const copy = { ...prev };
                                  delete copy.dateOrTime;
                                  return copy;
                                });
                              }}
                              animate={{
                                backgroundColor: active ? 'rgba(230,213,184,1)' : 'rgba(24,23,22,1)',
                                color: active ? '#0a0a09' : 'rgba(230,213,184,0.8)',
                                borderColor: active ? 'rgba(230,213,184,1)' : 'rgba(230,213,184,0.15)'
                              }}
                              transition={{ duration: 0.25 }}
                              className="py-2 px-1 rounded-xl font-mono text-[10px] text-center border font-semibold disabled:opacity-30 disabled:line-through disabled:cursor-not-allowed"
                            >
                              {slot}
                            </motion.button>
                          );
                        })}
                      </div>
                      {formData.date && !TIME_SLOTS.some((t) => isSlotOpen(formData.date, t.minutes)) && (
                        <span className="text-gold/60 font-mono text-[10px] mt-1 block">No slots left on this date. Please pick another day.</span>
                      )}
                      {errors.dateOrTime && <span className={errCls}>{errors.dateOrTime}</span>}
                    </div>

                    <div>
                      <label className={labelCls}>Assigned Hair Stylist or Practitioner</label>
                      <select
                        id="booking-field-stylist"
                        name="stylist"
                        value={formData.stylist}
                        onChange={handleInputChange}
                        className={`${inputCls} font-semibold`}
                      >
                        <option value="Any Stylist">Any Available Master Stylist</option>
                        {TEAM_MEMBERS.map((member) => (
                          <option key={member.name} value={member.name}>
                            {member.name} — {member.role.split('&')[0]}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className={labelCls}>Additional Styling Notes or Allergies</label>
                      <textarea
                        id="booking-field-notes"
                        name="notes"
                        value={formData.notes}
                        onChange={handleInputChange}
                        placeholder="E.g., sensitive scalp, preferred long crown fades..."
                        className={`${inputCls} h-16 resize-none`}
                      />
                    </div>

                    <div className="pt-1 flex gap-3">
                      <motion.button
                        id="booking-step2-back"
                        type="button"
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setStep(1)}
                        className="w-1/3 py-3.5 border border-gold/25 text-gold hover:bg-ink-3 rounded-full text-center transition-colors font-semibold text-[11px] uppercase tracking-[0.18em]"
                      >
                        Back
                      </motion.button>
                      <motion.button
                        id="booking-step2-finalize"
                        onClick={handleNext}
                        whileTap={{ scale: 0.97 }}
                        className="w-2/3 py-3.5 bg-gradient-to-r from-gold via-cream to-gold-deep text-ink font-semibold text-[11px] tracking-[0.18em] uppercase rounded-full text-center shadow-[0_10px_30px_-10px_rgba(230,213,184,0.5)]"
                      >
                        Review Booking
                      </motion.button>
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div key="step3" variants={stepVariants} initial="initial" animate="enter" exit="exit" className="space-y-6">
                    <div className="text-center space-y-2">
                      <motion.div
                        initial={{ scale: 0, rotate: -30 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: 'spring', stiffness: 260, damping: 14, delay: 0.1 }}
                        className="h-14 w-14 rounded-full flex items-center justify-center mx-auto bg-gradient-to-br from-gold to-gold-deep text-ink shadow-[0_0_40px_-8px_rgba(230,213,184,0.7)]"
                      >
                        {sentVia ? <Check className="h-7 w-7 stroke-[3px]" /> : <Send className="h-6 w-6" />}
                      </motion.div>
                      <h3 className="font-serif text-xl text-cream">{sentVia === 'Website' ? 'Request Received' : sentVia ? 'Press Send to Finish' : 'One Last Step'}</h3>
                      <p className="text-xs text-gold/60 font-light px-6">
                        {sentVia === 'Website'
                          ? `The salon has your booking request and will contact you to confirm your slot. Your reference is ${ticketId}.`
                          : sentVia
                          ? `${sentVia} should now be open with your booking details. Press Send there, and the salon will confirm your slot.`
                          : 'Your booking has not been sent yet. Check the details, then send it to the salon.'}
                      </p>
                    </div>

                    <div className="space-y-2">
                      {!sentVia && (
                        <motion.button
                          id="booking-submit-btn"
                          type="button"
                          disabled={sending}
                          onClick={handleSubmit}
                          whileTap={{ scale: 0.97 }}
                          className="flex items-center justify-center gap-2 w-full py-3.5 bg-gradient-to-r from-gold via-cream to-gold-deep text-ink font-semibold text-[11px] tracking-[0.18em] uppercase rounded-full text-center shadow-[0_10px_30px_-10px_rgba(230,213,184,0.5)] disabled:opacity-70 disabled:cursor-wait"
                        >
                          {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                          {sending ? 'Sending...' : 'Send Booking Request'}
                        </motion.button>
                      )}
                      {submitFailed && (
                        <p id="booking-submit-error" role="alert" className="text-center text-xs text-rose-300 bg-rose-500/10 border border-rose-400/25 rounded-2xl px-4 py-3 leading-relaxed">
                          We could not send your booking request from the website. Please send it on WhatsApp or by email below, or call us.
                        </p>
                      )}
                      {sentVia !== 'Website' && (
                        <div className={`space-y-2 ${sending ? 'pointer-events-none opacity-50' : ''}`}>
                      <motion.a
                        id="booking-whatsapp-send-btn"
                        href={buildBookingWhatsApp()}
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
                        id="booking-email-send-btn"
                        href={buildBookingMailto()}
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
                          id="booking-confirmed-close-btn"
                          onClick={handleResetClose}
                          whileTap={{ scale: 0.97 }}
                          className="w-full py-3.5 bg-gradient-to-r from-gold via-cream to-gold-deep text-ink font-semibold text-[11px] tracking-[0.18em] uppercase rounded-full text-center"
                        >
                          Done, Return to Studio
                        </motion.button>
                      ) : (
                        <motion.button
                          id="booking-step3-back"
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
                      id="booking-confirmed-ticket"
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.25, duration: 0.6, ease: EASE }}
                      className="bg-ink-3 border border-gold/25 rounded-2xl p-5 text-cream font-mono relative overflow-hidden shadow-xl"
                    >
                      <div className="absolute top-1/2 -left-3 h-6 w-6 bg-ink-2 rounded-full -translate-y-1/2 border-r border-gold/25" />
                      <div className="absolute top-1/2 -right-3 h-6 w-6 bg-ink-2 rounded-full -translate-y-1/2 border-l border-gold/25" />

                      <div className="flex justify-between items-start border-b border-gold/10 pb-3 mb-4 text-[10px] text-gold-deep font-bold uppercase tracking-[0.2em]">
                        <span className="flex items-center gap-1.5">
                          <Ticket className="h-3.5 w-3.5" /> Booking Request
                        </span>
                        <span className="text-gold">{ticketId}</span>
                      </div>

                      <div className="space-y-2.5 text-[11px] leading-relaxed">
                        <div className="flex justify-between">
                          <span className="text-gold/45">PATRON NAME:</span>
                          <span className="text-cream font-bold">{formData.name.toUpperCase()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gold/45">CONTACT PHONE:</span>
                          <span className="text-cream">{formData.phone}</span>
                        </div>
                        <div className="flex justify-between border-t border-gold/10 pt-2">
                          <span className="text-gold/45">DATE:</span>
                          <span className="text-cream text-right">{formatDate(formData.date)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gold/45">HOURLY SLOT:</span>
                          <span className="text-right font-bold text-gold">{formData.time}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gold/45">STYLIST:</span>
                          <span className="text-cream text-right">{formData.stylist}</span>
                        </div>

                        <div className="border-t border-dashed border-gold/25 pt-3 mt-4">
                          <span className="block text-[8px] text-gold/40 uppercase tracking-[0.2em] mb-1 font-semibold">Treatments Checked</span>
                          <div className="max-h-[70px] overflow-y-auto space-y-1 text-gold/80 text-[10px] scrollbar-thin">
                            {selectedServices.length > 0 ? (
                              selectedServices.map((s) => (
                                <div key={s.name} className="flex justify-between">
                                  <span>• {s.name}</span>
                                  <span>₹{s.price}</span>
                                </div>
                              ))
                            ) : (
                              <div className="flex justify-between">
                                <span>• Custom Style Allocation</span>
                                <span>At chair</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="border-t border-gold/10 pt-3 mt-3 flex justify-between font-bold text-sm">
                          <span className="text-gold-deep">ESTIMATED DUE:</span>
                          <span className="text-cream text-right">{totalAmount === 0 ? 'At chair' : `₹${totalAmount}`}</span>
                        </div>
                      </div>

                      <div className="mt-4 border-t border-gold/10 pt-3 text-center text-[8px] text-gold/40 uppercase tracking-[0.25em]">
                        ★ Thank you for choosing Black & Brown ★
                      </div>
                    </motion.div>
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
