export function initMedServices() {
  const section = document.querySelector<HTMLElement>(".med-services");
  if (!section) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const targets = section.querySelectorAll<HTMLElement>(
    ".med-services-label, .med-services-title, .med-services-text, .med-services-explore, .med-services-feature, .med-services-item"
  );
  section.classList.add("med-services--reveal");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("med-services-visible");
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -5% 0px" }
  );
  targets.forEach((el) => observer.observe(el));
}
