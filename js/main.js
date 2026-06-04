// Page fade transitions
document.addEventListener('click', e => {
  const link = e.target.closest('a[href]');
  if (!link) return;
  const href = link.getAttribute('href');
  if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')) return;
  e.preventDefault();
  document.body.classList.add('page-fade-out');
  setTimeout(() => { window.location.href = href; }, 200);
});

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

function openNav() {
  modal.classList.add('open');
  openBtn.setAttribute('aria-expanded', 'true');
}

function closeNav() {
  modal.classList.remove('open');
  openBtn.setAttribute('aria-expanded', 'false');
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

  function showStep(n) {
    steps.forEach((s, i) => s.classList.toggle('active', i === n));
    dots.forEach((d, i) => {
      d.classList.toggle('active', i === n);
      d.classList.toggle('done', i < n);
    });
    lines.forEach((l, i) => l.classList.toggle('done', i < n));
    current = n;
    if (form) form.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  document.querySelectorAll('.btn-step-next').forEach(btn =>
    btn.addEventListener('click', () => { if (current < steps.length - 1) showStep(current + 1); })
  );
  document.querySelectorAll('.btn-step-prev').forEach(btn =>
    btn.addEventListener('click', () => { if (current > 0) showStep(current - 1); })
  );

  showStep(0);
}());
