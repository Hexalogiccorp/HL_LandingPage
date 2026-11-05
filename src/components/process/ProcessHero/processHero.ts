export function initProcessHero() {
  const hero = document.querySelector<HTMLElement>(".proc-hero");
  if (!hero) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const targets = hero.querySelectorAll<HTMLElement>(
    ".proc-hero-image, .proc-hero-title, .proc-hero-text"
  );
  hero.classList.add("proc-hero--reveal");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("proc-hero-visible");
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -5% 0px" }
  );
  targets.forEach((el) => observer.observe(el));
}
