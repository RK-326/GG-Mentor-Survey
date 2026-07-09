import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// NB: шаги "Как будет устроена работа" и "Тестовое задание" — это вопросы CONSENT
// с required:false, которые фронтенд рендерит как инфо-карточку. Контент карточки
// передаётся в поле description (как в превью). На боевом сайте инфо-карточки
// youtube-packaging используют config.variant с текстом, зашитым во фронт; чтобы
// наши description-карточки отрисовались, фронту нужен generic-вариант, читающий
// description (иначе Лёв добавляет вариант). См. PR-обсуждение.

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
        "Ищем fullstack-разработчика: бэкенд (Python/FastAPI или Node.js) + фронтенд (React/Vue), PostgreSQL, REST API. Проектирование архитектуры и участие во всех продуктах компании — от идеи до продакшена.",
      status: "ACTIVE",
      heroTitle: "Fullstack-разработчик",
      ndaText: null,
      successMessage:
        "Спасибо! Мы получили вашу заявку.\n\nРазберём ответы и свяжемся с вами в Telegram в течение 2–3 рабочих дней. Если всё ок — обсудим тестовое и следующие шаги.",
      maxScore: 0,
      dedupFieldKey: "telegram",
      scoreTiers: [],

      pages: {
        create: [
          // ─── Шаг 1 ───
          {
            title: "Давайте познакомимся",
            sortOrder: 0,
            questions: {
              create: [
                { fieldKey: "name", label: "Имя и фамилия", description: "Как к вам обращаться?", type: "TEXT", required: true, sortOrder: 0, maxPoints: 0 },
                { fieldKey: "telegram", label: "Telegram", description: "Укажите актуальный Telegram, по которому мы сможем с вами связаться.", type: "TEXT", required: true, sortOrder: 1, config: { prefix: "@" }, maxPoints: 0 },
              ],
            },
          },

          // ─── Шаг 2 ───
          {
            title: "Расскажите о своём опыте",
            sortOrder: 1,
            questions: {
              create: [
                {
                  fieldKey: "experience",
                  label: "Расскажите о своём опыте",
                  description:
                    "Добавьте ссылку на GitHub / GitLab или проект, в разработке которого участвовали, и коротко напишите, за что отвечали. Коммерческий опыт необязателен — можно показать свой или учебный проект.",
                  type: "TEXTAREA",
                  required: true,
                  sortOrder: 0,
                  maxPoints: 0,
                },
                {
                  fieldKey: "testReadiness",
                  label: "Готовы ли вы выполнить небольшое тестовое задание?",
                  description:
                    "Тестовое поможет и вам, и нам понять, подходим ли мы друг другу по подходу к разработке и формату работы.",
                  type: "RADIO",
                  required: true,
                  sortOrder: 1,
                  maxPoints: 0,
                  options: {
                    create: [
                      { value: "yes", label: "Да, готов(а)", sortOrder: 0, points: 0 },
                      { value: "no", label: "Нет, не готов(а)", sortOrder: 1, points: 0 },
                    ],
                  },
                },
              ],
            },
          },

          // ─── Шаг 3 ───
          {
            title: "С какими задачами вы уже работали?",
            sortOrder: 2,
            questions: {
              create: [
                {
                  fieldKey: "responsibilities",
                  label: "Можно выбрать несколько вариантов.",
                  type: "CHECKBOX",
                  required: true,
                  sortOrder: 0,
                  maxPoints: 0,
                  options: {
                    create: [
                      { value: "architecture", label: "Проектировал(а) архитектуру, REST API и работал(а) с базами данных", sortOrder: 0, points: 0 },
                      { value: "backend", label: "Писал(а) бэкенд на Python/FastAPI или Node.js", sortOrder: 1, points: 0 },
                      { value: "frontend", label: "Делал(а) фронтенд на React или Vue", sortOrder: 2, points: 0 },
                      { value: "devops", label: "Настраивал(а) деплой, Docker и CI/CD", sortOrder: 3, points: 0 },
                      { value: "none", label: "Прямого коммерческого опыта пока нет, но готов(а) показать свой подход в тестовом", sortOrder: 4, points: 0 },
                    ],
                  },
                },
              ],
            },
          },

          // ─── Шаг 4: инфо-карточка «Как будет устроена работа» ───
          {
            title: "Как будет устроена работа",
            sortOrder: 3,
            questions: {
              create: [
                {
                  fieldKey: "workOverview",
                  label: "Что входит в задачи",
                  description:
                    "Fullstack-разработчик участвует во всех продуктах компании — от идеи до продакшена:\nразработка и поддержка веб-сервисов — фронтенд и бэкенд;\nпроектирование архитектуры, API и работа с базами данных;\nсамостоятельность и ответственность за результат.\nФормат: фултайм, удалённо, оформление ГПХ / самозанятый. Оплата — 200 000 ₽ на руки, тестовый период — 2 недели.",
                  type: "CONSENT",
                  required: false,
                  sortOrder: 0,
                  maxPoints: 0,
                },
              ],
            },
          },

          // ─── Шаг 5: тестовое задание ───
          {
            title: "Тестовое задание",
            sortOrder: 4,
            questions: {
              create: [
                {
                  fieldKey: "testTaskInfo",
                  label: "Небольшой REST API",
                  description:
                    "Сделайте маленький REST API на FastAPI или Node.js: один ресурс с CRUD-операциями и валидацией входных данных, плюс короткий README «как запустить». База — по желанию (можно SQLite или in-memory).\nСдать: ссылку на репозиторий (GitHub / GitLab).\nЭто быстрое и простое задание, ориентир — 1–2 часа. Основное тестовое (Мини-CRM «Менторские пары») отправим после успешного прохождения этого задания.",
                  type: "CONSENT",
                  required: false,
                  sortOrder: 0,
                  maxPoints: 0,
                },
                {
                  fieldKey: "testSubmissionUrl",
                  label: "Ссылка на выполненное тестовое",
                  description:
                    "Ссылка на репозиторий (GitHub / GitLab). Если ещё не выполнили — можно прислать позже в Telegram. Проверьте, что репозиторий открывается без запроса доступа.",
                  type: "TEXT",
                  required: false,
                  sortOrder: 1,
                  config: { placeholder: "https://" },
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
