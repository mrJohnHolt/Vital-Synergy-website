# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Always Do First
- **Invoke the `frontend-design` skill** before writing any frontend code, every session, no exceptions.

---

## Local Server
- Start: `node serve.mjs` (serves the project root at `http://localhost:3000`, port 3000)
- If the server is already running on port 3000 do not start a second instance — the error `EADDRINUSE` confirms it is already up.

## Screenshot Workflow
- **Always screenshot from localhost:** `node screenshot.mjs http://localhost:3000/page.html`
- Optional label: `node screenshot.mjs http://localhost:3000/page.html label` → `screenshot-N-label.png`
- Screenshots auto-increment into `./temporary screenshots/` and are never overwritten.
- After screenshotting, read the PNG with the Read tool and compare visually.
- Puppeteer viewport is **1440 × 900**. `backdrop-filter` and parallax do not render in headless screenshots — verify those in the live browser.

---

## Architecture

### File layout
```
css/style.css          ← shared global stylesheet (all shared classes live here)
js/main.js             ← shared JS: nav modal + back-to-top button injection
Assets/                ← all local images (logos, project photos, watermark)
serve.mjs              ← static dev server
screenshot.mjs         ← Puppeteer screenshot helper
*.html                 ← one file per page; each links to css/style.css
```

### CSS layers
1. **`css/style.css`** holds all shared classes: design tokens, layout (`.wrap`, `.two-col`, `.three-col`, `.four-col`), header/nav, buttons, hero, cards, footer, back-to-top.  Any class reused across two or more pages belongs here.
2. **Per-page `<style>` blocks** inside each HTML file hold page-specific overrides only (hero background image, page-specific grids, etc.).  Do not duplicate shared classes in page blocks.

### Design tokens (CSS variables in `style.css`)
```css
--brand: #eb6823   /* primary orange */
--blue:  #1e5697   /* button blue    */
--dark:  #0d0d0d   /* header / footer background */
```
Tailwind is included via CDN with `tailwind.config = { theme: { extend: { colors: { brand: '#eb6823' } } } }`.  Use `var(--brand)` in plain CSS and `brand-xxx` in Tailwind utilities.

### JavaScript (`js/main.js`)
Two responsibilities, both auto-run on every page:
- **Nav modal** – hamburger open/close/overlay-click/Escape.
- **Back-to-top button** – injected into `<body>`; appears after 400 px scroll.

---

## Page Templates

### Standard pages (index, about, services, careers, social-value)
- Link to `css/style.css`; add page-specific styles in a `<style>` block.
- Use existing section classes: `.sec-white`, `.sec-wwd`, `.wwd-bg`, `.sec-stats`, `.testi-bg`, etc.

### Case study pages (`cs-*` prefix)
Template: copy `stpeters.html` or `hamptonlvp.html`.  Page-specific CSS class prefix: `cs-`.

Mandatory sections in order:
1. `.cs-breadcrumb` — Home / Case Studies / Page title
2. `.hero-section.hero-tall.cs-hero` — hero image via `.cs-hero { background-image: … }`
3. `.cs-meta-bar` — project value badge + date
4. Executive summary (`.cs-exec-summary`)
5. Scope grid (`.cs-scope-section` parallax + `.cs-scope-grid` 2×2 glassmorphism)
6. Project detail (`.cs-detail` with H4 sub-sections)
7. Related projects (`.cs-related-section` + `.cs-related-grid` 3-col)
8. Tag row (`.cs-tags-wrap`)
9. Share row (`.cs-share-wrap`)

Glassmorphism card pattern (scope blocks and career cards on dark backgrounds):
```css
background: rgba(255,255,255,0.08);
backdrop-filter: blur(14px);
border: 1px solid rgba(255,255,255,0.14);
```

### Vacancy pages (`jv-*` prefix)
Template: copy `bookkeeper.html` or `electrical-estimator.html`.  Page-specific CSS class prefix: `jv-`.

Mandatory sections: breadcrumb → hero (50 vh, `jv-hero`) → opening summary (`.jv-exec-summary`) → About Vital Synergy → Role Overview + Key Responsibilities → Experience & Qualifications → What We Offer → Apply CTA (`.jv-apply-section`).

---

## Navigation — updating all pages

The header nav and burger nav are **duplicated in every HTML file**.  When adding or renaming a page:

1. Update the **desktop nav** (`<nav class="header-nav">`) on every `.html` file.
2. Update the **burger nav modal** (`<nav class="nav-modal-nav">`) on every `.html` file.
3. Update the **footer Information column** on every `.html` file.
4. Use Python (`python -c "..."`) with `str.replace()` to batch-edit all pages at once — doing it file-by-file with Edit is error-prone at scale.

**Case Studies nav item** is a dropdown (`<div class="header-nav-item">` wrapper).  Add new case study pages to its `<div class="header-nav-dropdown">` on every HTML file.  Active state: parent link gets `header-nav-link-active`; the matching dropdown item gets `header-nav-dropdown-link-active`.

---

## Brand Assets
- Logos, project photos, the watermark: `Assets/` folder.
- Brand rules, tone of voice, colour guidelines: `.claude/skills/brand_assets/Brand_Rules_Master.md`.
- Use `Assets/Vital synergy logo EE - Transparent.png` for the logo on dark backgrounds.
- Use `Assets/Watermark.png` as the favicon (`href="Assets/Watermark.png"`).

### Brand voice
- UK English (organise, colour, programme).
- No em dashes — use commas, semicolons, or full stops.
- Active voice. Confidence without arrogance.

---

## Anti-Generic Guardrails
- **Colors:** Never use default Tailwind palette. Brand orange `#eb6823` is the accent; derive tints from it.
- **Shadows:** Layered, colour-tinted. Never flat `shadow-md`.
- **Typography:** Inter is the single typeface; pair weights (800 headings / 400–500 body). Tight tracking (`-0.03em`) on large headings.
- **Animations:** Only animate `transform` and `opacity`. Never `transition-all`.
- **Interactive states:** Every clickable element needs hover, focus-visible, and active states.
- **Parallax:** `background-attachment: fixed` on dark image sections; disable with `scroll` below 1024 px.

## Hard Rules
- Do not use `transition-all`.
- Do not use default Tailwind blue/indigo as primary color.
- Do not stop after one screenshot pass — do at least two comparison rounds.
- Contact form `action` value is `https://formspree.io/f/REPLACE_WITH_YOUR_ID` until connected.
