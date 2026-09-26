if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
  // GSAP not loaded
} else {
  gsap.registerPlugin(ScrollTrigger);

  const graphicSection = document.querySelector(".section-graphic");
  const graphicGallery = document.querySelector(".graphic-gallery");

  const getHorizontalDistance = () => {
    const lastItem = graphicGallery?.querySelector(".graphic-item:last-of-type");
    if (!graphicGallery || !lastItem) {
      return 0;
    }

    const currentX = Number(gsap.getProperty(graphicGallery, "x")) || 0;
    gsap.set(graphicGallery, { x: 0 });
    const lastRight = lastItem.getBoundingClientRect().right;
    gsap.set(graphicGallery, { x: currentX });

    const rightGap = 70;
    return Math.max(0, lastRight - (window.innerWidth - rightGap));
  };

  const mm = gsap.matchMedia();

  mm.add("(min-width: 1201px)", () => {
    if (
      !graphicSection ||
      !graphicGallery ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return undefined;
    }

    const tween = gsap.to(graphicGallery, {
      x: () => -getHorizontalDistance(),
      ease: "none",
      scrollTrigger: {
        trigger: graphicSection,
        start: "top top",
        end: () => `+=${getHorizontalDistance() * 1.2}`,
        pin: true,
        scrub: true,
        invalidateOnRefresh: true,
        anticipatePin: 1,
      },
    });

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);

    return () => {
      window.removeEventListener("load", refresh);
      gsap.set(graphicGallery, { x: 0 });
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  });
}
