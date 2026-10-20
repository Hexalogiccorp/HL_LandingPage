const REVEAL_DURATION = 2500;

const initReveal = (banner: HTMLElement) => {
  banner.classList.add("image-banner--reveal");

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (!entry.isIntersecting) return;
      banner.classList.add("image-banner--in-view");
      setTimeout(() => banner.classList.remove("image-banner--reveal"), REVEAL_DURATION);
      observer.disconnect();
    },
    { rootMargin: "0px 0px -15% 0px" },
  );
  observer.observe(banner);
};

export function initImageBanner() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  document.querySelectorAll<HTMLElement>(".image-banner").forEach(initReveal);
}
