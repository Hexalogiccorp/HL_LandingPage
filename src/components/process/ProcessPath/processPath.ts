type RGB = [number, number, number];

const SVG_NS = "http://www.w3.org/2000/svg";
const EMERALD: RGB = [52, 211, 153];
const LEMON: RGB = [135, 245, 39];
const HIGHLIGHT: RGB = [228, 255, 214];

const clamp = (v: number) => Math.min(1, Math.max(0, v));
const mix = (a: RGB, b: RGB, t: number): RGB => a.map((v, i) => Math.round(v + (b[i] - v) * t)) as RGB;
const noise = (c: number, r: number) => {
  const s = Math.sin(c * 127.1 + r * 311.7) * 43758.5453;
  return s - Math.floor(s);
};

const buildHead = (head: SVGSVGElement, cell: number, radius: number) => {
  const fragment = document.createDocumentFragment();

  for (let r = -radius; r <= radius; r++) {
    for (let c = -radius; c <= radius; c++) {
      const distance = Math.hypot(c, r) / (radius + 0.5);
      const intensity = clamp(Math.exp(-((distance / 0.55) ** 2)) + (noise(c, r) - 0.5) * 0.25);
      if (intensity < 0.08) continue;

      const color = mix(mix(EMERALD, LEMON, 1 - distance), HIGHLIGHT, Math.exp(-((distance / 0.22) ** 2)) * 0.9);
      const size = cell - 1;
      const pixel = document.createElementNS(SVG_NS, "rect");
      pixel.setAttribute("class", "ppath-head-pixel");
      pixel.setAttribute("x", String(c * cell - size / 2));
      pixel.setAttribute("y", String(r * cell - size / 2));
      pixel.setAttribute("width", String(size));
      pixel.setAttribute("height", String(size));
      pixel.setAttribute("fill", `rgb(${color.join(" ")})`);
      pixel.style.setProperty("--ppath-pixel-opacity", intensity.toFixed(2));
      pixel.style.animationDuration = `${(1.1 + noise(r, c) * 1.4).toFixed(2)}s`;
      pixel.style.animationDelay = `${(-noise(c + 7, r + 3) * 2).toFixed(2)}s`;
      fragment.append(pixel);
    }
  }

  head.replaceChildren(fragment);
};

type GlowPixel = { x: number; y: number; color: string; opacity: number; delay: number };
type GlowMode = "in" | "out";

const GLOW_IN = 1400;
const GLOW_STAGGER = 16;
const GLOW_OUT_SPEED = 2.2;

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const easeOut = (t: number) => 1 - (1 - t) ** 3;

const glowAt = (opacity: number, t: number): [number, number] => {
  const e = easeOut(t);
  if (e < 0.4) return [opacity * (e / 0.4), lerp(0.3, 1.08, e / 0.4)];
  const k = (e - 0.4) / 0.6;
  return [lerp(opacity, opacity * 0.4, k), lerp(1.08, 1, k)];
};

const createGlow = (canvas: HTMLCanvasElement) => {
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  let pixels: GlowPixel[] = [];
  let cell = 13;
  let width = 0;
  let height = 0;
  let duration = 0;
  let position = 0;
  let direction = 1;
  let last = 0;
  let frame = 0;

  const paint = () => {
    ctx.clearRect(0, 0, width, height);

    for (const pixel of pixels) {
      const t = (position - pixel.delay) / GLOW_IN;
      if (t <= 0) continue;
      const [alpha, scale] = glowAt(pixel.opacity, Math.min(1, t));
      if (alpha < 0.004) continue;
      const size = cell * scale;
      const offset = (cell - size) / 2;
      ctx.globalAlpha = alpha;
      ctx.fillStyle = pixel.color;
      ctx.fillRect(pixel.x + offset, pixel.y + offset, size, size);
    }

    ctx.globalAlpha = 1;
  };

  const tick = (now: number) => {
    const elapsed = now - last;
    last = now;
    position += direction > 0 ? elapsed : -elapsed * GLOW_OUT_SPEED;
    position = Math.min(duration, Math.max(0, position));
    paint();

    const settled = direction > 0 ? position >= duration : position <= 0;
    frame = settled ? 0 : requestAnimationFrame(tick);
  };

  const play = (next: GlowMode) => {
    direction = next === "in" ? 1 : -1;
    if (frame) return;
    last = performance.now();
    frame = requestAnimationFrame(tick);
  };

  const set = (state: boolean) => {
    cancelAnimationFrame(frame);
    frame = 0;
    position = state ? duration : 0;
    paint();
  };

  const build = (w: number, h: number, size: number, originX: number) => {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    width = w;
    height = h;
    cell = size;
    canvas.width = Math.round(w * ratio);
    canvas.height = Math.round(h * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

    const step = size + 1;
    const cols = Math.ceil(w / step);
    const rows = Math.ceil(h / step);
    const center = (cols - 1) / 2;
    const origin = Math.min(cols - 1, Math.max(0, Math.floor(originX / step)));
    duration = Math.hypot(Math.max(origin, cols - 1 - origin), rows - 1) * GLOW_STAGGER + GLOW_IN;
    pixels = [];

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const nx = (c - center) / cols;
        const ny = r / rows;
        const glow = Math.exp(-((nx / 0.32) ** 2) - (ny / 0.95) ** 2);
        const opacity = clamp(glow * 0.6 + (noise(c, r) - 0.5) * 0.12);
        if (opacity < 0.04) continue;

        const hue = mix(EMERALD, LEMON, clamp(1 - Math.hypot(nx * 1.6, ny)));
        const color = mix(hue, HIGHLIGHT, Math.exp(-((nx / 0.06) ** 2) - (ny / 0.22) ** 2) * 0.4);
        const delay = Math.hypot(c - origin, r) * GLOW_STAGGER;
        pixels.push({
          x: c * step,
          y: r * step,
          color: `rgb(${color.join(" ")})`,
          opacity,
          delay,
        });
      }
    }
  };

  return { build, play, set };
};

const initReveal = (section: HTMLElement) => {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const targets = section.querySelectorAll<HTMLElement>(".ppath-cta");
  section.classList.add("ppath--reveal");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("ppath-visible");
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -5% 0px" }
  );
  targets.forEach((el) => observer.observe(el));
};

const initPath = (section: HTMLElement) => {
  const track = section.querySelector<HTMLElement>(".ppath-track");
  const rail = section.querySelector<HTMLElement>(".ppath-rail");
  const line = section.querySelector<HTMLElement>(".ppath-line");
  const head = section.querySelector<SVGSVGElement>(".ppath-head");
  const cta = section.querySelector<HTMLElement>(".ppath-cta");
  const canvas = section.querySelector<HTMLCanvasElement>(".ppath-cta-canvas");
  const steps = [...section.querySelectorAll<HTMLElement>(".ppath-step")];
  if (!track || !rail || !line || !head || !cta || !canvas || !steps.length) return;

  const glow = createGlow(canvas);
  if (!glow) return;

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const mobile = window.matchMedia("(max-width: 767px)");

  let total = 0;
  let trackTop = 0;
  let railX = 0;
  let startY = 0;
  let secondY = 0;
  let nodeLengths: number[] = [];
  let current = 0;
  let target = 0;
  let frame = 0;
  let headRadius = 0;

  const measure = () => {
    if (reduced) return total;
    const y = window.innerHeight * 0.6 - (trackTop - window.scrollY);
    const lead = window.innerHeight * 0.3;
    const span = secondY - startY;
    const shifted = y >= secondY ? y : startY + ((y - startY + lead) * span) / (span + lead);
    return Math.min(total, Math.max(0, shifted - startY));
  };

  const burst = (el: HTMLElement, className: string) => {
    el.classList.remove(className);
    void el.offsetWidth;
    el.classList.add(className);
  };

  const render = (drawn: number, animate = true) => {
    line.style.transform = `scaleY(${total ? drawn / total : 0})`;
    head.style.transform = `translate3d(${railX - headRadius}px, ${startY + drawn - headRadius}px, 0)`;
    head.classList.toggle("ppath-head--hidden", drawn <= 0.5 || drawn >= total - headRadius);

    steps.forEach((step, i) => {
      const active = drawn > 0.5 && drawn >= nodeLengths[i] - 1;
      const wasActive = step.classList.contains("ppath-step--active");
      if (active && !wasActive && animate && !reduced) burst(step, "ppath-step--burst");
      if (!active) step.classList.remove("ppath-step--burst");
      step.classList.toggle("ppath-step--active", active);
      if (active) step.classList.add("ppath-step--seen");
    });

    const finished = drawn >= total - 1;
    if (finished) section.classList.add("ppath--complete");
    const wasLit = cta.classList.contains("ppath-cta--lit");
    if (finished && !wasLit) {
      if (reduced) glow.set(true);
      else glow.play("in");
    }
    if (!finished && wasLit) {
      if (reduced) glow.set(false);
      else glow.play("out");
    }
    cta.classList.toggle("ppath-cta--lit", finished);
  };

  const tick = () => {
    current += (target - current) * 0.16;
    if (Math.abs(target - current) < 0.5) current = target;
    render(current);
    frame = current === target ? 0 : requestAnimationFrame(tick);
  };

  const update = () => {
    if (!total) return;
    target = measure();
    if (!frame) frame = requestAnimationFrame(tick);
  };

  const build = () => {
    const box = track.getBoundingClientRect();
    const points = steps.map((step) => {
      const node = step.querySelector<HTMLElement>(".ppath-node")!.getBoundingClientRect();
      return { x: node.left + node.width / 2 - box.left, y: node.top + node.height / 2 - box.top };
    });

    trackTop = box.top + window.scrollY;
    railX = points[0].x;
    startY = points[0].y;
    secondY = points[1]?.y ?? cta.offsetTop;
    total = cta.offsetTop - startY;
    nodeLengths = points.map((point) => point.y - startY);

    rail.style.left = `${railX}px`;
    rail.style.top = `${startY}px`;
    rail.style.height = `${total}px`;

    const headCell = mobile.matches ? 6 : 8;
    const radius = 4;
    headRadius = (radius + 0.5) * headCell;
    head.setAttribute("width", String(headRadius * 2));
    head.setAttribute("height", String(headRadius * 2));
    head.setAttribute("viewBox", `${-headRadius} ${-headRadius} ${headRadius * 2} ${headRadius * 2}`);
    buildHead(head, headCell, radius);
    glow.build(cta.clientWidth, cta.clientHeight, mobile.matches ? 9 : 13, railX - cta.offsetLeft);
    glow.set(false);
    cta.classList.remove("ppath-cta--lit");

    target = measure();
    current = target;
    render(current, false);
  };

  new ResizeObserver(build).observe(document.body);
  window.addEventListener("scroll", update, { passive: true });
};

export function initProcessPath() {
  const section = document.querySelector<HTMLElement>(".ppath");
  if (!section) return;
  initReveal(section);
  initPath(section);
}
