const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)');

const setReady = () => {
  document.body.classList.add('page-ready');
  setActiveNav();
  setupPressStates();
  ensureLoader();
};

const ensureLoader = () => {
  if (document.querySelector('.page-loader')) return;
  const loader = document.createElement('div');
  loader.className = 'page-loader';
  loader.innerHTML = '<span></span>';
  document.body.appendChild(loader);
};

const setActiveNav = () => {
  const currentPath = (window.location.pathname.split('/').pop() || 'shop.html').toLowerCase();
  document.querySelectorAll('.pill-row a').forEach((link) => {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('http')) return;
    const path = new URL(href, window.location.href).pathname.split('/').pop().toLowerCase();
    if (path === currentPath) {
      link.classList.add('is-active');
      link.setAttribute('aria-current', 'page');
    }
  });
};

const setupPressStates = () => {
  const pressables = document.querySelectorAll(
    '.pill-row a, .menu-card, .juice-item, .ice-card, .shake-card, .tea-card, .eats-item, .thumb-grid figure'
  );
  pressables.forEach((el) => {
    const clear = () => el.classList.remove('is-pressed');
    el.addEventListener('pointerdown', () => el.classList.add('is-pressed'));
    el.addEventListener('pointerup', clear);
    el.addEventListener('pointerleave', clear);
    el.addEventListener('pointercancel', clear);
  });
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setReady, { once: true });
} else {
  setReady();
}

document.addEventListener('click', (event) => {
  const link = event.target.closest('a');
  if (!link) return;

  const href = link.getAttribute('href');
  if (!href) return;

  if (href.startsWith('#')) {
    const target = document.querySelector(href);
    if (target) {
      event.preventDefault();
      target.scrollIntoView({ behavior: prefersReduced.matches ? 'auto' : 'smooth', block: 'start' });
      history.pushState(null, '', href);
    }
    return;
  }

  if (href.startsWith('mailto:') || href.startsWith('tel:')) {
    return;
  }

  if (link.target && link.target !== '_self') {
    return;
  }

  const url = new URL(href, window.location.href);
  if (url.origin !== window.location.origin) {
    return;
  }

  if (prefersReduced.matches) {
    return;
  }

  event.preventDefault();
  document.body.classList.add('page-exit');
  const loader = document.querySelector('.page-loader');
  if (loader) {
    loader.classList.add('is-active');
  }

  window.setTimeout(() => {
    window.location.href = href;
  }, 260);
});
