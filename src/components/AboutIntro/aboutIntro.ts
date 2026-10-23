export function initAboutIntro() {
  const section = document.querySelector<HTMLElement>(".about-intro");
  if (!section) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const targets = section.querySelectorAll<HTMLElement>(
    ".about-intro-title, .about-intro-subtitle, .about-intro-heading, .about-intro-text, .about-intro-stats, .about-intro-block"
  );
  section.classList.add("about-intro--reveal");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("about-intro-visible");
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -5% 0px" }
  );
  targets.forEach((el) => observer.observe(el));
}
