export function initTestimonial() {
  const section = document.querySelector<HTMLElement>(".tst");
  if (!section) return;

  const tabs = section.querySelectorAll<HTMLButtonElement>(".tst-tab");
  const photos = section.querySelectorAll<HTMLElement>(".tst-photo-image");
  const quotes = section.querySelectorAll<HTMLElement>(".tst-quote");
  const authors = section.querySelectorAll<HTMLElement>(".tst-author-item");

  function goTo(index: number) {
    section!.classList.toggle("tst--alliance", tabs[index]?.dataset.alliance === "true");
    tabs.forEach((tab, i) => {
      const active = i === index;
      tab.classList.toggle("tst-active", active);
      tab.setAttribute("aria-selected", String(active));
    });
    [photos, quotes, authors].forEach((group) =>
      group.forEach((el, i) => {
        const active = i === index;
        el.classList.toggle("tst-active", active);
        if (el.hasAttribute("aria-hidden")) el.setAttribute("aria-hidden", String(!active));
      })
    );
    authors.forEach((el, i) => {
      const link = el.querySelector(".tst-project-link");
      if (i === index) link?.removeAttribute("tabindex");
      else link?.setAttribute("tabindex", "-1");
    });
  }

  tabs.forEach((tab, i) => tab.addEventListener("click", () => goTo(i)));

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const targets = section.querySelectorAll<HTMLElement>(
    ".tst-title, .tst-subtitle, .tst-photo, .tst-content"
  );
  section.classList.add("tst--reveal");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("tst-visible");
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -5% 0px" }
  );
  targets.forEach((el) => observer.observe(el));
}
