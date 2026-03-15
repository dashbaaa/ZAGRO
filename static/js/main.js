// ZAGRO — Landing page · Under Armour / Brutal Edition

// ── Hero title — word-by-word slide from left ─────────────────
function initWordReveal() {
  const title = document.querySelector('.hero__title');
  if (!title) return;

  function processNode(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent;
      if (!text.trim()) return;
      const parts = text.split(/(\s+)/);
      const frag = document.createDocumentFragment();
      parts.forEach(p => {
        if (/^\s+$/.test(p)) {
          frag.appendChild(document.createTextNode(p));
        } else if (p) {
          const span = document.createElement('span');
          span.className = 'wr';
          span.textContent = p;
          frag.appendChild(span);
        }
      });
      node.parentNode.replaceChild(frag, node);
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      Array.from(node.childNodes).forEach(processNode);
    }
  }

  processNode(title);

  title.querySelectorAll('.wr').forEach((el, i) => {
    el.style.cssText = `
      display:inline-block;
      opacity:0;
      transform:translateX(-28px);
      transition:opacity 0.35s ease ${i * 0.055}s, transform 0.35s ease ${i * 0.055}s;
    `;
    setTimeout(() => {
      el.style.opacity = '1';
      el.style.transform = 'translateX(0)';
    }, 40 + i * 55);
  });
}

initWordReveal();

// ── Scroll reveal ─────────────────────────────────────────────
const revealObs = new IntersectionObserver(
  entries => entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObs.unobserve(e.target);
    }
  }),
  { threshold: 0.1 }
);

document.querySelectorAll('.feature-card, .step, .coach-card').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
  revealObs.observe(el);
});

// Section headers — triggers animated yellow underline on .section__title::after
document.querySelectorAll('.section__header').forEach(el => revealObs.observe(el));

// ── Count-up animation for stats ─────────────────────────────
function countUp(el, target, duration = 1000) {
  if (el.textContent.trim() === '∞') return;
  const startTime = performance.now();
  const isFloat = target % 1 !== 0;
  function tick(now) {
    const p = Math.min((now - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = isFloat
      ? (target * eased).toFixed(1)
      : Math.round(target * eased).toString();
    if (p < 1) requestAnimationFrame(tick);
    else el.textContent = isFloat ? target.toFixed(1) : target.toString();
  }
  requestAnimationFrame(tick);
}

const statsObs = new IntersectionObserver(
  entries => entries.forEach(e => {
    if (e.isIntersecting) {
      const raw = parseFloat(e.target.textContent);
      if (!isNaN(raw)) countUp(e.target, raw);
      statsObs.unobserve(e.target);
    }
  }),
  { threshold: 0.5 }
);

document.querySelectorAll('.stat__num, .auth-stat__num').forEach(el => {
  if (el.textContent.trim() !== '∞') statsObs.observe(el);
});

// ── Nav shrink on scroll ──────────────────────────────────────
const nav = document.querySelector('.nav');
if (nav) {
  window.addEventListener('scroll', () => {
    nav.style.padding = window.scrollY > 40 ? '8px 0' : '10px 0';
  }, { passive: true });
}

// ── Scroll reveal ─────────────────────────────────────────────
(function() {
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  items.forEach(el => io.observe(el));
})();
