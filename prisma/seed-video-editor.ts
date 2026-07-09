import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const SLUG = "video-editor";

  console.log("Seeding Video Editor survey...");

  const existing = await prisma.survey.findUnique({ where: { slug: SLUG } });
  if (existing) {
    console.log("Video Editor survey already exists — skipping creation.");
    return;
  }

  const survey = await prisma.survey.create({
    data: {
      slug: SLUG,
      title: "Видеомонтажёр (YouTube, соцсети) — Global Generation",
      description:
        "Ищем видеомонтажёра для двух YouTube-каналов о поступлении за рубеж. Динамичный монтаж, субтитры, графика, цвет и звук. Фултайм, удалённо, оплата 100 000 ₽ на руки, оформление ГПХ / самозанятый.",
      status: "ACTIVE",
      heroTitle:
        "Мы ищем монтажёра, который превращает сырые исходники в ролики, которые досматривают до конца",
      ndaText:
        "Вся информация, которую вы предоставляете в этой анкете, используется исключительно для оценки вашей кандидатуры на позицию Видеомонтажёра в команде Global Generation.\n\nВаши ответы не передаются третьим лицам и не используются в иных целях. Доступ к анкете имеют только сотрудники HR-отдела GG, участвующие в отборе.\n\nФакт подачи заявки остаётся конфиденциальным. Мы не уведомляем ваших текущих работодателей или заказчиков.",
      successMessage:
        "Спасибо за заявку!\n\nМы внимательно изучим ваши ответы и портфолио и свяжемся с вами в Telegram в течение 2–3 рабочих дней.\n\nЕсли вы нам подходите — пригласим на оплачиваемое тестовое задание.",
      maxScore: 100,
      dedupFieldKey: "telegram",
      scoreTiers: [
        { label: "Отличный кандидат", min: 75 },
        { label: "Хороший кандидат", min: 50 },
        { label: "Средний кандидат", min: 25 },
        { label: "Слабый кандидат", min: 0 },
      ],

      pages: {
        create: [
          // ─── Page 1: О себе ───
          {
            title: "О себе",
            sortOrder: 0,
            questions: {
              create: [
                {
                  fieldKey: "name",
                  label: "Имя и фамилия",
                  type: "TEXT",
                  required: true,
                  sortOrder: 0,
                  maxPoints: 0,
                },
                {
                  fieldKey: "telegram",
                  label: "Telegram",
                  description: "Мы свяжемся именно через Telegram",
                  type: "TEXT",
                  required: true,
                  sortOrder: 1,
                  config: { prefix: "@" },
                  maxPoints: 0,
                },
                {
                  fieldKey: "age",
                  label: "Возраст",
                  type: "NUMBER",
                  required: true,
                  sortOrder: 2,
                  config: { min: 16, max: 60 },
                  maxPoints: 0,
                },
                {
                  fieldKey: "city",
                  label: "Город и страна",
                  type: "TEXT",
                  required: true,
                  sortOrder: 3,
                  maxPoints: 0,
                },
                {
                  fieldKey: "aboutMe",
                  label:
                    "Расскажите коротко о себе: чем занимаетесь сейчас и что привлекло вас в этой вакансии?",
                  description:
                    "Пары абзацев достаточно — нам важно понять, кто вы и почему хотите монтировать именно про образование за рубежом",
                  type: "TEXTAREA",
                  required: true,
                  sortOrder: 4,
                  maxPoints: 0,
                },
              ],
            },
          },

          // ─── Page 2: Опыт и портфолио ───
          {
            title: "Опыт и портфолио",
            sortOrder: 1,
            questions: {
              create: [
                {
                  fieldKey: "editingExperience",
                  label:
                    "Расскажите о вашем опыте в видеомонтаже: для каких проектов и форматов монтировали, какие были результаты?",
                  description: "Если опыт небольшой — тоже напишите честно",
                  type: "TEXTAREA",
                  required: true,
                  sortOrder: 0,
                  scoringCategory: "experience",
                  maxPoints: 12,
                  scoringRules: {
                    type: "textLength",
                    tiers: [
                      { min: 300, points: 12 },
                      { min: 180, points: 9 },
                      { min: 90, points: 6 },
                      { min: 30, points: 3 },
                    ],
                  },
                },
                {
                  fieldKey: "yearsExperience",
                  label: "Сколько лет вы занимаетесь видеомонтажом?",
                  type: "RADIO",
                  required: true,
                  sortOrder: 1,
                  scoringCategory: "seniority",
                  maxPoints: 10,
                  config: { layout: "grid" },
                  options: {
                    create: [
                      { value: "lt1", label: "Меньше 1 года", sortOrder: 0, points: 3 },
                      { value: "1_3", label: "1–3 года", sortOrder: 1, points: 10 },
                      { value: "3_5", label: "3–5 лет", sortOrder: 2, points: 10 },
                      { value: "5plus", label: "Больше 5 лет", sortOrder: 3, points: 8 },
                    ],
                  },
                },
                {
                  fieldKey: "portfolio",
                  label: "Ссылки на портфолио и примеры работ",
                  description:
                    "Обязательно. Покажите 3–5 работ, желательно горизонтальные ролики для YouTube или соцсетей. Ссылки на Google Drive / YouTube / Vimeo — с открытым доступом",
                  type: "TEXTAREA",
                  required: true,
                  sortOrder: 2,
                  maxPoints: 0,
                },
                {
                  fieldKey: "youtubeExp",
                  label: "Есть ли у вас опыт монтажа роликов именно для YouTube?",
                  type: "RADIO",
                  required: true,
                  sortOrder: 3,
                  scoringCategory: "youtube",
                  maxPoints: 10,
                  options: {
                    create: [
                      { value: "regular", label: "Да, регулярно монтирую для YouTube", sortOrder: 0, points: 10 },
                      { value: "sometimes", label: "Да, иногда", sortOrder: 1, points: 6 },
                      { value: "no", label: "Нет, для YouTube не монтировал", sortOrder: 2, points: 2 },
                    ],
                  },
                },
                {
                  fieldKey: "youtubeDetails",
                  label:
                    "Расскажите подробнее: для каких каналов или в какой тематике монтировали, какой был формат роликов?",
                  description: "Можно указать ссылки на каналы",
                  type: "TEXTAREA",
                  required: true,
                  sortOrder: 4,
                  showIf: { fieldKey: "youtubeExp", value: "regular" },
                  maxPoints: 0,
                },
                {
                  fieldKey: "contentTypes",
                  label: "С каким контентом вы уже работали?",
                  description: "Выберите все подходящие",
                  type: "CHECKBOX",
                  required: true,
                  sortOrder: 5,
                  scoringCategory: "breadth",
                  maxPoints: 3,
                  scoringRules: {
                    type: "count",
                    tiers: [
                      { min: 4, points: 3 },
                      { min: 2, points: 2 },
                      { min: 1, points: 1 },
                    ],
                  },
                  options: {
                    create: [
                      { value: "interviews", label: "Интервью и подкасты", sortOrder: 0, points: 0 },
                      { value: "vlogs", label: "Влоги и тревел", sortOrder: 1, points: 0 },
                      { value: "educational", label: "Обучающий / экспертный контент", sortOrder: 2, points: 0 },
                      { value: "shorts", label: "Короткие ролики (Shorts / Reels)", sortOrder: 3, points: 0 },
                      { value: "ads", label: "Рекламные и промо-ролики", sortOrder: 4, points: 0 },
                      { value: "other", label: "Другое", sortOrder: 5, points: 0 },
                    ],
                  },
                },
              ],
            },
          },

          // ─── Page 3: Технические навыки ───
          {
            title: "Технические навыки",
            sortOrder: 2,
            questions: {
              create: [
                {
                  fieldKey: "software",
                  label: "В каких программах вы монтируете?",
                  description: "Выберите все, которыми уверенно владеете",
                  type: "CHECKBOX",
                  required: true,
                  sortOrder: 0,
                  scoringCategory: "software",
                  maxPoints: 8,
                  scoringRules: {
                    type: "count",
                    tiers: [
                      { min: 3, points: 8 },
                      { min: 2, points: 6 },
                      { min: 1, points: 3 },
                    ],
                  },
                  options: {
                    create: [
                      { value: "premiere", label: "Adobe Premiere Pro", sortOrder: 0, points: 0 },
                      { value: "davinci", label: "DaVinci Resolve", sortOrder: 1, points: 0 },
                      { value: "aftereffects", label: "After Effects", sortOrder: 2, points: 0 },
                      { value: "finalcut", label: "Final Cut Pro", sortOrder: 3, points: 0 },
                      { value: "other_soft", label: "Другое", sortOrder: 4, points: 0 },
                    ],
                  },
                },
                {
                  fieldKey: "aeLevel",
                  label: "Насколько уверенно вы владеете After Effects и графикой/анимацией?",
                  type: "RADIO",
                  required: true,
                  sortOrder: 1,
                  scoringCategory: "motion",
                  maxPoints: 8,
                  options: {
                    create: [
                      { value: "advanced", label: "Свободно — создаю графику и анимацию с нуля", sortOrder: 0, points: 8 },
                      { value: "basic", label: "Базово — титры, простые эффекты, шаблоны", sortOrder: 1, points: 4 },
                      { value: "none", label: "Почти не работал в After Effects", sortOrder: 2, points: 1 },
                    ],
                  },
                },
                {
                  fieldKey: "colorSound",
                  label: "Насколько уверенно вы работаете с цветокоррекцией и звуком?",
                  type: "RADIO",
                  required: true,
                  sortOrder: 2,
                  scoringCategory: "colorSound",
                  maxPoints: 8,
                  options: {
                    create: [
                      { value: "both", label: "Уверенно и с цветом, и со звуком", sortOrder: 0, points: 8 },
                      { value: "one", label: "Уверенно с чем-то одним", sortOrder: 1, points: 4 },
                      { value: "basic", label: "На базовом уровне", sortOrder: 2, points: 2 },
                    ],
                  },
                },
                {
                  fieldKey: "taskSkills",
                  label: "Какие задачи монтажа вы уверенно закрываете сами?",
                  description: "Выберите все подходящие",
                  type: "CHECKBOX",
                  required: true,
                  sortOrder: 3,
                  scoringCategory: "taskSkills",
                  maxPoints: 6,
                  scoringRules: {
                    type: "count",
                    tiers: [
                      { min: 5, points: 6 },
                      { min: 3, points: 4 },
                      { min: 1, points: 2 },
                    ],
                  },
                  options: {
                    create: [
                      { value: "dynamic", label: "Динамичный монтаж под удержание", sortOrder: 0, points: 0 },
                      { value: "subtitles", label: "Субтитры", sortOrder: 1, points: 0 },
                      { value: "graphics", label: "Графика и титры", sortOrder: 2, points: 0 },
                      { value: "color", label: "Цветокоррекция", sortOrder: 3, points: 0 },
                      { value: "sound", label: "Работа со звуком", sortOrder: 4, points: 0 },
                      { value: "footage", label: "Работа с исходниками и отбор материала", sortOrder: 5, points: 0 },
                    ],
                  },
                },
                {
                  fieldKey: "englishLevel",
                  label: "Уровень английского языка",
                  description:
                    "Нужно понимать англоязычные исходники и интервью и работать с англоязычными субтитрами",
                  type: "RADIO",
                  required: true,
                  sortOrder: 4,
                  scoringCategory: "english",
                  maxPoints: 5,
                  options: {
                    create: [
                      { value: "A1", label: "A1 — начальный", sortOrder: 0, points: 0 },
                      { value: "A2", label: "A2 — базовый", sortOrder: 1, points: 1 },
                      { value: "B1", label: "B1 — средний", sortOrder: 2, points: 3 },
                      { value: "B2", label: "B2 — выше среднего", sortOrder: 3, points: 5 },
                      { value: "C1C2", label: "C1 / C2 — свободно", sortOrder: 4, points: 5 },
                    ],
                  },
                },
              ],
            },
          },

          // ─── Page 4: Рабочие ситуации ───
          {
            title: "Рабочие ситуации",
            sortOrder: 3,
            questions: {
              create: [
                {
                  fieldKey: "workflow",
                  label:
                    "Опишите ваш рабочий процесс над роликом — от получения исходников до финальной сдачи.",
                  description: "Нам важно понять, насколько системно вы работаете",
                  type: "TEXTAREA",
                  required: true,
                  sortOrder: 0,
                  scoringCategory: "workflow",
                  maxPoints: 10,
                  scoringRules: {
                    type: "textLength",
                    tiers: [
                      { min: 250, points: 10 },
                      { min: 150, points: 7 },
                      { min: 70, points: 4 },
                      { min: 25, points: 2 },
                    ],
                  },
                },
                {
                  fieldKey: "tightDeadline",
                  label:
                    "Ролик нужен к завтрашнему утру, но исходники пришли только вечером — и часть материала бракованная (плохой звук, тряска, пересветы). Ваши действия?",
                  description: "Опишите, как реально поступите в такой ситуации",
                  type: "TEXTAREA",
                  required: true,
                  sortOrder: 1,
                  scoringCategory: "deadline",
                  maxPoints: 6,
                  scoringRules: {
                    type: "textLength",
                    tiers: [
                      { min: 200, points: 6 },
                      { min: 100, points: 4 },
                      { min: 40, points: 2 },
                    ],
                  },
                },
                {
                  fieldKey: "revisions",
                  label:
                    "Заказчик присылает правки в третий раз и просит переделать то, что вы уже согласовали раньше. Как поступите?",
                  type: "TEXTAREA",
                  required: true,
                  sortOrder: 2,
                  maxPoints: 0,
                },
                {
                  fieldKey: "selfCheck",
                  label:
                    "Как вы проверяете готовый ролик перед сдачей? На что смотрите в первую очередь?",
                  description: "Здесь мы оцениваем внимание к деталям",
                  type: "TEXTAREA",
                  required: true,
                  sortOrder: 3,
                  scoringCategory: "attention",
                  maxPoints: 4,
                  scoringRules: {
                    type: "textLength",
                    tiers: [
                      { min: 150, points: 4 },
                      { min: 70, points: 3 },
                      { min: 25, points: 1 },
                    ],
                  },
                },
              ],
            },
          },

          // ─── Page 5: Условия и мотивация ───
          {
            title: "Условия и мотивация",
            sortOrder: 4,
            questions: {
              create: [
                {
                  fieldKey: "availability",
                  label:
                    "Вакансия фултайм, удалённо. Готовы ли вы выделять полный рабочий день на монтаж и быть на связи в рабочие часы?",
                  type: "RADIO",
                  required: true,
                  sortOrder: 0,
                  maxPoints: 0,
                  options: {
                    create: [
                      { value: "yes", label: "Да, готов работать фултайм", sortOrder: 0, points: 0 },
                      { value: "partly", label: "Готов, но есть ограничения по времени", sortOrder: 1, points: 0 },
                      { value: "no", label: "Нет, могу только парт-тайм / проектно", sortOrder: 2, points: 0 },
                    ],
                  },
                },
                {
                  fieldKey: "computerSpec",
                  label:
                    "Опишите ваш компьютер: процессор, оперативная память, видеокарта. Потянет ли он монтаж в 4K?",
                  description:
                    "Работа на своём оборудовании — нам важно понимать, что техника справится",
                  type: "TEXTAREA",
                  required: true,
                  sortOrder: 1,
                  maxPoints: 0,
                },
                {
                  fieldKey: "internet",
                  label:
                    "Есть ли у вас стабильный интернет и возможность быстро передавать тяжёлые файлы? Если вы в России — есть ли VPN?",
                  type: "RADIO",
                  required: true,
                  sortOrder: 2,
                  maxPoints: 0,
                  options: {
                    create: [
                      { value: "all_good", label: "Да, всё есть — интернет быстрый, VPN тоже", sortOrder: 0, points: 0 },
                      { value: "no_vpn_needed", label: "Интернет быстрый, VPN не нужен (не в России)", sortOrder: 1, points: 0 },
                      { value: "no_vpn", label: "Интернет есть, VPN нет (нахожусь в России)", sortOrder: 2, points: 0 },
                      { value: "unstable", label: "Интернет нестабильный", sortOrder: 3, points: 0 },
                    ],
                  },
                },
                {
                  fieldKey: "motivation",
                  label: "Что для вас главная мотивация в работе?",
                  description: "Нас интересует честный ответ, а не «правильный»",
                  type: "TEXTAREA",
                  required: true,
                  sortOrder: 3,
                  scoringCategory: "motivation",
                  maxPoints: 10,
                  scoringRules: {
                    type: "textLength",
                    tiers: [
                      { min: 200, points: 10 },
                      { min: 100, points: 7 },
                      { min: 50, points: 4 },
                      { min: 20, points: 2 },
                    ],
                  },
                },
                {
                  fieldKey: "referralSource",
                  label: "Откуда вы узнали о вакансии?",
                  type: "RADIO",
                  required: false,
                  sortOrder: 4,
                  config: { layout: "grid" },
                  maxPoints: 0,
                  options: {
                    create: [
                      { value: "instagram", label: "Instagram", sortOrder: 0, points: 0 },
                      { value: "tiktok", label: "TikTok", sortOrder: 1, points: 0 },
                      { value: "telegram", label: "Telegram", sortOrder: 2, points: 0 },
                      { value: "youtube", label: "YouTube", sortOrder: 3, points: 0 },
                      { value: "friend", label: "От знакомых", sortOrder: 4, points: 0 },
                      { value: "hh", label: "HeadHunter", sortOrder: 5, points: 0 },
                      { value: "other", label: "Другое", sortOrder: 6, points: 0 },
                    ],
                  },
                },
                {
                  fieldKey: "consentData",
                  label: "Я согласен(на) на обработку персональных данных",
                  description:
                    "Данные используются только для рассмотрения заявки и связи с кандидатом",
                  type: "CONSENT",
                  required: true,
                  sortOrder: 5,
                  maxPoints: 0,
                },
              ],
            },
          },
        ],
      },
    },
  });

  console.log(`Created Video Editor survey: ${survey.id} (slug: ${SLUG})`);
  console.log(`URL: /s/${SLUG}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
