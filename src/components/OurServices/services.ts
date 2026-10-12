const initTabs = (section: HTMLElement) => {
  const tabList = section.querySelector<HTMLElement>(".services-tabs");
  const tabs = [...section.querySelectorAll<HTMLButtonElement>(".services-tab")];
  const panels = [...section.querySelectorAll<HTMLElement>(".services-panel")];

  // scrollTo en vez de scrollIntoView para no mover la página
  const centerTab = (tab: HTMLElement) => {
    if (!tabList || tabList.scrollWidth <= tabList.clientWidth) return;
    tabList.scrollTo({
      left: tab.offsetLeft - (tabList.clientWidth - tab.offsetWidth) / 2,
      behavior: "smooth",
    });
  };

  const select = (index: number) => {
    tabs.forEach((tab, i) => {
      const isActive = i === index;
      tab.classList.toggle("services-tab--active", isActive);
      tab.setAttribute("aria-selected", String(isActive));
      tab.tabIndex = isActive ? 0 : -1;
    });
    panels.forEach((panel, i) => {
      const isActive = i === index;
      panel.classList.toggle("services-panel--active", isActive);
      panel.setAttribute("aria-hidden", String(!isActive));
    });
    centerTab(tabs[index]);
  };

  tabs.forEach((tab, i) => {
    tab.addEventListener("click", () => select(i));

    tab.addEventListener("keydown", (event) => {
      const step = ["ArrowDown", "ArrowRight"].includes(event.key)
        ? 1
        : ["ArrowUp", "ArrowLeft"].includes(event.key)
          ? -1
          : 0;
      if (!step) return;
      event.preventDefault();
      const next = (i + step + tabs.length) % tabs.length;
      select(next);
      tabs[next].focus();
    });
  });
};

export function initServices() {
  document.querySelectorAll<HTMLElement>(".services").forEach(initTabs);
}
