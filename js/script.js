document.getElementById('year').textContent = new Date().getFullYear();

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const mainNav = document.getElementById('mainNav');

navToggle.addEventListener('click', () => {
  const isOpen = mainNav.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
  const icon = navToggle.querySelector('i');
  icon.classList.toggle('fa-bars');
  icon.classList.toggle('fa-xmark');
});

const navLinks = Array.from(mainNav.querySelectorAll('a'));

navLinks.forEach(link => {
  link.addEventListener('click', () => {
    mainNav.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.querySelector('i').classList.add('fa-bars');
    navToggle.querySelector('i').classList.remove('fa-xmark');
  });
});

// Hero background: animated agentic-AI style node network
function initHeroNetwork() {
  const canvas = document.getElementById('heroNetwork');
  if (!canvas || prefersReducedMotion) return;

  const ctx = canvas.getContext('2d');
  const hero = canvas.parentElement;
  const NODE_RGB = '223, 232, 255';
  const LINE_RGB = '79, 140, 255';
  const LINK_DIST = 150;
  const MOUSE_RADIUS = 170;

  let width, height, dpr, nodes, rafId;
  const mouse = { x: 0, y: 0, active: false };

  hero.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
    mouse.active = true;
  });

  hero.addEventListener('mouseleave', () => {
    mouse.active = false;
  });

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = hero.offsetWidth;
    height = hero.offsetHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const count = Math.min(85, Math.max(32, Math.floor((width * height) / 17000)));
    nodes = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      r: Math.random() * 1.6 + 1.2
    }));
  }

  function step() {
    ctx.clearRect(0, 0, width, height);

    nodes.forEach(n => {
      n.x += n.vx;
      n.y += n.vy;
      if (n.x < 0 || n.x > width) n.vx *= -1;
      if (n.y < 0 || n.y > height) n.vy *= -1;

      if (mouse.active) {
        const dx = n.x - mouse.x;
        const dy = n.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MOUSE_RADIUS && dist > 0.01) {
          const push = (1 - dist / MOUSE_RADIUS) * 0.6;
          n.x += (dx / dist) * push;
          n.y += (dy / dist) * push;
        }
      }
    });

    if (mouse.active) {
      nodes.forEach(n => {
        const dx = n.x - mouse.x;
        const dy = n.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MOUSE_RADIUS) {
          const alpha = (1 - dist / MOUSE_RADIUS) * 0.6;
          ctx.strokeStyle = `rgba(${LINE_RGB}, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(n.x, n.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
      });
    }

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i], b = nodes[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < LINK_DIST) {
          const alpha = (1 - dist / LINK_DIST) * 0.5;
          ctx.strokeStyle = `rgba(${LINE_RGB}, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    nodes.forEach(n => {
      ctx.beginPath();
      ctx.fillStyle = `rgba(${NODE_RGB}, 0.9)`;
      ctx.shadowColor = `rgba(${LINE_RGB}, 0.9)`;
      ctx.shadowBlur = 8;
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    });

    rafId = requestAnimationFrame(step);
  }

  resize();
  step();

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, 200);
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(rafId);
    } else {
      step();
    }
  });
}

initHeroNetwork();

// Hero mouse parallax: the small floating cards drift toward the cursor
function initHeroParallax() {
  const heroSection = document.getElementById('home');
  const cardWraps = document.querySelectorAll('.floating-card-wrap');
  if (!heroSection || !cardWraps.length || prefersReducedMotion) return;

  const layers = Array.from(cardWraps).map(el => ({
    el,
    strength: parseFloat(el.dataset.parallax) || 20
  }));

  let targetX = 0, targetY = 0, currentX = 0, currentY = 0, raf = null;

  function tick() {
    currentX += (targetX - currentX) * 0.08;
    currentY += (targetY - currentY) * 0.08;

    layers.forEach(layer => {
      const x = (currentX * layer.strength).toFixed(2);
      const y = (currentY * layer.strength).toFixed(2);
      layer.el.style.transform = `translate(${x}px, ${y}px)`;
    });

    if (Math.abs(targetX - currentX) > 0.001 || Math.abs(targetY - currentY) > 0.001) {
      raf = requestAnimationFrame(tick);
    } else {
      raf = null;
    }
  }

  function requestTick() {
    if (!raf) raf = requestAnimationFrame(tick);
  }

  heroSection.addEventListener('mousemove', (e) => {
    const rect = heroSection.getBoundingClientRect();
    targetX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    targetY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    requestTick();
  });

  heroSection.addEventListener('mouseleave', () => {
    targetX = 0;
    targetY = 0;
    requestTick();
  });
}

initHeroParallax();

// Header scrolled state
const header = document.getElementById('header');

const updateHeader = () => {
  header.classList.toggle('scrolled', window.scrollY > 10);
};
window.addEventListener('scroll', updateHeader, { passive: true });
updateHeader();

// Scrollspy: highlight nav link for the section in view
const sections = navLinks
  .map(link => document.getElementById(link.dataset.nav))
  .filter(Boolean);

if ('IntersectionObserver' in window && sections.length) {
  const spy = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const id = entry.target.id;
      navLinks.forEach(link => {
        link.classList.toggle('active-link', link.dataset.nav === id);
        if (link.dataset.nav === id) {
          link.setAttribute('aria-current', 'true');
        } else {
          link.removeAttribute('aria-current');
        }
      });
    });
  }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

  sections.forEach(section => spy.observe(section));
}

// Scroll reveal animations
const revealEls = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window && !prefersReducedMotion) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealEls.forEach(el => revealObserver.observe(el));
} else {
  revealEls.forEach(el => el.classList.add('in-view'));
}

// Scroll-to-top button
const scrollTopBtn = document.getElementById('scrollTop');

window.addEventListener('scroll', () => {
  scrollTopBtn.classList.toggle('visible', window.scrollY > 500);
}, { passive: true });

scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
});

// Service card CTA -> pre-select matching service in the contact form
const serviceSelect = document.getElementById('service');

document.querySelectorAll('.service-link[data-service]').forEach(link => {
  link.addEventListener('click', () => {
    serviceSelect.value = link.dataset.service;
  });
});

// Contact form validation (demo only — no backend yet)
const contactForm = document.getElementById('contactForm');
const formNote = document.getElementById('formNote');
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const fields = [
  {
    input: document.getElementById('name'),
    group: document.getElementById('name').closest('.form-group'),
    validate: (value) => value.trim().length > 1
  },
  {
    input: document.getElementById('email'),
    group: document.getElementById('email').closest('.form-group'),
    validate: (value) => emailPattern.test(value.trim())
  },
  {
    input: document.getElementById('message'),
    group: document.getElementById('message').closest('.form-group'),
    validate: (value) => value.trim().length > 9
  }
];

fields.forEach(field => {
  field.input.addEventListener('input', () => {
    if (field.group.classList.contains('invalid') && field.validate(field.input.value)) {
      field.group.classList.remove('invalid');
    }
  });
});

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();

  let firstInvalid = null;

  fields.forEach(field => {
    const isValid = field.validate(field.input.value);
    field.group.classList.toggle('invalid', !isValid);
    if (!isValid && !firstInvalid) firstInvalid = field.input;
  });

  if (firstInvalid) {
    firstInvalid.focus();
    formNote.textContent = 'Revisa los campos marcados en rojo.';
    formNote.style.color = 'var(--danger)';
    return;
  }

  formNote.style.color = 'var(--blue-light)';
  formNote.textContent = '¡Gracias! Tu mensaje fue registrado (demo local, aún sin envío real).';
  contactForm.reset();
});
