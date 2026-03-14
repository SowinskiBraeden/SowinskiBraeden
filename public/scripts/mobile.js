const doc = document;
const body = doc.body;
const menuOpen = doc.querySelector(".menu");
const menuClose = doc.querySelector(".close");
const overlay = doc.querySelector(".overlay");

if (menuOpen && menuClose && overlay) {
  const openMenu = () => {
    overlay.classList.add("overlay--active");
    body.classList.add("menu-open");
  };

  const closeMenu = () => {
    overlay.classList.remove("overlay--active");
    body.classList.remove("menu-open");
  };

  menuOpen.addEventListener("click", openMenu);
  menuClose.addEventListener("click", closeMenu);

  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) {
      closeMenu();
    }
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });
}
