const COUNTER_DURATION = 2800;

const countUp = (counter: HTMLElement) => {
  const target = Number(counter.dataset.count) || 0;
  const start = performance.now();

  const tick = (now: number) => {
    const progress = Math.min((now - start) / COUNTER_DURATION, 1);
    const eased = 1 - (1 - progress) ** 2;
    counter.textContent = String(Math.round(target * eased));
    if (progress < 1) requestAnimationFrame(tick);
  };

  counter.textContent = "0";
  requestAnimationFrame(tick);
};

const initCounters = (section: HTMLElement) => {
  const stats = section.querySelector<HTMLElement>(".about-intro-stats");
  if (!stats) return;

  const counters = stats.querySelectorAll<HTMLElement>(".about-intro-counter");
  counters.forEach((counter) => (counter.textContent = "0"));

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (!entry.isIntersecting) return;
      counters.forEach(countUp);
      observer.disconnect();
    },
    { rootMargin: "0px 0px -10% 0px" }
  );
  observer.observe(stats);
};

const reveal = (elements: NodeListOf<HTMLElement>, options: IntersectionObserverInit) => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("about-intro-visible");
      observer.unobserve(entry.target);
    });
  }, options);
  elements.forEach((el) => observer.observe(el));
};

export function initAboutIntro() {
  const section = document.querySelector<HTMLElement>(".about-intro");
  if (!section) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  section.classList.add("about-intro--reveal");
  initCounters(section);

  reveal(
    section.querySelectorAll<HTMLElement>(
      ".about-intro-title, .about-intro-subtitle, .about-intro-text, .about-intro-stats, .about-intro-statement"
    ),
    { rootMargin: "0px 0px -5% 0px" }
  );

  reveal(section.querySelectorAll<HTMLElement>(".about-intro-decoration"), { threshold: 0.3 });
}
