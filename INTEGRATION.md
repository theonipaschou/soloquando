# solo.quando — Single source of truth for batches

## Files in this delivery

1. `batches.js`    — the data file (the only file you'll edit going forward)
2. `products.html` — fully wired, ready to deploy
3. `INTEGRATION.md` — this file

---

## To add a new batch (the whole point)

Open `batches.js`. At the top there is an array `window.SOLO_BATCHES`. Add a new
object — copy an existing one and edit the fields. That's it. Both pages update.

Status options: `'confirmed'`, `'open'`, or `'soon'` (placeholder).

If a field is unknown, use `null`. The renderer handles missing fields gracefully.

---

## How `index.html` needs to be wired

The current `index.html` has the carousel as **hardcoded HTML**. To make it
auto-update from `batches.js`, three small changes are needed:

### Change 1 — Empty the carousel track and dots

Find the `<div class="batch-carousel-track" id="batch-track">` block. Inside it
there are three hardcoded card divs. **Delete the cards** (leave the wrapper):

```html
<div class="batch-carousel-track" id="batch-track">
  <!-- rendered by batches.js -->
</div>
```

Same for `<div class="carousel-dots" id="batch-dots">` — delete the three
button elements inside, leave the wrapper:

```html
<div class="carousel-dots" id="batch-dots">
  <!-- rendered by batches.js -->
</div>
```

### Change 2 — Remove the old carousel JS

Find the existing carousel JS block (starts with `/* ── Batch carousel ── */`
and contains `var track = document.getElementById('batch-track')`). **Delete
that whole block.** `batches.js` now handles all carousel logic.

### Change 3 — Load batches.js

Just before the closing `</body>` tag (or near your other scripts), add:

```html
<script src="/batches.js"></script>
```

### Change 4 — Card CSS

`batches.js` renders cards with class `.bcard` (and `.bcard-img`, `.bcard-body`,
`.bcard-pill`, etc.). The CSS for these is already inside `products.html`
(in the `<style>` block). To use the same look on the homepage, copy the rules
from `products.html` lines starting at `/* ── CAROUSEL ── */` down to the
closing `}` of `.carousel-dot.on` (and the responsive blocks below) into the
`<style>` block of `index.html`.

Or — simpler — extract that CSS into `/batches.css` and link it on both pages.

---

## Want me to do the index.html patch?

Upload your current `index.html` once and I'll apply the four changes
surgically and hand it back. You won't have to upload again unless something
about the page structure itself changes.

---

## File deployment

Upload to the site root:

- `/batches.js`
- `/products.html` (replaces existing)
- `/index.html` (after applying the four changes above)

Image references in `batches.js`:
- `/batch-jar-900.jpg` — must exist (used for batch 001)
- `/batch-mousto-900.jpg` — must exist (used for batch 002)

If the image file names differ on the site, just edit the `image:` field in
`batches.js`.
