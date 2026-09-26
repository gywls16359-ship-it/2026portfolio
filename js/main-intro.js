const mainSection = document.querySelector(".section-main");

if (mainSection) {
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (reduceMotion) {
    mainSection.classList.remove("is-intro");
    mainSection.classList.add("is-intro-done");
  } else {
    requestAnimationFrame(() => {
      mainSection.classList.add("is-ready");
    });
  }
}
