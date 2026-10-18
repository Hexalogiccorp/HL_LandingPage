const REVEAL_DURATION = 2500;
const REVEAL_TARGETS = ".lab-column, .lab-title, .lab-subtitle, .lab-text, .lab-button";

const initReveal = (section: HTMLElement) => {
  const targets = [...section.querySelectorAll<HTMLElement>(REVEAL_TARGETS)];
  if (!targets.length) return;

  // Se oculta solo con JS, así sin él nunca queda invisible
  section.classList.add("lab--reveal");
  let pending = targets.length;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("lab-visible");
        observer.unobserve(entry.target);
        pending -= 1;
      });

      // Al terminar, quita las transiciones de entrada para que no frenen el hover
      if (pending === 0) {
        observer.disconnect();
        setTimeout(() => section.classList.remove("lab--reveal"), REVEAL_DURATION);
      }
    },
    // -5%: se anima apenas asoma por abajo (con -15% se sentía tardío)
    { rootMargin: "0px 0px -5% 0px" },
  );
  targets.forEach((target) => observer.observe(target));
};

export function initDesignLab() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  document.querySelectorAll<HTMLElement>(".lab").forEach(initReveal);
}
