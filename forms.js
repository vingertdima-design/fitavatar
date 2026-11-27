/* FitAvatar — персонажи из картинок Nano Banana.
 * Персонаж собирается слоями: тело (4 формы × пол) + причёска + одежда, волосы перекрашиваются на лету.
 * Картинки: c-{g}-{форма}.webp — тело; c-{g}-h-{причёска}-{форма}.webp — слой причёски;
 * c-{g}-{слот}-{вещь}-{форма}.webp — слой одежды; c-{g}-face-{глаза}.webp — портрет; gym.webp — фон зала.
 * Волосы на исходниках залиты ключевым синим — здесь он меняется на выбранный цвет.
 * Подключается до app.js и сам встраивается в window.Avatar (render/stage) и window.LOOK (редактор, гардероб). */
(function () {
  var ORDER = ['thin', 'norm', 'fit', 'pro'];
  var NAMES = {
    m: { thin: 'Худощавый', norm: 'Обычная форма', fit: 'Атлет', pro: 'Сухая форма' },
    f: { thin: 'Худощавая', norm: 'Обычная форма', fit: 'Фитоняшка', pro: 'Сухая форма' },
  };
  var BUILD = { thin: 'slim', norm: 'average', fit: 'athletic', pro: 'shredded' };
  var NEXT = {
    thin: 'Силовые тренировки и питание с профицитом наберут массу.',
    norm: 'Силовые и кардио 3–4 раза в неделю подтянут фигуру.',
    fit: 'Дисциплина в питании и регулярные силовые доведут до сухой формы.',
    pro: 'Вершина: держите форму и помогайте друзьям прийти к ней.',
  };
  var HAIRS = {
    m: [['a', 'Кроп'], ['b', 'Андеркат'], ['c', 'Кудри']],
    f: [['a', 'Пучок'], ['b', 'Хвост'], ['c', 'Длинные'], ['d', 'Каре']],
  };
  // цвет волос: тени → блики
  var HCOL = [
    ['Чёрные', [12, 10, 10], [74, 62, 56]],
    ['Каштановые', [38, 21, 12], [148, 92, 52]],
    ['Русые', [66, 50, 34], [196, 158, 108]],
    ['Блонд', [112, 82, 42], [248, 222, 160]],
    ['Рыжие', [88, 24, 8], [232, 112, 42]],
    ['Пепельные', [60, 60, 64], [210, 210, 214]],
  ];
  var EYES = [['1', 'Миндалевидные'], ['2', 'Большие круглые'], ['3', 'Узкие']];
  // гардероб: base — выдаётся сразу; slot t — верх, b — низ, s — обувь, a — аксессуар
  var ITEMS = {
    m: [
      { id: 'tank', slot: 't', name: 'Майка', price: 0, base: 1 },
      { id: 'tee', slot: 't', name: 'Футболка', price: 120 },
      { id: 'rash', slot: 't', name: 'Рашгард', price: 250 },
      { id: 'shorts', slot: 'b', name: 'Шорты', price: 0, base: 1 },
      { id: 'pants', slot: 'b', name: 'Широкие штаны', price: 200 },
      { id: 'snk', slot: 's', name: 'Кроссовки', price: 0, base: 1 },
      { id: 'hi', slot: 's', name: 'Кроссовки High', price: 180 },
      { id: 'hood', slot: 't', name: 'Худи FITAVATAR оверсайз', price: 300, brand: 1 },
    ],
    f: [
      { id: 'top', slot: 't', name: 'Спортивный топ', price: 0, base: 1 },
      { id: 'crop', slot: 't', name: 'Топ-майка', price: 120 },
      { id: 'rash', slot: 't', name: 'Рашгард', price: 250 },
      { id: 'shorts', slot: 'b', name: 'Шорты', price: 0, base: 1 },
      { id: 'legs', slot: 'b', name: 'Лосины', price: 150 },
      { id: 'snk', slot: 's', name: 'Кроссовки', price: 0, base: 1 },
      { id: 'hi', slot: 's', name: 'Кроссовки Pro', price: 180 },
      { id: 'band', slot: 'a', name: 'Повязка', price: 80 },
      { id: 'hood', slot: 't', name: 'Худи FITAVATAR оверсайз', price: 300, brand: 1 },
    ],
  };
  var SLOTS = [['t', 'Верх'], ['b', 'Низ'], ['s', 'Обувь'], ['a', 'Аксессуары']];
  var SLOT_ORDER = ['t', 'b', 's'];   // порядок наложения; причёска и аксессуар — поверх

  var g = function (c) { return c && c.gender === 'f' ? 'f' : 'm'; };
  var look = function (c) {
    var l = (c && c.look) || {}, gg = g(c);
    var h = HAIRS[gg].some(function (x) { return x[0] === l.h; }) ? l.h : 'a';
    return { h: h, hc: l.hc >= 0 && l.hc < HCOL.length ? l.hc : (gg === 'f' ? 1 : 0), eye: l.eye || '1' };
  };
  var itemsOf = function (gg) { return ITEMS[gg]; };
  var itemById = function (gg, id) { return ITEMS[gg].filter(function (x) { return x.id === id; })[0]; };
  var wearOf = function (c, wardrobe) {
    var gg = g(c), w = (wardrobe && wardrobe.wear && wardrobe.wear[gg]) || {}, out = {};
    SLOTS.forEach(function (s) {
      var it = w[s[0]] && itemById(gg, w[s[0]]);
      out[s[0]] = it && !it.base ? it.id : '';
    });
    return out;
  };

  /* ---------- форма тела ---------- */
  function stageOf(c, fit) {
    var start = { slim: 0, average: 1, athletic: 2, shredded: 3 }[c && c.body];
    if (start == null) start = 1;
    fit = fit || {};
    var p = (fit.muscleGain || 0) + (fit.fatLoss || 0);
    return ORDER[Math.min(3, start + Math.floor(p / 0.22))];
  }

  /* ---------- сборка картинки ---------- */
  var imgCache = {}, outCache = {}, pending = {};
  function loadImg(src) {
    if (!imgCache[src]) imgCache[src] = new Promise(function (ok) {
      var i = new Image(); i.decoding = 'async';
      i.onload = function () { ok(i); }; i.onerror = function () { ok(null); }; i.src = src;
    });
    return imgCache[src];
  }
  function tint(ctx, w, h, hc) {
    var col = HCOL[hc] || HCOL[0], dk = col[1], lt = col[2];
    var d = ctx.getImageData(0, 0, w, h), p = d.data;
    for (var i = 0; i < p.length; i += 4) {
      if (!p[i + 3]) continue;
      var r = p[i], gr = p[i + 1], b = p[i + 2], k = b - Math.max(r, gr), edge = p[i + 3] < 250, k0 = edge ? 4 : 11;
      if (k < k0) continue;
      var wgt = Math.min(1, (k - k0) / (edge ? 24 : 40));
      var L = Math.min(1, (0.3 * r + 0.4 * gr + 0.3 * b + b * 0.25) / 150), t = Math.pow(L, 1.1);
      for (var j = 0; j < 3; j++) { var v = dk[j] + (lt[j] - dk[j]) * t; p[i + j] = Math.round(p[i + j] * (1 - wgt) + v * wgt); }
    }
    ctx.putImageData(d, 0, 0);
  }
  // точки для логотипа на одежде (в координатах 480×640)
  var LOGO = {
    m: { thin: [258, 212, 338], norm: [262, 214, 339], fit: [266, 210, 330], pro: [266, 205, 320] },
    f: { thin: [250, 208, 298], norm: [252, 208, 298], fit: [252, 206, 303], pro: [252, 206, 313] },
  };
  function keyOf(gg, st, L, wear, kind) {
    return [kind || 'body', gg, st, L.h, L.hc, L.eye, wear.t, wear.b, wear.s, wear.a].join('|');
  }
  function compose(gg, st, L, wear) {
    var key = keyOf(gg, st, L, wear);
    if (outCache[key]) return Promise.resolve(outCache[key]);
    if (pending[key]) return pending[key];
    // порядок: база (тонируется) → одежда (без тонировки) → причёска (тонируется отдельно) → аксессуар
    var srcs = ['c-' + gg + '-' + st + '.webp'], clothes = [];
    SLOT_ORDER.forEach(function (s) { if (wear[s]) clothes.push('c-' + gg + '-' + s + '-' + wear[s] + '-' + st + '.webp'); });
    var hairSrc = L.h !== 'a' ? 'c-' + gg + '-h-' + L.h + '-' + st + '.webp' : '';
    var accSrc = wear.a ? 'c-' + gg + '-a-' + wear.a + '-' + st + '.webp' : '';
    var all = srcs.concat(clothes, [hairSrc, accSrc]).map(function (s) { return s ? loadImg(s) : Promise.resolve(null); });
    pending[key] = Promise.all(all.concat([loadImg('logo.png')])).then(function (ims) {
      var logo = ims.pop(), c = document.createElement('canvas'); c.width = 480; c.height = 640;
      var x = c.getContext('2d', { willReadFrequently: true });
      if (ims[0]) x.drawImage(ims[0], 0, 0, 480, 640);
      try { tint(x, 480, 640, L.hc); } catch (e) {}
      ims.slice(1, 1 + clothes.length).forEach(function (im) { if (im) x.drawImage(im, 0, 0, 480, 640); });
      var hairIm = ims[1 + clothes.length], accIm = ims[2 + clothes.length];
      if (hairIm) {
        var hc = document.createElement('canvas'); hc.width = 480; hc.height = 640;
        var hx = hc.getContext('2d', { willReadFrequently: true }); hx.drawImage(hairIm, 0, 0, 480, 640);
        try { tint(hx, 480, 640, L.hc); } catch (e) {}
        x.drawImage(hc, 0, 0);
      }
      if (accIm) x.drawImage(accIm, 0, 0, 480, 640);
      var topIt = wear.t && itemById(gg, wear.t);
      if (logo && !(topIt && topIt.brand)) {
        var p = LOGO[gg][st], s = 15;
        var bare = gg === 'm' && st === 'pro' && !wear.t;   // сухая форма у парня — без майки
        if (!bare) { x.save(); x.globalAlpha = 0.92; x.beginPath(); x.arc(p[0], p[1], s / 2 + 1, 0, 6.3); x.clip(); x.drawImage(logo, p[0] - s / 2, p[1] - s / 2, s, s); x.restore(); }
        x.save(); x.globalAlpha = 0.9; x.beginPath(); x.arc(p[0] + 12, p[2] + 40, s / 2, 0, 6.3); x.clip(); x.drawImage(logo, p[0] + 12 - s / 2, p[2] + 40 - s / 2, s, s); x.restore();
      }
      var url = c.toDataURL('image/webp', 0.9);
      outCache[key] = url; delete pending[key]; return url;
    });
    return pending[key];
  }
  function composeFace(gg, L) {
    var key = ['face', gg, L.h, L.hc, L.eye].join('|');
    if (outCache[key]) return Promise.resolve(outCache[key]);
    if (pending[key]) return pending[key];
    var srcs = ['c-' + gg + '-face-' + L.eye + '.webp'];
    if (L.h !== 'a') srcs.push('c-' + gg + '-fh-' + L.h + '-' + L.eye + '.webp');
    pending[key] = Promise.all(srcs.map(loadImg)).then(function (ims) {
      var w = ims[0] ? ims[0].naturalWidth : 400, h = ims[0] ? ims[0].naturalHeight : 400;
      var c = document.createElement('canvas'); c.width = w; c.height = h; var x = c.getContext('2d', { willReadFrequently: true });
      ims.forEach(function (im) { if (im) x.drawImage(im, 0, 0, w, h); });
      try { tint(x, w, h, L.hc); } catch (e) {}
      var url = c.toDataURL('image/webp', 0.9); outCache[key] = url; delete pending[key]; return url;
    });
    return pending[key];
  }
  // <img data-fa="..."> дорисовываются, когда картинка собрана
  function hydrate(root) {
    var list = (root || document).querySelectorAll('img[data-fa]:not([data-fa-done])');
    Array.prototype.forEach.call(list, function (im) {
      var a = JSON.parse(im.getAttribute('data-fa')); im.setAttribute('data-fa-done', '1');
      var pr = a.face ? composeFace(a.g, a.L) : compose(a.g, a.st, a.L, a.w);
      pr.then(function (u) { im.src = u; im.classList.add('on'); });
    });
  }
  var mo = new MutationObserver(function () { hydrate(); });
  function startObs() { mo.observe(document.body, { childList: true, subtree: true }); hydrate(); }
  if (document.body) startObs(); else document.addEventListener('DOMContentLoaded', startObs);

  function imgTag(c, st, wear, cls, faceMode) {
    var gg = g(c), L = look(c), a = faceMode ? { face: 1, g: gg, L: L } : { g: gg, st: st, L: L, w: wear };
    var key = faceMode ? ['face', gg, L.h, L.hc, L.eye].join('|') : keyOf(gg, st, L, wear);
    var ready = outCache[key];
    return '<img class="fa-img ' + (cls || '') + (ready ? ' on' : '') + '" alt="" ' + (ready ? 'src="' + ready + '" data-fa-done="1" ' : '') +
      'data-fa=\'' + JSON.stringify(a).replace(/'/g, '&#39;') + '\' width="480" height="' + (faceMode ? 480 : 640) + '">';
  }

  var css = document.createElement('style');
  css.textContent =
    '.fa-img{opacity:0;transition:opacity .25s}.fa-img.on{opacity:1}' +
    '.fa-form{position:relative;width:100%;height:310px;-webkit-tap-highlight-color:transparent}' +
    '.fa-form>.fa-img{position:absolute;left:50%;bottom:0;height:calc(100% - 24px);width:auto;max-width:none;transform:translateX(-50%) scale(1.06);transform-origin:50% 100%;filter:drop-shadow(0 10px 18px rgba(0,0,0,.5));pointer-events:none}' +
    '.fa-chip{position:absolute;left:50%;top:0;transform:translateX(-50%);z-index:2;white-space:nowrap;font:600 12px/1 var(--body);color:#fff;background:rgba(0,0,0,.35);border:1px solid rgba(255,255,255,.16);backdrop-filter:blur(6px);padding:6px 10px;border-radius:99px}' +
    '.gymbg{background:linear-gradient(180deg,rgba(11,12,15,.15),rgba(11,12,15,.55) 70%,rgba(11,12,15,.9)),url(gym.webp) center 30%/cover,#15161b!important}' +
    '.arena.gymbg::after{display:none}' +
    '.levelup .fa-form{height:250px}.stage[style*="height"] .fa-form{height:100%}@media(max-width:360px){.arena .stage .fa-form{height:100%}}' +
    '.fa-path{display:grid;gap:12px}.fa-steps{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:6px}' +
    '.fa-step{display:grid;justify-items:center;gap:4px;text-align:center;border-radius:14px;padding:6px 2px 8px;background:var(--surface2)}' +
    '.fa-step .fa-img{height:140px;width:auto;max-width:100%;object-fit:contain}' +
    '.fa-step b{font:600 12px/1.2 var(--body)}.fa-step.next .fa-img{filter:grayscale(1) brightness(.55)}.fa-step.next b{color:var(--muted)}' +
    '.fa-step.on{background:var(--arena);color:#fff;box-shadow:inset 0 0 0 2px var(--accent)}';
  document.head.appendChild(css);

  var getWardrobe = function () { try { var s = JSON.parse(localStorage.getItem('fitavatar.v1') || 'null'); return (s && s.wardrobe) || null; } catch (e) { return null; } };

  function patch(av) {
    av.original = av.render;
    av.stage = function (c, fit) { return stageOf(c, fit); };
    av.stageName = function (c, fit) { return NAMES[g(c)][stageOf(c, fit)]; };
    av.render = function (c, fit, opts) {
      opts = opts || {};
      if (!c || !c.gender) return '';
      var gg = g(c), st = opts.stage || stageOf(c, fit);
      var wear = opts.wear || wearOf(c, opts.wardrobe || (window.LOOK && LOOK.wardrobe && LOOK.wardrobe()) || getWardrobe());
      return '<div class="fa-form">' + imgTag(c, st, wear) +
        (opts.glow ? '<span class="fa-chip">' + NAMES[gg][st] + '</span>' : '') + '</div>';
    };
    av.__fa = true;
    ['m', 'f'].forEach(function (x) { ORDER.forEach(function (s) { loadImg('c-' + x + '-' + s + '.webp'); }); });
    loadImg('logo.png'); loadImg('gym.webp');
  }
  var _av;
  Object.defineProperty(window, 'Avatar', {
    configurable: true,
    get: function () { return _av; },
    set: function (v) { _av = v; if (v && v.render && !v.__fa) patch(v); },
  });

  window.LOOK = {
    ORDER: ORDER, NAMES: NAMES, BUILD: BUILD, HAIRS: HAIRS, HCOL: HCOL, EYES: EYES, ITEMS: ITEMS, SLOTS: SLOTS,
    look: look, stage: stageOf, itemsOf: itemsOf, itemById: itemById, wearOf: wearOf,
    img: function (c, st, wear, cls) { return imgTag(c, st, wear || {}, cls); },
    face: function (c, cls) { return imgTag(c, null, null, cls, true); },
    hydrate: hydrate, wardrobe: null,
  };

  // карточка «Путь формы» на экране «Прогресс»
  function pathCard() {
    var app = document.getElementById('app');
    if (!app || !_av || app.querySelector('.fa-path')) return;
    var h1 = app.querySelector('.screen > h1');
    if (!h1 || h1.textContent.trim() !== 'Прогресс') return;
    var c, fit, wr;
    try {
      var st = JSON.parse(localStorage.getItem('fitavatar.v1') || 'null');
      if (!st || !st.char) return;
      c = st.char; fit = st.fit || {}; wr = st.wardrobe;
    } catch (e) { return; }
    if (!c || !c.gender) return;
    var gg = g(c), cur = stageOf(c, fit), ci = ORDER.indexOf(cur), wear = wearOf(c, wr);
    var steps = ORDER.map(function (s, i) {
      var cls = i === ci ? 'on' : i > ci ? 'next' : 'done';
      return '<div class="fa-step ' + cls + '">' + imgTag(c, s, wear) + '<b>' + NAMES[gg][s] + '</b></div>';
    }).join('');
    var card = document.createElement('div');
    card.className = 'card fa-path';
    card.innerHTML = '<h2>Путь формы</h2><div class="fa-steps">' + steps + '</div>' +
      '<div class="muted small">Сейчас: <b>' + NAMES[gg][cur] + '</b>. ' + NEXT[cur] +
      (cur === 'pro' ? '' : ' Финал — ' + (gg === 'f' ? 'форма как в Bikini fitness.' : 'форма как в Men’s Physique.')) + '</div>';
    h1.insertAdjacentElement('afterend', card);
  }
  var mo2 = new MutationObserver(pathCard);
  function startPath() { var app = document.getElementById('app'); if (app) { mo2.observe(app, { childList: true }); pathCard(); } }
  if (document.readyState !== 'loading') startPath(); else document.addEventListener('DOMContentLoaded', startPath);
})();
