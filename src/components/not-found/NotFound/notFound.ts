const REVEAL_TARGETS = ".nf-code, .nf-title, .nf-text, .nf-actions";

export function initNotFound() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const section = document.querySelector<HTMLElement>(".nf");
  if (!section) return;

  section.classList.add("nf--reveal");

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("nf-visible");
      observer.unobserve(entry.target);
    });
  });
  section.querySelectorAll<HTMLElement>(REVEAL_TARGETS).forEach((target) => observer.observe(target));
}
