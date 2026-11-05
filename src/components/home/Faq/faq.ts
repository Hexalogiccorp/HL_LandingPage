const setItemOpen = (item: Element, open: boolean) => {
  item.classList.toggle("faq-item--open", open);
  item.querySelector(".faq-question")?.setAttribute("aria-expanded", String(open));
};

const initAccordion = (section: HTMLElement) => {
  section.querySelectorAll<HTMLElement>(".faq-group").forEach((group) => {
    const items = [...group.querySelectorAll<HTMLElement>(".faq-item")];
    items.forEach((item) => {
      item.querySelector(".faq-question")?.addEventListener("click", () => {
        const willOpen = !item.classList.contains("faq-item--open");
        items.forEach((other) => setItemOpen(other, other === item && willOpen));
      });
    });
  });
};

const initTabs = (section: HTMLElement) => {
  const tabs = [...section.querySelectorAll<HTMLButtonElement>(".faq-tab")];
  const groups = [...section.querySelectorAll<HTMLElement>(".faq-group")];

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => {
      tabs.forEach((other, i) => {
        const active = i === index;
        other.classList.toggle("faq-tab--active", active);
        other.setAttribute("aria-selected", String(active));
      });
      groups.forEach((group, i) => {
        const active = i === index;
        group.hidden = !active;
        group.classList.toggle("faq-group--active", active);
        if (active) {
          group.querySelectorAll(".faq-item").forEach((item, j) => setItemOpen(item, j === 0));
        }
      });
    });
  });
};

const initReveal = (section: HTMLElement) => {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const targets = section.querySelectorAll<HTMLElement>(".faq-title, .faq-subtitle, .faq-tabs, .faq-groups");
  section.classList.add("faq--reveal");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("faq-visible");
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -5% 0px" }
  );
  targets.forEach((el) => observer.observe(el));
};

export function initFaq() {
  const section = document.querySelector<HTMLElement>(".faq");
  if (!section) return;
  initAccordion(section);
  initTabs(section);
  initReveal(section);
}
