const REVEAL_DURATION = 2500;

const initReveal = (section: HTMLElement) => {
  // Se oculta solo con JS, así sin él nunca queda invisible
  section.classList.add("pricing--reveal");

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (!entry.isIntersecting) return;
      section.classList.add("pricing--in-view");
      // Quita las transiciones de entrada para que no frenen el hover
      setTimeout(() => section.classList.remove("pricing--reveal"), REVEAL_DURATION);
      observer.disconnect();
    },
    { rootMargin: "0px 0px -15% 0px" },
  );
  observer.observe(section.querySelector(".pricing-title") ?? section);
};

const ACTIVE_CLASS = "pricing-card--active";

// Con mouse: al pasar o enfocar "Contratar"
const initHoverActivation = (cards: HTMLElement[]) => {
  cards.forEach((card) => {
    const button = card.querySelector(".pricing-button");
    if (!button) return;
    const on = () => card.classList.add(ACTIVE_CLASS);
    const off = () => card.classList.remove(ACTIVE_CLASS);
    button.addEventListener("pointerenter", on);
    button.addEventListener("pointerleave", off);
    button.addEventListener("focus", on);
    button.addEventListener("blur", off);
  });
};

// Táctil (sin hover): la tarjeta que cruza el centro de la pantalla
const initScrollActivation = (cards: HTMLElement[]) => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        entry.target.classList.toggle(ACTIVE_CLASS, entry.isIntersecting);
      });
    },
    // Franja estrecha en el centro: solo una tarjeta a la vez
    { rootMargin: "-45% 0px -45% 0px" },
  );
  cards.forEach((card) => observer.observe(card));
};

export function initPricing() {
  const sections = document.querySelectorAll<HTMLElement>(".pricing");
  const canHover = window.matchMedia("(hover: hover)").matches;

  sections.forEach((section) => {
    const cards = [...section.querySelectorAll<HTMLElement>(".pricing-card")];
    if (canHover) initHoverActivation(cards);
    else initScrollActivation(cards);
  });

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  sections.forEach(initReveal);
}
