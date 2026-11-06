const DEPTH_KEY = "home-reveal-depth";
const SCROLL_KEY = "home-reveal-scroll";
const VISIBLE_MARGIN = 0.15;

let seenDepth: number | null = null;

const read = (key: string) => {
  try {
    return Number(sessionStorage.getItem(key)) || 0;
  } catch {
    return 0;
  }
};

const write = (key: string, value: number) => {
  try {
    sessionStorage.setItem(key, String(value));
  } catch {}
};

const isReloadAtTop = () => {
  const [navigation] = performance.getEntriesByType("navigation") as PerformanceNavigationTiming[];
  return navigation?.type === "reload" && read(SCROLL_KEY) === 0;
};

const startTracking = () => {
  const initialDepth = isReloadAtTop() ? 0 : read(DEPTH_KEY);
  let reachedDepth = initialDepth;

  const update = () => {
    reachedDepth = Math.max(reachedDepth, window.scrollY + window.innerHeight);
  };

  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("pagehide", () => {
    update();
    write(DEPTH_KEY, reachedDepth);
    write(SCROLL_KEY, window.scrollY);
  });

  return initialDepth;
};

export const alreadySeen = (element: Element) => {
  if (window.location.pathname !== "/") return false;
  if (seenDepth === null) seenDepth = startTracking();

  const top = element.getBoundingClientRect().top + window.scrollY;
  return top < seenDepth - window.innerHeight * VISIBLE_MARGIN;
};
