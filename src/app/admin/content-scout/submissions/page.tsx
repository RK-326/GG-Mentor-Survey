"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Loader2,
  ChevronLeft,
  ExternalLink,
  Link2,
  Film,
  Palette,
  Zap,
  Clapperboard,
  Eye,
  MousePointerClick,
  Inbox,
  ArrowLeft,
  Trash2,
  CheckSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";

type Reference = { url: string; explanation: string };
type ReelIdea = { hook: string; scenario: string; visual: string; cta: string };

type Submission = {
  id: string;
  name: string;
  telegram: string;
  references: Reference[];
  reelsIdeas: ReelIdea[];
  moodboardUrl: string;
  createdAt: string;
};

export default function ContentScoutSubmissionsPage() {
  const router = useRouter();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Submission | null>(null);

  // ── Selection state ──
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [bulkLoading, setBulkLoading] = useState(false);

  const loadSubmissions = () => {
    setLoading(true);
    fetch("/api/content-scout")
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => setSubmissions(data))
      .catch(() => setSubmissions([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadSubmissions();
  }, []);

  // ── Selection handlers ──
  const toggleOne = (sid: string) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(sid)) next.delete(sid);
      else next.add(sid);
      return next;
    });
  };

  const toggleAll = () => {
    if (checked.size === submissions.length) {
      setChecked(new Set());
    } else {
      setChecked(new Set(submissions.map((s) => s.id)));
    }
  };

  const handleBulkDelete = async () => {
    if (checked.size === 0) return;
    if (!confirm(`Удалить ${checked.size} ответ(ов)? Это необратимо.`)) return;
    setBulkLoading(true);
    const res = await fetch("/api/content-scout", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: Array.from(checked) }),
    });
    if (res.ok) {
      setChecked(new Set());
      loadSubmissions();
    }
    setBulkLoading(false);
  };

  const allChecked = submissions.length > 0 && checked.size === submissions.length;
  const someChecked = checked.size > 0;

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-blue-400" />
      </div>
    );
  }

  /* ── Detail view ── */
  if (selected) {
    return (
      <div className="mx-auto max-w-3xl">
        <button
          onClick={() => setSelected(null)}
          className="mb-4 flex items-center gap-1 text-sm text-slate-500 transition-colors hover:text-slate-700"
        >
          <ChevronLeft className="h-4 w-4" />
          Назад к списку
        </button>

        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <div className="mb-6 flex items-start justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                {selected.name}
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                {selected.telegram} &middot;{" "}
                {new Date(selected.createdAt).toLocaleString("ru-RU")}
              </p>
            </div>
          </div>

          {/* References */}
          <div className="mb-6">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700">
              <Link2 className="h-4 w-4 text-blue-500" />
              Блок 1 — Референсы
            </div>
            <div className="space-y-3">
              {(selected.references || []).map((ref, i) => (
                <div
                  key={i}
                  className="rounded-lg border border-slate-100 bg-slate-50/50 p-3"
                >
                  <div className="mb-1 flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded bg-blue-100 text-xs font-bold text-blue-600">
                      {i + 1}
                    </span>
                    <a
                      href={ref.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-sm text-blue-600 hover:underline"
                    >
                      {ref.url.length > 60
                        ? ref.url.slice(0, 60) + "..."
                        : ref.url}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                  <p className="text-sm text-slate-600">{ref.explanation}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Reels Ideas */}
          <div className="mb-6">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700">
              <Film className="h-4 w-4 text-blue-500" />
              Блок 2 — Идеи рилсов
            </div>
            <div className="space-y-3">
              {(selected.reelsIdeas || []).map((idea, i) => (
                <div
                  key={i}
                  className="rounded-lg border border-slate-100 bg-slate-50/50 p-4"
                >
                  <div className="mb-3 flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded bg-blue-100 text-xs font-bold text-blue-600">
                      {i + 1}
                    </span>
                    <span className="text-sm font-medium text-slate-700">
                      Рилс {i + 1}
                    </span>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <div className="mb-1 flex items-center gap-1 text-xs font-medium text-slate-500">
                        <Zap className="h-3 w-3 text-amber-500" /> Хук
                      </div>
                      <p className="text-sm text-slate-700">{idea.hook}</p>
                    </div>
                    <div>
                      <div className="mb-1 flex items-center gap-1 text-xs font-medium text-slate-500">
                        <Clapperboard className="h-3 w-3 text-blue-500" />{" "}
                        Сценарий
                      </div>
                      <p className="text-sm text-slate-700">{idea.scenario}</p>
                    </div>
                    <div>
                      <div className="mb-1 flex items-center gap-1 text-xs font-medium text-slate-500">
                        <Eye className="h-3 w-3 text-purple-500" /> Визуал
                      </div>
                      <p className="text-sm text-slate-700">{idea.visual}</p>
                    </div>
                    <div>
                      <div className="mb-1 flex items-center gap-1 text-xs font-medium text-slate-500">
                        <MousePointerClick className="h-3 w-3 text-green-500" />{" "}
                        CTA
                      </div>
                      <p className="text-sm text-slate-700">{idea.cta}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Moodboard */}
          <div>
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700">
              <Palette className="h-4 w-4 text-blue-500" />
              Блок 3 — Мудборд
            </div>
            <a
              href={selected.moodboardUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-3 py-2 text-sm text-blue-600 transition-colors hover:bg-blue-100"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Открыть мудборд
            </a>
          </div>
        </div>
      </div>
    );
  }

  /* ── List view ── */
  return (
    <div>
      <div className="mb-4 flex items-center gap-3">
        <button
          onClick={() => router.push("/admin/content-scout")}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition-colors hover:bg-slate-50"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div>
          <h1 className="text-xl font-semibold text-slate-900">
            Контент-скаут — Ответы
          </h1>
          <p className="text-sm text-slate-500">
            {submissions.length}{" "}
            {submissions.length === 1
              ? "ответ"
              : submissions.length < 5
                ? "ответа"
                : "ответов"}
          </p>
        </div>
      </div>

      {/* Bulk actions bar */}
      {someChecked && (
        <div className="glass-card mb-4 flex items-center gap-3 p-3">
          <div className="flex items-center gap-2">
            <CheckSquare className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-slate-700">
              Выбрано: {checked.size}
            </span>
          </div>
          <Button
            size="sm"
            variant="outline"
            disabled={bulkLoading}
            onClick={handleBulkDelete}
            className="rounded-xl border-red-200/80 text-red-600 hover:bg-red-50"
          >
            {bulkLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <Trash2 className="mr-1 h-3.5 w-3.5" />
                Удалить
              </>
            )}
          </Button>
          <div className="ml-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setChecked(new Set())}
              className="rounded-xl border-slate-200/80 text-xs"
            >
              Снять выделение
            </Button>
          </div>
        </div>
      )}

      {submissions.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 py-16 text-center">
          <Inbox className="mb-3 h-10 w-10 text-slate-300" />
          <p className="text-sm text-slate-500">Пока нет ответов</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="w-10 px-3 py-3">
                  <input
                    type="checkbox"
                    checked={allChecked}
                    ref={(el) => {
                      if (el) el.indeterminate = someChecked && !allChecked;
                    }}
                    onChange={toggleAll}
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">
                  Имя
                </th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">
                  Telegram
                </th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">
                  Дата
                </th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">
                  Реф.
                </th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">
                  Рилсы
                </th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">
                  Мудборд
                </th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((s) => {
                const isChecked = checked.has(s.id);
                return (
                  <tr
                    key={s.id}
                    className={`border-b border-slate-50 transition-colors ${
                      isChecked
                        ? "bg-blue-50/50"
                        : "hover:bg-blue-50/30"
                    }`}
                  >
                    <td
                      className="w-10 px-3 py-3"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleOne(s.id)}
                        className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td
                      className="cursor-pointer px-4 py-3 font-medium text-slate-900"
                      onClick={() => setSelected(s)}
                    >
                      {s.name}
                    </td>
                    <td
                      className="cursor-pointer px-4 py-3 text-slate-600"
                      onClick={() => setSelected(s)}
                    >
                      {s.telegram}
                    </td>
                    <td
                      className="cursor-pointer px-4 py-3 text-slate-500"
                      onClick={() => setSelected(s)}
                    >
                      {new Date(s.createdAt).toLocaleDateString("ru-RU")}
                    </td>
                    <td
                      className="cursor-pointer px-4 py-3"
                      onClick={() => setSelected(s)}
                    >
                      <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-600">
                        {Array.isArray(s.references) ? s.references.length : 0}
                      </span>
                    </td>
                    <td
                      className="cursor-pointer px-4 py-3"
                      onClick={() => setSelected(s)}
                    >
                      <span className="rounded-full bg-purple-50 px-2 py-0.5 text-xs font-medium text-purple-600">
                        {Array.isArray(s.reelsIdeas) ? s.reelsIdeas.length : 0}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {s.moodboardUrl ? (
                        <a
                          href={s.moodboardUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-blue-500 hover:underline"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      ) : (
                        <span className="text-slate-300">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
