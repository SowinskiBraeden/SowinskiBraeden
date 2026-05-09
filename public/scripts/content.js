(function() {
  const CONTENT_INDEX_PATH = "./public/content/index.json";

  const escapeHtml = (value) => String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");

  const formatDate = (value) => {
    if (!value) {
      return "";
    }

    const date = new Date(`${value}T00:00:00`);
    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return new Intl.DateTimeFormat("en-CA", {
      year: "numeric",
      month: "short",
      day: "numeric"
    }).format(date);
  };

  const getIndex = async () => {
    if (window.location.protocol === "file:") {
      throw new Error("This content page needs a local web server. Run python3 -m http.server and open http://localhost:8000.");
    }

    const response = await fetch(CONTENT_INDEX_PATH);
    if (!response.ok) {
      throw new Error("Unable to load content index.");
    }

    return response.json();
  };

  const stripFrontMatter = (markdown) => {
    if (!markdown.startsWith("---")) {
      return markdown;
    }

    const parts = markdown.split("---");
    if (parts.length < 3) {
      return markdown;
    }

    return parts.slice(2).join("---").trim();
  };

  const renderTags = (tags, className) => {
    if (!tags || !tags.length) {
      return "";
    }

    return `<div class="${className}">${tags.map((tag) => `<span class="${className === "tag-list" ? "tag" : "entry-tag"}">${escapeHtml(tag)}</span>`).join("")}</div>`;
  };

  const setMetaContent = (selector, content) => {
    const element = document.querySelector(selector);
    if (!element || !content) {
      return;
    }

    element.setAttribute("content", content);
  };

  const setCanonicalHref = (href) => {
    const canonical = document.querySelector("link[rel='canonical']");
    if (!canonical || !href) {
      return;
    }

    canonical.setAttribute("href", href);
  };

  const updateEntryMeta = (entry) => {
    const baseUrl = "https://sowinski.dev";
    const title = `${entry.title} | Braeden Sowinski`;
    const description = entry.summary || "Project entry or update from Braeden Sowinski.";
    const url = `${baseUrl}/entry.html?type=${encodeURIComponent(entry.type)}&slug=${encodeURIComponent(entry.slug)}`;
    const image = "https://avatars.githubusercontent.com/u/48144618?v=4";

    document.title = title;
    setCanonicalHref(url);
    setMetaContent("meta[name='description']", description);
    setMetaContent("meta[property='og:title']", title);
    setMetaContent("meta[property='og:description']", description);
    setMetaContent("meta[property='og:url']", url);
    setMetaContent("meta[property='og:image']", image);
    setMetaContent("meta[name='twitter:title']", title);
    setMetaContent("meta[name='twitter:description']", description);
    setMetaContent("meta[name='twitter:image']", image);
  };

  const renderLinks = (entry, className) => {
    const links = [];

    links.push(`<a class="${className} ${className}-primary" href="./entry.html?type=${encodeURIComponent(entry.type)}&slug=${encodeURIComponent(entry.slug)}">Read More</a>`);

    if (entry.github) {
      links.push(`<a class="${className}" href="${escapeHtml(entry.github)}" target="_blank" rel="noopener noreferrer">GitHub</a>`);
    }

    if (entry.demo) {
      links.push(`<a class="${className}" href="${escapeHtml(entry.demo)}" target="_blank" rel="noopener noreferrer">Live</a>`);
    }

    return `<div class="${className.replace("card-link", "card-links")}">${links.join("")}</div>`;
  };

  const createCard = (entry) => {
    const formattedDate = formatDate(entry.date);
    const featuredClass = entry.featured ? " featured" : "";
    const anchorId = entry.slug ? ` id="${escapeHtml(entry.slug)}"` : "";

    return `
      <article class="content-card${featuredClass}"${anchorId}>
        <div class="card-meta">
          <span class="card-kicker">${escapeHtml(entry.label || entry.type)}</span>
          ${formattedDate ? `<span class="card-date">${escapeHtml(formattedDate)}</span>` : ""}
        </div>
        <h3>${escapeHtml(entry.title)}</h3>
        <p class="card-summary">${escapeHtml(entry.summary || "")}</p>
        ${renderTags(entry.tags || [], "tag-list")}
        ${renderLinks(entry, "card-link")}
      </article>
    `;
  };

  const renderSection = (containerId, entries, emptyMessage) => {
    const container = document.getElementById(containerId);
    if (!container) {
      return;
    }

    if (!entries.length) {
      container.innerHTML = `<p class="loading-state">${escapeHtml(emptyMessage)}</p>`;
      return;
    }

    container.innerHTML = entries.map(createCard).join("");
  };

  const initProjectsToggle = (entries) => {
    const projectsGrid = document.getElementById("projects-grid");
    const toggleShell = document.getElementById("projects-toggle-shell");
    const toggleButton = document.getElementById("projects-toggle");
    const defaultVisibleCount = 6;

    if (!projectsGrid || !toggleShell || !toggleButton) {
      return;
    }

    const cards = Array.from(projectsGrid.querySelectorAll(".content-card"));
    if (entries.length <= defaultVisibleCount || cards.length <= defaultVisibleCount) {
      toggleShell.hidden = true;
      return;
    }

    const setExpandedState = (expanded) => {
      cards.forEach((card, index) => {
        card.classList.toggle("is-hidden", !expanded && index >= defaultVisibleCount);
      });

      toggleButton.textContent = expanded ? "Show Fewer Projects" : "Show More Projects";
      toggleButton.setAttribute("aria-expanded", String(expanded));
    };

    toggleShell.hidden = false;
    setExpandedState(false);

    toggleButton.addEventListener("click", () => {
      const expanded = toggleButton.getAttribute("aria-expanded") === "true";
      setExpandedState(!expanded);
    });
  };

  const compareByNewestDate = (left, right) => {
    const leftTime = left.date ? Date.parse(`${left.date}T00:00:00`) : Number.NEGATIVE_INFINITY;
    const rightTime = right.date ? Date.parse(`${right.date}T00:00:00`) : Number.NEGATIVE_INFINITY;

    if (leftTime !== rightTime) {
      return rightTime - leftTime;
    }

    const leftOrder = Number.isFinite(left.order) ? left.order : Number.MAX_SAFE_INTEGER;
    const rightOrder = Number.isFinite(right.order) ? right.order : Number.MAX_SAFE_INTEGER;

    if (leftOrder !== rightOrder) {
      return leftOrder - rightOrder;
    }

    return String(left.title || "").localeCompare(String(right.title || ""));
  };

  const compareByPriorityOrder = (left, right) => {
    const leftOrder = Number.isFinite(left.order) ? left.order : Number.MAX_SAFE_INTEGER;
    const rightOrder = Number.isFinite(right.order) ? right.order : Number.MAX_SAFE_INTEGER;

    if (leftOrder !== rightOrder) {
      return leftOrder - rightOrder;
    }

    const leftTime = left.date ? Date.parse(`${left.date}T00:00:00`) : Number.NEGATIVE_INFINITY;
    const rightTime = right.date ? Date.parse(`${right.date}T00:00:00`) : Number.NEGATIVE_INFINITY;

    if (leftTime !== rightTime) {
      return rightTime - leftTime;
    }

    return String(left.title || "").localeCompare(String(right.title || ""));
  };

  const initListPage = async () => {
    try {
      const index = await getIndex();
      const sortedProjects = [...(index.projects || [])].sort(compareByPriorityOrder);
      renderSection("projects-grid", sortedProjects, "No projects added yet.");
      initProjectsToggle(sortedProjects);
      renderSection("updates-grid", [...(index.updates || [])].sort(compareByNewestDate), "No updates added yet.");
    } catch (error) {
      renderSection("projects-grid", [], error.message);
      renderSection("updates-grid", [], error.message);
    }
  };

  const initEntryPage = async () => {
    const shell = document.getElementById("entry-shell");
    if (!shell) {
      return;
    }

    try {
      const params = new URLSearchParams(window.location.search);
      const type = params.get("type");
      const slug = params.get("slug");

      if (!type || !slug) {
        shell.innerHTML = `
          <div class="entry-empty">
            <p class="eyebrow">Not found</p>
            <h1 class="entry-title">This entry could not be loaded.</h1>
            <a class="entry-back" href="./projects.html">Back to projects</a>
          </div>
        `;
        return;
      }

      const index = await getIndex();
      const entries = [...(index.projects || []), ...(index.updates || [])];
      const entry = entries.find((item) => item.type === type && item.slug === slug);

      if (!entry) {
        throw new Error("Entry not found.");
      }

      updateEntryMeta(entry);

      const response = await fetch(entry.path);
      if (!response.ok) {
        throw new Error("Unable to load markdown entry.");
      }

      const rawMarkdown = await response.text();
      const markdown = stripFrontMatter(rawMarkdown);

      shell.innerHTML = `
        <div class="entry-header">
          <a class="entry-back" href="./projects.html">Back to projects</a>
          <div class="entry-meta">
            <span class="entry-pill entry-pill-primary">${escapeHtml(entry.label || entry.type)}</span>
            ${entry.date ? `<span class="entry-pill entry-pill-secondary">${escapeHtml(formatDate(entry.date))}</span>` : ""}
            ${entry.status ? `<span class="entry-pill entry-pill-secondary">${escapeHtml(entry.status)}</span>` : ""}
          </div>
          <h1 class="entry-title">${escapeHtml(entry.title)}</h1>
          <p class="entry-summary">${escapeHtml(entry.summary || "")}</p>
          ${renderTags(entry.tags || [], "entry-tag-list")}
          <div class="entry-links">
            ${entry.github ? `<a class="inline-button" href="${escapeHtml(entry.github)}" target="_blank" rel="noopener noreferrer">GitHub</a>` : ""}
            ${entry.demo ? `<a class="inline-button inline-button-primary" href="${escapeHtml(entry.demo)}" target="_blank" rel="noopener noreferrer">Live</a>` : ""}
          </div>
        </div>
        <article class="entry-content">
          ${window.marked.parse(markdown)}
        </article>
      `;
    } catch (error) {
      shell.innerHTML = `
        <div class="entry-empty">
          <p class="eyebrow">Not found</p>
          <h1 class="entry-title">${escapeHtml(error.message)}</h1>
          <a class="entry-back" href="./projects.html">Back to projects</a>
        </div>
      `;
    }
  };

  window.PORTFOLIO_CONTENT = {
    initListPage,
    initEntryPage
  };
})();
