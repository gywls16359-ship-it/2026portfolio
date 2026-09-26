const uiuxNav = document.querySelector('[data-nav="uiux"]');
const publishingNav = document.querySelector('[data-nav="publishing"]');
const uiuxSection = document.getElementById("uiux");
const publishingSection = document.getElementById("publishing");

const isMobile = () => window.matchMedia("(max-width: 768px)").matches;

const showNav = (nav) => {
  if (!nav || isMobile()) {
    return;
  }
  nav.hidden = false;
};

const hideNav = (nav) => {
  if (!nav) {
    return;
  }
  nav.hidden = true;
};

const updateActiveProject = (nav) => {
  if (!nav || nav.hidden) {
    return;
  }

  if (
    (nav.dataset.nav === "uiux" || nav.dataset.nav === "publishing") &&
    window.matchMedia("(min-width: 1201px)").matches
  ) {
    return;
  }

  const items = [...nav.querySelectorAll(".bottom-nav-item")];
  const y = window.scrollY + window.innerHeight / 2;
  let active = items[0];

  items.forEach((item) => {
    const id = item.getAttribute("href")?.slice(1);
    const panel = id ? document.getElementById(id) : null;
    if (panel && y >= panel.offsetTop) {
      active = item;
    }
  });

  items.forEach((item) => {
    item.classList.toggle("is-active", item === active);
  });
};

const updateProjectNavVisibility = () => {
  if (isMobile()) {
    hideNav(uiuxNav);
    hideNav(publishingNav);
    return;
  }

  const y = window.scrollY + window.innerHeight / 2;
  const uiuxTop = uiuxSection ? uiuxSection.offsetTop : 0;
  const uiuxBottom = uiuxSection ? uiuxTop + uiuxSection.offsetHeight : 0;
  const pubTop = publishingSection ? publishingSection.offsetTop : 0;
  const pubBottom = publishingSection ? pubTop + publishingSection.offsetHeight : 0;

  if (y >= uiuxTop && y < uiuxBottom) {
    showNav(uiuxNav);
    hideNav(publishingNav);
    updateActiveProject(uiuxNav);
  } else if (y >= pubTop && y < pubBottom) {
    showNav(publishingNav);
    hideNav(uiuxNav);
    updateActiveProject(publishingNav);
  } else {
    hideNav(uiuxNav);
    hideNav(publishingNav);
  }
};

window.addEventListener("scroll", updateProjectNavVisibility, { passive: true });
window.addEventListener("resize", updateProjectNavVisibility);
updateProjectNavVisibility();
