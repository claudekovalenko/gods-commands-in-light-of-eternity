// Springy radial graph — no dependencies.
(function () {
  const svg = document.getElementById('graph');
  const panel = document.getElementById('panel');
  const panelContent = document.getElementById('panel-content');
  const NS = 'http://www.w3.org/2000/svg';

  // ——— language & translation state ———
  const store = {
    get(k, d) { try { return localStorage.getItem(k) || d; } catch { return d; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch { /* private mode */ } },
  };

  function defaultLang() {
    const saved = store.get('lang', '');
    if (LANGS.some(l => l.id === saved)) return saved;
    return (navigator.language || '').toLowerCase().startsWith('ar') ? 'ar' : 'en';
  }

  let lang = defaultLang();
  let transId = (() => {
    const saved = store.get('translation:' + lang, '');
    const list = TRANSLATIONS[lang];
    return list.some(t => t.id === saved) ? saved : list[0].id;
  })();

  const ui = () => UI[lang];
  const label = th => pick(th.label, lang);
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  let W = innerWidth, H = innerHeight;
  const nodes = [];
  const byId = {};

  function radiusFor(t) {
    if (t.category === 'center') return Math.min(W, H) * 0.105;
    if (t.category === 'hub') return Math.min(W, H) * 0.062;
    return Math.min(W, H) * (0.040 + t.emphasis * 0.0045);
  }
  function strokeFor(t) {
    if (t.category === 'center') return 2;
    if (t.category === 'hub') return 2.5;
    return t.emphasis === 3 ? 3.5 : t.emphasis === 2 ? 2 : 1.2;
  }

  // ——— viewport: the graph is laid out in CSS pixels, then the viewBox lets
  // the reader zoom in. On a phone the whole map only fits at small type, so
  // pinching in is how the labels become readable.
  const view = { x: 0, y: 0, w: 0, h: 0 };
  const MIN_ZOOM = 0.6, MAX_ZOOM = 6;
  const resetBtn = document.getElementById('reset-view');

  function applyView() {
    if (![view.x, view.y, view.w, view.h].every(Number.isFinite) || view.w <= 0 || view.h <= 0) {
      resetView(); return;                       // a bad gesture must not wreck the render
    }
    // Keep most of the viewport over the graph so it can't be dragged out of reach.
    view.x = Math.max(-view.w * 0.4, Math.min(W - view.w * 0.6, view.x));
    view.y = Math.max(-view.h * 0.4, Math.min(H - view.h * 0.6, view.y));
    svg.setAttribute('viewBox', `${view.x} ${view.y} ${view.w} ${view.h}`);
    resetBtn.hidden = Math.abs(view.w - W) < 1 && Math.abs(view.x) < 1 && Math.abs(view.y) < 1;
  }
  function resetView() {
    view.x = 0; view.y = 0; view.w = W; view.h = H;
    applyView();
  }
  // client (screen) coords -> graph coords
  function toGraph(clientX, clientY) {
    const r = svg.getBoundingClientRect();
    return {
      x: view.x + (clientX - r.left) * (view.w / r.width),
      y: view.y + (clientY - r.top) * (view.h / r.height),
    };
  }
  function zoomAt(clientX, clientY, factor) {
    if (!Number.isFinite(factor) || factor <= 0) return;
    const before = toGraph(clientX, clientY);
    const zoom = W / view.w;
    const next = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, zoom * factor));
    view.w = W / next; view.h = H / next;
    const after = toGraph(clientX, clientY);
    view.x += before.x - after.x;          // keep the point under the finger fixed
    view.y += before.y - after.y;
    applyView();
  }

  // ——— layout anchors: hubs on a ring, leaves fanned outward from their hub ———
  // Bounds come from the real header/footer heights so no circle hides under them.
  const bounds = { minX: 0, maxX: 0, minY: 0, maxY: 0 };

  function computeAnchors() {
    W = innerWidth; H = innerHeight;
    nodes.forEach(n => { n.r = radiusFor(n.theme); });

    // Reserve exactly as much room as the control bar actually needs, so the
    // title can never end up underneath it in any language or at any size.
    const bar = document.getElementById('topbar').getBoundingClientRect().height;
    const header = document.getElementById('header');
    header.style.paddingTop = (bar + 10) + 'px';
    const headBottom = header.getBoundingClientRect().bottom || 90;
    const footH = document.getElementById('footer').offsetHeight || 24;
    bounds.minX = 6; bounds.maxX = W - 6;
    bounds.minY = headBottom + 4; bounds.maxY = H - footH - 4;

    const cx = W / 2, cy = (bounds.minY + bounds.maxY) / 2;
    const availW = bounds.maxX - bounds.minX, availH = bounds.maxY - bounds.minY;
    const base = Math.min(availW, availH);
    // Stretch the rings into whatever shape the screen actually is, so a tall
    // phone doesn't waste its height on empty space.
    const kx = Math.min(1.4, availW / base), ky = Math.min(1.4, availH / base);
    const hubR = base * 0.27;

    const hubs = THEMES.filter(t => t.category === 'hub');
    const leavesOf = h => THEMES.filter(t => t.parent === h.id);

    // The hubs sit on the compass points — up, right, down, left — so the map
    // reads as balanced in every direction. The two largest groups are put
    // opposite each other (and the two smallest opposite each other), otherwise
    // both heavy groups land on the same side and the map looks lopsided.
    const step = (Math.PI * 2) / hubs.length;
    const slotAngle = i => -Math.PI / 2 + i * step;       // 0 = up, then clockwise
    const bySize = hubs.slice().sort((a, b) => leavesOf(b).length - leavesOf(a).length);
    // Put the heavy groups along whichever axis actually has room: left/right on
    // a wide screen, up/down on a tall one. Slots are 0=up, 1=right, 2=down, 3=left.
    const portrait = availH > availW;
    const fillOrder = hubs.length === 4
      ? (portrait ? [0, 2, 1, 3] : [1, 3, 0, 2])
      : hubs.map((_, i) => i);

    const ring = new Array(hubs.length);
    bySize.forEach((h, i) => { ring[fillOrder[i]] = h; });
    ring.forEach((h, i) => {
      h._angle = slotAngle(i);
      h._n = leavesOf(h).length;
      place(byId[h.id], cx + Math.cos(h._angle) * hubR * kx, cy + Math.sin(h._angle) * hubR * ky);
    });
    place(byId['gospel'], cx, cy);

    // Hubs stay evenly spaced, but the gap between two neighbours is divided in
    // proportion to their sizes, so a 15-bubble group borrows room from a
    // 4-bubble one instead of overrunning it. Wedges still cannot overlap.
    ring.forEach((h, i) => {
      const prev = ring[(i - 1 + ring.length) % ring.length]._n;
      const next = ring[(i + 1) % ring.length]._n;
      const left = step * (h._n / (h._n + prev)) * 0.86;
      const right = step * (h._n / (h._n + next)) * 0.86;

      const leaves = leavesOf(h);
      leaves.forEach((t, j) => {
        const f = leaves.length === 1 ? 0.5 : j / (leaves.length - 1);
        const a = h._angle - left + f * (left + right);
        const r = hubR + base * (0.145 + (j % 2) * 0.085);   // two arcs so a big group isn't strung thin
        place(byId[t.id], cx + Math.cos(a) * r * kx, cy + Math.sin(a) * r * ky);
      });
    });
    resetView();
  }

  function place(n, x, y) {
    n.ax = clampX(n, x);
    n.ay = clampY(n, y);
  }
  const clampX = (n, x) => Math.max(bounds.minX + n.r, Math.min(bounds.maxX - n.r, x));
  const clampY = (n, y) => Math.max(bounds.minY + n.r, Math.min(bounds.maxY - n.r, y));

  // ——— build ———
  THEMES.forEach(t => {
    const n = { theme: t, x: W / 2 + (Math.random() - 0.5) * 40, y: H / 2 + (Math.random() - 0.5) * 40, vx: 0, vy: 0, ax: W / 2, ay: H / 2, r: 20, dragging: false };
    nodes.push(n); byId[t.id] = n;
  });
  computeAnchors();
  nodes.forEach(n => { n.x = n.ax + (Math.random() - 0.5) * 60; n.y = n.ay + (Math.random() - 0.5) * 60; });

  const edgeLayer = document.createElementNS(NS, 'g');
  const nodeLayer = document.createElementNS(NS, 'g');
  svg.appendChild(edgeLayer); svg.appendChild(nodeLayer);

  const edges = [];
  THEMES.filter(t => t.parent).forEach(t => {
    const line = document.createElementNS(NS, 'line');
    line.setAttribute('class', 'edge' + (byId[t.id].theme.category === 'hub' ? ' spine' : ''));
    edgeLayer.appendChild(line);
    edges.push({ from: byId[t.parent], to: byId[t.id], el: line });
  });

  // ——— label fitting ———
  // A circle gets narrower toward the top and bottom, so text is fitted against
  // the chord width at each line's height, not against a naive bounding box.
  const LH = 1.16; // line height, multiple of font size
  const gauge = document.createElement('canvas').getContext('2d');

  function setFont(row, size) {
    gauge.font = `${row.italic ? 'italic ' : ''}${row.weight ? row.weight + ' ' : ''}${size}px ${FONTS[lang]}`;
  }
  function measure(row, size) {          // advance width (fallback path only)
    setFont(row, size);
    return gauge.measureText(row.text).width;
  }

  // True ink box of a line, in the font the device actually resolved. This is
  // what makes fitting correct for Arabic on a device whose naskh face we have
  // never seen — a fixed safety margin tuned to one font does not transfer.
  const HAS_INK = (() => {
    try {
      gauge.font = '16px serif';
      const m = gauge.measureText('x');
      return typeof m.actualBoundingBoxLeft === 'number'
          && typeof m.actualBoundingBoxAscent === 'number';
    } catch { return false; }
  })();

  function inkBox(row, size) {
    setFont(row, size);
    gauge.textBaseline = 'middle';       // matches dominant-baseline: central
    const m = gauge.measureText(row.text);
    return {
      halfW: (m.actualBoundingBoxLeft + m.actualBoundingBoxRight) / 2,
      asc: m.actualBoundingBoxAscent,
      desc: m.actualBoundingBoxDescent,
    };
  }

  function wrapWords(label, maxChars) {
    const lines = [];
    let cur = '';
    for (const w of label.split(' ')) {
      const trial = cur ? cur + ' ' + w : w;
      if (trial.length > maxChars && cur) { lines.push(cur); cur = w; }
      else cur = trial;
    }
    if (cur) lines.push(cur);
    return lines;
  }

  // Vertically centered stack of rows; returns each row's center offset.
  function stack(rows, scale) {
    const heights = rows.map(r => r.rel * scale * LH);
    const total = heights.reduce((a, b) => a + b, 0);
    let y = -total / 2;
    return rows.map((r, i) => {
      const yc = y + heights[i] / 2;
      y += heights[i];
      return { row: r, size: r.rel * scale, yc };
    });
  }

  // Arabic glyphs overhang their advance width (diacritics, final hamza) and reach
  // higher/lower than Latin, so both insets are per-script.
  const METRICS = { en: { pad: 0.88, vert: 0.40 }, ar: { pad: 0.78, vert: 0.60 } };
  const metrics = () => METRICS[lang] || METRICS.en;

  function fits(rows, scale, R) {
    for (const { row, size, yc } of stack(rows, scale)) {
      if (HAS_INK) {
        const k = inkBox(row, size);
        const top = yc - k.asc, bot = yc + k.desc;
        for (const y of [top, bot]) {
          if (Math.hypot(k.halfW, y) > R) return false;     // corners of the real ink box
        }
      } else {
        const reach = Math.abs(yc) + size * metrics().vert;
        if (reach >= R) return false;
        if (measure(row, size) / 2 > Math.sqrt(R * R - reach * reach)) return false;
      }
    }
    return true;
  }

  function layoutLabel(n) {
    const textEl = n.textEl, theme = n.theme;
    while (textEl.firstChild) textEl.removeChild(textEl.firstChild);

    // With a true ink box the only margin needed is the ring's own stroke plus a
    // hair of breathing room; without it, fall back to the per-script estimate.
    const R = HAS_INK ? n.r - strokeFor(theme) / 2 - 3 : n.r * metrics().pad;
    const maxSize = theme.category === 'center' ? n.r * 0.17 : n.r * 0.34;
    const weight = theme.category === 'center' ? 700 : 0;

    // Try every sensible wrap and score them.
    const candidates = [];
    for (let mc = 5; mc <= 26; mc++) {
      const rows = wrapWords(label(theme), mc).map(l => ({ text: l, rel: 1, italic: false, weight }));
      if (theme.sublabel) {
        for (const l of wrapWords(pick(theme.sublabel, lang), Math.max(mc, 12))) {
          rows.push({ text: l, rel: 0.78, italic: true, weight: 0 });
        }
      }
      if (!fits(rows, 4, R)) continue;
      let lo = 4, hi = maxSize;
      for (let i = 0; i < 22; i++) {
        const mid = (lo + hi) / 2;
        if (fits(rows, mid, R)) lo = mid; else hi = mid;
      }
      candidates.push({ scale: lo, rows, lines: rows.length });
    }
    // Biggest type wins, but a wrap that reads naturally beats one that stacks
    // single words to gain a hair of size — so near-ties go to the fewest lines.
    let best = null;
    if (candidates.length) {
      const top = Math.max(...candidates.map(c => c.scale));
      best = candidates
        .filter(c => c.scale >= top * 0.92)
        .sort((a, b) => a.lines - b.lines || b.scale - a.scale)[0];
    } else {
      best = { scale: 7, rows: wrapWords(label(theme), 9).map(l => ({ text: l, rel: 1, italic: false, weight })) };
    }

    // One <text> per line, never tspans in a shared <text>: a single <text> is one
    // bidi paragraph, and WebKit reorders runs across the whole paragraph, which
    // scrambles Arabic letters between the visual lines.
    const dir = (LANGS.find(l => l.id === lang) || {}).dir || 'ltr';
    for (const { row, size, yc } of stack(best.rows, best.scale)) {
      const line = document.createElementNS(NS, 'text');
      line.setAttribute('x', 0);
      line.setAttribute('y', yc.toFixed(2));
      line.setAttribute('font-size', size.toFixed(2));
      line.setAttribute('dominant-baseline', 'central');
      line.setAttribute('direction', dir);
      line.setAttribute('unicode-bidi', 'isolate');
      if (row.italic) line.setAttribute('font-style', 'italic');
      line.textContent = row.text;
      textEl.appendChild(line);
    }
  }

  function refresh(n) {
    n.circle.setAttribute('r', n.r);
    layoutLabel(n);
  }

  nodes.forEach(n => {
    const g = document.createElementNS(NS, 'g');
    g.setAttribute('class', `node ${n.theme.category}`);
    const c = document.createElementNS(NS, 'circle');
    c.setAttribute('stroke-width', strokeFor(n.theme));
    const t = document.createElementNS(NS, 'g');
    t.setAttribute('class', 'label');
    g.appendChild(c); g.appendChild(t);
    nodeLayer.appendChild(g);
    n.el = g; n.circle = c; n.textEl = t;
    refresh(n);

    g.addEventListener('mouseenter', () => { g.classList.add('highlight'); n.squish = 1; });
    g.addEventListener('mouseleave', () => g.classList.remove('highlight'));
    g.addEventListener('click', e => { if (!n.moved) openPanel(n.theme); });
  });

  // ——— panel ———
  let openTheme = null;

  function verseHTML(v) {
    const trans = TRANSLATIONS[lang].find(x => x.id === transId) || TRANSLATIONS[lang][0];
    const ref = esc(localizeRef(v.ref, lang));
    const own = v.text[transId];
    if (own) {
      return `<div class="verse"><div class="ref">${ref} (${esc(trans.name)})</div>
        <div class="text">&ldquo;${esc(own)}&rdquo;</div></div>`;
    }
    // No text for this translation: show the reference and fall back to the ESV,
    // clearly labelled, rather than presenting unverified Scripture text.
    return `<div class="verse"><div class="ref">${ref}</div>
      <div class="pending">${esc(ui().pending)}</div>
      <div class="src-tag" dir="ltr">ESV</div>
      <div class="text ltr" dir="ltr">&ldquo;${esc(v.text.esv)}&rdquo;</div></div>`;
  }

  function openPanel(theme) {
    openTheme = theme;
    const sub = theme.sublabel ? ' — ' + pick(theme.sublabel, lang) : '';
    panelContent.innerHTML = `
      <h2>${esc(label(theme) + sub)}</h2>
      <div class="category-tag">${esc(ui().categories[theme.category] || '')}</div>
      ${theme.category !== 'hub' ? `<div class="emphasis-note">${esc(ui().emphasisNote[theme.emphasis])}</div>` : ''}
      <p class="summary">${esc(pick(theme.summary, lang))}</p>
      ${theme.verses.map(verseHTML).join('')}
    `;
    panel.classList.add('open');
  }
  function closePanel() { panel.classList.remove('open'); openTheme = null; }
  document.getElementById('panel-close').addEventListener('click', closePanel);

  // ——— language / translation controls ———
  const langSeg = document.getElementById('lang-seg');
  const transSel = document.getElementById('translation');

  function fillTranslations() {
    transSel.innerHTML = TRANSLATIONS[lang]
      .map(x => `<option value="${x.id}" title="${esc(x.full)}">${esc(x.name)}${x.abbr ? ' · ' + esc(x.abbr) : ''}</option>`)
      .join('');
    transSel.value = transId;
  }

  function applyLanguage() {
    const meta = LANGS.find(l => l.id === lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = meta.dir;

    // Both languages are always shown, so getting back is one tap and the
    // control is recognisable without being able to read the active language.
    langSeg.innerHTML = LANGS.map(l =>
      `<button type="button" data-lang="${l.id}" lang="${l.id}" aria-pressed="${l.id === lang}">${esc(l.name)}</button>`
    ).join('');
    fillTranslations();

    const s = ui();
    document.getElementById('title').textContent = s.title;
    document.getElementById('subtitle').textContent = s.subtitle;
    document.getElementById('hint').textContent = s.hint;
    document.getElementById('footer-text').textContent = s.footer;
    document.getElementById('panel-close').setAttribute('aria-label', s.close);
    document.querySelectorAll('[data-legend]').forEach(el => {
      el.textContent = s.legend[el.dataset.legend] || '';
    });
    resetBtn.textContent = s.resetView;

    // Arabic metrics differ from English, so every label must be re-fitted, and the
    // header height may change, which moves the layout bounds.
    computeAnchors();
    nodes.forEach(refresh);
    if (openTheme) openPanel(openTheme);
  }

  // Escape closes the verse panel.
  addEventListener('keydown', e => {
    if (e.key === 'Escape') closePanel();
  });

  langSeg.addEventListener('click', e => {
    const btn = e.target.closest('button[data-lang]');
    if (!btn || btn.dataset.lang === lang) return;
    lang = btn.dataset.lang;
    store.set('lang', lang);
    const saved = store.get('translation:' + lang, '');
    transId = TRANSLATIONS[lang].some(x => x.id === saved) ? saved : TRANSLATIONS[lang][0].id;
    applyLanguage();
  });

  transSel.addEventListener('change', () => {
    transId = transSel.value;
    store.set('translation:' + lang, transId);
    if (openTheme) openPanel(openTheme);
  });

  // ——— input: drag a node, pan the canvas, pinch or wheel to zoom ———
  let dragNode = null, dragOff = { x: 0, y: 0 };
  let panning = null;                      // {x, y} in graph coords
  const pointers = new Map();
  let pinch = null;                        // {dist, cx, cy}

  nodes.forEach(n => {
    n.el.addEventListener('pointerdown', e => {
      if (pointers.size > 1) return;
      const p = toGraph(e.clientX, e.clientY);
      dragNode = n; n.dragging = true; n.moved = false;
      dragOff.x = n.x - p.x; dragOff.y = n.y - p.y;
      svg.classList.add('dragging');
      e.preventDefault();
    });
  });

  svg.addEventListener('pointerdown', e => {
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.size === 2) {
      dragNode && (dragNode.dragging = false); dragNode = null;
      const [a, b] = [...pointers.values()];
      pinch = { dist: Math.hypot(a.x - b.x, a.y - b.y) };
      panning = null;
      return;
    }
    if (e.target === svg) {
      closePanel();
      panning = toGraph(e.clientX, e.clientY);
      svg.classList.add('dragging');
    }
  });

  addEventListener('pointermove', e => {
    if (pointers.has(e.pointerId)) pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (pinch && pointers.size === 2) {
      const [a, b] = [...pointers.values()];
      const dist = Math.hypot(a.x - b.x, a.y - b.y);
      if (pinch.dist > 0) zoomAt((a.x + b.x) / 2, (a.y + b.y) / 2, dist / pinch.dist);
      pinch.dist = dist;
      return;
    }
    if (dragNode) {
      const p = toGraph(e.clientX, e.clientY);
      const nx = p.x + dragOff.x, ny = p.y + dragOff.y;
      if (Math.hypot(nx - dragNode.x, ny - dragNode.y) > 3) dragNode.moved = true;
      dragNode.vx = (nx - dragNode.x) * 0.6;
      dragNode.vy = (ny - dragNode.y) * 0.6;
      dragNode.x = nx; dragNode.y = ny;
      return;
    }
    if (panning) {
      const p = toGraph(e.clientX, e.clientY);
      view.x += panning.x - p.x;
      view.y += panning.y - p.y;
      applyView();
    }
  }, { passive: true });

  function endPointer(e) {
    pointers.delete(e.pointerId);
    if (pointers.size < 2) pinch = null;
    if (dragNode) { dragNode.dragging = false; dragNode = null; }
    if (!pointers.size) panning = null;
    svg.classList.remove('dragging');
  }
  addEventListener('pointerup', endPointer);
  addEventListener('pointercancel', endPointer);

  resetBtn.addEventListener('click', () => { resetView(); });
  svg.addEventListener('dblclick', () => { resetView(); });

  svg.addEventListener('wheel', e => {
    e.preventDefault();
    const px = e.deltaMode === 1 ? e.deltaY * 16 : e.deltaY;   // lines -> pixels
    zoomAt(e.clientX, e.clientY, Math.exp(-px * 0.0022));
  }, { passive: false });

  addEventListener('resize', () => { computeAnchors(); nodes.forEach(refresh); });

  // ——— physics: spring to anchor + soft repulsion = squishy, bouncy nodes ———
  const SPRING = 0.012, DAMP = 0.88, REPEL = 1.02, GAP = 7;
  function tick() {
    for (const n of nodes) {
      if (!n.dragging) {
        n.vx += (n.ax - n.x) * SPRING;
        n.vy += (n.ay - n.y) * SPRING;
      }
    }
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i], b = nodes[j];
        const dx = b.x - a.x, dy = b.y - a.y;
        const dist = Math.hypot(dx, dy) || 0.01;
        const min = (a.r + b.r) * REPEL + 6;
        if (dist < min) {
          const f = (min - dist) / min * 0.6;
          const ux = dx / dist, uy = dy / dist;
          if (!a.dragging) { a.vx -= ux * f * 2; a.vy -= uy * f * 2; }
          if (!b.dragging) { b.vx += ux * f * 2; b.vy += uy * f * 2; }
        }
      }
    }
    for (const n of nodes) {
      if (!n.dragging) {
        n.vx *= DAMP; n.vy *= DAMP; n.x += n.vx; n.y += n.vy;
        const cx = clampX(n, n.x), cy = clampY(n, n.y);   // stay fully on screen
        if (cx !== n.x) { n.x = cx; n.vx *= -0.35; }
        if (cy !== n.y) { n.y = cy; n.vy *= -0.35; }
      }
    }

    // Hard separation: velocity forces alone still let circles slide over each
    // other and hide their labels, so overlaps are resolved by position.
    for (let iter = 0; iter < 4; iter++) {
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i], b = nodes[j];
          const dx = b.x - a.x, dy = b.y - a.y;
          const dist = Math.hypot(dx, dy) || 0.01;
          // Bubbles of the same group sit close; different groups push further
          // apart, so each family reads as one cluster.
          const kin = a.theme.parent && a.theme.parent === b.theme.parent;
          const min = a.r + b.r + (kin ? GAP : GAP * 2.6);
          if (dist >= min) continue;
          const ux = dx / dist, uy = dy / dist;
          const push = min - dist;
          const aShare = a.dragging ? 0 : (b.dragging ? 1 : 0.5);
          const bShare = b.dragging ? 0 : (a.dragging ? 1 : 0.5);
          a.x -= ux * push * aShare; a.y -= uy * push * aShare;
          b.x += ux * push * bShare; b.y += uy * push * bShare;
        }
      }
      for (const n of nodes) {
        if (n.dragging) continue;
        n.x = clampX(n, n.x); n.y = clampY(n, n.y);
      }
    }

    for (const n of nodes) {
      // squish: brief scale pulse on hover
      if (n.squish > 0.01) {
        n.squish *= 0.86;
        const s = 1 + Math.sin(n.squish * Math.PI) * 0.08;
        n.el.setAttribute('transform', `translate(${n.x},${n.y}) scale(${s})`);
      } else {
        n.el.setAttribute('transform', `translate(${n.x},${n.y})`);
      }
    }
    for (const e of edges) {
      e.el.setAttribute('x1', e.from.x); e.el.setAttribute('y1', e.from.y);
      e.el.setAttribute('x2', e.to.x); e.el.setAttribute('y2', e.to.y);
    }
    requestAnimationFrame(tick);
  }
  nodes.forEach(n => { n.squish = 0; });
  applyLanguage();          // paints all chrome text and fits labels for the active language
  requestAnimationFrame(tick);
})();
