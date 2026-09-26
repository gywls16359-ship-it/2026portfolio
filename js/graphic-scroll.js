if (typeof gsap === "undefined") {
  // GSAP not loaded
} else {
  if (typeof ScrollToPlugin !== "undefined") {
    gsap.registerPlugin(ScrollToPlugin);
  }
  if (typeof ScrollTrigger !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
  }

  const MOVE_DURATION = 0.75;
  const SLIDE_DURATION = 0.75;
  const MOVE_EASE = "power3.inOut";
  const INDICATOR_DURATION = 0.6;
  const GRAPHIC_INDEX = 2;
  const MAIN_INDEX = 0;
  const PROFILE_INDEX = 1;
  const RIGHT_GAP = 70;

  const header = document.querySelector(".site-header");
  const detailModal = document.querySelector(".detail-modal");
  const graphicGallery = document.querySelector(".graphic-gallery");
  const profileSection = document.getElementById("profile");
  const uiuxSection = document.getElementById("uiux");
  const publishingSection = document.getElementById("publishing");
  const graphicItems = graphicGallery
    ? [...graphicGallery.querySelectorAll(".graphic-item")]
    : [];
  const GRAPHIC_MAX_STEP = 2;
  const GRAPHIC_DURATION = 0.5;
  const GRAPHIC_EASE = "power3.out";

  const screens = [
    document.getElementById("main"),
    document.getElementById("profile"),
    document.getElementById("graphic"),
    uiuxSection,
    publishingSection,
    document.getElementById("contact"),
  ].filter(Boolean);

  const UIUX_INDEX = screens.indexOf(uiuxSection);
  const PUBLISHING_INDEX = screens.indexOf(publishingSection);

  const makeSlider = (section, navSelector) => {
    const nav = document.querySelector(navSelector);
    return {
      section,
      nav,
      panels: section
        ? [...section.querySelectorAll(".project-panel")]
        : [],
      navItems: nav ? [...nav.querySelectorAll(".bottom-nav-item")] : [],
      index: 0,
      pending: null,
      indicator: null,
    };
  };

  const uiux = makeSlider(uiuxSection, '[data-nav="uiux"]');
  const publishing = makeSlider(publishingSection, '[data-nav="publishing"]');
  const projectSliders = [uiux, publishing];

  let currentIndex = 0;
  let isMoving = false;
  let graphicStep = 0;

  const isDesktop = () => window.matchMedia("(min-width: 1201px)").matches;

  const isModalOpen = () => Boolean(detailModal && !detailModal.hidden);

  const getScrollY = (el) => {
    if (!el || el.id === "main") {
      return 0;
    }
    const headerH = header?.offsetHeight || 0;
    return Math.max(0, el.offsetTop - headerH);
  };

  const measureItemRightAtOrigin = (item) => {
    const currentX = Number(gsap.getProperty(graphicGallery, "x")) || 0;
    gsap.set(graphicGallery, { x: 0 });
    const right = item.getBoundingClientRect().right;
    gsap.set(graphicGallery, { x: currentX });
    return right;
  };

  const xToRevealItem = (itemIndex) => {
    const item = graphicItems[itemIndex];
    if (!graphicGallery || !item) {
      return 0;
    }
    const right = measureItemRightAtOrigin(item);
    return Math.min(0, window.innerWidth - RIGHT_GAP - right);
  };

  const getGraphicX = (step) => {
    if (step <= 0) {
      return 0;
    }
    if (step === 1) {
      return xToRevealItem(Math.min(3, graphicItems.length - 1));
    }
    return xToRevealItem(graphicItems.length - 1);
  };

  const shrinkHeader = () => {
    if (!header) {
      return;
    }
    gsap.to(header, {
      scale: 0.89,
      borderRadius: 24,
      boxShadow: "0 24px 70px rgba(32, 32, 32, 0.16)",
      duration: 0.3,
      ease: "power2.out",
      overwrite: "auto",
    });
  };

  const restoreHeader = () => {
    if (!header) {
      return;
    }
    gsap.to(header, {
      scale: 1,
      borderRadius: 0,
      boxShadow: "0 2px 16.4px rgba(69, 69, 69, 0.25)",
      duration: 0.35,
      ease: "power2.out",
      overwrite: "auto",
    });
  };

  const syncHeaderCompact = (index) => {
    if (!header) {
      return;
    }
    if (index === MAIN_INDEX) {
      header.classList.remove("is-compact");
      restoreHeader();
      return;
    }
    header.classList.add("is-compact");
    shrinkHeader();
  };

  let skillPlayTween = null;

  const resetSkillAnimation = () => {
    skillPlayTween?.kill();
    skillPlayTween = null;
    profileSection?.classList.remove("skills-animate");
  };

  const playSkillAnimation = () => {
    if (!profileSection || currentIndex !== PROFILE_INDEX) {
      return;
    }
    profileSection.classList.remove("skills-animate");
    void profileSection.offsetWidth;
    requestAnimationFrame(() => {
      if (currentIndex !== PROFILE_INDEX) {
        return;
      }
      profileSection.classList.add("skills-animate");
    });
  };

  const syncProfileSkills = (index, previousIndex) => {
    resetSkillAnimation();
    if (index !== PROFILE_INDEX && previousIndex !== PROFILE_INDEX) {
      return;
    }
    if (index === PROFILE_INDEX) {
      skillPlayTween = gsap.delayedCall(MOVE_DURATION, playSkillAnimation);
    }
  };

  const unlockMove = () => {
    isMoving = false;
  };

  const sliderAtScreen = (screenIndex) => {
    if (screenIndex === UIUX_INDEX) {
      return uiux;
    }
    if (screenIndex === PUBLISHING_INDEX) {
      return publishing;
    }
    return null;
  };

  const getIndicatorX = (slider, index) => {
    const item = slider.navItems[index];
    if (!slider.nav || !item) {
      return 0;
    }
    const navRect = slider.nav.getBoundingClientRect();
    const itemRect = item.getBoundingClientRect();
    return itemRect.left - navRect.left;
  };

  const setSliderNavActive = (slider, index) => {
    slider.navItems.forEach((item, i) => {
      item.classList.toggle("is-active", i === index);
    });
  };

  const moveSliderIndicator = (slider, index, immediate) => {
    if (!slider.indicator) {
      return;
    }
    const x = getIndicatorX(slider, index);
    if (immediate) {
      gsap.set(slider.indicator, { x });
      return;
    }
    gsap.to(slider.indicator, {
      x,
      duration: INDICATOR_DURATION,
      ease: MOVE_EASE,
      overwrite: true,
    });
  };

  const layoutSliderPanels = (slider, index, immediate) => {
    slider.panels.forEach((panel, i) => {
      const isCurrent = i === index;
      gsap.set(panel, {
        xPercent: isCurrent ? 0 : i < index ? -100 : 100,
        zIndex: isCurrent ? 2 : 1,
      });
      panel.style.pointerEvents = isCurrent ? "auto" : "none";
    });
    setSliderNavActive(slider, index);
    moveSliderIndicator(slider, index, immediate);
  };

  const goToSlide = (slider, nextIndex) => {
    if (
      isMoving ||
      nextIndex === slider.index ||
      nextIndex < 0 ||
      nextIndex >= slider.panels.length
    ) {
      return;
    }

    const currentPanel = slider.panels[slider.index];
    const nextPanel = slider.panels[nextIndex];
    const dir = nextIndex > slider.index ? 1 : -1;

    isMoving = true;
    setSliderNavActive(slider, nextIndex);
    moveSliderIndicator(slider, nextIndex, false);

    gsap.set(nextPanel, { xPercent: 100 * dir, zIndex: 2 });
    gsap.set(currentPanel, { zIndex: 1 });
    nextPanel.style.pointerEvents = "auto";
    currentPanel.style.pointerEvents = "none";

    gsap.to(currentPanel, {
      xPercent: -100 * dir,
      duration: SLIDE_DURATION,
      ease: MOVE_EASE,
      overwrite: true,
    });

    gsap.to(nextPanel, {
      xPercent: 0,
      duration: SLIDE_DURATION,
      ease: MOVE_EASE,
      overwrite: true,
      onComplete: unlockMove,
    });

    slider.index = nextIndex;
  };

  const enterSlider = (slider, previousIndex, screenIndex) => {
    if (!slider.panels.length) {
      return;
    }
    const start =
      slider.pending !== null
        ? slider.pending
        : previousIndex > screenIndex
          ? slider.panels.length - 1
          : 0;
    slider.pending = null;
    slider.index = start;
    layoutSliderPanels(slider, start, true);
  };

  const goToScreen = (index) => {
    if (index < 0 || index >= screens.length) {
      unlockMove();
      return;
    }

    isMoving = true;
    const previousIndex = currentIndex;
    currentIndex = index;

    syncHeaderCompact(index);
    syncProfileSkills(index, previousIndex);

    if (index === GRAPHIC_INDEX && graphicGallery) {
      graphicStep = previousIndex > GRAPHIC_INDEX ? GRAPHIC_MAX_STEP : 0;
      gsap.set(graphicGallery, { x: getGraphicX(graphicStep) });
    }

    if (index === UIUX_INDEX) {
      enterSlider(uiux, previousIndex, UIUX_INDEX);
    }

    if (index === PUBLISHING_INDEX) {
      enterSlider(publishing, previousIndex, PUBLISHING_INDEX);
    }

    gsap.to(window, {
      scrollTo: { y: getScrollY(screens[index]), autoKill: false },
      duration: MOVE_DURATION,
      ease: MOVE_EASE,
      overwrite: true,
      onComplete: () => {
        const slider = sliderAtScreen(index);
        if (slider) {
          moveSliderIndicator(slider, slider.index, true);
        }
        unlockMove();
      },
    });
  };

  const moveGraphic = (step) => {
    if (!graphicGallery) {
      unlockMove();
      return;
    }

    isMoving = true;
    graphicStep = step;
    gsap.to(graphicGallery, {
      x: getGraphicX(step),
      duration: GRAPHIC_DURATION,
      ease: GRAPHIC_EASE,
      overwrite: true,
      onComplete: unlockMove,
    });
  };

  const moveNext = () => {
    if (currentIndex === GRAPHIC_INDEX && graphicStep < GRAPHIC_MAX_STEP) {
      moveGraphic(graphicStep + 1);
      return;
    }
    const slider = sliderAtScreen(currentIndex);
    if (slider && slider.index < slider.panels.length - 1) {
      goToSlide(slider, slider.index + 1);
      return;
    }
    goToScreen(currentIndex + 1);
  };

  const movePrev = () => {
    if (currentIndex === GRAPHIC_INDEX && graphicStep > 0) {
      moveGraphic(graphicStep - 1);
      return;
    }
    const slider = sliderAtScreen(currentIndex);
    if (slider && slider.index > 0) {
      goToSlide(slider, slider.index - 1);
      return;
    }
    goToScreen(currentIndex - 1);
  };

  const handleWheel = (event) => {
    if (!isDesktop() || isModalOpen()) {
      return;
    }

    event.preventDefault();

    if (isMoving) {
      return;
    }

    if (event.deltaY > 0) {
      moveNext();
    } else if (event.deltaY < 0) {
      movePrev();
    }
  };

  const indexFromId = (id) => screens.findIndex((el) => el.id === id);

  const findPanelTarget = (id) => {
    for (const slider of projectSliders) {
      const panelIndex = slider.panels.findIndex((panel) => panel.id === id);
      if (panelIndex >= 0) {
        const screenIndex =
          slider === uiux ? UIUX_INDEX : PUBLISHING_INDEX;
        return { slider, panelIndex, screenIndex };
      }
    }
    return null;
  };

  const syncIndexFromScroll = () => {
    const y = window.scrollY + 8;
    let idx = 0;
    screens.forEach((el, i) => {
      if (y >= getScrollY(el) - 24) {
        idx = i;
      }
    });
    currentIndex = idx;
  };

  const handleNavClick = (event) => {
    if (!isDesktop()) {
      return;
    }

    const link = event.target.closest(".site-nav__link, .bottom-nav-item");
    if (!link) {
      return;
    }

    const href = link.getAttribute("href") || "";
    if (!href.startsWith("#")) {
      return;
    }

    const id = href.slice(1);
    const panelTarget = findPanelTarget(id);

    if (panelTarget) {
      event.preventDefault();
      if (isMoving) {
        return;
      }
      if (currentIndex === panelTarget.screenIndex) {
        goToSlide(panelTarget.slider, panelTarget.panelIndex);
      } else {
        panelTarget.slider.pending = panelTarget.panelIndex;
        goToScreen(panelTarget.screenIndex);
      }
      return;
    }

    const idx = indexFromId(id);
    if (idx < 0) {
      return;
    }

    event.preventDefault();
    if (isMoving) {
      return;
    }
    if (idx === UIUX_INDEX) {
      uiux.pending = 0;
    }
    if (idx === PUBLISHING_INDEX) {
      publishing.pending = 0;
    }
    goToScreen(idx);
  };

  const syncVisibleIndicator = () => {
    const slider = sliderAtScreen(currentIndex);
    if (slider) {
      moveSliderIndicator(slider, slider.index, true);
    }
  };

  const setupSliderNav = (slider) => {
    if (slider.section) {
      slider.section.classList.add("is-project-slider");
    }
    if (slider.nav && !slider.indicator) {
      slider.indicator = document.createElement("span");
      slider.indicator.className = "project-slide-indicator";
      slider.nav.appendChild(slider.indicator);
      slider.nav.classList.add("has-slide-indicator");
    }
  };

  const teardownSlider = (slider) => {
    if (slider.section) {
      slider.section.classList.remove("is-project-slider");
    }
    slider.panels.forEach((panel) => {
      gsap.killTweensOf(panel);
      gsap.set(panel, { clearProps: "transform,zIndex" });
      panel.style.pointerEvents = "";
    });
    if (slider.indicator) {
      gsap.killTweensOf(slider.indicator);
      slider.indicator.remove();
      slider.indicator = null;
    }
    slider.nav?.classList.remove("has-slide-indicator");
  };

  const mm = gsap.matchMedia();

  mm.add("(min-width: 1201px)", () => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return undefined;
    }

    projectSliders.forEach(setupSliderNav);
    syncIndexFromScroll();
    syncHeaderCompact(currentIndex);
    if (currentIndex === PROFILE_INDEX) {
      skillPlayTween = gsap.delayedCall(MOVE_DURATION, playSkillAnimation);
    } else {
      resetSkillAnimation();
    }
    layoutSliderPanels(uiux, uiux.index, true);
    layoutSliderPanels(publishing, publishing.index, true);
    window.addEventListener("wheel", handleWheel, { passive: false });
    document.addEventListener("click", handleNavClick, true);
    window.addEventListener("resize", syncVisibleIndicator);

    const observers = projectSliders
      .filter((slider) => slider.nav)
      .map((slider) => {
        const observer = new MutationObserver(syncVisibleIndicator);
        observer.observe(slider.nav, {
          attributes: true,
          attributeFilter: ["hidden"],
        });
        return observer;
      });

    return () => {
      window.removeEventListener("wheel", handleWheel);
      document.removeEventListener("click", handleNavClick, true);
      window.removeEventListener("resize", syncVisibleIndicator);
      observers.forEach((observer) => observer.disconnect());
      isMoving = false;
      graphicStep = 0;
      gsap.killTweensOf(window);
      if (graphicGallery) {
        gsap.killTweensOf(graphicGallery);
        gsap.set(graphicGallery, { x: 0 });
      }
      if (header) {
        gsap.killTweensOf(header);
        header.classList.remove("is-compact");
        gsap.set(header, {
          scale: 1,
          borderRadius: 0,
          boxShadow: "0 2px 16.4px rgba(69, 69, 69, 0.25)",
        });
      }
      resetSkillAnimation();
      projectSliders.forEach(teardownSlider);
    };
  });
}
