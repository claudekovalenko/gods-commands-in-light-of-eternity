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
- `app.js` — layout, spring physics, label fitting, zoom/pan. No libraries.
- `sw.js` — offline cache. **Bump `CACHE` on every release** or installed clients keep
  serving the old build (the fetch handler is cache-first).
- `index.html`, `styles.css`, `manifest.json`, `icon*.svg`, `.nojekyll`.

## Things that are easy to break

- **Label fitting**: text is measured on a canvas and fitted against the *chord width*
  available at each line's height, since a circle narrows at top and bottom. Don't
  replace this with a fixed font size — long labels overflow their circles.
- **Node overlap**: resolved by position each frame (velocity forces alone let circles
  slide over each other and hide labels).
- **Bounds**: derived from the real header/footer heights so nodes aren't clipped.
- **Zoom**: the SVG `viewBox` changes, so pointer coords must go through `toGraph()`
  before being used as graph coordinates.

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
`playwright install`). Check at several viewport sizes down to 390px wide that no
label overflows its circle, no two circles overlap, and nothing is clipped by the
header or footer. Test the Pages subpath (`/gods-commands-in-light-of-eternity/`) and
an offline reload, since both differ from serving at a domain root.

## Deployment

GitHub Pages builds from this branch, root folder, on every push. There is no `main`
branch. Confirm a deploy via the `pages build and deployment` workflow run — this
sandbox's proxy blocks `github.io`, so the site cannot be fetched directly from here.
