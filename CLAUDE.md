# God's Commands in Light of Eternity

A dependency-free static PWA: an interactive black-and-white node graph summarizing
what Scripture commands and emphasizes, centered on salvation by grace through faith.

## Working conventions

- **Always end the final response with the live link**, on its own line at the very
  bottom, whenever something has been built, changed, or deployed. The user wants the
  URL last, not buried mid-message.
  Live site: https://claudekovalenko.github.io/gods-commands-in-light-of-eternity/
- Develop on `claude/bible-themes-viz-8og4y9`; commit and push there.

## Layout

- `data.js` — all content: themes, `emphasis` (1–3), summaries, verse excerpts.
  Edit this to change what the map says; no code changes needed.
- `i18n.js` — languages, per-language Bible translations, UI strings, Arabic book
  names. Adding a language means adding it here *and* adding that key to every
  `label`/`sublabel`/`summary` in `data.js`.
- `app.js` — three views (map / list / review), layout, spring physics, label
  fitting, zoom/pan, search. No libraries.

## Views

The map is for browsing; **the list and review views are the ones that serve
memorising**, which is the point of the app. List = scannable and searchable;
Review = flashcards with active recall (reveal, next, shuffle, filter by group,
keyboard: space reveals, arrows move). Don't regress these in favour of map polish.
- `sw.js` — offline cache. **Bump `CACHE` on every release** or installed clients keep
  serving the old build (the fetch handler is cache-first).
- `index.html`, `styles.css`, `manifest.json`, `icon*.svg`, `.nojekyll`.

## Things that are easy to break

- **Label fitting**: text is measured on a canvas and fitted against the *chord width*
  available at each line's height, since a circle narrows at top and bottom. Don't
  replace this with a fixed font size — long labels overflow their circles.
  Fitting uses the **true ink box** (`actualBoundingBox*` from `measureText`), not the
  advance width, so it is correct in whatever font the device actually resolved. Do not
  go back to advance width plus a fixed safety ratio: Arabic ink overhangs its advance
  width, and a ratio tuned to one naskh face does not transfer to another device's
  (iOS resolves Geeza Pro / SF Arabic, not Noto Naskh). `METRICS` remains only as a
  fallback for engines without ink metrics. Verified against rasterised ground truth:
  the ink metric never under-reports. The canvas font string and the CSS font stack
  must stay identical or the measurement silently drifts from what is drawn.
- **Group clustering**: the four hubs sit on the compass points (up / right / down /
  left) so the map looks balanced. The two largest groups go *opposite* each other,
  along whichever axis has room — left/right on a wide screen, up/down on a tall one;
  putting both heavy groups on one side makes it lopsided, and putting them on the
  cramped axis pushes leaves out of their wedge. Hubs are evenly spaced, but the gap
  between two neighbours is split in proportion to their sizes, so a 15-leaf group
  borrows room from a 4-leaf one and wedges still never overlap. Separation also uses
  a bigger gap between groups than within one, which makes families read as clusters.
- **Chrome does not mirror in RTL.** The top bar, legend and panel keep the same
  position in both languages, on purpose — only text direction flips. It was
  disorienting when the panel jumped sides on switching language.
- **Multi-line labels are one `<text>` per line, never `<tspan>`s in a shared `<text>`.**
  A single `<text>` is one bidi paragraph and WebKit reorders runs across the whole
  paragraph, which scrambles Arabic letters between the visual lines (it looked fine in
  Chromium, so only a real iOS screenshot caught it). Each line also carries
  `direction` and `unicode-bidi="isolate"`.
- **Zoom/pan is hardened**: a non-finite or zero viewBox resets instead of rendering
  garbage, panning is clamped so the graph can't be dragged out of reach, and there is
  a Reset view button plus double-tap.
- **The service worker is network-first**, not cache-first. Cache-first left installed
  clients serving an old build forever and never seeing fixes. Still bump `CACHE`.
- **Node overlap**: resolved by position each frame (velocity forces alone let circles
  slide over each other and hide labels).
- **Bounds**: derived from the real header/footer heights so nodes aren't clipped.
- **Zoom**: the SVG `viewBox` changes, so pointer coords must go through `toGraph()`
  before being used as graph coordinates.
- `mode` (map/list/review) and `view` (the zoom viewBox) are different things —
  don't merge the names, and note `applyMode()` vs `applyView()`.
- A `position:fixed` overlay with `display:flex` defeats the `hidden` attribute and
  will silently swallow every click; `[hidden] { display: none !important }` guards it.
- The list and review views scroll under the fixed bar unless their padding-top is
  set from its measured height.

## Scripture text — never write it from memory

`verses[].text` is keyed by translation id (`esv`, `keh`, `svd`). Only `esv` is
populated. **Arabic Scripture text must be pasted from the published translation**
(Ketab El Hayat / Word of Life, or Smith & Van Dyck), never reconstructed from
memory and never machine-translated from English — this is Scripture, and a
plausible-sounding paraphrase is worse than an honest gap. Until a translation's
text is present, the panel shows the localized reference plus the ESV, labelled as
the ESV, so nothing unverified is ever presented as that translation.

To add it, fill in the key for each of the 119 verses:

```js
"text": { "esv": "...", "keh": "النص العربي هنا" }
```

Verse *references* are not transcribed per language — `localizeRef()` builds the
Arabic reference from `AR_BOOKS` plus Arabic-Indic digits, so a reference can only
be wrong in one place.

## Verifying changes

Serve and drive it in a real browser — the failure modes above are all visual and do
not throw errors:

```bash
python3 -m http.server 8080
```

Chromium is at `/opt/pw-browsers/chromium` (use `playwright-core`; do not run
`playwright install`). For Arabic, install a real font first or the fallback hides
real overflow:

```bash
npm pack @fontsource/noto-naskh-arabic && tar xzf fontsource-noto-naskh-arabic-*.tgz
pip install fonttools brotli   # then convert the .woff2 to .ttf into ~/.fonts, fc-cache -f
```

To check label fitting for real, rasterise each label to a canvas and measure the ink
(serialise the `<text>` into an SVG data URL, draw it, scan pixels) — `getBBox()` is the
layout box and will report no overflow while glyphs visibly cross the ring. Re-run it
with `FONTS.ar` and the CSS overridden to another Arabic face to confirm the fit does
not depend on the font installed here. Check at several viewport sizes down to 390px
wide that no label overflows its circle, no two circles overlap, and nothing is clipped
by the header or footer. Test the Pages subpath (`/gods-commands-in-light-of-eternity/`) and
an offline reload, since both differ from serving at a domain root.

## Deployment

GitHub Pages builds from this branch, root folder, on every push. There is no `main`
branch. Confirm a deploy via the `pages build and deployment` workflow run — this
sandbox's proxy blocks `github.io`, so the site cannot be fetched directly from here.
