/* FitAvatar — прорисованные формы тела (Nano Banana).
 * 4 формы × 2 пола: худой → обычная форма → атлет/фитоняшка → сухая форма (Men's Physique / Bikini).
 * На арене, после тренировки и при новом уровне вместо схемы показывается прорисовка текущей формы.
 * Нажатие на фигуру переключает «Форма» ↔ «Мой персонаж» (копия из редактора).
 * На экране «Прогресс» — карточка «Путь формы». Подключается до app.js и сам встраивается в window.Avatar. */
(function () {
  var ORDER = ['thin', 'norm', 'fit', 'pro'];
  var NAMES = {
    m: { thin: 'Худощавый', norm: 'Обычная форма', fit: 'Атлет', pro: 'Сухая форма' },
    f: { thin: 'Худощавая', norm: 'Обычная форма', fit: 'Фитоняшка', pro: 'Сухая форма' },
  };
  var NEXT = {
    thin: 'Силовые тренировки и питание с профицитом наберут массу.',
    norm: 'Силовые и кардио 3–4 раза в неделю подтянут фигуру.',
    fit: 'Дисциплина в питании и регулярные силовые доведут до сухой формы.',
    pro: 'Вершина: держите форму и помогайте друзьям прийти к ней.',
  };
  var KEY = 'fa_view';
  var src = function (g, s) { return 'fa-' + g + '-' + s + '.webp'; };
  var g = function (c) { return c && c.gender === 'f' ? 'f' : 'm'; };
  var view = function () { try { return localStorage.getItem(KEY) || 'form'; } catch (e) { return 'form'; } };

  var css = document.createElement('style');
  css.textContent =
    '.fa-form{position:relative;width:100%;height:300px;cursor:pointer;-webkit-tap-highlight-color:transparent}' +
    '.fa-form>img,.fa-form>svg{position:absolute;left:50%;bottom:0;height:100%;width:auto;max-height:none;transform:translateX(-50%);pointer-events:none}' +
    '.fa-form>img{filter:drop-shadow(0 10px 18px rgba(0,0,0,.45))}' +
    '.fa-chip{position:absolute;left:50%;top:0;transform:translateX(-50%);z-index:2;white-space:nowrap;font:600 12px/1 var(--body);color:#fff;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.16);backdrop-filter:blur(6px);padding:6px 10px;border-radius:99px;display:inline-flex;gap:6px;align-items:center}' +
    '.fa-chip i{font-style:normal;color:var(--accent)}' +
    '.levelup .fa-form{height:250px}.stage[style*="height"] .fa-form{height:100%}@media(max-width:360px){.arena .stage .fa-form{height:100%}}' +
    '.fa-path{display:grid;gap:12px}.fa-steps{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:6px}' +
    '.fa-step{display:grid;justify-items:center;gap:4px;text-align:center;border-radius:14px;padding:6px 2px 8px;background:var(--surface2)}' +
    '.fa-step img{height:110px;width:auto;max-width:100%;object-fit:contain}' +
    '.fa-step b{font:600 12px/1.2 var(--body)}.fa-step.next img{filter:grayscale(1) brightness(.55);opacity:.7}.fa-step.next b{color:var(--muted)}' +
    '.fa-step.on{background:var(--arena);color:#fff;box-shadow:inset 0 0 0 2px var(--accent)}';
  document.head.appendChild(css);

  function stageOf(av, c, fit) {
    var m = av.morph(c, fit || {});
    if (m.muscle >= 0.68 && m.fat <= 0.22) return 'pro';
    if (m.muscle >= 0.45 && m.fat <= 0.42) return 'fit';
    if (m.fat <= 0.1 && m.muscle < 0.35) return 'thin';
    return 'norm';
  }

  function patch(av) {
    var orig = av.render;
    av.original = orig;
    av.stage = function (c, fit) { return stageOf(av, c, fit); };
    av.stageName = function (c, fit) { return NAMES[g(c)][stageOf(av, c, fit)]; };
    av.render = function (c, fit, opts) {
      opts = opts || {};
      if (!opts.glow || !c || !c.gender) return orig.apply(this, arguments);
      var gg = g(c), st = stageOf(av, c, fit);
      if (view() === 'me') {
        return '<div class="fa-form" data-fa-toggle title="Показать форму">' + orig.apply(this, arguments) +
          '<span class="fa-chip">Мой персонаж <i>⇄</i></span></div>';
      }
      return '<div class="fa-form" data-fa-toggle title="Показать моего персонажа">' +
        '<img src="' + src(gg, st) + '" alt="' + NAMES[gg][st] + '" width="480" height="640" decoding="async">' +
        '<span class="fa-chip">' + NAMES[gg][st] + ' <i>⇄</i></span></div>';
    };
    av.__fa = true;
    // заранее подгружаем все формы, чтобы смена была мгновенной
    ['m', 'f'].forEach(function (x) { ORDER.forEach(function (s) { var i = new Image(); i.src = src(x, s); }); });
  }

  var _av;
  Object.defineProperty(window, 'Avatar', {
    configurable: true,
    get: function () { return _av; },
    set: function (v) { _av = v; if (v && v.render && !v.__fa) patch(v); },
  });

  // переключение «Форма» ↔ «Мой персонаж»
  document.addEventListener('click', function (e) {
    var t = e.target.closest && e.target.closest('[data-fa-toggle]');
    if (!t || t.closest('.levelup')) return;
    try { localStorage.setItem(KEY, view() === 'me' ? 'form' : 'me'); } catch (err) {}
    if (window.Platform && Platform.haptic) Platform.haptic('light');
    if (typeof window.render === 'function') window.render();
    else document.dispatchEvent(new Event('visibilitychange'));   // app.js перерисует экран
  }, true);

  // карточка «Путь формы» на экране «Прогресс»
  function pathCard() {
    var app = document.getElementById('app');
    if (!app || !_av || app.querySelector('.fa-path')) return;
    var h1 = app.querySelector('.screen > h1');
    if (!h1 || h1.textContent.trim() !== 'Прогресс') return;
    var c, fit;
    try {
      var st = JSON.parse(localStorage.getItem('fitavatar.v1') || 'null');
      if (!st || !st.char) return;
      var w = st.weights && st.weights.length ? st.weights[st.weights.length - 1].w : st.char.weight;
      c = Object.assign({}, st.char, { weight: w }); fit = st.fit || {};
    } catch (e) { return; }
    if (!c || !c.gender) return;
    var gg = g(c), cur = stageOf(_av, c, fit), ci = ORDER.indexOf(cur);
    var steps = ORDER.map(function (s, i) {
      var cls = i === ci ? 'on' : i > ci ? 'next' : 'done';
      return '<div class="fa-step ' + cls + '"><img src="' + src(gg, s) + '" alt="" loading="lazy"><b>' + NAMES[gg][s] + '</b></div>';
    }).join('');
    var card = document.createElement('div');
    card.className = 'card fa-path';
    card.innerHTML = '<h2>Путь формы</h2><div class="fa-steps">' + steps + '</div>' +
      '<div class="muted small">Сейчас: <b>' + NAMES[gg][cur] + '</b>. ' + NEXT[cur] +
      (cur === 'pro' ? '' : ' Финал — ' + (gg === 'f' ? 'форма как в Bikini fitness.' : 'форма как в Men’s Physique.')) + '</div>';
    h1.insertAdjacentElement('afterend', card);
  }
  var mo = new MutationObserver(pathCard);
  document.addEventListener('DOMContentLoaded', function () {
    var app = document.getElementById('app');
    if (app) { mo.observe(app, { childList: true }); pathCard(); }
  });
  if (document.readyState !== 'loading') {
    var app0 = document.getElementById('app');
    if (app0) mo.observe(app0, { childList: true });
  }
})();
