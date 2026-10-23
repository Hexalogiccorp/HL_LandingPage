export function initAboutValues() {
  const section = document.querySelector<HTMLElement>(".about-values");
  if (!section) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const targets = section.querySelectorAll<HTMLElement>(
    ".about-values-title, .about-values-subtitle, .about-values-statement, .about-values-list-label, .about-values-item"
  );
  section.classList.add("about-values--reveal");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("about-values-visible");
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -5% 0px" }
  );
  targets.forEach((el) => observer.observe(el));
}
