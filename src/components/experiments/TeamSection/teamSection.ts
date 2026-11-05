const REVEAL_TARGETS = ".team-title, .team-subtitle, .team-column";

const initReveal = (section: HTMLElement) => {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const targets = [...section.querySelectorAll<HTMLElement>(REVEAL_TARGETS)];
  section.classList.add("team--reveal");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("team-visible");
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -5% 0px" },
  );
  targets.forEach((target) => observer.observe(target));
};

const initModal = (section: HTMLElement) => {
  const modal = section.querySelector<HTMLDialogElement>(".team-modal");
  if (!modal) return;

  const card = modal.querySelector<HTMLElement>(".team-modal-card");
  const image = modal.querySelector<HTMLImageElement>(".team-modal-image");
  const title = modal.querySelector<HTMLElement>(".team-modal-title");
  const description = modal.querySelector<HTMLElement>(".team-modal-description");
  const demo = modal.querySelector<HTMLAnchorElement>(".team-modal-demo");
  const close = modal.querySelector<HTMLButtonElement>(".team-modal-close");
  const prev = modal.querySelector<HTMLButtonElement>(".team-modal-nav--prev");
  const next = modal.querySelector<HTMLButtonElement>(".team-modal-nav--next");
  const counter = modal.querySelector<HTMLElement>(".team-modal-counter");
  if (!card || !image || !title || !description || !demo || !close || !prev || !next || !counter) return;

  const projects = [...section.querySelectorAll<HTMLElement>(".team-item:not([aria-hidden])")].sort(
    (a, b) => Number(a.dataset.index) - Number(b.dataset.index),
  );
  let current = 0;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const texts = [title, description, demo];
  const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";
  let animating = false;

  const fill = (index: number) => {
    current = (index + projects.length) % projects.length;
    const data = projects[current].dataset;

    card.classList.add("team-modal-card--loading");
    image.onload = image.onerror = () => card.classList.remove("team-modal-card--loading");
    image.src = data.image ?? "";
    if (image.complete) card.classList.remove("team-modal-card--loading");
    image.alt = data.alt ?? "";
    title.textContent = data.title ?? "";
    description.textContent = data.description ?? "";
    demo.hidden = !data.demo;
    demo.href = data.demo || "#";

    const pad = (n: number) => String(n).padStart(2, "0");
    counter.textContent = `${pad(current + 1)} / ${pad(projects.length)}`;
  };

  const navigate = async (direction: 1 | -1) => {
    if (animating) return;
    if (reducedMotion) return fill(current + direction);
    animating = true;

    const leaving = [
      image.animate(
        [
          { opacity: 1, transform: "translateX(0)" },
          { opacity: 0, transform: `translateX(${-direction * 40}px)` },
        ],
        { duration: 220, easing: "ease-in", fill: "forwards" },
      ),
      ...texts.map((el) =>
        el.animate(
          [
            { opacity: 1, transform: "translateY(0)" },
            { opacity: 0, transform: "translateY(10px)" },
          ],
          { duration: 180, easing: "ease-in", fill: "forwards" },
        ),
      ),
    ];
    await Promise.all(leaving.map((a) => a.finished));

    fill(current + direction);
    await image.decode().catch(() => {});

    const entering = [
      image.animate(
        [
          { opacity: 0, transform: `translateX(${direction * 40}px)` },
          { opacity: 1, transform: "translateX(0)" },
        ],
        { duration: 500, easing: EASE, fill: "forwards" },
      ),
      ...texts.map((el, i) =>
        el.animate(
          [
            { opacity: 0, transform: "translateY(16px)" },
            { opacity: 1, transform: "translateY(0)" },
          ],
          { duration: 500, delay: 80 + i * 70, easing: EASE, fill: "both" },
        ),
      ),
    ];
    leaving.forEach((a) => a.cancel());
    await Promise.all(entering.map((a) => a.finished));
    entering.forEach((a) => a.cancel());
    animating = false;
  };

  const open = (item: HTMLElement) => {
    fill(Number(item.dataset.index));
    modal.showModal();
  };

  const reset = () => image.removeAttribute("src");

  section.querySelectorAll<HTMLElement>(".team-item").forEach((item) => {
    item.addEventListener("click", () => open(item));
    item.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      open(item);
    });
  });

  prev.addEventListener("click", () => navigate(-1));
  next.addEventListener("click", () => navigate(1));

  modal.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") navigate(-1);
    if (event.key === "ArrowRight") navigate(1);
  });

  let touchStartX = 0;
  card.addEventListener("touchstart", (event) => (touchStartX = event.touches[0].clientX), {
    passive: true,
  });
  card.addEventListener("touchend", (event) => {
    const deltaX = event.changedTouches[0].clientX - touchStartX;
    if (Math.abs(deltaX) < 50) return;
    navigate(deltaX < 0 ? 1 : -1);
  });

  close.addEventListener("click", () => modal.close());
  modal.addEventListener("close", reset);

  modal.addEventListener("click", (event) => {
    if (event.target === modal) modal.close();
  });
};

export function initTeamSection() {
  document.querySelectorAll<HTMLElement>(".team").forEach((section) => {
    initReveal(section);
    initModal(section);
  });
}
