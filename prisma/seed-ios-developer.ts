import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding iOS Developer Survey...");

  const existing = await prisma.survey.findUnique({ where: { slug: "ios-developer" } });
  if (existing) {
    console.log("Deleting existing iOS developer survey...");
    await prisma.survey.delete({ where: { slug: "ios-developer" } });
  }

  const survey = await prisma.survey.create({
    data: {
      slug: "ios-developer",
      title: "iOS Developer — Global Generation",
      description: "Нативное мобильное приложение для SAT-платформы на AWS",
      status: "ACTIVE",
      heroTitle: "iOS Developer в команду Global Generation",
      ndaText: `Мы строим SAT-платформу с AI-тьютором, геймификацией и банком вопросов. Веб-версия уже в production на AWS App Runner. Теперь делаем нативное iOS-приложение.\n\nЭта анкета — не формальность. Нам важно твоё реальное мышление: как ты решаешь задачи, как работаешь с инфраструктурой, как думаешь об архитектуре.\n\nВся информация остаётся внутри команды.`,
      successMessage: "Спасибо! Мы внимательно изучим твою анкету и напишем в Telegram в течение 3–5 дней.",
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

          // ─── Page 1: О проекте ───
          {
            title: "О проекте",
            sortOrder: 0,
            questions: {
              create: [
                {
                  fieldKey: "info_what_we_build",
                  label: "Что мы строим",
                  description: `Product-SAT — платформа подготовки к экзамену SAT для поступления в зарубежные университеты.\n\nВ платформе уже есть:\n• Банк вопросов с изображениями (AWS S3)\n• Практические тесты с таймером\n• AI-тьютор на базе Claude (Anthropic)\n• Essay Game — тренажёр эссе с AI-скорингом\n• Персональный учебный план\n• Геймификация: XP, достижения, миссии, лиги\n• Подписки и платежи\n• Родительский дашборд`,
                  type: "INFO",
                  required: false,
                  sortOrder: 0,
                  maxPoints: 0,
                },
                {
                  fieldKey: "info_tech_stack",
                  label: "Технический стек",
                  description: `Backend: NestJS 11 + Prisma + PostgreSQL на Neon\nФронтенд (веб): Next.js 16 + React 19 + Tailwind CSS\nДеплой: AWS App Runner (уже в production)\nМедиа: AWS S3 + CloudFront\nAI: Anthropic Claude\nАутентификация: JWT + Google OAuth\nПлатежи: Prodamus\n\niOS-приложение подключается к готовому REST API — backend строить не нужно.`,
                  type: "INFO",
                  required: false,
                  sortOrder: 1,
                  maxPoints: 0,
                },
                {
                  fieldKey: "info_aws_ecosystem",
                  label: "Amazon-экосистема для iOS",
                  description: `iOS App (Swift/SwiftUI)\n    ├── AWS S3 + CloudFront   ← изображения вопросов\n    ├── AWS SNS + Pinpoint    ← push-уведомления\n    ├── AWS Cognito           ← Apple Sign-In\n    ├── AWS CloudWatch        ← логи и метрики\n    ├── AWS CodePipeline      ← CI/CD\n    └── AWS App Runner        ← NestJS API (уже в prod)\n              └── Neon PostgreSQL`,
                  type: "INFO",
                  required: false,
                  sortOrder: 2,
                  maxPoints: 0,
                },
                {
                  fieldKey: "name",
                  label: "Имя",
                  type: "TEXT",
                  required: true,
                  sortOrder: 3,
                  maxPoints: 0,
                },
                {
                  fieldKey: "telegramUsername",
                  label: "Telegram",
                  description: "Юзернейм начинается с @",
                  type: "TEXT",
                  required: true,
                  sortOrder: 4,
                  config: { prefix: "@" },
                  maxPoints: 0,
                },
                {
                  fieldKey: "github",
                  label: "GitHub / портфолио",
                  description: "Ссылка на профиль или репозитории",
                  type: "TEXT",
                  required: false,
                  sortOrder: 5,
                  maxPoints: 0,
                },
                {
                  fieldKey: "appStoreLinks",
                  label: "Твои приложения в App Store",
                  description: "Ссылки — если есть",
                  type: "TEXTAREA",
                  required: false,
                  sortOrder: 6,
                  maxPoints: 0,
                },
                {
                  fieldKey: "city",
                  label: "Город / часовой пояс",
                  type: "TEXT",
                  required: true,
                  sortOrder: 7,
                  maxPoints: 0,
                },
              ],
            },
          },

          // ─── Page 2: Обязанности и квалификации ───
          {
            title: "Обязанности и квалификации",
            sortOrder: 1,
            questions: {
              create: [
                {
                  fieldKey: "info_responsibilities",
                  label: "Что входит в работу",
                  description: `• Разработка нативного iOS-приложения (Swift / SwiftUI)\n• Интеграция с готовым NestJS REST API\n• Push-уведомления через AWS SNS / Pinpoint\n• In-App Purchase и подписки (StoreKit 2)\n• Apple Sign-In через AWS Cognito\n• AWS S3 + CloudFront для медиаконтента\n• CI/CD через AWS CodePipeline\n• Code review + тесты (XCTest / XCUITest)\n• Публикация и поддержка приложения в App Store`,
                  type: "INFO",
                  required: false,
                  sortOrder: 0,
                  maxPoints: 0,
                },
                {
                  fieldKey: "info_requirements",
                  label: "Что важно",
                  description: `Обязательно:\n• Коммерческий опыт iOS-разработки\n• Уверенный Swift (SwiftUI + UIKit)\n• REST API (URLSession / Alamofire)\n• Опыт с AWS (S3, SNS/Pinpoint, CloudWatch)\n• Публикация приложений в App Store\n• In-App Purchase (StoreKit 2)\n\nБудет плюсом:\n+ AWS Amplify / Cognito\n+ Опыт в EdTech\n+ KaTeX / LaTeX на iOS\n+ Lottie-анимации`,
                  type: "INFO",
                  required: false,
                  sortOrder: 1,
                  maxPoints: 0,
                },
                {
                  fieldKey: "swiftUIvsUIKit",
                  label: "SwiftUI или UIKit — что используешь и почему?",
                  description: "Расскажи честно: что предпочитаешь, в каких случаях выбираешь один над другим",
                  type: "TEXTAREA",
                  required: true,
                  sortOrder: 2,
                  scoringCategory: "swiftUIvsUIKit",
                  maxPoints: 15,
                  scoringRules: {
                    type: "textLength",
                    tiers: [
                      { min: 300, points: 15 },
                      { min: 150, points: 10 },
                      { min: 80, points: 5 },
                      { min: 30, points: 2 },
                    ],
                  },
                },
                {
                  fieldKey: "architectureApproach",
                  label: "Какую архитектуру ты используешь в iOS-проектах?",
                  description: "MVVM, TCA, VIPER — что и когда? Приведи пример из реального проекта",
                  type: "TEXTAREA",
                  required: true,
                  sortOrder: 3,
                  scoringCategory: "architectureApproach",
                  maxPoints: 15,
                  scoringRules: {
                    type: "textLength",
                    tiers: [
                      { min: 300, points: 15 },
                      { min: 150, points: 10 },
                      { min: 80, points: 5 },
                      { min: 30, points: 2 },
                    ],
                  },
                },
                {
                  fieldKey: "appStorePublished",
                  label: "Ты самостоятельно публиковал(а) приложения в App Store?",
                  type: "RADIO",
                  required: true,
                  sortOrder: 4,
                  scoringCategory: "appStorePublished",
                  maxPoints: 10,
                  options: {
                    create: [
                      { value: "yes_multiple", label: "Да, несколько приложений", sortOrder: 0, points: 10 },
                      { value: "yes_one", label: "Да, одно приложение", sortOrder: 1, points: 7 },
                      { value: "helped", label: "Участвовал(а), но не самостоятельно", sortOrder: 2, points: 4 },
                      { value: "no", label: "Нет, не публиковал(а)", sortOrder: 3, points: 0 },
                    ],
                  },
                },
                {
                  fieldKey: "awsExperience",
                  label: "Работал(а) ли ты с AWS? Какими сервисами?",
                  description: "S3, SNS, Pinpoint, Cognito, CloudWatch — что использовал(а) и для чего",
                  type: "TEXTAREA",
                  required: true,
                  sortOrder: 5,
                  scoringCategory: "awsExperience",
                  maxPoints: 15,
                  scoringRules: {
                    type: "textLength",
                    tiers: [
                      { min: 300, points: 15 },
                      { min: 150, points: 10 },
                      { min: 80, points: 5 },
                      { min: 20, points: 2 },
                    ],
                  },
                },
                {
                  fieldKey: "iap",
                  label: "Опыт с In-App Purchase / подписками",
                  type: "RADIO",
                  required: true,
                  sortOrder: 6,
                  scoringCategory: "iap",
                  maxPoints: 10,
                  options: {
                    create: [
                      { value: "storekit2_production", label: "StoreKit 2, выпускал(а) в production", sortOrder: 0, points: 10 },
                      { value: "storekit1_production", label: "StoreKit 1, выпускал(а) в production", sortOrder: 1, points: 7 },
                      { value: "tested_only", label: "Реализовывал(а), но до production не доходило", sortOrder: 2, points: 4 },
                      { value: "no", label: "Не работал(а) с IAP", sortOrder: 3, points: 0 },
                    ],
                  },
                },
              ],
            },
          },

          // ─── Page 3: Тестовое задание ───
          {
            title: "Тестовое задание",
            sortOrder: 2,
            questions: {
              create: [
                {
                  fieldKey: "info_test_context",
                  label: "Контекст",
                  description: `Backend уже работает в production. Тебе не нужно его строить — нужно подключиться из iOS.\n\nAPI: https://api.gg-sat.com/api\nАутентификация: Bearer JWT в заголовке Authorization`,
                  type: "INFO",
                  required: false,
                  sortOrder: 0,
                  maxPoints: 0,
                },
                {
                  fieldKey: "taskQuestionBank",
                  label: "Задание 1: экран «Банк вопросов»",
                  description: `Тебе дан API:\nGET /api/questions?section=math&limit=10\n\nОтвет:\n[\n  {\n    "id": "q1",\n    "text": "If 2x + 3 = 11, what is x?",\n    "imageUrl": "https://cdn.../img.png",\n    "options": ["2", "3", "4", "5"],\n    "correctIndex": 2\n  }\n]\n\nОпиши как бы ты построил этот экран в SwiftUI:\n— структура данных (модели)\n— сетевой слой\n— UI-компоненты\n— как обработаешь изображение из S3`,
                  type: "TEXTAREA",
                  required: true,
                  sortOrder: 1,
                  scoringCategory: "taskQuestionBank",
                  maxPoints: 20,
                  scoringRules: {
                    type: "textLength",
                    tiers: [
                      { min: 600, points: 20 },
                      { min: 300, points: 13 },
                      { min: 150, points: 7 },
                      { min: 50, points: 2 },
                    ],
                  },
                },
                {
                  fieldKey: "taskPushAWS",
                  label: "Задание 2: push-уведомление через AWS",
                  description: `Нужно отправлять пуш «Не забудь про ежедневную миссию» каждый день в 19:00 по времени пользователя.\n\nBackend — NestJS на AWS App Runner.\n\nОпиши:\n— какие AWS-сервисы использовать\n— как зарегистрировать устройство на стороне iOS\n— как настроить расписание\n— что нужно сделать в NestJS`,
                  type: "TEXTAREA",
                  required: true,
                  sortOrder: 2,
                  scoringCategory: "taskPushAWS",
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
              ],
            },
          },

          // ─── Page 4: Онбординг + финал ───
          {
            title: "Последний шаг",
            sortOrder: 3,
            questions: {
              create: [
                {
                  fieldKey: "info_onboarding",
                  label: "Как выглядит онбординг",
                  description: `1. Получаешь доступы: GitHub, AWS console (read-only), Notion\n2. Изучаешь проект: README, поднимаешь backend локально, проходишь веб-платформу как студент\n3. Созвон с командой: обзор архитектуры, вопросы\n4. Изучаешь API через Swagger / Postman\n5. Настраиваешь Xcode, делаешь Auth (login + JWT в Keychain)\n6. Первый PR — Dashboard с данными из API, code review\n7. Далее по roadmap: банк вопросов, тесты, push, TestFlight`,
                  type: "INFO",
                  required: false,
                  sortOrder: 0,
                  maxPoints: 0,
                },
                {
                  fieldKey: "workFormat",
                  label: "Предпочтительный формат работы",
                  type: "RADIO",
                  required: true,
                  sortOrder: 1,
                  maxPoints: 0,
                  options: {
                    create: [
                      { value: "fulltime", label: "Full-time", sortOrder: 0, points: 0 },
                      { value: "parttime", label: "Part-time", sortOrder: 1, points: 0 },
                      { value: "project", label: "Project-based", sortOrder: 2, points: 0 },
                      { value: "flexible", label: "Гибко, готов(а) обсудить", sortOrder: 3, points: 0 },
                    ],
                  },
                },
                {
                  fieldKey: "startDate",
                  label: "Когда готов(а) начать?",
                  type: "TEXT",
                  required: true,
                  sortOrder: 2,
                  maxPoints: 0,
                },
                {
                  fieldKey: "rate",
                  label: "Ожидаемая ставка",
                  description: "$/мес или $/час",
                  type: "TEXT",
                  required: false,
                  sortOrder: 3,
                  maxPoints: 0,
                },
                {
                  fieldKey: "whyGG",
                  label: "Почему Global Generation?",
                  description: "Что привлекает в этом проекте",
                  type: "TEXTAREA",
                  required: true,
                  sortOrder: 4,
                  maxPoints: 0,
                },
                {
                  fieldKey: "consentData",
                  label: "Я согласен(на) на обработку персональных данных",
                  description: "Данные используются только командой Global Generation",
                  type: "CONSENT",
                  required: true,
                  sortOrder: 5,
                  maxPoints: 0,
                },
              ],
            },
          },

        ],
      },
    },
  });

  console.log(`✅ Created iOS Developer survey: ${survey.id}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
