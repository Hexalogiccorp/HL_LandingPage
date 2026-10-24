const reveal = (elements: NodeListOf<HTMLElement>, options: IntersectionObserverInit) => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("about-intro-visible");
      observer.unobserve(entry.target);
    });
  }, options);
  elements.forEach((el) => observer.observe(el));
};

export function initAboutIntro() {
  const section = document.querySelector<HTMLElement>(".about-intro");
  if (!section) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  section.classList.add("about-intro--reveal");

  reveal(
    section.querySelectorAll<HTMLElement>(
      ".about-intro-title, .about-intro-subtitle, .about-intro-text, .about-intro-stats, .about-intro-statement"
    ),
    { rootMargin: "0px 0px -5% 0px" }
  );

  reveal(section.querySelectorAll<HTMLElement>(".about-intro-decoration"), { threshold: 0.3 });
}
