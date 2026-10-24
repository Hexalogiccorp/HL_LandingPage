const SWIPE_THRESHOLD = 50;

const playVideo = (slide: HTMLElement) => {
  const video = slide.querySelector<HTMLVideoElement>(".proj-video");
  if (!video) return;
  video.preload = "auto";
  video.currentTime = 0;
  video.play().catch(() => {});
};

const resetVideo = (slide: HTMLElement) => {
  const video = slide.querySelector<HTMLVideoElement>(".proj-video");
  if (!video) return;
  video.pause();
  video.currentTime = 0;
};

const initCarousel = (section: HTMLElement) => {
  const slides = [...section.querySelectorAll<HTMLElement>(".proj-slide")];
  const dots = [...section.querySelectorAll<HTMLButtonElement>(".proj-dot")];
  const counter = section.querySelector(".proj-counter-current");
  const carousel = section.querySelector<HTMLElement>(".proj-carousel");
  if (!slides.length || !carousel) return;

  const track = section.querySelector<HTMLElement>(".proj-slides");
  let current = 0;
  let inView = false;

  const goTo = (index: number, backwards = index < current) => {
    const next = (index + slides.length) % slides.length;
    if (next === current) return;
    track?.classList.toggle("proj-slides--back", backwards);
    resetVideo(slides[current]);
    current = next;

    const incoming = slides[current];
    incoming.classList.add("proj-slide--enter");
    void incoming.offsetWidth;

    slides.forEach((slide, i) => {
      slide.classList.toggle("proj-slide--active", i === current);
      slide.inert = i !== current;
    });
    dots.forEach((dot, i) => {
      dot.classList.toggle("proj-dot--active", i === current);
      dot.setAttribute("aria-selected", String(i === current));
    });
    if (counter) counter.textContent = String(current + 1);
    section.classList.toggle("proj--alliance", incoming.dataset.alliance === "true");
    requestAnimationFrame(() => incoming.classList.remove("proj-slide--enter"));
    if (inView) playVideo(slides[current]);
  };

  slides.forEach((slide, i) => (slide.inert = i !== 0));
  dots.forEach((dot, i) => dot.addEventListener("click", () => goTo(i)));

  carousel.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") goTo(current - 1, true);
    if (event.key === "ArrowRight") goTo(current + 1, false);
  });

  let touchStart: { x: number; y: number } | null = null;
  carousel.addEventListener(
    "touchstart",
    (event) => {
      const touch = event.touches[0];
      touchStart = { x: touch.clientX, y: touch.clientY };
    },
    { passive: true }
  );
  carousel.addEventListener(
    "touchend",
    (event) => {
      if (!touchStart) return;
      const touch = event.changedTouches[0];
      const dx = touch.clientX - touchStart.x;
      const dy = touch.clientY - touchStart.y;
      touchStart = null;
      if (Math.abs(dx) < SWIPE_THRESHOLD || Math.abs(dx) < Math.abs(dy)) return;
      goTo(current + (dx < 0 ? 1 : -1), dx > 0);
    },
    { passive: true }
  );

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (!entry.isIntersecting || inView) return;
      inView = true;
      playVideo(slides[current]);
    },
    { threshold: 0.4 }
  );
  observer.observe(carousel);
};

const reveal = (elements: NodeListOf<HTMLElement>, rootMargin: string) => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("proj-visible");
        observer.unobserve(entry.target);
      });
    },
    { rootMargin }
  );
  elements.forEach((el) => observer.observe(el));
};

const initReveal = (section: HTMLElement) => {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  section.classList.add("proj--reveal");
  reveal(
    section.querySelectorAll<HTMLElement>(
      ".proj-title, .proj-subtitle, .proj-badge, .proj-name, .proj-category, .proj-description, .proj-actions, .proj-media"
    ),
    "0px 0px -15% 0px"
  );
  reveal(section.querySelectorAll<HTMLElement>(".proj-footer"), "0px 0px 0px 0px");
};

export function initPortFolio() {
  const section = document.querySelector<HTMLElement>(".proj");
  if (!section) return;
  initCarousel(section);
  initReveal(section);
}
