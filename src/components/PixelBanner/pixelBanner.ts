const REVEAL_DURATION = 2500;

const initWave = (banner: HTMLElement) => {
  // Se oculta solo con JS, así sin él nunca queda invisible
  banner.classList.add("pixel-banner--reveal");

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (!entry.isIntersecting) return;
      banner.classList.add("pixel-banner--in-view");
      // Quita las transiciones de entrada para que no frenen el hover
      setTimeout(() => banner.classList.remove("pixel-banner--reveal"), REVEAL_DURATION);
      observer.disconnect();
    },
    { rootMargin: "0px 0px -15% 0px" },
  );
  observer.observe(banner);
};

export function initPixelBanner() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  document.querySelectorAll<HTMLElement>(".pixel-banner").forEach(initWave);
}
