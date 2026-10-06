const initScrollState = (navbar: HTMLElement) => {
  const update = () => navbar.classList.toggle("navbar--scrolled", window.scrollY > 0);
  window.addEventListener("scroll", update, { passive: true });
  update();
};

const initMobileMenu = (navbar: HTMLElement) => {
  const burger = document.getElementById("navbar-burger");
  const menu = document.getElementById("navbar-mobile");
  if (!burger || !menu) return;

  const setOpen = (open: boolean) => {
    menu.classList.toggle("navbar-mobile--open", open);
    navbar.classList.toggle("navbar--menu-open", open);
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
    document.body.style.overflow = open ? "hidden" : "";
  };

  const isOpen = () => menu.classList.contains("navbar-mobile--open");

  burger.addEventListener("click", () => setOpen(!isOpen()));

  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setOpen(false));
  });

  document.addEventListener("click", (event) => {
    if (isOpen() && !(event.target as Element).closest?.(".navbar")) setOpen(false);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && isOpen()) setOpen(false);
  });

  // 951px = donde aparece la versión de escritorio (ver navBar.css)
  window.matchMedia("(min-width: 951px)").addEventListener("change", (event) => {
    if (event.matches) setOpen(false);
  });
};

const initLanguage = () => {
  const button = document.getElementById("navbar-lang-button");
  const dropdown = document.getElementById("navbar-lang-dropdown");
  const current = document.getElementById("navbar-lang-current");
  const desktopOptions = document.querySelectorAll<HTMLButtonElement>(".navbar-lang-option");
  const mobileOptions = document.querySelectorAll<HTMLButtonElement>(".navbar-mobile-lang-option");

  const setDropdownOpen = (open: boolean) => {
    dropdown?.classList.toggle("navbar-lang-dropdown--open", open);
    button?.setAttribute("aria-expanded", String(open));
  };

  const applyLang = (lang: string) => {
    document.documentElement.lang = lang;
    if (current) current.textContent = lang.toUpperCase();

    desktopOptions.forEach((option) => {
      option.classList.toggle("navbar-lang-option--active", option.dataset.lang === lang);
    });
    mobileOptions.forEach((option) => {
      const isActive = option.dataset.lang === lang;
      option.classList.toggle("navbar-mobile-lang-option--active", isActive);
      option.setAttribute("aria-pressed", String(isActive));
    });

    try {
      localStorage.setItem("lang", lang);
    } catch {}
    document.dispatchEvent(new CustomEvent("languagechange", { detail: { lang } }));
  };

  let savedLang = "es";
  try {
    savedLang = localStorage.getItem("lang") ?? "es";
  } catch {}
  applyLang(savedLang);

  [...desktopOptions, ...mobileOptions].forEach((option) => {
    option.addEventListener("click", () => {
      if (option.dataset.lang) applyLang(option.dataset.lang);
      setDropdownOpen(false);
    });
  });

  button?.addEventListener("click", (event) => {
    event.stopPropagation();
    setDropdownOpen(!dropdown?.classList.contains("navbar-lang-dropdown--open"));
  });

  document.addEventListener("click", (event) => {
    if (!(event.target as Element).closest?.(".navbar-lang")) setDropdownOpen(false);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setDropdownOpen(false);
  });
};

export function initNavBar() {
  const navbar = document.querySelector<HTMLElement>(".navbar");
  if (!navbar) return;

  initScrollState(navbar);
  initMobileMenu(navbar);
  initLanguage();
}
