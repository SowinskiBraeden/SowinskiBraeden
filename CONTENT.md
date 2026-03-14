# Portfolio content workflow

Projects and updates are now loaded from markdown files.

## Add a new project or update

1. Add a new `.md` file inside one of these folders:
   - `public/content/projects/`
   - `public/content/updates/`
2. Add front matter at the top of the file.
3. Run:

```bash
python3 tools/generate_content_index.py
```

That refreshes `public/content/index.json`, which is what the browser uses to build the projects and updates pages.

## Front matter example

```md
---
title: Example Entry
slug: example-entry
summary: Short card summary text.
label: Project
date: 2026-03-14
status: Active
featured: true
order: 99
github: https://github.com/example/repo
demo: https://example.com
tags: HTML, CSS, JavaScript
---
```

## Notes

- `demo` can be omitted.
- `featured` can be `true` or `false`.
- `order` controls the card order on the page.
- The markdown body below the front matter is rendered on `entry.html`.
