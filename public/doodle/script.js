(() => {
const phrases = ["interfaces that move.", "stories people feel.", "ideas that work."];
const typeLine = document.querySelector(".type-line");
const loader = document.querySelector(".loader");
const loaderCount = document.querySelector(".loader__count");
const loaderBar = document.querySelector(".loader__track span");
const mascot = document.querySelector(".mascot-card");
const mascotBubble = document.querySelector(".mascot-bubble");
const recallMascotButton = document.querySelector(".recall-mascot");
const contactMascotDock = document.querySelector(".contact__mascot-dock");

// Resolve all interaction classes into one visual face. Several interactions
// can overlap briefly, so letting CSS independently show each matching sprite
// creates a one-frame double face. Mutation observers run before paint, which
// keeps the state synchronous without scattering face logic through features.
function syncMascotFace() {
  let face = "default";
  if (mascot.classList.contains("is-docking") || mascot.classList.contains("is-flying")) face = "flying";
  else if (mascot.classList.contains("is-cleaning") || mascot.classList.contains("is-dragging")) face = "drag";
  else if (mascot.classList.contains("is-reacting") || mascot.matches(":hover")) face = "wink";
  else if (mascot.classList.contains("is-blinking")) face = "blink";
  else if (mascot.classList.contains("is-idle")) face = "idle";
  mascot.dataset.face = face;
}

const mascotStops = [
  {
    section: document.querySelector("#home"),
    position: "home",
    message: "I’m Lil’ Jam, your tiny tour guide! Don’t scroll too fast. My coffee might spill. I’m kind of a klutz. ☕",
  },
  {
    section: document.querySelector("#work"),
    position: "work",
    message: "This is the workbench. Six projects built with React, APIs, and a lot of curiosity.",
  },
  {
    section: document.querySelector("#experience"),
    position: "experience",
    message: "Here are the reps behind the work: internships, real product flows, and plenty of lessons earned by building.",
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
let mascotUserPositioned = false;
let mascotIdleTimer = 0;
let mascotTipTimer = 0;
let mascotBlinkCount = 0;
let mascotIdleFaceTimer = 0;
let mascotCleanupFrame = 0;
const workHeading = document.querySelector(".section-intro h2");
const originalWorkHeading = workHeading?.innerHTML || "";

// Draw the speech bubble and its pointer as one responsive SVG path. Keeping
// the textContent API on the element means every existing message update can
// continue working without ever replacing the SVG shell.
const bubbleInitialMessage = mascotBubble.textContent.trim();
const bubbleSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
const bubblePath = document.createElementNS("http://www.w3.org/2000/svg", "path");
const bubbleText = document.createElement("span");
bubbleSvg.classList.add("mascot-bubble__shape");
bubbleSvg.setAttribute("aria-hidden", "true");
bubblePath.setAttribute("vector-effect", "non-scaling-stroke");
bubbleSvg.append(bubblePath);
bubbleText.className = "mascot-bubble__text";
bubbleText.textContent = bubbleInitialMessage;
mascotBubble.replaceChildren(bubbleSvg, bubbleText);

function drawMascotBubbleShape() {
  const width = mascotBubble.offsetWidth;
  const height = mascotBubble.offsetHeight;
  if (!width || !height) return;
  const mobileDock = window.matchMedia("(max-width: 850px)").matches && mascot.classList.contains("is-docked");
  const inset = 1.5;
  const radius = Math.min(mobileDock ? 34 : 30, height * .42);
  let path;

  if (mobileDock) {
    const center = width / 2;
    const halfTail = 17;
    const tailLength = 27;
    path = `M ${radius} ${inset} H ${width - radius} Q ${width - inset} ${inset} ${width - inset} ${radius} V ${height - radius} Q ${width - inset} ${height - inset} ${width - radius} ${height - inset} H ${center + halfTail} L ${center} ${height + tailLength} L ${center - halfTail} ${height - inset} H ${radius} Q ${inset} ${height - inset} ${inset} ${height - radius} V ${radius} Q ${inset} ${inset} ${radius} ${inset} Z`;
  } else {
    const halfTail = 12;
    const tailLength = 27;
    const tailY = Math.max(radius + halfTail, Math.min(height - radius - halfTail, height * .28));
    path = `M ${radius} ${inset} H ${width - radius} Q ${width - inset} ${inset} ${width - inset} ${radius} V ${height - radius} Q ${width - inset} ${height - inset} ${width - radius} ${height - inset} H ${radius} Q ${inset} ${height - inset} ${inset} ${height - radius} V ${tailY + halfTail} L ${-tailLength} ${tailY} L ${inset} ${tailY - halfTail} V ${radius} Q ${inset} ${inset} ${radius} ${inset} Z`;
  }

  bubbleSvg.setAttribute("width", String(width));
  bubbleSvg.setAttribute("height", String(height));
  bubbleSvg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  bubblePath.setAttribute("d", path);
}

Object.defineProperty(mascotBubble, "textContent", {
  configurable: true,
  get: () => bubbleText.textContent,
  set: (value) => {
    bubbleText.textContent = value ?? "";
    // Reading offset dimensions inside draw forces the new text layout now,
    // so the outline and message update in the same painted frame.
    drawMascotBubbleShape();
  },
});

window.addEventListener("resize", drawMascotBubbleShape);
window.requestAnimationFrame(drawMascotBubbleShape);
document.fonts?.ready.then(drawMascotBubbleShape);


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
  mascotBubble.textContent = "Yep, I react. You can throw me too!";

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
      mascotBubble.textContent = "Yep, I react. Drag me around or throw me again!";
      // A throw may cross into Contact while its momentum is still running.
      // Finish the physics first, then hand Jam to the final dock animation.
      if (activeMascotStop === "contact") {
        mascotUserPositioned = false;
        document.body.classList.remove("has-user-placed-mascot");
        window.requestAnimationFrame(updateMascotDock);
      }
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
        ? "Yep, I react. Drag me around, or you can throw me too!"
        : "Try dragging me too.";
      if (moved) {
        mascotUserPositioned = true;
        document.body.classList.add("has-user-placed-mascot");
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
    if (element === mascot && mascot.classList.contains("is-docked")) return;
    if (event.target.closest("a")) return;
    event.preventDefault();
    if (element === mascot && mascot.classList.contains("is-docked")) {
      const dockedRect = mascot.getBoundingClientRect();
      mascot.classList.remove("is-docked", "is-docking");
      mascot.style.removeProperty("top");
      mascot.style.removeProperty("left");
      mascot.style.removeProperty("width");
      mascot.style.translate = "0px 0px";
      const tourRect = mascot.getBoundingClientRect();
      mascot.dataset.x = String(dockedRect.left - tourRect.left);
      mascot.dataset.y = String(dockedRect.top - tourRect.top);
      mascot.style.translate = `${mascot.dataset.x}px ${mascot.dataset.y}px`;
      mascotUserPositioned = true;
      document.body.classList.add("has-user-placed-mascot");
    }
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

function enableCanvasPanning() {
  const canvas = document.querySelector(".canvas");
  const recenterButton = canvas?.querySelector(".recenter-canvas");
  if (!canvas || !recenterButton) return;

  const panLayer = document.createElement("div");
  panLayer.className = "canvas-pan-layer";
  [...canvas.children]
    .filter((child) => !child.matches(".canvas__grid, .secret-counter, .secret-toast, .recenter-canvas"))
    .forEach((child) => panLayer.append(child));
  canvas.append(panLayer);

  let x = 0;
  let y = 0;
  let originX = 0;
  let originY = 0;
  let pointerX = 0;
  let pointerY = 0;
  let lastX = 0;
  let lastY = 0;
  let lastTime = 0;
  let velocityX = 0;
  let velocityY = 0;
  let activePointer = null;
  let momentumFrame = 0;

  function limits() {
    return { x: Math.max(300, window.innerWidth * .5), y: Math.max(190, window.innerHeight * .34) };
  }

  function clampPosition() {
    const limit = limits();
    x = Math.max(-limit.x, Math.min(limit.x, x));
    y = Math.max(-limit.y, Math.min(limit.y, y));
  }

  function paint() {
    canvas.style.setProperty("--canvas-x", `${x}px`);
    canvas.style.setProperty("--canvas-y", `${y}px`);
    canvas.classList.toggle("is-displaced", Math.hypot(x, y) > 8);
  }

  function stopMomentum() {
    if (momentumFrame) window.cancelAnimationFrame(momentumFrame);
    momentumFrame = 0;
  }

  function startMomentum() {
    stopMomentum();
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    function coast() {
      velocityX *= .92;
      velocityY *= .92;
      x += velocityX;
      y += velocityY;
      const beforeX = x;
      const beforeY = y;
      clampPosition();
      if (x !== beforeX) velocityX *= -.22;
      if (y !== beforeY) velocityY *= -.22;
      paint();
      if (Math.hypot(velocityX, velocityY) > .18) momentumFrame = window.requestAnimationFrame(coast);
      else momentumFrame = 0;
    }
    momentumFrame = window.requestAnimationFrame(coast);
  }

  canvas.addEventListener("pointerdown", (event) => {
    if (event.target.closest("[data-draggable], a, button, input, textarea, dialog")) return;
    stopMomentum();
    activePointer = event.pointerId;
    pointerX = event.clientX;
    pointerY = event.clientY;
    lastX = event.clientX;
    lastY = event.clientY;
    lastTime = performance.now();
    originX = x;
    originY = y;
    velocityX = 0;
    velocityY = 0;
    canvas.setPointerCapture(event.pointerId);
    canvas.classList.add("is-panning");
    event.preventDefault();
  });

  canvas.addEventListener("pointermove", (event) => {
    if (event.pointerId !== activePointer || !canvas.hasPointerCapture(event.pointerId)) return;
    const now = performance.now();
    const elapsed = Math.max(8, now - lastTime);
    velocityX = ((event.clientX - lastX) / elapsed) * 16.67;
    velocityY = ((event.clientY - lastY) / elapsed) * 16.67;
    lastX = event.clientX;
    lastY = event.clientY;
    lastTime = now;
    x = originX + event.clientX - pointerX;
    y = originY + event.clientY - pointerY;
    clampPosition();
    paint();
  });

  function finishPan(event) {
    if (event.pointerId !== activePointer) return;
    if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId);
    activePointer = null;
    canvas.classList.remove("is-panning");
    startMomentum();
  }

  canvas.addEventListener("pointerup", finishPan);
  canvas.addEventListener("pointercancel", finishPan);
  recenterButton.addEventListener("click", () => {
    stopMomentum();
    const startX = x;
    const startY = y;
    const started = performance.now();
    function recenter(now) {
      const progress = Math.min(1, (now - started) / 420);
      const eased = 1 - Math.pow(1 - progress, 3);
      x = startX * (1 - eased);
      y = startY * (1 - eased);
      paint();
      if (progress < 1) window.requestAnimationFrame(recenter);
    }
    window.requestAnimationFrame(recenter);
  });

  window.addEventListener("resize", () => {
    clampPosition();
    paint();
  });
}

enableCanvasPanning();

function enableDeskSecrets() {
  const secrets = [...document.querySelectorAll(".desk-secret")];
  const counter = document.querySelector(".secret-counter");
  const count = counter?.querySelector("strong");
  const toast = document.querySelector(".secret-toast");
  if (!secrets.length || !counter || !count || !toast) return;

  const reactions = {
    "Rubber duck": "You found my debugging partner. He listens better than I do.",
    Sketchbook: "The polished version always starts with a wonderfully messy sketch.",
    Passport: "Good interfaces and good stories usually start by going somewhere new.",
    "Secret terminal": "Secret command accepted: curiosity level permanently set to maximum.",
    "Golden GitHub square": "The rare golden contribution square! Absolutely no merge conflicts included.",
  };
  let found = 0;
  let toastTimer = 0;

  function celebrateAllSecrets() {
    document.body.classList.add("desk-secrets-complete");
    count.textContent = `All ${secrets.length} found ✦`;
    mascotBubble.textContent = "You found every desk secret! Okay, you’re officially as curious as Jamal.";
    mascot.classList.add("is-reacting", "is-introducing");
    const contactStop = mascotStops.find((stop) => stop.position === "contact");
    if (contactStop) contactStop.message = `You found all ${secrets.length} desk secrets. We should definitely build something together.`;
    window.setTimeout(() => mascot.classList.remove("is-reacting", "is-introducing"), 6500);
  }

  secrets.forEach((secret) => {
    secret.addEventListener("click", () => {
      if (secret.classList.contains("is-found")) return;
      const name = secret.dataset.secret;
      secret.classList.add("is-found");
      secret.disabled = true;
      found += 1;
      counter.classList.add("is-visible");
      count.textContent = `${found} / ${secrets.length}`;
      toast.textContent = `${name} found`;
      toast.classList.remove("is-visible");
      void toast.offsetWidth;
      toast.classList.add("is-visible");
      window.clearTimeout(toastTimer);
      toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 2600);
      mascotBubble.textContent = reactions[name];
      mascot.classList.add("is-reacting", "is-introducing");

      if (found === secrets.length) celebrateAllSecrets();
      else restoreMascotGuide(4200);
    });
  });
}

enableDeskSecrets();

function enableSecretGameCartridge() {
  const cartridge = document.querySelector(".game-secret--cartridge");
  if (!cartridge) return;

  cartridge.addEventListener("click", () => {
    mascotBubble.textContent = "You found the lost Debug Patrol cartridge! Loading Jam’s bug-fighting starfighter…";
    mascot.classList.add("is-reacting", "is-introducing");
    window.setTimeout(() => {
      mascot.classList.remove("is-reacting", "is-introducing");
      document.querySelector(".run-build")?.click();
    }, 800);
  });
}

enableSecretGameCartridge();

function recallMascot() {
  const start = mascot.getBoundingClientRect();
  stopMascotFlight();
  window.clearTimeout(mascotIdleTimer);
  mascotUserPositioned = false;
  document.body.classList.remove("has-user-placed-mascot");
  mascot.classList.remove("is-docked", "is-docking");
  mascot.style.removeProperty("top");
  mascot.style.removeProperty("left");
  mascot.style.removeProperty("width");
  mascot.dataset.x = "0";
  mascot.dataset.y = "0";
  mascot.dataset.stop = "home";
  mascot.style.translate = "0px 0px";
  mascot.style.rotate = "0deg";
  mascot.classList.remove("is-dragging", "is-idle", "is-flying", "is-cleaning");
  mascot.classList.add("is-introducing", "is-reacting");
  mascotBubble.textContent = "I’m back! Drag me around, or you can throw me too.";
  const target = mascot.getBoundingClientRect();
  const returnAnimation = mascot.animate(
    [
      { translate: `${start.left - target.left}px ${start.top - target.top}px`, rotate: getComputedStyle(mascot).rotate || "0deg" },
      { translate: "0px 0px", rotate: "0deg" },
    ],
    { duration: 850, easing: "cubic-bezier(.2,.82,.24,1)" },
  );
  returnAnimation.addEventListener("finish", () => returnAnimation.cancel(), { once: true });
  window.setTimeout(() => {
    mascot.classList.remove("is-introducing", "is-reacting");
    scheduleMascotIdle();
  }, 7000);
}

recallMascotButton?.addEventListener("click", recallMascot);

function returnMascotToActiveTourStop() {
  const stop = getCurrentMascotStop();
  const start = mascot.getBoundingClientRect();
  if (mascotCleanupFrame) window.cancelAnimationFrame(mascotCleanupFrame);
  mascotCleanupFrame = 0;
  stopMascotFlight();
  window.clearTimeout(mascotIdleTimer);
  mascotUserPositioned = false;
  document.body.classList.remove("has-user-placed-mascot");
  mascot.classList.remove("is-dragging", "is-idle", "is-blinking", "is-flying", "is-cleaning", "is-reacting", "is-docked", "is-docking");
  mascot.style.removeProperty("top");
  mascot.style.removeProperty("left");
  mascot.style.removeProperty("width");
  mascot.dataset.x = "0";
  mascot.dataset.y = "0";
  mascot.dataset.stop = stop.position;
  mascot.style.translate = "0px 0px";
  mascot.style.rotate = "0deg";

  if (stop.position === "contact") {
    updateMascotDock();
    return;
  }

  const target = mascot.getBoundingClientRect();
  const landingAnimation = mascot.animate(
    [
      { translate: `${start.left - target.left}px ${start.top - target.top}px`, rotate: "-5deg" },
      { translate: "0px 0px", rotate: "0deg" },
    ],
    { duration: 850, easing: "cubic-bezier(.2,.82,.24,1)" },
  );
  landingAnimation.addEventListener("finish", () => landingAnimation.cancel(), { once: true });
}

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

/* Retired bug-safari prototype kept scoped off while the new arcade replaces it. */
if (false) {
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
}

const galagaGame = document.querySelector(".galaga-game");
const galagaCanvas = document.querySelector(".galaga-canvas");
const galagaLaunch = document.querySelector(".run-build");
const galagaStart = document.querySelector(".galaga-start");
const galagaClose = document.querySelector(".galaga-close");
const galagaIntro = document.querySelector(".galaga-intro");
const galagaMessage = document.querySelector(".galaga-message");
const galagaScore = document.querySelector(".galaga-score");
const galagaWave = document.querySelector(".galaga-wave");
const galagaLives = document.querySelector(".galaga-lives");
const galagaStage = document.querySelector(".galaga-stage");
const galagaProgressDots = [...document.querySelectorAll(".galaga-progress i")];

function createStarPatrol() {
  if (!galagaGame || !galagaCanvas) return;
  const ctx = galagaCanvas.getContext("2d");
  const jamPilot = new Image();
  jamPilot.src = "assets/lil-mal-v2-open.png";
  const keys = new Set();
  let width = 0;
  let height = 0;
  let ratio = 1;
  let frame = 0;
  let running = false;
  let score = 0;
  let wave = 1;
  const maxWaves = 3;
  let lives = 3;
  let lastShot = 0;
  let enemyDirection = 1;
  let enemySpeed = 42;
  let lastTime = 0;
  let pointerActive = false;
  let player = {};
  let shots = [];
  let enemyShots = [];
  let enemies = [];
  let stars = [];
  let particles = [];

  const resize = () => {
    ratio = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    galagaCanvas.width = Math.round(width * ratio);
    galagaCanvas.height = Math.round(height * ratio);
    galagaCanvas.style.width = `${width}px`;
    galagaCanvas.style.height = `${height}px`;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    player.y = height - 92;
    player.x = Math.min(player.x || width / 2, width - 35);
    if (!stars.length) stars = Array.from({ length: Math.max(70, Math.floor(width / 12)) }, () => ({ x: Math.random() * width, y: Math.random() * height, size: Math.random() * 2 + .5, speed: Math.random() * 34 + 14 }));
  };

  const spawnWave = () => {
    enemies = [];
    const columns = Math.min(10, Math.max(6, Math.floor(width / 95)));
    const rows = Math.min(5, 3 + Math.floor((wave - 1) / 2));
    const gapX = Math.min(82, (width - 70) / columns);
    const startX = width / 2 - ((columns - 1) * gapX) / 2;
    for (let row = 0; row < rows; row += 1) {
      for (let col = 0; col < columns; col += 1) {
        enemies.push({ x: startX + col * gapX, y: 105 + row * 54, homeX: startX + col * gapX, homeY: 105 + row * 54, row, phase: Math.random() * Math.PI * 2, alive: true });
      }
    }
    enemySpeed = 34 + wave * 7;
    enemyDirection = 1;
    galagaWave.textContent = `${wave}/${maxWaves}`;
  };

  const updateHud = () => {
    galagaScore.textContent = String(score).padStart(6, "0");
    galagaLives.textContent = lives;
    galagaWave.textContent = `${wave}/${maxWaves}`;
    const stageNames = ["REPRODUCE", "ISOLATE", "FIX"];
    galagaStage.textContent = stageNames[wave - 1] || "FIX";
    galagaProgressDots.forEach((dot, index) => dot.classList.toggle("is-active", index < wave));
  };

  const reset = () => {
    score = 0; wave = 1; lives = 3; shots = []; enemyShots = []; particles = [];
    player = { x: width / 2, y: height - 92, speed: 430, cooldown: 190, invulnerable: 0 };
    spawnWave(); updateHud();
  };

  const fire = (time = performance.now()) => {
    if (!running || time - lastShot < player.cooldown) return;
    shots.push({ x: player.x, y: player.y - 25, speed: 650 });
    lastShot = time;
  };

  const burst = (x, y, color) => {
    for (let i = 0; i < 14; i += 1) particles.push({ x, y, vx: (Math.random() - .5) * 260, vy: (Math.random() - .5) * 260, life: 1, color });
  };

  const hitPlayer = () => {
    if (player.invulnerable > 0) return;
    lives -= 1; player.invulnerable = 2; burst(player.x, player.y, "#f7df65"); updateHud();
    if (lives <= 0) endGame("BUGS WON THIS ROUND", "The build still has errors. Retry the debug run and squash them.");
  };

  const endGame = (title, copy) => {
    running = false;
    galagaMessage.hidden = false;
    galagaMessage.innerHTML = `<h3>${title}</h3><p>${copy}</p><button type="button">PLAY AGAIN</button>`;
    galagaMessage.querySelector("button").addEventListener("click", () => { galagaMessage.hidden = true; reset(); running = true; lastTime = performance.now(); });
  };

  const update = (dt, time) => {
    stars.forEach((star) => { star.y += star.speed * dt; if (star.y > height) { star.y = 0; star.x = Math.random() * width; } });
    if (!running) return;
    if (keys.has("ArrowLeft") || keys.has("KeyA")) player.x -= player.speed * dt;
    if (keys.has("ArrowRight") || keys.has("KeyD")) player.x += player.speed * dt;
    if (keys.has("Space")) fire(time);
    player.x = Math.max(28, Math.min(width - 28, player.x));
    player.invulnerable = Math.max(0, player.invulnerable - dt);
    shots.forEach((shot) => { shot.y -= shot.speed * dt; });
    enemyShots.forEach((shot) => { shot.y += shot.speed * dt; });
    shots = shots.filter((shot) => shot.y > -30);
    enemyShots = enemyShots.filter((shot) => shot.y < height + 30);

    let minX = Infinity, maxX = -Infinity;
    enemies.forEach((enemy) => { if (enemy.alive) { minX = Math.min(minX, enemy.x); maxX = Math.max(maxX, enemy.x); } });
    if ((maxX > width - 35 && enemyDirection > 0) || (minX < 35 && enemyDirection < 0)) {
      enemyDirection *= -1;
      enemies.forEach((enemy) => { enemy.y += 15; });
    }
    enemies.forEach((enemy) => {
      if (!enemy.alive) return;
      enemy.x += enemyDirection * enemySpeed * dt;
      enemy.phase += dt * 3;
      if (Math.random() < dt * (.055 + wave * .008)) enemyShots.push({ x: enemy.x, y: enemy.y + 17, speed: 210 + wave * 16 });
      if (enemy.y > player.y - 35) hitPlayer();
    });

    shots.forEach((shot) => enemies.forEach((enemy) => {
      if (!enemy.alive || Math.abs(shot.x - enemy.x) > 24 || Math.abs(shot.y - enemy.y) > 20) return;
      enemy.alive = false; shot.y = -100; score += 100 + enemy.row * 25; burst(enemy.x, enemy.y, enemy.row % 2 ? "#ff6f61" : "#65d9e8"); updateHud();
    }));
    enemyShots.forEach((shot) => {
      if (Math.abs(shot.x - player.x) < 22 && Math.abs(shot.y - player.y) < 22) { shot.y = height + 100; hitPlayer(); }
    });
    particles.forEach((p) => { p.x += p.vx * dt; p.y += p.vy * dt; p.vx *= .97; p.vy *= .97; p.life -= dt * 1.8; });
    particles = particles.filter((p) => p.life > 0);
    if (enemies.length && enemies.every((enemy) => !enemy.alive)) {
      score += 500;
      if (wave >= maxWaves) {
        updateHud();
        endGame("BUILD FIXED!", "Lil’ Jam reproduced the bug, isolated the cause, and verified the fix. Ready to ship.");
      } else {
        wave += 1; updateHud(); spawnWave();
      }
    }
  };

  const drawShip = () => {
    if (player.invulnerable > 0 && Math.floor(player.invulnerable * 10) % 2) return;
    ctx.save(); ctx.translate(player.x, player.y);
    ctx.strokeStyle = "#070b1c"; ctx.lineJoin = "round"; ctx.lineWidth = 4;
    // Wide, angular doodle starfighter silhouette.
    ctx.fillStyle = "#263f62";
    ctx.beginPath(); ctx.moveTo(0, -43); ctx.lineTo(12, -21); ctx.lineTo(25, -10); ctx.lineTo(48, 18); ctx.lineTo(20, 10); ctx.lineTo(13, 27); ctx.lineTo(-13, 27); ctx.lineTo(-20, 10); ctx.lineTo(-48, 18); ctx.lineTo(-25, -10); ctx.lineTo(-12, -21); ctx.closePath(); ctx.fill(); ctx.stroke();
    // Swept coral wing armor.
    ctx.fillStyle = "#ff6f61";
    ctx.beginPath(); ctx.moveTo(-19, -8); ctx.lineTo(-43, 13); ctx.lineTo(-21, 7); ctx.lineTo(-12, 19); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(19, -8); ctx.lineTo(43, 13); ctx.lineTo(21, 7); ctx.lineTo(12, 19); ctx.closePath(); ctx.fill(); ctx.stroke();
    // Armored golden nose and center fuselage.
    ctx.fillStyle = "#f7df65";
    ctx.beginPath(); ctx.moveTo(0, -47); ctx.lineTo(13, -15); ctx.lineTo(10, 24); ctx.lineTo(-10, 24); ctx.lineTo(-13, -15); ctx.closePath(); ctx.fill(); ctx.stroke();
    // Twin laser cannons.
    ctx.fillStyle = "#65d9e8";
    ctx.fillRect(-35, -5, 6, 25); ctx.strokeRect(-35, -5, 6, 25);
    ctx.fillRect(29, -5, 6, 25); ctx.strokeRect(29, -5, 6, 25);
    // Animated triple engine flames and glow.
    const flame = 12 + Math.sin(performance.now() / 55) * 5;
    ctx.shadowColor = "#65d9e8"; ctx.shadowBlur = 14; ctx.fillStyle = "#65d9e8";
    [-15, 0, 15].forEach((engineX, index) => { ctx.beginPath(); ctx.moveTo(engineX - 4, 22); ctx.lineTo(engineX + 4, 22); ctx.lineTo(engineX, 22 + flame + (index === 1 ? 5 : 0)); ctx.closePath(); ctx.fill(); });
    ctx.shadowBlur = 0;
    // Glass cockpit with Lil Jam as the pilot.
    ctx.save(); ctx.beginPath(); ctx.arc(0, -8, 14, Math.PI, 0); ctx.lineTo(14, 5); ctx.lineTo(-14, 5); ctx.closePath(); ctx.clip();
    ctx.fillStyle = "#9eeeff"; ctx.fillRect(-15, -23, 30, 29);
    if (jamPilot.complete && jamPilot.naturalWidth) ctx.drawImage(jamPilot, -13, -22, 26, 29);
    ctx.restore();
    ctx.strokeStyle = "#070b1c"; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(0, -8, 14, Math.PI, 0); ctx.lineTo(14, 5); ctx.lineTo(-14, 5); ctx.closePath(); ctx.stroke();
    ctx.restore();
  };

  const drawEnemy = (enemy) => {
    const bob = Math.sin(enemy.phase) * 3;
    ctx.save(); ctx.translate(enemy.x, enemy.y + bob); ctx.strokeStyle = "#070b1c"; ctx.lineWidth = 3;
    ctx.fillStyle = enemy.row % 3 === 0 ? "#ff6f61" : enemy.row % 3 === 1 ? "#65d9e8" : "#b894ff";
    ctx.beginPath(); ctx.moveTo(-10, -14); ctx.lineTo(-17, -27); ctx.moveTo(10, -14); ctx.lineTo(17, -27); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, -17); ctx.quadraticCurveTo(25, -12, 27, 8); ctx.lineTo(15, 17); ctx.lineTo(7, 9); ctx.lineTo(0, 18); ctx.lineTo(-7, 9); ctx.lineTo(-15, 17); ctx.lineTo(-27, 8); ctx.quadraticCurveTo(-25, -12, 0, -17); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle = "#fff7d4"; ctx.fillRect(-11, -5, 6, 6); ctx.fillRect(5, -5, 6, 6); ctx.restore();
  };

  const render = () => {
    ctx.clearRect(0, 0, width, height);
    const gradient = ctx.createLinearGradient(0, 0, 0, height); gradient.addColorStop(0, "#080b21"); gradient.addColorStop(1, "#112f39"); ctx.fillStyle = gradient; ctx.fillRect(0, 0, width, height);
    stars.forEach((star) => { ctx.globalAlpha = .45 + star.size / 4; ctx.fillStyle = "#fff7d4"; ctx.beginPath(); ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2); ctx.fill(); }); ctx.globalAlpha = 1;
    enemies.forEach((enemy) => { if (enemy.alive) drawEnemy(enemy); });
    ctx.fillStyle = "#f7df65"; shots.forEach((shot) => ctx.fillRect(shot.x - 2, shot.y - 12, 4, 18));
    ctx.fillStyle = "#ff6f61"; enemyShots.forEach((shot) => { ctx.beginPath(); ctx.arc(shot.x, shot.y, 5, 0, Math.PI * 2); ctx.fill(); });
    particles.forEach((p) => { ctx.globalAlpha = p.life; ctx.fillStyle = p.color; ctx.fillRect(p.x, p.y, 5, 5); }); ctx.globalAlpha = 1;
    drawShip();
  };

  const loop = (time) => {
    const dt = Math.min((time - lastTime) / 1000 || 0, .033); lastTime = time; update(dt, time); render(); frame = requestAnimationFrame(loop);
  };

  const open = () => {
    galagaGame.hidden = false; document.body.classList.add("galaga-open"); resize(); reset(); galagaIntro.hidden = false; galagaMessage.hidden = true; running = false; lastTime = performance.now(); cancelAnimationFrame(frame); frame = requestAnimationFrame(loop);
  };
  const close = () => { running = false; cancelAnimationFrame(frame); galagaGame.hidden = true; document.body.classList.remove("galaga-open"); keys.clear(); };
  const begin = () => { galagaIntro.hidden = true; galagaMessage.hidden = true; reset(); running = true; lastTime = performance.now(); galagaCanvas.focus(); };

  galagaLaunch?.addEventListener("click", open);
  galagaStart?.addEventListener("click", begin);
  galagaClose?.addEventListener("click", close);
  window.addEventListener("resize", resize);
  window.addEventListener("keydown", (event) => { if (galagaGame.hidden) return; if (["ArrowLeft", "ArrowRight", "Space", "KeyA", "KeyD"].includes(event.code)) event.preventDefault(); if (event.code === "Escape") close(); keys.add(event.code); });
  window.addEventListener("keyup", (event) => keys.delete(event.code));
  galagaCanvas.addEventListener("pointerdown", (event) => { if (!running) return; pointerActive = true; player.x = event.clientX; fire(); galagaCanvas.setPointerCapture(event.pointerId); });
  galagaCanvas.addEventListener("pointermove", (event) => { if (pointerActive && running) player.x = event.clientX; });
  galagaCanvas.addEventListener("pointerup", () => { pointerActive = false; });
}

createStarPatrol();

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
    mascot.classList.remove("is-dragging", "is-idle", "is-blinking", "is-flying", "is-cleaning", "is-reacting");
    returnMascotToActiveTourStop();
    mascot.classList.add("is-introducing");
    mascotBubble.textContent = activeMascotStop === "contact"
      ? "All cleaned up! Back in my spot. Now, about that idea?"
      : "All cleaned up! Back to the tour.";
  }, 11500);

  window.setTimeout(() => {
    mascot.classList.remove("is-introducing", "is-reacting", "is-cleaning", "is-flying", "is-dragging", "is-idle", "is-blinking");
    document.body.classList.remove("lil-mal-prank", "lil-mal-cleaning");
    restoreMascotGuide();
    scheduleMascotIdle();
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
    if (progress < 1) {
      mascotCleanupFrame = window.requestAnimationFrame(wipe);
    } else {
      mascotCleanupFrame = 0;
      context.globalCompositeOperation = "source-over";
      context.clearRect(0, 0, window.innerWidth, window.innerHeight);
    }
  }
  if (mascotCleanupFrame) window.cancelAnimationFrame(mascotCleanupFrame);
  mascotCleanupFrame = window.requestAnimationFrame(wipe);
}

function introduceSection(stop) {
  if (!stop || activeMascotStop === stop.position) return;

  activeMascotStop = stop.position;
  // Tour stops may move an untouched Jam. Once the user has placed or thrown
  // him, only the dialogue changes; his visual anchor stays exactly put.
  // The footer has its own measured dock. Keep Jam at his current tour spot
  // until the docking animation takes over so Safari never paints an
  // intermediate side-face position.
  if (!mascotUserPositioned && stop.position !== "contact") mascot.dataset.stop = stop.position;
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

function updateMascotDock() {
  if (!mascot || !contactMascotDock) return;
  // Once the user drags or throws Jam, their chosen resting place wins over
  // the automated section tour. The coffee cleanup calls recallMascot(),
  // which clears this lock and intentionally returns him home.
  const shouldDock = activeMascotStop === "contact";
  if (mascotUserPositioned && !shouldDock) return;
  if (shouldDock && mascotUserPositioned) {
    mascotUserPositioned = false;
    document.body.classList.remove("has-user-placed-mascot");
  }
  const wasDocked = mascot.classList.contains("is-docked");
  const enteringDock = shouldDock && !wasDocked;
  const start = mascot.getBoundingClientRect();
  // Select the flying face before any footer coordinates change. This keeps
  // the existing throw-style landing without a one-frame side-face flash.
  if (enteringDock) {
    mascot.classList.remove("is-idle", "is-blinking", "is-reacting", "is-dragging", "is-flying", "is-cleaning");
    mascot.classList.add("is-docking");
  }
  mascot.classList.toggle("is-docked", shouldDock);
  // Update the one-piece bubble in the same frame as the dock state so its
  // pointer never flashes in the previous direction during the handoff.
  drawMascotBubbleShape();

  if (!shouldDock) {
    mascot.classList.remove("is-docking");
    mascot.style.removeProperty("top");
    mascot.style.removeProperty("left");
    mascot.style.removeProperty("width");
    mascot.style.translate = "0px 0px";
    mascot.dataset.x = "0";
    mascot.dataset.y = "0";
    return;
  }

  stopMascotFlight();
  if (mascotCleanupFrame && !document.body.classList.contains("lil-mal-cleaning")) {
    window.cancelAnimationFrame(mascotCleanupFrame);
    mascotCleanupFrame = 0;
  }
  mascot.style.translate = "0px 0px";
  mascot.style.rotate = "0deg";
  mascot.dataset.x = "0";
  mascot.dataset.y = "0";
  const dock = contactMascotDock.getBoundingClientRect();
  mascot.style.top = `${dock.top}px`;
  mascot.style.left = `${dock.left}px`;
  mascot.style.width = `${dock.width}px`;
  if (enteringDock) {
    const target = mascot.getBoundingClientRect();
    const deltaX = start.left - target.left;
    const deltaY = start.top - target.top;
    const dockingAnimation = mascot.animate(
      [
        { translate: `${deltaX}px ${deltaY}px`, rotate: "-7deg" },
        { translate: `${deltaX * .12}px ${deltaY * .12 - 18}px`, rotate: "4deg", offset: .78 },
        { translate: "0px 0px", rotate: "0deg" },
      ],
      { duration: 1050, easing: "cubic-bezier(.2,.82,.24,1)", fill: "both" },
    );
    dockingAnimation.addEventListener("finish", () => {
      mascot.classList.remove("is-docking");
      dockingAnimation.cancel();
    }, { once: true });
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
  updateMascotDock();
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
  mascotBubble.textContent = mascot.classList.contains("is-docked")
    ? "Made it! I saved my spot for the big finish."
    : "Yep, I react. Drag me around, or you can throw me too!";
});
mascot.addEventListener("mouseleave", () => {
  restoreMascotGuide(500);
  scheduleMascotIdle();
});

mascot.addEventListener("click", () => {
  if (activeMascotStop === "contact" || mascot.classList.contains("is-docked")) {
    mascotBubble.textContent = "I’m staying right here for the big finish!";
    return;
  }
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
const initialSection = new URLSearchParams(window.location.search).get("section");

function restoreInitialSection() {
  if (initialSection !== "work") return;
  const target = document.querySelector("#work");
  if (!target) return;
  target.scrollIntoView({ block: "start", behavior: "instant" });
  window.requestAnimationFrame(updateMascotGuide);
  const navigationWindow = window.parent !== window ? window.parent : window;
  const parentUrl = new URL(navigationWindow.location.href);
  parentUrl.searchParams.delete("section");
  navigationWindow.history.replaceState(navigationWindow.history.state, "", `${parentUrl.pathname}${parentUrl.search}${parentUrl.hash}`);
}

function startSite() {
  if (siteStarted) return;
  siteStarted = true;
  new MutationObserver(syncMascotFace).observe(mascot, { attributes: true, attributeFilter: ["class"] });
  mascot.addEventListener("pointerenter", syncMascotFace);
  mascot.addEventListener("pointerleave", syncMascotFace);
  syncMascotFace();
  if (window.location.hash) history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
  if (initialSection !== "work") window.scrollTo(0, 0);
  runLoader();
  if (initialSection === "work") window.setTimeout(restoreInitialSection, 1700);
  scheduleMascotBlink();
  scheduleMascotIdle();
  updateMascotGuide();
}

window.addEventListener("pageshow", () => {
  if (initialSection === "work") {
    window.setTimeout(restoreInitialSection, 50);
    return;
  }
  window.scrollTo(0, 0);
});

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", startSite, { once: true });
} else {
  startSite();
}
})();
