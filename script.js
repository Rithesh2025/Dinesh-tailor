/* ════════════════════════════════════════
   Dinesh Tailor & Textile — main.js
   ════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── 1. Nav shadow on scroll ── */
  const nav = document.querySelector('nav');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 10) {
      nav.style.boxShadow = '0 2px 16px rgba(35,32,24,0.10)';
    } else {
      nav.style.boxShadow = 'none';
    }
  }, { passive: true });


  /* ── 2. Live "Open / Closed" badge ── */
  const dot   = document.querySelector('.img-badge-dot');
  const label = document.querySelector('.img-badge span');

  function updateOpenStatus() {
    const now  = new Date();
    const day  = now.getDay();   // 0 = Sunday
    const hour = now.getHours(); // 0-23

    const isWeekday = day >= 1 && day <= 6;   // Monday – Saturday
    const isOpen    = isWeekday && hour >= 10 && hour < 20; // 10 AM – 8 PM

    if (isOpen) {
      dot.style.background   = '#5dd87a';
      dot.style.boxShadow    = '0 0 7px #5dd87a99';
      label.textContent      = 'Open Now · Closes 8 PM';
    } else {
      dot.style.background   = '#e05a5a';
      dot.style.boxShadow    = '0 0 7px #e05a5a99';
      const opensMsg = day === 0 ? 'Closed Today · Opens Monday' : 'Closed · Opens 10 AM';
      label.textContent      = opensMsg;
    }
  }

  updateOpenStatus();


  /* ── 3. Smooth scroll for anchor links ── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });


  /* ── 4. Service card entrance animation (IntersectionObserver) ── */
  const cards = document.querySelectorAll('.svc-card');

  // Set initial hidden state
  cards.forEach(card => {
    card.style.opacity   = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.45s ease, transform 0.45s ease';
  });

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity   = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  cards.forEach(card => observer.observe(card));


  /* ── 5. Stat counter animation ── */
  const stats = document.querySelectorAll('.stat-n');

  function animateCounter(el) {
    const raw    = el.textContent.trim();          // e.g. "1000+"
    const suffix = raw.replace(/[0-9]/g, '');      // "+"
    const target = parseInt(raw.replace(/\D/g, ''), 10); // 1000
    const duration = 1200; // ms
    const start    = performance.now();

    function step(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      el.textContent = Math.round(eased * target) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  const statsObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        statsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  stats.forEach(el => statsObserver.observe(el));

});