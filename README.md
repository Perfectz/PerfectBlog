# PATRICK.OS Static Blog

This is a no-build static blog template designed to run on GitHub Pages.

## Local Preview

Markdown posts are loaded with `fetch`, so preview the project through a local static server instead of opening the HTML file directly.

```powershell
cd project
python -m http.server 8080
```

Then open:

```text
http://localhost:8080/
```

## Writing Posts

1. Add a Markdown file to `project/posts/`.
2. Add its path to `project/posts/index.json`.
3. Include frontmatter at the top of the file.

```md
---
title: Voice-trained CRM in one weekend
slug: voice-trained-crm
date: 2026-04-12
category: usecases
tags: AI, CRM, Whisper
summary: Talk to your contacts list, get summaries, schedule follow-ups.
readTime: 14 min
featured: true
author: Patrick Zgambo
cover: assets/storyboard.jpeg
---
```

Supported categories are:

- `videos`
- `usecases`
- `training`
- `consulting`

## Publishing

GitHub Pages is deployed by `.github/workflows/deploy-pages.yml`. The workflow publishes the `project/` directory as the site root whenever changes are pushed to `main`.

The main site entry is `project/index.html`.
