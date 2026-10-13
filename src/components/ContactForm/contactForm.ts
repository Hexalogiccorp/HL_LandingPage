const showAlert = (alert: HTMLElement | null, animation: string) => {
  if (!alert) return;
  // Reinicia la animación aunque ya se haya mostrado
  alert.style.animation = "none";
  void alert.offsetWidth;
  alert.style.animation = animation;
};

const SUCCESS_ANIMATION = `
  fadeIn 0.4s ease forwards,
  successGlowBorder 1s ease forwards,
  fadeOut 0.6s ease 3s forwards,
  successGlowOff 0.6s ease 3s forwards
`;

const ERROR_ANIMATION = `
  fadeIn 0.4s ease forwards,
  errorGlowBorder 1s ease forwards,
  fadeOut 0.6s ease 3s forwards,
  errorGlowOff 0.6s ease 3s forwards
`;

const REVEAL_DURATION = 2500;

const initReveal = (section: HTMLElement) => {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  // Se oculta solo con JS, así sin él nunca queda invisible
  section.classList.add("contact--reveal");

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (!entry.isIntersecting) return;
      section.classList.add("contact--in-view");
      // Quita las transiciones de entrada para que no frenen hover ni foco
      setTimeout(() => section.classList.remove("contact--reveal"), REVEAL_DURATION);
      observer.disconnect();
    },
    { rootMargin: "0px 0px -15% 0px" },
  );
  observer.observe(section.querySelector(".contact-title") ?? section);
};

export function initContactForm() {
  const section = document.querySelector<HTMLElement>(".contact");
  if (section) initReveal(section);

  const form = document.querySelector<HTMLFormElement>(".contact-form");
  const successAlert = document.querySelector<HTMLElement>(".alert-container");
  const errorAlert = document.querySelector<HTMLElement>(".alert-container-error");
  if (!form) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(form);

    fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(formData as unknown as Record<string, string>).toString(),
    })
      .then((response) => {
        if (!response.ok) throw new Error("Error al enviar correo");
        showAlert(successAlert, SUCCESS_ANIMATION);
        window.history.replaceState({}, document.title, window.location.pathname);
        form.reset();
      })
      .catch(() => showAlert(errorAlert, ERROR_ANIMATION));
  });
}
