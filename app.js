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
    return Math.min(W, H) * (0.036 + t.emphasis * 0.004);
  }
  function strokeFor(t) {
    if (t.category === 'center') return 2;
    if (t.category === 'hub') return 2.5;
    return t.emphasis === 3 ? 3.5 : t.emphasis === 2 ? 2 : 1.2;
  }

  // ——— layout anchors: hubs on a ring, leaves fanned outward from their hub ———
  function computeAnchors() {
    W = innerWidth; H = innerHeight;
    const cx = W / 2, cy = H / 2 + 14;
    const hubR = Math.min(W, H) * 0.26;

    const hubs = THEMES.filter(t => t.category === 'hub');
    hubs.forEach((h, i) => {
      const a = -Math.PI / 2 + (i / hubs.length) * Math.PI * 2;
      h._angle = a;
      byId[h.id].ax = cx + Math.cos(a) * hubR;
      byId[h.id].ay = cy + Math.sin(a) * hubR;
    });
    byId['gospel'].ax = cx; byId['gospel'].ay = cy;

    const marginX = Math.min(W, H) * 0.06;
    const topM = 130, botM = 95;
    hubs.forEach(h => {
      const leaves = THEMES.filter(t => t.parent === h.id);
      const spread = Math.min(Math.PI * 1.15, leaves.length * 0.38);
      leaves.forEach((t, i) => {
        const a = h._angle + (leaves.length === 1 ? 0 : (i / (leaves.length - 1) - 0.5) * spread);
        const r = hubR + Math.min(W, H) * (0.14 + (i % 2) * 0.075);
        const n = byId[t.id];
        n.ax = Math.max(marginX, Math.min(W - marginX, cx + Math.cos(a) * r));
        n.ay = Math.max(topM, Math.min(H - botM, cy + Math.sin(a) * r));
      });
    });
    nodes.forEach(n => { n.r = radiusFor(n.theme); });
  }

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

  function wrapText(textEl, label, maxChars) {
    const words = label.split(' ');
    const lines = [];
    let cur = '';
    words.forEach(w => {
      if ((cur + ' ' + w).trim().length > maxChars && cur) { lines.push(cur); cur = w; }
      else cur = (cur + ' ' + w).trim();
    });
    if (cur) lines.push(cur);
    lines.forEach((l, i) => {
      const ts = document.createElementNS(NS, 'tspan');
      ts.setAttribute('x', 0);
      ts.setAttribute('dy', i === 0 ? `${-(lines.length - 1) * 0.55}em` : '1.1em');
      ts.textContent = l;
      textEl.appendChild(ts);
    });
  }

  nodes.forEach(n => {
    const g = document.createElementNS(NS, 'g');
    g.setAttribute('class', `node ${n.theme.category}`);
    const c = document.createElementNS(NS, 'circle');
    c.setAttribute('r', n.r);
    c.setAttribute('stroke-width', strokeFor(n.theme));
    const t = document.createElementNS(NS, 'text');
    const fs = n.theme.category === 'center' ? n.r * 0.155 : n.theme.category === 'hub' ? n.r * 0.24 : n.r * 0.26;
    t.setAttribute('font-size', Math.max(9, fs));
    wrapText(t, n.theme.label, n.theme.category === 'center' ? 14 : 11);
    if (n.theme.sublabel) {
      const ts = document.createElementNS(NS, 'tspan');
      ts.setAttribute('x', 0); ts.setAttribute('dy', '1.5em');
      ts.setAttribute('font-style', 'italic');
      ts.setAttribute('font-size', Math.max(8, fs * 0.8));
      ts.textContent = n.theme.sublabel;
      t.appendChild(ts);
    }
    g.appendChild(c); g.appendChild(t);
    nodeLayer.appendChild(g);
    n.el = g; n.circle = c;

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
  svg.addEventListener('pointerdown', e => { if (e.target === svg) panel.classList.remove('open'); });

  // ——— dragging ———
  let dragNode = null, dragOff = { x: 0, y: 0 };
  nodes.forEach(n => {
    n.el.addEventListener('pointerdown', e => {
      dragNode = n; n.dragging = true; n.moved = false;
      dragOff.x = n.x - e.clientX; dragOff.y = n.y - e.clientY;
      svg.classList.add('dragging');
      n.el.setPointerCapture && e.target.setPointerCapture(e.pointerId);
      e.preventDefault();
    });
  });
  addEventListener('pointermove', e => {
    if (!dragNode) return;
    const nx = e.clientX + dragOff.x, ny = e.clientY + dragOff.y;
    if (Math.hypot(nx - dragNode.x, ny - dragNode.y) > 3) dragNode.moved = true;
    dragNode.vx = (nx - dragNode.x) * 0.6;
    dragNode.vy = (ny - dragNode.y) * 0.6;
    dragNode.x = nx; dragNode.y = ny;
  });
  addEventListener('pointerup', () => {
    if (dragNode) { dragNode.dragging = false; dragNode = null; svg.classList.remove('dragging'); }
  });

  addEventListener('resize', computeAnchors);

  // ——— physics: spring to anchor + soft repulsion = squishy, bouncy nodes ———
  const SPRING = 0.012, DAMP = 0.88, REPEL = 1.15;
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
      if (!n.dragging) { n.vx *= DAMP; n.vy *= DAMP; n.x += n.vx; n.y += n.vy; }
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
