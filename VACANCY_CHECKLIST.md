# Vacancy checklist

Hosting is GitHub Pages: no server redirects or 410 responses. Use the steps below instead.

## New vacancy
- [ ] Copy `bookkeeper.html` or `electrical-estimator.html` (`jv-` template). Do not copy a page that has no JobPosting schema.
- [ ] Set the title, meta description, canonical URL and breadcrumb.
- [ ] Update the JobPosting schema (`id="jv-jobposting-schema"`): title, description, identifier, `datePosted`, `validThrough`, `employmentType` (FULL_TIME or PART_TIME).
- [ ] Salary: add `baseSalary` only once the MD has approved the range (snippet below). Keep the on-page salary wording the same as the schema.
- [ ] Add the Open Graph block (copy from another vacancy page; `og:image` is `Assets/og/default.jpg`).
- [ ] Add a "View Role" card to `careers.html`.
- [ ] Add the page URL to `sitemap.xml`.
- [ ] Check the Apply button and form route work.
- [ ] Check: UK English, no em dashes, no `transition-all`.

## Closing dates (automatic)
`js/main.js` ("Rolling Closes date") sets every `Closes:` date and the schema `validThrough` to the next 28th of the month in the browser. The dates written in the HTML are only a fallback for crawlers that do not run JavaScript.
- [ ] New role: write the next 28th as the visible `Closes:` text and a `validThrough` about 2 months out as the fallback.
- [ ] Only keep a role live while it is genuinely open: the date rolls forever, so a filled role must be stubbed (below).
- [ ] Every quarter, refresh the fallback dates in the HTML so they are not in the past.

## Extend a role
- [ ] Nothing to do for the date (automatic). Refresh the HTML fallback dates if they are in the past.

## Role filled or closed
- [ ] Replace the page content with a stub: `<meta http-equiv="refresh" content="0; url=careers.html">`, canonical pointing to `https://www.vitalsynergy.co.uk/careers.html`, `<meta name="robots" content="noindex">`, and a plain link "This role has been filled. See current vacancies."
- [ ] Remove the card from `careers.html`.
- [ ] Remove the URL from `sitemap.xml`.
- [ ] Check Google Search Console (Pages) in two weeks.

## Monthly check
- [ ] `grep -n validThrough *.html`: no fallback date in the past or within 14 days.
- [ ] Vacancy links on `careers.html` match the vacancy URLs in `sitemap.xml`.

## baseSalary snippet (MD sign-off needed first)
```json
"baseSalary": {
  "@type": "MonetaryAmount",
  "currency": "GBP",
  "value": {
    "@type": "QuantitativeValue",
    "minValue": 0,
    "maxValue": 0,
    "unitText": "YEAR"
  }
}
```
Replace the zeros with the approved range. Use `HOUR` for hourly roles.
