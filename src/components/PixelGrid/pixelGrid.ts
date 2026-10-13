const initWave = (grid: HTMLElement) => {
  // Se oculta solo con JS, así sin él nunca queda invisible
  grid.classList.add("pixel-grid--reveal");

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (!entry.isIntersecting) return;
      grid.classList.add("pixel-grid--in-view");
      observer.disconnect();
    },
    { rootMargin: "0px 0px -15% 0px" },
  );
  observer.observe(grid);
};

export function initPixelGrids() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  document.querySelectorAll<HTMLElement>(".pixel-grid").forEach(initWave);
}
