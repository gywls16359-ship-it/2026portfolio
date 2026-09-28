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
  const contactSection = document.getElementById("contact");
  const CONTACT_INDEX = screens.indexOf(contactSection);

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

  const isFullpage = () => window.matchMedia("(min-width: 1201px)").matches;

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
    document.querySelector(".skills-block")?.classList.remove("is-drawn");
    profileSection?.querySelectorAll(".skill-progress").forEach((el) => {
      el.style.transition = "none";
      el.style.strokeDashoffset = "314.16";
    });
  };

  const playSkillAnimation = () => {
    if (!profileSection || currentIndex !== PROFILE_INDEX) {
      return;
    }
    resetSkillAnimation();
    void profileSection.offsetWidth;
    requestAnimationFrame(() => {
      if (currentIndex !== PROFILE_INDEX) {
        return;
      }
      profileSection.querySelectorAll(".skill-progress").forEach((el) => {
        el.style.transition = "";
        el.style.strokeDashoffset = "";
      });
      profileSection.classList.add("skills-animate");
    });
  };

  const syncProfileSkills = (index) => {
    if (index !== PROFILE_INDEX) {
      resetSkillAnimation();
    }
  };

  const contactTitle = contactSection?.querySelector(".contact-title");
  const contactDesc = contactSection?.querySelector(".contact-desc");
  const contactRows = contactSection
    ? [...contactSection.querySelectorAll(".contact-row")]
    : [];
  const contactNameRow = contactRows[0];
  const contactEmailRow = contactRows[1];
  const contactPhoneRow = contactRows[2];
  const contactGithub = contactNameRow?.querySelector(".contact-github");
  let contactDescText = "";
  let contactTypeEl = null;
  let contactCursorEl = null;
  let contactDescReady = false;
  let contactIntroTween = null;

  const setupContactDesc = () => {
    if (!contactDesc || contactDescReady) {
      return;
    }
    contactDescText = contactDesc.textContent.trim();
    contactDesc.textContent = "";
    contactDesc.classList.add("is-measured");
    contactDesc.setAttribute("aria-label", contactDescText);

    const sizer = document.createElement("span");
    sizer.className = "contact-desc__sizer";
    sizer.setAttribute("aria-hidden", "true");
    sizer.textContent = contactDescText;

    const live = document.createElement("span");
    live.className = "contact-desc__live";
    live.setAttribute("aria-hidden", "true");

    contactTypeEl = document.createElement("span");
    contactTypeEl.className = "contact-desc__text";

    contactCursorEl = document.createElement("span");
    contactCursorEl.className = "contact-desc__cursor";
    contactCursorEl.setAttribute("aria-hidden", "true");
    contactCursorEl.textContent = "|";

    live.append(contactTypeEl, contactCursorEl);
    contactDesc.append(sizer, live);
    contactTypeEl.textContent = contactDescText;
    contactDescReady = true;
  };

  const hideContactIntro = () => {
    contactIntroTween?.kill();
    contactIntroTween = null;
    if (!contactDescReady) {
      return;
    }
    if (contactTitle) {
      gsap.set(contactTitle, { opacity: 0, y: 28 });
    }
    gsap.set([contactNameRow, contactEmailRow, contactPhoneRow, contactGithub], {
      opacity: 0,
      y: 20,
    });
    if (contactTypeEl) {
      contactTypeEl.textContent = contactDescText;
    }
    if (contactCursorEl) {
      gsap.set(contactCursorEl, { opacity: 0 });
    }
  };

  const playContactIntro = () => {
    if (!contactDescReady || !contactTitle || !contactNameRow || !contactEmailRow || !contactPhoneRow || !contactGithub) {
      return;
    }
    hideContactIntro();
    contactTypeEl.textContent = "";

    const chars = Array.from(contactDescText);
    const proxy = { count: 0 };
    const titleDuration = 0.6;
    const typeStart = 0.85;
    const charDuration = 0.045;
    const blinkHalf = 0.13;
    const tl = gsap.timeline();
    contactIntroTween = tl;

    tl.to(contactTitle, {
      opacity: 1,
      y: 0,
      duration: titleDuration,
      ease: "power3.out",
    });

    tl.set(contactCursorEl, { opacity: 1 }, typeStart - blinkHalf * 4);
    tl.to(contactCursorEl, { opacity: 0, duration: blinkHalf, ease: "none" }, typeStart - blinkHalf * 4);
    tl.to(contactCursorEl, { opacity: 1, duration: blinkHalf, ease: "none" });
    tl.to(contactCursorEl, { opacity: 0, duration: blinkHalf, ease: "none" });
    tl.to(contactCursorEl, { opacity: 1, duration: blinkHalf, ease: "none" });

    tl.to(proxy, {
      count: chars.length,
      duration: chars.length * charDuration,
      ease: "none",
      onUpdate: () => {
        contactTypeEl.textContent = chars.slice(0, Math.round(proxy.count)).join("");
      },
    }, typeStart);

    const typeEnd = typeStart + chars.length * charDuration;
    const infoStart = typeEnd + blinkHalf * 4 + 0.18;

    tl.to(contactCursorEl, { opacity: 0, duration: blinkHalf, ease: "none" }, typeEnd);
    tl.to(contactCursorEl, { opacity: 1, duration: blinkHalf, ease: "none" });
    tl.to(contactCursorEl, { opacity: 0, duration: blinkHalf, ease: "none" });
    tl.to(contactCursorEl, { opacity: 1, duration: blinkHalf, ease: "none" });
    tl.to(contactCursorEl, { opacity: 0, duration: 0.18, ease: "power1.out" });

    tl.to(contactNameRow, {
      opacity: 1,
      y: 0,
      duration: 0.4,
      ease: "power3.out",
    }, infoStart);
    tl.to(contactEmailRow, {
      opacity: 1,
      y: 0,
      duration: 0.4,
      ease: "power3.out",
    }, infoStart + 0.11);
    tl.to(contactPhoneRow, {
      opacity: 1,
      y: 0,
      duration: 0.4,
      ease: "power3.out",
    }, infoStart + 0.22);
    tl.to(contactGithub, {
      opacity: 1,
      y: 0,
      duration: 0.4,
      ease: "power3.out",
    }, infoStart + 0.33);
  };

  const restoreContactDesc = () => {
    contactIntroTween?.kill();
    contactIntroTween = null;
    if (contactTitle) {
      gsap.set(contactTitle, { clearProps: "opacity,transform" });
    }
    gsap.set([contactNameRow, contactEmailRow, contactPhoneRow, contactGithub].filter(Boolean), {
      clearProps: "opacity,transform",
    });
    if (!contactDesc || !contactDescReady) {
      return;
    }
    contactDesc.classList.remove("is-measured");
    contactDesc.removeAttribute("aria-label");
    contactDesc.textContent = contactDescText;
    contactDescReady = false;
    contactTypeEl = null;
    contactCursorEl = null;
  };

  const syncContactIntro = (index, previousIndex) => {
    if (!contactDescReady || index === CONTACT_INDEX || previousIndex !== CONTACT_INDEX) {
      return;
    }
    hideContactIntro();
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
    if (slider.arrows) {
      const [prev, next] = slider.arrows;
      prev.disabled = index <= 0;
      next.disabled = index >= slider.panels.length - 1;
    }
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

  const panelEntranceTweens = new WeakMap();

  const CLIP_HIDDEN = "inset(0 100% 0 0)";
  const CLIP_SHOW = "inset(0 0 0 0)";

  const panelEntranceParts = (panel) => ({
    titles: [
      panel.querySelector(".project-category"),
      panel.querySelector(".project-title"),
    ].filter(Boolean),
    details: [
      panel.querySelector(".project-subtitle"),
      panel.querySelector(".project-meta"),
    ].filter(Boolean),
    image: panel.querySelector(".project-visual img"),
    buttons: [...panel.querySelectorAll(".project-btn")],
    texture: panel.querySelector(".publishing-texture"),
  });

  const resetPanelEntrance = (panel) => {
    if (!panel) {
      return;
    }
    panelEntranceTweens.get(panel)?.kill();
    panelEntranceTweens.delete(panel);
    const { titles, details, image, buttons, texture } = panelEntranceParts(panel);
    gsap.set([...titles, ...details], { opacity: 0, y: 22 });
    gsap.set(buttons, { opacity: 0, y: 10 });
    if (image) {
      gsap.set(image, {
        clipPath: CLIP_HIDDEN,
        opacity: 1,
      });
    }
    if (texture) {
      gsap.set(texture, { opacity: 0 });
    }
  };

  const playPanelEntrance = (panel) => {
    if (!panel) {
      return;
    }
    const publishing = panel.closest(".section-publishing");
    const { titles, details, image, buttons, texture } = panelEntranceParts(panel);
    resetPanelEntrance(panel);
    const tl = gsap.timeline();
    panelEntranceTweens.set(panel, tl);
    tl.to(titles, {
      opacity: 1,
      y: 0,
      duration: 0.5,
      stagger: 0.08,
      ease: "power3.out",
    }, 0);
    if (details.length) {
      tl.to(details, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.08,
        ease: "power3.out",
      }, 0.12);
    }
    if (image) {
      tl.fromTo(image, {
        clipPath: CLIP_HIDDEN,
      }, {
        clipPath: CLIP_SHOW,
        duration: publishing ? 0.75 : 0.7,
        ease: "power3.inOut",
        immediateRender: false,
      }, 0.2);
    }
    if (texture) {
      tl.to(texture, {
        opacity: 0.58,
        duration: 0.7,
        ease: "power3.out",
      }, 0);
    }
    if (buttons.length) {
      tl.to(buttons, {
        opacity: 1,
        y: 0,
        duration: 0.38,
        stagger: 0.06,
        ease: "power3.out",
      }, 0.48);
    }
  };

  const clearPanelEntrance = (panel) => {
    if (!panel) {
      return;
    }
    panelEntranceTweens.get(panel)?.kill();
    panelEntranceTweens.delete(panel);
    const { titles, details, image, buttons, texture } = panelEntranceParts(panel);
    gsap.set([...titles, ...details], { clearProps: "opacity,transform" });
    gsap.set(buttons, { clearProps: "opacity,transform" });
    if (image) {
      gsap.set(image, { clearProps: "opacity,clipPath" });
    }
    if (texture) {
      gsap.set(texture, { clearProps: "opacity" });
    }
  };

  const syncSliderEntrances = (slider, screenIndex) => {
    slider.panels.forEach((panel, i) => {
      if (currentIndex === screenIndex && i === slider.index) {
        playPanelEntrance(panel);
      } else {
        resetPanelEntrance(panel);
      }
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
      isModalOpen() ||
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
    resetPanelEntrance(nextPanel);
    if (!isFullpage()) {
      playPanelEntrance(nextPanel);
    }

    gsap.to(currentPanel, {
      xPercent: -100 * dir,
      duration: SLIDE_DURATION,
      ease: MOVE_EASE,
      overwrite: true,
      onComplete: () => resetPanelEntrance(currentPanel),
    });

    gsap.to(nextPanel, {
      xPercent: 0,
      duration: SLIDE_DURATION,
      ease: MOVE_EASE,
      overwrite: true,
      onComplete: () => {
        if (isFullpage()) {
          playPanelEntrance(nextPanel);
        }
        unlockMove();
      },
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
    syncProfileSkills(index);
    syncContactIntro(index, previousIndex);

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
        if (index === PROFILE_INDEX) {
          playSkillAnimation();
        }
        if (index === CONTACT_INDEX && previousIndex !== CONTACT_INDEX) {
          playContactIntro();
        }
        if (previousIndex === UIUX_INDEX && index !== UIUX_INDEX) {
          uiux.panels.forEach(resetPanelEntrance);
        }
        if (previousIndex === PUBLISHING_INDEX && index !== PUBLISHING_INDEX) {
          publishing.panels.forEach(resetPanelEntrance);
        }
        if (
          (index === UIUX_INDEX || index === PUBLISHING_INDEX) &&
          previousIndex !== index
        ) {
          const arrived = sliderAtScreen(index);
          arrived?.panels.forEach((panel, i) => {
            if (i === arrived.index) {
              playPanelEntrance(panel);
            } else {
              resetPanelEntrance(panel);
            }
          });
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
    if (!isFullpage() || isModalOpen()) {
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
    if (!isFullpage() || isModalOpen()) {
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

  const arrowSvg = (dir) =>
    `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="${
      dir === "prev" ? "M15 5L8 12l7 7" : "M9 5l7 7-7 7"
    }" stroke="#ffffff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

  const setupMobileArrows = (slider) => {
    if (!slider.section || slider.arrows) {
      return;
    }
    const prev = document.createElement("button");
    const next = document.createElement("button");
    prev.type = "button";
    next.type = "button";
    prev.className = "project-slide-arrow project-slide-arrow--prev";
    next.className = "project-slide-arrow project-slide-arrow--next";
    prev.setAttribute("aria-label", "이전 프로젝트");
    next.setAttribute("aria-label", "다음 프로젝트");
    prev.innerHTML = arrowSvg("prev");
    next.innerHTML = arrowSvg("next");
    prev.addEventListener("click", () => goToSlide(slider, slider.index - 1));
    next.addEventListener("click", () => goToSlide(slider, slider.index + 1));
    slider.section.append(prev, next);
    slider.arrows = [prev, next];
    setSliderNavActive(slider, slider.index);
  };

  const teardownMobileArrows = (slider) => {
    slider.arrows?.forEach((btn) => btn.remove());
    slider.arrows = null;
  };

  const bindSliderSwipe = (slider) => {
    if (!slider.section) {
      return () => {};
    }
    let startX = 0;
    let startY = 0;
    let tracking = false;

    const onStart = (event) => {
      const touch = event.changedTouches[0];
      startX = touch.clientX;
      startY = touch.clientY;
      tracking = true;
    };

    const onEnd = (event) => {
      if (!tracking || isModalOpen()) {
        tracking = false;
        return;
      }
      tracking = false;
      const touch = event.changedTouches[0];
      const dx = touch.clientX - startX;
      const dy = touch.clientY - startY;
      if (Math.abs(dx) < 48 || Math.abs(dx) < Math.abs(dy) * 1.15) {
        return;
      }
      if (dx < 0) {
        goToSlide(slider, slider.index + 1);
      } else {
        goToSlide(slider, slider.index - 1);
      }
    };

    slider.section.addEventListener("touchstart", onStart, { passive: true });
    slider.section.addEventListener("touchend", onEnd, { passive: true });

    return () => {
      slider.section.removeEventListener("touchstart", onStart);
      slider.section.removeEventListener("touchend", onEnd);
    };
  };

  const mm = gsap.matchMedia();

  mm.add("(min-width: 1201px)", () => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return undefined;
    }

    projectSliders.forEach(setupSliderNav);
    syncIndexFromScroll();
    syncHeaderCompact(currentIndex);
    setupContactDesc();
    if (currentIndex === CONTACT_INDEX) {
      playContactIntro();
    } else {
      hideContactIntro();
    }
    if (currentIndex === PROFILE_INDEX) {
      playSkillAnimation();
    } else {
      resetSkillAnimation();
    }
    layoutSliderPanels(uiux, uiux.index, true);
    layoutSliderPanels(publishing, publishing.index, true);
    syncSliderEntrances(uiux, UIUX_INDEX);
    syncSliderEntrances(publishing, PUBLISHING_INDEX);
    const unbindSwipes = projectSliders.map(bindSliderSwipe);
    window.addEventListener("wheel", handleWheel, { passive: false });
    document.addEventListener("click", handleNavClick, true);
    window.addEventListener("resize", syncVisibleIndicator);

    let touchStartY = 0;
    let touchStartX = 0;
    const handleTouchStart = (event) => {
      const touch = event.changedTouches[0];
      touchStartX = touch.clientX;
      touchStartY = touch.clientY;
    };
    const handleTouchEnd = (event) => {
      if (!isFullpage() || isModalOpen() || isMoving) {
        return;
      }
      const touch = event.changedTouches[0];
      const dx = touch.clientX - touchStartX;
      const dy = touch.clientY - touchStartY;
      if (Math.abs(dy) < 56 || Math.abs(dy) < Math.abs(dx) * 1.1) {
        return;
      }
      if (dy > 0) {
        movePrev();
      } else {
        moveNext();
      }
    };
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });

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
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
      observers.forEach((observer) => observer.disconnect());
      unbindSwipes.forEach((unbind) => unbind());
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
      restoreContactDesc();
      projectSliders.forEach((slider) => {
        slider.panels.forEach(clearPanelEntrance);
        teardownSlider(slider);
      });
    };
  });

  mm.add("(max-width: 768px)", () => {
    projectSliders.forEach((slider) => {
      slider.section?.classList.add("is-project-slider");
      setupMobileArrows(slider);
      slider.index = 0;
      layoutSliderPanels(slider, 0, true);
    });

    const unbinds = projectSliders.map(bindSliderSwipe);

    return () => {
      unbinds.forEach((unbind) => unbind());
      isMoving = false;
      projectSliders.forEach((slider) => {
        slider.panels.forEach(clearPanelEntrance);
        teardownMobileArrows(slider);
        teardownSlider(slider);
      });
    };
  });
}
