const initLineReveal = (footer: HTMLElement) => {
  footer.classList.add("footer--reveal");

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (!entry.isIntersecting) return;
      requestAnimationFrame(() => footer.classList.add("footer--in-view"));
      observer.disconnect();
    },
    { rootMargin: "0px 0px -10% 0px" },
  );
  observer.observe(footer.querySelector(".footer-bottom") ?? footer);
};

export function initFooter() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  document.querySelectorAll<HTMLElement>(".footer").forEach(initLineReveal);
}
