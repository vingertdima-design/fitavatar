/* FitAvatar — данные: упражнения, программы, питание, достижения */
window.DATA = (() => {
  // type: str — сила (растут мышцы), cardio — жиросжигание, flex — гибкость
  // muscles: группы для фильтра; anim — ключ анимации в anim.js; place: home/gym
  const EX = [
    { id:'squat', name:'Приседания', type:'str', muscles:['ноги','ягодицы'], place:'home', anim:'squat', kcal:0.5,
      steps:['Встаньте, стопы на ширине плеч, носки немного развёрнуты.','Отведите таз назад, как будто садитесь на стул.','Опуститесь до параллели бёдер с полом, спина прямая, руки вперёд.','Оттолкнитесь пятками и вернитесь в исходное положение.'],
      mistakes:['Колени заваливаются внутрь','Пятки отрываются от пола','Спина округляется'], breath:'Вдох — вниз, выдох — вверх.' },
    { id:'pushup', name:'Отжимания', type:'str', muscles:['грудь','руки','плечи'], place:'home', anim:'pushup', kcal:0.6,
      steps:['Упор лёжа: ладони чуть шире плеч, тело — одна прямая линия.','Согните локти под углом ~45° к корпусу и опуститесь грудью к полу.','Мощно выжмите себя вверх до прямых рук.','Новичкам — с колен или от скамьи.'],
      mistakes:['Таз провисает или задран','Локти разведены в стороны на 90°','Неполная амплитуда'], breath:'Вдох — вниз, выдох — вверх.' },
    { id:'plank', name:'Планка на предплечьях', type:'str', muscles:['пресс','спина'], place:'home', anim:'plank', kcal:0.3, timed:true,
      steps:['Упритесь предплечьями в пол, локти под плечами.','Ноги прямые, опора на носки.','Напрягите пресс и ягодицы — тело как струна.','Держите положение, не задерживая дыхание.'],
      mistakes:['Провисание поясницы','Таз поднят слишком высоко','Голова опущена вниз'], breath:'Ровное спокойное дыхание.' },
    { id:'lunge', name:'Выпады', type:'str', muscles:['ноги','ягодицы'], place:'home', anim:'lunge', kcal:0.5,
      steps:['Встаньте прямо, руки на поясе.','Сделайте широкий шаг вперёд.','Опуститесь, пока оба колена не согнутся под 90°, заднее колено почти касается пола.','Оттолкнитесь передней ногой и вернитесь. Меняйте ноги.'],
      mistakes:['Колено уходит далеко за носок','Корпус наклоняется вперёд','Слишком короткий шаг'], breath:'Вдох — вниз, выдох — вверх.' },
    { id:'bridge', name:'Ягодичный мостик', type:'str', muscles:['ягодицы','спина'], place:'home', anim:'bridge', kcal:0.35,
      steps:['Лягте на спину, колени согнуты, стопы на полу.','Руки вдоль тела.','Поднимите таз вверх, сжимая ягодицы, до прямой линии плечи–колени.','Задержитесь на секунду и плавно опуститесь.'],
      mistakes:['Прогиб в пояснице вместо работы ягодиц','Стопы слишком далеко'], breath:'Выдох — подъём, вдох — опускание.' },
    { id:'crunch', name:'Скручивания', type:'str', muscles:['пресс'], place:'home', anim:'crunch', kcal:0.3,
      steps:['Лягте на спину, колени согнуты.','Руки тянутся к коленям или скрещены на груди.','На выдохе оторвите лопатки от пола, скручивая корпус.','Медленно вернитесь назад.'],
      mistakes:['Тянуть себя за шею','Рывки вместо контроля'], breath:'Выдох — подъём.' },
    { id:'bicycle', name:'Велосипед', type:'str', muscles:['пресс'], place:'home', anim:'bicycle', kcal:0.4,
      steps:['Лягте на спину, руки за головой, лопатки приподняты.','Подтяните одно колено к груди, вторую ногу выпрямите.','Меняйте ноги, как будто крутите педали.','Поясница прижата к полу.'],
      mistakes:['Поясница отрывается','Слишком быстрый темп'], breath:'Выдох на каждом подтягивании колена.' },
    { id:'superman', name:'Супермен', type:'str', muscles:['спина','ягодицы'], place:'home', anim:'superman', kcal:0.3,
      steps:['Лягте на живот, руки вытянуты вперёд.','Одновременно поднимите руки, грудь и ноги.','Задержитесь на 1–2 секунды.','Плавно опуститесь.'],
      mistakes:['Запрокидывание головы','Рывки'], breath:'Выдох — подъём.' },
    { id:'calf', name:'Подъёмы на носки', type:'str', muscles:['ноги'], place:'home', anim:'calf', kcal:0.2,
      steps:['Встаньте прямо, можно держаться за опору.','Поднимитесь на носки как можно выше.','Задержитесь на секунду.','Медленно опуститесь.'],
      mistakes:['Слишком быстрый темп','Неполная амплитуда'], breath:'Выдох — вверх.' },
    { id:'jack', name:'Джампинг Джек', type:'cardio', muscles:['кардио','ноги'], place:'home', anim:'jack', kcal:0.8, timed:true,
      steps:['Встаньте прямо, руки вдоль тела.','В прыжке разведите ноги и поднимите руки над головой.','В следующем прыжке вернитесь в исходное положение.','Держите ровный быстрый темп.'],
      mistakes:['Приземление на пятки','Сутулая спина'], breath:'Ритмичное дыхание.' },
    { id:'burpee', name:'Бёрпи', type:'cardio', muscles:['кардио','всё тело'], place:'home', anim:'burpee', kcal:1.2,
      steps:['Из положения стоя присядьте и поставьте руки на пол.','Прыжком отведите ноги назад в упор лёжа.','Верните ноги к рукам прыжком.','Выпрыгните вверх, хлопнув руками над головой.'],
      mistakes:['Провисание в планке','Приземление на прямые ноги'], breath:'Выдох на прыжке.' },
    { id:'climber', name:'Скалолаз', type:'cardio', muscles:['кардио','пресс'], place:'home', anim:'climber', kcal:0.9, timed:true,
      steps:['Упор лёжа на прямых руках.','Подтяните колено к груди.','Быстро смените ногу.','Таз держите на уровне плеч.'],
      mistakes:['Таз задран вверх','Плечи уходят назад от кистей'], breath:'Быстрое ритмичное дыхание.' },
    { id:'knees', name:'Бег с высоким подниманием колен', type:'cardio', muscles:['кардио','ноги'], place:'home', anim:'knees', kcal:0.9, timed:true,
      steps:['Бегите на месте.','Поднимайте колени до уровня пояса.','Работайте руками, как при беге.','Приземляйтесь мягко на переднюю часть стопы.'],
      mistakes:['Наклон корпуса назад','Низкий подъём колен'], breath:'Ритмичное дыхание.' },
    { id:'rope', name:'Скакалка', type:'cardio', muscles:['кардио','ноги'], place:'home', anim:'rope', kcal:1.0, timed:true,
      steps:['Локти прижаты к корпусу, вращение — кистями.','Прыгайте невысоко на носках.','Колени слегка согнуты.','Держите ровный ритм.'],
      mistakes:['Слишком высокие прыжки','Вращение всей рукой'], breath:'Ровное дыхание.' },
    { id:'pullup', name:'Подтягивания', type:'str', muscles:['спина','руки'], place:'gym', anim:'pullup', kcal:0.8,
      steps:['Возьмитесь за перекладину хватом чуть шире плеч.','Сведите лопатки и потяните себя вверх локтями вниз.','Подбородок выше перекладины.','Медленно опуститесь до прямых рук.'],
      mistakes:['Раскачивание','Неполная амплитуда'], breath:'Выдох — вверх.' },
    { id:'row', name:'Тяга гантелей в наклоне', type:'str', muscles:['спина','руки'], place:'gym', anim:'row', kcal:0.5,
      steps:['Наклонитесь вперёд с прямой спиной, колени слегка согнуты.','Гантели в опущенных руках.','Тяните гантели к поясу, сводя лопатки.','Плавно опустите.'],
      mistakes:['Круглая спина','Рывок корпусом'], breath:'Выдох — тяга.' },
    { id:'press', name:'Жим гантелей над головой', type:'str', muscles:['плечи','руки'], place:'gym', anim:'press', kcal:0.5,
      steps:['Гантели на уровне плеч, локти чуть впереди.','Выжмите гантели вверх до прямых рук.','Не прогибайтесь в пояснице.','Опустите под контролем.'],
      mistakes:['Прогиб в спине','Рывок ногами'], breath:'Выдох — жим.' },
    { id:'curl', name:'Сгибания на бицепс', type:'str', muscles:['руки'], place:'gym', anim:'curl', kcal:0.3,
      steps:['Встаньте прямо, гантели в опущенных руках.','Локти прижаты к корпусу.','Согните руки, поднимая гантели к плечам.','Медленно опустите.'],
      mistakes:['Раскачивание корпусом','Локти уходят вперёд'], breath:'Выдох — подъём.' },
    { id:'dips', name:'Обратные отжимания от скамьи', type:'str', muscles:['руки','грудь'], place:'home', anim:'dips', kcal:0.5,
      steps:['Упритесь руками в край скамьи или стула за спиной.','Ноги вытянуты вперёд.','Сгибайте локти, опуская таз вниз.','Выпрямите руки, возвращаясь вверх.'],
      mistakes:['Локти разведены в стороны','Плечи поднимаются к ушам'], breath:'Выдох — вверх.' },
    { id:'rdl', name:'Румынская тяга', type:'str', muscles:['ноги','спина','ягодицы'], place:'gym', anim:'rdl', kcal:0.6,
      steps:['Гантели или штанга перед бёдрами, колени слегка согнуты.','Отводите таз назад, наклоняя корпус с прямой спиной.','Опустите вес до середины голени.','Вернитесь, толкая таз вперёд.'],
      mistakes:['Круглая спина','Приседание вместо наклона'], breath:'Вдох — вниз, выдох — вверх.' },
    { id:'bench', name:'Жим лёжа', type:'str', muscles:['грудь','руки','плечи'], place:'gym', anim:'bench', kcal:0.6,
      steps:['Лягте на скамью, лопатки сведены, стопы на полу.','Возьмите гриф чуть шире плеч.','Опустите штангу к низу груди.','Выжмите вверх до прямых рук.'],
      mistakes:['Отрыв таза от скамьи','Отбив от груди'], breath:'Вдох — вниз, выдох — жим.' },
    { id:'fold', name:'Наклон к ногам (растяжка)', type:'flex', muscles:['растяжка','спина'], place:'home', anim:'fold', kcal:0.1, timed:true,
      steps:['Встаньте прямо, стопы вместе.','На выдохе наклонитесь вперёд от тазобедренных суставов.','Расслабьте шею и руки.','Дышите глубоко, с каждым выдохом опускаясь чуть ниже.'],
      mistakes:['Рывки и пружинящие движения','Сильное напряжение коленей'], breath:'Глубокое медленное дыхание.' },
    { id:'catcow', name:'Кошка-корова', type:'flex', muscles:['растяжка','спина'], place:'home', anim:'catcow', kcal:0.1, timed:true,
      steps:['Встаньте на четвереньки: руки под плечами, колени под тазом.','На вдохе прогните спину, взгляд вверх («корова»).','На выдохе округлите спину, подбородок к груди («кошка»).','Двигайтесь плавно в ритме дыхания.'],
      mistakes:['Резкие движения','Движение только шеей'], breath:'Вдох — прогиб, выдох — округление.' },
    { id:'child', name:'Поза ребёнка', type:'flex', muscles:['растяжка','спина'], place:'home', anim:'child', kcal:0.05, timed:true,
      steps:['Сядьте на пятки, колени чуть шире таза.','Наклонитесь вперёд, лоб на пол.','Руки вытяните вперёд.','Расслабьтесь и дышите животом.'],
      mistakes:['Напряжение в плечах'], breath:'Медленное дыхание животом.' },
    { id:'sideplank', name:'Боковая планка', type:'str', muscles:['пресс'], place:'home', anim:'plank', kcal:0.3, timed:true,
      steps:['Лягте на бок, опора на предплечье, локоть под плечом.','Поднимите таз — тело в одну линию.','Держите, не опуская таз.','Повторите на другую сторону.'],
      mistakes:['Таз провисает','Корпус заваливается вперёд'], breath:'Ровное дыхание.' },
  ];
  const exById = Object.fromEntries(EX.map(e => [e.id, e]));

  // Программы. Элемент: [id упражнения, подходы, повторы | секунды(t)]
  const e = (ex, sets, n, timed) => ({ ex, sets, [timed ? 'time' : 'reps']: n });
  const PROGRAMS = [
    { id:'start', name:'Старт с нуля', goal:'fit', place:'home', level:'Новичок', weeks:4,
      desc:'Мягкое начало для тех, кто давно не тренировался. 3 раза в неделю по 20 минут.',
      days:[
        { name:'День A — всё тело', items:[e('squat',3,12), e('pushup',3,6), e('bridge',3,12), e('plank',3,20,1), e('catcow',1,40,1)] },
        { name:'День B — кор и кардио', items:[e('jack',3,30,1), e('lunge',3,8), e('crunch',3,12), e('superman',3,10), e('child',1,40,1)] },
        { name:'День C — выносливость', items:[e('knees',3,25,1), e('squat',3,15), e('dips',3,8), e('bicycle',3,16), e('fold',1,40,1)] },
      ]},
    { id:'burn', name:'Жиросжигание дома', goal:'lose', place:'home', level:'Средний', weeks:6,
      desc:'Круговые HIIT-тренировки без инвентаря: максимум калорий за 30 минут.',
      days:[
        { name:'HIIT 1', items:[e('jack',4,40,1), e('burpee',4,10), e('climber',4,30,1), e('squat',4,20), e('plank',3,40,1)] },
        { name:'Кардио + пресс', items:[e('knees',4,40,1), e('rope',4,60,1), e('bicycle',3,20), e('crunch',3,20), e('fold',1,45,1)] },
        { name:'HIIT 2', items:[e('burpee',5,8), e('lunge',4,12), e('climber',4,40,1), e('pushup',3,12), e('sideplank',2,30,1)] },
        { name:'Активное восстановление', items:[e('catcow',2,45,1), e('bridge',3,15), e('fold',2,45,1), e('child',2,45,1)] },
      ]},
    { id:'mass', name:'Набор массы в зале', goal:'gain', place:'gym', level:'Средний', weeks:8,
      desc:'Сплит верх/низ с прогрессией нагрузки. Работайте в 8–12 повторениях, добавляйте вес каждую неделю.',
      days:[
        { name:'Верх — жим', items:[e('bench',4,10), e('press',4,10), e('dips',3,12), e('pushup',3,15)] },
        { name:'Низ', items:[e('squat',4,12), e('rdl',4,10), e('lunge',3,10), e('calf',4,20), e('plank',3,45,1)] },
        { name:'Верх — тяга', items:[e('pullup',4,8), e('row',4,10), e('curl',3,12), e('superman',3,12)] },
        { name:'Ноги и кор', items:[e('squat',5,10), e('bridge',4,15), e('bicycle',3,20), e('sideplank',3,30,1)] },
      ]},
    { id:'homeforce', name:'Сила без зала', goal:'gain', place:'home', level:'Средний', weeks:6,
      desc:'Собственный вес + медленный темп. Подходит для набора мышц дома.',
      days:[
        { name:'Грудь и руки', items:[e('pushup',5,15), e('dips',4,12), e('plank',3,45,1), e('superman',3,12)] },
        { name:'Ноги', items:[e('squat',5,20), e('lunge',4,12), e('bridge',4,20), e('calf',4,25)] },
        { name:'Спина и кор', items:[e('superman',4,15), e('crunch',4,20), e('bicycle',3,24), e('sideplank',3,40,1)] },
      ]},
    { id:'cardio', name:'Выносливость и кардио', goal:'lose', place:'home', level:'Любой', weeks:4,
      desc:'Укрепляет сердце и повышает выносливость. Совмещайте с ходьбой 8–10 тыс. шагов.',
      days:[
        { name:'Интервалы', items:[e('rope',5,60,1), e('knees',5,30,1), e('jack',4,45,1)] },
        { name:'Кардио-силовая', items:[e('burpee',4,10), e('squat',4,20), e('climber',4,30,1), e('lunge',3,12)] },
      ]},
    { id:'flex', name:'Гибкость и спина', goal:'fit', place:'home', level:'Любой', weeks:4,
      desc:'Растяжка и мобильность. Отлично подходит после работы за компьютером.',
      days:[
        { name:'Мобильность', items:[e('catcow',3,45,1), e('fold',3,45,1), e('child',3,60,1), e('bridge',3,12)] },
        { name:'Спина', items:[e('superman',3,12), e('catcow',3,45,1), e('child',2,60,1), e('plank',2,30,1)] },
      ]},
  ];
  const progById = Object.fromEntries(PROGRAMS.map(p => [p.id, p]));

  // Продукты на 100 г: ккал, белки, жиры, углеводы
  const FOODS = [
    ['Куриная грудка',165,31,3.6,0],['Индейка',135,29,1.5,0],['Говядина постная',187,26,9,0],['Лосось',208,20,13,0],
    ['Треска',82,18,0.7,0],['Яйцо (1 шт ≈ 55 г)',155,13,11,1.1],['Творог 5%',121,17,5,1.8],['Йогурт греческий 2%',73,10,2,3.6],
    ['Кефир 1%',40,3,1,4],['Молоко 2,5%',52,2.8,2.5,4.7],['Сыр',350,25,27,0],['Гречка варёная',110,4,1,21],
    ['Рис варёный',130,2.7,0.3,28],['Овсянка на воде',88,3,1.7,15],['Макароны из тв. сортов',140,5,1,28],['Картофель варёный',82,2,0.4,17],
    ['Хлеб цельнозерновой',247,13,3.4,41],['Банан',89,1.1,0.3,23],['Яблоко',52,0.3,0.2,14],['Ягоды',45,1,0.4,10],
    ['Огурец',15,0.7,0.1,3],['Помидор',18,0.9,0.2,3.9],['Брокколи',34,2.8,0.4,7],['Салат овощной',25,1.2,0.2,5],
    ['Авокадо',160,2,15,9],['Орехи грецкие',654,15,65,14],['Арахисовая паста',588,25,50,20],['Оливковое масло',884,0,100,0],
    ['Фасоль',127,9,0.5,23],['Чечевица',116,9,0.4,20],['Тофу',76,8,4.8,1.9],['Протеин (порция 30 г)',380,78,6,8],
    ['Шоколад',546,5,31,61],['Пицца',266,11,10,33],['Бургер',295,17,14,24],['Сладкая газировка',42,0,0,10.6],
  ].map(([name,kcal,p,f,c]) => ({ name, kcal, p, f, c }));

  // Примерное меню. Калорийность ориентировочная.
  const MEALS = {
    lose: { title:'Похудение', kcal:'1500–1800 ккал', rules:[
        'Дефицит 15–20% от нормы — без голодовок.','Белок 1,8–2 г на кг веса: сохраняет мышцы.','Половина тарелки — овощи.','Пейте 30–35 мл воды на кг веса.','Сладкое и фастфуд — не чаще 1 раза в неделю.'],
      eat:['Курица, индейка, рыба, яйца','Творог, кефир, греческий йогурт','Гречка, овсянка, бурый рис','Овощи, зелень, ягоды'],
      limit:['Сахар и сладкие напитки','Выпечка и белый хлеб','Жареное и фастфуд','Алкоголь'],
      days:[
        { name:'День 1', meals:[['Завтрак','Овсянка на воде с ягодами + 2 яйца',420],['Перекус','Греческий йогурт',120],['Обед','Гречка 150 г + куриная грудка 150 г + салат',520],['Перекус','Яблоко + горсть орехов (15 г)',160],['Ужин','Запечённая треска + брокколи',300]] },
        { name:'День 2', meals:[['Завтрак','Творог 5% с бананом',330],['Перекус','Кефир 1%',100],['Обед','Суп с фасолью + цельнозерновой хлеб',450],['Перекус','Огурцы + 2 яйца',190],['Ужин','Индейка + овощи на гриле',380]] },
        { name:'День 3', meals:[['Завтрак','Омлет из 3 яиц с помидорами',330],['Перекус','Ягоды + йогурт',150],['Обед','Рис 120 г + лосось 120 г + салат',560],['Перекус','Протеиновый коктейль на воде',120],['Ужин','Тофу или курица + тушёные овощи',320]] },
      ]},
    gain: { title:'Набор мышечной массы', kcal:'2600–3200 ккал', rules:[
        'Профицит 10–15% от нормы.','Белок 1,6–2,2 г на кг веса, равномерно 4–5 раз в день.','Углеводы вокруг тренировки — энергия и восстановление.','Сон 7–9 часов — мышцы растут во время отдыха.','Прибавка 0,25–0,5 кг в неделю — нормальный темп.'],
      eat:['Мясо, рыба, яйца, творог','Крупы, макароны, картофель','Орехи, арахисовая паста, авокадо','Бананы, сухофрукты, молоко'],
      limit:['Пустые калории (сладости, газировка)','Трансжиры','Пропуски приёмов пищи'],
      days:[
        { name:'День 1', meals:[['Завтрак','Овсянка на молоке + банан + арахисовая паста',650],['Перекус','Творог + орехи',400],['Обед','Макароны 200 г + говядина 180 г + овощи',800],['После тренировки','Протеин + банан',300],['Ужин','Рис 200 г + лосось 150 г',650]] },
        { name:'День 2', meals:[['Завтрак','4 яйца + цельнозерновой хлеб + сыр',650],['Перекус','Греческий йогурт + мюсли',380],['Обед','Гречка 200 г + куриная грудка 200 г + салат с маслом',780],['После тренировки','Молоко + банан',260],['Ужин','Картофель + индейка + авокадо',640]] },
        { name:'День 3', meals:[['Завтрак','Блины из овсянки + творог + мёд',620],['Перекус','Сухофрукты + орехи',420],['Обед','Плов с курицей (300 г)',750],['После тренировки','Протеин на молоке',300],['Ужин','Паста с тунцом + овощи',680]] },
      ]},
  };

  // Достижения: проверяются функцией из app.js
  const ACH = [
    { id:'first', name:'Первый шаг', desc:'Завершите первую тренировку', icon:'bolt' },
    { id:'w10', name:'Десятка', desc:'10 тренировок', icon:'medal' },
    { id:'w50', name:'Железная воля', desc:'50 тренировок', icon:'trophy' },
    { id:'s3', name:'В ритме', desc:'Серия 3 дня подряд', icon:'flame' },
    { id:'s7', name:'Неделя силы', desc:'Серия 7 дней', icon:'flame' },
    { id:'s30', name:'Привычка', desc:'Серия 30 дней', icon:'crown' },
    { id:'l5', name:'Уровень 5', desc:'Достигните 5 уровня', icon:'star' },
    { id:'l10', name:'Уровень 10', desc:'Достигните 10 уровня', icon:'star' },
    { id:'steps10k', name:'10 000 шагов', desc:'Пройдите 10 000 шагов за день', icon:'shoe' },
    { id:'water', name:'Водный баланс', desc:'Выпейте норму воды', icon:'drop' },
    { id:'food', name:'Осознанное питание', desc:'Заполните дневник питания', icon:'apple' },
    { id:'weigh5', name:'Под контролем', desc:'5 записей веса', icon:'scale' },
  ];

  const HABITS = [
    { id:'h_water', title:'Выпить норму воды', xp:10, auto:'water' },
    { id:'h_steps', title:'Пройти норму шагов', xp:15, auto:'steps' },
    { id:'h_food', title:'Уложиться в калории', xp:10 },
    { id:'h_sleep', title:'Сон 7–8 часов', xp:10 },
  ];

  const TIPS = [
    'Прогресс — это регулярность. 3 тренировки в неделю лучше, чем 7 в первую и ни одной потом.',
    'Белок в каждом приёме пищи помогает и худеть, и набирать мышцы.',
    'Разминка 5 минут снижает риск травм. Начните с суставов и лёгкого кардио.',
    'Если болит сустав — остановитесь. Мышечная усталость — нормально, острая боль — нет.',
    'Взвешивайтесь утром натощак 1–2 раза в неделю: вес колеблется от воды.',
    'Сон — главный «добавка» для восстановления. Цель — 7–9 часов.',
  ];

  return { EX, exById, PROGRAMS, progById, FOODS, MEALS, ACH, HABITS, TIPS };
})();

/* FitAvatar — персонаж в SVG. Фигура меняется от роста, веса, телосложения и прокачки (muscle/fat 0..1) */
window.Avatar = (() => {
  const SKIN = ['#fde3d0','#f6cfb0','#ecb58f','#d99a6c','#b97a4e','#94603a','#6e4428','#4a2e1c'];
  const HAIR = ['#1b1715','#3b2a20','#6b4428','#a0703f','#d6b170','#e8d9b5','#9a3b1f','#7a7f88'];
  const EYES = ['#5b3a1e','#2f2117','#3f6fa8','#6a9bd1','#4e8a5c','#8a8f6a'];
  const OUTFIT = ['#ff4d2e','#2563eb','#16a34a','#111827','#9333ea','#f59e0b'];
  const HEADS = { oval:'Овальная', round:'Круглая', square:'Квадратная', long:'Вытянутая', heart:'Сердечком' };
  const HAIRS = { short:'Короткая', buzz:'Ёжик', long:'Длинные', ponytail:'Хвост', bob:'Каре', curly:'Кудри', bald:'Без волос' };
  const BODIES = { slim:'Худощавое', average:'Среднее', athletic:'Спортивное', full:'Плотное' };
  const BEARDS = { none:'Нет', stubble:'Щетина', beard:'Борода' };
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  let uid = 0;

  // Форма тела из параметров и прогресса
  function morph(c, fit = {}) {
    const bmi = c.weight / ((c.height / 100) ** 2);
    const adj = { slim:-0.08, average:0, athletic:-0.12, full:0.12 }[c.body] || 0;
    const baseM = { slim:0.1, average:0.22, athletic:0.5, full:0.2 }[c.body] || 0.2;
    const fat = clamp((bmi - 18.5) / 14 + adj - (fit.fatLoss || 0), 0, 1);
    const muscle = clamp(baseM + (fit.muscleGain || 0), 0, 1);
    return { fat, muscle, bmi };
  }

  function headShape(h, skin) {
    switch (h) {
      case 'round': return { el:`<ellipse cx="100" cy="68" rx="28" ry="29" fill="${skin}"/>`, rx:28 };
      case 'square': return { el:`<rect x="74" y="38" width="52" height="60" rx="15" fill="${skin}"/>`, rx:26 };
      case 'long': return { el:`<ellipse cx="100" cy="68" rx="23" ry="34" fill="${skin}"/>`, rx:23 };
      case 'heart': return { el:`<path d="M73 58 Q73 36 100 36 Q127 36 127 58 Q127 82 100 101 Q73 82 73 58Z" fill="${skin}"/>`, rx:27 };
      default: return { el:`<ellipse cx="100" cy="68" rx="25" ry="31" fill="${skin}"/>`, rx:25 };
    }
  }

  function hairLayers(style, col) {
    const back = {
      long:`<path d="M70 60 Q67 26 100 26 Q133 26 130 60 L136 142 Q100 154 64 142Z" fill="${col}"/>`,
      bob:`<path d="M69 60 Q67 27 100 27 Q133 27 131 60 L133 102 Q118 108 112 98 L88 98 Q82 108 67 102Z" fill="${col}"/>`,
      ponytail:`<circle cx="124" cy="44" r="10" fill="${col}"/><path d="M126 46 Q150 70 136 118 Q128 92 118 60Z" fill="${col}"/>`,
      curly: [0,1,2,3,4,5].map(i => `<circle cx="${72 + i * 11}" cy="${84 + (i % 2) * 6}" r="9" fill="${col}"/>`).join(''),
    }[style] || '';
    const front = {
      short:`<path d="M72 66 Q69 29 100 29 Q133 29 128 66 Q124 47 112 43 Q100 52 84 45 Q76 52 72 66Z" fill="${col}"/>`,
      buzz:`<path d="M74 62 Q74 33 100 33 Q126 33 126 62 Q118 45 100 45 Q82 45 74 62Z" fill="${col}" opacity=".9"/>`,
      long:`<path d="M72 66 Q71 31 100 31 Q129 31 128 66 Q121 44 100 41 Q86 44 80 52 Q75 58 72 66Z" fill="${col}"/>`,
      ponytail:`<path d="M73 62 Q72 32 100 32 Q128 32 127 62 Q118 44 100 43 Q82 44 73 62Z" fill="${col}"/>`,
      bob:`<path d="M71 70 Q70 31 100 31 Q130 31 129 70 Q126 48 100 46 Q76 48 71 70Z" fill="${col}"/>`,
      curly: Array.from({ length:9 }, (_, i) => { const a = Math.PI * (1.08 + i * 0.105); return `<circle cx="${(100 + Math.cos(a) * 26).toFixed(1)}" cy="${(64 + Math.sin(a) * 30).toFixed(1)}" r="10" fill="${col}"/>`; }).join(''),
    }[style] || '';
    return { back, front };
  }

  /**
   * render(char, fit, opts) → строка SVG
   * opts: { mood:'happy'|'neutral'|'tired', glow:bool }
   */
  function render(c, fit = {}, opts = {}) {
    const id = 'av' + (++uid);
    const { fat, muscle } = morph(c, fit);
    const f = c.gender === 'f';
    const skin = SKIN[c.skin] || SKIN[2];
    const hairC = HAIR[c.hairColor] || HAIR[1];
    const eyeC = EYES[c.eyes] || EYES[0];
    const cloth = OUTFIT[c.outfit ?? 0];
    const shade = 'rgba(0,0,0,.14)';
    const mv = f ? muscle * 0.7 : muscle; // у женского персонажа рельеф мягче

    // полуширины
    const sw = (f ? 31 : 37) + mv * 11 + fat * 4;
    const cw = sw - 2 + fat * 6;
    const ww = (f ? 22 : 27) + fat * 21 - mv * 2;
    const hw = (f ? 34 : 29) + fat * 13;
    const belly = fat * 8;
    const aw = 9 + mv * 6 + fat * 4;
    const tw = hw * 0.36 + 3 + mv * 3;
    const neck = 7 + mv * 4 + fat * 2;

    const torso = `M${100 - sw} 124 Q100 110 ${100 + sw} 124 C${100 + cw + 2} 142 ${100 + ww + belly} 168 ${100 + ww} 190 C${100 + ww} 206 ${100 + hw} 212 ${100 + hw} 228 L${100 + hw - 2} 246 L${100 - hw + 2} 246 L${100 - hw} 228 C${100 - hw} 212 ${100 - ww} 206 ${100 - ww} 190 C${100 - ww - belly} 168 ${100 - cw - 2} 142 ${100 - sw} 124Z`;

    // ноги
    const leg = (side) => {
      const lx = 100 + side * (hw * 0.5 + 1);
      const kx = 100 + side * (hw * 0.4 + 3), fx = 100 + side * 13;
      return `<line x1="${lx}" y1="236" x2="${kx}" y2="318" stroke="${skin}" stroke-width="${tw * 1.5}" stroke-linecap="round"/>
        <line x1="${kx}" y1="318" x2="${fx}" y2="382" stroke="${skin}" stroke-width="${tw * 1.0}" stroke-linecap="round"/>
        <ellipse cx="${fx + side * 3}" cy="390" rx="15" ry="7" fill="#1f2430"/><path d="M${fx - 12 + side * 3} 388 h24" stroke="#fff" stroke-width="2" opacity=".6"/>`;
    };
    // руки
    const arm = (side) => {
      const sx = 100 + side * (sw - 3 + fat * 3), ex = 100 + side * (sw + aw * 0.55 + 4 + fat * 9), hx = 100 + side * (sw + aw * 0.4 + 7 + fat * 9);
      const bic = mv > 0.15 ? `<ellipse cx="${(sx + ex) / 2 + side * 1.5}" cy="158" rx="${aw * 0.55 + mv * 3}" ry="${15 + mv * 3}" fill="${skin}"/>` : '';
      return `<line x1="${sx}" y1="132" x2="${ex}" y2="190" stroke="${skin}" stroke-width="${aw * 2}" stroke-linecap="round"/>${bic}
        <line x1="${ex}" y1="190" x2="${hx}" y2="240" stroke="${skin}" stroke-width="${aw * 1.6}" stroke-linecap="round"/>
        <circle cx="${hx}" cy="${246}" r="${aw * 0.8 + 2}" fill="${skin}"/>`;
    };

    const head = headShape(c.head, skin);
    const hairScale = head.rx / 25;
    const hair = hairLayers(c.hair, hairC);
    const hs = (inner) => `<g transform="translate(100 0) scale(${hairScale.toFixed(3)} 1) translate(-100 0)">${inner}</g>`;

    const mood = opts.mood || 'happy';
    const mouth = mood === 'tired' ? `<path d="M93 88 Q100 85 107 88" stroke="#7a3b2e" stroke-width="2.2" fill="none" stroke-linecap="round"/>`
      : mood === 'neutral' ? `<path d="M93 87 H107" stroke="#7a3b2e" stroke-width="2.2" stroke-linecap="round"/>`
      : `<path d="M91 85 Q100 94 109 85" stroke="#7a3b2e" stroke-width="2.4" fill="none" stroke-linecap="round"/>`;
    const eye = (x) => `<ellipse cx="${x}" cy="68" rx="5.2" ry="3.8" fill="#fff"/><circle cx="${x}" cy="68" r="2.7" fill="${eyeC}"/><circle cx="${x + 0.3}" cy="67.6" r="1.2" fill="#111"/><circle cx="${x + 1.2}" cy="66.8" r=".6" fill="#fff"/>`;
    const lash = f ? `<path d="M84 64.5 l-2 -2 M116 64.5 l2 -2" stroke="#222" stroke-width="1.3" stroke-linecap="round"/>` : '';
    const brows = `<path d="M84 ${f ? 60 : 59.5} Q90 ${f ? 56 : 57} 96 59.5 M104 59.5 Q110 ${f ? 56 : 57} 116 ${f ? 60 : 59.5}" stroke="${hairC}" stroke-width="${f ? 2 : 3}" fill="none" stroke-linecap="round"/>`;
    const beard = f ? '' : c.beard === 'beard'
      ? `<path d="M77 76 Q78 104 100 108 Q122 104 123 76 Q118 92 100 92 Q82 92 77 76Z" fill="${hairC}"/><path d="M92 85 Q100 82 108 85" stroke="${hairC}" stroke-width="4" stroke-linecap="round"/>`
      : c.beard === 'stubble' ? `<path d="M79 78 Q80 102 100 104 Q120 102 121 78 Q116 92 100 92 Q84 92 79 78Z" fill="${hairC}" opacity=".28"/>` : '';
    const glasses = c.glasses ? `<g fill="none" stroke="#222" stroke-width="2"><circle cx="90" cy="68" r="8"/><circle cx="110" cy="68" r="8"/><path d="M98 68 h4 M82 67 l-7 -2 M118 67 l7 -2"/></g>` : '';
    const blush = `<ellipse cx="84" cy="80" rx="5" ry="2.6" fill="#ff7a7a" opacity=".22"/><ellipse cx="116" cy="80" rx="5" ry="2.6" fill="#ff7a7a" opacity=".22"/>`;

    // топ: у женского — укороченный
    const topBottom = f ? 182 : 232;
    const abs = (mv > 0.45 && fat < 0.35 && f) ? `<path d="M100 188 V214 M93 194 h14 M93 204 h14" stroke="${shade}" stroke-width="1.6" stroke-linecap="round"/>` : '';
    const chestLines = (!f && mv > 0.4) ? `<path d="M${100 - cw + 8} 150 Q${100 - cw / 2} 160 98 152 M${100 + cw - 8} 150 Q${100 + cw / 2} 160 102 152" stroke="rgba(0,0,0,.18)" stroke-width="1.6" fill="none"/>` : '';

    // рост: масштаб от стоп
    const s = clamp(0.86 + (c.height - 150) / 50 * 0.18, 0.82, 1.06);

    return `<svg viewBox="0 0 200 400" class="avatar-svg" role="img" aria-label="Персонаж ${c.name || ''}" xmlns="http://www.w3.org/2000/svg">
<defs><clipPath id="${id}t"><path d="${torso}"/></clipPath>
<radialGradient id="${id}g" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="${cloth}" stop-opacity=".45"/><stop offset="1" stop-color="${cloth}" stop-opacity="0"/></radialGradient></defs>
${opts.glow ? `<ellipse cx="100" cy="210" rx="95" ry="190" fill="url(#${id}g)"/>` : ''}
<ellipse cx="100" cy="394" rx="${48 + fat * 14}" ry="8" fill="rgba(0,0,0,.18)"/>
<g transform="translate(100 396) scale(${s.toFixed(3)}) translate(-100 -396)">
${hs(hair.back)}
${leg(-1)}${leg(1)}
<path d="M${100 - hw - 1} 226 L${100 + hw + 1} 226 L${100 + hw + 4} ${f ? 300 : 282} L103 ${f ? 300 : 282} L100 254 L97 ${f ? 300 : 282} L${100 - hw - 4} ${f ? 300 : 282}Z" fill="${f ? '#1f2430' : '#273042'}"/>
<rect x="${100 - neck}" y="92" width="${neck * 2}" height="34" rx="6" fill="${skin}"/>
<path d="${torso}" fill="${skin}"/>
<g clip-path="url(#${id}t)">
  <rect x="40" y="${f ? 128 : 118}" width="120" height="${topBottom - (f ? 128 : 118)}" fill="${cloth}"/>
  ${f ? '' : `<path d="M${100 - sw + 10} 118 Q100 150 ${100 + sw - 10} 118" fill="${skin}"/>`}
  <rect x="40" y="${topBottom - 6}" width="120" height="6" fill="rgba(0,0,0,.15)"/>
  ${chestLines}${abs}
  <path d="M${100 - hw} 226 H${100 + hw} V246 H${100 - hw}Z" fill="${f ? '#1f2430' : '#273042'}"/>
</g>
${arm(-1)}${arm(1)}
${f ? `<path d="M${100 - sw + 6} 128 Q100 ${136} ${100 + sw - 6} 128" stroke="${cloth}" stroke-width="4" fill="none"/>` : ''}
<ellipse cx="${100 - head.rx - 1}" cy="70" rx="5" ry="7" fill="${skin}"/><ellipse cx="${100 + head.rx + 1}" cy="70" rx="5" ry="7" fill="${skin}"/>
${head.el}
${beard}
${eye(90)}${eye(110)}${lash}${brows}
<path d="M100 71 Q97 79 99.5 80" stroke="rgba(0,0,0,.25)" stroke-width="1.8" fill="none" stroke-linecap="round"/>
${blush}${mouth}${glasses}
${hs(hair.front)}
</g></svg>`;
  }

  // «Форма» в процентах — для интерфейса
  function formScore(c, fit) {
    const { fat, muscle } = morph(c, fit);
    return Math.round(clamp((1 - Math.abs(fat - 0.22) * 1.6) * 55 + muscle * 45, 0, 100));
  }

  return { render, morph, formScore, SKIN, HAIR, EYES, OUTFIT, HEADS, HAIRS, BODIES, BEARDS };
})();

/* FitAvatar — анимированная фигура, показывающая технику упражнения (вид сбоку).
   Позы задаются абсолютными углами: для конечностей 0° = вниз, + = вперёд; для корпуса 0° = вверх, + = наклон вперёд. */
window.ExAnim = (() => {
  const L = { torso:46, neck:9, head:10, ua:24, fa:22, th:30, sh:30 };
  const R = d => d * Math.PI / 180;
  const ST = { t:0, ua:[4,-4], fa:[6,-6], th:[0,0], sh:[0,0] };
  const P = (o) => Object.assign({}, ST, o);

  const A = {
    squat:{ lock:'foot', at:[110,150], f:[P({}), P({ t:35, ua:[85,85], fa:[85,85], th:[80,80], sh:[-15,-15] })] },
    pushup:{ lock:'foot', at:[35,150], f:[P({ t:63, ua:[0,0], fa:[0,0], th:[-63,-63], sh:[-63,-63] }), P({ t:78, ua:[-70,-70], fa:[57,57], th:[-78,-78], sh:[-78,-78] })] },
    plank:{ lock:'foot', at:[35,150], f:[P({ t:76, ua:[0,0], fa:[90,90], th:[-76,-76], sh:[-76,-76] }), P({ t:73, ua:[0,0], fa:[90,90], th:[-73,-73], sh:[-73,-73] })], dur:2600 },
    lunge:{ lock:'foot', at:[118,150], f:[P({ ua:[10,10], fa:[-30,-30] }), P({ ua:[10,10], fa:[-30,-30], th:[80,-35], sh:[-5,-70] })] },
    bridge:{ lock:'foot', at:[140,150], f:[P({ t:-90, ua:[90,90], fa:[90,90], th:[135,135], sh:[45,45] }), P({ t:-110, nk:20, ua:[90,90], fa:[90,90], th:[110,110], sh:[30,30] })] },
    crunch:{ lock:'foot', at:[140,150], f:[P({ t:-90, ua:[90,90], fa:[90,90], th:[135,135], sh:[45,45] }), P({ t:-55, ua:[100,100], fa:[100,100], th:[135,135], sh:[45,45] })] },
    bicycle:{ lock:'hip', at:[95,146], f:[P({ t:-62, ua:[200,200], fa:[110,110], th:[130,95], sh:[80,95] }), P({ t:-62, ua:[200,200], fa:[110,110], th:[95,130], sh:[95,80] })], dur:1200 },
    superman:{ lock:'hip', at:[95,146], f:[P({ t:90, ua:[90,90], fa:[90,90], th:[-90,-90], sh:[-90,-90] }), P({ t:78, ua:[106,106], fa:[106,106], th:[-102,-102], sh:[-102,-102] })] },
    calf:{ lock:'foot', at:[100,150], f:[P({}), P({ dy:-7 })], dur:1400 },
    jack:{ lock:'foot', at:[100,150], f:[P({}), P({ ua:[172,172], fa:[180,180], th:[10,-10], sh:[10,-10], dy:-9 })], dur:700 },
    burpee:{ lock:'foot', at:[70,150], f:[
      P({}), P({ t:50, ua:[20,20], fa:[10,10], th:[85,85], sh:[-30,-30] }),
      P({ t:63, ua:[0,0], fa:[0,0], th:[-63,-63], sh:[-63,-63] }),
      P({ t:50, ua:[20,20], fa:[10,10], th:[85,85], sh:[-30,-30] }),
      P({ ua:[175,175], fa:[180,180], dy:-16 })], dur:3400 },
    climber:{ lock:'hand', at:[150,150], f:[P({ t:63, ua:[0,0], fa:[0,0], th:[35,-63], sh:[-60,-63] }), P({ t:63, ua:[0,0], fa:[0,0], th:[-63,35], sh:[-63,-60] })], dur:700 },
    knees:{ lock:'hip', at:[100,88], f:[P({ t:4, ua:[-40,45], fa:[60,110], th:[80,0], sh:[0,0] }), P({ t:4, ua:[45,-40], fa:[110,60], th:[0,80], sh:[0,0] })], dur:700 },
    rope:{ lock:'foot', at:[100,150], f:[P({ ua:[22,22], fa:[70,70] }), P({ ua:[22,22], fa:[70,70], sh:[-10,-10], dy:-10 })], dur:600, prop:'rope' },
    pullup:{ lock:'hand', at:[100,20], f:[P({ ua:[180,180], fa:[180,180], th:[25,25], sh:[-60,-60] }), P({ t:-5, ua:[40,40], fa:[170,170], th:[30,30], sh:[-55,-55] })], prop:'bar' },
    row:{ lock:'foot', at:[90,150], f:[P({ t:70, ua:[0,0], fa:[0,0], th:[20,20], sh:[-5,-5] }), P({ t:70, ua:[-105,-105], fa:[0,0], th:[20,20], sh:[-5,-5] })], prop:'db' },
    press:{ lock:'foot', at:[100,150], f:[P({ ua:[80,80], fa:[170,170] }), P({ ua:[176,176], fa:[180,180] })], prop:'db' },
    curl:{ lock:'foot', at:[100,150], f:[P({ ua:[5,5], fa:[5,5] }), P({ ua:[12,12], fa:[150,150] })], prop:'db' },
    dips:{ lock:'hand', at:[72,104], f:[P({ ua:[-10,-10], fa:[0,0], th:[70,70], sh:[10,10] }), P({ ua:[-80,-80], fa:[25,25], th:[85,85], sh:[40,40] })], prop:'bench' },
    rdl:{ lock:'foot', at:[100,150], f:[P({ ua:[0,0], fa:[0,0] }), P({ t:80, ua:[0,0], fa:[0,0], th:[12,12], sh:[-4,-4] })], prop:'db' },
    bench:{ lock:'hip', at:[80,106], f:[P({ t:90, ua:[180,180], fa:[180,180], th:[-70,-70], sh:[0,0] }), P({ t:90, ua:[10,10], fa:[180,180], th:[-70,-70], sh:[0,0] })], prop:'barbell' },
    fold:{ lock:'foot', at:[100,150], f:[P({ t:8, ua:[0,0], fa:[0,0] }), P({ t:110, ua:[-4,-4], fa:[0,0] })], dur:4000 },
    catcow:{ lock:'hand', at:[140,150], f:[P({ t:66, c:-9, nk:45, ua:[0,0], fa:[0,0], th:[0,0], sh:[-90,-90] }), P({ t:66, c:9, nk:-25, ua:[0,0], fa:[0,0], th:[0,0], sh:[-90,-90] })], dur:3600 },
    child:{ lock:'foot', at:[70,150], f:[P({ t:94, nk:-12, ua:[93,93], fa:[93,93], th:[70,70], sh:[-90,-90] }), P({ t:90, nk:-8, ua:[91,91], fa:[91,91], th:[70,70], sh:[-90,-90] })], dur:4200 },
  };

  const lerp = (a, b, k) => a + (b - a) * k;
  function mix(p, q, k) {
    const o = {};
    for (const key of new Set([...Object.keys(p), ...Object.keys(q)])) {
      const dv = key === 'al' ? 1 : 0; const a = p[key] ?? (Array.isArray(q[key]) ? [0,0] : dv), b = q[key] ?? (Array.isArray(a) ? [0,0] : dv);
      o[key] = Array.isArray(a) ? [lerp(a[0], b[0], k), lerp(a[1], b[1], k)] : lerp(a, b, k);
    }
    return o;
  }
  const vd = (a, l) => ({ x:Math.sin(R(a)) * l, y:Math.cos(R(a)) * l });

  function solve(p, anim) {
    const hip = { x:0, y:0 };
    const sh = { x:Math.sin(R(p.t)) * L.torso, y:-Math.cos(R(p.t)) * L.torso - (p.sp || 0) };
    const na = p.t + (p.nk || 0);
    const head = { x:sh.x + Math.sin(R(na)) * (L.neck + L.head), y:sh.y - Math.cos(R(na)) * (L.neck + L.head) };
    const limb = (o, a1, a2, l1, l2) => { const m = vd(a1, l1); const j = { x:o.x + m.x, y:o.y + m.y }; const n = vd(a2, l2); return [j, { x:j.x + n.x, y:j.y + n.y }]; };
    const al = p.al ?? 1; const arms = [0,1].map(i => limb(sh, p.ua[i], p.fa[i], L.ua * al, L.fa * al));
    const legs = [0,1].map(i => limb(hip, p.th[i], p.sh[i], L.th, L.sh));
    const ref = anim.lock === 'hand' ? arms[0][1] : anim.lock === 'hip' ? hip : legs[0][1];
    const dx = anim.at[0] - ref.x, dy = anim.at[1] - ref.y + (p.dy || 0);
    const T = pt => ({ x:pt.x + dx, y:pt.y + dy });
    return { hip:T(hip), sh:T(sh), head:T(head), arms:arms.map(a => a.map(T)), legs:legs.map(l => l.map(T)), c:p.c || 0, t:p.t, fa:p.fa[0] };
  }

  const f1 = n => n.toFixed(1);
  function draw(s, anim, col) {
    const seg = (a, b, w, c, op = 1) => `<line x1="${f1(a.x)}" y1="${f1(a.y)}" x2="${f1(b.x)}" y2="${f1(b.y)}" stroke="${c}" stroke-width="${w}" stroke-linecap="round" opacity="${op}"/>`;
    const limbs = (i, op) => {
      const [k, f] = s.legs[i], [e, h] = s.arms[i];
      return seg(s.hip, k, 9, col, op) + seg(k, f, 7.5, col, op) + seg(f, { x:f.x + 7, y:f.y }, 5, col, op) + seg(s.sh, e, 7, col, op) + seg(e, h, 6, col, op);
    };
    // корпус с изгибом спины
    const mx = (s.hip.x + s.sh.x) / 2, my = (s.hip.y + s.sh.y) / 2;
    const ang = R(s.t), cx = mx - Math.cos(ang) * s.c * -1, cy = my - Math.sin(ang) * s.c * -1;
    const torso = `<path d="M${f1(s.hip.x)} ${f1(s.hip.y)} Q${f1(cx)} ${f1(cy)} ${f1(s.sh.x)} ${f1(s.sh.y)}" stroke="${col}" stroke-width="13" stroke-linecap="round" fill="none"/>`;
    let prop = '';
    const h = s.arms[0][1];
    if (anim.prop === 'db') prop = `<rect x="${f1(h.x - 9)}" y="${f1(h.y - 3)}" width="18" height="6" rx="2" fill="var(--ink)"/><rect x="${f1(h.x - 11)}" y="${f1(h.y - 6)}" width="5" height="12" rx="1.5" fill="var(--ink)"/><rect x="${f1(h.x + 6)}" y="${f1(h.y - 6)}" width="5" height="12" rx="1.5" fill="var(--ink)"/>`;
    if (anim.prop === 'barbell') prop = `<circle cx="${f1(h.x)}" cy="${f1(h.y)}" r="11" fill="none" stroke="var(--ink)" stroke-width="5"/><circle cx="${f1(h.x)}" cy="${f1(h.y)}" r="2.5" fill="var(--ink)"/>`;
    if (anim.prop === 'bb') prop = `<circle cx="${f1(h.x)}" cy="${f1(h.y)}" r="11" fill="none" stroke="var(--ink)" stroke-width="5"/><circle cx="${f1(h.x)}" cy="${f1(h.y)}" r="2.5" fill="var(--ink)"/>`;
    if (anim.prop === 'hipbar') prop = `<circle cx="${f1(s.hip.x)}" cy="${f1(s.hip.y - 9)}" r="12" fill="none" stroke="var(--ink)" stroke-width="5"/>`;
    if (anim.prop === 'rope') { const g = 150, top = h.y; prop = `<ellipse cx="${f1(s.hip.x + 4)}" cy="${f1((top + g + 8) / 2)}" rx="30" ry="${f1((g + 8 - top) / 2)}" fill="none" stroke="var(--accent)" stroke-width="2" stroke-dasharray="4 3"/>`; }
    const env = anim.prop === 'bar' ? `<path d="M50 20 H150" stroke="var(--ink)" stroke-width="4" stroke-linecap="round"/><path d="M52 20 V150 M148 20 V150" stroke="var(--line)" stroke-width="3"/>`
      : anim.prop === 'bench' ? `<rect x="22" y="104" width="52" height="7" rx="3" fill="var(--ink)"/><path d="M28 111 V150 M68 111 V150" stroke="var(--ink)" stroke-width="4"/>`
      : anim.prop === 'barbell' ? `<rect x="30" y="106" width="110" height="7" rx="3" fill="var(--ink)" opacity=".85"/><path d="M40 113 V150 M130 113 V150" stroke="var(--ink)" stroke-width="4" opacity=".85"/>` : '';
    let dyn = '';
    if (anim.pul) { const hh = s.arms[0][1]; dyn += `<path d="M${anim.pul[0]} ${anim.pul[1]} L${f1(hh.x)} ${f1(hh.y)}" stroke="var(--ink)" stroke-width="2" opacity=".7"/><circle cx="${anim.pul[0]}" cy="${anim.pul[1]}" r="5" fill="var(--ink)" opacity=".85"/>`; }
    if (anim.envf) dyn += anim.envf(s);
    return `<path d="M8 152 H192" stroke="var(--line)" stroke-width="3" stroke-linecap="round"/>${env}${dyn}${limbs(1, .38)}${torso}<circle cx="${f1(s.head.x)}" cy="${f1(s.head.y)}" r="${L.head}" fill="${col}"/>${limbs(0, 1)}${prop}`;
  }

  // Запуск анимации в контейнере; возвращает функцию остановки
  function mount(el, key, color = 'var(--accent)') {
    const anim = A[key] || A.squat;
    const dur = anim.dur || 2000, n = anim.f.length;
    el.innerHTML = `<svg viewBox="0 0 200 160" class="exanim" aria-hidden="true"></svg>`;
    const svg = el.firstChild;
    const reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf, start = performance.now(), alive = true;
    const frame = (now) => {
      if (!alive) return;
      if (!document.body.contains(svg)) { alive = false; return; }
      const span = n === 2 ? dur : dur / n;
      let pos = ((now - start) % (n === 2 ? dur : dur)) / span;
      let i, k;
      if (n === 2) { const ph = ((now - start) % dur) / dur; k = (1 - Math.cos(ph * Math.PI * 2)) / 2; i = 0; }
      else { i = Math.floor(pos) % n; k = (1 - Math.cos((pos % 1) * Math.PI)) / 2; }
      const p = mix(anim.f[i], anim.f[(i + 1) % n], reduce ? 0 : k);
      svg.innerHTML = draw(solve(p, anim), anim, color);
      if (!reduce) raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => { alive = false; cancelAnimationFrame(raf); };
  }

  // статичный кадр (для превью и проверки поз)
  function still(key, i = 0, color = 'var(--accent)') { const a = A[key]; return `<svg viewBox="0 0 200 160" class="exanim">${draw(solve(a.f[i % a.f.length], a), a, color)}</svg>`; }

  return { mount, still, keys:Object.keys(A), add:(k, d) => { A[k] = d; }, P, A };
})();

/* FitAvatar — слой платформы: Telegram Mini App, нативное приложение (Capacitor), браузер.
   Одно и то же приложение работает везде; возможности включаются по месту запуска. */
window.Platform = (() => {
  const TG = window.Telegram && window.Telegram.WebApp;
  const inTG = !!(TG && TG.initData);
  const Cap = window.Capacitor;
  const isNative = !!(Cap && Cap.isNativePlatform && Cap.isNativePlatform());
  const os = isNative ? Cap.getPlatform() : (inTG ? TG.platform : 'web');
  const plugin = (name) => isNative ? ((Cap.Plugins && Cap.Plugins[name]) || (Cap.registerPlugin && Cap.registerPlugin(name))) : null;

  /* ---------- Telegram ---------- */
  function initTelegram(onBack) {
    if (!inTG) return;
    try {
      TG.ready(); TG.expand();
      if (TG.isVersionAtLeast && TG.isVersionAtLeast('7.7')) TG.disableVerticalSwipes();
      TG.setHeaderColor && TG.setHeaderColor('bg_color');
      document.documentElement.dataset.theme = TG.colorScheme === 'dark' ? 'dark' : 'light';
      TG.onEvent('themeChanged', () => { document.documentElement.dataset.theme = TG.colorScheme === 'dark' ? 'dark' : 'light'; });
      TG.BackButton.onClick(() => onBack && onBack());
    } catch (e) { console.warn(e); }
  }
  const tgUser = () => (inTG && TG.initDataUnsafe && TG.initDataUnsafe.user) || null;
  const backButton = (show) => { if (inTG) { try { show ? TG.BackButton.show() : TG.BackButton.hide(); } catch (e) {} } };

  /* ---------- Вибрация ---------- */
  function haptic(kind = 'light') {
    try {
      if (inTG && TG.HapticFeedback) {
        if (kind === 'success' || kind === 'error' || kind === 'warning') TG.HapticFeedback.notificationOccurred(kind);
        else TG.HapticFeedback.impactOccurred(kind);
      } else if (isNative && plugin('Haptics')) {
        plugin('Haptics').impact({ style: kind === 'heavy' ? 'HEAVY' : kind === 'medium' ? 'MEDIUM' : 'LIGHT' });
      } else if (navigator.vibrate) navigator.vibrate(kind === 'success' ? [20, 40, 20] : 12);
    } catch (e) {}
  }

  /* ---------- Хранилище: локально + облако Telegram ---------- */
  const KEY = 'fitavatar.v1';
  const local = {
    get() { try { return JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) { return null; } },
    set(v) { try { localStorage.setItem(KEY, JSON.stringify(v)); } catch (e) {} },
    clear() { try { localStorage.removeItem(KEY); } catch (e) {} },
  };
  // CloudStorage Telegram: до 4096 символов на ключ — режем на части
  const cloudOK = inTG && TG.CloudStorage && TG.isVersionAtLeast && TG.isVersionAtLeast('6.9');
  const cs = (m, ...a) => new Promise((res) => { try { TG.CloudStorage[m](...a, (err, v) => res(err ? null : v)); } catch (e) { res(null); } });
  const cloud = {
    async get() {
      if (!cloudOK) return null;
      const n = parseInt(await cs('getItem', 'fa_n'), 10);
      if (!n) return null;
      const keys = Array.from({ length: n }, (_, i) => 'fa_' + i);
      const vals = await cs('getItems', keys);
      if (!vals) return null;
      try { return JSON.parse(keys.map(k => vals[k] || '').join('')); } catch (e) { return null; }
    },
    async set(v) {
      if (!cloudOK) return;
      const s = JSON.stringify(v), parts = [];
      for (let i = 0; i < s.length; i += 4000) parts.push(s.slice(i, i + 4000));
      await Promise.all(parts.map((p, i) => cs('setItem', 'fa_' + i, p)));
      await cs('setItem', 'fa_n', String(parts.length));
    },
  };
  let saveTimer;
  const store = {
    load: () => local.get(),
    loadCloud: () => cloud.get(),
    save(v) { local.set(v); clearTimeout(saveTimer); saveTimer = setTimeout(() => cloud.set(v), 1500); },
    clear: () => { local.clear(); if (cloudOK) cs('setItem', 'fa_n', '0'); },
  };

  /* ---------- Активность телефона ---------- */
  // 1) Нативно: Apple Health / Health Connect через @capgo/capacitor-health
  // 2) Telegram / браузер: шагомер по акселерометру, пока приложение открыто
  const Health = {
    get nativeAvailable() { return !!plugin('Health'); },
    label: isNative ? (os === 'ios' ? 'Apple Health' : 'Health Connect') : 'Шагомер телефона',
    async connect() {
      const H = plugin('Health');
      if (!H) return { ok: false, reason: 'native-only' };
      try {
        const av = await H.isAvailable();
        if (av && av.available === false) return { ok: false, reason: av.reason || 'unavailable' };
        await H.requestAuthorization({ read: ['steps', 'distance', 'calories', 'weight', 'heartRate'], write: [] });
        return { ok: true };
      } catch (e) { return { ok: false, reason: String(e.message || e) }; }
    },
    async sum(dataType) {
      const H = plugin('Health');
      if (!H) return null;
      const start = new Date(); start.setHours(0, 0, 0, 0);
      try {
        const r = await H.readSamples({ dataType, startDate: start.toISOString(), endDate: new Date().toISOString(), limit: 1000 });
        return (r.samples || []).reduce((s, x) => s + (Number(x.value) || 0), 0);
      } catch (e) { return null; }
    },
    async today() {
      const [steps, calories, distance] = await Promise.all([this.sum('steps'), this.sum('calories'), this.sum('distance')]);
      return { steps: steps == null ? null : Math.round(steps), calories: calories && Math.round(calories), distance };
    },
    async latestWeight() {
      const H = plugin('Health');
      if (!H) return null;
      try {
        const r = await H.readSamples({ dataType: 'weight', startDate: new Date(Date.now() - 30 * 864e5).toISOString(), endDate: new Date().toISOString(), limit: 50 });
        const s = (r.samples || []).slice(-1)[0];
        return s ? Math.round(Number(s.value) * 10) / 10 : null;
      } catch (e) { return null; }
    },
  };

  // Шагомер: пики ускорения
  const Pedometer = {
    running: false, count: 0, _off: null,
    async start(onStep) {
      if (this.running) return true;
      let avg = 9.8, last = 0, above = false;
      const feed = (x, y, z, scale = 1) => {
        const m = Math.sqrt(x * x + y * y + z * z) * scale;
        avg = avg * 0.95 + m * 0.05;
        const now = performance.now();
        if (!above && m > avg + 1.3 && now - last > 280) { above = true; last = now; this.count++; onStep && onStep(); }
        else if (above && m < avg) above = false;
      };
      if (inTG && TG.isVersionAtLeast && TG.isVersionAtLeast('8.0') && TG.Accelerometer) {
        const h = () => feed(TG.Accelerometer.x, TG.Accelerometer.y, TG.Accelerometer.z);
        TG.onEvent('accelerometerChanged', h);
        TG.Accelerometer.start({ refresh_rate: 60 });
        this._off = () => { TG.offEvent('accelerometerChanged', h); TG.Accelerometer.stop(); };
      } else if ('DeviceMotionEvent' in window) {
        if (typeof DeviceMotionEvent.requestPermission === 'function') {
          try { if (await DeviceMotionEvent.requestPermission() !== 'granted') return false; } catch (e) { return false; }
        }
        const h = (ev) => { const a = ev.accelerationIncludingGravity; if (a && a.x != null) feed(a.x, a.y, a.z); };
        window.addEventListener('devicemotion', h);
        this._off = () => window.removeEventListener('devicemotion', h);
      } else return false;
      this.running = true;
      return true;
    },
    stop() { this._off && this._off(); this._off = null; this.running = false; },
  };

  /* ---------- Напоминания ---------- */
  const Reminders = {
    available: isNative && !!plugin('LocalNotifications'),
    async schedule(hour, minute) {
      const N = plugin('LocalNotifications');
      if (!N) return false;
      try {
        const p = await N.requestPermissions();
        if (p.display !== 'granted') return false;
        await N.cancel({ notifications: [{ id: 1 }] });
        await N.schedule({ notifications: [{ id: 1, title: 'FitAvatar', body: 'Ваш персонаж ждёт тренировку! Отметьте выполненное за сегодня.', schedule: { on: { hour, minute }, repeats: true } }] });
        return true;
      } catch (e) { return false; }
    },
    async cancel() { const N = plugin('LocalNotifications'); if (N) try { await N.cancel({ notifications: [{ id: 1 }] }); } catch (e) {} },
  };

  function openLink(url) {
    if (inTG) { try { TG.openLink(url); return; } catch (e) {} }
    const a = document.createElement('a'); a.href = url; a.target = '_blank'; a.rel = 'noopener'; document.body.appendChild(a); a.click(); a.remove();
  }

  return { TG, inTG, isNative, os, initTelegram, tgUser, backButton, haptic, store, Health, Pedometer, Reminders, openLink };
})();
