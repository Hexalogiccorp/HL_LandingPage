type RGB = [number, number, number];
type WavePixel = [number, number, number, number];

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const easeOut = (t: number) => 1 - (1 - t) ** 4;
const rgb = ([r, g, b]: RGB, k = 1) =>
  `rgb(${Math.min(255, r * k)} ${Math.min(255, g * k)} ${Math.min(255, b * k)})`;

export const createPixelWave = (canvas: HTMLCanvasElement, cols: number, rows: number, pixels: WavePixel[]) => {
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  const lite = window.matchMedia("(hover: none), (max-width: 768px)").matches;
  const duration = lite ? 600 : 900;
  const colors = pixels.map(([r, g, b]) => rgb([r, g, b]));
  const end = Math.max(...pixels.map((pixel) => pixel[3])) + duration;

  let width = 0;
  let height = 0;
  let start = -1;
  let done = false;

  const frameAt = (t: number): [number, number, number] => {
    if (lite) {
      const e = easeOut(t);
      return [e, lerp(0.5, 1, e), 1];
    }
    if (t < 0.55) {
      const e = easeOut(t / 0.55);
      return [e, lerp(0.3, 1.08, e), lerp(1, 1.7, e)];
    }
    const e = easeOut((t - 0.55) / 0.45);
    return [1, lerp(1.08, 1, e), lerp(1.7, 1, e)];
  };

  const paint = (elapsed: number) => {
    ctx.clearRect(0, 0, width, height);
    const cw = width / cols;
    const ch = height / rows;

    pixels.forEach((pixel, i) => {
      const t = Math.min(1, (elapsed - pixel[3]) / duration);
      if (t <= 0) return;
      const [alpha, scale, bright] = frameAt(t);
      const w = cw * scale + 1;
      const h = ch * scale + 1;
      const x = (i % cols) * cw + (cw - w) / 2;
      const y = Math.floor(i / cols) * ch + (ch - h) / 2;
      ctx.globalAlpha = alpha;
      ctx.fillStyle = bright === 1 ? colors[i] : rgb([pixel[0], pixel[1], pixel[2]], bright);
      ctx.fillRect(x, y, w, h);
    });

    ctx.globalAlpha = 1;
  };

  const tick = (now: number) => {
    if (start < 0) start = now;
    const elapsed = now - start;
    paint(elapsed);
    if (elapsed < end) requestAnimationFrame(tick);
    else done = true;
  };

  const resize = () => {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    paint(done ? end : start < 0 ? 0 : performance.now() - start);
  };

  const play = () => {
    if (start >= 0 || done) return;
    requestAnimationFrame(tick);
  };

  const show = () => {
    done = true;
    paint(end);
  };

  return { resize, play, show };
};

export const initPixelWave = (
  host: HTMLElement,
  canvas: HTMLCanvasElement,
  onReveal?: () => void,
) => {
  if (host.dataset.pixelWave) return;
  host.dataset.pixelWave = "ready";

  const cols = Number(host.dataset.cols);
  const rows = Number(host.dataset.rows);
  const pixels: WavePixel[] = JSON.parse(host.dataset.pixels ?? "[]");
  const wave = createPixelWave(canvas, cols, rows, pixels);
  if (!wave) return;

  new ResizeObserver(() => wave.resize()).observe(canvas);

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    wave.show();
    return;
  }

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (!entry.isIntersecting) return;
      wave.play();
      onReveal?.();
      observer.disconnect();
    },
    { rootMargin: "0px 0px -15% 0px" },
  );
  observer.observe(host);
};

export function initPixelGrids() {
  document.querySelectorAll<HTMLElement>(".pixel-grid").forEach((grid) => {
    const canvas = grid.querySelector<HTMLCanvasElement>(".pixel-grid-canvas");
    if (canvas) initPixelWave(grid, canvas);
  });
}
