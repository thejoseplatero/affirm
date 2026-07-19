# Editing this page

Copy lives in this folder as plain HTML-flavored text, one file per section. `template.html` is `index.html` with that copy swapped for `<!--content:token-->` markers.

**To change something:** edit the relevant file, then from the repo root run:

```
node scripts/build.mjs
node scripts/qa.mjs
```

That regenerates `index.html` and checks it. Commit and push; the deploy workflow handles both destinations (joseplatero.com/affirm and the GitHub Pages mirror).

## Files

- `hero-kick.md`, `hero-h1.md`, `hero-dek.md` — the top of the page
- `collage-fc1.md`, `collage-fc2.md`, `collage-fc3.md` — the three floating cards beside the hero
- `demo1-intro.md`, `checkout-plans.md` — the "hire now, value later" checkout demo
- `search-intro.md`, `search-result.md`, `search-post.md` — the honest-search demo
- `offers-intro.md`, `marquee-1.md`, `marquee-2.md` — the two scrolling offer chip lanes
- `terms-quote.md`, `terms-intro.md`, `terms-rows.md` — the full-terms breakdown (direct fit / adjacent / gap rows)
- `stats.md`, `roles-rows.md` — the numbers and the role history
- `pillars-h2.md`, `pillars-lead.md`, `pillars.md` — the three-promise closer
- `band.md` — the closing indigo CTA band

All of these hold real HTML fragments (a `<p>`, a `<div class="recrow">`, etc.), not strict Markdown — light inline tags like `<b>` and `<a>` are expected, the same way you'd lightly format a paragraph anywhere else. Keep tags balanced within a file and the rebuild stays lossless.

## Not in here

CSS, JS (the plan picker, the typewriter search, the marquee duplication, the count-up animation), and the nav/logo markup stay in `template.html` directly — that's page engineering, not copy.
