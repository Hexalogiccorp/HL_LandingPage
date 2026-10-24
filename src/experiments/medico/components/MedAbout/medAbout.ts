export function initMedAbout() {
  const section = document.querySelector<HTMLElement>(".med-about");
  if (!section) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const targets = section.querySelectorAll<HTMLElement>(
    ".med-about-label, .med-about-title, .med-about-text, .med-about-cta, .med-about-card"
  );
  section.classList.add("med-about--reveal");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("med-about-visible");
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -5% 0px" }
  );
  targets.forEach((el) => observer.observe(el));
}
