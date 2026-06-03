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
