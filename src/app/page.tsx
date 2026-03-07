"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, GraduationCap, Globe, Star, Users, CheckCircle } from "lucide-react";

const FEATURES = [
  { icon: Globe, label: "США, UK, Канада", sub: "и другие страны" },
  { icon: GraduationCap, label: "Бакалавриат и магистратура", sub: "все уровни" },
  { icon: Users, label: "Работа со студентами", sub: "1-на-1 формат" },
  { icon: Star, label: "Скоринг и отбор", sub: "прозрачный процесс" },
];

const STEPS = [
  "Заполните анкету (~15 минут)",
  "Выполните тестовое задание (кейс + эссе)",
  "Наша команда рассмотрит заявку",
  "Получите обратную связь в течение 5 дней",
];

export default function HomePage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleStart = () => {
    setLoading(true);
    router.push("/s/mentor");
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <div className="animated-bg">
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="blob blob-3" />
        <div className="blob blob-4" />
      </div>
      <div className="hero-ring hero-ring-1" />
      <div className="hero-ring hero-ring-2" />
      <div className="hero-ring hero-ring-3" />
      <div className="hero-dot hero-dot-1" />
      <div className="hero-dot hero-dot-2" />
      <div className="hero-dot hero-dot-3" />

      <div className="mx-auto max-w-2xl px-4 py-16 sm:py-24">
        <div className="mb-8 flex justify-center animate-fade-up" style={{ animationDelay: "0ms" }}>
          <span className="hero-badge">
            <GraduationCap className="h-3.5 w-3.5" />
            Global Generation · Отбор менторов
          </span>
        </div>

        <div className="mb-6 text-center animate-fade-up" style={{ animationDelay: "80ms" }}>
          <h1 className="text-4xl font-bold leading-tight text-slate-900 sm:text-5xl">
            Станьте ментором{" "}
            <span className="gradient-text">по поступлению</span>
            {" "}за рубеж
          </h1>
          <div className="hero-line mt-5 mb-5" />
          <p className="text-lg text-slate-500 leading-relaxed">
            Мы ищем экспертов в educational consulting, которые помогут студентам из СНГ поступить
            в лучшие университеты мира. Если у вас есть опыт — оставьте заявку.
          </p>
        </div>

        <div className="hero-stats mb-10 animate-fade-up" style={{ animationDelay: "160ms" }}>
          {FEATURES.map(({ icon: Icon, label, sub }) => (
            <div key={label} className="hero-stat">
              <div className="hero-stat-icon bg-blue-50/80">
                <Icon className="h-4 w-4 text-blue-500" />
              </div>
              <div>
                <div className="hero-stat-value">{label}</div>
                <div className="hero-stat-label">{sub}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="glass-card mb-8 p-6 animate-fade-up" style={{ animationDelay: "240ms" }}>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-400">
            Как устроен процесс
          </h2>
          <div className="space-y-3">
            {STEPS.map((step, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-50 text-xs font-semibold text-blue-600">
                  {i + 1}
                </div>
                <span className="text-sm text-slate-600 leading-relaxed">{step}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card mb-10 p-6 animate-fade-up" style={{ animationDelay: "320ms" }}>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-400">
            Кого мы ищем
          </h2>
          <div className="space-y-2.5">
            {[
              "Опыт в educational consulting или admissions counseling",
              "Знание требований зарубежных университетов",
              "Умение работать с эссе и личными историями студентов",
              "Свободное владение русским или английским языком",
              "Готовность уделять минимум 3 часа в неделю",
            ].map((req) => (
              <div key={req} className="flex items-start gap-2.5">
                <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                <span className="text-sm text-slate-600">{req}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center animate-fade-up" style={{ animationDelay: "400ms" }}>
          <button
            onClick={handleStart}
            disabled={loading}
            className="btn-cta-hero gap-3 disabled:opacity-70"
          >
            {loading ? (
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
            ) : (
              <ArrowRight className="h-5 w-5" />
            )}
            Подать заявку
          </button>
        </div>

        <p className="mt-4 text-center text-xs text-slate-400 animate-fade-up" style={{ animationDelay: "480ms" }}>
          Занимает около 15 минут · Данные конфиденциальны
        </p>
      </div>
    </div>
  );
}
