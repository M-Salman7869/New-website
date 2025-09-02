script.js

/* =========================
   Lumina — script.js
   Interactions: mobile nav, sticky header, reveal-on-scroll,
   theme toggle, form validation, back-to-top, smooth scroll
   ========================= */

(function () {
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  /* Header shadow on scroll */
  const header = $('.site-header');
  const toTop = $('.to-top');
  const setHeaderShadow = () => {
    const shadow = window.scrollY > 8;
    header?.setAttribute('data-shadow', String(shadow));
    toTop?.classList.toggle('show', window.scrollY > 600);
  };
  setHeaderShadow();
  window.addEventListener('scroll', setHeaderShadow, { passive: true });

  /* Mobile nav toggle */
  const navToggle = $('.nav__toggle');
  const navMenu = $('#navMenu');
  const toggleNav = () => {
    const expanded = navMenu.getAttribute('aria-expanded') === 'true';
    navMenu.setAttribute('aria-expanded', String(!expanded));
    navToggle.setAttribute('aria-expanded', String(!expanded));
    document.body.style.overflow = !expanded ? 'hidden' : '';
    // animate burger => close
    const bars = $('.nav__bars', navToggle);
    bars.style.transform = !expanded ? 'translateX(-50%) rotate(45deg)' : 'translateX(-50%)';
    bars.style.top = !expanded ? '50%' : '';
    bars.style.background = !expanded ? 'transparent' : '';
    bars.style.setProperty('--x', !expanded ? 1 : 0);
    bars.before.style = bars.after?.style = '';
  };
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', toggleNav);
    // collapse on link click (mobile)
    $$('#navMenu a').forEach(a => a.addEventListener('click', () => {
      if (getComputedStyle(navToggle).display !== 'none' && navMenu.getAttribute('aria-expanded') === 'true') toggleNav();
    }));
  }

  /* Smooth scroll for hash links */
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute('href').slice(1);
    const el = document.getElementById(id);
    if (!el) return;
    e.preventDefault();
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    history.pushState(null, '', `#${id}`);
  });

  /* Reveal on scroll */
  const reveals = $$('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(({ isIntersecting, target }) => {
      if (isIntersecting) {
        target.classList.add('visible');
        io.unobserve(target);
      }
    });
  }, { threshold: 0.18 });
  reveals.forEach(el => io.observe(el));

  /* Theme toggle (persisted) */
  const themeToggle = $('#themeToggle');
  const root = document.documentElement;
  const stored = localStorage.getItem('theme');
  if (stored) root.setAttribute('data-theme', stored);
  themeToggle?.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    root.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  });

  /* Year in footer */
  $('#year').textContent = new Date().getFullYear();

  /* Contact form validation */
  const contactForm = $('#contactForm');
  const validators = {
    name: v => v.trim().length >= 2 || 'Please enter your full name.',
    email: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Enter a valid email.',
    budget: v => v !== '' && v !== null || 'Please select a budget.',
    message: v => v.trim().length >= 20 || 'Give us at least 20 characters.'
  };
  const showError = (id, msg = '') => {
    const el = $(`#err-${id}`);
    if (el) el.textContent = msg;
  };
  contactForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    let ok = true;
    const data = new FormData(contactForm);
    for (const [key, val] of data.entries()) {
      const res = validators[key]?.(String(val));
      if (res !== true) { ok = false; showError(key, res); } else showError(key, '');
    }
    if (ok) {
      $('#formSuccess').hidden = false;
      contactForm.reset();
      setTimeout(() => { $('#formSuccess').hidden = true; }, 4000);
    }
  });
  // live validation
  ['name','email','budget','message'].forEach(id => {
    const input = document.getElementById(id);
    input?.addEventListener('input', () => {
      const res = validators[id](input.value);
      showError(id, res === true ? '' : res);
    });
  });

  /* Newsletter mini-validation */
  const newsForm = $('#newsletterForm');
  newsForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = $('#newsEmail').value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      $('#err-news').textContent = 'Please enter a valid email.';
      return;
    }
    $('#err-news').textContent = '';
    newsForm.reset();
    alert('Subscribed! 🎉');
  });

  /* Keyboard enhancements */
  // Close mobile menu with Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu?.getAttribute('aria-expanded') === 'true') toggleNav();
  });

})();


---

How to customize (quick tips)

Branding: Change the name “Lumina” and the gradient colors --primary and --primary-2 in :root.

Sections: Duplicate any .card or .work-card to add more content.

Dark mode default: Set data-theme="dark" on <html> or remove data-theme entirely to follow the OS preference.

Deploy: Drop the folder into Netlify/Vercel or any static host. No build step required.


If you want this re-skinned for a specific niche (restaurant, SaaS, portfolio, event, etc.), tell me your vibe and I’ll tailor the copy, sections, a