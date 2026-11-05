export function initAboutHero() {
  const hero = document.querySelector<HTMLElement>(".about-hero");
  if (!hero) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const targets = hero.querySelectorAll<HTMLElement>(
    ".about-hero-image, .about-hero-title, .about-hero-text"
  );
  hero.classList.add("about-hero--reveal");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("about-hero-visible");
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -5% 0px" }
  );
  targets.forEach((el) => observer.observe(el));
}
