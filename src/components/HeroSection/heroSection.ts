const START_DELAY = 1200;
const MIN_DURATION = 6000;
const MAX_DURATION = 10000;
const MAX_RISE = 0.75;
const PAIR_GAP_FACTOR = 0.3;

const random = (min: number, max: number) => min + Math.random() * (max - min);

const startGlowDrift = (background: HTMLElement) => {
  const mainGlow = background.querySelector<HTMLElement>(".hero-glow--main");
  const rightGlow = background.querySelector<HTMLElement>(".hero-glow--right");
  if (!mainGlow) return;

  const moveToRandomPoint = () => {
    const width = background.clientWidth;
    const height = background.clientHeight;
    const mainX = mainGlow.offsetLeft;
    const pairGap = (mainGlow.offsetWidth + (rightGlow?.offsetWidth ?? 0)) * PAIR_GAP_FACTOR;

    const x = random(-mainX, width - mainX - pairGap);
    const y = random(-height * MAX_RISE, 0);
    const duration = random(MIN_DURATION, MAX_DURATION);

    background.style.transitionDuration = `${duration}ms`;
    background.style.setProperty("--hero-drift-bottom-x", `${x}px`);
    background.style.setProperty("--hero-drift-bottom-y", `${y}px`);

    setTimeout(moveToRandomPoint, duration * 0.85);
  };

  setTimeout(moveToRandomPoint, START_DELAY);
};

export function initHeroSection() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  document.querySelectorAll<HTMLElement>(".hero-bg").forEach(startGlowDrift);
}
