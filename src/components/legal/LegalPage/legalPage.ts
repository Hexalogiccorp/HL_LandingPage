export function initLegalPage() {
  const page = document.querySelector<HTMLElement>(".legal");
  if (!page) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const targets = page.querySelectorAll<HTMLElement>(".legal-reveal");
  page.classList.add("legal--reveal");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("legal-visible");
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -8% 0px" }
  );
  targets.forEach((el) => observer.observe(el));
}
