"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus, Trash2, Pencil, CheckSquare } from "lucide-react";

type AdminUser = {
  id: string;
  email: string;
  name: string;
  role: "OWNER" | "EDITOR";
  createdAt: string;
};

export default function UsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({
    email: "",
    password: "",
    name: "",
    role: "EDITOR",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // ── Selection state ──
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkLoading, setBulkLoading] = useState(false);

  const loadUsers = async () => {
    const res = await fetch("/mentor/api/admin/users");
    if (res.ok) {
      const data = await res.json();
      setUsers(data.users);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleSubmit = async () => {
    setSaving(true);
    setError("");

    if (editId) {
      const body: Record<string, string> = { name: form.name, role: form.role };
      if (form.email) body.email = form.email;
      if (form.password) body.password = form.password;

      const res = await fetch(`/mentor/api/admin/users/${editId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        setError(d.error || "Ошибка");
        setSaving(false);
        return;
      }
    } else {
      if (!form.email || !form.password || !form.name) {
        setError("Заполните все поля");
        setSaving(false);
        return;
      }
      const res = await fetch("/mentor/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        setError(d.error || "Ошибка");
        setSaving(false);
        return;
      }
    }

    setShowForm(false);
    setEditId(null);
    setForm({ email: "", password: "", name: "", role: "EDITOR" });
    loadUsers();
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Удалить пользователя?")) return;
    await fetch(`/mentor/api/admin/users/${id}`, { method: "DELETE" });
    loadUsers();
  };

  const startEdit = (u: AdminUser) => {
    setEditId(u.id);
    setForm({ email: u.email, password: "", name: u.name, role: u.role });
    setShowForm(true);
  };

  // ── Selection handlers ──
  const toggleOne = (uid: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(uid)) next.delete(uid);
      else next.add(uid);
      return next;
    });
  };

  const toggleAll = () => {
    if (selected.size === users.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(users.map((u) => u.id)));
    }
  };

  const handleBulkDelete = async () => {
    if (selected.size === 0) return;
    if (!confirm(`Удалить ${selected.size} пользователь(ей)? Это необратимо.`)) return;
    setBulkLoading(true);
    const res = await fetch("/mentor/api/admin/users", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: Array.from(selected) }),
    });
    if (res.ok) {
      setSelected(new Set());
      loadUsers();
    } else {
      const d = await res.json().catch(() => ({}));
      alert(d.error || "Ошибка удаления");
    }
    setBulkLoading(false);
  };

  const handleBulkRoleChange = async (role: string) => {
    if (selected.size === 0 || !role) return;
    setBulkLoading(true);
    const res = await fetch("/mentor/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: Array.from(selected), role }),
    });
    if (res.ok) {
      setSelected(new Set());
      loadUsers();
    }
    setBulkLoading(false);
  };

  const allChecked = users.length > 0 && selected.size === users.length;
  const someChecked = selected.size > 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Пользователи</h1>
          <p className="mt-1 text-sm text-slate-500">{users.length} пользователь(ей)</p>
        </div>
        <button
          onClick={() => {
            setShowForm(true);
            setEditId(null);
            setForm({ email: "", password: "", name: "", role: "EDITOR" });
          }}
          className="btn-cta h-10 px-5 text-sm"
        >
          <Plus className="h-4 w-4" /> Добавить
        </button>
      </div>

      {showForm && (
        <div className="glass-form mb-6 p-5">
          <h3 className="mb-3 text-sm font-semibold text-slate-900">
            {editId ? "Редактировать" : "Новый пользователь"}
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs text-slate-600">Имя</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="mt-1 rounded-xl border-slate-200/80 bg-white/70"
              />
            </div>
            <div>
              <Label className="text-xs text-slate-600">Email</Label>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="mt-1 rounded-xl border-slate-200/80 bg-white/70"
              />
            </div>
            <div>
              <Label className="text-xs text-slate-600">
                Пароль{editId ? " (оставьте пустым)" : ""}
              </Label>
              <Input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="mt-1 rounded-xl border-slate-200/80 bg-white/70"
              />
            </div>
            <div>
              <Label className="text-xs text-slate-600">Роль</Label>
              <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="mt-1 w-full rounded-xl border border-slate-200/80 bg-white/70 px-3 py-2 text-sm"
              >
                <option value="EDITOR">Редактор</option>
                <option value="OWNER">Владелец</option>
              </select>
            </div>
          </div>
          {error && (
            <div className="mt-2 rounded-xl border border-red-200/80 bg-red-50/80 p-3 text-sm text-red-600">
              {error}
            </div>
          )}
          <div className="mt-4 flex gap-2 justify-end">
            <Button
              variant="outline"
              onClick={() => {
                setShowForm(false);
                setEditId(null);
              }}
              className="rounded-xl border-slate-200/80"
            >
              Отмена
            </Button>
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="btn-cta h-10 px-5 text-sm disabled:opacity-40"
            >
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : editId ? (
                "Сохранить"
              ) : (
                "Создать"
              )}
            </button>
          </div>
        </div>
      )}

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
            onChange={(e) => {
              if (e.target.value) handleBulkRoleChange(e.target.value);
              e.target.value = "";
            }}
            className="rounded-xl border border-slate-200/80 bg-white/70 px-3 py-1.5 text-sm"
            defaultValue=""
          >
            <option value="">Сменить роль...</option>
            <option value="EDITOR">Редактор</option>
            <option value="OWNER">Владелец</option>
          </select>
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
              onClick={() => setSelected(new Set())}
              className="rounded-xl border-slate-200/80 text-xs"
            >
              Снять выделение
            </Button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {users.map((u) => {
          const isChecked = selected.has(u.id);
          return (
            <div
              key={u.id}
              className={`glass-card flex items-center justify-between p-4 ${
                isChecked ? "ring-2 ring-blue-200 bg-blue-50/30" : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggleOne(u.id)}
                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100/80 text-sm font-semibold text-slate-600">
                    {u.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-slate-900">{u.name}</span>
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${
                          u.role === "OWNER"
                            ? "bg-violet-50/80 text-violet-700 border border-violet-200/60"
                            : "bg-slate-100/80 text-slate-600 border border-slate-200/60"
                        }`}
                      >
                        {u.role}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">{u.email}</p>
                  </div>
                </div>
              </div>
              <div className="flex gap-1.5">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => startEdit(u)}
                  className="rounded-lg border-slate-200/80 bg-white/70 backdrop-blur-sm hover:bg-white"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(u.id)}
                  className="rounded-lg border-slate-200/80 bg-white/70 text-red-400 backdrop-blur-sm hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Select all toggle at bottom */}
      {users.length > 1 && (
        <div className="mt-4 flex justify-center">
          <button
            onClick={toggleAll}
            className="text-xs text-slate-400 hover:text-slate-600 transition-colors"
          >
            {allChecked ? "Снять выделение со всех" : "Выбрать всех"}
          </button>
        </div>
      )}
    </div>
  );
}
