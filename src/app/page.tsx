"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, GraduationCap, CheckCircle } from "lucide-react";

const WHAT_WE_CARE = [
  "Реальные кейсы — сложные, нестандартные, честные",
  "Скилл в документах, ресёрче и AI-инструментах",
  "Умение вести консультации, а не просто давать советы",
  "Твоё собственное поступление и бэкграунд",
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
      <div className="hero-dot hero-dot-1" />
      <div className="hero-dot hero-dot-2" />

      <div className="mx-auto max-w-xl px-4 py-16 sm:py-24">
        <div className="mb-8 flex justify-center animate-fade-up" style={{ animationDelay: "0ms" }}>
          <span className="hero-badge">
            <GraduationCap className="h-3.5 w-3.5" />
            Global Generation · Отбор менторов
          </span>
        </div>

        <div className="mb-8 text-center animate-fade-up" style={{ animationDelay: "80ms" }}>
          <h1 className="text-4xl font-bold leading-tight text-slate-900 sm:text-5xl">
            Стать ментором{" "}
            <span className="gradient-text">GG</span>
          </h1>
          <div className="hero-line mt-5 mb-6" />
          <p className="text-lg text-slate-500 leading-relaxed">
            Мы ищем людей, которые умеют реально работать со студентами и документами.
            Нас таких 10 в год — и каждый на счету.
          </p>
        </div>

        <div className="glass-card mb-8 p-6 animate-fade-up" style={{ animationDelay: "160ms" }}>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-400">
            Что нас волнует
          </h2>
          <div className="space-y-3">
            {WHAT_WE_CARE.map((item) => (
              <div key={item} className="flex items-start gap-3">
                <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" />
                <span className="text-sm text-slate-700">{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card mb-10 p-6 animate-fade-up" style={{ animationDelay: "240ms" }}>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-400">
            Как устроена анкета
          </h2>
          <p className="text-sm text-slate-500 leading-relaxed">
            Это не стандартная форма с галочками. Мы попросим тебя рассказать о реальных кейсах,
            показать как ты думаешь, и выполнить одно тестовое задание.
            Занимает около 20–30 минут.
          </p>
        </div>

        <div className="flex justify-center animate-fade-up" style={{ animationDelay: "320ms" }}>
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
            Заполнить анкету
          </button>
        </div>

        <p className="mt-4 text-center text-xs text-slate-400 animate-fade-up" style={{ animationDelay: "400ms" }}>
          ~20–30 минут · Конфиденциально
        </p>
      </div>
    </div>
  );
}
