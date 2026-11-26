/* FitAvatar — основное приложение */
{
const D = window.DATA, AV = window.Avatar, PF = window.Platform;
const $ = (s, r = document) => r.querySelector(s);
const esc = (v) => String(v ?? '').replace(/[&<>"']/g, ch => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[ch]));
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const dkey = (d = new Date()) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const today = () => dkey();
const fmt = (n) => Math.round(n).toLocaleString('ru-RU');
const plural = (n, a, b, c) => { const m = n % 10, h = n % 100; return m === 1 && h !== 11 ? a : m >= 2 && m <= 4 && (h < 10 || h >= 20) ? b : c; };

/* ---------- Иконки ---------- */
const I = (d, extra = '') => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ${extra}>${d}</svg>`;
const IC = {
  shirt: I('<path d="M8 3 4 6l2 4 2-1v12h8V9l2 1 2-4-4-3c-.5 1.5-2 2.5-4 2.5S8.5 4.5 8 3z"/>'),
  home: I('<path d="M3 11 12 4l9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>'),
  dumbbell: I('<path d="M6 7v10M3 9v6M18 7v10M21 9v6M6 12h12"/>'),
  apple: I('<path d="M12 7c-1-3 1-4 3-4M12 7C9 5 4 6 4 12c0 5 3 9 5 9 1.5 0 2-.7 3-.7s1.5.7 3 .7c2 0 5-4 5-9 0-6-5-7-8-5z"/>'),
  chart: I('<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>'),
  user: I('<circle cx="12" cy="8" r="4"/><path d="M4 21c1-4 4-6 8-6s7 2 8 6"/>'),
  flame: I('<path d="M12 22c4 0 7-3 7-7 0-5-5-7-5-12-3 2-4 5-4 7-1-1-2-2-2-4-2 2-3 5-3 9 0 4 3 7 7 7z"/>'),
  drop: I('<path d="M12 3s7 7 7 12a7 7 0 0 1-14 0c0-5 7-12 7-12z"/>'),
  shoe: I('<path d="M3 16c0-3 1-9 3-9 1 0 1 3 4 3 1 0 2-1 3 0l6 3c2 1 2 3 2 4v1H3z"/><path d="M3 18h18"/>'),
  bolt: I('<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>'),
  medal: I('<circle cx="12" cy="15" r="6"/><path d="m8 3 4 6 4-6M12 12v3l2 1"/>'),
  trophy: I('<path d="M8 4h8v5a4 4 0 0 1-8 0zM8 6H4c0 3 2 5 4 5M16 6h4c0 3-2 5-4 5M12 13v4M8 21h8M9 17h6"/>'),
  crown: I('<path d="m3 7 4 4 5-7 5 7 4-4-2 12H5z"/>'),
  star: I('<path d="m12 3 2.8 5.8 6.2.9-4.5 4.4 1 6.2L12 17.4 6.5 20.3l1-6.2L3 9.7l6.2-.9z"/>'),
  scale: I('<rect x="3" y="4" width="18" height="16" rx="4"/><path d="M9 9a4 4 0 0 1 6 0l-3 3"/>'),
  check: I('<path d="m5 12 5 5 9-10"/>', 'stroke-width="3"'),
  plus: I('<path d="M12 5v14M5 12h14"/>'),
  play: I('<path d="M7 4v16l13-8z" fill="currentColor"/>'),
  close: I('<path d="M6 6l12 12M18 6 6 18"/>'),
  chev: I('<path d="m9 6 6 6-6 6"/>'),
  back: I('<path d="m15 6-6 6 6 6"/>'),
  edit: I('<path d="M4 20h4L19 9l-4-4L4 16z"/>'),
  trash: I('<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/>'),
  heart: I('<path d="M12 20s-8-5-8-11a4 4 0 0 1 8-1 4 4 0 0 1 8 1c0 6-8 11-8 11z"/>'),
  phone: I('<rect x="7" y="2" width="10" height="20" rx="2"/><path d="M11 18h2"/>'),
  bell: I('<path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4zM10 20a2 2 0 0 0 4 0"/>'),
  share: I('<path d="M4 12v7h16v-7M12 3v12M7 8l5-5 5 5"/>'),
  insta: I('<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/>'),
  video: I('<rect x="3" y="6" width="13" height="12" rx="2"/><path d="m16 10 5-3v10l-5-3"/>'),
};

/* ---------- Состояние ---------- */
const blankDay = () => ({ done:{}, water:0, steps:0, stepsXp:0, food:[], workouts:[], xp:0 });
const defaults = () => ({
  v:1, ts:Date.now(), char:null, fit:{ muscleGain:0, fatLoss:0 }, xp:0, stats:{ str:0, end:0, flex:0, disc:0 },
  days:{}, tasks:[], weights:[], log:{}, program:{ id:'start', next:0 }, ach:{}, wardrobe:{ own:[], wear:{ m:{}, f:{} } },
  settings:{ stepGoal:8000, rest:45, remind:false, remindAt:'19:00', health:false }, lastActive:null, tab:'home',
});
let S = Object.assign(defaults(), PF.store.load() || {});
function migrateLook() { if (S.coins == null) S.coins = Math.round((S.xp || 0) / 2); S.wardrobe ||= { own:[], wear:{ m:{}, f:{} } }; S.wardrobe.own ||= []; S.wardrobe.wear ||= { m:{}, f:{} }; S.wardrobe.wear.m ||= {}; S.wardrobe.wear.f ||= {};
  if (S.char && !S.char.look) S.char.look = { h:'a', hc:S.char.gender === 'f' ? 1 : 0, eye:'1' }; if (S.char && !['slim','average','athletic','shredded'].includes(S.char.body)) S.char.body = 'average'; }
migrateLook(); window.LOOK && (LOOK.wardrobe = () => S.wardrobe);
const save = () => { S.ts = Date.now(); PF.store.save(S); };
const day = (k = today()) => (S.days[k] ||= blankDay());
const curWeight = () => (S.weights.length ? S.weights[S.weights.length - 1].w : S.char?.weight) || 70;
const CFG = window.FA_CONFIG || {}, PRO = CFG.pro || {};
const isPro = () => !!(S.pro && (S.pro.full || S.pro.until > Date.now()));
// Уровни доступа: 0 — бесплатно, 1 — подписчик Instagram, 2 — полный пакет за звёзды
const isOwner = () => { const u = PF.tgUser(); return !!(u && (CFG.ownerIds || []).map(String).includes(String(u.id))); };
const tier = () => (isOwner() || isPro()) ? 2 : (S.igOk ? 1 : 0);
const TIER_NAME = ['Бесплатный доступ', 'Подписчик', 'Полный пакет'];
const progTier = (id) => (D.progById[id]?.tier ?? 0);
const exTier = (x) => (x && x.tier) ?? 1;
const exLocked = (x) => PRO.enabled !== false && exTier(x) > tier();
const isLocked = (progId) => PRO.enabled !== false && progTier(progId) > tier();
const lockTag = (t) => t >= 2 ? '<span class="tag pro">⭐ Полный пакет</span>' : '<span class="tag lock">Для подписчиков</span>';
const igUrl = () => 'https://www.instagram.com/' + encodeURIComponent(CFG.instagram || '');
const gateOn = () => !!(CFG.instagram && CFG.instagramGate === 'hard' && !PF.isNative && !S.igOk);
const charNow = () => Object.assign({}, S.char, { weight: curWeight() });

/* ---------- Уровни ---------- */
const RANKS = ['Новичок','Любитель','Атлет','Боец','Чемпион','Легенда'];
function levelInfo(xp = S.xp) {
  let lvl = 1, need = 100, rest = xp;
  while (rest >= need) { rest -= need; lvl++; need = 100 + (lvl - 1) * 60; }
  return { lvl, cur:rest, need, rank: RANKS[Math.min(RANKS.length - 1, Math.floor((lvl - 1) / 4))] };
}
const statLevel = (v) => Math.min(100, Math.round(Math.sqrt(v) * 6));

function addXP(n, stats = {}) {
  const before = levelInfo().lvl;
  S.xp = Math.max(0, S.xp + n);
  if (n > 0) S.coins = (S.coins || 0) + n;
  day().xp += n;
  for (const k in stats) S.stats[k] = Math.max(0, (S.stats[k] || 0) + stats[k]);
  S.lastActive = today();
  const after = levelInfo().lvl;
  save();
  if (after > before) setTimeout(() => showLevelUp(after), 350);
  checkAch();
}

/* Упражнение влияет на тело персонажа */
function trainEffect(exId, sets, sign = 1) {
  const ex = D.exById[exId]; if (!ex) return {};
  const g = S.char?.goal;
  if (ex.type === 'str') {
    S.fit.muscleGain = clamp(S.fit.muscleGain + sign * 0.0035 * sets * (g === 'gain' || g === 'bulk' ? 1.3 : 1), 0, 0.5);
    S.fit.fatLoss = clamp(S.fit.fatLoss + sign * 0.0008 * sets, 0, 0.35);
    return { str: sign * sets * 2 };
  }
  if (ex.type === 'cardio') {
    S.fit.fatLoss = clamp(S.fit.fatLoss + sign * 0.004 * sets * (g === 'lose' || g === 'cut' ? 1.3 : 1), 0, 0.35);
    return { end: sign * sets * 2 };
  }
  return { flex: sign * sets * 2 };
}
const exXP = (it) => 6 + it.sets * 3;

/* Потеря формы при долгом простое */
function applyDecay() {
  if (!S.lastActive) return;
  const gap = Math.floor((new Date(today()) - new Date(S.lastActive)) / 864e5);
  if (gap > 2) {
    const k = Math.min(gap - 2, 14) * 0.006;
    S.fit.muscleGain = clamp(S.fit.muscleGain - k, 0, 0.5);
    S.fit.fatLoss = clamp(S.fit.fatLoss - k, 0, 0.35);
    S.lastActive = dkey(new Date(Date.now() - 2 * 864e5));
    save();
    setTimeout(() => toast('Персонаж немного потерял форму за время отдыха — пора вернуться!'), 900);
  }
}
const idleDays = () => S.lastActive ? Math.floor((new Date(today()) - new Date(S.lastActive)) / 864e5) : 0;
const mood = () => idleDays() >= 2 ? 'tired' : 'happy';

/* ---------- Серия и активность ---------- */
const activeLevel = (k) => { const d = S.days[k]; if (!d) return 0; const n = Object.keys(d.done).length + d.workouts.length * 3; return n >= 8 ? 3 : n >= 4 ? 2 : n >= 2 ? 1 : 0; };
function streak() {
  let n = 0; const d = new Date();
  if (!activeLevel(dkey(d))) d.setDate(d.getDate() - 1);
  while (activeLevel(dkey(d))) { n++; d.setDate(d.getDate() - 1); }
  return n;
}
const totalWorkouts = () => Object.values(S.days).reduce((s, d) => s + d.workouts.length, 0);

/* ---------- Питание ---------- */
function targets() {
  const c = S.char, w = curWeight();
  const bmr = 10 * w + 6.25 * c.height - 5 * c.age + (c.gender === 'm' ? 5 : -161);
  const tdee = bmr * (c.activity || 1.375);
  const G = D.GOALS[c.goal] || D.GOALS.fit;
  // не ниже базового обмена и безопасного минимума без контроля врача
  const floor = Math.max(bmr, c.gender === 'm' ? 1500 : 1200);
  let kcal = tdee * (1 + G.adj); const floored = kcal < floor; if (floored) kcal = floor;
  kcal = Math.round(kcal / 10) * 10;
  const refW = G.ref ? Math.min(w, 25 * (c.height / 100) ** 2) : w;   // при лишнем весе белок от веса при ИМТ 25
  const p = Math.round(refW * G.prot);
  const f = Math.round(Math.max(kcal * G.fat / 9, w * 0.6));
  const cb = Math.max(50, Math.round((kcal - p * 4 - f * 9) / 4));
  const glasses = clamp(Math.round(w * 33 / 250), 6, 14);
  const week = Math.round((kcal - tdee) * 7 / 7700 * 100) / 100;      // ожидаемое изменение веса, кг в неделю
  return { bmr:Math.round(bmr), tdee:Math.round(tdee), kcal, p, f, c:cb, glasses, week, floored, G, pk:Math.round(p / w * 10) / 10 };
}
const eaten = (d = day()) => d.food.reduce((a, x) => ({ kcal:a.kcal + x.kcal, p:a.p + x.p, f:a.f + x.f, c:a.c + x.c }), { kcal:0, p:0, f:0, c:0 });

/* ---------- Достижения ---------- */
function checkAch() {
  const tw = totalWorkouts(), st = streak(), lv = levelInfo().lvl, d = day();
  const cond = { first:tw >= 1, w10:tw >= 10, w50:tw >= 50, s3:st >= 3, s7:st >= 7, s30:st >= 30, l5:lv >= 5, l10:lv >= 10,
    steps10k: Object.values(S.days).some(x => x.steps >= 10000), water: d.water >= targets().glasses,
    food: Object.values(S.days).some(x => x.food.length >= 3), weigh5: S.weights.length >= 5 };
  for (const a of D.ACH) if (cond[a.id] && !S.ach[a.id]) { S.ach[a.id] = Date.now(); save(); setTimeout(() => toast(`Достижение: ${a.name}`), 600); PF.haptic('success'); }
}

/* ---------- План на сегодня ---------- */
function todayPlan() {
  const prog = D.progById[S.program.id] || D.PROGRAMS[0];
  const d = day();
  // если сегодня уже закрыт день программы — показываем его же, а не следующий
  const doneW = d.workouts.filter(w => w.prog === prog.id).pop();
  const pin = S.program.pin && S.program.pin.d === today() ? S.program.pin.day : null;
  const di = (pin ?? (doneW ? doneW.day : S.program.next)) % prog.days.length;
  const pd = prog.days[di];
  const items = pd.items.map((it, i) => ({ id:`ex:${prog.id}:${di}:${i}`, it, ex:D.exById[it.ex] }));
  return { prog, di, pd, items };
}
function habitDone(h) {
  const d = day();
  if (h.auto === 'water') return d.water >= targets().glasses;
  if (h.auto === 'steps') return d.steps >= S.settings.stepGoal;
  return !!d.done[h.id];
}
function toggleItem(id) {
  const d = day();
  const plan = todayPlan();
  const pi = plan.items.find(x => x.id === id);
  const on = !d.done[id];
  if (on) d.done[id] = 1; else delete d.done[id];
  if (pi) {
    const st = trainEffect(pi.it.ex, pi.it.sets, on ? 1 : -1);
    addXP(on ? exXP(pi.it) : -exXP(pi.it), st);
    if (on) maybeCompleteWorkout(plan);
  } else {
    const h = D.HABITS.find(x => x.id === id) || S.tasks.find(x => x.id === id);
    addXP(on ? (h?.xp || 10) : -(h?.xp || 10), { disc: on ? 1 : -1 });
  }
  PF.haptic(on ? 'medium' : 'light');
  render();
}
function maybeCompleteWorkout(plan, extra = {}) {
  const d = day();
  if (d.workouts.some(w => w.prog === plan.prog.id && w.day === plan.di)) return false;
  if (!plan.items.every(x => d.done[x.id])) return false;
  d.workouts.push({ prog:plan.prog.id, day:plan.di, name:plan.pd.name, ts:Date.now(), ...extra });
  S.program.next = (plan.di + 1) % plan.prog.days.length;
  addXP(40, { disc:3 });
  toast('Тренировка засчитана! +40 XP');
  PF.haptic('success');
  return true;
}
// авто-привычки (вода, шаги) начисляют опыт один раз
function syncAutoHabits() {
  if (!S.char) return;
  const d = day();
  for (const h of D.HABITS.filter(x => x.auto)) {
    const ok = habitDone(h), was = !!d.done[h.id];
    if (ok && !was) { d.done[h.id] = 1; addXP(h.xp, { disc:1, end: h.auto === 'steps' ? 3 : 0 }); }
  }
}

/* ---------- Общие UI-помощники ---------- */
const layer = $('#layer');
let toastT;
function toast(msg) {
  clearTimeout(toastT);
  const el = document.createElement('div'); el.className = 'toast'; el.textContent = msg;
  document.querySelectorAll('.toast').forEach(t => t.remove());
  document.body.appendChild(el); toastT = setTimeout(() => el.remove(), 2600);
}
const stack = [];
function openSheet(html, { full = false, onClose } = {}) {
  const wrap = document.createElement('div');
  if (full) { wrap.className = 'full'; wrap.innerHTML = `<div class="wrap">${html}</div>`; }
  else { wrap.className = 'overlay'; wrap.innerHTML = `<div class="sheet" role="dialog" aria-modal="true"><div class="grab"></div>${html}</div>`; wrap.addEventListener('click', e => { if (e.target === wrap) closeTop(); }); }
  layer.appendChild(wrap); stack.push({ el:wrap, onClose });
  PF.backButton(true);
  return wrap;
}
function closeTop() {
  const top = stack.pop(); if (!top) return;
  top.onClose && top.onClose(); top.el.remove();
  if (!stack.length) PF.backButton(false);
}
const closeAll = () => { while (stack.length) closeTop(); };
function confirmBox(text, yes, onYes) {
  const w = document.createElement('div'); w.className = 'overlay center';
  w.innerHTML = `<div class="dialog"><b>${esc(text)}</b><div class="grid2"><button class="btn ghost" data-x="no">Отмена</button><button class="btn" data-x="yes">${esc(yes)}</button></div></div>`;
  w.addEventListener('click', e => { const b = e.target.closest('[data-x]'); if (e.target === w || b) { w.remove(); if (b && b.dataset.x === 'yes') onYes(); } });
  layer.appendChild(w);
}
const ring = (pct, col) => { const r = 26, c = 2 * Math.PI * r, p = clamp(pct, 0, 1); return `<svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="${r}" stroke="var(--surface2)" stroke-width="7" fill="none"/><circle cx="32" cy="32" r="${r}" stroke="${col}" stroke-width="7" fill="none" stroke-linecap="round" stroke-dasharray="${(c * p).toFixed(1)} ${c.toFixed(1)}" transform="rotate(-90 32 32)"/></svg>`; };
const bar = (pct) => `<div class="bar"><i style="width:${(clamp(pct, 0, 1) * 100).toFixed(1)}%"></i></div>`;
const avatarSVG = (opts = {}) => AV.render(charNow(), S.fit, Object.assign({ mood:mood() }, opts));

/* ======================= ЭКРАНЫ ======================= */
function vHome() {
  const L = levelInfo(), st = streak(), d = day(), t = targets(), e = eaten();
  const plan = todayPlan(), c = S.char;
  const wDone = d.workouts.length > 0;
  const stats = [['s1','Сила',S.stats.str],['s2','Выносливость',S.stats.end],['s3','Гибкость',S.stats.flex],['s4','Дисциплина',S.stats.disc * 3]];
  const tip = D.TIPS[new Date().getDate() % D.TIPS.length];
  const exDone = plan.items.filter(x => d.done[x.id]).length;
  return `<section class="screen">
  <div class="top"><div><div class="hello">${greet()}, ${esc(c.name || 'атлет')}</div><h1>Сегодня</h1></div>
    <div class="row"><button class="pill coin" data-act="wardrobe" title="Монеты">🪙 ${fmt(S.coins || 0)}</button><span class="pill" title="Серия дней">${IC.flame}${st}</span></div></div>
  <div class="arena gymbg">
    <div class="stage">${avatarSVG({ glow:true })}<button class="wr-btn" data-act="wardrobe">${IC.shirt}Гардероб</button></div>
    <div class="info">
      <div class="lvl"><small>Уровень</small>${L.lvl}</div>
      <span class="rank">${L.rank}</span>
      <div class="stat"><div class="row"><span>Опыт</span><b>${L.cur} / ${L.need}</b></div>${bar(L.cur / L.need)}</div>
      ${stats.map(([cl, n, v]) => `<div class="stat ${cl}"><div class="row"><span>${n}</span><b>${statLevel(v)}</b></div>${bar(statLevel(v) / 100)}</div>`).join('')}
      <div class="form-score">Форма <b>${AV.formScore(charNow(), S.fit)}%</b></div>
    </div>
  </div>
  ${mood() === 'tired' ? `<div class="card"><b>Персонаж скучает</b><div class="muted small">Вы не тренировались ${idleDays()} ${plural(idleDays(),'день','дня','дней')}. После 2 дней отдыха форма начинает снижаться.</div></div>` : ''}
  <div class="rings">
    <button class="ring" data-act="steps">${ring(d.steps / S.settings.stepGoal, '#ff4d2e')}<b>${fmt(d.steps)}</b><span>шагов</span></button>
    <button class="ring" data-act="water-add">${ring(d.water / t.glasses, '#3b6cff')}<b>${d.water}/${t.glasses}</b><span>воды +1</span></button>
    ${tier() < 1 ? `<button class="ring" data-act="pro">${ring(0, '#f5b301')}<b>🔒</b><span>калории</span></button>` : `<button class="ring" data-act="tab" data-tab="food">${ring(e.kcal / t.kcal, '#f5b301')}<b>${fmt(e.kcal)}</b><span>из ${fmt(t.kcal)} ккал</span></button>`}
  </div>
  <div class="card" style="display:grid;gap:12px">
    <div class="row between"><div><h2>${esc(plan.pd.name)}</h2><div class="muted small">${esc(plan.prog.name)} · ${exDone}/${plan.items.length} выполнено${wDone ? ' · засчитано' : ''}</div></div></div>
    <div class="list">${plan.items.map(x => taskRow(x.id, x.ex.name, fmtWork(x.it), exXP(x.it), d.done[x.id], x.ex.id)).join('')}</div>
    <button class="btn" data-act="session">${IC.play}${exDone ? 'Продолжить тренировку' : 'Начать тренировку'}</button>
  </div>
  <div class="section-title"><h2>Привычки и свои пункты</h2><button class="link" data-act="task-add">+ Пункт</button></div>
  <div class="list">
    ${D.HABITS.map(h => taskRow(h.id, h.title, h.auto === 'water' ? `${d.water} из ${t.glasses} стаканов` : h.auto === 'steps' ? `${fmt(d.steps)} из ${fmt(S.settings.stepGoal)}` : 'Отметьте вечером', h.xp, habitDone(h), null, !!h.auto)).join('')}
    ${S.tasks.map(tk => taskRow(tk.id, tk.title, 'Свой пункт · каждый день', tk.xp, d.done[tk.id], null, false, true)).join('')}
  </div>
  ${coachCard(plan, wDone, t, e, tip)}
  ${PRO.enabled !== false && tier() < 2 ? proBanner() : ''}
  ${igCard()}
</section>`;
}
function weekWorkouts() { const n = new Date(), mon = new Date(n); mon.setDate(n.getDate() - ((n.getDay() + 6) % 7)); let k = 0; for (let i = 0; i < 7; i++) { const x = new Date(mon); x.setDate(mon.getDate() + i); const d = S.days[dkey(x)]; if (d) k += d.workouts.length; } return k; }
function coachMsgs(plan, wDone, t, e) {
  const c = S.char, out = [], idle = idleDays(), wk = weekWorkouts(), need = c.days || 3, h = new Date().getHours();
  if (idle >= 3) out.push(`Ты не тренировался ${idle} ${plural(idle,'день','дня','дней')}. Ничего страшного — сегодня сделай тренировку на 70%: те же упражнения, веса чуть меньше. Главное — вернуться в ритм.`);
  if (!wDone && wk < need) out.push(`Сегодня по плану: «${plan.pd.name}» — ${plan.items.length} упражнений, примерно ${Math.round(plan.items.reduce((s, x) => s + x.it.sets * ((x.it.time || x.it.reps * 3) + COACH.rest(x.ex, c.goal)), 0) / 60) + 7} мин. Я проведу тебя по каждому подходу и подскажу вес.`);
  else if (!wDone && wk >= need) out.push(`На этой неделе уже ${wk} из ${need} тренировок — сегодня день восстановления. Прогулка 8–10 тысяч шагов и сон 7–9 часов дадут мышцам вырасти.`);
  else out.push('Тренировка сделана — отлично! Теперь важно восстановление: белок в ближайшие 2 часа, вода и сон.');
  if (tier() >= 1) {
    const lp = t.p - e.p;
    if (h >= 12 && lp > 30) { const f = COACH.proteinFix(lp, t.kcal - e.kcal); if (f.length) out.push(`До нормы белка ещё ${Math.round(lp)} г. Проще всего закрыть: ${f.map(x => `${x.n.toLowerCase()} ${x.g} г (${x.p} г белка)`).join(' + ')}.`); }
  }
  const d = day(); if (h >= 14 && d.water < t.glasses / 2) out.push(`Выпито ${d.water} из ${t.glasses} стаканов воды. Даже 2% обезвоживания снижают силу — выпей стакан сейчас.`);
  const lastW = S.weights.length ? S.weights[S.weights.length - 1].d : null;
  if (!lastW || (new Date(today()) - new Date(lastW)) / 864e5 >= 7) out.push('Неделя без взвешивания. Взвесься завтра утром натощак, после туалета — так я смогу проверить, правильно ли подобраны калории.');
  return out;
}
function coachCard(plan, wDone, t, e, tip) {
  const m = coachMsgs(plan, wDone, t, e);
  return `<div class="card coach"><div class="row" style="gap:10px;margin-bottom:8px"><span class="coach-ic">💬</span><div><b>Тренер</b><div class="muted small">советы на сегодня</div></div></div>
    <ul class="clean">${m.slice(0, 3).map(x => `<li>${esc(x)}</li>`).join('')}</ul>
    <div class="muted small" style="margin-top:8px">💡 ${esc(tip)}</div></div>`;
}
function greet() { const h = new Date().getHours(); return h < 6 ? 'Доброй ночи' : h < 12 ? 'Доброе утро' : h < 18 ? 'Добрый день' : 'Добрый вечер'; }
const fmtWork = (it) => `${it.sets} × ${it.time ? it.time + ' сек' : it.reps + ' раз'}`;
function taskRow(id, title, sub, xp, done, exId, auto = false, custom = false) {
  return `<div class="task ${done ? 'done' : ''}">
    <button class="chk" data-act="${auto ? 'auto-info' : 'toggle'}" data-id="${esc(id)}" aria-pressed="${done ? 'true' : 'false'}" aria-label="Отметить: ${esc(title)}">${IC.check}</button>
    <div class="txt"><b>${esc(title)}</b><span>${esc(sub)}</span></div>
    <span class="xp">+${xp} XP</span>
    ${exId ? `<button class="icon-btn" data-act="ex" data-id="${esc(exId)}" aria-label="Как выполнять">${IC.video}</button>` : ''}
    ${custom ? `<button class="icon-btn" data-act="task-del" data-id="${esc(id)}" aria-label="Удалить пункт">${IC.trash}</button>` : ''}
  </div>`;
}

/* ---------- Тренировки ---------- */
let wSeg = 'programs', wFilter = 'all', exFilter = 'все', exQuery = '', mGoal = null;
function vWorkouts() {
  const filters = [['all','Все'],['home','Дома'],['gym','Зал'],['lose','Похудение'],['cut','Сушка'],['gain','Масса'],['bulk','Для худых'],['fit','Форма']];
  const progs = D.PROGRAMS.filter(p => !p.mine && (wFilter === 'all' || p.place === wFilter || p.goal === wFilter));
  const present = new Set(D.EX.flatMap(x => x.muscles)); const groups = ['все', ...(D.MUSCLE_ORDER || []).filter(g => present.has(g)), ...[...present].filter(g => !(D.MUSCLE_ORDER || []).includes(g))];
  const q = exQuery.trim().toLowerCase();
  const exs = D.EX.filter(x => (exFilter === 'все' || x.muscles.includes(exFilter)) && (!q || x.name.toLowerCase().includes(q)));
  const goalName = { lose:'Похудение', cut:'Сушка', gain:'Масса', bulk:'Для худых', fit:'Форма' };
  return `<section class="screen">
  <h1>Тренировки</h1>
  <div class="seg" role="tablist"><button class="${wSeg === 'programs' ? 'on' : ''}" data-act="wseg" data-v="programs">Программы</button><button class="${wSeg === 'lib' ? 'on' : ''}" data-act="wseg" data-v="lib">Упражнения</button><button class="${wSeg === 'guide' ? 'on' : ''}" data-act="wseg" data-v="guide">Гид</button></div>
  ${wSeg === 'guide' ? guideList('train') : wSeg === 'programs' ? `
  ${myPlanCard()}
  <div class="chips">${filters.map(([k, n]) => `<button class="chip ${wFilter === k ? 'on' : ''}" data-act="wfilter" data-v="${k}">${n}</button>`).join('')}</div>
  <div class="list">${progs.map(p => `<button class="prog ${S.program.id === p.id ? 'active' : ''}" data-act="prog" data-id="${p.id}">
      <div class="row between"><h3>${esc(p.name)}</h3>${S.program.id === p.id ? '<span class="tag a">Активна</span>' : isLocked(p.id) ? lockTag(progTier(p.id)) : IC.chev.replace('<svg', '<svg width="20" height="20"')}</div>
      <div class="muted small">${esc(p.desc)}</div>
      <div class="tags"><span class="tag">${p.place === 'gym' ? 'Зал' : 'Дома'}</span><span class="tag">${goalName[p.goal]}</span><span class="tag">${esc(p.level)}</span><span class="tag">${p.days.length} ${plural(p.days.length,'день','дня','дней')} в цикле</span><span class="tag">${p.weeks} нед.</span></div>
    </button>`).join('')}</div>` : `
  <input class="search" type="search" placeholder="Найти упражнение" value="${esc(exQuery)}" data-input="exq" aria-label="Поиск упражнения">
  <div class="chips">${groups.map(g => `<button class="chip ${exFilter === g ? 'on' : ''}" data-act="exfilter" data-v="${esc(g)}">${esc(g[0].toUpperCase() + g.slice(1))}</button>`).join('')}</div>
  <div class="list" id="exlist">${exs.map(exRow).join('') || '<div class="muted">Ничего не найдено</div>'}</div>`}
</section>`;
}
const typeName = { str:'Сила', cardio:'Кардио', flex:'Растяжка' };
function myPlanCard() {
  const c = S.char, p = D.progById.my, n = c.days || 3, on = S.program.id === 'my';
  return `<div class="card myplan" style="display:grid;gap:12px;${on ? 'box-shadow:inset 0 0 0 2px var(--accent)' : ''}">
    <div class="row between"><div><div class="muted small">Подбор под вас</div><h3>Сколько тренировок в неделю?</h3></div>${on ? '<span class="tag a">Активен</span>' : ''}</div>
    <div class="seg days">${[2,3,4,5,6].map(d => `<button class="${n === d ? 'on' : ''}" data-act="plan-days" data-v="${d}">${d}</button>`).join('')}</div>
    <div class="seg"><button class="${c.place !== 'gym' ? 'on' : ''}" data-act="plan-place" data-v="home">Дома</button><button class="${c.place === 'gym' ? 'on' : ''}" data-act="plan-place" data-v="gym">В зале</button></div>
    <div class="muted small">${esc(p.desc)}</div>
    <div class="list" style="gap:6px">${p.days.map((d, i) => `<div class="row between small"><span><b>День ${i + 1}.</b> ${esc(d.name)}</span><span class="muted">${d.items.length} упр.</span></div>`).join('')}</div>
    <div class="row" style="gap:8px"><button class="btn sm ghost" data-act="prog" data-id="my">Упражнения плана</button>${on ? '' : `<button class="btn sm" data-act="plan-use">Тренироваться по плану</button>`}</div>
  </div>`;
}
const exRow = (x) => `<button class="exrow" data-act="ex" data-id="${x.id}"><span class="exthumb" data-anim="${x.anim}"></span><span style="flex:1;min-width:0"><b>${esc(x.name)}</b><br><span class="muted small">${typeName[x.type]} · ${esc(x.muscles.join(', '))}</span></span>${exLocked(x) ? lockTag(exTier(x)) : IC.chev.replace('<svg', '<svg width="20" height="20"')}</button>`;

function openProgram(id) {
  const p = D.progById[id];
  openSheet(`<div class="sheet-head"><div><h2>${esc(p.name)}</h2><div class="muted small">${esc(p.desc)}</div></div><button class="icon-btn" data-act="close" aria-label="Закрыть">${IC.close}</button></div>
    ${p.days.map((dd, i) => `<div class="card" style="display:grid;gap:8px"><div class="row between"><h3>${esc(dd.name)}</h3><span class="muted small">~${Math.round(dd.items.reduce((s, it) => s + it.sets * ((it.time || it.reps * 3) + S.settings.rest), 0) / 60)} мин</span></div>
      ${dd.items.map(it => `<button class="exrow" style="background:var(--bg)" data-act="ex" data-id="${it.ex}"><span class="exthumb" data-anim="${D.exById[it.ex].anim}"></span><span style="flex:1"><b>${esc(D.exById[it.ex].name)}</b><br><span class="muted small">${fmtWork(it)}</span></span></button>`).join('')}
      ${S.program.id === p.id ? `<button class="btn ghost sm" data-act="session" data-prog="${p.id}" data-day="${i}">${IC.play}Начать этот день</button>` : ''}</div>`).join('')}
    ${S.program.id === p.id ? '<div class="muted small">Это ваша текущая программа.</div>' : isLocked(p.id) ? `<button class="btn" data-act="pro">${IC.crown}${progTier(p.id) >= 2 ? 'Открыть в полном пакете' : 'Открыть для подписчиков'}</button>` : `<button class="btn" data-act="prog-pick" data-id="${p.id}">Выбрать программу</button>`}`);
  mountThumbs(layer);
}
let stopDemo = null;
function openExercise(id) {
  const x = D.exById[id];
  if (exLocked(x)) return openPro(exTier(x) >= 2 && tier() >= 1 ? `«${x.name}» — в полном пакете.` : `Бесплатно открыты 2 упражнения. «${x.name}» и вся техника — после подписки или в полном пакете.`);
  const sh = openSheet(`<div class="sheet-head"><div><h2>${esc(x.name)}</h2><div class="tags" style="margin-top:6px"><span class="tag a">${typeName[x.type]}</span>${x.muscles.map(m => `<span class="tag">${esc(m)}</span>`).join('')}<span class="tag">${x.place === 'gym' ? 'Зал / инвентарь' : 'Без инвентаря'}</span></div></div><button class="icon-btn" data-act="close" aria-label="Закрыть">${IC.close}</button></div>
    <div class="demo" id="demo"></div>
    <div><h3 style="margin-bottom:8px">Как выполнять</h3><ol class="steps">${x.steps.map(s => `<li>${esc(s)}</li>`).join('')}</ol></div>
    <div><h3 style="margin-bottom:8px">Частые ошибки</h3><ul class="clean">${x.mistakes.map(s => `<li>${esc(s)}</li>`).join('')}</ul></div>
    <div class="card"><b>Дыхание.</b> ${esc(x.breath)}</div>
    ${exCoach(x)}
    <button class="btn ghost" data-act="video" data-q="${esc(x.name + ' техника выполнения')}">${IC.video}Видео с техникой</button>`, { onClose: () => stopDemo && stopDemo() });
  stopDemo = ExAnim.mount($('#demo', sh), x.anim);
}
function exCoach(x) {
  const g = S.char.goal, L = COACH.last(S.log, x.id), best = COACH.best(S.log, x.id), sw = COACH.swaps(x, S.char.place);
  const sets = x.type !== 'str' ? '' : g === 'gain' || g === 'bulk' ? (COACH.isBasic(x.id) ? '3–4 подхода × 6–10' : '3 подхода × 10–15') : g === 'lose' ? '3 подхода × 12–15' : '3–4 подхода × 8–12';
  return `<div class="card coach" style="display:grid;gap:8px"><div class="row" style="gap:10px"><span class="coach-ic">💬</span><b>Советы тренера под вашу цель</b></div>
    <ul class="clean">${sets ? `<li>Подходы и повторы: <b>${sets}</b></li>` : ''}${COACH.rir(x, g) ? `<li>Вес: оставляй ${esc(COACH.rir(x, g))}</li>` : ''}<li>Отдых между подходами: <b>${COACH.rest(x, g)} сек</b></li>
    <li>Прогрессия: когда все подходы сделаны на верхней границе повторов — добавь 2,5–5% веса.</li>
    ${L ? `<li>Последний раз: ${L.sets.map(s => s[0] ? `${COACH.fmtW(s[0])}×${s[1]}` : `${s[1]}`).join(', ')}${best ? ` · рекорд ${COACH.fmtW(best)}` : ''}</li>` : ''}</ul>
    ${sw.length ? `<div class="small muted">Нет тренажёра или неудобно? Замени на: ${sw.map(s => `<button class="link" data-act="ex" data-id="${s.id}">${esc(s.name)}</button>`).join(', ')}</div>` : ''}</div>`;
}
function mountThumbs(root = document) { root.querySelectorAll('[data-anim]:not(.m)').forEach(el => { el.classList.add('m'); ExAnim.mount(el, el.dataset.anim, 'var(--ink)'); }); }

/* ---------- Режим тренировки ---------- */
let sess = null, sessTimer = null;
function startSession(progId, dayIdx) {
  const plan = todayPlan();
  if (progId && dayIdx != null && (progId !== plan.prog.id || +dayIdx !== plan.di)) { S.program = { id:progId, next:+dayIdx, pin:{ d:today(), day:+dayIdx } }; save(); }
  const p = todayPlan(), d = day();
  const first = p.items.findIndex(x => !d.done[x.id]);
  sess = { plan:p, i: first < 0 ? 0 : first, set:1, phase: first <= 0 ? 'brief' : 'work', left:0, xp:0, startXp:S.xp, startTs:Date.now(), log:{}, w:null, r:null };
  closeAll();
  openSheet('<div id="sess"></div>', { full:true, onClose: () => { clearInterval(sessTimer); if (sess && !sess.logSaved) saveSessLog(); sess = null; render(); } });
  renderSession();
}
function renderSession() {
  const box = $('#sess'); if (!box || !sess) return;
  clearInterval(sessTimer);
  const { plan } = sess, cur = plan.items[sess.i], goal = S.char.goal;
  if (sess.phase === 'brief') {
    const b = COACH.brief(plan, goal, S.log);
    box.innerHTML = `<div class="session-top"><button class="icon-btn" data-act="close" aria-label="Выйти">${IC.close}</button><div class="muted small" style="font-weight:700">Перед тренировкой</div><span style="width:44px"></span></div>
      <div class="card coach"><div class="row" style="gap:10px"><span class="coach-ic">💬</span><div><h2>${esc(plan.pd.name)}</h2><div class="muted small">~${b.mins} мин · цель — ${esc(b.G)}</div></div></div>
        <div class="tags" style="margin-top:10px">${b.muscles.map(m => `<span class="tag">${esc(m)}</span>`).join('')}</div>
        <p style="margin-top:10px">${esc(b.rep)}</p></div>
      <div class="card"><h3 style="margin-bottom:8px">Разминка 5–7 минут</h3><ol class="steps">${b.warm.map(x => `<li>${esc(x)}</li>`).join('')}</ol></div>
      <div class="card"><h3 style="margin-bottom:8px">План</h3>${plan.items.map(x => `<div class="row between small" style="padding:4px 0"><span>${esc(x.ex.name)}</span><span class="muted">${fmtWork(x.it)} · отдых ${COACH.rest(x.ex, goal)} с</span></div>`).join('')}</div>
      <button class="btn" data-act="s-go">${IC.play}Разминка сделана — начинаем</button>`;
    return;
  }
  if (sess.phase === 'done') {
    const gained = S.xp - sess.startXp, mins = Math.max(1, Math.round((Date.now() - sess.startTs) / 60000));
    const kcal = Math.round(plan.items.reduce((s, x) => s + x.it.sets * (x.it.time || x.it.reps * 3) * x.ex.kcal * curWeight() / 70 / 6, 0));
    const rv = COACH.review(sess.log, S.log); saveSessLog();
    const nextName = (() => { const pr = plan.prog, n = pr.days[(plan.di + 1) % pr.days.length]; return n ? n.name : ''; })();
    box.innerHTML = `<div class="session-top"><span></span><button class="icon-btn" data-act="close" aria-label="Закрыть">${IC.close}</button></div>
      <div class="arena" style="grid-template-columns:minmax(0,1fr);justify-items:center;text-align:center">
        <div class="stage" style="height:280px">${avatarSVG({ glow:true })}</div>
        <div class="info" style="align-items:center"><h1 style="color:#fff">Тренировка завершена</h1><div style="color:#d4d6de">${esc(plan.pd.name)}</div></div></div>
      <div class="kv"><div><b>+${gained}</b><span>опыта</span></div><div><b>${mins}</b><span>минут</span></div><div><b>~${kcal}</b><span>ккал</span></div></div>
      <div class="muted small">Персонаж стал сильнее. Форма: ${AV.formScore(charNow(), S.fit)}%.</div>
      <div class="card coach"><div class="row" style="gap:10px;margin-bottom:6px"><span class="coach-ic">💬</span><b>Разбор тренера</b></div><ul class="clean">
        ${rv.vol ? `<li>Общий тоннаж: <b>${fmt(rv.vol)} кг</b>. Растёт от тренировки к тренировке — значит, растут и мышцы.</li>` : ''}
        ${rv.prs.map(x => `<li>🏆 Новый рекорд: <b>${esc(x.name)} — ${COACH.fmtW(x.w)}</b></li>`).join('')}
        <li>В ближайшие 1–2 часа съешь 20–40 г белка и порцию углеводов: например, курица с рисом или творог с бананом.</li>
        <li>Пей воду: ещё 2–3 стакана до вечера.</li>
        ${nextName ? `<li>Следующая тренировка: «${esc(nextName)}». Между тренировками одной мышцы — 48 часов отдыха.</li>` : ''}
      </ul></div>
      <button class="btn" data-act="close">Готово</button>
      <button class="btn ghost" data-act="share">${IC.share}Поделиться прогрессом</button>`;
    return;
  }
  const work = cur.it.time ? `${cur.it.time} сек` : `${cur.it.reps} раз`;
  const dots = Array.from({ length:cur.it.sets }, (_, k) => `<i class="${k < sess.set - (sess.phase === 'work' ? 1 : 0) ? 'on' : ''}"></i>`).join('');
  const nextIt = plan.items[sess.i + 1];
  box.innerHTML = `<div class="session-top"><button class="icon-btn" data-act="close" aria-label="Выйти">${IC.close}</button>
      <div class="muted small" style="font-weight:700">Упражнение ${sess.i + 1} из ${plan.items.length}</div>
      <button class="icon-btn" data-act="ex" data-id="${cur.ex.id}" aria-label="Техника">${IC.video}</button></div>
    ${bar((sess.i + (sess.set - 1) / cur.it.sets) / plan.items.length)}
    ${sess.phase === 'rest' ? `
      <div style="text-align:center;display:grid;gap:8px;padding:20px 0"><div class="muted">Отдых</div><div class="big" id="clock">${sess.left}</div>
      <div class="muted small">Дальше: ${esc(sess.set <= cur.it.sets ? `${cur.ex.name}, подход ${sess.set}` : nextIt ? nextIt.ex.name : 'финиш')}</div></div>
      <div class="card coach small"><span class="coach-ic">💬</span> <span id="rtip"></span></div>
      <div class="grid2"><button class="btn ghost" data-act="s-plus">+15 сек</button><button class="btn" data-act="s-skip">Пропустить</button></div>` : `
      <div class="demo" id="sdemo"></div>
      <div style="text-align:center;display:grid;gap:6px"><h2>${esc(cur.ex.name)}</h2>
        <div class="big" id="clock">${cur.it.time ? (sess.left || cur.it.time) : cur.it.reps}</div>
        <div class="muted">${cur.it.time ? 'секунд' : 'повторений'} · подход ${sess.set} из ${cur.it.sets}</div><div class="setdots">${dots}</div></div>
      ${workCoach(cur, goal)}
      ${cur.it.time && !sess.left ? `<button class="btn" data-act="s-timer">${IC.play}Старт ${work}</button>` : cur.it.time ? `<button class="btn ghost" data-act="s-set">Завершить подход</button>` : `<button class="btn" data-act="s-set">${IC.check}Подход выполнен</button>`}
      <button class="link" data-act="s-next">Пропустить упражнение</button>`}`;
  if (sess.phase === 'work') { stopDemo && stopDemo(); stopDemo = ExAnim.mount($('#sdemo', box), cur.ex.anim); }
  if (sess.phase === 'rest') { const tt = $('#rtip', box); if (tt) tt.textContent = restTip(cur); }
  if (sess.left > 0) {
    sessTimer = setInterval(() => {
      sess.left--; const c = $('#clock'); if (c) c.textContent = sess.left;
      if (sess.left <= 3 && sess.left > 0) PF.haptic('light');
      if (sess.left <= 0) { clearInterval(sessTimer); PF.haptic('heavy'); sess.phase === 'rest' ? afterRest() : finishSet(); }
    }, 1000);
  }
}
function workCoach(cur, goal) {
  const cu = COACH.cue(cur.ex), rr = COACH.rir(cur.ex, goal);
  let w = '';
  if (COACH.usesWeight(cur.ex)) {
    const sg = COACH.suggest(S.log, cur.ex, cur.it);
    if (sess.w == null) sess.w = (sess.log[cur.ex.id] && sess.log[cur.ex.id].length) ? sess.log[cur.ex.id][sess.log[cur.ex.id].length - 1][0] : (sg && sg.w) || 0;
    if (sess.r == null) sess.r = cur.it.reps || 10;
    w = `<div class="card" style="display:grid;gap:10px"><div class="row between"><span class="muted small">Вес</span><span class="muted small">Повторы</span></div>
      <div class="row between"><div class="stepper"><button data-act="s-w" data-v="-2.5">−</button><b>${COACH.fmtW(sess.w)}</b><button data-act="s-w" data-v="2.5">+</button></div>
      <div class="stepper"><button data-act="s-r" data-v="-1">−</button><b>${sess.r}</b><button data-act="s-r" data-v="1">+</button></div></div>
      ${sg ? `<div class="small">🎯 ${esc(sg.text)}</div>` : ''}</div>`;
  } else if (!cur.it.time) { if (sess.r == null) sess.r = cur.it.reps; w = `<div class="card"><div class="row between"><span class="muted small">Сделал повторов</span><div class="stepper"><button data-act="s-r" data-v="-1">−</button><b>${sess.r}</b><button data-act="s-r" data-v="1">+</button></div></div></div>`; }
  return `<div class="card coach small" style="display:grid;gap:6px"><div><span class="coach-ic">💬</span> <b>${esc(cu.focus)}</b></div>${cu.avoid ? `<div>⚠️ ${esc(cu.avoid)}</div>` : ''}${rr ? `<div>💪 Вес подбирай так, чтобы оставалось ${esc(rr)}.</div>` : ''}</div>${w}`;
}
function restTip(cur) {
  const nx = sess.set <= cur.it.sets ? cur : sess.plan.items[sess.i];
  const tips = ['Дыши глубоко: вдох носом на 4 счёта, выдох ртом на 6 — пульс восстановится быстрее.', 'Сделай пару глотков воды.', `Следующий подход: ${COACH.cue(nx.ex).focus}`, 'Не садись в телефон надолго — держи отдых по таймеру, так тренировка даёт результат.'];
  return tips[(sess.set + sess.i) % tips.length];
}
function saveSessLog() {
  Object.entries(sess.log).forEach(([id, sets]) => { if (!sets.length) return; S.log[id] = (S.log[id] || []).filter(x => x.d !== today()); S.log[id].push({ d:today(), sets }); if (S.log[id].length > 30) S.log[id].shift(); });
  sess.logSaved = true; save();
}
function finishSet() {
  const cur = sess.plan.items[sess.i];
  if (!cur.it.time && sess.r != null) { (sess.log[cur.ex.id] ||= []).push([COACH.usesWeight(cur.ex) ? +sess.w || 0 : 0, sess.r]); }
  sess.left = 0;
  if (sess.set >= cur.it.sets) {
    const d = day();
    if (!d.done[cur.id]) { d.done[cur.id] = 1; addXP(exXP(cur.it), trainEffect(cur.it.ex, cur.it.sets)); }
    if (maybeCompleteWorkout(sess.plan, { mins:Math.round((Date.now() - sess.startTs) / 60000) })) { sess.phase = 'done'; return renderSession(); }
    const nxt = sess.plan.items.findIndex((x, k) => k > sess.i && !d.done[x.id]);
    if (nxt < 0) { sess.phase = 'done'; return renderSession(); }
    sess.i = nxt; sess.set = 1; sess.w = null; sess.r = null;
  } else sess.set++;
  sess.phase = 'rest'; sess.left = COACH.rest(cur.ex, S.char.goal, S.settings.rest); PF.haptic('medium');
  renderSession();
}
function afterRest() { sess.phase = 'work'; sess.left = 0; renderSession(); }

/* ---------- Питание ---------- */
let fSeg = 'my', planDay = 0;
function vFood() {
  const t = targets(), e = eaten(), d = day(), c = S.char;
  const mg = mGoal || (D.MEALS[c.goal] ? c.goal : 'fit');
  const macro = (cl, n, v, max) => `<div class="macro ${cl}"><div class="row"><span>${n}</span><b>${Math.round(v)} / ${max} г</b></div>${bar(v / max)}</div>`;
  let body = '';
  if (fSeg === 'my' && tier() < 1) {
    body = `<div class="card" style="display:grid;gap:12px;text-align:center"><div style="font-size:44px">🔒</div><h2>Счётчик калорий и КБЖУ</h2>
      <div class="muted small">Норма калорий под вашу цель, белки, жиры, углеводы и дневник питания открываются после подписки или в полном пакете.</div>
      <button class="btn" data-act="pro">${IC.crown}Открыть счётчик</button></div>
    <div class="card"><div class="row between" style="margin-bottom:10px"><h3>Вода</h3><span class="muted small">${d.water * 250} / ${t.glasses * 250} мл</span></div>
      <div class="water">${Array.from({ length:t.glasses }, (_, i) => `<button class="glass ${i < d.water ? 'on' : ''}" data-act="water-set" data-v="${i + 1}" aria-label="${i + 1} стакан"></button>`).join('')}</div></div>`;
  } else if (fSeg === 'my') {
    const left = t.kcal - e.kcal;
    body = `<div class="card" style="display:grid;gap:14px">
      <div class="row between"><div><div class="muted small">Съедено сегодня</div><div class="kcal-big">${fmt(e.kcal)}</div></div><div style="text-align:right"><div class="muted small">${left >= 0 ? 'Осталось' : 'Перебор'}</div><b style="font-family:var(--display);font-size:22px;color:${left >= 0 ? 'var(--ink)' : 'var(--accent)'}">${fmt(Math.abs(left))} ккал</b></div></div>
      ${bar(e.kcal / t.kcal)}
      ${macro('p', 'Белки', e.p, t.p)}${macro('f', 'Жиры', e.f, t.f)}${macro('c', 'Углеводы', e.c, t.c)}
      <button class="btn" data-act="food-add">${IC.plus}Добавить еду</button></div>
    <div class="card"><div class="row between" style="margin-bottom:10px"><h3>Вода</h3><span class="muted small">${d.water * 250} / ${t.glasses * 250} мл</span></div>
      <div class="water">${Array.from({ length:t.glasses }, (_, i) => `<button class="glass ${i < d.water ? 'on' : ''}" data-act="water-set" data-v="${i + 1}" aria-label="${i + 1} стакан"></button>`).join('')}</div></div>
    <div class="section-title"><h2>Дневник</h2></div>
    <div class="card">${d.food.length ? d.food.map((x, i) => `<div class="meal"><b>${esc(x.name)}</b><em>${fmt(x.kcal)} ккал <button class="icon-btn" style="display:inline-grid;width:36px;height:36px;vertical-align:middle;margin-left:4px;background:var(--bg)" data-act="food-del" data-i="${i}" aria-label="Удалить">${IC.trash}</button></em><span>${x.g ? x.g + ' г · ' : ''}Б ${Math.round(x.p)} · Ж ${Math.round(x.f)} · У ${Math.round(x.c)}</span></div>`).join('') : '<div class="muted">Пока пусто. Добавьте первый приём пищи — это +5 XP.</div>'}</div>
    ${foodCoach(t, e)}
    ${goalCard(t)}`;
  } else if (fSeg === 'guide') {
    body = guideList('food');
  } else {
    const M = D.MEALS[mg], mt = mealTier(mg), full = tier() >= mt, days = full ? M.days : [];
    const md = days.length ? days[planDay % days.length] : null;
    const chips = `<div class="chips">${D.GOAL_ORDER.map(k => `<button class="chip ${k === mg ? 'on' : ''}" data-act="mgoal" data-v="${k}">${esc(D.MEALS[k].title)}${mealTier(k) >= 2 && tier() < 2 ? ' 🔒' : ''}</button>`).join('')}</div>`;
    if (!md) { body = chips + `<div class="card" style="display:grid;gap:10px"><div class="row between"><h2>${M.title}</h2><span class="tag a">${M.kcal}</span></div><ul class="clean">${M.rules.slice(0, 2).map(r => `<li>${esc(r)}</li>`).join('')}</ul>
        <div class="muted small">${mt >= 2 ? 'Меню на 3 дня для этой цели — в полном пакете.' : 'Меню на 3 дня открывается после подписки или в полном пакете.'}</div><button class="btn" data-act="pro">${IC.crown}Открыть меню</button></div>`; }
    else body = chips + `<div class="card" style="display:grid;gap:8px"><div class="row between"><h2>${M.title}</h2><span class="tag a">${M.kcal}</span></div><ul class="clean">${M.rules.map(r => `<li>${esc(r)}</li>`).join('')}</ul></div>
      <div class="chips">${M.days.map((x, i) => `<button class="chip ${i === planDay % days.length && i < days.length ? 'on' : ''}" data-act="${i < days.length ? 'pday' : 'pro'}" data-v="${i}">${esc(x.name)}${i < days.length ? '' : ' 🔒'}</button>`).join('')}</div>
      <div class="card">${md.meals.map(([n, txt, k]) => `<div class="meal"><b>${esc(n)}</b><em>${k} ккал</em><span>${esc(txt)}</span></div>`).join('')}
        <div class="row between" style="padding-top:10px"><b>Итого</b><b>${fmt(md.meals.reduce((s, m) => s + m[2], 0))} ккал</b></div></div>
      <div class="grid2"><div class="card"><h3 style="margin-bottom:6px">Есть</h3><ul class="clean small">${M.eat.map(x => `<li>${esc(x)}</li>`).join('')}</ul></div><div class="card"><h3 style="margin-bottom:6px">Ограничить</h3><ul class="clean small">${M.limit.map(x => `<li>${esc(x)}</li>`).join('')}</ul></div></div>
      <div class="muted small">Порции подстройте под свою норму ${fmt(t.kcal)} ккал. При заболеваниях проконсультируйтесь с врачом.</div>`;
  }
  return `<section class="screen"><h1>Питание</h1>
    <div class="seg"><button class="${fSeg === 'my' ? 'on' : ''}" data-act="fseg" data-v="my">Мой день</button><button class="${fSeg === 'menu' ? 'on' : ''}" data-act="fseg" data-v="menu">Меню</button><button class="${fSeg === 'guide' ? 'on' : ''}" data-act="fseg" data-v="guide">Гид</button></div>
    ${body}</section>`;
}
function foodCoach(t, e) {
  const h = new Date().getHours(), now = COACH.mealNow(h), M = COACH.meals(t), cur = M.find(m => m.n === now);
  const lp = Math.max(0, t.p - e.p), lk = t.kcal - e.kcal, fix = COACH.proteinFix(lp, lk), adj = COACH.adjust(S.weights, S.char.goal);
  const li = [];
  li.push(`Сейчас ${now.toLowerCase()}: ориентир ~${fmt(cur.k)} ккал и ${cur.p} г белка.`);
  if (lk < -100) li.push(`Норма превышена на ${fmt(-lk)} ккал. Не страшно — завтра просто вернись к плану, голодать не нужно.`);
  else if (lp > 15 && fix.length) li.push(`Белка не хватает ${Math.round(lp)} г: ${fix.map(x => `${x.n.toLowerCase()} ${x.g} г`).join(' + ')} — и норма закрыта.`);
  else if (e.kcal > 0 && lp <= 15) li.push('Белок почти закрыт — отлично, мышцам есть из чего расти.');
  if (day().workouts.length) li.push('Сегодня была тренировка: углеводы лучше съесть в приём пищи после неё — так быстрее восстановишься.');
  if (adj) li.push(`По весу за последние недели: ${adj.perWeek > 0 ? '+' : ''}${String(adj.perWeek).replace('.', ',')} кг в неделю. ${adj.msg}`);
  else li.push('Через 2 недели взвешиваний я сверю темп и подскажу, нужно ли менять калории.');
  return `<div class="card coach"><div class="row" style="gap:10px;margin-bottom:8px"><span class="coach-ic">💬</span><div><b>Диетолог</b><div class="muted small">разбор вашего дня</div></div></div>
    <ul class="clean">${li.map(x => `<li>${esc(x)}</li>`).join('')}</ul>
    <div class="row" style="gap:6px;flex-wrap:wrap;margin-top:10px">${M.map(m => `<span class="tag ${m.n === now ? 'a' : ''}">${m.n} ~${fmt(m.k)}</span>`).join('')}</div></div>`;
}
function openFoodAdd() {
  const sh = openSheet(`<div class="sheet-head"><h2>Добавить еду</h2><button class="icon-btn" data-act="close" aria-label="Закрыть">${IC.close}</button></div>
    <input class="search" type="search" placeholder="Продукт или блюдо" id="fq" aria-label="Поиск продукта">
    <div class="list" id="flist"></div>
    <details class="card"><summary style="font-weight:700;cursor:pointer;min-height:32px">Своё блюдо</summary>
      <form id="fcustom" style="display:grid;gap:10px;margin-top:10px"><input class="input" name="name" placeholder="Название" required><div class="grid2"><input class="input" name="kcal" type="number" inputmode="numeric" placeholder="Ккал" required min="0"><input class="input" name="p" type="number" inputmode="decimal" placeholder="Белки, г" min="0"></div><button class="btn">Добавить</button></form></details>`);
  const draw = (q = '') => { $('#flist', sh).innerHTML = D.FOODS.filter(f => f.name.toLowerCase().includes(q.toLowerCase())).map(f => `<button class="food-item" data-act="food-pick" data-n="${esc(f.name)}"><span><b>${esc(f.name)}</b><br><span class="muted small">на 100 г · Б ${f.p} Ж ${f.f} У ${f.c}</span></span><b style="white-space:nowrap">${f.kcal} ккал</b></button>`).join(''); };
  draw();
  $('#fq', sh).addEventListener('input', e => draw(e.target.value));
  $('#fcustom', sh).addEventListener('submit', e => { e.preventDefault(); const f = new FormData(e.target); pushFood({ name:f.get('name'), kcal:+f.get('kcal') || 0, p:+f.get('p') || 0, f:0, c:0 }); closeTop(); });
}
function openFoodGrams(name) {
  const f = D.FOODS.find(x => x.name === name); if (!f) return;
  const def = name.startsWith('Яйцо') ? 110 : name.startsWith('Протеин') ? 30 : 150;
  const sh = openSheet(`<div class="sheet-head"><h2>${esc(f.name)}</h2><button class="icon-btn" data-act="close" aria-label="Закрыть">${IC.close}</button></div>
    <div class="field"><span class="lab">Вес порции</span><div class="range"><input type="range" min="10" max="500" step="5" value="${def}" id="gr" aria-label="Граммы"><output id="gro">${def} г</output></div></div>
    <div class="kv" id="gkv"></div><button class="btn" id="gadd">Добавить в дневник</button>`);
  const calc = () => { const g = +$('#gr', sh).value, k = g / 100; $('#gro', sh).textContent = g + ' г'; $('#gkv', sh).innerHTML = `<div><b>${Math.round(f.kcal * k)}</b><span>ккал</span></div><div><b>${Math.round(f.p * k)}</b><span>белки, г</span></div><div><b>${Math.round(f.c * k)}</b><span>углеводы, г</span></div>`; return { g, k }; };
  calc(); $('#gr', sh).addEventListener('input', calc);
  $('#gadd', sh).addEventListener('click', () => { const { g, k } = calc(); pushFood({ name:f.name, g, kcal:Math.round(f.kcal * k), p:f.p * k, f:f.f * k, c:f.c * k }); closeAll(); });
}
function pushFood(item) { const d = day(); d.food.push(item); if (d.food.length <= 5) addXP(5, { disc:1 }); else save(); toast(`${item.name}: +${fmt(item.kcal)} ккал`); render(); }

/* ---------- Прогресс ---------- */
function vProgress() {
  const c = charNow(), m = AV.morph(c, S.fit), tw = totalWorkouts(), st = streak();
  const w0 = S.weights[0]?.w ?? c.weight, w1 = curWeight(), diff = Math.round((w1 - w0) * 10) / 10;
  const cells = Array.from({ length:35 }, (_, i) => { const dd = new Date(); dd.setDate(dd.getDate() - 34 + i); const k = dkey(dd); return `<i class="l${activeLevel(k)} ${k === today() ? 'today' : ''}" title="${k}"></i>`; }).join('');
  const hist = Object.entries(S.days).flatMap(([k, d]) => d.workouts.map(w => ({ k, ...w }))).sort((a, b) => b.ts - a.ts).slice(0, 8);
  return `<section class="screen"><h1>Прогресс</h1>
    <div class="kv"><div><b>${tw}</b><span>тренировок</span></div><div><b>${st}</b><span>${plural(st,'день','дня','дней')} подряд</span></div><div><b>${m.bmi.toFixed(1)}</b><span>ИМТ</span></div></div>
    <div class="card" style="display:grid;gap:10px">
      <div class="row between"><div><h2>Вес</h2><div class="muted small">${w1} кг · ${diff === 0 ? 'без изменений' : (diff > 0 ? '+' : '') + diff + ' кг с начала'}${S.char.target ? ` · цель ${S.char.target} кг` : ''}</div></div><button class="btn sm" data-act="weigh">${IC.plus}Записать</button></div>
      <div class="fig" id="wchart"></div></div>
    <div class="card"><div class="row between" style="margin-bottom:10px"><h3>Активность за 5 недель</h3><span class="muted small">чем ярче, тем больше</span></div><div class="heat">${cells}</div></div>
    <div class="section-title"><h2>Достижения</h2><span class="muted small">${Object.keys(S.ach).length} из ${D.ACH.length}</span></div>
    <div class="ach">${D.ACH.map(a => `<div class="badge ${S.ach[a.id] ? 'got' : ''}" title="${esc(a.desc)}"><span class="ic">${IC[a.icon]}</span>${esc(a.name)}<span class="muted" style="font-weight:600">${esc(a.desc)}</span></div>`).join('')}</div>
    <div class="section-title"><h2>История</h2></div>
    <div class="card">${hist.length ? hist.map(h => `<div class="meal"><b>${esc(h.name)}</b><em>${new Date(h.ts).toLocaleDateString('ru-RU', { day:'numeric', month:'short' })}</em><span>${esc(D.progById[h.prog]?.name || '')}</span></div>`).join('') : '<div class="muted">Здесь появятся ваши тренировки.</div>'}</div>
  </section>`;
}
let wRO = null;
function drawWeightChart() {
  const box = $('#wchart'); if (!box) return;
  const draw = () => {
    const W = box.clientWidth, H = box.clientHeight; if (!W) return;
    const pts = S.weights.length ? S.weights : [{ d:today(), w:curWeight() }];
    const ws = pts.map(p => p.w), tgt = S.char.target;
    let lo = Math.min(...ws, tgt || Infinity) - 1, hi = Math.max(...ws, tgt || -Infinity) + 1;
    const pl = 34, pr = 10, pt = 12, pb = 24;
    const x = i => pl + (pts.length === 1 ? (W - pl - pr) / 2 : i * (W - pl - pr) / (pts.length - 1));
    const y = v => pt + (hi - v) / (hi - lo) * (H - pt - pb);
    const line = pts.map((p, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)} ${y(p.w).toFixed(1)}`).join('');
    const dec = hi - lo < 6 ? 1 : 0;
    const ticks = [lo + 0.5, (lo + hi) / 2, hi - 0.5].map(v => `<text x="${pl - 6}" y="${y(v) + 4}" text-anchor="end" font-size="11" fill="var(--muted)">${v.toFixed(dec)}</text><line x1="${pl}" x2="${W - pr}" y1="${y(v)}" y2="${y(v)}" stroke="var(--line)" stroke-dasharray="3 4"/>`).join('');
    const lab = (i) => { const [, mo, dd] = pts[i].d.split('-'); return `${+dd}.${mo}`; };
    const xl = pts.length > 1 ? `<text x="${x(0)}" y="${H - 6}" font-size="11" fill="var(--muted)">${lab(0)}</text><text x="${x(pts.length - 1)}" y="${H - 6}" font-size="11" fill="var(--muted)" text-anchor="end">${lab(pts.length - 1)}</text>` : '';
    const tg = tgt ? `<line x1="${pl}" x2="${W - pr}" y1="${y(tgt)}" y2="${y(tgt)}" stroke="var(--ok)" stroke-width="2"/><text x="${W - pr}" y="${y(tgt) - 6}" text-anchor="end" font-size="11" fill="var(--ok)" font-weight="700">цель</text>` : '';
    box.innerHTML = `<svg viewBox="0 0 ${W} ${H}">${ticks}${tg}<path d="${line}" fill="none" stroke="var(--accent)" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>${pts.map((p, i) => `<circle cx="${x(i)}" cy="${y(p.w)}" r="4" fill="var(--bg)" stroke="var(--accent)" stroke-width="2.5"/>`).join('')}${xl}</svg>`;
  };
  wRO && wRO.disconnect(); wRO = new ResizeObserver(draw); wRO.observe(box); draw();
}
function openWeigh() {
  const sh = openSheet(`<div class="sheet-head"><h2>Новый вес</h2><button class="icon-btn" data-act="close" aria-label="Закрыть">${IC.close}</button></div>
    <div class="range"><input type="range" min="35" max="200" step="0.1" value="${curWeight()}" id="wv" aria-label="Вес"><output id="wvo">${curWeight()} кг</output></div>
    <div class="muted small">Персонаж обновит фигуру по новому весу. Взвешивайтесь утром натощак.</div>
    ${PF.Health.nativeAvailable && S.settings.health ? `<button class="btn ghost" id="wh">${IC.phone}Взять из ${PF.Health.label}</button>` : ''}
    <button class="btn" id="wsave">Сохранить</button>`);
  const out = () => $('#wvo', sh).textContent = (+$('#wv', sh).value).toFixed(1) + ' кг';
  $('#wv', sh).addEventListener('input', out);
  $('#wh', sh)?.addEventListener('click', async () => { const w = await PF.Health.latestWeight(); if (w) { $('#wv', sh).value = w; out(); } else toast('Нет данных о весе'); });
  $('#wsave', sh).addEventListener('click', () => {
    const w = Math.round(+$('#wv', sh).value * 10) / 10, k = today();
    S.weights = S.weights.filter(x => x.d !== k); S.weights.push({ d:k, w }); S.weights.sort((a, b) => a.d < b.d ? -1 : 1);
    addXP(5, { disc:1 }); closeAll(); render(); toast('Вес записан');
  });
}

/* ---------- Профиль ---------- */
/* ---------- Автор и монетизация ---------- */
function vGate() {
  return `<section class="screen gate">
    <div class="arena" style="grid-template-columns:minmax(0,1fr);justify-items:center;text-align:center;min-height:0;padding:28px 20px">
      <span class="ig-ic" style="width:72px;height:72px;border-radius:20px">${IC.insta.replace('<svg', '<svg width="40" height="40"')}</span>
      <h1 style="color:#fff">FitAvatar — бесплатно для подписчиков</h1>
      <div style="color:#d4d6de">Подпишитесь на автора в Instagram <b style="color:#fff">@${esc(CFG.instagram)}</b>: тренировки, питание и мотивация каждый день. После подписки приложение откроется полностью.</div>
    </div>
    <button class="btn" data-act="ig-gate">${IC.insta}Подписаться в Instagram</button>
    <button class="btn ${S.igClicked ? 'dark' : 'ghost'}" data-act="ig-ok" ${S.igClicked ? '' : 'disabled style="opacity:.5"'}>Я подписался — продолжить</button>
    <div class="muted small" style="text-align:center">${S.igClicked ? 'Спасибо! Нажмите «Продолжить».' : 'Сначала откройте Instagram и подпишитесь.'}</div>
  </section>`;
}
function igCard() {
  if (!CFG.instagram) return '';
  return `<div class="card ig" style="display:grid;gap:12px">
    <div class="row"><span class="ig-ic">${IC.insta}</span><div style="flex:1"><h3>Автор в Instagram</h3><div class="muted small">@${esc(CFG.instagram)} · тренировки, питание и мотивация каждый день</div></div></div>
    <div class="grid2"><button class="btn" data-act="ig">Подписаться</button><button class="btn ghost" data-act="ig-dm">Написать</button></div></div>`;
}
/* ---------- Доступ: бесплатно / подписчик / полный пакет ---------- */
const PERKS = {
  1: ['Счётчик калорий и КБЖУ под вашу цель', 'Техника всех упражнений дома и базовых в зале', 'Программы: старт с нуля, жиросжигание, сила без зала, кардио, гибкость', 'Меню для похудения, формы и набора мышц', 'Ещё 10 статей тренера и диетолога'],
  2: ['Все 65 упражнений с техникой — каждая мышца, включая шею', 'Все программы: верх/низ, сушка, бикини, набор для худых, масса в зале', 'Счётчик калорий и все меню, включая сушку и массу', 'Все статьи тренера и диетолога', 'Все будущие программы и функции'],
};
const proBanner = () => `<button class="card pro-banner" data-act="pro"><span class="pro-ic">${IC.crown}</span><span style="flex:1;text-align:left"><b>${tier() ? 'Открыть всё — полный пакет' : 'Открыть больше функций'}</b><br><span class="small">${tier() ? `Сушка, программы в зале и все статьи · ${PRO.priceStars} ⭐` : '2 упражнения и 2 статьи бесплатно · всё — за 200 ⭐'}</span></span>${IC.chev.replace('<svg', '<svg width="20" height="20"')}</button>`;
function proCard() {
  const t = tier();
  return `<div class="card" style="display:grid;gap:12px"><div class="row"><span class="pro-ic">${IC.crown}</span><div style="flex:1"><h3>Доступ: ${TIER_NAME[t]}</h3><div class="muted small">${t >= 2 ? 'Открыто всё. Спасибо за поддержку!' : t === 1 ? `Полный пакет — ${PRO.priceStars} ⭐ навсегда` : 'Часть функций закрыта'}</div></div></div>
    ${t < 2 ? `<button class="btn" data-act="pro">Что открывается</button>` : ''}</div>`;
}
function openPro(reason) {
  const t = tier();
  const list = (arr) => `<ul class="clean">${arr.map(x => `<li>${esc(x)}</li>`).join('')}</ul>`;
  openSheet(`<div class="sheet-head"><div><h2>${t >= 2 ? 'Всё открыто' : 'Открыть больше'}</h2><div class="muted small">Сейчас: ${TIER_NAME[t]}</div></div><button class="icon-btn" data-act="close" aria-label="Закрыть">${IC.close}</button></div>
    ${reason ? `<div class="card small">${esc(reason)}</div>` : ''}
    ${t < 2 ? `<div class="card" style="display:grid;gap:10px;box-shadow:inset 0 0 0 2px var(--gold)"><div class="row"><span class="pro-ic">${IC.crown}</span><div style="flex:1"><h3>Полный пакет — ${PRO.priceStars} ⭐</h3><div class="muted small">Один раз и навсегда — открывается всё:</div></div></div>
      ${list(PERKS[2])}
      <button class="btn" data-act="buy-pro">${IC.star}Купить за ${PRO.priceStars} ⭐</button>
      <div class="muted small">Нет Instagram? Полный пакет открывает всё сразу. Оплата звёздами Telegram, вопросы — /paysupport в боте @${esc(CFG.bot || '')}.</div></div>` : `<div class="card">${list(PERKS[2])}</div><button class="btn ghost" data-act="ig-dm">Написать автору</button>`}
    ${t < 1 && CFG.instagram ? `<div class="card" style="display:grid;gap:10px"><div class="row"><span class="ig-ic">${IC.insta}</span><div style="flex:1"><h3>Подписка на Instagram — бесплатно</h3><div class="muted small">@${esc(CFG.instagram)} · тренировки и питание каждый день</div></div></div>
      ${list(PERKS[1])}
      <div class="grid2"><button class="btn" data-act="ig-gate">Подписаться</button><button class="btn ${S.igClicked ? 'dark' : 'ghost'}" data-act="ig-ok" ${S.igClicked ? '' : 'disabled style="opacity:.5"'}>Я подписался</button></div></div>` : ''}`);
}
const apiUrl = () => String(PRO.apiUrl || '').replace(/\/$/, '');
async function checkPro(silent = true) {
  if (!apiUrl() || !PF.inTG || !PF.TG.initData) return;
  try {
    // простой GET без заголовков — работает и с Google Apps Script, и с bot.js
    const r = await fetch(apiUrl() + (apiUrl().includes('?') ? '&' : '?') + 'action=me&initData=' + encodeURIComponent(PF.TG.initData)).then(x => x.json());
    if (r.full || r.pro) { S.pro = { full:true, at: r.at || Date.now() }; save(); render(); if (!silent) toast('Полный пакет открыт!'); }
    else if (!silent) toast('Оплата пока не найдена — попробуйте через минуту');
  } catch (e) { if (!silent) toast('Не удалось проверить оплату'); }
}
function buyPro() {
  if (PF.isNative) return toast('Покупка в приложении из магазина появится в следующей версии');
  if (!PF.inTG) return toast('Полный пакет оплачивается звёздами внутри Telegram — откройте приложение через бота @' + (CFG.bot || ''));
  if (!PRO.invoiceUrl) return toast('Оплата скоро появится — подключаем приём звёзд');
  PF.TG.openInvoice(PRO.invoiceUrl, (status) => {
    if (status === 'paid') { S.pro = { full:true, at:Date.now() }; save(); PF.haptic('success'); closeAll(); render(); toast('Полный пакет открыт! Спасибо 💪'); setTimeout(() => checkPro(true), 5000); }
    else if (status === 'failed') toast('Оплата не прошла');
  });
}

/* ---------- Гид тренера и диетолога ---------- */
const MEAL_TIER = { lose:1, fit:1, gain:1, cut:2, bulk:2 };
const mealTier = (k) => MEAL_TIER[k] ?? 1;
const guideTier = (g) => g.tier ?? 0;
function guideList(cat) {
  const items = D.GUIDE.filter(g => g.cat === cat);
  return `<div class="card small">${cat === 'food' ? 'Питание под цель простыми словами: сколько есть, как набирать и сушиться без вреда.' : 'Как тренироваться, чтобы росли мышцы и не было травм.'} Цифры — по научным позициям спортивных ассоциаций.</div>
  <div class="list">${items.map(g => `<button class="prog" data-act="guide" data-id="${g.id}"><div class="row between"><h3>${esc(g.title)}</h3>${guideTier(g) > tier() ? lockTag(guideTier(g)) : IC.chev.replace('<svg', '<svg width="20" height="20"')}</div><div class="muted small">${esc(g.sub)}</div></button>`).join('')}</div>`;
}
function openGuide(id) {
  const g = D.guideById[id]; if (!g) return;
  if (guideTier(g) > tier()) return openPro(`Статья «${g.title}» открывается ${guideTier(g) >= 2 ? 'в полном пакете' : 'для подписчиков'}.`);
  const html = g.body.map(([k, v]) => k === 'h' ? `<h3>${esc(v)}</h3>` : k === 'p' ? `<p>${esc(v)}</p>` : k === 'ul' ? `<ul class="clean">${v.map(x => `<li>${esc(x)}</li>`).join('')}</ul>`
    : k === 'tip' ? `<div class="card small"><b>Совет.</b> ${esc(v)}</div>` : k === 'warn' ? `<div class="card small" style="box-shadow:inset 3px 0 0 var(--accent)"><b>Важно.</b> ${esc(v)}</div>`
    : k === 'src' ? `<div class="muted small">Источники: ${esc(v)}</div>` : '').join('');
  openSheet(`<div class="sheet-head"><div><h2>${esc(g.title)}</h2><div class="muted small">${esc(g.sub)}</div></div><button class="icon-btn" data-act="close" aria-label="Закрыть">${IC.close}</button></div>
    <div class="guide">${html}</div><div class="muted small">Материал носит общий характер и не заменяет консультацию врача.</div>`);
}
function goalCard(t) {
  const c = S.char, G = t.G, wk = t.week, sign = wk > 0 ? '+' : wk < 0 ? '−' : '';
  return `<div class="card" style="display:grid;gap:10px">
    <div class="row between"><div><div class="muted small">Ваша цель</div><h3>${esc(G.name)}</h3></div><button class="btn sm ghost" data-act="goal-pick">Сменить</button></div>
    <div class="kv"><div><b>${fmt(t.kcal)}</b><span>ккал в день</span></div><div><b>${t.p} г</b><span>белка · ${t.pk} г/кг</span></div><div><b>${sign}${Math.abs(wk).toFixed(2).replace('.', ',')}</b><span>кг в неделю</span></div></div>
    <div class="small">Жиры ${t.f} г · углеводы ${t.c} г. Ориентир темпа: ${esc(G.rate)}.${t.floored ? ' <b>Калории подняты до безопасного минимума</b> — не опускайтесь ниже без врача.' : ''}</div>
    <div class="muted small">Базовый обмен ${fmt(t.bmr)} ккал, с активностью ${fmt(t.tdee)} ккал (формула Миффлина — Сан Жеора). Это стартовая точка: через 2 недели сверьтесь с весом в «Прогрессе».</div>
    <button class="btn ghost sm" data-act="guide" data-id="${G.guide}">Как питаться под эту цель</button></div>`;
}
function openGoalPick() {
  openSheet(`<div class="sheet-head"><h2>Цель питания</h2><button class="icon-btn" data-act="close" aria-label="Закрыть">${IC.close}</button></div>
    <div class="goal">${D.GOAL_ORDER.map(k => `<button class="${S.char.goal === k ? 'on' : ''}" data-act="goal-set" data-v="${k}"><b>${esc(D.GOALS[k].name)}</b><span>${esc(D.GOALS[k].short)} · ${esc(D.GOALS[k].rate)}</span></button>`).join('')}</div>`);
}

function vProfile() {
  const c = S.char, L = levelInfo(), H = PF.Health;
  const where = PF.isNative ? (PF.os === 'ios' ? 'iOS' : 'Android') : PF.inTG ? 'Telegram' : 'браузер';
  return `<section class="screen"><h1>Профиль</h1>
    <div class="arena gymbg" style="min-height:260px"><div class="stage">${avatarSVG()}</div>
      <div class="info"><h2 style="color:#fff">${esc(c.name || 'Атлет')}${isPro() ? ' <span class="tag pro">⭐ Полный</span>' : ''}</h2><div style="color:#d4d6de;font-size:14px">${c.gender === 'f' ? 'Женский' : 'Мужской'} · ${c.age} ${plural(c.age,'год','года','лет')}<br>${c.height} см · ${curWeight()} кг</div><span class="rank">Ур. ${L.lvl} · ${L.rank}</span>
      <button class="btn sm" data-act="creator" style="width:100%">${IC.edit}Изменить персонажа</button><button class="btn sm ghost" data-act="wardrobe" style="width:100%;color:#fff">${IC.shirt}Гардероб · 🪙 ${fmt(S.coins || 0)}</button></div></div>
    <div class="card" style="display:grid;gap:12px"><div class="row">${IC.phone}<div style="flex:1"><h3>Активность телефона</h3><div class="muted small">${H.nativeAvailable ? (S.settings.health ? `Подключено: ${H.label}` : `Синхронизация шагов, калорий и веса с ${H.label}`) : 'В Telegram шаги считает датчик телефона, пока приложение открыто. Полная синхронизация с Apple Health и Google Health Connect — в версии из App Store и Google Play.'}</div></div></div>
      ${H.nativeAvailable ? `<button class="btn ${S.settings.health ? 'ghost' : ''}" data-act="health">${S.settings.health ? 'Обновить данные' : 'Подключить ' + H.label}</button>`
        : `<div class="grid2"><button class="btn ghost" data-act="pedo">${PF.Pedometer.running ? 'Шагомер включён' : 'Включить шагомер'}</button><button class="btn ghost" data-act="steps">Ввести шаги</button></div>`}
      <div class="field"><span class="lab">Цель по шагам</span><div class="range"><input type="range" min="3000" max="20000" step="500" value="${S.settings.stepGoal}" data-set="stepGoal" aria-label="Цель по шагам"><output>${fmt(S.settings.stepGoal)}</output></div></div></div>
    <div class="card" style="display:grid;gap:12px"><div class="row">${IC.bell}<div style="flex:1"><h3>Тренировка и напоминания</h3><div class="muted small">${PF.Reminders.available ? 'Ежедневное уведомление на телефоне' : PF.inTG ? 'Напоминания присылает бот: команда /remind 19:00' : 'Уведомления доступны в мобильном приложении'}</div></div></div>
      <div class="field"><span class="lab">Отдых между подходами</span><div class="range"><input type="range" min="15" max="180" step="5" value="${S.settings.rest}" data-set="rest" aria-label="Отдых"><output>${S.settings.rest} сек</output></div></div>
      ${PF.Reminders.available ? `<div class="row"><input class="input" type="time" value="${esc(S.settings.remindAt)}" id="rt" aria-label="Время напоминания" style="flex:1"><button class="btn sm" data-act="remind">${S.settings.remind ? 'Выключить' : 'Включить'}</button></div>` : ''}</div>
    ${PRO.enabled ? proCard() : ''}
    ${igCard()}
    <div class="card" style="display:grid;gap:10px"><h3>Данные</h3><div class="muted small">Прогресс хранится на устройстве${PF.inTG ? ' и в облаке Telegram — он сохранится при входе с другого телефона' : ''}.</div>
      <div class="grid2"><button class="btn ghost" data-act="export">Копия данных</button><button class="btn ghost" data-act="import">Восстановить</button></div>
      <button class="btn ghost" data-act="reset" style="color:var(--accent)">Начать заново</button></div>
    <div class="muted small" style="text-align:center">FitAvatar 1.0 · запущено: ${where}</div>
  </section>`;
}
function openSteps() {
  const d = day();
  const sh = openSheet(`<div class="sheet-head"><h2>Шаги сегодня</h2><button class="icon-btn" data-act="close" aria-label="Закрыть">${IC.close}</button></div>
    <input class="input" type="number" inputmode="numeric" min="0" max="100000" value="${d.steps}" id="sv" aria-label="Количество шагов">
    <div class="muted small">Каждые 1000 шагов дают +3 XP к опыту и выносливости. Возьмите число из приложения «Здоровье» или фитнес-браслета.</div>
    <button class="btn" id="ssave">Сохранить</button>`);
  $('#ssave', sh).addEventListener('click', () => { setSteps(+$('#sv', sh).value || 0); closeAll(); });
}
function setSteps(n) {
  const d = day(); d.steps = Math.max(0, Math.round(n));
  const k = Math.floor(d.steps / 1000) - d.stepsXp;
  if (k > 0) { d.stepsXp += k; addXP(k * 3, { end:k }); } else save();
  syncAutoHabits(); render();
}
async function syncHealth(silent) {
  if (!PF.Health.nativeAvailable || !S.settings.health) return;
  const r = await PF.Health.today();
  if (r.steps != null && r.steps > day().steps) setSteps(r.steps);
  if (!silent) toast(r.steps != null ? `Шаги: ${fmt(r.steps)}` : 'Нет данных о шагах');
}

/* ---------- Конструктор персонажа ---------- */
let draft = null, cStep = 0;
const C_STEPS = ['Кто вы', 'Внешность', 'Тело', 'Цель'];
function openCreator(isNew) {
  const u = PF.tgUser();
  draft = Object.assign({ name:u?.first_name || '', gender:'m', age:25, height:175, weight:75, body:'average', look:{ h:'a', hc:0, eye:'1' }, goal:'fit', activity:1.375, place:'home', days:3, target:'' }, S.char || {});
  draft.look = Object.assign({ h:'a', hc:draft.gender === 'f' ? 1 : 0, eye:'1' }, draft.look || {});
  if (!['slim','average','athletic','shredded'].includes(draft.body)) draft.body = 'average';
  if (S.char) draft.weight = curWeight();
  cStep = 0;
  openSheet(`<div id="creator"></div>`, { full:true, onClose: () => { if (!S.char) setTimeout(() => openCreator(true), 0); } });
  drawCreator(isNew);
}
const draftWear = () => LOOK.wearOf(draft, S.wardrobe);
const draftStage = () => LOOK.ORDER[{ slim:0, average:1, athletic:2, shredded:3 }[draft.body] ?? 1];
function creatorPreview() {
  if (cStep === 1) return `<div class="cface gymbg">${LOOK.face(draft)}</div>`;
  if (cStep === 0 && !S.char) return '';
  return `<div class="cbody gymbg">${LOOK.img(draft, draftStage(), draftWear())}<span class="fa-chip">${LOOK.NAMES[draft.gender === 'f' ? 'f' : 'm'][draftStage()]}</span></div>`;
}
function drawCreator(isNew) {
  const box = $('#creator'); if (!box) return;
  const gg = draft.gender === 'f' ? 'f' : 'm', L = LOOK.look(draft);
  const rng = (key, min, max, step, unit, label) => `<div class="field"><span class="lab">${label}</span><div class="range"><input type="range" min="${min}" max="${max}" step="${step}" value="${draft[key]}" data-r="${key}" data-u="${unit}" aria-label="${label}"><output id="o_${key}">${draft[key]} ${unit}</output></div></div>`;
  const pick = (c) => Object.assign({}, draft, c);
  const pages = [
    () => `<div class="hero gymbg"><img src="logo.png" class="hero-logo" alt="FitAvatar"><div class="hero-t">Выбери персонажа</div>
        <div class="hero-pick">${['m', 'f'].map(x => `<button class="hero-card ${draft.gender === x ? 'on' : ''}" data-c="gender" data-v="${x}">${LOOK.img(pick({ gender:x, look:{ h:'a', hc:x === 'f' ? 1 : 0, eye:'1' } }), 'fit', {})}<b>${x === 'f' ? 'Девушка' : 'Парень'}</b></button>`).join('')}</div></div>
      <div class="field"><label for="cname">Имя персонажа</label><input class="input" id="cname" value="${esc(draft.name)}" placeholder="Например, Алекс" maxlength="24"></div>
      ${rng('age', 14, 80, 1, plural(draft.age,'год','года','лет'), 'Возраст')}`,
    () => `<div class="field"><span class="lab">Причёска</span><div class="chips" style="flex-wrap:wrap">${LOOK.HAIRS[gg].map(([k, n]) => `<button class="chip ${L.h === k ? 'on' : ''}" data-c="lh" data-v="${k}">${n}</button>`).join('')}</div></div>
      <div class="field"><span class="lab">Цвет волос</span><div class="swatches">${LOOK.HCOL.map(([n, d, l], i) => `<button class="sw ${L.hc === i ? 'on' : ''}" style="background:linear-gradient(135deg,rgb(${l}),rgb(${d}))" data-c="lhc" data-v="${i}" data-num="1" aria-label="${n}" title="${n}"></button>`).join('')}</div></div>
      <div class="field"><span class="lab">Форма глаз</span><div class="chips" style="flex-wrap:wrap">${LOOK.EYES.map(([k, n]) => `<button class="chip ${L.eye === k ? 'on' : ''}" data-c="leye" data-v="${k}">${n}</button>`).join('')}</div></div>`,
    () => `<div class="field"><span class="lab">Телосложение сейчас</span><div class="builds">${LOOK.ORDER.map(st => `<button class="build ${draftStage() === st ? 'on' : ''}" data-c="body" data-v="${LOOK.BUILD[st]}">${LOOK.img(draft, st, draftWear())}<b>${LOOK.NAMES[gg][st]}</b></button>`).join('')}</div>
        <div class="muted small">Честно выберите, как вы выглядите сейчас. Тренировки и питание будут менять форму персонажа.</div></div>
      ${rng('height', 140, 210, 1, 'см', 'Рост')}${rng('weight', 40, 180, 0.5, 'кг', 'Вес')}
      <div class="muted small" id="bmi">ИМТ ${AV.morph(draft).bmi.toFixed(1)}.</div>`,
    () => `<div class="field"><span class="lab">Главная цель</span><div class="goal">
        ${D.GOAL_ORDER.map(k => [k, D.GOALS[k].name, D.GOALS[k].short]).map(([k, n, s]) => `<button class="${draft.goal === k ? 'on' : ''}" data-c="goal" data-v="${k}"><b>${n}</b><span>${s}</span></button>`).join('')}</div></div>
      <div class="field"><span class="lab">Где тренируетесь</span><div class="seg"><button class="${draft.place === 'home' ? 'on' : ''}" data-c="place" data-v="home">Дома</button><button class="${draft.place === 'gym' ? 'on' : ''}" data-c="place" data-v="gym">В зале</button></div></div>
      <div class="field"><span class="lab">Сколько тренировок в неделю готовы делать</span><div class="seg">${[2,3,4,5,6].map(d => `<button class="${(draft.days || 3) === d ? 'on' : ''}" data-c="days" data-v="${d}" data-num="1">${d}</button>`).join('')}</div><div class="muted small">Под это число подберём план: всё тело, верх/низ или тяни-толкай-ноги.</div></div>
      <div class="field"><label for="cact">Активность в течение дня</label><select class="input" id="cact">${[[1.2,'Сидячая работа, мало движения'],[1.375,'Лёгкая: 1–3 тренировки в неделю'],[1.55,'Средняя: 3–5 тренировок'],[1.725,'Высокая: 6–7 тренировок']].map(([v, n]) => `<option value="${v}" ${+draft.activity === v ? 'selected' : ''}>${n}</option>`).join('')}</select></div>
      <div class="field"><label for="ctarget">Желаемый вес, кг (необязательно)</label><input class="input" id="ctarget" type="number" inputmode="decimal" min="35" max="200" value="${esc(draft.target)}"></div>`,
  ];
  box.innerHTML = `<div class="session-top">${cStep ? `<button class="icon-btn" data-cnav="-1" aria-label="Назад">${IC.back}</button>` : S.char ? `<button class="icon-btn" data-act="close" aria-label="Закрыть">${IC.close}</button>` : '<span style="width:44px"></span>'}
      <div style="text-align:center"><div class="muted small">Шаг ${cStep + 1} из ${C_STEPS.length}</div><h2>${isNew && !cStep ? 'Создайте своего персонажа' : C_STEPS[cStep]}</h2></div><span style="width:44px"></span></div>
    <div class="dots">${C_STEPS.map((_, i) => `<i class="${i === cStep ? 'on' : ''}"></i>`).join('')}</div>
    <div id="cprev">${creatorPreview()}</div>
    <div style="display:grid;gap:16px">${pages[cStep]()}</div>
    <button class="btn" data-cnav="1">${cStep < C_STEPS.length - 1 ? 'Дальше' : S.char ? 'Сохранить' : 'Начать путь'}</button>`;
}
const refreshPreview = () => { const b = $('#bmi'); if (b) b.textContent = `ИМТ ${AV.morph(draft).bmi.toFixed(1)}.`; };
function readCreatorInputs() {
  const n = $('#cname'); if (n) draft.name = n.value.trim();
  const a = $('#cact'); if (a) draft.activity = +a.value;
  const t = $('#ctarget'); if (t) draft.target = t.value ? +t.value : '';
}
function finishCreator() {
  const isNew = !S.char;
  const c = Object.assign({}, draft);
  if (isNew) {
    S.weights = [{ d:today(), w:c.weight }];
    S.program = { id:'my', next:0 };
  } else if (Math.abs(c.weight - curWeight()) >= 0.1) {
    S.weights = S.weights.filter(x => x.d !== today()); S.weights.push({ d:today(), w:c.weight });
  }
  S.char = c; save(); syncPlan();
  closeAll(); render();
  if (isNew) toast(`Персонаж создан! ${D.progById[S.program.id].name}`);
}

/* ---------- Гардероб ---------- */
let wrSlot = 't';
function openWardrobe() {
  openSheet(`<div id="wardrobe"></div>`, { full:true });
  drawWardrobe();
}
function drawWardrobe() {
  const box = $('#wardrobe'); if (!box) return;
  const c = charNow(), gg = c.gender === 'f' ? 'f' : 'm', wr = S.wardrobe, wear = LOOK.wearOf(c, wr), st = LOOK.stage(c, S.fit);
  const slots = LOOK.SLOTS.filter(([k]) => LOOK.itemsOf(gg).some(x => x.slot === k));
  if (!slots.some(([k]) => k === wrSlot)) wrSlot = 't';
  const items = LOOK.itemsOf(gg).filter(x => x.slot === wrSlot);
  const own = (it) => it.base || wr.own.includes(gg + ':' + it.id);
  const worn = (it) => (wear[it.slot] || '') === (it.base ? '' : it.id);
  box.innerHTML = `<div class="sheet-head"><h2>Гардероб</h2><button class="icon-btn" data-act="close" aria-label="Закрыть">${IC.close}</button></div>
    <div class="wr-top gymbg">${LOOK.img(c, st, wear)}<div class="wr-coins">🪙 <b>${fmt(S.coins || 0)}</b><span>монет</span></div></div>
    <div class="muted small">Монеты начисляются за каждое выполненное задание, тренировку, воду и шаги — столько же, сколько опыта. На всей форме — логотип FitAvatar.</div>
    <div class="chips">${slots.map(([k, n]) => `<button class="chip ${wrSlot === k ? 'on' : ''}" data-act="wr-slot" data-v="${k}">${n}</button>`).join('')}</div>
    <div class="wr-grid">${items.map(it => { const w = Object.assign({}, wear, { [it.slot]: it.base ? '' : it.id });
      return `<div class="wr-item ${worn(it) ? 'on' : ''}"><div class="wr-pic">${LOOK.img(c, st, w)}</div><b>${esc(it.name)}</b>
        ${worn(it) ? '<span class="tag">Надето</span>' : own(it) ? `<button class="btn sm" data-act="wr-wear" data-v="${it.id}">Надеть</button>`
          : isOwner() ? `<button class="btn sm" data-act="wr-buy" data-v="${it.id}">Взять бесплатно</button>`
          : `<button class="btn sm ${(S.coins || 0) < it.price ? 'ghost' : ''}" data-act="wr-buy" data-v="${it.id}">🪙 ${it.price}</button>`}</div>`; }).join('')}</div>`;
}
function wrBuy(id) {
  const gg = S.char.gender === 'f' ? 'f' : 'm', it = LOOK.itemById(gg, id); if (!it) return;
  const price = isOwner() ? 0 : it.price;
  if ((S.coins || 0) < price) { toast(`Нужно ещё ${it.price - (S.coins || 0)} монет — выполняйте задания и тренировки`); PF.haptic('warning'); return; }
  S.coins -= price; S.wardrobe.own.push(gg + ':' + id); wrWear(id, true); PF.haptic('success'); toast(`${it.name} — ваша! Уже надета.`);
}
function wrWear(id, quiet) {
  const gg = S.char.gender === 'f' ? 'f' : 'm', it = LOOK.itemById(gg, id); if (!it) return;
  S.wardrobe.wear[gg][it.slot] = it.base ? '' : id; save(); drawWardrobe(); render(); if (!quiet) PF.haptic('light');
}

/* ---------- Повышение уровня ---------- */
function showLevelUp(lvl) {
  PF.haptic('success');
  const cols = ['#ff4d2e','#f5b301','#3b9dff','#b27dff','#fff'];
  const w = document.createElement('div'); w.className = 'overlay center';
  w.innerHTML = `<div class="levelup"><div class="confetti">${Array.from({ length:36 }, (_, i) => `<i style="left:${(i * 2.8) % 100}%;background:${cols[i % 5]};animation-delay:${(i % 9) * 0.12}s"></i>`).join('')}</div>
    <div class="muted" style="color:#d4d6de">Новый уровень</div><div class="lvl" style="font-family:var(--display);font-size:64px;line-height:1">${lvl}</div>
    ${avatarSVG({ glow:true })}<span class="rank">${levelInfo().rank}</span>
    <div style="color:#d4d6de;font-size:14px">Персонаж стал сильнее. Продолжайте в том же духе!</div>
    <button class="btn" data-x="ok">Отлично</button><button class="btn ghost" data-x="share" style="background:var(--arena2);color:#fff">${IC.share}Поделиться</button></div>`;
  w.addEventListener('click', e => { const b = e.target.closest('[data-x]'); if (b?.dataset.x === 'share') share(); if (b || e.target === w) w.remove(); });
  layer.appendChild(w);
}
function share() {
  const L = levelInfo();
  const text = `Мой персонаж в FitAvatar достиг ${L.lvl} уровня (${L.rank})! ${totalWorkouts()} тренировок, серия ${streak()} дн.`;
  PF.openLink(`https://t.me/share/url?url=${encodeURIComponent(APP_URL)}&text=${encodeURIComponent(text + (CFG.instagram ? ` Автор: instagram.com/${CFG.instagram}` : ''))}`);
}
// Ссылка на ваш бот/приложение — замените на свою
const APP_URL = 'https://t.me/' + (CFG.bot || 'fitavatar_app_bot');

/* ---------- Данные: экспорт/импорт ---------- */
function openExport() {
  const sh = openSheet(`<div class="sheet-head"><h2>Копия данных</h2><button class="icon-btn" data-act="close" aria-label="Закрыть">${IC.close}</button></div>
    <textarea class="input" readonly id="ex">${esc(JSON.stringify(S))}</textarea><button class="btn" id="cp">Скопировать</button>`);
  $('#cp', sh).addEventListener('click', async () => { try { await navigator.clipboard.writeText($('#ex', sh).value); toast('Скопировано'); } catch (e) { $('#ex', sh).select(); toast('Выделите и скопируйте текст'); } });
}
function openImport() {
  const sh = openSheet(`<div class="sheet-head"><h2>Восстановить</h2><button class="icon-btn" data-act="close" aria-label="Закрыть">${IC.close}</button></div>
    <textarea class="input" id="im" placeholder="Вставьте сохранённую копию"></textarea><button class="btn" id="ib">Восстановить</button>`);
  $('#ib', sh).addEventListener('click', () => { try { const v = JSON.parse($('#im', sh).value); if (!v.char) throw 0; S = Object.assign(defaults(), v); migrateLook(); save(); closeAll(); render(); toast('Данные восстановлены'); } catch (e) { toast('Не удалось прочитать данные'); } });
}

/* ======================= РЕНДЕР И СОБЫТИЯ ======================= */
function syncPlan() { const c = S.char; if (!c) return; const k = [c.days || 3, c.place, c.goal].join(); if (syncPlan.k !== k) { D.setMyPlan(c.days || 3, c.place, c.goal); syncPlan.k = k; } }
const TABS = [['home','Главная','home'],['workouts','Тренировки','dumbbell'],['food','Питание','apple'],['progress','Прогресс','chart'],['profile','Профиль','user']];
function render() {
  const app = $('#app'), nav = $('#nav');
  if (gateOn()) { nav.hidden = true; app.innerHTML = vGate(); return; }
  syncPlan();
  if (!S.char) { app.innerHTML = ''; nav.hidden = true; if (!$('#creator')) openCreator(true); return; }
  nav.hidden = false;
  nav.innerHTML = `<div class="in">${TABS.map(([k, n, ic]) => `<button class="${S.tab === k ? 'on' : ''}" data-act="tab" data-tab="${k}" aria-current="${S.tab === k ? 'page' : 'false'}">${IC[ic]}${n}</button>`).join('')}</div>`;
  const view = { home:vHome, workouts:vWorkouts, food:vFood, progress:vProgress, profile:vProfile }[S.tab] || vHome;
  app.innerHTML = view();
  if (S.tab === 'progress') drawWeightChart();
  mountThumbs(app);
}

const acts = {
  tab: (b) => { S.tab = b.dataset.tab; save(); render(); window.scrollTo(0, 0); },
  toggle: (b) => toggleItem(b.dataset.id),
  'auto-info': (b) => b.dataset.id === 'h_water' ? (day().water++, syncAutoHabits(), save(), render()) : openSteps(),
  ex: (b) => openExercise(b.dataset.id),
  close: () => closeTop(),
  session: (b) => startSession(b.dataset.prog, b.dataset.day),
  'water-add': () => { const d = day(); d.water = Math.min(d.water + 1, 20); PF.haptic('light'); syncAutoHabits(); checkAch(); save(); render(); },
  'water-set': (b) => { const d = day(), v = +b.dataset.v; d.water = d.water === v ? v - 1 : v; PF.haptic('light'); syncAutoHabits(); checkAch(); save(); render(); },
  steps: () => openSteps(),
  'task-add': () => {
    const sh = openSheet(`<div class="sheet-head"><h2>Свой пункт</h2><button class="icon-btn" data-act="close" aria-label="Закрыть">${IC.close}</button></div>
      <form id="tf" style="display:grid;gap:12px"><input class="input" name="t" placeholder="Например: 20 минут прогулки" required maxlength="60"><button class="btn">Добавить</button></form>
      <div class="muted small">Пункт будет появляться каждый день. За выполнение +10 XP.</div>`);
    $('#tf', sh).addEventListener('submit', e => { e.preventDefault(); S.tasks.push({ id:'t' + Date.now(), title:new FormData(e.target).get('t'), xp:10 }); save(); closeTop(); render(); });
    setTimeout(() => $('#tf input', sh)?.focus(), 200);
  },
  'task-del': (b) => confirmBox('Удалить пункт?', 'Удалить', () => { S.tasks = S.tasks.filter(t => t.id !== b.dataset.id); save(); render(); }),
  wseg: (b) => { wSeg = b.dataset.v; render(); },
  wfilter: (b) => { wFilter = b.dataset.v; render(); },
  'plan-days': (b) => { S.char.days = +b.dataset.v; S.program = { id:'my', next:0 }; save(); render(); toast(`План: ${b.dataset.v} ${+b.dataset.v < 5 ? 'тренировки' : 'тренировок'} в неделю`); },
  'plan-place': (b) => { S.char.place = b.dataset.v; if (S.program.id === 'my') S.program.next = 0; save(); render(); toast(b.dataset.v === 'gym' ? 'План для зала' : 'План для дома'); },
  'plan-use': () => { S.program = { id:'my', next:0 }; save(); render(); toast('Тренируетесь по своему плану'); },
  exfilter: (b) => { exFilter = b.dataset.v; render(); },
  prog: (b) => openProgram(b.dataset.id),
  'prog-pick': (b) => { if (isLocked(b.dataset.id)) return openPro(); S.program = { id:b.dataset.id, next:0 }; save(); closeAll(); render(); toast('Программа выбрана'); },
  video: (b) => PF.openLink('https://www.youtube.com/results?search_query=' + encodeURIComponent(b.dataset.q)),
  fseg: (b) => { fSeg = b.dataset.v; render(); },
  pday: (b) => { planDay = +b.dataset.v; render(); },
  'food-add': () => openFoodAdd(),
  'food-pick': (b) => openFoodGrams(b.dataset.n),
  'food-del': (b) => { day().food.splice(+b.dataset.i, 1); save(); render(); },
  weigh: () => openWeigh(),
  creator: () => openCreator(false),
  wardrobe: () => openWardrobe(),
  'wr-slot': (b) => { wrSlot = b.dataset.v; drawWardrobe(); },
  'wr-buy': (b) => wrBuy(b.dataset.v),
  'wr-wear': (b) => wrWear(b.dataset.v),
  health: async () => {
    if (!S.settings.health) { const r = await PF.Health.connect(); if (!r.ok) return toast('Не удалось подключить: ' + (r.reason || 'нет доступа')); S.settings.health = true; save(); }
    await syncHealth(false); render();
  },
  pedo: async () => {
    if (PF.Pedometer.running) { PF.Pedometer.stop(); render(); return; }
    const ok = await PF.Pedometer.start(() => { const d = day(); if (d.steps % 20 === 19) setSteps(d.steps + 1); else { d.steps++; } });
    toast(ok ? 'Шагомер включён, пока приложение открыто' : 'Датчик движения недоступен на этом устройстве'); render();
  },
  remind: async () => {
    if (S.settings.remind) { await PF.Reminders.cancel(); S.settings.remind = false; }
    else { const v = ($('#rt')?.value || '19:00').split(':'); S.settings.remindAt = $('#rt')?.value || '19:00'; S.settings.remind = await PF.Reminders.schedule(+v[0], +v[1]); if (!S.settings.remind) toast('Разрешите уведомления в настройках телефона'); }
    save(); render();
  },
  export: () => openExport(),
  import: () => openImport(),
  reset: () => confirmBox('Удалить персонажа и весь прогресс?', 'Удалить', () => { PF.store.clear(); S = defaults(); migrateLook(); save(); closeAll(); render(); }),
  share: () => share(),
  ig: () => PF.openLink(igUrl()),
  'ig-gate': () => { PF.openLink(igUrl()); S.igClicked = true; save(); setTimeout(render, 800); },
  'ig-ok': () => { if (!S.igClicked) return; S.igOk = true; save(); PF.haptic('success'); closeAll(); render(); toast('Готово! Открыты функции для подписчиков'); },
  'ig-dm': () => PF.openLink('https://ig.me/m/' + encodeURIComponent(CFG.instagram || '')),
  pro: () => openPro(),
  guide: (b) => openGuide(b.dataset.id),
  mgoal: (b) => { mGoal = b.dataset.v; planDay = 0; render(); },
  'goal-pick': () => tier() < 1 ? openPro('Расчёт калорий под цель открывается после подписки или в полном пакете.') : openGoalPick(),
  'goal-set': (b) => { S.char.goal = b.dataset.v; if (S.program.id === 'my') S.program.next = 0; mGoal = null; save(); closeAll(); render(); toast('Цель: ' + D.GOALS[b.dataset.v].name); },
  'buy-pro': () => buyPro(),
  's-set': () => finishSet(),
  's-go': () => { sess.phase = 'work'; renderSession(); },
  's-w': (b) => { sess.w = Math.max(0, Math.round(((+sess.w || 0) + +b.dataset.v) * 2) / 2); renderSession(); },
  's-r': (b) => { sess.r = Math.max(0, (sess.r || 0) + +b.dataset.v); renderSession(); },
  's-timer': () => { sess.left = sess.plan.items[sess.i].it.time; PF.haptic('medium'); renderSession(); },
  's-skip': () => afterRest(),
  's-plus': () => { sess.left += 15; const c = $('#clock'); if (c) c.textContent = sess.left; },
  's-next': () => { const d = day(); const nxt = sess.plan.items.findIndex((x, k) => k > sess.i && !d.done[x.id]); if (nxt < 0) { closeTop(); } else { sess.i = nxt; sess.set = 1; sess.w = null; sess.r = null; sess.phase = 'work'; sess.left = 0; renderSession(); } },
};

document.addEventListener('click', (e) => {
  const b = e.target.closest('[data-act]');
  if (b && acts[b.dataset.act]) { e.preventDefault(); acts[b.dataset.act](b); return; }
  // конструктор
  const c = e.target.closest('[data-c]');
  if (c && draft) {
    readCreatorInputs();
    const k = c.dataset.c; let v = c.dataset.v;
    if (c.dataset.num) v = +v;
    if (k === 'lh' || k === 'lhc' || k === 'leye') draft.look = Object.assign({}, draft.look, { [{ lh:'h', lhc:'hc', leye:'eye' }[k]]: v });
    else draft[k] = v;
    if (k === 'gender') draft.look = { h:'a', hc:v === 'f' ? 1 : 0, eye:draft.look?.eye || '1' };
    PF.haptic('light'); drawCreator(!S.char); return;
  }
  const n = e.target.closest('[data-cnav]');
  if (n && draft) {
    readCreatorInputs();
    const step = +n.dataset.cnav;
    if (step > 0 && cStep === C_STEPS.length - 1) return finishCreator();
    cStep = clamp(cStep + step, 0, C_STEPS.length - 1); drawCreator(!S.char); $('.full')?.scrollTo(0, 0);
  }
});
document.addEventListener('input', (e) => {
  const t = e.target;
  if (t.dataset.r && draft) { draft[t.dataset.r] = +t.value; const unit = t.dataset.r === 'age' ? plural(+t.value,'год','года','лет') : t.dataset.u; $('#o_' + t.dataset.r).textContent = `${t.value} ${unit}`; refreshPreview(); }
  if (t.dataset.set) { S.settings[t.dataset.set] = +t.value; t.nextElementSibling.textContent = t.dataset.set === 'rest' ? t.value + ' сек' : fmt(+t.value); save(); }
  if (t.dataset.input === 'exq') { exQuery = t.value; const list = $('#exlist'); if (list) { const q = exQuery.trim().toLowerCase(); list.innerHTML = D.EX.filter(x => (exFilter === 'все' || x.muscles.includes(exFilter)) && (!q || x.name.toLowerCase().includes(q))).map(exRow).join('') || '<div class="muted">Ничего не найдено</div>'; mountThumbs(list); } }
});
document.addEventListener('keydown', e => { const pop = document.querySelector('.overlay.center'); if (e.key === 'Escape' && pop) { pop.remove(); return; } if (e.key === 'Escape' && stack.length && !(!S.char && $('#creator'))) closeTop(); });

/* ---------- Старт ---------- */
PF.initTelegram(() => { if (stack.length) closeTop(); });
applyDecay();
render();
syncAutoHabits();
// облако Telegram: берём более свежую версию
checkPro();
PF.store.loadCloud().then(v => { if (v && v.char && (!S.char || (v.ts || 0) > (S.ts || 0) + 5000)) { S = Object.assign(defaults(), v); migrateLook(); PF.store.save(S); closeAll(); render(); } });
if (S.settings.health) syncHealth(true);
document.addEventListener('visibilitychange', () => { if (!document.hidden) { if (S.settings.health) syncHealth(true); if (S.char) render(); } });
}
