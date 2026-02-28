/**
 * NZV Studio — COMPLEX edition main.js
 * ────────────────────────────────────────────────────────────────
 * 1. Custom cursor (mix-blend-mode difference)
 * 2. Page loader
 * 3. Navigation — scroll state & mobile overlay
 * 4. Scroll-triggered reveal (IntersectionObserver)
 * 5. Work grid filter
 * 6. Testimonials carousel
 * 7. Hero parallax (subtle)
 * 8. Contact form — Formspree + mailto fallback
 * ────────────────────────────────────────────────────────────────
 */

(function () {
  'use strict';

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const isTouch = () => !window.matchMedia('(hover: hover)').matches;

  /* ═══════════════════════════════════════════════════════════
     1. Custom cursor
     ═══════════════════════════════════════════════════════════ */
  const cursorEl = $('#cursor');

  if (cursorEl && !isTouch()) {
    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let cx = mx;
    let cy = my;

    document.addEventListener('mousemove', e => {
      mx = e.clientX;
      my = e.clientY;
    });

    (function tick() {
      cx += (mx - cx) * 0.18;
      cy += (my - cy) * 0.18;
      cursorEl.style.transform = `translate(${cx}px, ${cy}px) translate(-50%,-50%)`;
      requestAnimationFrame(tick);
    })();

    const hoverSel = 'a, button, .filter__btn, .work-card__link, .shop-card__link, .personal-item__link, input, textarea, select, .testimonials__btn';
    document.addEventListener('mouseover', e => {
      if (e.target.closest(hoverSel)) document.body.classList.add('cursor-hover');
    });
    document.addEventListener('mouseout', e => {
      if (e.target.closest(hoverSel)) document.body.classList.remove('cursor-hover');
    });

    document.addEventListener('mouseleave', () => { cursorEl.style.opacity = '0'; });
    document.addEventListener('mouseenter', () => { cursorEl.style.opacity = '1'; });
  }

  /* ═══════════════════════════════════════════════════════════
     2. Page loader
     ═══════════════════════════════════════════════════════════ */
  const loader = $('#loader');

  function dismissLoader() {
    if (!loader) return;
    loader.classList.add('is-done');
    document.body.style.overflow = '';
  }

  if (loader) {
    document.body.style.overflow = 'hidden';
    // Dismiss after animation (1.2s fill + small buffer)
    setTimeout(dismissLoader, 1600);
    window.addEventListener('load', () => setTimeout(dismissLoader, 300));
  }

  /* ═══════════════════════════════════════════════════════════
     3. Navigation — scroll state & mobile overlay
     ═══════════════════════════════════════════════════════════ */
  const nav        = $('#nav');
  const hamburger  = $('#hamburger');
  const mobileNav  = $('#mobileNav');

  // Frosted nav on scroll
  function updateNav() {
    nav.classList.toggle('is-scrolled', window.scrollY > 50);
  }
  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();

  // Mobile menu
  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      const isOpen = mobileNav.classList.toggle('is-open');
      hamburger.classList.toggle('is-open', isOpen);
      hamburger.setAttribute('aria-expanded', String(isOpen));
      mobileNav.setAttribute('aria-hidden', String(!isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    $$('a', mobileNav).forEach(link => {
      link.addEventListener('click', () => {
        mobileNav.classList.remove('is-open');
        hamburger.classList.remove('is-open');
        hamburger.setAttribute('aria-expanded', 'false');
        mobileNav.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      });
    });

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && mobileNav.classList.contains('is-open')) {
        mobileNav.classList.remove('is-open');
        hamburger.classList.remove('is-open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
        hamburger.focus();
      }
    });
  }

  /* ═══════════════════════════════════════════════════════════
     4. Scroll-triggered reveal
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
    { threshold: 0.1, rootMargin: '0px 0px -48px 0px' }
  );

  $$('.reveal, .reveal--dark').forEach(el => revealObserver.observe(el));

  /* ═══════════════════════════════════════════════════════════
     5. Work grid filter
     ═══════════════════════════════════════════════════════════ */
  const filterBtns = $$('.filter__btn');
  const workCards  = $$('.work-card', $('#workGrid'));

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;

      filterBtns.forEach(b => {
        b.classList.remove('is-active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('is-active');
      btn.setAttribute('aria-selected', 'true');

      workCards.forEach(card => {
        const match = filter === 'all' || card.dataset.category === filter;

        if (match) {
          card.classList.remove('is-hidden');
          // re-trigger reveal
          card.classList.remove('is-visible');
          requestAnimationFrame(() => requestAnimationFrame(() => card.classList.add('is-visible')));
        } else {
          card.classList.add('is-hidden');
          card.classList.remove('is-visible');
        }
      });
    });
  });

  // Initial reveal of work cards
  workCards.forEach(card => revealObserver.observe(card));

  /* ═══════════════════════════════════════════════════════════
     6. Testimonials carousel
     ═══════════════════════════════════════════════════════════ */
  const track    = $('#testimonialTrack');
  const tPrev    = $('#tPrev');
  const tNext    = $('#tNext');
  const tCounter = $('#tCounter');

  if (track && tPrev && tNext) {
    const testimonials = $$('.testimonial', track);
    let current = 0;

    function goTo(index) {
      const total = testimonials.length;
      current = (index + total) % total;

      // Slide the track
      testimonials.forEach((t, i) => {
        t.style.transform = `translateX(${(i - current) * 100}%)`;
        t.style.visibility = i === current ? 'visible' : 'hidden';
      });

      if (tCounter) tCounter.textContent = `${current + 1} / ${total}`;
    }

    // Init: stack all testimonials on top of each other (only first visible)
    testimonials.forEach((t, i) => {
      t.style.position  = 'absolute';
      t.style.top       = '0';
      t.style.left      = '0';
      t.style.width     = '100%';
      t.style.transform = `translateX(${i * 100}%)`;
      t.style.transition = `transform 0.7s cubic-bezier(0.22, 1, 0.36, 1)`;
      if (i !== 0) t.style.visibility = 'hidden';
    });

    track.style.position = 'relative';
    // Set min-height to tallest testimonial after fonts load
    window.addEventListener('load', () => {
      let maxH = 0;
      testimonials.forEach(t => {
        t.style.visibility = 'visible';
        maxH = Math.max(maxH, t.offsetHeight);
        t.style.visibility = 'hidden';
      });
      testimonials[0].style.visibility = 'visible';
      track.style.height = maxH + 'px';
    });

    tPrev.addEventListener('click', () => goTo(current - 1));
    tNext.addEventListener('click', () => goTo(current + 1));

    // Auto-advance every 7s
    let autoplay = setInterval(() => goTo(current + 1), 7000);

    [tPrev, tNext].forEach(btn => {
      btn.addEventListener('click', () => {
        clearInterval(autoplay);
        autoplay = setInterval(() => goTo(current + 1), 7000);
      });
    });

    // Touch / swipe support
    let touchStartX = null;
    track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', e => {
      if (touchStartX === null) return;
      const dx = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(dx) > 50) goTo(dx < 0 ? current + 1 : current - 1);
      touchStartX = null;
    });
  }

  /* ═══════════════════════════════════════════════════════════
     7. Hero parallax (subtle — disabled on touch/mobile)
     ═══════════════════════════════════════════════════════════ */
  const heroFrame = $('.hero__img-frame');
  const heroBgWord = $('.hero__bg-word');

  if (heroFrame && !isTouch()) {
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      if (y > window.innerHeight) return;
      heroFrame.style.transform    = `translateY(${y * 0.15}px)`;
      if (heroBgWord) heroBgWord.style.transform = `translateX(-50%) translateY(calc(-50% + ${y * 0.08}px))`;
    }, { passive: true });
  }

  /* ═══════════════════════════════════════════════════════════
     8. Contact form — Formspree + mailto fallback
     ═══════════════════════════════════════════════════════════ */
  const form        = $('#contactForm');
  const formSuccess = $('#formSuccess');

  if (form) {
    form.addEventListener('submit', async e => {
      e.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      const submitBtn = form.querySelector('.btn-send');
      const btnText   = submitBtn.querySelector('.btn-send__text');
      const origText  = btnText.textContent;
      submitBtn.disabled  = true;
      btnText.textContent = 'Sending…';

      /* ─────────────────────────────────────────────────────
         OPTION A — Formspree (recommended)
         1. Create free account at https://formspree.io
         2. Create a form — copy your ID (e.g. xpzgkqbb)
         3. Paste it below
         ───────────────────────────────────────────────── */
      const FORMSPREE_ID = 'YOUR_FORM_ID'; // ← replace this

      /* ─────────────────────────────────────────────────────
         OPTION B — mailto fallback
         Uncomment below, comment out the fetch block.
         ─────────────────────────────────────────────────── */
      // const d = new FormData(form);
      // const subject = encodeURIComponent('Portfolio enquiry from ' + d.get('name'));
      // const body    = encodeURIComponent(`Name: ${d.get('name')}\nEmail: ${d.get('email')}\nProject: ${d.get('project')}\n\n${d.get('message')}`);
      // window.location.href = `mailto:hi@nzvstudio.com?subject=${subject}&body=${body}`;
      // showSuccess(); return;

      if (FORMSPREE_ID === 'YOUR_FORM_ID') {
        await new Promise(r => setTimeout(r, 900));
        showSuccess();
      } else {
        try {
          const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
            method: 'POST',
            headers: { Accept: 'application/json' },
            body: new FormData(form),
          });
          if (res.ok) {
            showSuccess();
          } else {
            const data = await res.json();
            throw new Error(data?.errors?.map(e => e.message).join(', ') || 'Failed');
          }
        } catch (err) {
          btnText.textContent = 'Error — please email directly';
          submitBtn.disabled  = false;
          console.error(err);
        }
      }

      function showSuccess() {
        form.reset();
        submitBtn.disabled   = false;
        btnText.textContent  = origText;
        formSuccess.hidden   = false;
        setTimeout(() => { formSuccess.hidden = true; }, 7000);
      }
    });
  }

  /* ═══════════════════════════════════════════════════════════
     Smooth scroll with nav offset
     ═══════════════════════════════════════════════════════════ */
  $$('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const id = this.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      const offset = (nav ? nav.offsetHeight : 70) + 16;
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - offset, behavior: 'smooth' });
    });
  });

})();
