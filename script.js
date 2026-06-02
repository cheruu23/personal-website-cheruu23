/* =========================================================
   Cherinet Asrat — Portfolio site JS
   - Rotating role text
   - Cursor glow (desktop)
   - Scroll progress bar
   - Navbar scroll state & active link
   - Mobile menu
   - Counter animation
   - Fade-in observer
   - Testimonials rendering
   - Contact form (mailto fallback)
   - Now widget rotation
   - Dynamic content loading (admin panel compatibility)
   ========================================================= */

(() => {
  'use strict';

  // ── helpers ─────────────────────────────────────────────
  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isCoarsePointer = window.matchMedia('(hover: none), (pointer: coarse)').matches;

  // ── scroll progress bar ─────────────────────────────────
  const progressBar = $('#scrollProgress');
  function updateProgress() {
    const h = document.documentElement;
    const scrolled = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
    if (progressBar) progressBar.style.width = `${Math.min(100, scrolled)}%`;
  }

  // ── navbar scroll state ─────────────────────────────────
  const navbar = $('#navbar');
  const scrollTopBtn = $('#scrollTop');
  function updateNavbar() {
    if (!navbar) return;
    navbar.classList.toggle('scrolled', window.scrollY > 30);
    if (scrollTopBtn) scrollTopBtn.classList.toggle('visible', window.scrollY > 400);
  }

  // ── active nav link ─────────────────────────────────────
  const sections = $$('section[id]');
  const navItems = $$('.nav-links a');
  function updateActiveLink() {
    let current = '';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 140) current = s.id;
    });
    navItems.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === '#' + current);
    });
  }

  // ── mobile menu ─────────────────────────────────────────
  const hamburger = $('#hamburger');
  const navLinks  = $('#navLinks');
  function closeMobileMenu() {
    navLinks?.classList.remove('open');
    hamburger?.classList.remove('active');
    if (hamburger) hamburger.setAttribute('aria-expanded', 'false');
  }
  if (hamburger) {
    hamburger.addEventListener('click', () => {
      const open = navLinks.classList.toggle('open');
      hamburger.classList.toggle('active');
      hamburger.setAttribute('aria-expanded', String(open));
    });
    navLinks?.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMobileMenu);
    });
  }

  // ── cursor glow (desktop only) ──────────────────────────
  const cursorGlow = $('#cursorGlow');
  let glowRAF = null;
  let glowX = window.innerWidth / 2;
  let glowY = window.innerHeight / 2;
  let targetX = glowX;
  let targetY = glowY;

  function handleGlowMove(e) {
    if (isCoarsePointer || prefersReducedMotion) return;
    targetX = e.clientX;
    targetY = e.clientY;
    if (cursorGlow) cursorGlow.style.opacity = '1';
    if (!glowRAF) glowRAF = requestAnimationFrame(animateGlow);
  }
  function animateGlow() {
    glowX += (targetX - glowX) * 0.15;
    glowY += (targetY - glowY) * 0.15;
    if (cursorGlow) {
      cursorGlow.style.transform = `translate(${glowX}px, ${glowY}px) translate(-50%, -50%)`;
    }
    if (Math.abs(targetX - glowX) > 0.5 || Math.abs(targetY - glowY) > 0.5) {
      glowRAF = requestAnimationFrame(animateGlow);
    } else {
      glowRAF = null;
    }
  }
  if (cursorGlow && !isCoarsePointer && !prefersReducedMotion) {
    document.addEventListener('mousemove', handleGlowMove, { passive: true });
  }

  // ── scroll listeners (throttled via rAF) ────────────────
  let scrollTicking = false;
  window.addEventListener('scroll', () => {
    if (!scrollTicking) {
      requestAnimationFrame(() => {
        updateProgress();
        updateNavbar();
        updateActiveLink();
        scrollTicking = false;
      });
      scrollTicking = true;
    }
  }, { passive: true });

  // ── rotating role text ──────────────────────────────────
  const ROLES = [
    'Fullstack Developer',
    'MERN Stack Engineer',
    'API Builder',
    'Problem Solver',
    'Open Source Curious',
  ];

  function typeRole(el, text, speed = 70) {
    return new Promise(resolve => {
      el.textContent = '';
      let i = 0;
      const tick = () => {
        if (i <= text.length) {
          el.textContent = text.slice(0, i);
          i++;
          setTimeout(tick, speed);
        } else resolve();
      };
      tick();
    });
  }
  function eraseRole(el, speed = 35) {
    return new Promise(resolve => {
      let i = el.textContent.length;
      const tick = () => {
        if (i >= 0) {
          el.textContent = el.textContent.slice(0, i);
          i--;
          setTimeout(tick, speed);
        } else resolve();
      };
      tick();
    });
  }
  async function rotateRoles() {
    const el = $('#roleTyped');
    if (!el) return;
    if (prefersReducedMotion) {
      el.textContent = ROLES[0];
      return;
    }
    let idx = 0;
    // initial pause before starting
    await new Promise(r => setTimeout(r, 800));
    while (true) {
      await typeRole(el, ROLES[idx]);
      await new Promise(r => setTimeout(r, 1800));
      await eraseRole(el);
      await new Promise(r => setTimeout(r, 250));
      idx = (idx + 1) % ROLES.length;
    }
  }

  // ── "Now" widget text rotation ───────────────────────────
  const NOW_LINES = [
    'Building EEU Infrastructure Protector v2 · Open to MERN opportunities',
    'Learning: Advanced React patterns & system design',
    'Available for freelance · 1 slot open this month',
  ];
  let nowIdx = 0;
  function rotateNowText() {
    const el = $('#nowText');
    if (!el) return;
    if (prefersReducedMotion) {
      el.textContent = NOW_LINES[0];
      return;
    }
    setInterval(() => {
      nowIdx = (nowIdx + 1) % NOW_LINES.length;
      el.style.opacity = '0';
      el.style.transform = 'translateY(-4px)';
      setTimeout(() => {
        el.textContent = NOW_LINES[nowIdx];
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }, 280);
    }, 5000);
  }

  // ── counter animation ───────────────────────────────────
  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    if (Number.isNaN(target)) return;
    const duration = 1500;
    const start = performance.now();
    const ease = t => 1 - Math.pow(1 - t, 3);
    const step = now => {
      const t = Math.min(1, (now - start) / duration);
      el.textContent = Math.round(target * ease(t));
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  // ── fade-in observer ────────────────────────────────────
  const fadeEls = $$('.stat-card, .skill-card, .project-card, .contact-card, .timeline-item, .service-card, .testimonial-card');
  fadeEls.forEach(el => el.classList.add('fade-in'));

  const counterObserver = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        counterObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });

  fadeEls.forEach(el => counterObserver.observe(el));

  // counter observer (separate so we don't re-trigger fade)
  const counterEls = $$('.counter');
  const counterObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        animateCounter(e.target);
        counterObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.4 });
  counterEls.forEach(el => counterObs.observe(el));

  // ── testimonials ────────────────────────────────────────
  const DEFAULT_TESTIMONIALS = [
    {
      text: 'Cherinet delivered our land records system ahead of schedule. The team adapted it for our staff with minimal training.',
      name: 'Mattu City Admin',
      role: 'Government Client',
      initials: 'MC',
    },
    {
      text: 'Strong fundamentals, ships clean code, and asks the right questions. Would happily work with him again.',
      name: 'EEU Project Lead',
      role: 'Engineering Manager',
      initials: 'EL',
    },
    {
      text: 'Reliable, fast learner, and a great communicator. Exactly the kind of dev you want on a small team.',
      name: 'Classmate & Collaborator',
      role: 'Mattu University',
      initials: 'CU',
    },
  ];

  function renderTestimonials() {
    const grid = $('#testimonialsGrid');
    if (!grid) return;
    const stored = JSON.parse(localStorage.getItem('ca_testimonials') || 'null');
    const list = Array.isArray(stored) && stored.length ? stored : DEFAULT_TESTIMONIALS;

    if (!list.length) {
      grid.innerHTML = '<div class="testimonial-empty">No testimonials yet. Add some via the admin panel.</div>';
      return;
    }
    grid.innerHTML = list.map(t => `
      <div class="testimonial-card fade-in">
        <p class="testimonial-text">${escapeHtml(t.text)}</p>
        <div class="testimonial-author">
          <div class="testimonial-avatar">${escapeHtml((t.initials || initialsFromName(t.name) || '—').slice(0, 2))}</div>
          <div class="testimonial-info">
            <span class="testimonial-name">${escapeHtml(t.name || 'Anonymous')}</span>
            <span class="testimonial-role">${escapeHtml(t.role || '')}</span>
          </div>
        </div>
      </div>
    `).join('');

    // re-observe new cards
    $$('.testimonial-card', grid).forEach(el => {
      el.classList.add('fade-in');
      counterObserver.observe(el);
    });
  }

  function initialsFromName(name) {
    if (!name) return '';
    return name.split(/\s+/).map(w => w[0]).join('').toUpperCase();
  }
  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, c => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    })[c]);
  }

  // ── contact form (mailto fallback) ──────────────────────
  window.submitContactForm = function (e) {
    e.preventDefault();
    const name    = $('#cf-name')?.value.trim()    || '';
    const email   = $('#cf-email')?.value.trim()   || '';
    const subject = $('#cf-subject')?.value.trim() || '';
    const message = $('#cf-message')?.value.trim() || '';
    if (!name || !email || !subject || !message) return false;

    const body = `Hi Cherinet,\n\n${message}\n\n--\n${name}\n${email}`;
    const mailto = `mailto:cheruuasrat30@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
    return false;
  };

  // ── dynamic content (admin panel compatibility) ────────
  function loadDynamicProjects() {
    const projects = JSON.parse(localStorage.getItem('ca_projects') || '[]');
    const container = $('#projects-container');
    if (!container) return;

    const counter = $('#dynamic-project-count');
    if (counter && projects.length > 0) {
      counter.textContent = (1 + projects.length) + '+';
    }

    projects.forEach((proj, index) => {
      const num = (index + 2).toString().padStart(2, '0');
      const tagsHtml = (proj.techStack || []).map(t => `<span class="tag">${escapeHtml(t)}</span>`).join('');
      const html = `
        <div class="project-card fade-in">
          <div class="project-header">
            <div class="project-number">${num}</div>
            <div class="project-links">
              ${proj.link ? `<a href="${escapeHtml(proj.link)}" target="_blank" rel="noopener" class="project-link">Source</a>` : ''}
            </div>
          </div>
          <div class="project-body">
            <span class="project-type">Recent Project</span>
            <h3>${escapeHtml(proj.title || 'Untitled')}</h3>
            <p>${escapeHtml(proj.description || '')}</p>
          </div>
          <div class="project-tags">${tagsHtml}</div>
        </div>
      `;
      container.insertAdjacentHTML('beforeend', html);
      const card = container.lastElementChild;
      counterObserver.observe(card);
    });
  }

  function loadDynamicEducation() {
    const education = JSON.parse(localStorage.getItem('ca_education') || '[]');
    const certs     = JSON.parse(localStorage.getItem('ca_certs')     || '[]');
    const timeline  = $('#experience-timeline');
    if (!timeline) return;

    const certCountEl = $('#dynamic-cert-count');
    if (certCountEl && certs.length > 0) certCountEl.textContent = String(certs.length);

    education.forEach(edu => {
      const html = `
        <div class="timeline-item fade-in">
          <div class="timeline-dot"></div>
          <div class="timeline-content">
            <div class="timeline-meta">
              <span class="timeline-date">${escapeHtml(edu.years || '')}</span>
            </div>
            <h3>${escapeHtml(edu.title || '')}</h3>
            <p class="timeline-school">${escapeHtml(edu.institution || '')}</p>
          </div>
        </div>
      `;
      timeline.insertAdjacentHTML('beforeend', html);
      counterObserver.observe(timeline.lastElementChild);
    });

    certs.forEach(cert => {
      const html = `
        <div class="timeline-item fade-in">
          <div class="timeline-dot"></div>
          <div class="timeline-content">
            <div class="timeline-meta">
              <span class="timeline-badge" style="background: rgba(212,168,83,0.1); border-color: var(--accent-warm); color: var(--accent-warm);">Certification</span>
            </div>
            <h3>${escapeHtml(cert.name || '')}</h3>
            <p class="timeline-school">${escapeHtml(cert.issuer || '')}</p>
          </div>
        </div>
      `;
      timeline.insertAdjacentHTML('beforeend', html);
      counterObserver.observe(timeline.lastElementChild);
    });
  }

  // ── now-widget transition style hookup ──────────────────
  const nowText = $('#nowText');
  if (nowText) {
    nowText.style.transition = 'opacity 0.28s ease, transform 0.28s ease';
  }

  // ── boot ────────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', () => {
    updateProgress();
    updateNavbar();
    updateActiveLink();
    rotateRoles();
    rotateNowText();
    renderTestimonials();
    loadDynamicProjects();
    loadDynamicEducation();
  });
})();
