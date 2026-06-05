// Back to top
const btt = document.createElement('button');
btt.className = 'back-to-top';
btt.setAttribute('aria-label', 'Back to top');
btt.innerHTML = '<i class="fa-solid fa-angles-up"></i>';
document.body.appendChild(btt);
window.addEventListener('scroll', () => {
  btt.classList.toggle('visible', window.scrollY > 400);
}, { passive: true });
btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// Burger nav accordion
document.querySelectorAll('.nav-modal-accordion-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const expanded = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', !expanded);
    btn.nextElementSibling.classList.toggle('open', !expanded);
  });
});

const modal = document.getElementById('nav-modal');
const openBtn = document.getElementById('nav-open');
const closeBtn = document.getElementById('nav-close');

let trapHandler = null;

function getModalFocusable() {
  return Array.from(modal.querySelectorAll(
    'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
  ));
}

function openNav() {
  modal.classList.add('open');
  openBtn.setAttribute('aria-expanded', 'true');

  const focusable = getModalFocusable();
  if (focusable.length) focusable[0].focus();

  trapHandler = function (e) {
    if (e.key !== 'Tab') return;
    const focusable = getModalFocusable();
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey) {
      if (document.activeElement === first) { e.preventDefault(); last.focus(); }
    } else {
      if (document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  };
  modal.addEventListener('keydown', trapHandler);
}

function closeNav() {
  modal.classList.remove('open');
  openBtn.setAttribute('aria-expanded', 'false');
  if (trapHandler) {
    modal.removeEventListener('keydown', trapHandler);
    trapHandler = null;
  }
  openBtn.focus();
}

openBtn.addEventListener('click', openNav);
closeBtn.addEventListener('click', closeNav);
modal.addEventListener('click', e => { if (e.target === modal) closeNav(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeNav(); });

// Multi-step form navigation
(function () {
  const steps = document.querySelectorAll('.form-step');
  if (!steps.length) return;
  const dots = document.querySelectorAll('.step-dot');
  const lines = document.querySelectorAll('.step-line');
  const form = steps[0].closest('form');
  let current = 0;

  function showStep(n, scroll = false) {
    steps.forEach((s, i) => s.classList.toggle('active', i === n));
    dots.forEach((d, i) => {
      d.classList.toggle('active', i === n);
      d.classList.toggle('done', i < n);
    });
    lines.forEach((l, i) => l.classList.toggle('done', i < n));
    current = n;
    if (scroll && form) form.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  document.querySelectorAll('.btn-step-next').forEach(btn =>
    btn.addEventListener('click', () => { if (current < steps.length - 1) showStep(current + 1, true); })
  );
  document.querySelectorAll('.btn-step-prev').forEach(btn =>
    btn.addEventListener('click', () => { if (current > 0) showStep(current - 1, true); })
  );

  showStep(0);
}());
