(function() {
  const body = document.body;
  const themeToggle = document.getElementById("theme-toggle");

  const applyStoredTheme = () => {
    const storedTheme = localStorage.getItem("pref-theme") || sessionStorage.getItem("theme") || "dark";
    if (storedTheme === "light") {
      body.classList.add("light");
      sessionStorage.setItem("theme", "light");
      localStorage.setItem("pref-theme", "light");
      return;
    }

    body.classList.remove("light");
    sessionStorage.setItem("theme", "dark");
    localStorage.setItem("pref-theme", "dark");
  };

  applyStoredTheme();

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const isLight = body.classList.toggle("light");
      const nextTheme = isLight ? "light" : "dark";
      sessionStorage.setItem("theme", nextTheme);
      localStorage.setItem("pref-theme", nextTheme);
    });
  }

  body.classList.remove("js-stop-transition");
})();
