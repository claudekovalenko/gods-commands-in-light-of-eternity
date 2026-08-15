# God's Commands in Light of Eternity

An interactive, black-and-white visualization summarizing what God commands and emphasizes throughout the 66 books of the Protestant canon (ESV references), in light of eternity.

At the center is the entrance to everything: **believing in Jesus — salvation by grace through faith** in His death and resurrection. Branching from it:

- **Entering the Kingdom** — what Jesus says about who enters (become like children, be born again, do the Father's will, the narrow gate, endure to the end)
- **Pursue & grow in** — what God repeatedly commands His people toward (love God, love one another, repent, forgive, humility, holiness…)
- **Avoid & put to death** — what God repeatedly warns against (sexual immorality, idolatry, love of money, unforgiveness, hypocrisy…)
- **In light of eternity** — why the severity: judgment, heaven and hell, eternal reward, Christ's return

**Emphasis is visualized by ring thickness**: the more often Scripture presses a theme, the bolder its node. Dashed rings mark things to avoid. Nodes are springy — drag them around; click any node to read its summary and ESV verses.

## Live site

**https://claudekovalenko.github.io/gods-commands-in-light-of-eternity/**

Served by GitHub Pages from this branch, root folder. On a phone, use your browser's
"Add to Home Screen" to install it as an app — it then runs full screen and works offline.

## Running it

It's a fully static, dependency-free PWA. Serve the folder over HTTP(S):

```bash
python3 -m http.server 8080
# open http://localhost:8080
```

Deploy to any static host (GitHub Pages, Cloudflare Pages, Netlify). Once served over HTTPS it is installable as an app and works fully offline.

## Structure

- `data.js` — all themes, emphasis levels, summaries, and ESV verse excerpts (edit this to iterate on content)
- `app.js` — spring-physics radial graph (no libraries)
- `sw.js` / `manifest.json` — offline caching and installability

Scripture quotations are from the ESV® Bible (The Holy Bible, English Standard Version®), © 2001 by Crossway. Used by permission. All rights reserved.
