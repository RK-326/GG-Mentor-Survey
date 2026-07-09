import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// NB: шаги "Как будет устроена работа" и "Тестовое задание" — вопросы CONSENT с
// required:false, которые фронтенд рендерит как инфо-карточку (контент в description).
// Тестовое в анкете — бесплатное быстрое задание для проверки навыков; основное
// (большое) тестовое идёт отдельным этапом позже.

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
        "Ищем видеомонтажёра для двух YouTube-каналов о поступлении за рубеж: динамичный монтаж горизонтальных роликов, субтитры, графика, цвет и звук. Участие во всех проектах продакшена.",
      status: "ACTIVE",
      heroTitle: "Видеомонтажёр",
      ndaText: null,
      successMessage:
        "Спасибо! Мы получили вашу заявку.\n\nМы изучим ваши работы и свяжемся с вами в Telegram в течение 2–3 рабочих дней. Если всё ок — обсудим тестовое и следующие шаги.",
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
                    "Добавьте ссылки на портфолио — 3–5 работ, желательно горизонтальные ролики (YouTube / Vimeo / Google Drive), и коротко напишите, что монтировали и за что отвечали. Коммерческий опыт необязателен — можно показать свой или учебный проект.",
                  type: "TEXTAREA",
                  required: true,
                  sortOrder: 0,
                  maxPoints: 0,
                },
                {
                  fieldKey: "testReadiness",
                  label: "Готовы ли вы выполнить небольшое тестовое задание?",
                  description:
                    "Тестовое поможет и вам, и нам понять, подходим ли мы друг другу по подходу к монтажу и формату работы.",
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
                      { value: "dynamic", label: "Монтировал(а) динамичные ролики для YouTube и соцсетей", sortOrder: 0, points: 0 },
                      { value: "graphics", label: "Делал(а) субтитры, титры и графику", sortOrder: 1, points: 0 },
                      { value: "colorsound", label: "Занимался(лась) цветокоррекцией и работой со звуком", sortOrder: 2, points: 0 },
                      { value: "motion", label: "Работал(а) с моушн-графикой в After Effects", sortOrder: 3, points: 0 },
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
                    "Видеомонтажёр участвует во всех проектах продакшена и монтирует ролики для двух YouTube-каналов о поступлении за рубеж:\nмонтаж горизонтальных роликов для YouTube и соцсетей — динамичный монтаж, субтитры, графика;\nработа с исходниками, звуком и цветокоррекцией;\nсоблюдение сроков и участие во всех проектах продакшена.\nФормат: фултайм, удалённо, оформление ГПХ / самозанятый. Оплата — 100 000 ₽ на руки, тестовый период — 1 месяц.",
                  type: "CONSENT",
                  required: false,
                  sortOrder: 0,
                  maxPoints: 0,
                },
              ],
            },
          },

          // ─── Шаг 5: бесплатное быстрое тестовое ───
          {
            title: "Тестовое задание",
            sortOrder: 4,
            questions: {
              create: [
                {
                  fieldKey: "testTaskInfo",
                  label: "Смонтировать короткий ролик",
                  description:
                    "Небольшое задание, чтобы посмотреть на ваш монтаж. Мы пришлём короткие исходники — соберите динамичный ролик 20–40 секунд для YouTube или соцсетей: удержание с первых секунд, субтитры, простые титры, чистый звук.\nСдать: ссылку на готовый ролик (YouTube / Google Drive).\nЭто быстрое и простое задание, ориентир — 1–2 часа. Основное тестовое будет позже, после знакомства.",
                  type: "CONSENT",
                  required: false,
                  sortOrder: 0,
                  maxPoints: 0,
                },
                {
                  fieldKey: "testSubmissionUrl",
                  label: "Ссылка на выполненное тестовое",
                  description:
                    "Ссылка на готовый ролик (YouTube / Google Drive). Если ещё не выполнили — можно прислать позже в Telegram. Проверьте, что ссылка открывается без запроса доступа.",
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

  console.log(`Created Video Editor survey: ${survey.id} (slug: ${SLUG})`);
  console.log(`URL: /s/${SLUG}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
