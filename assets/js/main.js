const HOURS = [
  { day: 'Sunday', open: 12 * 60, close: 18 * 60, label: '12 — 6 PM' },
  { day: 'Monday', closed: true, label: 'Closed' },
  { day: 'Tuesday', closed: true, label: 'Closed' },
  { day: 'Wednesday', open: 17 * 60, close: 21 * 60, label: '5 — 9 PM' },
  { day: 'Thursday', open: 17 * 60, close: 21 * 60, label: '5 — 9 PM' },
  { day: 'Friday', open: 17 * 60, close: 21 * 60, label: '5 — 9 PM' },
  { day: 'Saturday', open: 12 * 60, close: 21 * 60, label: '12 — 9 PM' },
];

const $ = (selector, context = document) => context.querySelector(selector);
const $$ = (selector, context = document) => [...context.querySelectorAll(selector)];

function easternNow() {
  const parts = new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', weekday: 'long', hour: 'numeric', minute: 'numeric', hourCycle: 'h23' }).formatToParts(new Date());
  const value = type => parts.find(part => part.type === type)?.value ?? '';
  return { day: value('weekday'), minutes: Number(value('hour')) * 60 + Number(value('minute')) };
}

function updateHours() {
  const now = easternNow();
  const today = HOURS.find(row => row.day === now.day) ?? HOURS[0];
  const isOpen = !today.closed && now.minutes >= today.open && now.minutes < today.close;
  const label = isOpen ? 'Open now' : today.closed ? 'Closed today' : 'Closed';
  $$('[data-hours-status]').forEach(node => { node.textContent = isOpen ? 'Open now / doors are open' : `${label} / see events for updates`; });
  $$('[data-open-badge]').forEach(node => { node.textContent = label; node.classList.toggle('is-open', isOpen); });
}

function initNavigation() {
  const nav = $('[data-nav]');
  const menu = $('[data-mobile-menu]');
  const toggle = $('[data-menu-toggle]');
  const close = $('[data-menu-close]');
  const setMenu = open => { menu.hidden = !open; toggle?.setAttribute('aria-expanded', String(open)); };
  toggle?.addEventListener('click', () => setMenu(true));
  close?.addEventListener('click', () => setMenu(false));
  $$('.mobile-menu a').forEach(link => link.addEventListener('click', () => setMenu(false)));
  window.addEventListener('scroll', () => nav?.classList.toggle('scrolled', window.scrollY > 20), { passive: true });
}

function initReveals() {
  const items = $$('.reveal-up');
  if (!('IntersectionObserver' in window)) { items.forEach(item => item.classList.add('is-visible')); return; }
  const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); } }), { threshold: .14 });
  items.forEach(item => observer.observe(item));
}

function initLightbox() {
  const dialog = $('[data-lightbox-dialog]');
  const image = $('[data-lightbox-image]');
  const caption = $('[data-lightbox-caption]');
  if (!dialog || !image) return;
  $$('[data-lightbox]').forEach(tile => tile.addEventListener('click', () => { image.src = tile.dataset.lightbox; image.alt = tile.querySelector('img')?.alt ?? ''; caption.textContent = tile.dataset.caption ?? ''; dialog.showModal(); }));
  $('[data-lightbox-close]')?.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
}

function initCopy() {
  $('[data-copy-address]')?.addEventListener('click', async () => {
    const address = '95 Wolcott Road, Wolcott, CT 06716';
    try { await navigator.clipboard.writeText(address); } catch { /* Clipboard may be unavailable in preview contexts. */ }
    const toast = $('[data-toast]');
    if (!toast) return;
    toast.hidden = false;
    window.setTimeout(() => { toast.hidden = true; }, 1800);
  });
}

function init() {
  updateHours();
  initNavigation();
  initReveals();
  initLightbox();
  initCopy();
  const year = $('[data-year]');
  if (year) year.textContent = String(new Date().getFullYear());
}

document.addEventListener('DOMContentLoaded', init);
