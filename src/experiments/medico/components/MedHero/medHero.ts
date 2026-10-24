const AUTOPLAY_DELAY = 9000;
const SWIPE_THRESHOLD = 50;

export function initMedHero() {
  const hero = document.querySelector<HTMLElement>(".med-hero");
  if (!hero) return;

  const slides = [...hero.querySelectorAll<HTMLElement>(".med-hero-slide")];
  const dots = [...hero.querySelectorAll<HTMLButtonElement>(".med-hero-dot")];
  if (!slides.length) return;

  let current = 0;
  let timer: number | undefined;

  const render = (index: number) => {
    slides.forEach((slide, i) => {
      const active = i === index;
      slide.classList.toggle("med-hero-slide--active", active);
      slide.inert = !active;
    });
    dots.forEach((dot, i) => {
      const active = i === index;
      dot.classList.toggle("med-hero-dot--active", active);
      dot.setAttribute("aria-selected", String(active));
    });
    current = index;
  };

  const goTo = (index: number) => {
    const next = (index + slides.length) % slides.length;
    if (next !== current) render(next);
  };

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let userTookControl = false;

  const stop = () => window.clearInterval(timer);
  const start = () => {
    stop();
    if (!reducedMotion && !userTookControl) {
      timer = window.setInterval(() => goTo(current + 1), AUTOPLAY_DELAY);
    }
  };
  const goToByUser = (index: number) => {
    userTookControl = true;
    stop();
    goTo(index);
  };

  hero.classList.add("med-hero--js", "med-hero--instant");
  slides[0].classList.remove("med-hero-slide--active");
  void hero.offsetHeight;
  hero.classList.remove("med-hero--instant");
  requestAnimationFrame(() => requestAnimationFrame(() => render(0)));

  dots.forEach((dot, i) => dot.addEventListener("click", () => goToByUser(i)));

  let touchStart: { x: number; y: number } | null = null;
  hero.addEventListener(
    "touchstart",
    (event) => {
      const touch = event.touches[0];
      touchStart = { x: touch.clientX, y: touch.clientY };
    },
    { passive: true }
  );
  hero.addEventListener(
    "touchend",
    (event) => {
      if (!touchStart) return;
      const touch = event.changedTouches[0];
      const dx = touch.clientX - touchStart.x;
      const dy = touch.clientY - touchStart.y;
      touchStart = null;
      if (Math.abs(dx) < SWIPE_THRESHOLD || Math.abs(dx) < Math.abs(dy)) return;
      goToByUser(current + (dx < 0 ? 1 : -1));
    },
    { passive: true }
  );

  document.addEventListener("visibilitychange", () => (document.hidden ? stop() : start()));
  start();
}
