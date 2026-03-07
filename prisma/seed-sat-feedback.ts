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
  console.log("Seeding SAT Feedback Week survey v3...");

  const existing = await prisma.survey.findUnique({
    where: { slug: "sat-feedback-week" },
  });
  if (existing) {
    console.log("SAT Feedback Week survey already exists, skipping");
    return;
  }

  const survey = await prisma.survey.create({
    data: {
      slug: "sat-feedback-week",
      title: "SAT Platform — Спустя неделю",
      description:
        "Подробный опросник: оценка каждого раздела платформы + открытые ответы (~20 мин)",
      status: "DRAFT",
      heroTitle: "Спасибо за неделю тестирования! Оцените каждый раздел платформы",
      successMessage:
        "Спасибо за подробную обратную связь! Ваши ответы помогут нам сделать платформу лучше. Самые активные тестировщики получат продлённый бесплатный доступ.",
      maxScore: 200,
      dedupFieldKey: "telegramUsername",
      scoreTiers: [
        { label: "Активный тестировщик", min: 150 },
        { label: "Хороший фидбэк", min: 100 },
        { label: "Средний фидбэк", min: 50 },
        { label: "Минимальный фидбэк", min: 0 },
      ],
      pages: {
        create: [
          // ═══════════════════════════════════════════════
          // Page 1: Общие + Главная + Кабинет
          // ═══════════════════════════════════════════════
          {
            title: "Общие впечатления",
            sortOrder: 0,
            questions: {
              create: [
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
                {
                  fieldKey: "overallRating",
                  label: "Оцените платформу в целом (1–10)",
                  type: "RADIO",
                  required: true,
                  sortOrder: 1,
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
                // ── Главная ──
                {
                  fieldKey: "homeRating",
                  label: "Главная страница",
                  description: "Первое впечатление, быстрый доступ, виджеты, общий вид",
                  type: "RADIO",
                  required: true,
                  sortOrder: 2,
                  scoringCategory: "homeRating",
                  maxPoints: 5,
                  options: { create: stars("home", 5) },
                },
                {
                  fieldKey: "homeComment",
                  label: "Что улучшить на Главной?",
                  type: "TEXTAREA",
                  required: false,
                  sortOrder: 3,
                  scoringCategory: "homeComment",
                  maxPoints: 3,
                  scoringRules: textScore(3),
                },
                // ── Кабинет ──
                {
                  fieldKey: "dashboardRating",
                  label: "Кабинет",
                  description: "Личный прогресс, XP, уровень, стрик, достижения, статистика по секциям, недавние события",
                  type: "RADIO",
                  required: true,
                  sortOrder: 4,
                  scoringCategory: "dashboardRating",
                  maxPoints: 5,
                  options: { create: stars("dashboard", 5) },
                },
                {
                  fieldKey: "dashboardComment",
                  label: "Что улучшить в Кабинете?",
                  type: "TEXTAREA",
                  required: false,
                  sortOrder: 5,
                  scoringCategory: "dashboardComment",
                  maxPoints: 3,
                  scoringRules: textScore(3),
                },
                // ── Дизайн / навигация ──
                {
                  fieldKey: "designRating",
                  label: "Дизайн, навигация, сайдбар",
                  description: "Красота, удобство, понятность меню, адаптив на мобильном",
                  type: "RADIO",
                  required: true,
                  sortOrder: 6,
                  scoringCategory: "designRating",
                  maxPoints: 5,
                  options: { create: stars("design", 5) },
                },
                {
                  fieldKey: "designComment",
                  label: "Что улучшить в дизайне / навигации?",
                  type: "TEXTAREA",
                  required: false,
                  sortOrder: 7,
                  scoringCategory: "designComment",
                  maxPoints: 3,
                  scoringRules: textScore(3),
                },
                // ── Онбординг ──
                {
                  fieldKey: "onboardingRating",
                  label: "Регистрация и онбординг",
                  description: "Первый вход, выбор целей, понятность — с чего начать",
                  type: "RADIO",
                  required: true,
                  sortOrder: 8,
                  scoringCategory: "onboardingRating",
                  maxPoints: 5,
                  options: { create: stars("onboarding", 5) },
                },
              ],
            },
          },

          // ═══════════════════════════════════════════════
          // Page 2: Практика
          // ═══════════════════════════════════════════════
          {
            title: "Практика",
            sortOrder: 1,
            questions: {
              create: [
                // ── Режимы тренировок (общее) ──
                {
                  fieldKey: "trainingModesRating",
                  label: "Режимы тренировок (общее)",
                  description: "Банк вопросов с тремя режимами: Assessment, Smart Practice, Standard. Фильтры по секции, сложности, теме",
                  type: "RADIO",
                  required: true,
                  sortOrder: 0,
                  scoringCategory: "trainingModesRating",
                  maxPoints: 8,
                  options: { create: stars("modes", 8) },
                },
                // ── Assessment Mode ──
                {
                  fieldKey: "assessmentModeRating",
                  label: "Assessment Mode",
                  description: "~20 вопросов, ИИ-анализ сильных/слабых сторон, рекомендации",
                  type: "RADIO",
                  required: true,
                  sortOrder: 1,
                  scoringCategory: "assessmentModeRating",
                  maxPoints: 5,
                  options: { create: stars("assess", 5) },
                },
                // ── Smart Practice ──
                {
                  fieldKey: "smartPracticeRating",
                  label: "Smart Practice",
                  description: "Адаптивная ИИ-тренировка — подбирает вопросы под ваш уровень",
                  type: "RADIO",
                  required: true,
                  sortOrder: 2,
                  scoringCategory: "smartPracticeRating",
                  maxPoints: 5,
                  options: { create: stars("smart", 5) },
                },
                // ── Standard Practice ──
                {
                  fieldKey: "standardPracticeRating",
                  label: "Standard Practice",
                  description: "Обычная тренировка — случайные вопросы с фильтрами",
                  type: "RADIO",
                  required: true,
                  sortOrder: 3,
                  scoringCategory: "standardPracticeRating",
                  maxPoints: 5,
                  options: { create: stars("standard", 5) },
                },
                // ── Качество вопросов и объяснений ──
                {
                  fieldKey: "questionsQualityRating",
                  label: "Качество вопросов и объяснений",
                  description: "Насколько вопросы похожи на реальный SAT? Понятны ли объяснения?",
                  type: "RADIO",
                  required: true,
                  sortOrder: 4,
                  scoringCategory: "questionsQualityRating",
                  maxPoints: 5,
                  options: { create: stars("qality", 5) },
                },
                // ── Кнопка «Explain with AI» ──
                {
                  fieldKey: "explainAiRating",
                  label: "Кнопка «Explain with AI» в вопросах",
                  description: "ИИ-объяснение к конкретному вопросу после ответа",
                  type: "RADIO",
                  required: true,
                  sortOrder: 5,
                  scoringCategory: "explainAiRating",
                  maxPoints: 3,
                  options: { create: stars("explai", 3) },
                },
                {
                  fieldKey: "trainingComment",
                  label: "Что улучшить в режимах тренировок?",
                  description: "Фильтры, режимы, качество заданий, объяснения — что не так?",
                  type: "TEXTAREA",
                  required: false,
                  sortOrder: 6,
                  scoringCategory: "trainingComment",
                  maxPoints: 5,
                  scoringRules: textScore(5),
                },
                // ── Speed Round ──
                {
                  fieldKey: "speedRoundRating",
                  label: "Быстрый раунд (Speed Round)",
                  description: "3-минутная тренировка на скорость, автоцикл вопросов, XP",
                  type: "RADIO",
                  required: true,
                  sortOrder: 7,
                  scoringCategory: "speedRoundRating",
                  maxPoints: 5,
                  options: { create: stars("speed", 5) },
                },
                // ── Интервальное повторение ──
                {
                  fieldKey: "spacedRepRating",
                  label: "Интервальное повторение (Spaced Repetition)",
                  description: "Повторение ошибок по алгоритму, оценка сложности 1–5",
                  type: "RADIO",
                  required: true,
                  sortOrder: 8,
                  scoringCategory: "spacedRepRating",
                  maxPoints: 5,
                  options: { create: stars("srep", 5) },
                },
                // ── Пробный экзамен ──
                {
                  fieldKey: "mockExamRating",
                  label: "Пробный экзамен (Mock Exam)",
                  description: "Полный Digital SAT: 98 вопросов, 2 ч 14 мин, адаптивные модули, перерыв, результаты, разбор",
                  type: "RADIO",
                  required: true,
                  sortOrder: 9,
                  scoringCategory: "mockExamRating",
                  maxPoints: 8,
                  options: { create: stars("mock", 8) },
                },
                {
                  fieldKey: "mockExamComment",
                  label: "Что улучшить в пробном экзамене?",
                  description: "Реалистичность, таймер, результаты, разбор ответов, скоринг",
                  type: "TEXTAREA",
                  required: false,
                  sortOrder: 10,
                  scoringCategory: "mockExamComment",
                  maxPoints: 3,
                  scoringRules: textScore(3),
                },
                // ── Миссии ──
                {
                  fieldKey: "missionsRating",
                  label: "Миссии (Weekly Missions)",
                  description: "Еженедельные задания, награды кристаллами, лидерборд миссий",
                  type: "RADIO",
                  required: true,
                  sortOrder: 11,
                  scoringCategory: "missionsRating",
                  maxPoints: 5,
                  options: { create: stars("missions", 5) },
                },
                {
                  fieldKey: "missionsComment",
                  label: "Что улучшить в миссиях?",
                  type: "TEXTAREA",
                  required: false,
                  sortOrder: 12,
                  scoringCategory: "missionsComment",
                  maxPoints: 3,
                  scoringRules: textScore(3),
                },
              ],
            },
          },

          // ═══════════════════════════════════════════════
          // Page 3: Обучение
          // ═══════════════════════════════════════════════
          {
            title: "Обучение",
            sortOrder: 2,
            questions: {
              create: [
                // ── Обучение SAT (Learning Path) ──
                {
                  fieldKey: "lessonsRating",
                  label: "Обучение SAT (Learning Path)",
                  description: "Структурированный курс: Core Topics, Math, Reading & Writing, стратегии. Уроки, примеры, практика",
                  type: "RADIO",
                  required: true,
                  sortOrder: 0,
                  scoringCategory: "lessonsRating",
                  maxPoints: 8,
                  options: { create: stars("lessons", 8) },
                },
                {
                  fieldKey: "lessonsContentRating",
                  label: "Качество контента уроков",
                  description: "Понятность объяснений, глубина, примеры, подача на русском языке",
                  type: "RADIO",
                  required: true,
                  sortOrder: 1,
                  scoringCategory: "lessonsContentRating",
                  maxPoints: 5,
                  options: { create: stars("lcont", 5) },
                },
                {
                  fieldKey: "lessonsStructureRating",
                  label: "Структура курса",
                  description: "Логичность порядка тем, прогресс-бар, навигация между уроками",
                  type: "RADIO",
                  required: true,
                  sortOrder: 2,
                  scoringCategory: "lessonsStructureRating",
                  maxPoints: 3,
                  options: { create: stars("lstruct", 3) },
                },
                {
                  fieldKey: "lessonsExtrasRating",
                  label: "Доп. материалы: Глоссарий, FAQ, Сравнение ЕГЭ/ЕНТ vs SAT, Центры сдачи",
                  type: "RADIO",
                  required: true,
                  sortOrder: 3,
                  scoringCategory: "lessonsExtrasRating",
                  maxPoints: 3,
                  options: { create: stars("lextras", 3) },
                },
                {
                  fieldKey: "lessonsComment",
                  label: "Что улучшить в обучении SAT?",
                  type: "TEXTAREA",
                  required: false,
                  sortOrder: 4,
                  scoringCategory: "lessonsComment",
                  maxPoints: 5,
                  scoringRules: textScore(5),
                },
                // ── AI Репетитор ──
                {
                  fieldKey: "aiTutorRating",
                  label: "AI Репетитор",
                  description: "5 режимов: свободный чат, разбор вопроса, анализ ошибок, мини-практика, план подготовки",
                  type: "RADIO",
                  required: true,
                  sortOrder: 5,
                  scoringCategory: "aiTutorRating",
                  maxPoints: 8,
                  options: { create: stars("ai", 8) },
                },
                {
                  fieldKey: "aiTutorQualityRating",
                  label: "Качество ответов AI Репетитора",
                  description: "Точность, полнота, понятность объяснений, скорость",
                  type: "RADIO",
                  required: true,
                  sortOrder: 6,
                  scoringCategory: "aiTutorQualityRating",
                  maxPoints: 5,
                  options: { create: stars("aiqual", 5) },
                },
                {
                  fieldKey: "aiTutorComment",
                  label: "Что улучшить в AI Репетиторе?",
                  type: "TEXTAREA",
                  required: false,
                  sortOrder: 7,
                  scoringCategory: "aiTutorComment",
                  maxPoints: 5,
                  scoringRules: textScore(5),
                },
                // ── Видео-курсы ──
                {
                  fieldKey: "coursesRating",
                  label: "Видео-курсы",
                  description: "Раздел с видео-курсами",
                  type: "RADIO",
                  required: true,
                  sortOrder: 8,
                  scoringCategory: "coursesRating",
                  maxPoints: 3,
                  options: { create: stars("courses", 3) },
                },
                // ── Вебинары ──
                {
                  fieldKey: "webinarsRating",
                  label: "Вебинары",
                  description: "Расписание, регистрация, записи вебинаров",
                  type: "RADIO",
                  required: true,
                  sortOrder: 9,
                  scoringCategory: "webinarsRating",
                  maxPoints: 3,
                  options: { create: stars("webinars", 3) },
                },
                // ── SAT Calculator ──
                {
                  fieldKey: "calculatorRating",
                  label: "SAT Calculator (Desmos)",
                  description: "Встроенный графический калькулятор Desmos",
                  type: "RADIO",
                  required: true,
                  sortOrder: 10,
                  scoringCategory: "calculatorRating",
                  maxPoints: 3,
                  options: { create: stars("calc", 3) },
                },
                // ── План подготовки ──
                {
                  fieldKey: "studyPlanRating",
                  label: "План подготовки (Study Plan)",
                  description: "Персонализированный план на 12 недель, ежедневные задания",
                  type: "RADIO",
                  required: true,
                  sortOrder: 11,
                  scoringCategory: "studyPlanRating",
                  maxPoints: 5,
                  options: { create: stars("plan", 5) },
                },
              ],
            },
          },

          // ═══════════════════════════════════════════════
          // Page 4: Сообщество + Геймификация
          // ═══════════════════════════════════════════════
          {
            title: "Сообщество и мотивация",
            sortOrder: 3,
            questions: {
              create: [
                // ── Сообщество ──
                {
                  fieldKey: "communityRating",
                  label: "Сообщество (Community Chat)",
                  description: "Чат с другими студентами, каналы, обсуждения",
                  type: "RADIO",
                  required: true,
                  sortOrder: 0,
                  scoringCategory: "communityRating",
                  maxPoints: 5,
                  options: { create: stars("community", 5) },
                },
                {
                  fieldKey: "communityComment",
                  label: "Что улучшить в сообществе?",
                  type: "TEXTAREA",
                  required: false,
                  sortOrder: 1,
                  scoringCategory: "communityComment",
                  maxPoints: 3,
                  scoringRules: textScore(3),
                },
                // ── Лидерборд ──
                {
                  fieldKey: "leaderboardRating",
                  label: "Лидерборд (Рейтинг)",
                  description: "Таблица лидеров по XP, лиги, бейджи",
                  type: "RADIO",
                  required: true,
                  sortOrder: 2,
                  scoringCategory: "leaderboardRating",
                  maxPoints: 3,
                  options: { create: stars("leader", 3) },
                },
                // ── XP / Уровни / Стрики ──
                {
                  fieldKey: "gamificationRating",
                  label: "XP, уровни, стрики, достижения",
                  description: "Bronze → Diamond, ежедневные стрики, ачивки, прогресс-система",
                  type: "RADIO",
                  required: true,
                  sortOrder: 3,
                  scoringCategory: "gamificationRating",
                  maxPoints: 5,
                  options: { create: stars("gamif", 5) },
                },
                {
                  fieldKey: "gamificationComment",
                  label: "Что улучшить в геймификации?",
                  description: "XP, уровни, стрики, ачивки, лидерборд, миссии",
                  type: "TEXTAREA",
                  required: false,
                  sortOrder: 4,
                  scoringCategory: "gamificationComment",
                  maxPoints: 3,
                  scoringRules: textScore(3),
                },
                // ── Мотивация ──
                {
                  fieldKey: "motivationLevel",
                  label: "Насколько платформа мотивирует заниматься регулярно?",
                  type: "RADIO",
                  required: true,
                  sortOrder: 5,
                  scoringCategory: "motivationLevel",
                  maxPoints: 5,
                  options: {
                    create: [
                      { value: "very_motivated", label: "Очень мотивирует — хочется заходить каждый день", sortOrder: 0, points: 5 },
                      { value: "somewhat", label: "Немного мотивирует", sortOrder: 1, points: 3 },
                      { value: "neutral", label: "Нейтрально", sortOrder: 2, points: 2 },
                      { value: "not_really", label: "Не мотивирует", sortOrder: 3, points: 1 },
                    ],
                  },
                },
                // ── Сравнение ──
                {
                  fieldKey: "comparedWith",
                  label: "С чем вы сравниваете нашу платформу?",
                  type: "CHECKBOX",
                  required: true,
                  sortOrder: 6,
                  maxPoints: 0,
                  options: {
                    create: [
                      { value: "khan_academy", label: "Khan Academy", sortOrder: 0, points: 0 },
                      { value: "college_board", label: "College Board / Bluebook", sortOrder: 1, points: 0 },
                      { value: "youtube", label: "YouTube", sortOrder: 2, points: 0 },
                      { value: "tutor", label: "Репетитор", sortOrder: 3, points: 0 },
                      { value: "other_courses", label: "Другие курсы / приложения", sortOrder: 4, points: 0 },
                      { value: "nothing", label: "Ничего — первый опыт подготовки", sortOrder: 5, points: 0 },
                    ],
                  },
                },
                {
                  fieldKey: "betterThanOthers",
                  label: "Чем наша платформа лучше того, что вы пробовали?",
                  type: "TEXTAREA",
                  required: false,
                  sortOrder: 7,
                  scoringCategory: "betterThanOthers",
                  maxPoints: 3,
                  scoringRules: textScore(3),
                },
                {
                  fieldKey: "worseThanOthers",
                  label: "Чем хуже? Что есть у других, но нет у нас?",
                  type: "TEXTAREA",
                  required: false,
                  sortOrder: 8,
                  scoringCategory: "worseThanOthers",
                  maxPoints: 3,
                  scoringRules: textScore(3),
                },
              ],
            },
          },

          // ═══════════════════════════════════════════════
          // Page 5: Баги + идеи + NPS
          // ═══════════════════════════════════════════════
          {
            title: "Проблемы и итоги",
            sortOrder: 4,
            questions: {
              create: [
                {
                  fieldKey: "bugsFound",
                  label: "Баги и технические проблемы",
                  description: "Что сломалось, на какой странице, что делали. Скриншоты приветствуются!",
                  type: "TEXTAREA",
                  required: false,
                  sortOrder: 0,
                  scoringCategory: "bugsFound",
                  maxPoints: 5,
                  scoringRules: textScore(5),
                },
                {
                  fieldKey: "missingFeatures",
                  label: "Чего не хватает? Что бы вы добавили?",
                  description: "Конкретные функции, контент, инструменты",
                  type: "TEXTAREA",
                  required: true,
                  sortOrder: 1,
                  scoringCategory: "missingFeatures",
                  maxPoints: 5,
                  scoringRules: textScore(5),
                },
                {
                  fieldKey: "oneThingToChange",
                  label: "Если бы вы могли изменить ОДНУ вещь — что бы это было?",
                  type: "TEXTAREA",
                  required: true,
                  sortOrder: 2,
                  scoringCategory: "oneThingToChange",
                  maxPoints: 3,
                  scoringRules: textScore(3),
                },
                {
                  fieldKey: "wouldContinue",
                  label: "Продолжили бы вы пользоваться платформой?",
                  type: "RADIO",
                  required: true,
                  sortOrder: 3,
                  scoringCategory: "wouldContinue",
                  maxPoints: 5,
                  options: {
                    create: [
                      { value: "definitely", label: "Да, однозначно", sortOrder: 0, points: 5 },
                      { value: "probably", label: "Скорее да", sortOrder: 1, points: 4 },
                      { value: "not_sure", label: "Не уверен(а)", sortOrder: 2, points: 2 },
                      { value: "no", label: "Нет", sortOrder: 3, points: 0 },
                    ],
                  },
                },
                {
                  fieldKey: "npsScore",
                  label: "Порекомендовали бы вы платформу другу? (NPS)",
                  description: "1 — точно нет, 10 — точно да",
                  type: "RADIO",
                  required: true,
                  sortOrder: 4,
                  scoringCategory: "npsScore",
                  maxPoints: 10,
                  options: {
                    create: [
                      { value: "10", label: "10 — Точно да!", sortOrder: 0, points: 10 },
                      { value: "9", label: "9", sortOrder: 1, points: 9 },
                      { value: "8", label: "8", sortOrder: 2, points: 8 },
                      { value: "7", label: "7", sortOrder: 3, points: 7 },
                      { value: "6", label: "6", sortOrder: 4, points: 6 },
                      { value: "5", label: "5", sortOrder: 5, points: 5 },
                      { value: "4", label: "4", sortOrder: 6, points: 4 },
                      { value: "3", label: "3", sortOrder: 7, points: 3 },
                      { value: "2", label: "2", sortOrder: 8, points: 2 },
                      { value: "1", label: "1 — Точно нет", sortOrder: 9, points: 1 },
                    ],
                  },
                },
              ],
            },
          },

          // ═══════════════════════════════════════════════
          // Page 6: Открытые ответы по каждому разделу
          // ═══════════════════════════════════════════════
          {
            title: "Подробный отзыв по каждому разделу",
            sortOrder: 5,
            questions: {
              create: [
                {
                  fieldKey: "openHome",
                  label: "Главная — подробный отзыв",
                  description: "Всё что хотите сказать про главную страницу",
                  type: "TEXTAREA",
                  required: false,
                  sortOrder: 0,
                  scoringCategory: "openHome",
                  maxPoints: 2,
                  scoringRules: textScore(2),
                },
                {
                  fieldKey: "openDashboard",
                  label: "Кабинет — подробный отзыв",
                  description: "Прогресс, статистика, достижения, XP",
                  type: "TEXTAREA",
                  required: false,
                  sortOrder: 1,
                  scoringCategory: "openDashboard",
                  maxPoints: 2,
                  scoringRules: textScore(2),
                },
                {
                  fieldKey: "openCommunity",
                  label: "Сообщество — подробный отзыв",
                  description: "Чат, каналы, общение с другими",
                  type: "TEXTAREA",
                  required: false,
                  sortOrder: 2,
                  scoringCategory: "openCommunity",
                  maxPoints: 2,
                  scoringRules: textScore(2),
                },
                {
                  fieldKey: "openTraining",
                  label: "Режимы тренировок — подробный отзыв",
                  description: "Assessment, Smart, Standard, вопросы, объяснения, фильтры",
                  type: "TEXTAREA",
                  required: false,
                  sortOrder: 3,
                  scoringCategory: "openTraining",
                  maxPoints: 2,
                  scoringRules: textScore(2),
                },
                {
                  fieldKey: "openMissions",
                  label: "Миссии — подробный отзыв",
                  description: "Задания, награды, мотивация",
                  type: "TEXTAREA",
                  required: false,
                  sortOrder: 4,
                  scoringCategory: "openMissions",
                  maxPoints: 2,
                  scoringRules: textScore(2),
                },
                {
                  fieldKey: "openCalculator",
                  label: "SAT Calculator — подробный отзыв",
                  description: "Desmos, удобство, доступность",
                  type: "TEXTAREA",
                  required: false,
                  sortOrder: 5,
                  scoringCategory: "openCalculator",
                  maxPoints: 2,
                  scoringRules: textScore(2),
                },
                {
                  fieldKey: "openLessons",
                  label: "Обучение SAT — подробный отзыв",
                  description: "Уроки, темы, структура курса, глоссарий, FAQ",
                  type: "TEXTAREA",
                  required: false,
                  sortOrder: 6,
                  scoringCategory: "openLessons",
                  maxPoints: 2,
                  scoringRules: textScore(2),
                },
                {
                  fieldKey: "openAiTutor",
                  label: "AI Репетитор — подробный отзыв",
                  description: "Режимы, качество, полезность",
                  type: "TEXTAREA",
                  required: false,
                  sortOrder: 7,
                  scoringCategory: "openAiTutor",
                  maxPoints: 2,
                  scoringRules: textScore(2),
                },
                {
                  fieldKey: "openCourses",
                  label: "Видео-курсы — подробный отзыв",
                  type: "TEXTAREA",
                  required: false,
                  sortOrder: 8,
                  scoringCategory: "openCourses",
                  maxPoints: 2,
                  scoringRules: textScore(2),
                },
                {
                  fieldKey: "openWebinars",
                  label: "Вебинары — подробный отзыв",
                  type: "TEXTAREA",
                  required: false,
                  sortOrder: 9,
                  scoringCategory: "openWebinars",
                  maxPoints: 2,
                  scoringRules: textScore(2),
                },
                {
                  fieldKey: "anythingElse",
                  label: "Что-нибудь ещё, что хотите сказать команде?",
                  description: "Любые мысли, идеи, пожелания — мы всё читаем!",
                  type: "TEXTAREA",
                  required: false,
                  sortOrder: 10,
                  maxPoints: 0,
                },
              ],
            },
          },
        ],
      },
    },
  });

  console.log(`Created SAT Feedback Week survey: ${survey.id} (slug: sat-feedback-week)`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
