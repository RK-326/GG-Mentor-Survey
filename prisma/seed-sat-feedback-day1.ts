import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ── Helper: star rating options (1–5 + Не пробовал) ──
function stars(prefix: string, maxPts: number) {
  return [
    { value: `${prefix}_5`, label: "\u2B50\u2B50\u2B50\u2B50\u2B50 Отлично", sortOrder: 0, points: maxPts },
    { value: `${prefix}_4`, label: "\u2B50\u2B50\u2B50\u2B50 Хорошо", sortOrder: 1, points: Math.round(maxPts * 0.75) },
    { value: `${prefix}_3`, label: "\u2B50\u2B50\u2B50 Нормально", sortOrder: 2, points: Math.round(maxPts * 0.5) },
    { value: `${prefix}_2`, label: "\u2B50\u2B50 Плохо", sortOrder: 3, points: Math.round(maxPts * 0.25) },
    { value: `${prefix}_1`, label: "\u2B50 Ужасно", sortOrder: 4, points: 1 },
    { value: `${prefix}_0`, label: "Не пробовал(а)", sortOrder: 5, points: 0 },
  ];
}

// ── Helper: textLength scoring ──
function textScore(maxPts: number) {
  return {
    type: "textLength" as const,
    tiers: [
      { min: 200, points: maxPts },
      { min: 100, points: Math.round(maxPts * 0.7) },
      { min: 50, points: Math.round(maxPts * 0.4) },
      { min: 20, points: Math.round(maxPts * 0.2) },
    ],
  };
}

async function main() {
  console.log("Seeding SAT Feedback Day 1 survey...");

  const existing = await prisma.survey.findUnique({
    where: { slug: "sat-feedback-day1" },
  });
  if (existing) {
    console.log("SAT Feedback Day 1 survey already exists, skipping");
    return;
  }

  const survey = await prisma.survey.create({
    data: {
      slug: "sat-feedback-day1",
      title: "SAT Platform — Первые впечатления",
      description:
        "Короткий опросник: первый опыт, онбординг, интерфейс (~5 минут)",
      status: "DRAFT",
      heroTitle: "Первые впечатления от платформы",
      successMessage:
        "Спасибо за первые впечатления! Через неделю мы попросим вас заполнить подробный опросник.",
      maxScore: 105,
      dedupFieldKey: "telegramUsername",
      scoreTiers: [
        { label: "Активный тестировщик", min: 80 },
        { label: "Хороший фидбэк", min: 55 },
        { label: "Средний фидбэк", min: 30 },
      ],
      pages: {
        create: [
          {
            title: "Первые впечатления",
            sortOrder: 0,
            questions: {
              create: [
                // ── Telegram (dedup) ──
                {
                  fieldKey: "telegramUsername",
                  label: "Ваш Telegram",
                  description: "Чтобы сопоставить ответ с участником",
                  type: "TEXT",
                  required: true,
                  sortOrder: 0,
                  config: { prefix: "@" },
                  maxPoints: 0,
                },
                // ── Первое впечатление (textarea) ──
                {
                  fieldKey: "firstImpression",
                  label: "Ваше первое впечатление от платформы",
                  description: "Опишите что вы почувствовали, когда впервые зашли на платформу",
                  type: "TEXTAREA",
                  required: true,
                  sortOrder: 1,
                  scoringCategory: "firstImpression",
                  maxPoints: 10,
                  scoringRules: textScore(10),
                },
                // ── Онбординг/регистрация (stars) ──
                {
                  fieldKey: "onboardingRating",
                  label: "Регистрация и онбординг",
                  description: "Насколько легко было зарегистрироваться и начать?",
                  type: "RADIO",
                  required: true,
                  sortOrder: 2,
                  scoringCategory: "onboardingRating",
                  maxPoints: 10,
                  options: { create: stars("onboarding", 10) },
                },
                // ── Главная страница (stars) ──
                {
                  fieldKey: "homeRating",
                  label: "Главная страница",
                  description: "Первое впечатление, быстрый доступ, виджеты, общий вид",
                  type: "RADIO",
                  required: true,
                  sortOrder: 3,
                  scoringCategory: "homeRating",
                  maxPoints: 10,
                  options: { create: stars("home", 10) },
                },
                // ── Кабинет (stars) ──
                {
                  fieldKey: "dashboardRating",
                  label: "Кабинет",
                  description: "Личный прогресс, XP, уровень, стрик, достижения",
                  type: "RADIO",
                  required: true,
                  sortOrder: 4,
                  scoringCategory: "dashboardRating",
                  maxPoints: 10,
                  options: { create: stars("dashboard", 10) },
                },
                // ── Дизайн и навигация (stars) ──
                {
                  fieldKey: "designRating",
                  label: "Дизайн и навигация",
                  description: "Красота, удобство, понятность меню, сайдбар",
                  type: "RADIO",
                  required: true,
                  sortOrder: 5,
                  scoringCategory: "designRating",
                  maxPoints: 10,
                  options: { create: stars("design", 10) },
                },
                // ── Что уже успели попробовать? (checkbox) ──
                {
                  fieldKey: "triedFeatures",
                  label: "Что уже успели попробовать?",
                  description: "Отметьте все функции, которые вы уже попробовали",
                  type: "CHECKBOX",
                  required: true,
                  sortOrder: 6,
                  scoringCategory: "triedFeatures",
                  maxPoints: 10,
                  scoringRules: {
                    type: "count",
                    tiers: [
                      { min: 8, points: 10 },
                      { min: 5, points: 7 },
                      { min: 3, points: 4 },
                      { min: 1, points: 2 },
                    ],
                  },
                  options: {
                    create: [
                      { value: "lessons", label: "Уроки (Learning Path)", sortOrder: 0, points: 0 },
                      { value: "question_bank", label: "Банк вопросов", sortOrder: 1, points: 0 },
                      { value: "mock_exam", label: "Пробный экзамен", sortOrder: 2, points: 0 },
                      { value: "ai_tutor", label: "ИИ-репетитор", sortOrder: 3, points: 0 },
                      { value: "speed_round", label: "Быстрый раунд", sortOrder: 4, points: 0 },
                      { value: "spaced_rep", label: "Интервальное повторение", sortOrder: 5, points: 0 },
                      { value: "study_plan", label: "План подготовки", sortOrder: 6, points: 0 },
                      { value: "calculator", label: "Калькулятор", sortOrder: 7, points: 0 },
                      { value: "leaderboard", label: "Лидерборд", sortOrder: 8, points: 0 },
                      { value: "missions", label: "Миссии", sortOrder: 9, points: 0 },
                      { value: "community", label: "Сообщество", sortOrder: 10, points: 0 },
                      { value: "essay_game", label: "Essay Game", sortOrder: 11, points: 0 },
                    ],
                  },
                },
                // ── Что показалось непонятным? (textarea) ──
                {
                  fieldKey: "confusingParts",
                  label: "Что показалось непонятным?",
                  description: "Где вы запутались или не поняли что делать",
                  type: "TEXTAREA",
                  required: false,
                  sortOrder: 7,
                  scoringCategory: "confusingParts",
                  maxPoints: 5,
                  scoringRules: textScore(5),
                },
                // ── Что понравилось сразу? (textarea) ──
                {
                  fieldKey: "likedImmediately",
                  label: "Что понравилось сразу?",
                  description: "Что сразу зацепило, показалось классным или удобным",
                  type: "TEXTAREA",
                  required: true,
                  sortOrder: 8,
                  scoringCategory: "likedImmediately",
                  maxPoints: 10,
                  scoringRules: textScore(10),
                },
                // ── Столкнулись с багами? (textarea) ──
                {
                  fieldKey: "bugsFound",
                  label: "Столкнулись с багами или проблемами?",
                  description: "Что сломалось, зависло, не загрузилось. Опишите подробно",
                  type: "TEXTAREA",
                  required: false,
                  sortOrder: 9,
                  scoringCategory: "bugsFound",
                  maxPoints: 5,
                  scoringRules: textScore(5),
                },
                // ── Общая оценка 1-10 (radio) ──
                {
                  fieldKey: "overallRating",
                  label: "Общая оценка платформы (1-10)",
                  type: "RADIO",
                  required: true,
                  sortOrder: 10,
                  scoringCategory: "overallRating",
                  maxPoints: 10,
                  options: {
                    create: [
                      { value: "10", label: "10 — Отлично", sortOrder: 0, points: 10 },
                      { value: "9", label: "9", sortOrder: 1, points: 9 },
                      { value: "8", label: "8", sortOrder: 2, points: 8 },
                      { value: "7", label: "7", sortOrder: 3, points: 7 },
                      { value: "6", label: "6", sortOrder: 4, points: 6 },
                      { value: "5", label: "5", sortOrder: 5, points: 5 },
                      { value: "4", label: "4", sortOrder: 6, points: 4 },
                      { value: "3", label: "3", sortOrder: 7, points: 3 },
                      { value: "2", label: "2", sortOrder: 8, points: 2 },
                      { value: "1", label: "1 — Ужасно", sortOrder: 9, points: 1 },
                    ],
                  },
                },
                // ── Одно слово/фраза (text) ──
                {
                  fieldKey: "oneWord",
                  label: "Одно слово или фраза, описывающее платформу",
                  description: "Первое что приходит в голову",
                  type: "TEXT",
                  required: true,
                  sortOrder: 11,
                  scoringCategory: "oneWord",
                  maxPoints: 5,
                  scoringRules: textScore(5),
                },
                // ── Что-нибудь ещё? (textarea, optional) ──
                {
                  fieldKey: "anythingElse",
                  label: "Что-нибудь ещё хотите сказать?",
                  description: "Любые мысли, идеи, впечатления",
                  type: "TEXTAREA",
                  required: false,
                  sortOrder: 12,
                  scoringCategory: "anythingElse",
                  maxPoints: 10,
                  scoringRules: textScore(10),
                },
              ],
            },
          },
        ],
      },
    },
  });

  console.log(`Created SAT Feedback Day 1 survey: ${survey.id} (slug: sat-feedback-day1)`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
