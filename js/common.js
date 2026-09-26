const header = document.querySelector(".site-header");
const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-nav");
const navLinks = document.querySelectorAll(".site-nav__link");

navLinks.forEach((link) => {
  const label = (link.dataset.label || link.textContent).trim();
  if (!link.getAttribute("aria-label")) {
    link.setAttribute("aria-label", label);
  }

  const charsWrap = document.createElement("span");
  charsWrap.className = "nav-chars";
  charsWrap.setAttribute("aria-hidden", "true");

  Array.from(label).forEach((ch, index) => {
    const char = document.createElement("span");
    char.className = "char";
    char.dataset.char = ch;
    char.style.setProperty("--char-index", String(index));
    char.textContent = ch;
    charsWrap.appendChild(char);
  });

  link.textContent = "";
  link.appendChild(charsWrap);
});

if (menuToggle && siteNav) {
  menuToggle.addEventListener("click", () => {
    const open = siteNav.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(open));
  });
}

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    if (siteNav) {
      siteNav.classList.remove("is-open");
    }
    if (menuToggle) {
      menuToggle.setAttribute("aria-expanded", "false");
    }
  });
});

const sectionIds = ["profile", "graphic", "uiux", "publishing", "contact"];
const sections = sectionIds
  .map((id) => document.getElementById(id))
  .filter(Boolean);

const getSectionTop = (section) => {
  const marker = section.closest(".pin-spacer") || section;
  return marker.getBoundingClientRect().top + window.scrollY;
};

const setActiveLink = () => {
  const offset = (header ? header.offsetHeight : 100) + 8;
  let current = "";

  sections.forEach((section) => {
    if (window.scrollY >= getSectionTop(section) - offset) {
      current = section.id;
    }
  });

  navLinks.forEach((link) => {
    const href = link.getAttribute("href");
    link.classList.toggle("is-active", href === `#${current}`);
  });
};

window.addEventListener("scroll", setActiveLink, { passive: true });
setActiveLink();

const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

const revealItems = (root) => {
  root.querySelectorAll(".reveal").forEach((el) => {
    el.classList.add("is-visible");
  });
};

if (prefersReducedMotion) {
  document.querySelectorAll(".reveal").forEach((el) => {
    el.classList.add("is-visible");
  });
  document.querySelector(".skills-block")?.classList.add("is-drawn");
} else {
  const revealRoots = [document.querySelector(".section-graphic")].filter(
    Boolean
  );

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }
        revealItems(entry.target);
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.16,
      rootMargin: "0px 0px -8% 0px",
    }
  );

  revealRoots.forEach((root) => revealObserver.observe(root));

  const skillsBlock = document.querySelector(".skills-block");
  const isDesktopFullpage = window.matchMedia("(min-width: 1201px)").matches;
  if (skillsBlock && !isDesktopFullpage) {
    const skillsObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }
          skillsBlock.classList.add("is-drawn");
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.25,
      }
    );
    skillsObserver.observe(skillsBlock);
  }
}
