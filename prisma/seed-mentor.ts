import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding Mentor Survey...");

  const existing = await prisma.survey.findUnique({ where: { slug: "mentor" } });
  if (existing) {
    console.log("Deleting existing mentor survey...");
    await prisma.survey.delete({ where: { slug: "mentor" } });
  }

  const survey = await prisma.survey.create({
    data: {
      slug: "mentor",
      title: "Стать ментором — Global Generation",
      description: "Отбор менторов по поступлению в зарубежные университеты",
      status: "ACTIVE",
      heroTitle: "Стать ментором Global Generation",
      ndaText: `Эта анкета — не формальность.\n\nМы ищем людей, которые реально умеют работать со студентами и документами. Здесь нет правильных или неправильных ответов — нас интересует твой реальный опыт и мышление.\n\nВся информация остаётся внутри команды.`,
      successMessage: "Спасибо! Мы внимательно прочитаем твою анкету и напишем в Telegram в течение 3–5 дней.",
      maxScore: 100,
      dedupFieldKey: "telegramUsername",
      scoreTiers: [
        { label: "Топ-кандидат", min: 80 },
        { label: "Сильный кандидат", min: 60 },
        { label: "Перспективный", min: 40 },
        { label: "На рассмотрении", min: 0 },
      ],
      pages: {
        create: [
          // ─── Page 1: Кто ты ───
          {
            title: "Кто ты",
            sortOrder: 0,
            questions: {
              create: [
                {
                  fieldKey: "name",
                  label: "Имя",
                  type: "TEXT",
                  required: true,
                  sortOrder: 0,
                  maxPoints: 0,
                },
                {
                  fieldKey: "telegramUsername",
                  label: "Telegram",
                  description: "Юзернейм начинается с @",
                  type: "TEXT",
                  required: true,
                  sortOrder: 1,
                  config: { prefix: "@" },
                  maxPoints: 0,
                },
                {
                  fieldKey: "ownBackground",
                  label: "Где и на кого ты учился(ась)?",
                  description: "Университет, страна, специальность — и как ты туда поступал(а)",
                  type: "TEXTAREA",
                  required: true,
                  sortOrder: 2,
                  maxPoints: 0,
                },
                {
                  fieldKey: "yearsExperience",
                  label: "Сколько лет ты в educational consulting?",
                  type: "RADIO",
                  required: true,
                  sortOrder: 3,
                  scoringCategory: "yearsExperience",
                  maxPoints: 10,
                  options: {
                    create: [
                      { value: "less_than_1", label: "Менее 1 года", sortOrder: 0, points: 3 },
                      { value: "1_to_2", label: "1–2 года", sortOrder: 1, points: 6 },
                      { value: "3_to_5", label: "3–5 лет", sortOrder: 2, points: 9 },
                      { value: "more_than_5", label: "Более 5 лет", sortOrder: 3, points: 10 },
                    ],
                  },
                },
              ],
            },
          },

          // ─── Page 2: Твои кейсы ───
          {
            title: "Твои кейсы",
            sortOrder: 1,
            questions: {
              create: [
                {
                  fieldKey: "hardestCase",
                  label: "Расскажи о самом сложном кейсе поступления, с которым ты работал(а)",
                  description: "Что делало его сложным? Что ты сделал(а)? Чем закончилось?",
                  type: "TEXTAREA",
                  required: true,
                  sortOrder: 0,
                  scoringCategory: "hardestCase",
                  maxPoints: 20,
                  scoringRules: {
                    type: "textLength",
                    tiers: [
                      { min: 600, points: 20 },
                      { min: 300, points: 14 },
                      { min: 150, points: 8 },
                      { min: 50, points: 3 },
                    ],
                  },
                },
                {
                  fieldKey: "proudestCase",
                  label: "Какой студент тебя больше всего гордит? Почему?",
                  description: "Конкретная история: бэкграунд студента, что вы делали вместе, результат",
                  type: "TEXTAREA",
                  required: true,
                  sortOrder: 1,
                  scoringCategory: "proudestCase",
                  maxPoints: 15,
                  scoringRules: {
                    type: "textLength",
                    tiers: [
                      { min: 500, points: 15 },
                      { min: 250, points: 10 },
                      { min: 100, points: 5 },
                      { min: 50, points: 2 },
                    ],
                  },
                },
                {
                  fieldKey: "failedCase",
                  label: "Был ли случай, когда студент не поступил туда, куда планировал? Что пошло не так?",
                  description: "Нас интересует твой честный разбор — что ты бы сделал(а) иначе",
                  type: "TEXTAREA",
                  required: true,
                  sortOrder: 2,
                  scoringCategory: "failedCase",
                  maxPoints: 10,
                  scoringRules: {
                    type: "textLength",
                    tiers: [
                      { min: 300, points: 10 },
                      { min: 150, points: 7 },
                      { min: 80, points: 4 },
                      { min: 30, points: 1 },
                    ],
                  },
                },
              ],
            },
          },

          // ─── Page 3: Скилл в доках / ресёрче / AI ───
          {
            title: "Документы, ресёрч, AI",
            sortOrder: 2,
            questions: {
              create: [
                {
                  fieldKey: "essayProcess",
                  label: "Покажи свой процесс работы с эссе",
                  description: "Не теорию — конкретный процесс: что ты делаешь от первого разговора до финальной версии Personal Statement",
                  type: "TEXTAREA",
                  required: true,
                  sortOrder: 0,
                  scoringCategory: "essayProcess",
                  maxPoints: 15,
                  scoringRules: {
                    type: "textLength",
                    tiers: [
                      { min: 500, points: 15 },
                      { min: 250, points: 10 },
                      { min: 100, points: 5 },
                      { min: 50, points: 2 },
                    ],
                  },
                },
                {
                  fieldKey: "researchMethod",
                  label: "Как ты подбираешь список университетов под конкретного студента?",
                  description: "Какие источники, инструменты, логика — reach / match / safety",
                  type: "TEXTAREA",
                  required: true,
                  sortOrder: 1,
                  scoringCategory: "researchMethod",
                  maxPoints: 10,
                  scoringRules: {
                    type: "textLength",
                    tiers: [
                      { min: 300, points: 10 },
                      { min: 150, points: 7 },
                      { min: 80, points: 4 },
                      { min: 30, points: 2 },
                    ],
                  },
                },
                {
                  fieldKey: "aiTools",
                  label: "Используешь ли AI в работе? Как именно?",
                  description: "Конкретные инструменты и как ты их применяешь в работе со студентами",
                  type: "TEXTAREA",
                  required: true,
                  sortOrder: 2,
                  maxPoints: 0,
                },
              ],
            },
          },

          // ─── Page 4: Нестандартные кейсы ───
          {
            title: "Нестандартные кейсы",
            sortOrder: 3,
            questions: {
              create: [
                {
                  fieldKey: "nonStandardCase",
                  label: "Расскажи о кейсе, который выходил за рамки обычного",
                  description: "Например: gap year, смена профиля, слабые оценки, нестандартный бэкграунд, сложная личная ситуация — как ты с этим работал(а)?",
                  type: "TEXTAREA",
                  required: true,
                  sortOrder: 0,
                  scoringCategory: "nonStandardCase",
                  maxPoints: 10,
                  scoringRules: {
                    type: "textLength",
                    tiers: [
                      { min: 400, points: 10 },
                      { min: 200, points: 7 },
                      { min: 100, points: 4 },
                      { min: 50, points: 1 },
                    ],
                  },
                },
                {
                  fieldKey: "weakProfileStrategy",
                  label: "Как ты работаешь с \"проблемными\" частями профиля студента?",
                  description: "Низкий GPA, пробел в активностях, неудачный опыт — твоя стратегия",
                  type: "TEXTAREA",
                  required: true,
                  sortOrder: 1,
                  maxPoints: 0,
                },
              ],
            },
          },

          // ─── Page 5: Консультации ───
          {
            title: "Как ты консультируешь",
            sortOrder: 4,
            questions: {
              create: [
                {
                  fieldKey: "sessionStructure",
                  label: "Как выглядит твоя типичная сессия со студентом?",
                  description: "Структура, длительность, что ты делаешь, что оставляешь студенту",
                  type: "TEXTAREA",
                  required: true,
                  sortOrder: 0,
                  scoringCategory: "sessionStructure",
                  maxPoints: 10,
                  scoringRules: {
                    type: "textLength",
                    tiers: [
                      { min: 300, points: 10 },
                      { min: 150, points: 7 },
                      { min: 80, points: 4 },
                      { min: 30, points: 1 },
                    ],
                  },
                },
                {
                  fieldKey: "maxStudents",
                  label: "Сколько студентов ты можешь вести одновременно?",
                  type: "RADIO",
                  required: true,
                  sortOrder: 1,
                  maxPoints: 0,
                  options: {
                    create: [
                      { value: "1_to_3", label: "1–3", sortOrder: 0, points: 0 },
                      { value: "3_to_5", label: "3–5", sortOrder: 1, points: 0 },
                      { value: "5_to_10", label: "5–10", sortOrder: 2, points: 0 },
                      { value: "more_than_10", label: "Более 10", sortOrder: 3, points: 0 },
                    ],
                  },
                },
                {
                  fieldKey: "whyGG",
                  label: "Почему Global Generation? Что тебя привлекает?",
                  type: "TEXTAREA",
                  required: true,
                  sortOrder: 2,
                  maxPoints: 0,
                },
              ],
            },
          },

          // ─── Page 6: Тестовое задание ───
          {
            title: "Тестовое задание",
            sortOrder: 5,
            questions: {
              create: [
                {
                  fieldKey: "caseStrategy",
                  label: "Кейс: составь стратегию поступления",
                  description: `Студентка Амира, 17 лет, Казахстан.\n\n• GPA: 3.9/4.0\n• SAT: 1420\n• Активности: победитель олимпиад по математике, волонтёрство в НКО, нет формального опыта в IT\n• Цель: Computer Science, топ-30 США\n• Бюджет семьи: ~$20,000/год — нужна финансовая помощь\n\nЧто ты сделаешь? Напиши конкретно: список университетов (reach / match / safety), твои рекомендации по эссе, что делать с отсутствием IT-опыта, как подойти к финансовой помощи.`,
                  type: "TEXTAREA",
                  required: true,
                  sortOrder: 0,
                  scoringCategory: "caseStrategy",
                  maxPoints: 10,
                  scoringRules: {
                    type: "textLength",
                    tiers: [
                      { min: 800, points: 10 },
                      { min: 400, points: 7 },
                      { min: 200, points: 4 },
                      { min: 100, points: 1 },
                    ],
                  },
                },
                {
                  fieldKey: "essayFeedback",
                  label: "Дай фидбек на этот фрагмент эссе",
                  description: `Фрагмент Personal Statement Амиры:\n\n«Когда мне было 14 лет, я впервые попала на олимпиаду по математике и заняла последнее место. Тогда я решила, что математика — не для меня. Но мой учитель сказал: "Ты не проиграла — ты узнала, что нужно учить дальше." Это изменило всё.»\n\nНапиши конкретный фидбек: что работает, что нет, как улучшить.`,
                  type: "TEXTAREA",
                  required: true,
                  sortOrder: 1,
                  scoringCategory: "essayFeedback",
                  maxPoints: 0,
                },
              ],
            },
          },

          // ─── Page 7: Финал ───
          {
            title: "Последний шаг",
            sortOrder: 6,
            questions: {
              create: [
                {
                  fieldKey: "availableHours",
                  label: "Сколько часов в неделю ты готов(а) уделять менторству?",
                  type: "RADIO",
                  required: true,
                  sortOrder: 0,
                  maxPoints: 0,
                  options: {
                    create: [
                      { value: "1_to_3", label: "1–3 часа", sortOrder: 0, points: 0 },
                      { value: "3_to_5", label: "3–5 часов", sortOrder: 1, points: 0 },
                      { value: "5_to_10", label: "5–10 часов", sortOrder: 2, points: 0 },
                      { value: "more_than_10", label: "Более 10 часов", sortOrder: 3, points: 0 },
                    ],
                  },
                },
                {
                  fieldKey: "consentData",
                  label: "Я согласен(на) на обработку персональных данных",
                  description: "Данные используются только командой Global Generation",
                  type: "CONSENT",
                  required: true,
                  sortOrder: 1,
                  maxPoints: 0,
                },
              ],
            },
          },
        ],
      },
    },
  });

  console.log(`✅ Created Mentor survey: ${survey.id}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
