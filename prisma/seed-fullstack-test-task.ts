import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const SLUG = "fullstack-test-task";

  console.log("Seeding Fullstack test task survey...");

  const existing = await prisma.survey.findUnique({ where: { slug: SLUG } });
  if (existing) {
    console.log("Fullstack test task survey already exists — skipping creation.");
    return;
  }

  const survey = await prisma.survey.create({
    data: {
      slug: SLUG,
      title: "Тестовое задание — Fullstack-разработчик — Global Generation",
      description:
        "Мини-CRM «Менторские пары». Оплачиваемое, ориентир — рабочий день, дедлайн — 3 дня с момента получения.",
      status: "ACTIVE",
      heroTitle: "Тестовое задание · Fullstack",
      ndaText: null,
      successMessage:
        "Спасибо! Мы получили вашу работу.\n\nПосле код-ревью вернёмся с ответом в Telegram. Если всё ок — позовём на второй раунд с командой и разбором вашего решения.",
      maxScore: 0,
      dedupFieldKey: "telegram",
      scoreTiers: [],

      pages: {
        create: [
          // ─── Задание ───
          {
            title: "Задание",
            sortOrder: 0,
            questions: {
              create: [
                {
                  fieldKey: "taskAck",
                  label:
                    "Мини-CRM «Менторские пары». Соберите небольшой, но цельный сервис: CRUD менторов и менти (имя, email, направление, статус); пары «ментор ↔ менти» с ограничением «один менти — не более одной активной пары» (валидация на бэке); фиксация встреч (дата, длительность, заметка); список пар с числом встреч и фильтрами по направлению и статусу; поиск по имени или email.",
                  description:
                    "Стек: FastAPI + PostgreSQL с миграциями + React, REST API с валидацией и осмысленными статус-кодами, запуск по README (приветствуется docker-compose), внятная история коммитов. Формат: оплачиваемое, ориентир — рабочий день (6–8 часов), дедлайн — 3 дня. Оцениваем: работу по ТЗ, backend/API, работу с БД (серверная валидация «1 активная пара»), frontend, качество кода, git/README. Бонусы: тесты, Docker, CI, публичный деплой.",
                  type: "BOOLEAN",
                  required: true,
                  sortOrder: 0,
                  maxPoints: 0,
                  options: {
                    create: [
                      { value: "true", label: "Понятно, приступаю к заданию", sortOrder: 0, points: 0 },
                      { value: "false", label: "Есть вопросы по заданию", sortOrder: 1, points: 0 },
                    ],
                  },
                },
                {
                  fieldKey: "taskQuestions",
                  label: "Какие есть вопросы по заданию?",
                  type: "TEXTAREA",
                  required: true,
                  sortOrder: 1,
                  showIf: { fieldKey: "taskAck", value: "false" },
                  maxPoints: 0,
                },
              ],
            },
          },

          // ─── Сдача работы ───
          {
            title: "Сдача работы",
            sortOrder: 1,
            questions: {
              create: [
                { fieldKey: "repoLink", label: "Ссылка на репозиторий (GitHub / GitLab)", description: "С открытым доступом", type: "TEXT", required: true, sortOrder: 0, maxPoints: 0 },
                { fieldKey: "deployLink", label: "Ссылка на живой деплой", description: "Если развернули — необязательно", type: "TEXT", required: false, sortOrder: 1, maxPoints: 0 },
                { fieldKey: "readmeNotes", label: "Что бы вы улучшили, будь больше времени?", description: "3–5 предложений — это часть того, что мы просим в README", type: "TEXTAREA", required: true, sortOrder: 2, maxPoints: 0 },
                {
                  fieldKey: "bonusesDone",
                  label: "Что успели сверх минимума?",
                  description: "Отметьте всё, что сделали",
                  type: "CHECKBOX",
                  required: false,
                  sortOrder: 3,
                  maxPoints: 0,
                  options: {
                    create: [
                      { value: "tests", label: "Тесты на ключевую логику", sortOrder: 0, points: 0 },
                      { value: "docker", label: "Docker / docker-compose", sortOrder: 1, points: 0 },
                      { value: "ci", label: "Простой CI", sortOrder: 2, points: 0 },
                      { value: "deploy", label: "Публичный деплой", sortOrder: 3, points: 0 },
                      { value: "pagination", label: "Пагинация", sortOrder: 4, points: 0 },
                      { value: "ux", label: "Аккуратный UX и обработка ошибок", sortOrder: 5, points: 0 },
                    ],
                  },
                },
                {
                  fieldKey: "timeSpent",
                  label: "Сколько времени заняло задание?",
                  type: "RADIO",
                  required: false,
                  sortOrder: 4,
                  config: { layout: "grid" },
                  maxPoints: 0,
                  options: {
                    create: [
                      { value: "lt4", label: "Меньше 4 часов", sortOrder: 0, points: 0 },
                      { value: "4_8", label: "4–8 часов", sortOrder: 1, points: 0 },
                      { value: "1_2d", label: "1–2 дня", sortOrder: 2, points: 0 },
                      { value: "more", label: "Больше", sortOrder: 3, points: 0 },
                    ],
                  },
                },
              ],
            },
          },

          // ─── О вас ───
          {
            title: "О вас",
            sortOrder: 2,
            questions: {
              create: [
                { fieldKey: "name", label: "Имя и фамилия", type: "TEXT", required: true, sortOrder: 0, maxPoints: 0 },
                { fieldKey: "telegram", label: "Telegram", description: "Мы свяжемся именно через Telegram", type: "TEXT", required: true, sortOrder: 1, config: { prefix: "@" }, maxPoints: 0 },
                { fieldKey: "consentData", label: "Я согласен(на) на обработку персональных данных", description: "Данные используются только для рассмотрения заявки и связи с кандидатом", type: "CONSENT", required: true, sortOrder: 2, maxPoints: 0 },
              ],
            },
          },
        ],
      },
    },
  });

  console.log(`Created Fullstack test task survey: ${survey.id} (slug: ${SLUG})`);
  console.log(`URL: /s/${SLUG}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
