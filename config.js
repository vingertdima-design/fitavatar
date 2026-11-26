/* FitAvatar — настройки владельца. Меняйте здесь, остальной код трогать не нужно. */
window.FA_CONFIG = {
  // Автор и соцсети
  instagram: 'vingert_dima',            // ваш Instagram без @
  // Доступ в 3 уровня: бесплатно (урезано) → подписчик Instagram (больше) → полный пакет за звёзды (всё).
  // 'soft' — приложение открыто всем, подписка открывает больше. 'hard' — без подписки не пускает.
  // В App Store и Google Play требовать подписку на соцсети нельзя — там работает только покупка.
  instagramGate: 'soft',
  bot: 'fitavatar_app_bot',             // username Telegram-бота без @

  // Доступ только подписчикам Telegram-канала — ПРОВЕРЯЕТСЯ по-настоящему при каждом открытии:
  // отписался — приложение закрывается экраном «Подпишитесь». Нужны: username канала,
  // бот @fitavatar_app_bot в админах канала и запущенный сервер бота (pro.apiUrl ниже).
  // Пока пусто — проверка выключена. Instagram так проверить нельзя: у него нет такой функции.
  channel: '',                          // например 'vingert_dima' (без @)

  // Монетизация: «Полный пакет» навсегда за звёзды Telegram. Звёзды приходят на баланс бота,
  // вывод — @BotFather → бот → Баланс → Вывод через Fragment (от 1000 ⭐, через 21 день).
  pro: {
    enabled: true,
    priceStars: 200,
    invoiceUrl: 'https://t.me/$maRakOgIQUjMFgAALMedDDzTxjs',   // ссылка на счёт t.me/$..., её выдаёт сервер оплаты (server/Code.gs → setup)
    apiUrl: 'https://script.google.com/macros/s/AKfycbwBO8g1SzIPOWVS9cCR-JLC3bq_9iZmxHpwk3FOTxt1ipIEWT5y4f__7g_sHr7Lm6kb/exec',     // адрес сервера оплаты (Google Apps Script /exec) — восстанавливает покупку на новом устройстве
  },
};
