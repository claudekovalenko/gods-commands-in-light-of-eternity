// Springy radial graph — no dependencies.
(function () {
  const svg = document.getElementById('graph');
  const panel = document.getElementById('panel');
  const panelContent = document.getElementById('panel-content');
  const NS = 'http://www.w3.org/2000/svg';

  const CATEGORY_NAMES = {
    center: 'The Gospel — the entrance',
    hub: 'Category',
    kingdom: 'Entering the Kingdom',
    pursue: 'Pursue & grow in',
    avoid: 'Avoid & put to death',
    eternity: 'In light of eternity',
  };
  const EMPHASIS_NOTES = {
    1: 'Stated in Scripture.',
    2: 'Repeated in Scripture — God says it more than once.',
    3: 'Heavily emphasized — God presses this again and again across His Word.',
  };

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

    const headH = document.getElementById('header').offsetHeight || 90;
    const footH = document.getElementById('footer').offsetHeight || 24;
    bounds.minX = 6; bounds.maxX = W - 6;
    bounds.minY = headH + 4; bounds.maxY = H - footH - 4;

    const cx = W / 2, cy = (bounds.minY + bounds.maxY) / 2;
    const hubR = Math.min(W, H) * 0.26;

    const hubs = THEMES.filter(t => t.category === 'hub');
    hubs.forEach((h, i) => {
      const a = -Math.PI / 2 + (i / hubs.length) * Math.PI * 2;
      h._angle = a;
      place(byId[h.id], cx + Math.cos(a) * hubR, cy + Math.sin(a) * hubR);
    });
    place(byId['gospel'], cx, cy);

    hubs.forEach(h => {
      const leaves = THEMES.filter(t => t.parent === h.id);
      const spread = Math.min(Math.PI * 1.15, leaves.length * 0.38);
      leaves.forEach((t, i) => {
        const a = h._angle + (leaves.length === 1 ? 0 : (i / (leaves.length - 1) - 0.5) * spread);
        const r = hubR + Math.min(W, H) * (0.14 + (i % 2) * 0.075);
        place(byId[t.id], cx + Math.cos(a) * r, cy + Math.sin(a) * r);
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
    gauge.font = `${row.italic ? 'italic ' : ''}${row.weight ? row.weight + ' ' : ''}${size}px Georgia, 'Times New Roman', serif`;
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

  function fits(rows, scale, R) {
    for (const { row, size, yc } of stack(rows, scale)) {
      const reach = Math.abs(yc) + size * 0.40;   // furthest glyph edge from center
      if (reach >= R) return false;
      if (measure(row, size) / 2 > Math.sqrt(R * R - reach * reach)) return false;
    }
    return true;
  }

  function layoutLabel(n) {
    const t = n.textEl, theme = n.theme;
    while (t.firstChild) t.removeChild(t.firstChild);

    const R = n.r * 0.88;                                   // stay clear of the ring
    const maxSize = theme.category === 'center' ? n.r * 0.17 : n.r * 0.34;
    const weight = theme.category === 'center' ? 700 : 0;

    // Try every sensible wrap and score them.
    const candidates = [];
    for (let mc = 5; mc <= 26; mc++) {
      const rows = wrapWords(theme.label, mc).map(l => ({ text: l, rel: 1, italic: false, weight }));
      if (theme.sublabel) {
        for (const l of wrapWords(theme.sublabel, Math.max(mc, 12))) {
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
      best = { scale: 7, rows: wrapWords(theme.label, 9).map(l => ({ text: l, rel: 1, italic: false, weight })) };
    }

    for (const { row, size, yc } of stack(best.rows, best.scale)) {
      const ts = document.createElementNS(NS, 'tspan');
      ts.setAttribute('x', 0);
      ts.setAttribute('y', yc.toFixed(2));
      ts.setAttribute('font-size', size.toFixed(2));
      if (row.italic) ts.setAttribute('font-style', 'italic');
      ts.textContent = row.text;
      t.appendChild(ts);
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
  function openPanel(t) {
    const cat = t.category === 'center' ? CATEGORY_NAMES.center : CATEGORY_NAMES[t.category] || '';
    panelContent.innerHTML = `
      <h2>${t.label}${t.sublabel ? ' — ' + t.sublabel : ''}</h2>
      <div class="category-tag">${cat}</div>
      ${t.category !== 'hub' ? `<div class="emphasis-note">${EMPHASIS_NOTES[t.emphasis]}</div>` : ''}
      <p class="summary">${t.summary}</p>
      ${t.verses.map(v => `<div class="verse"><div class="ref">${v.ref} (ESV)</div><div class="text">&ldquo;${v.text}&rdquo;</div></div>`).join('')}
    `;
    panel.classList.add('open');
  }
  document.getElementById('panel-close').addEventListener('click', () => panel.classList.remove('open'));

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
      panel.classList.remove('open');
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
          const min = a.r + b.r + GAP;
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
  requestAnimationFrame(tick);
})();
