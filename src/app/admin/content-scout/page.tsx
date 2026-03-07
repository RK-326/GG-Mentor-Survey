"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Loader2,
  Sparkles,
  ExternalLink,
  Inbox,
  ArrowRight,
} from "lucide-react";

type TestCard = {
  slug: string;
  title: string;
  description: string;
  count: number;
  url: string;
};

export default function AdminTestsHubPage() {
  const router = useRouter();
  const [contentScoutCount, setContentScoutCount] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/content-scout")
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => setContentScoutCount(Array.isArray(data) ? data.length : 0))
      .catch(() => setContentScoutCount(0));
  }, []);

  const tests: TestCard[] = [
    {
      slug: "content-scout",
      title: "Контент-скаут",
      description: "Тестовое задание: референсы, идеи рилсов, мудборд",
      count: contentScoutCount ?? 0,
      url: "/admin/content-scout/submissions",
    },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Тестовые задания</h1>
        <p className="mt-1 text-sm text-slate-500">
          Просмотр ответов на тестовые задания кандидатов
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tests.map((t) => (
          <button
            key={t.slug}
            onClick={() => router.push(t.url)}
            className="group rounded-xl border border-slate-200 bg-white p-5 text-left transition-all hover:border-blue-200 hover:shadow-md"
          >
            <div className="mb-3 flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-500">
                <Sparkles className="h-5 w-5" />
              </div>
              {contentScoutCount === null ? (
                <Loader2 className="h-4 w-4 animate-spin text-slate-300" />
              ) : (
                <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-600">
                  {t.count} {t.count === 1 ? "ответ" : t.count < 5 ? "ответа" : "ответов"}
                </span>
              )}
            </div>
            <h3 className="font-semibold text-slate-900">{t.title}</h3>
            <p className="mt-1 text-sm text-slate-500">{t.description}</p>
            <div className="mt-3 flex items-center gap-1 text-xs font-medium text-blue-500 opacity-0 transition-opacity group-hover:opacity-100">
              Открыть <ArrowRight className="h-3 w-3" />
            </div>
          </button>
        ))}
      </div>

      {/* Link to landing */}
      <div className="mt-6 rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-4">
        <p className="text-sm text-slate-500">
          Ссылка на тестовое:{" "}
          <a
            href="/mentor/content-scout"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-blue-500 hover:underline"
          >
            /mentor/content-scout
            <ExternalLink className="h-3 w-3" />
          </a>
        </p>
      </div>
    </div>
  );
}
