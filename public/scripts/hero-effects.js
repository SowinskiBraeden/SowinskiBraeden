(function() {
  const hero = document.querySelector(".hero-main");
  const heroShell = document.querySelector(".hero-main .hero-shell");
  const profile = document.querySelector(".hero-main .profile");
  const title = document.querySelector(".hero-main .svg-wrapper");
  const descriptions = document.querySelectorAll(
    ".hero-main .hero-description, .hero-main .hero-badges, .hero-main .hero-actions, .hero-main .social-icons"
  );

  if (!hero || !heroShell || !profile || !title) {
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

  const setTransform = (element, x, y) => {
    element.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  };

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
    heroShell.style.setProperty("--hero-shell-tilt-x", `${currentY * -2.2}deg`);
    heroShell.style.setProperty("--hero-shell-tilt-y", `${currentX * 2.6}deg`);

    setTransform(profile, currentX * -4.5, currentY * -4.5);
    setTransform(title, currentX * 2.2, currentY * 2.2);

    descriptions.forEach((element, index) => {
      const strength = 1.3 + index * 0.35;
      setTransform(element, currentX * strength, currentY * strength);
    });

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
