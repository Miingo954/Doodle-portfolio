const phrases = ["interfaces that move.", "stories people feel.", "ideas that work."];
const typeLine = document.querySelector(".type-line");
const loader = document.querySelector(".loader");
const loaderCount = document.querySelector(".loader__count");
const loaderBar = document.querySelector(".loader__track span");
const mascot = document.querySelector(".mascot-card");
const mascotBubble = document.querySelector(".mascot-bubble");
const recallMascotButton = document.querySelector(".recall-mascot");
const mascotStops = [
  {
    section: document.querySelector("#home"),
    position: "home",
    message: "I’m Lil’ Jam, your tiny tour guide! Don’t scroll too fast my coffee might spill. I’m kind of a klutz. ☕",
  },
  {
    section: document.querySelector("#work"),
    position: "work",
    message: "This is the workbench. Six projects built with React, APIs, and a lot of curiosity.",
  },
  {
    section: document.querySelector("#process"),
    position: "process",
    message: "Want to see how Jamal builds? Press run. If a bug appears, do not let me handle it. Probably.",
  },
  {
    section: document.querySelector("#about"),
    position: "about",
    message: "Here’s the human behind the code: experience, tools, people, and places.",
  },
  {
    section: document.querySelector("#contact"),
    position: "contact",
    message: "Made it! If something sparked an idea, this is where we can start a conversation.",
  },
];

let activeMascotStop = "";
let mascotIntroductionTimer = 0;
let lilMalPrankTimer = 0;
let lilMalPrankRunning = false;
let lilMalPrankFinished = false;
let mascotFlightFrame = 0;
let mascotIdleTimer = 0;
let mascotTipTimer = 0;
let mascotBlinkCount = 0;
let mascotIdleFaceTimer = 0;
const workHeading = document.querySelector(".section-intro h2");
const originalWorkHeading = workHeading?.innerHTML || "";

function getCurrentMascotStop() {
  return mascotStops.find((stop) => stop.position === activeMascotStop) || mascotStops[0];
}

function restoreMascotGuide(delay = 0) {
  window.clearTimeout(mascotTipTimer);
  const restore = () => {
    if (mascot.classList.contains("is-dragging") || mascot.classList.contains("is-flying")) return;
    mascotBubble.textContent = getCurrentMascotStop().message;
    mascot.classList.remove("is-reacting", "is-idle");
  };
  if (delay) mascotTipTimer = window.setTimeout(restore, delay);
  else restore();
}

if ("scrollRestoration" in history) history.scrollRestoration = "manual";

let phraseIndex = 0;
let letterIndex = 0;
let deleting = false;

function typeNext() {
  const phrase = phrases[phraseIndex];
  letterIndex += deleting ? -1 : 1;
  typeLine.textContent = phrase.slice(0, letterIndex);
  let delay = deleting ? 38 : 72;

  if (!deleting && letterIndex === phrase.length) {
    deleting = true;
    delay = 1200;
  } else if (deleting && letterIndex === 0) {
    deleting = false;
    phraseIndex = (phraseIndex + 1) % phrases.length;
    delay = 300;
  }

  window.setTimeout(typeNext, delay);
}

function runLoader() {
  const startedAt = performance.now();
  const duration = 1450;

  function update(now) {
    const progress = Math.min((now - startedAt) / duration, 1);
    const value = Math.round((1 - Math.pow(1 - progress, 3)) * 100);
    loaderCount.textContent = String(value).padStart(2, "0");
    loaderBar.style.width = `${value}%`;

    if (progress < 1) {
      requestAnimationFrame(update);
      return;
    }

    window.setTimeout(() => {
      loader.classList.add("is-gone");
      typeNext();
    }, 220);
  }

  requestAnimationFrame(update);
}

function stopMascotFlight() {
  if (mascotFlightFrame) window.cancelAnimationFrame(mascotFlightFrame);
  mascotFlightFrame = 0;
  mascot.classList.remove("is-flying");
}

function scheduleMascotIdle() {
  window.clearTimeout(mascotIdleTimer);
  mascot.classList.remove("is-idle");
  mascotIdleTimer = window.setTimeout(() => {
    if (!mascot.matches(":hover") && !mascot.classList.contains("is-dragging") && !mascot.classList.contains("is-flying")) {
      mascotBubble.textContent = getCurrentMascotStop().message;
    }
  }, 6500);
}

function launchMascot(startVelocityX, startVelocityY) {
  stopMascotFlight();
  window.clearTimeout(mascotIdleTimer);
  let x = Number(mascot.dataset.x || 0);
  let y = Number(mascot.dataset.y || 0);
  let velocityX = Math.max(-34, Math.min(34, startVelocityX));
  let velocityY = Math.max(-34, Math.min(34, startVelocityY));
  let lastTime = performance.now();
  let bounceCount = 0;
  const startedAt = lastTime;
  mascot.classList.remove("is-idle", "is-blinking", "is-reacting");
  mascot.classList.add("is-flying", "is-introducing");
  mascot.dataset.suppressPrankClick = "true";
  mascotBubble.textContent = "Yep, I react—you can throw me too!";

  function fly(now) {
    const frameScale = Math.min((now - lastTime) / 16.67, 2);
    lastTime = now;
    velocityX *= Math.pow(0.992, frameScale);
    velocityY *= Math.pow(0.992, frameScale);
    x += velocityX * frameScale;
    y += velocityY * frameScale;

    const rect = mascot.getBoundingClientRect();
    const baseLeft = rect.left - Number(mascot.dataset.x || 0);
    const baseTop = rect.top - Number(mascot.dataset.y || 0);
    const edge = 8;
    const minX = edge - baseLeft;
    const maxX = window.innerWidth - edge - baseLeft - rect.width;
    const minY = edge - baseTop;
    const maxY = window.innerHeight - edge - baseTop - rect.height;

    if (x <= minX || x >= maxX) {
      x = Math.max(minX, Math.min(maxX, x));
      velocityX *= -0.94;
      bounceCount += 1;
    }
    if (y <= minY || y >= maxY) {
      y = Math.max(minY, Math.min(maxY, y));
      velocityY *= -0.94;
      bounceCount += 1;
    }

    mascot.dataset.x = x;
    mascot.dataset.y = y;
    mascot.style.translate = `${x}px ${y}px`;
    mascot.style.rotate = `${Math.max(-7, Math.min(7, velocityX * 0.18))}deg`;

    const speed = Math.hypot(velocityX, velocityY);
    if ((bounceCount > 3 && speed < 0.9) || now - startedAt > 8000) {
      mascotFlightFrame = 0;
      mascot.classList.remove("is-flying");
      mascot.style.rotate = `${(Math.random() - 0.5) * 10}deg`;
      mascotBubble.textContent = "Yep, I react. Drag me around—or throw me again!";
      window.setTimeout(() => {
        mascot.classList.remove("is-introducing");
        delete mascot.dataset.suppressPrankClick;
        scheduleMascotIdle();
      }, 5000);
      return;
    }
    mascotFlightFrame = window.requestAnimationFrame(fly);
  }

  mascotFlightFrame = window.requestAnimationFrame(fly);
}

function enableDragging(element) {
  let startX = 0;
  let startY = 0;
  let originX = 0;
  let originY = 0;
  let moved = false;
  let dragging = false;
  let frame = 0;
  let nextX = 0;
  let nextY = 0;
  let lastPointerX = 0;
  let lastPointerY = 0;
  let lastPointerTime = 0;
  let throwVelocityX = 0;
  let throwVelocityY = 0;

  function paintPosition() {
    if (element === mascot) {
      const rect = mascot.getBoundingClientRect();
      const currentX = Number(mascot.dataset.x || 0);
      const currentY = Number(mascot.dataset.y || 0);
      const baseLeft = rect.left - currentX;
      const baseTop = rect.top - currentY;
      const edge = 8;
      nextX = Math.max(edge - baseLeft, Math.min(window.innerWidth - edge - baseLeft - rect.width, nextX));
      nextY = Math.max(edge - baseTop, Math.min(window.innerHeight - edge - baseTop - rect.height, nextY));
    }
    element.dataset.x = nextX;
    element.dataset.y = nextY;
    element.style.translate = `${nextX}px ${nextY}px`;
    frame = 0;
  }

  function finishDrag(event) {
    if (frame) {
      cancelAnimationFrame(frame);
      paintPosition();
    }
    if (element.hasPointerCapture(event.pointerId)) element.releasePointerCapture(event.pointerId);
    element.classList.remove("is-dragging");
    dragging = false;
    if (element === mascot) {
      mascotBubble.textContent = moved
        ? "Yep, I react. Drag me around—or you can throw me too!"
        : "Try dragging me too.";
      if (moved) {
        mascot.dataset.suppressPrankClick = "true";
        if (Math.hypot(throwVelocityX, throwVelocityY) > 4) {
          launchMascot(throwVelocityX, throwVelocityY);
        } else {
          window.setTimeout(() => delete mascot.dataset.suppressPrankClick, 0);
          scheduleMascotIdle();
        }
      } else {
        scheduleMascotIdle();
      }
    }
    if (moved && element.classList.contains("life-photo")) {
      element.dataset.justDragged = "true";
      window.setTimeout(() => delete element.dataset.justDragged, 0);
    }
  }

  element.addEventListener("pointerdown", (event) => {
    if (event.target.closest("a")) return;
    event.preventDefault();
    element.setPointerCapture(event.pointerId);
    startX = event.clientX;
    startY = event.clientY;
    originX = Number(element.dataset.x || 0);
    originY = Number(element.dataset.y || 0);
    nextX = originX;
    nextY = originY;
    moved = false;
    dragging = false;
    lastPointerX = event.clientX;
    lastPointerY = event.clientY;
    lastPointerTime = performance.now();
    throwVelocityX = 0;
    throwVelocityY = 0;
    if (element === mascot) {
      stopMascotFlight();
      window.clearTimeout(mascotIdleTimer);
      mascot.classList.remove("is-idle", "is-blinking");
      mascot.style.rotate = "0deg";
    }
  });

  element.addEventListener("pointermove", (event) => {
    if (!element.hasPointerCapture(event.pointerId)) return;
    const pointerNow = performance.now();
    const pointerDeltaTime = Math.max(pointerNow - lastPointerTime, 8);
    throwVelocityX = ((event.clientX - lastPointerX) / pointerDeltaTime) * 16.67;
    throwVelocityY = ((event.clientY - lastPointerY) / pointerDeltaTime) * 16.67;
    lastPointerX = event.clientX;
    lastPointerY = event.clientY;
    lastPointerTime = pointerNow;
    const deltaX = event.clientX - startX;
    const deltaY = event.clientY - startY;
    if (!dragging && Math.hypot(deltaX, deltaY) < 7) return;
    if (!dragging) {
      dragging = true;
      moved = true;
      element.classList.add("is-dragging");
      if (element === mascot) mascotBubble.textContent = "Okay, where are we going?";
    }
    nextX = originX + deltaX;
    nextY = originY + deltaY;
    if (!frame) frame = requestAnimationFrame(paintPosition);
  });

  element.addEventListener("pointerup", finishDrag);
  element.addEventListener("pointercancel", finishDrag);
  element.addEventListener("dragstart", (event) => event.preventDefault());
}

document.querySelectorAll("[data-draggable]").forEach(enableDragging);

function recallMascot() {
  stopMascotFlight();
  window.clearTimeout(mascotIdleTimer);
  mascot.dataset.x = "0";
  mascot.dataset.y = "0";
  mascot.dataset.stop = "home";
  mascot.style.translate = "0px 0px";
  mascot.style.rotate = "0deg";
  mascot.classList.remove("is-dragging", "is-idle", "is-flying", "is-cleaning");
  mascot.classList.add("is-introducing", "is-reacting");
  mascotBubble.textContent = "I’m back! Drag me around—or you can throw me too.";
  window.setTimeout(() => {
    mascot.classList.remove("is-introducing", "is-reacting");
    scheduleMascotIdle();
  }, 7000);
}

recallMascotButton?.addEventListener("click", recallMascot);
window.addEventListener("resize", () => {
  const rect = mascot.getBoundingClientRect();
  if (rect.right < 8 || rect.left > window.innerWidth - 8 || rect.bottom < 8 || rect.top > window.innerHeight - 8) recallMascot();
});

const memoryDesk = document.querySelector(".memory-desk");
const memoryPhotos = [...document.querySelectorAll(".life-photo")];
const memoryViewer = document.querySelector(".memory-viewer");
const memoryViewerImage = memoryViewer?.querySelector("img");
const memoryViewerNote = memoryViewer?.querySelector("p");
const memoryNotes = [
  "A little Disney magic.", "Good food, better company.", "The tiny boss of the house.",
  "London in the rain.", "Worth stopping for the view.", "Celebrating in full color.",
  "Road-trip energy.", "Two friends, one very rainy afternoon.", "Still got it… mostly.",
  "The jacket understood the assignment.", "Theme-park days hit different.",
  "Cleaned up pretty well.", "Outside with the day ones.",
  "Just us, somewhere worth remembering.", "A quiet minute under the trees.",
];

memoryPhotos.forEach((photo, index) => {
  photo.style.setProperty("--memory-delay", `${index * 70}ms`);
  photo.dataset.memory = memoryNotes[index] || "A good one for the memory box.";
  const back = document.createElement("span");
  back.className = "life-photo__back";
  back.textContent = photo.dataset.memory;
  photo.append(back);

  let clickTimer = 0;
  photo.addEventListener("click", () => {
    if (photo.dataset.justDragged === "true" || photo.classList.contains("is-flipped")) return;
    window.clearTimeout(clickTimer);
    clickTimer = window.setTimeout(() => {
      memoryViewerImage.src = photo.querySelector("img").src;
      memoryViewerImage.alt = photo.querySelector("img").alt;
      memoryViewerNote.textContent = photo.dataset.memory;
      memoryViewer.showModal();
    }, 230);
  });
  photo.addEventListener("dblclick", (event) => {
    event.preventDefault();
    window.clearTimeout(clickTimer);
    photo.classList.toggle("is-flipped");
  });
});

function layoutMemoryPile() {
  if (!memoryDesk) return;
  window.requestAnimationFrame(() => {
    const deskCenterX = memoryDesk.clientWidth / 2;
    const deskCenterY = Math.min(memoryDesk.clientHeight / 2, 290);
    memoryPhotos.forEach((photo, index) => {
      const pileX = Math.round(deskCenterX - (photo.offsetLeft + photo.offsetWidth / 2));
      const pileY = Math.round(deskCenterY - (photo.offsetTop + photo.offsetHeight / 2));
      photo.style.setProperty("--pile-x", `${pileX}px`);
      photo.style.setProperty("--pile-y", `${pileY}px`);
      photo.dataset.pileX = pileX;
      photo.dataset.pileY = pileY;
      photo.dataset.x = pileX;
      photo.dataset.y = pileY;
      photo.style.zIndex = String(index + 1);
      if (!memoryDesk.classList.contains("is-scattered")) {
        photo.style.translate = `${pileX}px ${pileY}px`;
        photo.style.rotate = `${((index * 5) % 15) - 7}deg`;
      }
    });
  });
}

if (memoryDesk) {
  layoutMemoryPile();
  memoryPhotos.forEach((photo) => photo.querySelector("img")?.addEventListener("load", layoutMemoryPile, { once: true }));
  const memoryObserver = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) return;
    mascotBubble.textContent = "Uh… I left the photos in a pile. Hit the button when you want me to arrange them.";
    mascot.classList.add("is-introducing");
    window.clearTimeout(mascotIntroductionTimer);
    mascotIntroductionTimer = window.setTimeout(() => mascot.classList.remove("is-introducing"), 16000);
    memoryObserver.disconnect();
  }, { threshold: 0.16 });
  memoryObserver.observe(memoryDesk);
}

let memoryResizeFrame = 0;
window.addEventListener("resize", () => {
  window.cancelAnimationFrame(memoryResizeFrame);
  memoryResizeFrame = window.requestAnimationFrame(layoutMemoryPile);
});

function toggleMemoryLayout() {
  const arrangeButton = document.querySelector(".organize-memories");
  const isExpanded = memoryDesk.classList.contains("is-scattered");

  if (isExpanded) {
    memoryDesk.classList.remove("is-scattered");
    memoryPhotos.forEach((photo, index) => {
      const pileX = Number(photo.dataset.pileX || 0);
      const pileY = Number(photo.dataset.pileY || 0);
      photo.classList.remove("is-flipped");
      photo.dataset.x = pileX;
      photo.dataset.y = pileY;
      photo.style.translate = `${pileX}px ${pileY}px`;
      photo.style.rotate = `${((index * 5) % 15) - 7}deg`;
      photo.style.zIndex = String(index + 1);
    });
    arrangeButton.textContent = "Arrange the photos";
    arrangeButton.setAttribute("aria-expanded", "false");
    mascotBubble.textContent = "Back in the pile! Hit Arrange whenever you want the full gallery again.";
    mascot.classList.add("is-reacting", "is-introducing");
    window.setTimeout(() => mascot.classList.remove("is-reacting", "is-introducing"), 7000);
    return;
  }

  memoryDesk.classList.add("is-scattered");
  memoryPhotos.forEach((photo, index) => {
    const angle = ((index * 7) % 11) - 5;
    const x = ((index * 29) % 31) - 15;
    const y = ((index * 17) % 23) - 11;
    photo.classList.remove("is-flipped");
    photo.dataset.x = x;
    photo.dataset.y = y;
    photo.style.translate = `${x}px ${y}px`;
    photo.style.rotate = `${angle}deg`;
  });
  arrangeButton.textContent = "Bunch them up";
  arrangeButton.setAttribute("aria-expanded", "true");
  mascotBubble.textContent = "Ta-da! The full gallery is open. You can drag, open, or flip every photo.";
  mascot.classList.add("is-reacting", "is-introducing");
  window.setTimeout(() => mascot.classList.remove("is-reacting", "is-introducing"), 6000);
}

const organizeMemoryButton = document.querySelector(".organize-memories");
organizeMemoryButton?.addEventListener("pointerdown", (event) => {
  event.preventDefault();
  toggleMemoryLayout();
});
organizeMemoryButton?.addEventListener("click", (event) => {
  if (event.detail === 0) toggleMemoryLayout();
});

memoryViewer?.querySelector(".memory-viewer__close")?.addEventListener("click", () => memoryViewer.close());
memoryViewer?.addEventListener("click", (event) => {
  if (event.target === memoryViewer) memoryViewer.close();
});

const buildLab = document.querySelector(".build-lab");
const runBuildButton = document.querySelector(".run-build");
const buildStatus = document.querySelector(".build-status");
const buildReceipt = document.querySelector(".build-receipt");
const superDebug = document.querySelector(".super-debug");
const arcadeMarquee = document.querySelector(".arcade-marquee");
const bugHuntWelcome = document.querySelector(".bug-hunt__welcome");
const debugBugs = [...document.querySelectorAll("[data-debug-bug]")];
const debugCount = document.querySelector(".debug-count");
const debugInstruction = document.querySelector(".debug-instruction");
const safariNetBugs = document.querySelector(".safari-net-bugs");
const safariTime = document.querySelector(".safari-time");
const safariBest = document.querySelector(".safari-best");
const safariRecord = document.querySelector(".safari-record");
const safariCatchButton = document.querySelector(".safari-catch-button");
const SAFARI_BEST_KEY = "lil-jam-safari-best-time";
let buildTimers = [];
let debugActive = false;
let bugsRemaining = debugBugs.length;
let safariTimerFrame = 0;
let safariStartedAt = 0;
let safariElapsed = 0;
let aimedBug = null;

function positionSafariNetPocket() {
  if (!superDebug || !safariNetBugs) return;
  const jam = superDebug.querySelector(superDebug.classList.contains("is-catching") ? ".safari-jam--catch" : ".safari-jam--ready");
  if (!jam) return;
  const arena = superDebug.getBoundingClientRect();
  const figure = jam.getBoundingClientRect();
  const pocketWidth = Math.max(58, Math.min(108, figure.width * .27));
  const pocketHeight = Math.max(58, Math.min(104, figure.height * .24));
  safariNetBugs.style.left = `${figure.left - arena.left + figure.width * .85}px`;
  safariNetBugs.style.top = `${figure.top - arena.top + figure.height * .5}px`;
  safariNetBugs.style.width = `${pocketWidth}px`;
  safariNetBugs.style.height = `${pocketHeight}px`;
}

window.addEventListener("resize", () => window.requestAnimationFrame(positionSafariNetPocket));

function formatSafariTime(milliseconds) {
  return (milliseconds / 1000).toFixed(2);
}

function getSafariBest() {
  try {
    const saved = Number(window.localStorage.getItem(SAFARI_BEST_KEY));
    return Number.isFinite(saved) && saved > 0 ? saved : 0;
  } catch {
    return 0;
  }
}

function renderSafariBest() {
  const best = getSafariBest();
  safariBest.textContent = best ? formatSafariTime(best) : "--";
}

function updateSafariTimer(now) {
  safariElapsed = now - safariStartedAt;
  safariTime.textContent = formatSafariTime(safariElapsed);
  safariTimerFrame = window.requestAnimationFrame(updateSafariTimer);
}

function startSafariTimer() {
  window.cancelAnimationFrame(safariTimerFrame);
  safariElapsed = 0;
  safariTime.textContent = "0.00";
  safariRecord.hidden = true;
  arcadeMarquee.classList.remove("is-new-record");
  safariStartedAt = performance.now();
  safariTimerFrame = window.requestAnimationFrame(updateSafariTimer);
}

function stopSafariTimer() {
  window.cancelAnimationFrame(safariTimerFrame);
  safariTimerFrame = 0;
  safariElapsed = performance.now() - safariStartedAt;
  safariTime.textContent = formatSafariTime(safariElapsed);
  const previousBest = getSafariBest();
  if (!previousBest || safariElapsed < previousBest) {
    try { window.localStorage.setItem(SAFARI_BEST_KEY, String(safariElapsed)); } catch {}
    safariBest.textContent = formatSafariTime(safariElapsed);
    safariRecord.hidden = false;
    arcadeMarquee.classList.add("is-new-record");
  }
}

renderSafariBest();

function queueBuild(callback, delay) {
  const timer = window.setTimeout(callback, delay);
  buildTimers.push(timer);
}

function finishBuild() {
  buildLab.classList.remove("has-bug", "trusted-mal", "is-hunting");
  buildLab.classList.add("is-complete");
  buildStatus.textContent = "Fixed!";
  buildReceipt.hidden = false;
  runBuildButton.disabled = false;
  runBuildButton.innerHTML = "<span>↻</span> Play again";
  mascotBubble.textContent = "Safari complete! Every bug was safely relocated, and Jamal found the cause, fixed it, and checked his work. Ready to ship!";
  mascot.classList.add("is-reacting", "is-introducing");
  window.setTimeout(() => mascot.classList.remove("is-reacting", "is-introducing"), 12000);
}

function resetBuild() {
  window.cancelAnimationFrame(safariTimerFrame);
  safariTimerFrame = 0;
  safariElapsed = 0;
  if (safariTime) safariTime.textContent = "0.00";
  if (safariRecord) safariRecord.hidden = true;
  arcadeMarquee?.classList.remove("is-new-record");
  buildTimers.forEach((timer) => window.clearTimeout(timer));
  buildTimers = [];
  buildLab.classList.remove("is-running", "has-bug", "is-hunting", "bugs-caught", "is-complete");
  superDebug.hidden = true;
  arcadeMarquee.hidden = true;
  superDebug.classList.remove("is-ready", "is-catching", "is-entering");
  safariNetBugs.innerHTML = "";
  bugHuntWelcome.hidden = false;
  debugActive = false;
  aimedBug = null;
  safariCatchButton.disabled = true;
  bugsRemaining = debugBugs.length;
  if (debugCount) debugCount.textContent = bugsRemaining;
  if (debugInstruction) debugInstruction.textContent = "Click a doodle bug. Safari Jam will gently catch it with his net.";
  debugBugs.forEach((bug) => {
    bug.disabled = false;
    bug.classList.remove("is-aimed", "is-targeted", "is-hit");
  });
  superDebug?.querySelectorAll(".debug-shot, .debug-impact").forEach((effect) => effect.remove());
  buildReceipt.hidden = true;
  buildStatus.textContent = "Ready";
}

runBuildButton?.addEventListener("click", () => {
  resetBuild();
  buildLab.classList.add("is-running");
  bugHuntWelcome.hidden = true;
  arcadeMarquee.hidden = false;
  superDebug.hidden = false;
  superDebug.classList.add("is-entering");
  runBuildButton.disabled = true;
  runBuildButton.innerHTML = "<span>⌖</span> Find 3 bugs";
  buildStatus.textContent = "On safari";
  buildLab.classList.add("is-hunting");
  mascotBubble.textContent = "Safari hat? Check. Tiny net? Check. Click a doodle bug and I’ll scoop it up safely!";
  mascot.classList.add("is-reacting", "is-introducing");
  window.clearTimeout(mascotIntroductionTimer);
  mascotIntroductionTimer = window.setTimeout(() => mascot.classList.remove("is-reacting", "is-introducing"), 12000);
  queueBuild(() => {
    superDebug.classList.remove("is-entering");
    debugActive = true;
    safariCatchButton.disabled = false;
    superDebug.classList.add("is-ready");
    startSafariTimer();
  }, 1800);
});

function animateBugIntoNet(bug) {
  positionSafariNetPocket();
  const arena = superDebug.getBoundingClientRect();
  const bugRect = bug.getBoundingClientRect();
  const startX = bugRect.left + bugRect.width / 2 - arena.left;
  const startY = bugRect.top + bugRect.height / 2 - arena.top;
  const netPocket = safariNetBugs.getBoundingClientRect();
  const endX = netPocket.left + netPocket.width / 2 - arena.left;
  const endY = netPocket.top + netPocket.height / 2 - arena.top;
  const traveler = document.createElement("i");
  traveler.className = "bug-transfer";
  traveler.style.setProperty("--bug-start-x", `${startX}px`);
  traveler.style.setProperty("--bug-start-y", `${startY}px`);
  traveler.style.setProperty("--bug-mid-x", `${(startX + endX) / 2}px`);
  traveler.style.setProperty("--bug-mid-y", `${(startY + endY) / 2 - 65}px`);
  traveler.style.setProperty("--bug-end-x", `${endX}px`);
  traveler.style.setProperty("--bug-end-y", `${endY}px`);
  superDebug.append(traveler);
  window.setTimeout(() => {
    traveler.remove();
    const caughtBug = document.createElement("i");
    caughtBug.className = "caught-doodle-bug";
    safariNetBugs.append(caughtBug);
  }, 720);
}

function swingBugNet(clientX, clientY, hit) {
  if (!superDebug || !debugActive) return;
  const arena = superDebug.getBoundingClientRect();
  const startX = arena.width * (window.innerWidth <= 560 ? 0.52 : 0.39);
  const startY = arena.height * (window.innerWidth <= 560 ? 0.48 : 0.53);
  const endX = clientX - arena.left;
  const endY = clientY - arena.top;
  const distance = Math.hypot(endX - startX, endY - startY);
  const angle = Math.atan2(endY - startY, endX - startX) * 180 / Math.PI;
  const shot = document.createElement("i");
  shot.className = `debug-shot net-swoop ${hit ? "is-hit" : "is-miss"}`;
  shot.style.setProperty("--shot-x", `${startX}px`);
  shot.style.setProperty("--shot-y", `${startY}px`);
  shot.style.setProperty("--shot-length", `${distance}px`);
  shot.style.setProperty("--shot-angle", `${angle}deg`);
  superDebug.append(shot);
  const impact = document.createElement("i");
  impact.className = `debug-impact net-catch ${hit ? "is-hit" : "is-miss"}`;
  impact.style.left = `${endX}px`;
  impact.style.top = `${endY}px`;
  superDebug.append(impact);
  window.setTimeout(() => {
    shot.remove();
    impact.remove();
  }, 700);
}

function aimSafariBug(bug) {
  if (!debugActive || bug.classList.contains("is-targeted") || bug.classList.contains("is-hit")) return;
  debugBugs.forEach((candidate) => candidate.classList.remove("is-aimed"));
  aimedBug = bug;
  bug.classList.add("is-aimed");
  debugInstruction.textContent = "Target locked! Hit the red SWIPE button before it gets away.";
  buildStatus.textContent = "Target locked";
}

function catchSafariBug(bug) {
    if (!debugActive || !bug || bug.classList.contains("is-targeted")) return;
    const target = bug.getBoundingClientRect();
    const targetX = target.left + target.width / 2;
    const targetY = target.top + target.height / 2;
    bug.classList.remove("is-aimed");
    bug.classList.add("is-targeted");
    bug.disabled = true;
    safariCatchButton.disabled = true;
    aimedBug = null;
    superDebug.classList.remove("is-catching");
    void superDebug.offsetWidth;
    superDebug.classList.add("is-catching");
    positionSafariNetPocket();
    window.setTimeout(() => {
      superDebug.classList.remove("is-catching");
      positionSafariNetPocket();
    }, 1050);
    animateBugIntoNet(bug);
    swingBugNet(targetX, targetY, true);
    buildStatus.textContent = "Safely caught!";
    window.setTimeout(() => {
      bug.classList.add("is-hit");
      bugsRemaining -= 1;
      debugCount.textContent = bugsRemaining;
      if (bugsRemaining > 0) {
        debugInstruction.textContent = `Direct hit! ${bugsRemaining} doodle bug${bugsRemaining === 1 ? "" : "s"} still hiding.`;
        safariCatchButton.disabled = false;
        return;
      }
      debugActive = false;
      safariCatchButton.disabled = true;
      stopSafariTimer();
      buildLab.classList.add("bugs-caught");
      buildStatus.textContent = "Checking fix…";
      debugInstruction.textContent = "All bugs safely caught! Jamal is checking that the fix works everywhere…";
      mascotBubble.textContent = "That’s all three! I’ll release them back into the doodle wild while Jamal checks the fix.";
      queueBuild(() => finishBuild(), 2400);
    }, 360);
}

superDebug?.addEventListener("click", (event) => {
  if (!debugActive || event.target.closest("[data-debug-bug]")) return;
  debugBugs.forEach((candidate) => candidate.classList.remove("is-aimed"));
  aimedBug = null;
  debugInstruction.textContent = "Aim at a moving bug, then hit the red SWIPE button.";
  buildStatus.textContent = "Choose a target";
});

debugBugs.forEach((bug) => {
  bug.addEventListener("pointerenter", () => aimSafariBug(bug));
  bug.addEventListener("focus", () => aimSafariBug(bug));
  bug.addEventListener("click", (event) => {
    event.stopPropagation();
    aimSafariBug(bug);
  });
});

safariCatchButton?.addEventListener("click", () => {
  if (!debugActive) return;
  if (aimedBug) {
    catchSafariBug(aimedBug);
    return;
  }
  const arena = superDebug.getBoundingClientRect();
  swingBugNet(arena.left + arena.width * .72, arena.top + arena.height * .42, false);
  buildStatus.textContent = "Missed!";
  debugInstruction.textContent = "No target! Aim at a bug first, then hit SWIPE.";
  mascotBubble.textContent = "You’ve gotta aim first! Those little guys are quick.";
});

function runLilMalPrank() {
  if (lilMalPrankRunning) return;

  lilMalPrankRunning = true;
  lilMalPrankFinished = true;
  window.clearTimeout(lilMalPrankTimer);
  window.clearTimeout(mascotIntroductionTimer);
  mascotBubble.textContent = "Hold my coffee… actually, maybe don’t. I’m a little clumsy. ☕";
  mascot.classList.add("is-reacting", "is-introducing");
  document.body.classList.remove("lil-mal-cleaning");

  window.setTimeout(() => {
    document.body.classList.add("lil-mal-prank");
    if (workHeading) workHeading.textContent = "Definitely a backend developer.";
    mascotBubble.textContent = "Oops! This is why Jamal won’t let me near the keyboard. 😇";
  }, 5000);

  window.setTimeout(() => {
    document.body.classList.add("lil-mal-cleaning");
    stopMascotFlight();
    window.clearTimeout(mascotIdleTimer);
    mascot.classList.remove("is-idle", "is-blinking", "is-flying");
    mascot.classList.remove("is-introducing", "is-reacting");
    mascot.classList.add("is-cleaning");
    runMascotSpillCleanup();
  }, 9000);

  window.setTimeout(() => {
    document.body.classList.remove("lil-mal-prank", "lil-mal-cleaning");
    if (workHeading) workHeading.innerHTML = originalWorkHeading;
    recallMascot();
    mascotBubble.textContent = "All cleaned up! I’m back where the tour started.";
  }, 11500);

  window.setTimeout(() => {
    mascot.classList.remove("is-introducing");
    lilMalPrankRunning = false;
  }, 19500);
}

function runMascotSpillCleanup() {
  const spillImage = document.querySelector(".lil-mal-spill");
  const canvas = document.querySelector(".lil-mal-spill-canvas");
  if (!spillImage || !canvas) return;
  const ratio = window.devicePixelRatio || 1;
  canvas.width = Math.round(window.innerWidth * ratio);
  canvas.height = Math.round(window.innerHeight * ratio);
  const context = canvas.getContext("2d");
  context.setTransform(ratio, 0, 0, ratio, 0, 0);
  context.clearRect(0, 0, window.innerWidth, window.innerHeight);

  const spillWidth = Math.min(680, window.innerWidth * .86);
  const imageRatio = spillImage.naturalWidth ? spillImage.naturalHeight / spillImage.naturalWidth : .58;
  const spillHeight = spillWidth * imageRatio;
  const spillLeft = (window.innerWidth - spillWidth) / 2;
  const spillTop = (window.innerHeight - spillHeight) / 2;
  context.save();
  context.translate(window.innerWidth / 2, window.innerHeight / 2);
  context.rotate(-8 * Math.PI / 180);
  context.drawImage(spillImage, -spillWidth / 2, -spillHeight / 2, spillWidth, spillHeight);
  context.restore();

  const mascotRect = mascot.getBoundingClientRect();
  const baseLeft = mascotRect.left - Number(mascot.dataset.x || 0);
  const baseTop = mascotRect.top - Number(mascot.dataset.y || 0);
  const marginX = spillWidth * .08;
  const rows = 6;
  const points = [{ x: mascotRect.left + mascotRect.width * .72, y: mascotRect.top + mascotRect.height * .72 }];
  for (let row = 0; row < rows; row += 1) {
    const y = spillTop + spillHeight * (.16 + row * .135);
    const left = spillLeft + marginX;
    const right = spillLeft + spillWidth - marginX;
    points.push({ x: row % 2 ? right : left, y });
    points.push({ x: row % 2 ? left : right, y });
  }

  const startedAt = performance.now();
  const duration = 2500;
  const radius = Math.max(32, Math.min(58, spillWidth * .075));
  let previous = points[0];
  context.globalCompositeOperation = "destination-out";
  context.lineCap = "round";
  context.lineJoin = "round";
  context.lineWidth = radius * 2;

  function wipe(now) {
    const progress = Math.min((now - startedAt) / duration, 1);
    const scaled = progress * (points.length - 1);
    const index = Math.min(Math.floor(scaled), points.length - 2);
    const local = scaled - index;
    const from = points[index];
    const to = points[index + 1];
    const spongeX = from.x + (to.x - from.x) * local;
    const spongeY = from.y + (to.y - from.y) * local;
    context.beginPath();
    context.moveTo(previous.x, previous.y);
    context.lineTo(spongeX, spongeY);
    context.stroke();
    previous = { x: spongeX, y: spongeY };

    const nextX = spongeX - mascotRect.width * .72 - baseLeft;
    const nextY = spongeY - mascotRect.height * .72 - baseTop;
    mascot.dataset.x = nextX;
    mascot.dataset.y = nextY;
    mascot.style.translate = `${nextX}px ${nextY}px`;
    mascot.style.rotate = `${to.x > from.x ? 5 : -5}deg`;
    if (progress < 1) window.requestAnimationFrame(wipe);
  }
  window.requestAnimationFrame(wipe);
}

function introduceSection(stop) {
  if (!stop || activeMascotStop === stop.position) return;

  activeMascotStop = stop.position;
  mascot.dataset.stop = stop.position;
  mascotBubble.textContent = stop.message;
  mascot.classList.add("is-introducing");
  window.clearTimeout(mascotIntroductionTimer);
  mascotIntroductionTimer = window.setTimeout(() => {
    mascot.classList.remove("is-introducing");
  }, 16000);

  if (stop.position === "work" && !lilMalPrankFinished) {
    lilMalPrankTimer = window.setTimeout(runLilMalPrank, 12000);
  }
}

function updateMascotGuide() {
  const viewportMarker = window.scrollY + window.innerHeight * 0.48;
  let currentStop = mascotStops[0];

  mascotStops.forEach((stop) => {
    if (stop.section && stop.section.offsetTop <= viewportMarker) {
      currentStop = stop;
    }
  });

  introduceSection(currentStop);
}

let mascotScrollFrame = 0;
window.addEventListener(
  "scroll",
  () => {
    if (mascotScrollFrame) return;
    mascotScrollFrame = window.requestAnimationFrame(() => {
      updateMascotGuide();
      mascotScrollFrame = 0;
    });
  },
  { passive: true },
);
window.addEventListener("resize", updateMascotGuide);

document.querySelectorAll(".project-card").forEach((card) => {
  card.addEventListener("mouseenter", () => {
    window.clearTimeout(mascotTipTimer);
    mascotBubble.textContent = `${card.querySelector("h3").textContent}? Good pick.`;
    mascot.classList.add("is-reacting");
  });
  card.addEventListener("mouseleave", () => restoreMascotGuide(250));
  card.addEventListener("focusin", () => {
    window.clearTimeout(mascotTipTimer);
    mascotBubble.textContent = `${card.querySelector("h3").textContent}? Good pick.`;
    mascot.classList.add("is-reacting");
  });
  card.addEventListener("focusout", () => restoreMascotGuide(250));
});

mascot.addEventListener("mouseenter", () => {
  window.clearTimeout(mascotIdleTimer);
  mascot.classList.remove("is-idle");
  mascot.classList.remove("is-blinking");
  mascotBubble.textContent = "Yep, I react. Drag me around—or you can throw me too!";
});
mascot.addEventListener("mouseleave", () => {
  restoreMascotGuide(500);
  scheduleMascotIdle();
});

mascot.addEventListener("click", () => {
  if (
    lilMalPrankFinished &&
    !mascot.classList.contains("is-dragging") &&
    mascot.dataset.suppressPrankClick !== "true"
  ) {
    runLilMalPrank();
  }
});

function scheduleMascotBlink() {
  const delay = 3500 + Math.random() * 4500;
  window.setTimeout(() => {
    if (!mascot.matches(":hover") && !mascot.classList.contains("is-dragging") && !mascot.classList.contains("is-flying") && !mascot.classList.contains("is-idle")) {
      mascot.classList.add("is-blinking");
      window.setTimeout(() => {
        mascot.classList.remove("is-blinking");
        mascotBlinkCount += 1;
        if (mascotBlinkCount % 3 === 0) {
          mascot.classList.add("is-idle");
          window.clearTimeout(mascotIdleFaceTimer);
          mascotIdleFaceTimer = window.setTimeout(() => {
            mascot.classList.remove("is-idle");
            scheduleMascotBlink();
          }, 10000);
          return;
        }
        scheduleMascotBlink();
      }, 170);
      return;
    }
    scheduleMascotBlink();
  }, delay);
}

document.querySelector(".shuffle-desk").addEventListener("click", () => {
  const canvas = document.querySelector(".canvas");
  const canvasRect = canvas.getBoundingClientRect();
  const elements = [...canvas.querySelectorAll("[data-draggable]")].filter((element) => element.offsetParent !== null);
  if (elements.length < 2) return;
  stopMascotFlight();
  const slots = elements.map((element) => {
    const rect = element.getBoundingClientRect();
    return { centerX: rect.left + rect.width / 2, centerY: rect.top + rect.height / 2 };
  });
  const shift = Math.max(1, Math.floor(elements.length / 2) + Math.floor(Math.random() * Math.max(1, elements.length / 2)));
  canvas.classList.add("is-mixing-desk");
  elements.forEach((element, index) => {
    const rect = element.getBoundingClientRect();
    const slot = slots[(index + shift) % slots.length];
    const currentX = Number(element.dataset.x || 0);
    const currentY = Number(element.dataset.y || 0);
    const desiredLeft = Math.max(canvasRect.left + 8, Math.min(canvasRect.right - rect.width - 8, slot.centerX - rect.width / 2));
    const desiredTop = Math.max(canvasRect.top + 76, Math.min(canvasRect.bottom - rect.height - 12, slot.centerY - rect.height / 2));
    const nextX = Math.round(currentX + desiredLeft - rect.left);
    const nextY = Math.round(currentY + desiredTop - rect.top);
    element.dataset.x = nextX;
    element.dataset.y = nextY;
    element.style.translate = `${nextX}px ${nextY}px`;
    element.style.rotate = `${Math.round((Math.random() - .5) * 18)}deg`;
  });
  window.setTimeout(() => canvas.classList.remove("is-mixing-desk"), 850);
  mascotBubble.textContent = "Okay, full desk swap! Everybody has a new seat.";
  mascot.classList.add("is-reacting");
  window.setTimeout(() => {
    mascot.classList.remove("is-reacting");
    restoreMascotGuide();
  }, 3200);
});

let siteStarted = false;

function startSite() {
  if (siteStarted) return;
  siteStarted = true;
  if (window.location.hash) history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
  window.scrollTo(0, 0);
  runLoader();
  scheduleMascotBlink();
  scheduleMascotIdle();
  updateMascotGuide();
}

window.addEventListener("pageshow", () => window.scrollTo(0, 0));

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", startSite, { once: true });
} else {
  startSite();
}
