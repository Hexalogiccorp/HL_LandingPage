const reveal = (elements: NodeListOf<HTMLElement>, options: IntersectionObserverInit) => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("ourteam-visible");
      observer.unobserve(entry.target);
    });
  }, options);
  elements.forEach((el) => observer.observe(el));
};

export function initOurTeam() {
  const section = document.querySelector<HTMLElement>(".ourteam");
  if (!section) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  section.classList.add("ourteam--reveal");

  reveal(
    section.querySelectorAll<HTMLElement>(
      ".ourteam-title, .ourteam-subtitle, .ourteam-name, .ourteam-role, .ourteam-bio, .ourteam-brand"
    ),
    { rootMargin: "0px 0px -5% 0px" }
  );

  reveal(section.querySelectorAll<HTMLElement>(".ourteam-photo"), { threshold: 0.45 });
}
