(function() {
  const heroShell = document.querySelector(".hero-main .hero-shell");

  if (!heroShell) {
    return;
  }

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const coarsePointer = window.matchMedia("(pointer: coarse)").matches;

  if (prefersReducedMotion || coarsePointer) {
    return;
  }

  let targetX = 0;
  let targetY = 0;
  let currentX = 0;
  let currentY = 0;

  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

  const animate = () => {
    currentX += (targetX - currentX) * 0.065;
    currentY += (targetY - currentY) * 0.065;

    const bgX = 50 + currentX * 6.8;
    const bgY = 18 + currentY * 5.6;
    const bgXAlt = 50 - currentX * 5.2;
    const bgYAlt = 30 - currentY * 4.6;
    const glowRotate = currentX * 16 + currentY * 10;
    const glowShiftX = currentX * 54;
    const glowShiftY = currentY * 42;

    document.body.style.setProperty("--hero-glow-x", `${bgX}%`);
    document.body.style.setProperty("--hero-glow-y", `${bgY}%`);
    document.body.style.setProperty("--hero-glow-alt-x", `${bgXAlt}%`);
    document.body.style.setProperty("--hero-glow-alt-y", `${bgYAlt}%`);
    document.body.style.setProperty("--hero-glow-rotate", `${glowRotate}deg`);
    document.body.style.setProperty("--hero-glow-shift-x", `${glowShiftX}px`);
    document.body.style.setProperty("--hero-glow-shift-y", `${glowShiftY}px`);

    heroShell.style.setProperty("--hero-shell-spot-x", `${50 + currentX * 14}%`);
    heroShell.style.setProperty("--hero-shell-spot-y", `${28 + currentY * 10}%`);

    requestAnimationFrame(animate);
  };

  window.addEventListener("mousemove", (event) => {
    const x = clamp((event.clientX / window.innerWidth - 0.5) * 2, -1, 1);
    const y = clamp((event.clientY / window.innerHeight - 0.5) * 2, -1, 1);

    targetX = x;
    targetY = y;
  });

  window.addEventListener("mouseleave", () => {
    targetX = 0;
    targetY = 0;
  });

  requestAnimationFrame(animate);
})();
