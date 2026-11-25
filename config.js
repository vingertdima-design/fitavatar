/* FitAvatar — настройки владельца. Меняйте здесь, остальной код трогать не нужно. */
window.FA_CONFIG = {
  // Автор и соцсети
  instagram: 'vingert_dima',            // ваш Instagram без @
  // Экран «Подпишитесь на Instagram» перед входом. Работает только в Telegram:
  // в App Store и Google Play требовать подписку на соцсети запрещено правилами магазинов.
  instagramGate: true,
  bot: 'fitavatar_app_bot',             // username Telegram-бота без @

  // Монетизация: FitAvatar PRO за Telegram Stars
  pro: {
    enabled: true,
    priceStars: 199,                    // цена в звёздах Telegram
    days: 30,                           // срок доступа после оплаты
    // Адрес сервера бота (bot/bot.js) с HTTPS, например 'https://fitavatar-bot.onrender.com'.
    // Пока пусто — оплата идёт через чат с ботом (/pro), а PRO включается после проверки сервером.
    apiUrl: '',
    lockedPrograms: ['mass', 'cardio'], // программы только для PRO
  },
};
