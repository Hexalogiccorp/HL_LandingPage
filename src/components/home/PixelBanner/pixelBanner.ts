import { initPixelWave } from "../../shared/PixelGrid/pixelGrid";

const REVEAL_DURATION = 2500;

const initBanner = (banner: HTMLElement) => {
  const grid = banner.querySelector<HTMLElement>(".pixel-banner-grid");
  const canvas = banner.querySelector<HTMLCanvasElement>(".pixel-banner-canvas");
  if (!grid || !canvas) return;

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduced) banner.classList.add("pixel-banner--reveal");

  initPixelWave(grid, canvas, () => {
    banner.classList.add("pixel-banner--in-view");
    setTimeout(() => banner.classList.remove("pixel-banner--reveal"), REVEAL_DURATION);
  });
};

export function initPixelBanner() {
  document.querySelectorAll<HTMLElement>(".pixel-banner").forEach(initBanner);
}
