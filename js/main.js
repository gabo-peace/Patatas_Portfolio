/**
 * NZV Studio — main.js
 * ────────────────────────────────────────────────────────────────
 * Handles:
 *  1. Custom cursor
 *  2. Navigation scroll behaviour & mobile menu
 *  3. Scroll-triggered reveal animations
 *  4. Work grid filter
 *  5. Contact form (client-side validation + Formspree hook)
 * ────────────────────────────────────────────────────────────────
 */

(function () {
  'use strict';

  /* ─── Helpers ─────────────────────────────────────────────── */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  /* ═══════════════════════════════════════════════════════════
     1. Custom cursor
     ═══════════════════════════════════════════════════════════ */
  const cursor    = $('#cursor');
  const cursorDot = $('#cursorDot');

  if (cursor && cursorDot && window.matchMedia('(hover: hover)').matches) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let curX   = mouseX;
    let curY   = mouseY;

    document.addEventListener('mousemove', e => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      // dot follows immediately
      cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
    });

    // Ring follows with slight lag via rAF
    function animateCursor() {
      curX += (mouseX - curX) * 0.14;
      curY += (mouseY - curY) * 0.14;
      cursor.style.transform = `translate(${curX}px, ${curY}px) translate(-50%, -50%)`;
      requestAnimationFrame(animateCursor);
    }
    requestAnimationFrame(animateCursor);

    // Grow cursor on interactive elements
    const hoverEls = 'a, button, .filter__btn, .project-card__link, .shop-card__link, .editorial-item__link, input, textarea, select';
    document.addEventListener('mouseover', e => {
      if (e.target.closest(hoverEls)) document.body.classList.add('cursor-hover');
    });
    document.addEventListener('mouseout', e => {
      if (e.target.closest(hoverEls)) document.body.classList.remove('cursor-hover');
    });

    // Hide when leaving window
    document.addEventListener('mouseleave', () => {
      cursor.style.opacity    = '0';
      cursorDot.style.opacity = '0';
    });
    document.addEventListener('mouseenter', () => {
      cursor.style.opacity    = '1';
      cursorDot.style.opacity = '1';
    });
  }

  /* ═══════════════════════════════════════════════════════════
     2. Navigation — scroll state & mobile menu
     ═══════════════════════════════════════════════════════════ */
  const nav         = $('#nav');
  const hamburger   = $('#hamburger');
  const navLinks    = $('#navLinks');
  const navLinkList = $$('.nav__link');

  // Frosted nav on scroll
  const scrollThreshold = 40;
  function updateNav() {
    nav.classList.toggle('is-scrolled', window.scrollY > scrollThreshold);
  }
  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();

  // Mobile hamburger toggle
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('is-open');
      hamburger.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close menu when a nav link is clicked
    navLinkList.forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('is-open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    // Close menu on Escape
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && navLinks.classList.contains('is-open')) {
        navLinks.classList.remove('is-open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
        hamburger.focus();
      }
    });
  }

  // Highlight active nav link on section enter
  const sections = $$('section[id], header[id]');
  const navMap   = {};
  navLinkList.forEach(link => {
    const target = link.getAttribute('href').replace('#', '');
    navMap[target] = link;
  });

  function setActiveLink() {
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
    });
    navLinkList.forEach(link => link.classList.remove('is-active'));
    if (navMap[current]) navMap[current].classList.add('is-active');
  }
  window.addEventListener('scroll', setActiveLink, { passive: true });

  /* ═══════════════════════════════════════════════════════════
     3. Scroll-triggered reveal
     ═══════════════════════════════════════════════════════════ */
  const revealObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
  );

  $$('.reveal').forEach(el => revealObserver.observe(el));

  /* ═══════════════════════════════════════════════════════════
     4. Work grid filter
     ═══════════════════════════════════════════════════════════ */
  const filterBtns = $$('.filter__btn');
  const workCards  = $$('.project-card', document.getElementById('workGrid'));

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;

      // Update button state
      filterBtns.forEach(b => {
        b.classList.remove('is-active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('is-active');
      btn.setAttribute('aria-selected', 'true');

      // Filter cards with a brief fade cycle
      workCards.forEach(card => {
        const match = filter === 'all' || card.dataset.category === filter;

        if (match) {
          card.classList.remove('is-hidden');
          // Re-trigger reveal animation for showing cards
          card.classList.remove('is-visible');
          requestAnimationFrame(() => {
            requestAnimationFrame(() => card.classList.add('is-visible'));
          });
        } else {
          card.classList.add('is-hidden');
        }
      });
    });
  });

  // Make all cards visible on load (after reveal observer fires)
  workCards.forEach(card => revealObserver.observe(card));

  /* ═══════════════════════════════════════════════════════════
     5. Contact form — validation + Formspree
     ═══════════════════════════════════════════════════════════ */
  const form        = $('#contactForm');
  const formSuccess = $('#formSuccess');

  if (form) {
    form.addEventListener('submit', async function (e) {
      e.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      const submitBtn       = form.querySelector('.btn-send');
      const btnText         = submitBtn.querySelector('.btn-send__text');
      const originalText    = btnText.textContent;

      submitBtn.disabled    = true;
      btnText.textContent   = 'Sending…';

      /* ─────────────────────────────────────────────────────────
         OPTION A — Formspree (recommended, free tier available)
         ─────────────────────────────────────────────────────────
         1. Go to https://formspree.io and create a free account
         2. Create a new form and copy your endpoint ID (e.g. xpzgkqbb)
         3. Replace YOUR_FORM_ID below with that ID
         ─────────────────────────────────────────────────────── */
      const FORMSPREE_ID = 'YOUR_FORM_ID'; // ← replace this

      /* ─────────────────────────────────────────────────────────
         OPTION B — mailto fallback (works without a backend)
         Uncomment the block below and comment out the fetch block
         ─────────────────────────────────────────────────────── */
      // const data     = new FormData(form);
      // const subject  = encodeURIComponent('Portfolio enquiry from ' + data.get('name'));
      // const body     = encodeURIComponent(`Name: ${data.get('name')}\nEmail: ${data.get('email')}\nProject: ${data.get('project')}\n\n${data.get('message')}`);
      // window.location.href = `mailto:hi@nzvstudio.com?subject=${subject}&body=${body}`;
      // showSuccess();

      if (FORMSPREE_ID === 'YOUR_FORM_ID') {
        // Demo mode — simulate success
        await new Promise(r => setTimeout(r, 800));
        showSuccess();
      } else {
        try {
          const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
            method: 'POST',
            headers: { 'Accept': 'application/json' },
            body: new FormData(form),
          });

          if (res.ok) {
            showSuccess();
          } else {
            const data = await res.json();
            throw new Error(data?.errors?.map(e => e.message).join(', ') || 'Submission failed');
          }
        } catch (err) {
          btnText.textContent = 'Something went wrong — please email directly';
          submitBtn.disabled  = false;
          console.error('Form error:', err);
        }
      }

      function showSuccess() {
        form.reset();
        submitBtn.disabled    = false;
        btnText.textContent   = originalText;
        formSuccess.hidden    = false;
        setTimeout(() => { formSuccess.hidden = true; }, 6000);
      }
    });
  }

  /* ═══════════════════════════════════════════════════════════
     Misc — smooth scroll offset for fixed nav
     ═══════════════════════════════════════════════════════════ */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.getElementById(this.getAttribute('href').slice(1));
      if (!target) return;
      e.preventDefault();
      const offset = nav ? nav.offsetHeight + 16 : 80;
      const top    = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

})();
