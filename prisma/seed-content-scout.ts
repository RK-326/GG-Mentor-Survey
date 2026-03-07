import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const SLUG = "content-scout";

  console.log("Seeding Content Scout survey...");

  const existing = await prisma.survey.findUnique({ where: { slug: SLUG } });
  if (existing) {
    console.log("Content Scout survey already exists — skipping creation.");
    return;
  }

  const survey = await prisma.survey.create({
    data: {
      slug: SLUG,
      title: "Контент-скаут — Заявка в команду",
      description:
        "Мы ищем молодых и амбициозных людей в продюсерскую команду Global Generation. Покажи свою насмотренность, понимание алгоритмов и умение видеть тренды — и присоединяйся к медиа-команде, которая строит главное медиа для амбициозной молодёжи.",
      status: "ACTIVE",
      heroTitle:
        "Мы ищем того, кто видит тренды раньше всех",
      ndaText: null,
      successMessage:
        "Спасибо за заявку!\n\nМы внимательно изучим твои ответы и свяжемся с тобой в Telegram в течение нескольких дней.\n\nЕсли ты подходишь — пригласим на тестовое задание и финальный созвон с Алисой.",
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
                  description: "Твой юзернейм — по нему мы свяжемся",
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
                  config: { min: 16, max: 30 },
                  maxPoints: 0,
                },
                {
                  fieldKey: "city",
                  label: "Город",
                  type: "TEXT",
                  required: true,
                  sortOrder: 3,
                  maxPoints: 0,
                },
                {
                  fieldKey: "occupation",
                  label: "Чем занимаешься сейчас?",
                  type: "RADIO",
                  required: true,
                  sortOrder: 4,
                  config: { layout: "grid" },
                  maxPoints: 0,
                  options: {
                    create: [
                      { value: "school", label: "Учусь в школе", sortOrder: 0, points: 0 },
                      { value: "university", label: "Учусь в вузе", sortOrder: 1, points: 0 },
                      { value: "gap_year", label: "Gap Year", sortOrder: 2, points: 0 },
                      { value: "working", label: "Работаю", sortOrder: 3, points: 0 },
                      { value: "freelance", label: "Фриланс / свои проекты", sortOrder: 4, points: 0 },
                    ],
                  },
                },
              ],
            },
          },

          // ─── Page 2: Насмотренность ───
          {
            title: "Насмотренность и аналитика",
            sortOrder: 1,
            questions: {
              create: [
                {
                  fieldKey: "strongAccounts",
                  label: "Назови 2–3 аккаунта в Instagram или TikTok, которые считаешь сильными. Почему именно они?",
                  description:
                    "Нам важно понять твою насмотренность: какие форматы ты замечаешь, что цепляет, почему аккаунт работает",
                  type: "TEXTAREA",
                  required: true,
                  sortOrder: 0,
                  scoringCategory: "awareness",
                  maxPoints: 15,
                  scoringRules: {
                    type: "textLength",
                    tiers: [
                      { min: 300, points: 15 },
                      { min: 200, points: 12 },
                      { min: 100, points: 8 },
                      { min: 40, points: 4 },
                    ],
                  },
                },
                {
                  fieldKey: "viralAnalysis",
                  label: "Вспомни любой вирусный Reels или TikTok. Разбери: почему он залетел?",
                  description:
                    "Структура, хук, удержание, подача — объясни механику успеха ролика",
                  type: "TEXTAREA",
                  required: true,
                  sortOrder: 1,
                  scoringCategory: "analysis",
                  maxPoints: 15,
                  scoringRules: {
                    type: "textLength",
                    tiers: [
                      { min: 250, points: 15 },
                      { min: 150, points: 12 },
                      { min: 80, points: 7 },
                      { min: 30, points: 3 },
                    ],
                  },
                },
              ],
            },
          },

          // ─── Page 3: Hard Skills ───
          {
            title: "Hard Skills",
            sortOrder: 2,
            questions: {
              create: [
                {
                  fieldKey: "knownMetrics",
                  label: "Какие метрики ты знаешь и понимаешь?",
                  description: "Выбери все, которые можешь объяснить",
                  type: "CHECKBOX",
                  required: true,
                  sortOrder: 0,
                  scoringCategory: "metrics",
                  maxPoints: 10,
                  scoringRules: {
                    type: "count",
                    tiers: [
                      { min: 6, points: 10 },
                      { min: 4, points: 7 },
                      { min: 2, points: 4 },
                      { min: 1, points: 2 },
                    ],
                  },
                  options: {
                    create: [
                      { value: "retention", label: "Удержание (Retention)", sortOrder: 0, points: 0 },
                      { value: "er", label: "ER (Engagement Rate)", sortOrder: 1, points: 0 },
                      { value: "reach", label: "Охваты", sortOrder: 2, points: 0 },
                      { value: "ctr", label: "CTR", sortOrder: 3, points: 0 },
                      { value: "avg_watch", label: "Среднее время просмотра", sortOrder: 4, points: 0 },
                      { value: "saves", label: "Сохранения", sortOrder: 5, points: 0 },
                      { value: "shares", label: "Репосты / Shares", sortOrder: 6, points: 0 },
                      { value: "conversion", label: "Конверсия", sortOrder: 7, points: 0 },
                    ],
                  },
                },
                {
                  fieldKey: "hookExplanation",
                  label: "Что такое хук в видео и зачем он нужен? Объясни своими словами",
                  type: "TEXTAREA",
                  required: true,
                  sortOrder: 1,
                  scoringCategory: "scriptLogic",
                  maxPoints: 10,
                  scoringRules: {
                    type: "textLength",
                    tiers: [
                      { min: 150, points: 10 },
                      { min: 80, points: 7 },
                      { min: 40, points: 4 },
                      { min: 15, points: 2 },
                    ],
                  },
                },
                {
                  fieldKey: "contentTools",
                  label: "Какие инструменты ты используешь для работы с контентом?",
                  type: "CHECKBOX",
                  required: true,
                  sortOrder: 2,
                  scoringCategory: "tools",
                  maxPoints: 5,
                  scoringRules: {
                    type: "count",
                    tiers: [
                      { min: 5, points: 5 },
                      { min: 3, points: 4 },
                      { min: 2, points: 3 },
                      { min: 1, points: 1 },
                    ],
                  },
                  options: {
                    create: [
                      { value: "capcut", label: "CapCut", sortOrder: 0, points: 0 },
                      { value: "canva", label: "Canva", sortOrder: 1, points: 0 },
                      { value: "figma", label: "Figma", sortOrder: 2, points: 0 },
                      { value: "adobe", label: "Adobe (Premiere, Photoshop и т.д.)", sortOrder: 3, points: 0 },
                      { value: "notion", label: "Notion / Trello / Miro", sortOrder: 4, points: 0 },
                      { value: "google_sheets", label: "Google Sheets / Excel", sortOrder: 5, points: 0 },
                      { value: "other_tools", label: "Другое", sortOrder: 6, points: 0 },
                    ],
                  },
                },
                {
                  fieldKey: "aiTools",
                  label: "Используешь ли ты AI-инструменты? Какие?",
                  type: "CHECKBOX",
                  required: false,
                  sortOrder: 3,
                  scoringCategory: "ai",
                  maxPoints: 5,
                  scoringRules: {
                    type: "count",
                    tiers: [
                      { min: 4, points: 5 },
                      { min: 2, points: 4 },
                      { min: 1, points: 2 },
                    ],
                  },
                  options: {
                    create: [
                      { value: "chatgpt", label: "ChatGPT", sortOrder: 0, points: 0 },
                      { value: "claude", label: "Claude", sortOrder: 1, points: 0 },
                      { value: "midjourney", label: "Midjourney / DALL-E", sortOrder: 2, points: 0 },
                      { value: "heygen", label: "HeyGen / D-ID", sortOrder: 3, points: 0 },
                      { value: "runway", label: "Runway / Pika", sortOrder: 4, points: 0 },
                      { value: "other_ai", label: "Другое", sortOrder: 5, points: 0 },
                    ],
                  },
                },
                {
                  fieldKey: "englishLevel",
                  label: "Уровень английского",
                  description: "Нужен для анализа зарубежного контента",
                  type: "RADIO",
                  required: true,
                  sortOrder: 4,
                  scoringCategory: "english",
                  maxPoints: 5,
                  options: {
                    create: [
                      { value: "beginner", label: "Начальный", sortOrder: 0, points: 1 },
                      { value: "elementary", label: "Elementary", sortOrder: 1, points: 2 },
                      { value: "intermediate", label: "Intermediate", sortOrder: 2, points: 3 },
                      { value: "upper", label: "Upper-Intermediate", sortOrder: 3, points: 4 },
                      { value: "advanced", label: "Advanced+", sortOrder: 4, points: 5 },
                    ],
                  },
                },
              ],
            },
          },

          // ─── Page 4: Опыт и портфолио ───
          {
            title: "Опыт и портфолио",
            sortOrder: 3,
            questions: {
              create: [
                {
                  fieldKey: "hasExperience",
                  label: "Есть ли у тебя опыт ведения или развития аккаунтов в соцсетях?",
                  type: "BOOLEAN",
                  required: true,
                  sortOrder: 0,
                  scoringCategory: "experience",
                  maxPoints: 5,
                  options: {
                    create: [
                      { value: "true", label: "Да", sortOrder: 0, points: 5 },
                      { value: "false", label: "Нет", sortOrder: 1, points: 0 },
                    ],
                  },
                },
                {
                  fieldKey: "experienceDetails",
                  label: "Расскажи о своём опыте: какие аккаунты вёл, какие результаты получил?",
                  description:
                    "Цифры, ссылки, конкретика — всё, что поможет нам оценить твой уровень",
                  type: "TEXTAREA",
                  required: true,
                  sortOrder: 1,
                  showIf: { fieldKey: "hasExperience", value: true },
                  scoringCategory: "experienceDetail",
                  maxPoints: 10,
                  scoringRules: {
                    type: "textLength",
                    tiers: [
                      { min: 250, points: 10 },
                      { min: 150, points: 8 },
                      { min: 80, points: 5 },
                      { min: 30, points: 3 },
                    ],
                  },
                },
                {
                  fieldKey: "portfolioLink",
                  label: "Ссылка на твой аккаунт или портфолио",
                  description: "Instagram, TikTok, Behance — что угодно. Необязательно",
                  type: "TEXT",
                  required: false,
                  sortOrder: 2,
                  maxPoints: 0,
                },
                {
                  fieldKey: "trendIdea",
                  label: "Предложи одну идею для Reels / TikTok для аккаунта про поступление в США",
                  description:
                    "Кратко: тема, формат, хук, для кого. Покажи, как ты думаешь",
                  type: "TEXTAREA",
                  required: true,
                  sortOrder: 3,
                  scoringCategory: "creativity",
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
              ],
            },
          },

          // ─── Page 5: Мотивация и готовность ───
          {
            title: "Мотивация и готовность",
            sortOrder: 4,
            questions: {
              create: [
                {
                  fieldKey: "motivation",
                  label: "Почему тебе интересна эта позиция? Что хочешь получить от работы в команде?",
                  description:
                    "Нас интересует не «правильный» ответ, а твоя честная мотивация",
                  type: "TEXTAREA",
                  required: true,
                  sortOrder: 0,
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
                  fieldKey: "weeklyHours",
                  label: "Сколько часов в неделю готов(а) уделять работе?",
                  type: "RADIO",
                  required: true,
                  sortOrder: 1,
                  maxPoints: 0,
                  options: {
                    create: [
                      { value: "5_10", label: "5–10 часов", sortOrder: 0, points: 0 },
                      { value: "10_20", label: "10–20 часов", sortOrder: 1, points: 0 },
                      { value: "20_30", label: "20–30 часов", sortOrder: 2, points: 0 },
                      { value: "fulltime", label: "Full-time (30+)", sortOrder: 3, points: 0 },
                    ],
                  },
                },
                {
                  fieldKey: "startDate",
                  label: "Когда можешь начать?",
                  type: "RADIO",
                  required: true,
                  sortOrder: 2,
                  maxPoints: 0,
                  options: {
                    create: [
                      { value: "now", label: "Сразу", sortOrder: 0, points: 0 },
                      { value: "1_week", label: "Через неделю", sortOrder: 1, points: 0 },
                      { value: "2_weeks", label: "Через 2 недели", sortOrder: 2, points: 0 },
                      { value: "month", label: "Через месяц", sortOrder: 3, points: 0 },
                    ],
                  },
                },
                {
                  fieldKey: "referralSource",
                  label: "Откуда узнал(а) о вакансии?",
                  type: "RADIO",
                  required: false,
                  sortOrder: 3,
                  config: { layout: "grid" },
                  maxPoints: 0,
                  options: {
                    create: [
                      { value: "instagram", label: "Instagram", sortOrder: 0, points: 0 },
                      { value: "tiktok", label: "TikTok", sortOrder: 1, points: 0 },
                      { value: "telegram", label: "Telegram", sortOrder: 2, points: 0 },
                      { value: "friend", label: "От знакомых", sortOrder: 3, points: 0 },
                      { value: "hh", label: "HeadHunter / другой сайт", sortOrder: 4, points: 0 },
                      { value: "other", label: "Другое", sortOrder: 5, points: 0 },
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
                  sortOrder: 4,
                  maxPoints: 0,
                },
              ],
            },
          },
        ],
      },
    },
  });

  console.log(`Created Content Scout survey: ${survey.id} (slug: ${SLUG})`);
  console.log(`URL: /s/${SLUG}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
