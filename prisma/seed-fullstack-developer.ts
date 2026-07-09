import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const SLUG = "fullstack-developer";

  console.log("Seeding Fullstack Developer survey...");

  const existing = await prisma.survey.findUnique({ where: { slug: SLUG } });
  if (existing) {
    console.log("Fullstack Developer survey already exists — skipping creation.");
    return;
  }

  const survey = await prisma.survey.create({
    data: {
      slug: SLUG,
      title: "Fullstack-разработчик (Python/JS) — Global Generation",
      description:
        "Ищем fullstack-разработчика в команду: бэкенд (Python/FastAPI или Node.js) + фронтенд (React/Vue), PostgreSQL, REST API. Фултайм, удалённо, оплата 200 000 ₽ на руки, оформление ГПХ / самозанятый.",
      status: "ACTIVE",
      heroTitle: "Fullstack-разработчик",
      ndaText:
        "Вся информация, которую вы предоставляете в этой анкете, используется исключительно для оценки вашей кандидатуры на позицию Fullstack-разработчика в команде Global Generation.\n\nВаши ответы не передаются третьим лицам и не используются в иных целях. Доступ к анкете имеют только сотрудники GG, участвующие в отборе.",
      successMessage:
        "Спасибо за заявку!\n\nМы разберём ваши ответы и свяжемся с вами в Telegram в течение 2–3 рабочих дней.\n\nЕсли вы нам подходите — пригласим на короткий созвон, а затем на основное тестовое задание.",
      maxScore: 100,
      dedupFieldKey: "telegram",
      scoreTiers: [
        { label: "Сильный кандидат", min: 75 },
        { label: "Хороший кандидат", min: 55 },
        { label: "Спорный — на ручную проверку", min: 35 },
        { label: "Слабый кандидат", min: 0 },
      ],

      pages: {
        create: [
          // ─── ЭТАП 1: Быстрое тестовое (основные навыки) ───
          {
            title: "Этап 1 · Быстрое тестовое",
            sortOrder: 0,
            questions: {
              create: [
                {
                  fieldKey: "experienceYears",
                  label: "Коммерческий опыт fullstack-разработки",
                  type: "RADIO",
                  required: true,
                  sortOrder: 0,
                  config: { layout: "grid" },
                  scoringCategory: "seniority",
                  maxPoints: 10,
                  options: {
                    create: [
                      { value: "lt3", label: "Меньше 3 лет", sortOrder: 0, points: 0 },
                      { value: "3_4", label: "3–4 года", sortOrder: 1, points: 9 },
                      { value: "5_6", label: "5–6 лет", sortOrder: 2, points: 10 },
                      { value: "7plus", label: "7+ лет", sortOrder: 3, points: 10 },
                    ],
                  },
                },
                {
                  fieldKey: "backendStack",
                  label: "Основной backend-стек",
                  type: "RADIO",
                  required: true,
                  sortOrder: 1,
                  scoringCategory: "backend",
                  maxPoints: 10,
                  options: {
                    create: [
                      { value: "python", label: "Python / FastAPI", sortOrder: 0, points: 10 },
                      { value: "node", label: "Node.js", sortOrder: 1, points: 8 },
                      { value: "django", label: "Django", sortOrder: 2, points: 4 },
                      { value: "other_be", label: "Другое", sortOrder: 3, points: 1 },
                    ],
                  },
                },
                {
                  fieldKey: "frontendStack",
                  label: "Основной frontend-стек",
                  type: "RADIO",
                  required: true,
                  sortOrder: 2,
                  scoringCategory: "frontend",
                  maxPoints: 8,
                  options: {
                    create: [
                      { value: "react", label: "React", sortOrder: 0, points: 8 },
                      { value: "vue", label: "Vue", sortOrder: 1, points: 6 },
                      { value: "other_fe", label: "Другое", sortOrder: 2, points: 2 },
                    ],
                  },
                },
                {
                  fieldKey: "postgres",
                  label: "Есть ли у вас коммерческий опыт с PostgreSQL?",
                  type: "BOOLEAN",
                  required: true,
                  sortOrder: 3,
                  scoringCategory: "postgres",
                  maxPoints: 6,
                  options: {
                    create: [
                      { value: "true", label: "Да", sortOrder: 0, points: 6 },
                      { value: "false", label: "Нет", sortOrder: 1, points: 0 },
                    ],
                  },
                },
                {
                  fieldKey: "englishLevel",
                  label: "Уровень английского языка",
                  description: "Нужно читать документацию и вести переписку по задачам на английском",
                  type: "RADIO",
                  required: true,
                  sortOrder: 4,
                  scoringCategory: "english",
                  maxPoints: 6,
                  options: {
                    create: [
                      { value: "A1", label: "A1 — начальный", sortOrder: 0, points: 0 },
                      { value: "A2", label: "A2 — базовый", sortOrder: 1, points: 1 },
                      { value: "B1", label: "B1 — средний", sortOrder: 2, points: 3 },
                      { value: "B2", label: "B2 — выше среднего", sortOrder: 3, points: 6 },
                      { value: "C1C2", label: "C1 / C2 — свободно", sortOrder: 4, points: 6 },
                    ],
                  },
                },
                {
                  fieldKey: "otherSkills",
                  label: "С чем вы уверенно работаете?",
                  description: "Выберите всё подходящее",
                  type: "CHECKBOX",
                  required: true,
                  sortOrder: 5,
                  scoringCategory: "skills",
                  maxPoints: 5,
                  scoringRules: {
                    type: "count",
                    tiers: [
                      { min: 5, points: 5 },
                      { min: 3, points: 4 },
                      { min: 1, points: 2 },
                    ],
                  },
                  options: {
                    create: [
                      { value: "git", label: "Git", sortOrder: 0, points: 0 },
                      { value: "rest", label: "REST API", sortOrder: 1, points: 0 },
                      { value: "docker", label: "Docker", sortOrder: 2, points: 0 },
                      { value: "cicd", label: "CI/CD", sortOrder: 3, points: 0 },
                      { value: "tests", label: "Автотесты", sortOrder: 4, points: 0 },
                      { value: "migrations", label: "Миграции БД (Alembic и т.п.)", sortOrder: 5, points: 0 },
                    ],
                  },
                },
                {
                  fieldKey: "slowEndpoint",
                  label: "Мини-задача: вам дали медленный API-эндпоинт. С чего начнёте искать причину?",
                  description: "Коротко, по делу — это быстрый срез навыков",
                  type: "TEXTAREA",
                  required: true,
                  sortOrder: 6,
                  scoringCategory: "debugging",
                  maxPoints: 12,
                  scoringRules: {
                    type: "textLength",
                    tiers: [
                      { min: 200, points: 12 },
                      { min: 100, points: 8 },
                      { min: 40, points: 4 },
                    ],
                  },
                },
                {
                  fieldKey: "secrets",
                  label: "Мини-задача: как вы храните пароли и секреты и не допускаете их утечки в репозиторий?",
                  type: "TEXTAREA",
                  required: true,
                  sortOrder: 7,
                  scoringCategory: "security",
                  maxPoints: 10,
                  scoringRules: {
                    type: "textLength",
                    tiers: [
                      { min: 200, points: 10 },
                      { min: 100, points: 7 },
                      { min: 40, points: 3 },
                    ],
                  },
                },
              ],
            },
          },

          // ─── ЭТАП 2: О вас и детали (личное — в конце) ───
          {
            title: "Этап 2 · О вас и детали",
            sortOrder: 1,
            questions: {
              create: [
                {
                  fieldKey: "fulltimeRemote",
                  label: "Работа фултайм и удалённо. Подходит ли вам такой формат?",
                  type: "RADIO",
                  required: true,
                  sortOrder: 0,
                  maxPoints: 0,
                  options: {
                    create: [
                      { value: "yes", label: "Да, готов работать фултайм удалённо", sortOrder: 0, points: 0 },
                      { value: "partly", label: "Готов, но с оговорками", sortOrder: 1, points: 0 },
                      { value: "no", label: "Нет", sortOrder: 2, points: 0 },
                    ],
                  },
                },
                {
                  fieldKey: "contractOk",
                  label: "Готовы оформиться по ГПХ или как самозанятый?",
                  type: "BOOLEAN",
                  required: true,
                  sortOrder: 1,
                  maxPoints: 0,
                  options: {
                    create: [
                      { value: "true", label: "Да", sortOrder: 0, points: 0 },
                      { value: "false", label: "Нет", sortOrder: 1, points: 0 },
                    ],
                  },
                },
                {
                  fieldKey: "testTaskOk",
                  label: "Готовы позже выполнить основное оплачиваемое тестовое (примерно один рабочий день)?",
                  type: "BOOLEAN",
                  required: true,
                  sortOrder: 2,
                  maxPoints: 0,
                  options: {
                    create: [
                      { value: "true", label: "Да", sortOrder: 0, points: 0 },
                      { value: "false", label: "Нет", sortOrder: 1, points: 0 },
                    ],
                  },
                },
                { fieldKey: "github", label: "Ссылка на GitHub / GitLab", description: "Обязательно", type: "TEXT", required: true, sortOrder: 3, maxPoints: 0 },
                { fieldKey: "portfolio", label: "Ссылка на резюме, портфолио или деплой любого проекта", description: "Необязательно", type: "TEXT", required: false, sortOrder: 4, maxPoints: 0 },
                {
                  fieldKey: "lastProduct",
                  label: "Над каким продуктом вы работали последним и какая была ваша роль?",
                  description: "2–3 предложения",
                  type: "TEXTAREA",
                  required: true,
                  sortOrder: 5,
                  scoringCategory: "lastProduct",
                  maxPoints: 9,
                  scoringRules: {
                    type: "textLength",
                    tiers: [
                      { min: 250, points: 9 },
                      { min: 150, points: 7 },
                      { min: 80, points: 4 },
                      { min: 30, points: 2 },
                    ],
                  },
                },
                {
                  fieldKey: "archLast",
                  label: "Опишите архитектуру этого проекта: как общались фронтенд и бэкенд, где была БД, как деплоили.",
                  type: "TEXTAREA",
                  required: true,
                  sortOrder: 6,
                  scoringCategory: "architecture",
                  maxPoints: 14,
                  scoringRules: {
                    type: "textLength",
                    tiers: [
                      { min: 300, points: 14 },
                      { min: 180, points: 10 },
                      { min: 90, points: 6 },
                      { min: 30, points: 3 },
                    ],
                  },
                },
                {
                  fieldKey: "motivation",
                  label: "Почему откликнулись именно на нашу вакансию? Что зацепило?",
                  description: "Нас интересует честный ответ, а не «правильный»",
                  type: "TEXTAREA",
                  required: true,
                  sortOrder: 7,
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
                { fieldKey: "name", label: "Имя и фамилия", type: "TEXT", required: true, sortOrder: 8, maxPoints: 0 },
                { fieldKey: "telegram", label: "Telegram", description: "Мы свяжемся именно через Telegram", type: "TEXT", required: true, sortOrder: 9, config: { prefix: "@" }, maxPoints: 0 },
                { fieldKey: "age", label: "Возраст", type: "NUMBER", required: true, sortOrder: 10, config: { min: 18, max: 70 }, maxPoints: 0 },
                { fieldKey: "city", label: "Город и страна", type: "TEXT", required: true, sortOrder: 11, maxPoints: 0 },
                {
                  fieldKey: "referralSource",
                  label: "Откуда вы узнали о вакансии?",
                  type: "RADIO",
                  required: false,
                  sortOrder: 12,
                  config: { layout: "grid" },
                  maxPoints: 0,
                  options: {
                    create: [
                      { value: "hh", label: "HeadHunter", sortOrder: 0, points: 0 },
                      { value: "telegram", label: "Telegram", sortOrder: 1, points: 0 },
                      { value: "github", label: "GitHub", sortOrder: 2, points: 0 },
                      { value: "friend", label: "От знакомых", sortOrder: 3, points: 0 },
                      { value: "other", label: "Другое", sortOrder: 4, points: 0 },
                    ],
                  },
                },
                {
                  fieldKey: "consentData",
                  label: "Я согласен(на) на обработку персональных данных",
                  description: "Данные используются только для рассмотрения заявки и связи с кандидатом",
                  type: "CONSENT",
                  required: true,
                  sortOrder: 13,
                  maxPoints: 0,
                },
              ],
            },
          },
        ],
      },
    },
  });

  console.log(`Created Fullstack Developer survey: ${survey.id} (slug: ${SLUG})`);
  console.log(`URL: /s/${SLUG}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
