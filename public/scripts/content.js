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

  const renderLinks = (entry, className) => {
    const links = [];

    links.push(`<a class="${className} ${className}-primary" href="./entry.html?type=${encodeURIComponent(entry.type)}&slug=${encodeURIComponent(entry.slug)}">Read More</a>`);

    if (entry.github) {
      links.push(`<a class="${className}" href="${escapeHtml(entry.github)}" target="_blank" rel="noopener noreferrer">Github</a>`);
    }

    if (entry.demo) {
      links.push(`<a class="${className}" href="${escapeHtml(entry.demo)}" target="_blank" rel="noopener noreferrer">Live</a>`);
    }

    return `<div class="${className.replace("card-link", "card-links")}">${links.join("")}</div>`;
  };

  const createCard = (entry) => {
    const formattedDate = formatDate(entry.date);
    const featuredClass = entry.featured ? " featured" : "";

    return `
      <article class="content-card${featuredClass}">
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

  const initListPage = async () => {
    try {
      const index = await getIndex();
      renderSection("projects-grid", index.projects || [], "No projects added yet.");
      renderSection("updates-grid", index.updates || [], "No updates added yet.");
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
            ${entry.github ? `<a class="inline-button" href="${escapeHtml(entry.github)}" target="_blank" rel="noopener noreferrer">Github</a>` : ""}
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
