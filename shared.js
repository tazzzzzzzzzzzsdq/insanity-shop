// ── Shared utilities ─────────────────────────────────────────────────────────

// Pause animation when tab is hidden
let _rafId = null;
function pauseableRAF(fn) {
  function loop() {
    if (!document.hidden) fn();
    _rafId = requestAnimationFrame(loop);
  }
  _rafId = requestAnimationFrame(loop);
  return () => cancelAnimationFrame(_rafId);
}

// Snow
function initSnow(count = 80) {
  const container = document.getElementById('snow');
  if (!container) return;
  for (let i = 0; i < count; i++) {
    const f = document.createElement('div');
    f.className = 'flake';
    f.textContent = '•';
    f.style.cssText = `
      left:${Math.random()*100}vw;
      top:${Math.random()*-200}px;
      font-size:${Math.random()*8+5}px;
      opacity:${Math.random()*0.4+0.15};
      animation-duration:${Math.random()*10+8}s;
      animation-delay:${Math.random()*-25}s;
    `;
    container.appendChild(f);
  }
}

// Animated counter
function animateCounter(el, target, duration = 1800) {
  let start = null;
  const from = 0;
  function step(ts) {
    if (!start) start = ts;
    const progress = Math.min((ts - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    el.textContent = Math.floor(eased * target).toLocaleString('fr-FR');
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

// Intersection observer for scroll animations
function initScrollReveal() {
  const els = document.querySelectorAll('[data-reveal]');
  if (!els.length) return;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('revealed');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  els.forEach(el => obs.observe(el));
}

// FAQ accordion
function initFAQ() {
  document.querySelectorAll('.faq-item').forEach(item => {
    item.querySelector('.faq-q').addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });
}

// Cookie banner
function initCookies() {
  if (localStorage.getItem('cookies_accepted')) return;
  const banner = document.getElementById('cookie-banner');
  if (!banner) return;
  banner.style.display = 'flex';
  document.getElementById('accept-cookies').addEventListener('click', () => {
    localStorage.setItem('cookies_accepted', '1');
    banner.style.display = 'none';
  });
}

// Apply discord links from config
function applyConfig() {
  if (typeof SITE_CONFIG === 'undefined') return;
  document.querySelectorAll('[data-discord]').forEach(el => {
    el.href = SITE_CONFIG.discordUrl;
  });
  document.querySelectorAll('[data-sitename]').forEach(el => {
    el.textContent = SITE_CONFIG.siteName;
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initSnow(100);
  initScrollReveal();
  initFAQ();
  initCookies();
  applyConfig();
});
