const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ---------- Header: scrolled state ----------
const header = document.getElementById('header');
const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 20);
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

// ---------- Mobile menu ----------
const burger = document.getElementById('burger');
const nav = document.getElementById('nav');
const setMenu = (open) => {
  nav.classList.toggle('is-open', open);
  burger.setAttribute('aria-expanded', String(open));
  burger.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
  document.body.style.overflow = open ? 'hidden' : '';
};
burger.addEventListener('click', () => setMenu(!nav.classList.contains('is-open')));
nav.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });

// ---------- Active nav link ----------
const navLinks = [...nav.querySelectorAll('a[href^="#"]')];
const sections = navLinks
  .map((a) => document.querySelector(a.getAttribute('href')))
  .filter(Boolean);
const navObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    navLinks.forEach((a) => a.classList.toggle('is-active', a.getAttribute('href') === '#' + entry.target.id));
  });
}, { rootMargin: '-45% 0px -50% 0px' });
sections.forEach((s) => navObserver.observe(s));

// ---------- Reveal on scroll (with stagger inside groups) ----------
document.querySelectorAll('.stats, .bento, .scale__grid, .steps, .cond, .values, .duo').forEach((group) => {
  group.querySelectorAll('.reveal').forEach((el, i) => el.style.setProperty('--d', `${i * 0.08}s`));
});
document.querySelectorAll('.hero .reveal').forEach((el, i) => el.style.setProperty('--d', `${i * 0.1}s`));

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('is-visible');
    revealObserver.unobserve(entry.target);
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

// ---------- Count-up numbers ----------
const countUp = (el) => {
  const target = Number(el.dataset.count);
  if (reducedMotion) { el.textContent = target; return; }
  const duration = 1600;
  const start = performance.now();
  const tick = (now) => {
    const p = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 4);
    el.textContent = Math.round(target * eased);
    if (p < 1) requestAnimationFrame(tick);
  };
  el.textContent = '0';
  requestAnimationFrame(tick);
};
const countObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    countUp(entry.target);
    countObserver.unobserve(entry.target);
  });
}, { threshold: 0.6 });
document.querySelectorAll('[data-count]').forEach((el) => countObserver.observe(el));

// ---------- Start-of-day toggle ----------
document.querySelectorAll('.start-toggle').forEach((group) => {
  group.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;
    group.querySelectorAll('button').forEach((b) => b.classList.toggle('is-active', b === btn));
  });
});

// ---------- Hero parallax ----------
const heroPhoto = document.querySelector('.hero__visual');
if (heroPhoto && !reducedMotion) {
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (window.innerWidth <= 960) { heroPhoto.style.transform = ''; return; }
    if (y < window.innerHeight) heroPhoto.style.transform = `translateY(${y * 0.08}px)`;
  }, { passive: true });
}

document.getElementById('year').textContent = new Date().getFullYear();
