/**
 * What We Do carousel
 * Tabs, arrows, keyboard arrows, swipe, and autoplay that stops once the
 * visitor takes control. No other carousel scripts are needed on this page.
 */
(function () {
  const root = document.querySelector('[data-wwd]');
  if (!root) return;

  const slides = Array.from(root.querySelectorAll('.wwd-slide'));
  const tabs = Array.from(root.querySelectorAll('[role="tab"]'));
  const stage = root.querySelector('.wwd-stage');
  const DELAY = 7000;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let current = 0;
  let timer = null;
  let userTookControl = reduceMotion;

  function show(index, { focusTab = false } = {}) {
    const next = (index + slides.length) % slides.length;
    if (next === current && slides[next].classList.contains('is-active')) return;

    slides.forEach((slide, i) => {
      const active = i === next;
      slide.classList.toggle('is-active', active);
      slide.hidden = !active;
    });

    tabs.forEach((tab, i) => {
      const active = i === next;
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
      tab.classList.remove('is-timing');
    });

    current = next;
    if (focusTab) tabs[next].focus();
    if (userTookControl) history.replaceState(null, '', '#' + slides[next].dataset.slug);
    restartTimer();
  }

  function restartTimer() {
    clearTimeout(timer);
    if (userTookControl) return;
    const tab = tabs[current];
    // restart the progress-bar animation
    void tab.offsetWidth;
    tab.classList.add('is-timing');
    timer = setTimeout(() => show(current + 1), DELAY);
  }

  function takeControl() {
    userTookControl = true;
    clearTimeout(timer);
    root.classList.add('is-manual');
    tabs.forEach((t) => t.classList.remove('is-timing'));
  }

  // Tabs
  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => {
      takeControl();
      show(i);
    });
  });

  // Arrow keys inside the tab list (standard tabs pattern)
  root.querySelector('[role="tablist"]').addEventListener('keydown', (e) => {
    const map = { ArrowRight: 1, ArrowLeft: -1 };
    if (e.key in map) {
      e.preventDefault();
      takeControl();
      show(current + map[e.key], { focusTab: true });
    } else if (e.key === 'Home' || e.key === 'End') {
      e.preventDefault();
      takeControl();
      show(e.key === 'Home' ? 0 : slides.length - 1, { focusTab: true });
    }
  });

  // Arrow keys anywhere on the page (unless typing in a field)
  document.addEventListener('keydown', (e) => {
    if (e.target.closest('input, textarea, select, [role="tablist"]')) return;
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      takeControl();
      show(current + (e.key === 'ArrowRight' ? 1 : -1));
    }
  });

  // Prev / next buttons
  root.querySelector('[data-wwd-prev]').addEventListener('click', () => {
    takeControl();
    show(current - 1);
  });
  root.querySelector('[data-wwd-next]').addEventListener('click', () => {
    takeControl();
    show(current + 1);
  });

  // Swipe
  let startX = null;
  let startY = null;
  stage.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
  }, { passive: true });
  stage.addEventListener('touchend', (e) => {
    if (startX === null) return;
    const dx = e.changedTouches[0].clientX - startX;
    const dy = e.changedTouches[0].clientY - startY;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
      takeControl();
      show(current + (dx < 0 ? 1 : -1));
    }
    startX = null;
  });

  // Pause autoplay while the visitor is reading or focused inside
  root.addEventListener('mouseenter', () => {
    if (!userTookControl) {
      clearTimeout(timer);
      root.classList.add('is-paused');
    }
  });
  root.addEventListener('mouseleave', () => {
    root.classList.remove('is-paused');
    restartTimer();
  });
  root.addEventListener('focusin', (e) => {
    if (e.target.closest('.wwd-cta, [role="tab"], .wwd-arrow')) takeControl();
  });

  // Deep links: /services#ai opens the AI slide
  const slugs = ['consulting', 'development', 'health', 'ai'];
  slides.forEach((s, i) => { s.dataset.slug = slugs[i]; });
  const start = slugs.indexOf(location.hash.replace('#', ''));
  if (start > 0) {
    takeControl();
    current = -1;
    show(start);
  } else {
    restartTimer();
  }
})();
