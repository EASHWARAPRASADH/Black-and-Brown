/** Helpers shared by the booking and academy enrollment forms. */

export const WHATSAPP_NUMBER = '916374854329';

// 'Website' means the server accepted it. The others only opened the customer's own app.
export type SentVia = 'Website' | 'WhatsApp' | 'Your email app';

// Local calendar date as YYYY-MM-DD. toISOString() would use UTC, which is the
// previous day in India until 5:30 AM.
export const toDateInput = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

export const parseDateInput = (value: string) => {
  const [y, m, d] = value.split('-').map(Number);
  return new Date(y, m - 1, d);
};

export const formatDate = (value: string) =>
  value
    ? parseDateInput(value).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
    : '';

// Open Mon-Sat 9:00-20:00 and Sun 10:00-18:00 (see CONTACT_INFO.hours).
// `minutes` is minutes after midnight.
export const isSlotOpen = (date: string, minutes: number) => {
  if (!date) return true;
  const [open, close] = parseDateInput(date).getDay() === 0 ? [600, 1080] : [540, 1200];
  if (minutes < open || minutes >= close) return false;
  const now = new Date();
  if (date === toDateInput(now)) return minutes > now.getHours() * 60 + now.getMinutes();
  return true;
};

export const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

export const isValidPhone = (phone: string) => {
  const digits = phone.replace(/\D/g, '');
  return /^[+\d\s()-]+$/.test(phone.trim()) && digits.length >= 10 && digits.length <= 13;
};

/** Posts a form to the server mailer. Returns true only if the email was accepted for delivery. */
export const submitRequest = async (payload: Record<string, unknown>): Promise<boolean> => {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), 30000);
  try {
    const response = await fetch('/api/send-request.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal
    });
    if (!response.ok) return false;
    const data = await response.json();
    return data?.ok === true;
  } catch {
    return false;
  } finally {
    window.clearTimeout(timer);
  }
};
