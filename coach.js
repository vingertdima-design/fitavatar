/* FitAvatar — «личный тренер»: подсказки в тренировке, отдых, подбор веса, прогрессия, советы по питанию */
window.COACH = (() => {
  const D = window.DATA;
  const BASIC = new Set(['bench','incline','cgbench','pdips','cpress','deadlift','bbsquat','legpress','rdl','pullup','latpd','crow','bbrow','dbrow1','ohp','press','hipthrust','bulgarian','goblet','dblunge','squat','lunge','pushup','dips']);
  const BW = new Set(['squat','pushup','plank','lunge','bridge','crunch','bicycle','superman','calf','jack','burpee','climber','knees','rope','pullup','dips','pdips','fold','catcow','child','sideplank','hyper','legraise','neckflex','neckext','neckiso']);
  const isBasic = (id) => BASIC.has(id);
  const usesWeight = (ex) => ex && ex.type === 'str' && !BW.has(ex.id);

  // отдых между подходами — по цели и типу упражнения
  function rest(ex, goal, fallback = 60) {
    if (!ex || ex.type !== 'str') return ex && ex.type === 'cardio' ? 30 : 20;
    const b = isBasic(ex.id);
    if (goal === 'gain' || goal === 'bulk') return b ? 120 : 75;
    if (goal === 'cut') return b ? 90 : 60;
    if (goal === 'lose') return b ? 60 : 45;
    return b ? 90 : 60;
  }
  // сколько оставлять в запасе
  const rir = (ex, goal) => !ex || ex.type !== 'str' ? '' : isBasic(ex.id) ? (goal === 'lose' ? '2–3 повтора в запасе' : '1–2 повтора в запасе') : '0–1 повтор в запасе — можно почти до отказа';

  // главная подсказка к упражнению: первый шаг техники + главная ошибка
  function cue(ex) {
    if (!ex) return '';
    const s = (ex.steps || [])[1] || (ex.steps || [])[0] || '';
    const m = (ex.mistakes || [])[0];
    return { focus: s, avoid: m ? 'Не допускай: ' + m.charAt(0).toLowerCase() + m.slice(1) : '', breath: ex.breath || '' };
  }

  // история весов: log[exId] = [{ d, sets:[[кг, повторы], ...] }]
  function last(log, exId) { const h = (log && log[exId]) || []; return h.length ? h[h.length - 1] : null; }
  function best(log, exId) { let b = 0; ((log && log[exId]) || []).forEach(e => e.sets.forEach(([w]) => { if (w > b) b = w; })); return b; }
  // подсказка по весу на сегодня (двойная прогрессия)
  function suggest(log, ex, it) {
    if (!usesWeight(ex)) return null;
    const L = last(log, ex.id); if (!L || !L.sets.length) return { w: 0, text: 'Первый раз: возьми вес, с которым сделаешь все повторы чисто и останется ещё 2–3 в запасе. Запиши его — в следующий раз подскажу, что дальше.' };
    const w = Math.max(...L.sets.map(s => s[0]));
    const target = it.reps || 10, allHit = L.sets.length >= it.sets && L.sets.every(s => s[0] >= w && s[1] >= target);
    const step = isBasic(ex.id) ? (w >= 40 ? 2.5 : 2) : (w >= 20 ? 2 : 1);
    if (allHit) return { w: Math.round((w + step) * 2) / 2, text: `Прошлый раз ${fmtW(w)} × ${L.sets.map(s => s[1]).join(', ')} — все повторы сделаны. Сегодня добавь вес: ${fmtW(w + step)}.` };
    const minR = Math.min(...L.sets.map(s => s[1]));
    if (minR < target - 3) return { w: Math.round(w * 0.9 * 2) / 2, text: `Прошлый раз ${fmtW(w)} было тяжело (${L.sets.map(s => s[1]).join(', ')}). Сегодня сбрось до ${fmtW(Math.round(w * 0.9 * 2) / 2)} и сделай чисто.` };
    return { w, text: `Прошлый раз ${fmtW(w)} × ${L.sets.map(s => s[1]).join(', ')}. Оставь ${fmtW(w)} и добери до ${target} повторов во всех подходах.` };
  }
  const fmtW = (w) => (Math.round(w * 10) / 10).toString().replace('.', ',') + ' кг';

  // разминка под тренировку
  function warmup(items) {
    const hasLegs = items.some(x => (x.ex.muscles || []).some(m => m === 'ноги' || m === 'ягодицы'));
    const hasUpper = items.some(x => (x.ex.muscles || []).some(m => ['грудь','спина','плечи','дельты','бицепс','трицепс'].includes(m)));
    const L = ['3–5 минут лёгкого кардио: ходьба, велосипед или прыжки — до лёгкого пота'];
    if (hasUpper) L.push('Вращения плечами и руками, 10–15 раз в каждую сторону');
    if (hasLegs) L.push('10 приседаний без веса и 10 выпадов, мягко раскрыть тазобедренные');
    const b = items.find(x => usesWeight(x.ex) && isBasic(x.ex.id));
    if (b) L.push(`Перед «${b.ex.name}» — 2 разминочных подхода: 50% рабочего веса × 10 и 70% × 5`);
    return L;
  }

  // брифинг перед тренировкой
  function brief(plan, goal, log) {
    const mins = Math.round(plan.items.reduce((s, x) => s + x.it.sets * ((x.it.time || x.it.reps * 3) + rest(x.ex, goal)), 0) / 60) + 7;
    const G = { gain:'набор мышц', bulk:'набор массы', cut:'сушка', lose:'похудение', fit:'форма' }[goal] || 'форма';
    const muscles = [...new Set(plan.items.flatMap(x => x.ex.muscles || []).filter(m => !['кардио','растяжка','всё тело'].includes(m)))].slice(0, 6);
    const rep = goal === 'gain' || goal === 'bulk' ? 'Базовые упражнения — тяжело, 6–10 повторов. Изоляция — 10–15, с контролем.' : goal === 'cut' ? 'Сохраняем силу: базовые тяжело, отдых короче. Кардио в конце — в среднем темпе.' : goal === 'lose' ? 'Темп выше, отдых короче — так тратится больше энергии. Технику не жертвуем.' : 'Работаем в 8–12 повторах, последний повтор — тяжёлый, но чистый.';
    return { mins, G, muscles, rep, warm: warmup(plan.items) };
  }

  // разбор после тренировки
  function review(sessLog, log) {
    let vol = 0; const prs = [];
    Object.entries(sessLog || {}).forEach(([id, sets]) => {
      sets.forEach(([w, r]) => { vol += w * r; });
      const top = Math.max(0, ...sets.map(s => s[0])), prev = best(log, id);
      if (top > 0 && top > prev && prev > 0) prs.push({ id, name: (D.exById[id] || {}).name, w: top });
    });
    return { vol: Math.round(vol), prs };
  }

  // питание: что съесть, чтобы закрыть норму белка
  const PROT = [['Куриная грудка', 31, 165, 150], ['Творог 5%', 17, 121, 200], ['Яйца', 13, 155, 110], ['Греческий йогурт', 10, 73, 250], ['Тунец консервированный', 24, 116, 150], ['Индейка', 29, 135, 150], ['Говядина постная', 26, 187, 150]];
  function proteinFix(leftP, leftK) {
    if (leftP <= 10) return [];
    const out = []; let need = leftP;
    for (const [n, p, k, g] of PROT) {
      if (need <= 8) break;
      const kc = k * g / 100; if (leftK > 0 && kc > leftK * 0.8 && out.length) continue;
      const pp = Math.round(p * g / 100); out.push({ n, g, p: pp, k: Math.round(kc) }); need -= pp;
      if (out.length >= 2) break;
    }
    return out;
  }
  // распределение калорий по приёмам пищи
  function meals(t, workoutToday) {
    const parts = [['Завтрак', .25], ['Обед', .35], ['Перекус', .15], ['Ужин', .25]];
    return parts.map(([n, k]) => ({ n, k: Math.round(t.kcal * k / 10) * 10, p: Math.round(t.p * (n === 'Перекус' ? .2 : .27)) }))
      .concat(workoutToday ? [] : []);
  }
  function mealNow(h) { return h < 11 ? 'Завтрак' : h < 15 ? 'Обед' : h < 18 ? 'Перекус' : 'Ужин'; }

  // недельная корректировка калорий по реальному весу
  function adjust(weights, goal, weekPlan) {
    if (!weights || weights.length < 2) return null;
    const now = new Date(weights[weights.length - 1].d), old = weights.filter(w => (now - new Date(w.d)) / 864e5 >= 10);
    if (!old.length) return null;
    const a = old[old.length - 1], b = weights[weights.length - 1];
    const days = (new Date(b.d) - new Date(a.d)) / 864e5; if (days < 10) return null;
    const perWeek = (b.w - a.w) / days * 7, r = Math.round(perWeek * 100) / 100;
    const want = goal === 'lose' || goal === 'cut' ? 'down' : goal === 'gain' || goal === 'bulk' ? 'up' : 'flat';
    let msg = '', kcal = 0;
    if (want === 'down') { if (perWeek > -0.15) { kcal = -150; msg = 'Вес почти стоит — убери ~150 ккал в день (например, перекус) или добавь 2–3 тыс. шагов.'; } else if (perWeek < -1.0) { kcal = 150; msg = 'Худеешь слишком быстро — добавь ~150 ккал, иначе уйдут мышцы.'; } else msg = 'Темп отличный — ничего не меняем.'; }
    if (want === 'up') { if (perWeek < 0.1) { kcal = 150; msg = 'Вес не растёт — добавь ~150 ккал: стакан молока или горсть орехов.'; } else if (perWeek > 0.6) { kcal = -150; msg = 'Набираешь слишком быстро — убери ~150 ккал, чтобы не копить жир.'; } else msg = 'Набор идёт в правильном темпе.'; }
    if (want === 'flat') { msg = Math.abs(perWeek) < 0.25 ? 'Вес стабилен — так и держим.' : perWeek > 0 ? 'Вес немного растёт — убери ~100 ккал.' : 'Вес немного снижается — добавь ~100 ккал.'; kcal = Math.abs(perWeek) < 0.25 ? 0 : perWeek > 0 ? -100 : 100; }
    return { perWeek: r, msg, kcal };
  }

  // замены: упражнения на ту же главную мышцу
  function swaps(ex, place, n = 3) {
    if (!ex) return [];
    const m = (ex.muscles || [])[0];
    return D.EX.filter(x => x.id !== ex.id && x.type === ex.type && (x.muscles || [])[0] === m && (place === 'gym' || x.place !== 'gym')).slice(0, n);
  }

  return { rest, rir, cue, suggest, warmup, brief, review, proteinFix, meals, mealNow, adjust, swaps, usesWeight, isBasic, last, best, fmtW };
})();
