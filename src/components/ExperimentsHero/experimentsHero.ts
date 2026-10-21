const REVEAL_TARGETS = ".exp-hero-image, .exp-hero-title, .exp-hero-text";

const initReveal = (hero: HTMLElement) => {
  const targets = [...hero.querySelectorAll<HTMLElement>(REVEAL_TARGETS)];
  if (!targets.length) return;

  hero.classList.add("exp-hero--reveal");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("exp-hero-visible");
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -5% 0px" },
  );
  targets.forEach((target) => observer.observe(target));
};

export function initExperimentsHero() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  document.querySelectorAll<HTMLElement>(".exp-hero").forEach(initReveal);
}
