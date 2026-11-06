import { alreadySeen } from "../revealMemory/revealMemory";

const initLineReveal = (footer: HTMLElement) => {
  if (alreadySeen(footer.querySelector(".footer-bottom") ?? footer)) return;

  footer.classList.add("footer--reveal");

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (!entry.isIntersecting) return;
      requestAnimationFrame(() => footer.classList.add("footer--in-view"));
      observer.disconnect();
    },
    { threshold: 0.5 },
  );
  observer.observe(footer.querySelector(".footer-bottom") ?? footer);
};

export function initFooter() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  document.querySelectorAll<HTMLElement>(".footer").forEach(initLineReveal);
}
