const initScroll = (nav: HTMLElement) => {
  const update = () => nav.classList.toggle("med-nav--scrolled", window.scrollY > 0);
  update();
  window.addEventListener("scroll", update, { passive: true });
};

const initMobileMenu = (nav: HTMLElement) => {
  const toggle = nav.querySelector<HTMLButtonElement>(".med-nav-toggle");
  const links = nav.querySelectorAll<HTMLAnchorElement>(".med-nav-mobile a");

  const setOpen = (open: boolean) => {
    nav.classList.toggle("med-nav--open", open);
    toggle?.setAttribute("aria-expanded", String(open));
    toggle?.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
    document.body.style.overflow = open ? "hidden" : "";
  };

  toggle?.addEventListener("click", () => setOpen(!nav.classList.contains("med-nav--open")));
  links.forEach((link) => link.addEventListener("click", () => setOpen(false)));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setOpen(false);
  });
};

const initLanguage = (nav: HTMLElement) => {
  const switches = nav.querySelectorAll<HTMLButtonElement>(".med-nav-lang");

  const apply = (lang: string) => {
    switches.forEach((button) => {
      button.dataset.lang = lang;
      button.setAttribute("aria-label", lang === "en" ? "Cambiar a español" : "Switch to English");
    });
    document.documentElement.lang = lang;
    try {
      localStorage.setItem("med-lang", lang);
    } catch {}
    document.dispatchEvent(new CustomEvent("med-languagechange", { detail: { lang } }));
  };

  let lang = "en";
  try {
    lang = localStorage.getItem("med-lang") ?? "en";
  } catch {}
  apply(lang);

  switches.forEach((button) =>
    button.addEventListener("click", () => apply(button.dataset.lang === "en" ? "es" : "en"))
  );
};

export function initMedNavbar() {
  const nav = document.querySelector<HTMLElement>(".med-nav");
  if (!nav) return;
  initScroll(nav);
  initMobileMenu(nav);
  initLanguage(nav);
}
