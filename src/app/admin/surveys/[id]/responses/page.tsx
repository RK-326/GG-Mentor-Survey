"use client";

import { useState, useEffect, useCallback, use } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  Search,
  Download,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  CheckSquare,
} from "lucide-react";

type Answer = {
  textValue: string | null;
  numberValue: number | null;
  boolValue: boolean | null;
  arrayValue: string[];
  points: number;
  question: { fieldKey: string; label: string; type: string };
  selectedOption: { label: string } | null;
};

type ResponseRow = {
  id: string;
  totalScore: number;
  scorePercentage: number;
  status: string;
  createdAt: string;
  answers: Answer[];
};

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-gray-100 text-gray-700",
  SHORTLISTED: "bg-blue-100 text-blue-700",
  SELECTED: "bg-green-100 text-green-700",
  REJECTED: "bg-red-100 text-red-700",
  CONTACTED: "bg-purple-100 text-purple-700",
  TEST_ASSIGNED: "bg-amber-100 text-amber-700",
};

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Ожидает",
  SHORTLISTED: "В шорт-листе",
  SELECTED: "Отобран",
  REJECTED: "Отклонён",
  CONTACTED: "Связались",
  TEST_ASSIGNED: "Тестовое",
};

const ALL_STATUSES = [
  { value: "PENDING", label: "Ожидает" },
  { value: "SHORTLISTED", label: "Шорт-лист" },
  { value: "TEST_ASSIGNED", label: "Тестовое" },
  { value: "SELECTED", label: "Отобран" },
  { value: "REJECTED", label: "Отклонён" },
  { value: "CONTACTED", label: "Связались" },
];

function getAnswerDisplay(a: Answer): string {
  if (a.selectedOption) return a.selectedOption.label;
  if (a.arrayValue?.length > 0) return a.arrayValue.join(", ");
  if (a.boolValue !== null) return a.boolValue ? "Да" : "Нет";
  if (a.numberValue !== null) return String(a.numberValue);
  return a.textValue || "—";
}

export default function ResponsesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [responses, setResponses] = useState<ResponseRow[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sort, setSort] = useState("date_desc");
  const [loading, setLoading] = useState(true);
  const [surveyTitle, setSurveyTitle] = useState("");

  // ── Selection state ──
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkStatus, setBulkStatus] = useState("");
  const [bulkLoading, setBulkLoading] = useState(false);

  const fetchData = useCallback(async () => {
    const params = new URLSearchParams({ page: String(page), sort });
    if (statusFilter) params.set("status", statusFilter);
    if (search) params.set("search", search);

    const res = await fetch(
      `/api/admin/surveys/${id}/responses?${params}`
    );
    if (res.ok) {
      const data = await res.json();
      setResponses(data.responses);
      setTotal(data.total);
    }
    setLoading(false);
  }, [id, page, sort, statusFilter, search]);

  useEffect(() => {
    fetch(`/api/admin/surveys/${id}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => d && setSurveyTitle(d.survey?.title || ""));
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Clear selection when page/filter changes
  useEffect(() => {
    setSelected(new Set());
  }, [page, statusFilter, search, sort]);

  const totalPages = Math.ceil(total / 50);

  const getKeyFields = (r: ResponseRow) => {
    const textAnswers = r.answers.filter((a) => a.question.type === "TEXT");
    return {
      name: textAnswers[0]?.textValue || "—",
      identifier: textAnswers[1]?.textValue || "",
    };
  };

  // ── Selection handlers ──
  const toggleOne = (rid: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(rid)) next.delete(rid);
      else next.add(rid);
      return next;
    });
  };

  const toggleAll = () => {
    if (selected.size === responses.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(responses.map((r) => r.id)));
    }
  };

  const handleBulkUpdate = async () => {
    if (!bulkStatus || selected.size === 0) return;
    setBulkLoading(true);
    const res = await fetch(`/api/admin/surveys/${id}/responses`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: Array.from(selected), status: bulkStatus }),
    });
    if (res.ok) {
      const data = await res.json();
      console.log(`Updated ${data.updated} responses`);
      setSelected(new Set());
      setBulkStatus("");
      fetchData();
    }
    setBulkLoading(false);
  };

  const handleBulkDelete = async () => {
    if (selected.size === 0) return;
    if (!confirm(`Удалить ${selected.size} ответ(ов)? Это необратимо.`)) return;
    setBulkLoading(true);
    // Delete one by one (no bulk delete endpoint)
    for (const rid of selected) {
      await fetch(`/api/admin/surveys/${id}/responses/${rid}`, {
        method: "DELETE",
      });
    }
    setSelected(new Set());
    fetchData();
    setBulkLoading(false);
  };

  const allChecked = responses.length > 0 && selected.size === responses.length;
  const someChecked = selected.size > 0;

  return (
    <div>
      <div className="mb-4 flex items-center gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push("/admin")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-xl font-semibold">Ответы</h1>
          <p className="text-sm text-gray-500">{surveyTitle}</p>
        </div>
        <div className="ml-auto">
          <a href={`/api/admin/surveys/${id}/export`}>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-1" /> CSV
            </Button>
          </a>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-card mb-4 p-3">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Поиск..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="rounded-xl border-slate-200/80 bg-white/70 pl-9 backdrop-blur-sm"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="rounded-xl border border-slate-200/80 bg-white/70 px-3 py-2 text-sm backdrop-blur-sm"
          >
            <option value="">Все статусы</option>
            {ALL_STATUSES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
          <button
            onClick={() => {
              setSort((s) =>
                s === "score_desc"
                  ? "score_asc"
                  : s === "score_asc"
                    ? "date_desc"
                    : s === "date_desc"
                      ? "date_asc"
                      : "score_desc"
              );
              setPage(1);
            }}
            className="flex items-center gap-1 rounded-xl border border-slate-200/80 bg-white/70 px-3 py-2 text-sm backdrop-blur-sm transition-colors hover:bg-white"
          >
            <ArrowUpDown className="h-4 w-4" />
            {sort === "score_desc" && "Балл \u2193"}
            {sort === "score_asc" && "Балл \u2191"}
            {sort === "date_desc" && "Дата \u2193"}
            {sort === "date_asc" && "Дата \u2191"}
          </button>
        </div>
      </div>

      {/* Bulk actions bar */}
      {someChecked && (
        <div className="glass-card mb-4 flex items-center gap-3 p-3">
          <div className="flex items-center gap-2">
            <CheckSquare className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-slate-700">
              Выбрано: {selected.size}
            </span>
          </div>
          <select
            value={bulkStatus}
            onChange={(e) => setBulkStatus(e.target.value)}
            className="rounded-xl border border-slate-200/80 bg-white/70 px-3 py-1.5 text-sm"
          >
            <option value="">Изменить статус...</option>
            {ALL_STATUSES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
          <Button
            size="sm"
            disabled={!bulkStatus || bulkLoading}
            onClick={handleBulkUpdate}
            className="rounded-xl bg-blue-600 text-white hover:bg-blue-700"
          >
            {bulkLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Применить"
            )}
          </Button>
          <a
            href={`/api/admin/surveys/${id}/export?ids=${Array.from(selected).join(",")}`}
          >
            <Button variant="outline" size="sm" className="rounded-xl">
              <Download className="mr-1 h-3.5 w-3.5" />
              CSV выбранных
            </Button>
          </a>
          <div className="ml-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelected(new Set())}
              className="rounded-xl border-slate-200/80 text-xs"
            >
              Снять выделение
            </Button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      ) : (
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200/60 bg-slate-50/50 text-left text-slate-500">
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
                  <th className="px-4 py-3 font-medium">Имя</th>
                  <th className="px-4 py-3 font-medium">ID</th>
                  <th className="px-4 py-3 font-medium">Балл</th>
                  <th className="px-4 py-3 font-medium">Статус</th>
                  <th className="px-4 py-3 font-medium">Дата</th>
                </tr>
              </thead>
              <tbody>
                {responses.map((r) => {
                  const { name, identifier } = getKeyFields(r);
                  const isChecked = selected.has(r.id);
                  return (
                    <tr
                      key={r.id}
                      className={`border-b border-slate-100 transition-colors cursor-pointer ${
                        isChecked
                          ? "bg-blue-50/50"
                          : "hover:bg-blue-50/30"
                      }`}
                    >
                      <td className="w-10 px-3 py-3" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleOne(r.id)}
                          className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                      <td
                        className="px-4 py-3 font-medium text-primary"
                        onClick={() =>
                          router.push(`/admin/surveys/${id}/responses/${r.id}`)
                        }
                      >
                        {name}
                      </td>
                      <td
                        className="px-4 py-3 text-gray-500 text-xs"
                        onClick={() =>
                          router.push(`/admin/surveys/${id}/responses/${r.id}`)
                        }
                      >
                        {identifier}
                      </td>
                      <td
                        className="px-4 py-3"
                        onClick={() =>
                          router.push(`/admin/surveys/${id}/responses/${r.id}`)
                        }
                      >
                        <span className="text-xs font-medium">
                          {r.totalScore} ({r.scorePercentage}%)
                        </span>
                      </td>
                      <td
                        className="px-4 py-3"
                        onClick={() =>
                          router.push(`/admin/surveys/${id}/responses/${r.id}`)
                        }
                      >
                        <Badge className={STATUS_COLORS[r.status]}>
                          {STATUS_LABELS[r.status] || r.status}
                        </Badge>
                      </td>
                      <td
                        className="px-4 py-3 text-gray-500 text-xs"
                        onClick={() =>
                          router.push(`/admin/surveys/${id}/responses/${r.id}`)
                        }
                      >
                        {new Date(r.createdAt).toLocaleDateString("ru")}
                      </td>
                    </tr>
                  );
                })}
                {responses.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-12 text-center text-gray-400"
                    >
                      Ответов пока нет
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t px-4 py-3">
              <span className="text-sm text-gray-500">
                {responses.length} из {total}
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="flex items-center text-sm">
                  {page} / {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
