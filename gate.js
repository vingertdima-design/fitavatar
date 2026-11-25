/* FitAvatar — доступ только подписчикам Telegram-канала.
 * Проверка идёт через сервер бота (getChatMember) при каждом открытии, при возврате в приложение
 * и раз в 5 минут. Отписался — приложение закрывается экраном подписки; прогресс сохраняется
 * и возвращается сразу после повторной подписки.
 * Выключено, пока в config.js не заданы channel и pro.apiUrl. Вне Telegram не действует. */
(function () {
  var CFG = window.FA_CONFIG || {};
  var channel = String(CFG.channel || '').replace(/^@/, '').trim();
  var api = String((CFG.pro && CFG.pro.apiUrl) || '').replace(/\/$/, '');
  var TG = window.Telegram && window.Telegram.WebApp;
  var initData = TG && TG.initData;
  if (!channel || !api || !initData) return;

  var KEY = 'fa_sub_last';
  var box = null, busy = false;

  function remember(v) { try { localStorage.setItem(KEY, v ? '1' : '0'); } catch (e) {} }
  function lastKnown() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }

  function show(msg) {
    if (!box) {
      box = document.createElement('div');
      box.setAttribute('role', 'dialog');
      box.style.cssText = 'position:fixed;inset:0;z-index:9999;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;padding:32px 24px;text-align:center;background:#17191f;color:#f4f4f6;font-family:Rubik,system-ui,sans-serif';
      box.innerHTML =
        '<div style="width:84px;height:84px;border-radius:26px;background:linear-gradient(135deg,#ff5a36,#ff2d6f);display:flex;align-items:center;justify-content:center;font-size:40px">🔒</div>' +
        '<div style="font:600 26px/1.2 Oswald,Rubik,sans-serif">FitAvatar — для подписчиков</div>' +
        '<div style="font-size:15px;line-height:1.5;opacity:.75;max-width:320px">Подпишитесь на канал <b>@' + channel + '</b>, чтобы тренироваться и прокачивать персонажа. Ваш прогресс сохранён и вернётся сразу после подписки.</div>' +
        '<div data-msg style="font-size:13px;color:#ff8a70;min-height:18px"></div>' +
        '<button data-sub style="width:100%;max-width:320px;padding:16px;border:0;border-radius:16px;background:#ff5a36;color:#fff;font:700 16px Rubik,sans-serif">Подписаться на канал</button>' +
        '<button data-check style="width:100%;max-width:320px;padding:14px;border:0;border-radius:16px;background:#262830;color:#f4f4f6;font:700 15px Rubik,sans-serif">Я подписался — проверить</button>';
      box.querySelector('[data-sub]').onclick = function () {
        var url = 'https://t.me/' + channel;
        if (TG.openTelegramLink) TG.openTelegramLink(url); else window.open(url, '_blank');
      };
      box.querySelector('[data-check]').onclick = function () { check(true); };
      document.body.appendChild(box);
      if (TG.BackButton) TG.BackButton.hide();
    }
    box.querySelector('[data-msg]').textContent = msg || '';
  }
  function hide() { if (box) { box.remove(); box = null; } }

  function check(manual) {
    if (busy) return;
    busy = true;
    fetch(api + '/api/sub', { headers: { 'X-Init-Data': initData } })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (j) {
        if (j && j.sub === true) { remember(true); hide(); if (manual && TG.HapticFeedback) TG.HapticFeedback.notificationOccurred('success'); }
        else if (j && j.sub === false) { remember(false); show(manual ? 'Подписка пока не найдена. Подпишитесь и нажмите ещё раз.' : ''); }
        else unknown();
      })
      .catch(unknown)
      .then(function () { busy = false; });
  }
  // Сервер не ответил: последний известный отказ продолжает блокировать, остальных не запираем.
  function unknown() { if (lastKnown() === '0') show('Не удалось проверить подписку. Проверьте интернет и нажмите ещё раз.'); }

  if (lastKnown() === '0') show('');
  check(false);
  document.addEventListener('visibilitychange', function () { if (!document.hidden) check(false); });
  if (TG.onEvent) TG.onEvent('activated', function () { check(false); });
  setInterval(function () { if (!document.hidden) check(false); }, 5 * 60e3);
})();
