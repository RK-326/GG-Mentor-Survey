import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Маркетолог PPC — анкета в стиле youtube-packaging, но БЕЗ тестового задания.
// Шаг "Как будет устроена работа" — CONSENT required:false (инфо-карточка, контент в description).

async function main() {
  const SLUG = "marketer-ppc";

  console.log("Seeding Marketer PPC survey...");

  const existing = await prisma.survey.findUnique({ where: { slug: SLUG } });
  if (existing) {
    console.log("Marketer PPC survey already exists — skipping creation.");
    return;
  }

  const survey = await prisma.survey.create({
    data: {
      slug: SLUG,
      title: "Маркетолог PPC — Global Generation",
      description:
        "Ищем PPC-маркетолога для B2C fin-tech приложения (трекинг личных финансов, рынок США). Основной фокус — Meta Ads, затем Google Ads. Part-time, удалённо, 50 000 ₽ на руки, оформление ГПХ / самозанятый.",
      status: "ACTIVE",
      heroTitle: "Маркетолог PPC",
      ndaText: null,
      successMessage:
        "Спасибо! Мы получили вашу заявку.\n\nРазберём ответы и свяжемся с вами в Telegram в течение 2–3 рабочих дней. Если всё ок — обсудим детали и следующие шаги.",
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
                  label: "Расскажите о своём опыте в performance-маркетинге",
                  description:
                    "С какими проектами и нишами работали, какие бюджеты вели и каких результатов добились (CPL, CPA, ROAS). Можно приложить ссылки на кейсы или скриншоты.",
                  type: "TEXTAREA",
                  required: true,
                  sortOrder: 0,
                  maxPoints: 0,
                },
                {
                  fieldKey: "englishLevel",
                  label: "Уровень английского языка",
                  description: "Продукт работает на рынке США — нужно понимать англоязычные рекламные кабинеты и аналитику.",
                  type: "RADIO",
                  required: true,
                  sortOrder: 1,
                  maxPoints: 0,
                  options: {
                    create: [
                      { value: "A1", label: "A1 — начальный", sortOrder: 0, points: 0 },
                      { value: "A2", label: "A2 — базовый", sortOrder: 1, points: 0 },
                      { value: "B1", label: "B1 — средний", sortOrder: 2, points: 0 },
                      { value: "B2", label: "B2 — выше среднего", sortOrder: 3, points: 0 },
                      { value: "C1C2", label: "C1 / C2 — свободно", sortOrder: 4, points: 0 },
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
                      { value: "strategy", label: "Разрабатывал(а) performance-стратегию в Meta Ads и Google Ads", sortOrder: 0, points: 0 },
                      { value: "campaigns", label: "Запускал(а), вёл(а) и оптимизировал(а) PPC-кампании", sortOrder: 1, points: 0 },
                      { value: "budget", label: "Управлял(а) бюджетом: снижал(а) стоимость лида, растил(а) ROAS", sortOrder: 2, points: 0 },
                      { value: "analytics", label: "Анализировал(а) результаты, тестировал(а) гипотезы и масштабировал(а) связки", sortOrder: 3, points: 0 },
                      { value: "webanalytics", label: "Работал(а) с веб-аналитикой (GA4, пиксели, атрибуция)", sortOrder: 4, points: 0 },
                      { value: "none", label: "Прямого опыта пока немного, но хорошо разбираюсь в теме", sortOrder: 5, points: 0 },
                    ],
                  },
                },
              ],
            },
          },

          // ─── Шаг 4: инфо-карточка + финальный вопрос ───
          {
            title: "Как будет устроена работа",
            sortOrder: 3,
            questions: {
              create: [
                {
                  fieldKey: "workOverview",
                  label: "Что входит в задачи",
                  description:
                    "PPC-маркетолог отвечает за платный трафик B2C fin-tech приложения для трекинга личных финансов (рынок США):\nразработка и ведение performance-стратегии в Meta Ads и Google Ads;\nзапуск, ведение и оптимизация PPC-кампаний;\nуправление бюджетом — снижение стоимости лида, рост конверсии и ROAS;\nанализ результатов, тестирование гипотез и масштабирование рабочих связок.\nФормат: part-time, удалённо, гибкий график, оформление ГПХ / самозанятый. Оплата — 50 000 ₽ на руки, тестовый период — 2 недели.",
                  type: "CONSENT",
                  required: false,
                  sortOrder: 0,
                  maxPoints: 0,
                },
                {
                  fieldKey: "availability",
                  label: "Формат part-time, удалённо, гибкий график. Подходит ли вам такой формат?",
                  type: "RADIO",
                  required: true,
                  sortOrder: 1,
                  maxPoints: 0,
                  options: {
                    create: [
                      { value: "yes", label: "Да, подходит", sortOrder: 0, points: 0 },
                      { value: "discuss", label: "В целом да, но хочу обсудить детали", sortOrder: 1, points: 0 },
                      { value: "no", label: "Нет, ищу другой формат", sortOrder: 2, points: 0 },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  });

  console.log(`Created Marketer PPC survey: ${survey.id} (slug: ${SLUG})`);
  console.log(`URL: /s/${SLUG}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
