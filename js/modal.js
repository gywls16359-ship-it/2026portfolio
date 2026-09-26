const modal = document.querySelector(".detail-modal");
const overlay = modal?.querySelector(".modal-overlay");
const closeBtn = modal?.querySelector(".modal-close");
const prevBtn = modal?.querySelector(".modal-prev");
const nextBtn = modal?.querySelector(".modal-next");
const content = modal?.querySelector(".modal-content");
const image = modal?.querySelector(".modal-image");

let savedScrollY = 0;
let currentTrigger = null;

const getTriggers = () => [...document.querySelectorAll("[data-detail]")];

const getGroup = (category) =>
  getTriggers().filter((el) => el.dataset.category === category);

const triggerLabel = (trigger) => {
  if (!trigger) {
    return "";
  }
  const named = trigger.querySelector(".graphic-name, .project-title");
  if (named) {
    return named.textContent.trim();
  }
  const panel = trigger.closest(".project-panel");
  const title = panel?.querySelector(".project-title");
  return title ? title.textContent.trim() : "";
};

const updateNav = (trigger) => {
  const group = getGroup(trigger.dataset.category);
  const index = group.indexOf(trigger);
  prevBtn.hidden = index <= 0;
  nextBtn.hidden = index < 0 || index >= group.length - 1;
};

const showDetail = (trigger) => {
  if (!trigger || !image || !content) {
    return;
  }
  currentTrigger = trigger;
  image.src = trigger.dataset.detail;
  image.alt = triggerLabel(trigger);
  content.scrollTop = 0;
  updateNav(trigger);
};

const onTouchMove = (event) => {
  if (!content || !content.contains(event.target)) {
    event.preventDefault();
    return;
  }
  if (content.scrollHeight <= content.clientHeight) {
    event.preventDefault();
  }
};

const lockPageScroll = () => {
  savedScrollY = window.scrollY;
  document.documentElement.style.overflow = "hidden";
  document.body.style.overflow = "hidden";
  document.body.style.position = "fixed";
  document.body.style.top = `-${savedScrollY}px`;
  document.body.style.left = "0";
  document.body.style.right = "0";
  document.body.style.width = "100%";
  document.addEventListener("touchmove", onTouchMove, { passive: false });
};

const unlockPageScroll = () => {
  document.removeEventListener("touchmove", onTouchMove);
  document.documentElement.style.overflow = "";
  document.body.style.overflow = "";
  document.body.style.position = "";
  document.body.style.top = "";
  document.body.style.left = "";
  document.body.style.right = "";
  document.body.style.width = "";
  window.scrollTo(0, savedScrollY);
};

const openModal = (trigger) => {
  if (!modal || !trigger?.dataset.detail) {
    return;
  }
  lockPageScroll();
  modal.hidden = false;
  showDetail(trigger);
};

const closeModal = () => {
  if (!modal || modal.hidden) {
    return;
  }
  modal.hidden = true;
  currentTrigger = null;
  unlockPageScroll();
};

const moveInCategory = (step) => {
  if (!currentTrigger) {
    return;
  }
  const group = getGroup(currentTrigger.dataset.category);
  const index = group.indexOf(currentTrigger);
  const next = group[index + step];
  if (next) {
    showDetail(next);
  }
};

document.addEventListener("click", (event) => {
  const trigger = event.target.closest("[data-detail]");
  if (trigger && !modal?.contains(trigger)) {
    event.preventDefault();
    openModal(trigger);
  }
});

overlay?.addEventListener("click", closeModal);
closeBtn?.addEventListener("click", closeModal);
prevBtn?.addEventListener("click", () => moveInCategory(-1));
nextBtn?.addEventListener("click", () => moveInCategory(1));

document.addEventListener("keydown", (event) => {
  if (modal?.hidden) {
    return;
  }
  if (event.key === "Escape") {
    closeModal();
  } else if (event.key === "ArrowLeft") {
    moveInCategory(-1);
  } else if (event.key === "ArrowRight") {
    moveInCategory(1);
  }
});
