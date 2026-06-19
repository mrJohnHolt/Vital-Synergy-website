---
name: case-study
description: Build a new Vital Synergy case study page. Use when asked to create a new case study, add a project page, or produce an HTML file for a completed project. Gathers project details from the user or a supplied brief, builds the full page from the stpeters.html template, and runs screenshot verification.
license: Complete terms in LICENSE.txt
---

This skill builds a new case study HTML page for the Vital Synergy website. All case study pages share a single template — the task is always a content swap, never a redesign.

## Step 1 — Invoke frontend-design

Invoke the `frontend-design` skill before writing any code. This is a CLAUDE.md hard rule with no exceptions.

## Step 2 — Gather Required Inputs

Before writing a single line of HTML, confirm you have all of the following. If any are missing, ask the user — do not invent values.

- **Filename** — e.g. `whitaker.html`. Short, lowercase, hyphen-separated, no `cs-` prefix on the filename itself.
- **Page title** — client name and location, e.g. `Roseacre Primary Academy & Nursery, Blackpool`
- **Sector** — used in the eyebrow and related-project badge (e.g. Education, Healthcare, Hospitality, Cultural / Heritage)
- **Hero image** — path inside `Assets/`, e.g. `Assets/roseacre-1.jpg`. Confirm the file exists with Glob before proceeding.
- **Project value** — e.g. `£57,090 ex VAT` or `£TBC`
- **Project dates** — e.g. `Summer 2024 – Spring 2025`
- **Project brief / content** — a written brief or the individual section texts below. If the user supplies a free-text brief, extract the content for each section from it.
- **Testimonial** — quote text, name, and role. If not yet available, use the placeholder pattern: `[ADD CLIENT QUOTE — quote text]` and `[ADD DETAIL — name and role]`.
- **Three related projects** — for each: filename, image path, sector badge text, H4 heading, and short subtitle.
- **Tags** — comma-separated list, e.g. `Education, Heating Upgrade, BMS, Lancashire`
- **Share URL slug** — the path segment used in social share URLs, e.g. `roseacre-primary-academy`
- **PDF filename** — for the document download box, e.g. `Roseacre-Primary-Academy-Case-Study.pdf`

## Step 3 — Build the Page

Read `stpeters.html` in full before writing anything. The new page is a verbatim copy of that file's structure with the inputs from Step 2 substituted in. **Never invent new CSS classes.** The inline `<style>` block is copied exactly — only the `.cs-hero` and `.cs-scope-section` `background-image` URLs change.

Build these 14 sections in order:

### 1. `<head>`
- `<title>`: `[Page title] | Case Study | Vital Synergy`
- Update `.cs-hero` and `.cs-scope-section` background-image to the hero image path.
- All other `<head>` content (Tailwind CDN, Google Fonts, style.css, Font Awesome) is identical.

### 2. Header + Nav Modal
Copy verbatim from `stpeters.html`. The `header-nav-link-active` class stays on the Case Studies link. The nav modal is identical on every page.

### 3. Breadcrumb (`.cs-breadcrumb`)
`Home / Case Studies / [Page title]`

### 4. Hero (`.hero-section.hero-tall.cs-hero`)
- `<span class="eyebrow">Case Study / [Sector]</span>`
- `<h1 class="hero-h1">[Page title]</h1>`
- `<span class="cs-hero-sub">[Project type subtitle]</span>`

### 5. Meta Bar (`.cs-meta-bar`)
- Left: "Project Value" label + value
- Right: date range

### 6. Project Overview (`.cs-exec-summary`)
One concise paragraph summarising the project — what it was, what Vital Synergy did, the headline outcomes, and how disruption was managed.

### 7. Client and Sector (`.cs-client-section`)
Two `.cs-client-card` blocks:
- **Client card**: label "Client", value = client name, description = who they are and what they needed.
- **Sector card**: label "Sector", value = sector name, description = how that sector shaped the project's specific demands.

### 8. Scope of Works (`.cs-scope-section`)
Four `.cs-scope-block` glassmorphism cards in a 2×2 grid. Each has a `.cs-scope-heading` and `.cs-scope-p`. Group the scope logically — e.g. Mechanical, Controls, Electrical, Commissioning.

### 9. Key Outcomes (`.cs-outcomes-section`)
Six `.cs-outcome-card` blocks on a dark (`#0d0d0d`) background. Each has:
- `.cs-outcome-stat` — a short metric or word (e.g. `78`, `100%`, `On Time`, `Full`)
- `.cs-outcome-title` — 3–6 word label
- `.cs-outcome-desc` — 1–2 sentence explanation

### 10. Project Detail (`.cs-detail`)
- Eyebrow: `Compliance, Safety and Delivery`
- `<h3 class="section-heading">Project Detail</h3>`
- Lead paragraph (`.body-text`) + supporting paragraph (`.body-text-faint`)
- `<h4 class="cs-detail-h4">Compliance and Safety</h4>` + 2 paragraphs
- `<h4 class="cs-detail-h4">Programme and Delivery</h4>` + 2 paragraphs

### 11. Document Download (`.cs-doc-box`)
```html
<a href="#" class="cs-doc-box" aria-label="Download [Page title] Case Study (PDF)">
  <i class="fa-solid fa-file-pdf cs-doc-icon"></i>
  <div>
    <span class="cs-doc-name">[Page title] &mdash; Case Study</span>
    <span class="cs-doc-meta">[PDF filename] &middot; [size]</span>
    <span class="cs-doc-cta">Click Here to Download</span>
  </div>
</a>
```

### 12. Testimonial (`.cs-testimonial-section`)
Dark (`#1a1a1a`) section. Opening `&#x201c;` quotation mark, `.cs-testimonial-quote` paragraph, `.cs-testimonial-divider`, optional `.cs-testimonial-name`, `.cs-testimonial-role`. Use placeholders if the quote is not yet available.

### 13. Related Projects (`.cs-related-section`)
Three `.cs-related-card` anchor links. Each has a thumbnail image, a `.csl-sector-badge` overlay, and a body with `.cs-related-h4` + `.cs-related-sub`.

### 14. Tags + Share (`.cs-tags-wrap` / `.cs-share-wrap`)
- Tags: one `.cs-tag` anchor per tag (all `href="#"`)
- Share: LinkedIn sharing URL, WhatsApp `wa.me` URL, and `mailto:` link — all using the share URL slug and page title.

## Step 4 — Verify

Start the server if not already running (`node serve.mjs`). Screenshot the new page:
```
node screenshot.mjs http://localhost:3000/[filename] [label]
```
Read the PNG. Verify: hero image loads, meta bar shows correct value and dates, all six outcome cards render, scope grid glassmorphism cards are visible, footer is intact, no broken images. Fix any issues and take a second screenshot.

## Step 5 — Wire into the site (ask the user)

Every case study is a flat link — there is no Case Studies dropdown anywhere in the codebase. The header nav and burger modal nav link straight to `casestudies.html`, and that page's `.csl-grid` is the only listing of case studies. New pages are reachable only by being added to that grid (and optionally cross-linked via related-project cards).

Ask whether to also:
1. Add a card to `casestudies.html`'s `.csl-grid`
2. Add the new page as a related project on relevant existing case study pages (swap out the least-relevant of the existing three `.cs-related-card` entries on each page to keep reciprocal links sector-relevant)
