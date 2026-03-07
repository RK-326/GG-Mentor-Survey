"use client";

import { useState } from "react";
import {
  Send,
  Loader2,
  CheckCircle2,
  Link2,
  MessageCircle,
  Film,
  Palette,
  Sparkles,
  Plus,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Clock,
  Zap,
  Eye,
  Clapperboard,
  MousePointerClick,
} from "lucide-react";

/* ── Types ── */
type Reference = { url: string; explanation: string };
type ReelIdea = { hook: string; scenario: string; visual: string; cta: string };

type FormState = {
  name: string;
  telegram: string;
  references: Reference[];
  reelsIdeas: ReelIdea[];
  moodboardUrl: string;
};

const EMPTY_REF: Reference = { url: "", explanation: "" };
const EMPTY_REEL: ReelIdea = { hook: "", scenario: "", visual: "", cta: "" };

const INITIAL: FormState = {
  name: "",
  telegram: "",
  references: [
    { ...EMPTY_REF },
    { ...EMPTY_REF },
    { ...EMPTY_REF },
    { ...EMPTY_REF },
    { ...EMPTY_REF },
  ],
  reelsIdeas: [{ ...EMPTY_REEL }, { ...EMPTY_REEL }, { ...EMPTY_REEL }],
  moodboardUrl: "",
};

/* ── Animated blobs ── */
function AnimatedBlobs() {
  return (
    <div className="animated-bg" aria-hidden="true">
      <div className="blob blob-hero-center" />
      <div className="blob blob-1" />
      <div className="blob blob-2" />
      <div className="blob blob-3" />
      <div className="blob blob-5" />
    </div>
  );
}

/* ── Section wrapper ── */
function Section({
  number,
  icon,
  title,
  subtitle,
  children,
}: {
  number: number;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="animate-fade-up glass-form p-5 sm:p-7">
      <div className="mb-5 flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50/80 text-blue-500">
          {icon}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-blue-100/80 px-2 py-0.5 text-xs font-semibold text-blue-600">
              Блок {number}
            </span>
          </div>
          <h2 className="mt-1 text-lg font-bold text-slate-900">{title}</h2>
          <p className="mt-0.5 text-sm text-slate-500">{subtitle}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

export default function ContentScoutPage() {
  const [form, setForm] = useState<FormState>(INITIAL);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [expandedReel, setExpandedReel] = useState<number | null>(0);

  const updateRef = (i: number, field: keyof Reference, value: string) => {
    setForm((prev) => {
      const refs = [...prev.references];
      refs[i] = { ...refs[i], [field]: value };
      return { ...prev, references: refs };
    });
  };

  const updateReel = (i: number, field: keyof ReelIdea, value: string) => {
    setForm((prev) => {
      const ideas = [...prev.reelsIdeas];
      ideas[i] = { ...ideas[i], [field]: value };
      return { ...prev, reelsIdeas: ideas };
    });
  };

  const isValid = () => {
    if (!form.name.trim() || !form.telegram.trim()) return false;
    for (const ref of form.references) {
      if (!ref.url.trim() || !ref.explanation.trim()) return false;
    }
    for (const idea of form.reelsIdeas) {
      if (
        !idea.hook.trim() ||
        !idea.scenario.trim() ||
        !idea.visual.trim() ||
        !idea.cta.trim()
      )
        return false;
    }
    if (!form.moodboardUrl.trim()) return false;
    return true;
  };

  const handleSubmit = async () => {
    if (!isValid()) return;
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/content-scout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Ошибка отправки");
        setSubmitting(false);
        return;
      }

      setSuccess(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setError("Ошибка сети. Попробуйте ещё раз.");
      setSubmitting(false);
    }
  };

  /* ═══ Success screen ═══ */
  if (success) {
    return (
      <div className="relative flex min-h-dvh items-center justify-center overflow-hidden px-4 py-8">
        <AnimatedBlobs />
        <div className="relative z-10 w-full max-w-md">
          <div className="glass-form animate-fade-scale p-6 text-center sm:p-8">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green-50/80 backdrop-blur-sm">
              <CheckCircle2 className="h-8 w-8 text-green-500" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Отправлено!</h1>
            <p className="mt-3 text-[15px] leading-relaxed text-slate-600">
              Ваше тестовое задание успешно отправлено. Мы рассмотрим его в
              течение 2-3 дней.
            </p>
            <div className="mx-auto mt-5 flex items-start gap-2.5 rounded-xl border border-slate-200/60 bg-white/50 p-4 text-left backdrop-blur-sm">
              <MessageCircle className="mt-0.5 h-5 w-5 shrink-0 text-slate-400" />
              <div className="text-sm leading-relaxed text-slate-600">
                <p>
                  Результаты сообщим через{" "}
                  <strong className="text-slate-700">Telegram</strong>. Следите
                  за сообщениями!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ═══ Main form ═══ */
  return (
    <div className="relative min-h-dvh overflow-hidden">
      <AnimatedBlobs />

      <div className="relative mx-auto max-w-2xl px-4 pb-12 pt-10 sm:px-6 sm:pt-16">
        {/* ── Hero ── */}
        <div className="mb-10 text-center sm:mb-12">
          <div className="hero-badge mx-auto mb-4">
            <Sparkles className="h-3.5 w-3.5" />
            Тестовое задание
          </div>

          <h1
            className="text-2xl font-bold tracking-tight sm:text-4xl"
            style={{ lineHeight: 1.15 }}
          >
            <span className="animate-word-reveal inline-block" style={{ animationDelay: "0ms" }}>
              Контент-план
            </span>{" "}
            <span className="animate-word-reveal inline-block" style={{ animationDelay: "100ms" }}>
              для
            </span>{" "}
            <span className="animate-word-reveal inline-block gradient-text" style={{ animationDelay: "200ms" }}>
              Алисы
            </span>
          </h1>

          <p
            className="animate-fade-up mx-auto mt-4 max-w-lg text-sm leading-relaxed text-slate-500 sm:text-base"
            style={{ animationDelay: "300ms" }}
          >
            Покажи, как ты видишь контент-стратегию. Три блока — референсы, идеи
            рилсов и мудборд.
          </p>

          <div
            className="animate-fade-up mt-5 flex items-center justify-center gap-2"
            style={{ animationDelay: "400ms" }}
          >
            <div className="flex items-center gap-1.5 rounded-full bg-amber-50/80 px-3 py-1 text-xs font-medium text-amber-700 border border-amber-200/60">
              <Clock className="h-3 w-3" />
              Срок: 3 дня
            </div>
          </div>
        </div>

        {/* ── Name + Telegram ── */}
        <div className="animate-fade-up glass-form mb-4 p-5 sm:p-7">
          <h2 className="mb-4 text-lg font-bold text-slate-900">О вас</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-600">
                Имя
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) =>
                  setForm((p) => ({ ...p, name: e.target.value }))
                }
                placeholder="Ваше имя"
                className="w-full rounded-xl border border-slate-200/80 bg-white/70 px-3.5 py-2.5 text-sm backdrop-blur-sm outline-none transition-all focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-600">
                Telegram
              </label>
              <input
                type="text"
                value={form.telegram}
                onChange={(e) =>
                  setForm((p) => ({ ...p, telegram: e.target.value }))
                }
                placeholder="@username"
                className="w-full rounded-xl border border-slate-200/80 bg-white/70 px-3.5 py-2.5 text-sm backdrop-blur-sm outline-none transition-all focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>
        </div>

        {/* ── Block 1: References ── */}
        <div className="mb-4">
          <Section
            number={1}
            icon={<Link2 className="h-5 w-5" />}
            title="Референсы"
            subtitle="Найди 5 аккаунтов/рилсов, которые по вайбу подошли бы Алисе. Направление: хайп, кликбейт, провокация, вирусность."
          >
            <div className="space-y-4">
              {form.references.map((ref, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-slate-200/60 bg-white/50 p-4 backdrop-blur-sm"
                >
                  <div className="mb-2 flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-blue-50 text-xs font-bold text-blue-500">
                      {i + 1}
                    </span>
                    <span className="text-sm font-medium text-slate-700">
                      Референс {i + 1}
                    </span>
                  </div>
                  <input
                    type="url"
                    value={ref.url}
                    onChange={(e) => updateRef(i, "url", e.target.value)}
                    placeholder="Ссылка на аккаунт или рилс"
                    className="mb-2 w-full rounded-lg border border-slate-200/80 bg-white/70 px-3 py-2 text-sm outline-none transition-all focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
                  />
                  <textarea
                    value={ref.explanation}
                    onChange={(e) =>
                      updateRef(i, "explanation", e.target.value)
                    }
                    placeholder="Почему подходит Алисе? (2-3 предложения)"
                    rows={2}
                    className="w-full resize-none rounded-lg border border-slate-200/80 bg-white/70 px-3 py-2 text-sm outline-none transition-all focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              ))}
            </div>
          </Section>
        </div>

        {/* ── Block 2: Reels Ideas ── */}
        <div className="mb-4">
          <Section
            number={2}
            icon={<Film className="h-5 w-5" />}
            title="3 идеи рилсов на неделю"
            subtitle="Придумай 3 рилса для Алисы. Для каждого: хук, сценарий, визуал и CTA."
          >
            <div className="space-y-3">
              {form.reelsIdeas.map((idea, i) => {
                const isExpanded = expandedReel === i;
                const isFilled =
                  idea.hook.trim() &&
                  idea.scenario.trim() &&
                  idea.visual.trim() &&
                  idea.cta.trim();

                return (
                  <div
                    key={i}
                    className="rounded-xl border border-slate-200/60 bg-white/50 backdrop-blur-sm overflow-hidden transition-all"
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedReel(isExpanded ? null : i)
                      }
                      className="flex w-full items-center justify-between p-4 text-left"
                    >
                      <div className="flex items-center gap-2">
                        <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-blue-50 text-xs font-bold text-blue-500">
                          {i + 1}
                        </span>
                        <span className="text-sm font-medium text-slate-700">
                          Рилс {i + 1}
                        </span>
                        {isFilled && (
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                        )}
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4 text-slate-400" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-slate-400" />
                      )}
                    </button>

                    {isExpanded && (
                      <div className="space-y-3 px-4 pb-4">
                        <div>
                          <label className="mb-1 flex items-center gap-1.5 text-xs font-medium text-slate-600">
                            <Zap className="h-3 w-3 text-amber-500" />
                            Хук (первые 3 сек)
                          </label>
                          <input
                            type="text"
                            value={idea.hook}
                            onChange={(e) =>
                              updateReel(i, "hook", e.target.value)
                            }
                            placeholder="Что цепляет зрителя в первые секунды?"
                            className="w-full rounded-lg border border-slate-200/80 bg-white/70 px-3 py-2 text-sm outline-none transition-all focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
                          />
                        </div>
                        <div>
                          <label className="mb-1 flex items-center gap-1.5 text-xs font-medium text-slate-600">
                            <Clapperboard className="h-3 w-3 text-blue-500" />
                            Сценарий
                          </label>
                          <textarea
                            value={idea.scenario}
                            onChange={(e) =>
                              updateReel(i, "scenario", e.target.value)
                            }
                            placeholder="Что происходит в рилсе?"
                            rows={3}
                            className="w-full resize-none rounded-lg border border-slate-200/80 bg-white/70 px-3 py-2 text-sm outline-none transition-all focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
                          />
                        </div>
                        <div>
                          <label className="mb-1 flex items-center gap-1.5 text-xs font-medium text-slate-600">
                            <Eye className="h-3 w-3 text-purple-500" />
                            Визуал / монтаж
                          </label>
                          <textarea
                            value={idea.visual}
                            onChange={(e) =>
                              updateReel(i, "visual", e.target.value)
                            }
                            placeholder="Как это выглядит? Стиль, переходы, эффекты."
                            rows={2}
                            className="w-full resize-none rounded-lg border border-slate-200/80 bg-white/70 px-3 py-2 text-sm outline-none transition-all focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
                          />
                        </div>
                        <div>
                          <label className="mb-1 flex items-center gap-1.5 text-xs font-medium text-slate-600">
                            <MousePointerClick className="h-3 w-3 text-green-500" />
                            CTA
                          </label>
                          <input
                            type="text"
                            value={idea.cta}
                            onChange={(e) =>
                              updateReel(i, "cta", e.target.value)
                            }
                            placeholder="Что зритель делает после просмотра?"
                            className="w-full rounded-lg border border-slate-200/80 bg-white/70 px-3 py-2 text-sm outline-none transition-all focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </Section>
        </div>

        {/* ── Block 3: Moodboard ── */}
        <div className="mb-6">
          <Section
            number={3}
            icon={<Palette className="h-5 w-5" />}
            title="Мудборд"
            subtitle="Покажи, как ты видишь визуальный стиль аккаунта Алисы. Цвета, шрифты, настроение, энергетика."
          >
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-600">
                Ссылка на мудборд (Canva / Google Drive / Pinterest / любой
                формат)
              </label>
              <input
                type="url"
                value={form.moodboardUrl}
                onChange={(e) =>
                  setForm((p) => ({ ...p, moodboardUrl: e.target.value }))
                }
                placeholder="https://..."
                className="w-full rounded-xl border border-slate-200/80 bg-white/70 px-3.5 py-2.5 text-sm backdrop-blur-sm outline-none transition-all focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </Section>
        </div>

        {/* ── Error ── */}
        {error && (
          <div className="mb-4 flex items-start gap-2.5 rounded-xl border border-red-200/80 bg-red-50/80 p-3 backdrop-blur-sm">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* ── Submit ── */}
        <button
          onClick={handleSubmit}
          disabled={!isValid() || submitting}
          className="btn-cta w-full disabled:opacity-40 disabled:hover:transform-none disabled:hover:shadow-none"
        >
          {submitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
          Отправить тестовое
        </button>

        <p className="mt-3 text-center text-xs text-slate-400">
          Результаты рассмотрим в течение 2-3 дней. Ответим в Telegram.
        </p>
      </div>
    </div>
  );
}
