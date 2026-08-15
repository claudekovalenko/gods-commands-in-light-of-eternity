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

  let mode = ['map','list','review'].includes(store.get('view','')) ? store.get('view','') : 'map';
  let query = '';

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

  function applyView() {
    svg.setAttribute('viewBox', `${view.x} ${view.y} ${view.w} ${view.h}`);
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

    // Each group owns a wedge sized to how many bubbles it holds — equal wedges
    // would give the 15-bubble group the same room as the 4-bubble one, and it
    // would spill over its neighbours.
    const totalLeaves = hubs.reduce((n, h) => n + leavesOf(h).length, 0);
    let cursor = -Math.PI / 2 - Math.PI / hubs.length;   // keep the first group near the top
    hubs.forEach(h => {
      const share = (leavesOf(h).length / totalLeaves) * Math.PI * 2;
      h._angle = cursor + share / 2;
      h._share = share;
      cursor += share;
      place(byId[h.id], cx + Math.cos(h._angle) * hubR * kx, cy + Math.sin(h._angle) * hubR * ky);
    });
    place(byId['gospel'], cx, cy);

    hubs.forEach(h => {
      const leaves = leavesOf(h);
      // Fan strictly inside this group's own wedge, so groups cannot interleave.
      const spread = h._share * 0.86;
      leaves.forEach((t, i) => {
        const a = h._angle + (leaves.length === 1 ? 0 : (i / (leaves.length - 1) - 0.5) * spread);
        const r = hubR + base * (0.145 + (i % 2) * 0.085);   // two arcs so a big group isn't strung thin
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

  function measure(row, size) {
    gauge.font = `${row.italic ? 'italic ' : ''}${row.weight ? row.weight + ' ' : ''}${size}px ${FONTS[lang]}`;
    return gauge.measureText(row.text).width;
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
      const reach = Math.abs(yc) + size * metrics().vert;   // furthest glyph edge from center
      if (reach >= R) return false;
      if (measure(row, size) / 2 > Math.sqrt(R * R - reach * reach)) return false;
    }
    return true;
  }

  function layoutLabel(n) {
    const textEl = n.textEl, theme = n.theme;
    while (textEl.firstChild) textEl.removeChild(textEl.firstChild);

    const R = n.r * metrics().pad;                          // stay clear of the ring
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

    for (const { row, size, yc } of stack(best.rows, best.scale)) {
      const ts = document.createElementNS(NS, 'tspan');
      ts.setAttribute('x', 0);
      ts.setAttribute('y', yc.toFixed(2));
      ts.setAttribute('font-size', size.toFixed(2));
      if (row.italic) ts.setAttribute('font-style', 'italic');
      ts.textContent = row.text;
      textEl.appendChild(ts);
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
    const t = document.createElementNS(NS, 'text');
    t.setAttribute('dominant-baseline', 'central');
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
    viewSeg.innerHTML = ['map','list','review'].map(v =>
      `<button type="button" data-view="${v}" aria-pressed="${v === mode}">${esc(s.views[v])}</button>`).join('');
    searchEl.placeholder = s.search;

    // Arabic metrics differ from English, so every label must be re-fitted, and the
    // header height may change, which moves the layout bounds.
    computeAnchors();
    nodes.forEach(refresh);
    if (openTheme) openPanel(openTheme);
    applyMode();
  }

  // ——— views: map to browse, list to scan, review to memorise ———
  const viewSeg = document.getElementById('view-seg');
  const listEl = document.getElementById('list');
  const reviewEl = document.getElementById('review');
  const searchEl = document.getElementById('search');
  const norm = s => String(s).toLowerCase().replace(/[\u064B-\u0652\u0640]/g, '');

  function matches(theme) {
    if (!query) return true;
    const q = norm(query);
    const hay = [pick(theme.label, lang), pick(theme.label, 'en'), pick(theme.summary, lang),
                 ...theme.verses.map(v => v.ref + ' ' + localizeRef(v.ref, lang) + ' ' + (v.text.esv || ''))].join(' ');
    return norm(hay).includes(q);
  }

  const pips = e => '●'.repeat(e) + '○'.repeat(3 - e);

  function renderList() {
    const hubs = THEMES.filter(t => t.category === 'hub');
    let html = '<div class="list-inner">';
    let shown = 0;
    const section = (heading, items, hubId) => {
      const hits = items.filter(matches);
      if (!hits.length) return '';
      shown += hits.length;
      const head = hubId
        ? `<button class="group-head" data-id="${hubId}"><h3>${esc(heading)}</h3><span class="count">${hits.length}</span></button>`
        : `<div class="group-head"><h3>${esc(heading)}</h3><span class="count">${hits.length}</span></div>`;
      return head +
        hits.map(t => `<button class="row ${t.category}" data-id="${t.id}">
          <span class="pips" title="${esc(ui().emphasisNote[t.emphasis])}">${pips(t.emphasis)}</span>
          <span class="name">${esc(pick(t.label, lang))}</span>
          <span class="blurb">${esc(pick(t.summary, lang))}</span></button>`).join('');
    };
    html += section(ui().categories.center, THEMES.filter(t => t.category === 'center'));
    hubs.forEach(h => { html += section(pick(h.label, lang), THEMES.filter(t => t.parent === h.id), h.id); });
    if (!shown) html += `<p class="empty">${esc(ui().noMatches)}</p>`;
    listEl.innerHTML = html + '</div>';
  }

  // ——— review deck ———
  let deck = [], deckPos = 0, revealed = false, deckGroup = 'all';

  function buildDeck(keepPos) {
    deck = THEMES.filter(t => t.category !== 'hub')
      .filter(t => deckGroup === 'all' || t.parent === deckGroup || t.id === deckGroup)
      .filter(matches);
    if (!keepPos) deckPos = 0;
    if (deckPos >= deck.length) deckPos = 0;
    revealed = false;
  }

  function renderReview() {
    const top = document.getElementById('review-top');
    const card = document.getElementById('review-card');
    const actions = document.getElementById('review-actions');
    const hubs = THEMES.filter(t => t.category === 'hub');
    top.innerHTML = `<select id="deck-group">
        <option value="all">${esc(ui().allGroups)}</option>
        ${hubs.map(h => `<option value="${h.id}">${esc(pick(h.label, lang))}</option>`).join('')}
      </select>
      <span>${deck.length ? deckPos + 1 : 0} ${esc(ui().ofCount)} ${deck.length}</span>
      <button class="btn" id="shuffle">${esc(ui().shuffle)}</button>`;
    document.getElementById('deck-group').value = deckGroup;

    if (!deck.length) { card.innerHTML = `<p class="empty">${esc(ui().noMatches)}</p>`; actions.innerHTML = ''; return; }
    const t = deck[deckPos];
    card.innerHTML = `
      <div class="cat">${esc(ui().categories[t.category] || '')}</div>
      <h2>${esc(pick(t.label, lang))}</h2>
      <div class="emph">${esc(ui().emphasisNote[t.emphasis])}</div>
      ${revealed ? `<div class="back"><p class="summary">${esc(pick(t.summary, lang))}</p>
        ${t.verses.map(verseHTML).join('')}</div>` : ''}`;
    actions.innerHTML = `
      <button class="btn" id="rev-prev">${esc(ui().prev)}</button>
      ${revealed ? '' : `<button class="btn primary" id="rev-show">${esc(ui().showVerses)}</button>`}
      <button class="btn ${revealed ? 'primary' : ''}" id="rev-next">${esc(ui().next)}</button>
      <p class="review-hint">${esc(ui().reviewHint)}</p>`;
  }

  function applyMode() {
    document.getElementById('graph').hidden = mode !== 'map';
    document.getElementById('legend').style.display = mode === 'map' ? '' : 'none';
    document.getElementById('hint').style.display = mode === 'map' && innerWidth <= 640 ? '' : 'none';
    listEl.hidden = mode !== 'list';
    reviewEl.hidden = mode !== 'review';
    document.getElementById('header').style.display = mode === 'map' ? '' : 'none';
    viewSeg.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', b.dataset.view === mode));
    const barH = document.getElementById('topbar').getBoundingClientRect().height;
    listEl.style.paddingTop = (barH + 14) + 'px';
    reviewEl.style.paddingTop = (barH + 14) + 'px';
    if (mode === 'list') renderList();
    if (mode === 'review') { buildDeck(true); renderReview(); }
    if (mode === 'map') { computeAnchors(); nodes.forEach(refresh); applySearchToMap(); }
    store.set('view', mode);
  }

  function applySearchToMap() {
    nodes.forEach(n => {
      const hit = matches(n.theme);
      n.el.classList.toggle('dim', !!query && !hit);
      n.el.classList.toggle('match', !!query && hit);
    });
  }

  viewSeg.addEventListener('click', e => {
    const btn = e.target.closest('button[data-view]');
    if (!btn) return;
    mode = btn.dataset.view;
    applyMode();
  });

  searchEl.addEventListener('input', () => {
    query = searchEl.value.trim();
    if (mode === 'list') renderList();
    else if (mode === 'review') { buildDeck(false); renderReview(); }
    else applySearchToMap();
  });

  listEl.addEventListener('click', e => {
    const hit = e.target.closest('.row, .group-head[data-id]');
    if (hit) openPanel(THEMES.find(t => t.id === hit.dataset.id));
  });

  reviewEl.addEventListener('click', e => {
    const id = e.target.id;
    if (id === 'rev-show') { revealed = true; renderReview(); }
    else if (id === 'rev-next') { deckPos = (deckPos + 1) % deck.length; revealed = false; renderReview(); }
    else if (id === 'rev-prev') { deckPos = (deckPos - 1 + deck.length) % deck.length; revealed = false; renderReview(); }
    else if (id === 'shuffle') {
      for (let i = deck.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [deck[i], deck[j]] = [deck[j], deck[i]]; }
      deckPos = 0; revealed = false; renderReview();
    }
  });
  reviewEl.addEventListener('change', e => {
    if (e.target.id === 'deck-group') { deckGroup = e.target.value; buildDeck(false); renderReview(); }
  });

  addEventListener('keydown', e => {
    if (e.target.matches('input, select, textarea')) {
      if (e.key === 'Escape') { searchEl.value = ''; query = ''; searchEl.blur(); applyMode(); }
      return;
    }
    if (e.key === 'Escape') { closePanel(); return; }
    if (e.key === '/') { e.preventDefault(); searchEl.focus(); return; }
    if (mode !== 'review' || !deck.length) return;
    if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); if (revealed) { deckPos = (deckPos + 1) % deck.length; revealed = false; } else revealed = true; renderReview(); }
    else if (e.key === 'ArrowRight') { deckPos = (deckPos + 1) % deck.length; revealed = false; renderReview(); }
    else if (e.key === 'ArrowLeft') { deckPos = (deckPos - 1 + deck.length) % deck.length; revealed = false; renderReview(); }
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

  svg.addEventListener('wheel', e => {
    e.preventDefault();
    const px = e.deltaMode === 1 ? e.deltaY * 16 : e.deltaY;   // lines -> pixels
    zoomAt(e.clientX, e.clientY, Math.exp(-px * 0.0022));
  }, { passive: false });

  addEventListener('resize', () => { computeAnchors(); nodes.forEach(refresh); });

  // ——— physics: spring to anchor + soft repulsion = squishy, bouncy nodes ———
  const SPRING = 0.012, DAMP = 0.88, REPEL = 1.02, GAP = 7;
  function tick() {
    if (mode !== 'map') { requestAnimationFrame(tick); return; }
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
