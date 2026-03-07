import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding Mentor Survey...");

  const existing = await prisma.survey.findUnique({ where: { slug: "mentor" } });
  if (existing) {
    console.log("Mentor survey already exists, skipping.");
    return;
  }

  const survey = await prisma.survey.create({
    data: {
      slug: "mentor",
      title: "Отбор менторов — Educational Consulting",
      description: "Анкета для кандидатов на роль ментора по поступлению в зарубежные университеты",
      status: "ACTIVE",
      heroTitle: "Станьте ментором Global Generation",
      ndaText: `Данная анкета предназначена исключительно для отбора менторов.\n\nВся информация, которую вы предоставляете, является конфиденциальной и будет использована только командой Global Generation в целях оценки кандидатов.\n\nПожалуйста, отвечайте честно — это поможет нам найти идеальное совпадение.`,
      successMessage: "Спасибо за отправку анкеты! Наша команда рассмотрит вашу заявку и свяжется с вами в Telegram в течение 3–5 рабочих дней.",
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
          // ─── Page 1: О себе ───
          {
            title: "О себе",
            sortOrder: 0,
            questions: {
              create: [
                {
                  fieldKey: "name",
                  label: "Полное имя",
                  type: "TEXT",
                  required: true,
                  sortOrder: 0,
                  maxPoints: 0,
                },
                {
                  fieldKey: "telegramUsername",
                  label: "Telegram",
                  description: "Ваш юзернейм в Telegram (начинается с @)",
                  type: "TEXT",
                  required: true,
                  sortOrder: 1,
                  config: { prefix: "@" },
                  maxPoints: 0,
                },
                {
                  fieldKey: "email",
                  label: "Email",
                  type: "TEXT",
                  required: true,
                  sortOrder: 2,
                  config: { inputType: "email" },
                  maxPoints: 0,
                },
                {
                  fieldKey: "city",
                  label: "Город и страна проживания",
                  type: "TEXT",
                  required: true,
                  sortOrder: 3,
                  maxPoints: 0,
                },
                {
                  fieldKey: "linkedinUrl",
                  label: "Ссылка на LinkedIn (необязательно)",
                  description: "Если есть, вставьте ссылку на ваш профиль",
                  type: "TEXT",
                  required: false,
                  sortOrder: 4,
                  maxPoints: 0,
                },
              ],
            },
          },

          // ─── Page 2: Профессиональный опыт ───
          {
            title: "Профессиональный опыт",
            sortOrder: 1,
            questions: {
              create: [
                {
                  fieldKey: "yearsExperience",
                  label: "Сколько лет вы занимаетесь educational consulting?",
                  type: "RADIO",
                  required: true,
                  sortOrder: 0,
                  scoringCategory: "yearsExperience",
                  maxPoints: 20,
                  options: {
                    create: [
                      { value: "less_than_1", label: "Менее 1 года", sortOrder: 0, points: 4 },
                      { value: "1_to_2", label: "1–2 года", sortOrder: 1, points: 10 },
                      { value: "3_to_5", label: "3–5 лет", sortOrder: 2, points: 16 },
                      { value: "5_to_10", label: "5–10 лет", sortOrder: 3, points: 20 },
                      { value: "more_than_10", label: "Более 10 лет", sortOrder: 4, points: 20 },
                    ],
                  },
                },
                {
                  fieldKey: "studentsHelped",
                  label: "Сколько студентов вы успешно помогли поступить?",
                  type: "RADIO",
                  required: true,
                  sortOrder: 1,
                  scoringCategory: "studentsHelped",
                  maxPoints: 20,
                  options: {
                    create: [
                      { value: "0", label: "Ещё не помогал(а), но есть экспертиза", sortOrder: 0, points: 5 },
                      { value: "1_to_5", label: "1–5 студентов", sortOrder: 1, points: 10 },
                      { value: "6_to_20", label: "6–20 студентов", sortOrder: 2, points: 16 },
                      { value: "21_to_50", label: "21–50 студентов", sortOrder: 3, points: 20 },
                      { value: "more_than_50", label: "Более 50 студентов", sortOrder: 4, points: 20 },
                    ],
                  },
                },
                {
                  fieldKey: "targetCountries",
                  label: "В какие страны вы помогаете поступать?",
                  description: "Выберите все подходящие варианты",
                  type: "CHIP_SELECT",
                  required: true,
                  sortOrder: 2,
                  scoringCategory: "targetCountries",
                  maxPoints: 10,
                  scoringRules: {
                    type: "count",
                    tiers: [
                      { min: 4, points: 10 },
                      { min: 3, points: 8 },
                      { min: 2, points: 6 },
                      { min: 1, points: 4 },
                    ],
                  },
                  options: {
                    create: [
                      { value: "usa", label: "США", sortOrder: 0, points: 0 },
                      { value: "uk", label: "Великобритания", sortOrder: 1, points: 0 },
                      { value: "canada", label: "Канада", sortOrder: 2, points: 0 },
                      { value: "europe", label: "Европа", sortOrder: 3, points: 0 },
                      { value: "australia", label: "Австралия", sortOrder: 4, points: 0 },
                      { value: "asia", label: "Азия (NUS, NTU и др.)", sortOrder: 5, points: 0 },
                      { value: "other", label: "Другие страны", sortOrder: 6, points: 0 },
                    ],
                  },
                },
                {
                  fieldKey: "educationLevel",
                  label: "На какой уровень образования вы специализируетесь?",
                  type: "CHIP_SELECT",
                  required: true,
                  sortOrder: 3,
                  maxPoints: 0,
                  options: {
                    create: [
                      { value: "undergrad", label: "Бакалавриат", sortOrder: 0, points: 0 },
                      { value: "masters", label: "Магистратура", sortOrder: 1, points: 0 },
                      { value: "mba", label: "MBA", sortOrder: 2, points: 0 },
                      { value: "phd", label: "PhD", sortOrder: 3, points: 0 },
                      { value: "all", label: "Все уровни", sortOrder: 4, points: 0 },
                    ],
                  },
                },
                {
                  fieldKey: "previousRole",
                  label: "Ваша текущая / предыдущая роль",
                  type: "CHIP_SELECT",
                  required: true,
                  sortOrder: 4,
                  maxPoints: 0,
                  options: {
                    create: [
                      { value: "independent_consultant", label: "Независимый консультант", sortOrder: 0, points: 0 },
                      { value: "agency", label: "Сотрудник агентства", sortOrder: 1, points: 0 },
                      { value: "school_counselor", label: "Школьный советник (counselor)", sortOrder: 2, points: 0 },
                      { value: "admissions_officer", label: "Admissions Officer в университете", sortOrder: 3, points: 0 },
                      { value: "alumni", label: "Выпускник целевого университета", sortOrder: 4, points: 0 },
                      { value: "other", label: "Другое", sortOrder: 5, points: 0 },
                    ],
                  },
                },
              ],
            },
          },

          // ─── Page 3: Экспертиза ───
          {
            title: "Экспертиза",
            sortOrder: 2,
            questions: {
              create: [
                {
                  fieldKey: "topUniversities",
                  label: "Перечислите 5–10 университетов, в которые вы чаще всего помогали поступить",
                  description: "Например: MIT, Harvard, Oxford, Toronto, NUS…",
                  type: "TEXTAREA",
                  required: true,
                  sortOrder: 0,
                  maxPoints: 0,
                },
                {
                  fieldKey: "hasScholarshipExperience",
                  label: "Есть ли у вас опыт помощи с финансовой поддержкой и стипендиями?",
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
                  fieldKey: "languages",
                  label: "На каких языках вы можете вести менторство?",
                  type: "CHIP_SELECT",
                  required: true,
                  sortOrder: 2,
                  maxPoints: 0,
                  options: {
                    create: [
                      { value: "russian", label: "Русский", sortOrder: 0, points: 0 },
                      { value: "english", label: "Английский", sortOrder: 1, points: 0 },
                      { value: "kazakh", label: "Казахский", sortOrder: 2, points: 0 },
                      { value: "other", label: "Другой", sortOrder: 3, points: 0 },
                    ],
                  },
                },
                {
                  fieldKey: "keyStrengths",
                  label: "Опишите ваши ключевые сильные стороны как консультанта",
                  description: "Что отличает вас от других? (минимум 150 символов)",
                  type: "TEXTAREA",
                  required: true,
                  sortOrder: 3,
                  scoringCategory: "keyStrengths",
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
              ],
            },
          },

          // ─── Page 4: Методология ───
          {
            title: "Ваш подход",
            sortOrder: 3,
            questions: {
              create: [
                {
                  fieldKey: "approachDescription",
                  label: "Как вы выстраиваете работу с новым студентом с самого начала?",
                  description: "Опишите ваш процесс: от первой встречи до подачи заявок (минимум 200 символов)",
                  type: "TEXTAREA",
                  required: true,
                  sortOrder: 0,
                  scoringCategory: "approachDescription",
                  maxPoints: 10,
                  scoringRules: {
                    type: "textLength",
                    tiers: [
                      { min: 400, points: 10 },
                      { min: 200, points: 7 },
                      { min: 100, points: 4 },
                      { min: 50, points: 2 },
                    ],
                  },
                },
                {
                  fieldKey: "essayMethod",
                  label: "Как вы помогаете студенту с написанием эссе?",
                  description: "Расскажите о вашем подходе к Personal Statement и другим эссе (минимум 150 символов)",
                  type: "TEXTAREA",
                  required: true,
                  sortOrder: 1,
                  scoringCategory: "essayMethod",
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
                  fieldKey: "whyMentor",
                  label: "Почему вы хотите стать ментором Global Generation?",
                  description: "Расскажите о вашей мотивации (минимум 100 символов)",
                  type: "TEXTAREA",
                  required: true,
                  sortOrder: 2,
                  maxPoints: 0,
                },
              ],
            },
          },

          // ─── Page 5: Тестовое задание ───
          {
            title: "Тестовое задание",
            sortOrder: 4,
            questions: {
              create: [
                {
                  fieldKey: "caseStrategy",
                  label: "Кейс: составьте стратегию поступления",
                  description: `Студент: Амира, 17 лет, Казахстан. GPA: 3.9/4.0, SAT: 1420, сильные внеклассные активности (олимпиады, волонтёрство). Цель: Computer Science в топ-30 университет США. Бюджет семьи: ~$20,000/год (нужна финансовая помощь).\n\nЗадание: составьте конкретную стратегию поступления — список из 8–10 университетов (reach / match / safety), план по эссе, ключевые дедлайны и рекомендации по финансовой помощи. Минимум 400 символов.`,
                  type: "TEXTAREA",
                  required: true,
                  sortOrder: 0,
                  scoringCategory: "caseStrategy",
                  maxPoints: 15,
                  scoringRules: {
                    type: "textLength",
                    tiers: [
                      { min: 800, points: 15 },
                      { min: 400, points: 10 },
                      { min: 200, points: 6 },
                      { min: 100, points: 3 },
                    ],
                  },
                },
                {
                  fieldKey: "essayFeedback",
                  label: "Дайте обратную связь на фрагмент эссе",
                  description: `Фрагмент Personal Statement Амиры:\n\n«Когда мне было 14 лет, я впервые попала на олимпиаду по математике и заняла последнее место. Тогда я решила, что математика — не для меня. Но мой учитель сказал: "Ты не проиграла — ты узнала, что нужно учить дальше." Это изменило всё.»\n\nЗадание: напишите конкретную обратную связь — что работает, что нужно улучшить и как. Минимум 200 символов.`,
                  type: "TEXTAREA",
                  required: true,
                  sortOrder: 1,
                  scoringCategory: "essayFeedback",
                  maxPoints: 15,
                  scoringRules: {
                    type: "textLength",
                    tiers: [
                      { min: 500, points: 15 },
                      { min: 200, points: 10 },
                      { min: 100, points: 6 },
                      { min: 50, points: 3 },
                    ],
                  },
                },
              ],
            },
          },

          // ─── Page 6: Доступность и согласие ───
          {
            title: "Финальный шаг",
            sortOrder: 5,
            questions: {
              create: [
                {
                  fieldKey: "availableHoursPerWeek",
                  label: "Сколько часов в неделю вы готовы уделять менторству?",
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
                  fieldKey: "referralSource",
                  label: "Как вы узнали о Global Generation?",
                  type: "RADIO",
                  required: false,
                  sortOrder: 1,
                  config: { layout: "grid" },
                  maxPoints: 0,
                  options: {
                    create: [
                      { value: "telegram", label: "Telegram", sortOrder: 0, points: 0 },
                      { value: "linkedin", label: "LinkedIn", sortOrder: 1, points: 0 },
                      { value: "friend", label: "От знакомого", sortOrder: 2, points: 0 },
                      { value: "social_media", label: "Соцсети", sortOrder: 3, points: 0 },
                      { value: "other", label: "Другое", sortOrder: 4, points: 0 },
                    ],
                  },
                },
                {
                  fieldKey: "consentData",
                  label: "Я согласен(на) на обработку персональных данных",
                  description: "Ваши данные будут использованы только командой Global Generation для оценки кандидатуры",
                  type: "CONSENT",
                  required: true,
                  sortOrder: 2,
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
