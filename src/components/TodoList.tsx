"use client";

import { useState, useEffect } from "react";
import {
  Check,
  Circle,
  Plus,
  Trash2,
  ListTodo,
  Sparkles,
  Loader2,
} from "lucide-react";
import type { Todo } from "@/types/database";
import {
  fetchTodos,
  addTodo as addTodoApi,
  toggleTodo as toggleTodoApi,
  deleteTodo as deleteTodoApi,
} from "@/lib/todos";
import { isSupabaseConfigured } from "@/lib/supabase";

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setError("Supabase가 설정되지 않았습니다. .env.local에 URL과 Anon Key를 추가해주세요.");
      setLoading(false);
      return;
    }
    fetchTodos()
      .then(setTodos)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const addTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || !isSupabaseConfigured) return;

    setActionLoading("add");
    try {
      const newTodo = await addTodoApi(inputValue.trim());
      setTodos((prev) => [newTodo, ...prev]);
      setInputValue("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "추가 실패");
    } finally {
      setActionLoading(null);
    }
  };

  const toggleTodo = async (id: string) => {
    if (!isSupabaseConfigured) return;
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;

    setActionLoading(id);
    try {
      await toggleTodoApi(id, !todo.completed);
      setTodos((prev) =>
        prev.map((t) =>
          t.id === id ? { ...t, completed: !t.completed } : t
        )
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "토글 실패");
    } finally {
      setActionLoading(null);
    }
  };

  const deleteTodo = async (id: string) => {
    if (!isSupabaseConfigured) return;

    setActionLoading(id);
    try {
      await deleteTodoApi(id);
      setTodos((prev) => prev.filter((t) => t.id !== id));
    } catch (e) {
      setError(e instanceof Error ? e.message : "삭제 실패");
    } finally {
      setActionLoading(null);
    }
  };

  const completedCount = todos.filter((t) => t.completed).length;
  const totalCount = todos.length;

  if (loading) {
    return (
      <div className="w-full max-w-2xl mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="w-12 h-12 text-[var(--accent)] animate-spin mb-4" />
        <p className="text-[var(--muted)]">할 일 목록을 불러오는 중...</p>
      </div>
    );
  }

  if (error && !isSupabaseConfigured) {
    return (
      <div className="w-full max-w-2xl mx-auto px-4 py-12">
        <div className="py-16 text-center rounded-2xl bg-[var(--card)] border border-[var(--border)]">
          <p className="text-[var(--danger)] font-medium">{error}</p>
          <p className="text-[var(--muted)] text-sm mt-2">
            .env.example를 참고해 .env.local을 생성하고 Supabase 프로젝트 URL과 Anon Key를 설정해주세요.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-12">
      {/* 헤더 */}
      <header className="mb-12 text-center">
        <div className="inline-flex items-center gap-3 mb-4">
          <div className="p-3 rounded-xl bg-[var(--card)] border border-[var(--border)]">
            <ListTodo className="w-8 h-8 text-[var(--accent)]" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">My Todo</h1>
        </div>
        <p className="text-[var(--muted)] text-sm flex items-center justify-center gap-2">
          <Sparkles className="w-4 h-4" />
          할 일을 추가하고 관리하세요
        </p>
      </header>

      {error && isSupabaseConfigured && (
        <div className="mb-4 p-4 rounded-xl bg-[var(--danger)]/10 border border-[var(--danger)]/30 text-[var(--danger)] text-sm">
          {error}
        </div>
      )}

      {/* 입력 폼 */}
      <form onSubmit={addTodo} className="mb-8">
        <div className="flex gap-3">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="새 할 일을 입력하세요..."
            className="flex-1 px-4 py-3 rounded-xl bg-[var(--card)] border border-[var(--border)] 
                       text-[var(--foreground)] placeholder:text-[var(--muted)]
                       focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent
                       transition-all duration-200"
          />
          <button
            type="submit"
            disabled={actionLoading === "add"}
            className="px-5 py-3 rounded-xl bg-[var(--accent)] hover:bg-[var(--accent-hover)] 
                       text-white font-medium flex items-center gap-2
                       transition-colors duration-200 disabled:opacity-50"
          >
            {actionLoading === "add" ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Plus className="w-5 h-5" />
            )}
            추가
          </button>
        </div>
      </form>

      {/* 진행률 */}
      {totalCount > 0 && (
        <div className="mb-6 flex items-center justify-between text-sm">
          <span className="text-[var(--muted)]">
            {completedCount} / {totalCount} 완료
          </span>
          <div className="h-1.5 flex-1 max-w-[200px] mx-4 rounded-full bg-[var(--card)] overflow-hidden">
            <div
              className="h-full bg-[var(--accent)] rounded-full transition-all duration-300"
              style={{
                width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%`,
              }}
            />
          </div>
        </div>
      )}

      {/* 할 일 목록 */}
      <div className="space-y-2">
        {todos.length === 0 ? (
          <div className="py-16 text-center rounded-2xl bg-[var(--card)] border border-[var(--border)] border-dashed">
            <Circle className="w-12 h-12 mx-auto mb-4 text-[var(--muted)] opacity-50" />
            <p className="text-[var(--muted)]">아직 할 일이 없습니다</p>
            <p className="text-[var(--muted)] text-sm mt-1">
              위 입력창에 할 일을 추가해보세요
            </p>
          </div>
        ) : (
          todos.map((todo) => (
            <div
              key={todo.id}
              className="group flex items-center gap-4 px-4 py-3 rounded-xl 
                         bg-[var(--card)] border border-[var(--border)]
                         hover:bg-[var(--card-hover)] hover:border-[var(--muted)]/30
                         transition-all duration-200"
            >
              <button
                onClick={() => toggleTodo(todo.id)}
                disabled={actionLoading === todo.id}
                className="flex-shrink-0 p-1 rounded-lg hover:bg-white/5 transition-colors disabled:opacity-50"
              >
                {actionLoading === todo.id ? (
                  <Loader2 className="w-6 h-6 text-[var(--muted)] animate-spin" />
                ) : todo.completed ? (
                  <div className="w-6 h-6 rounded-full bg-[var(--success)] flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" strokeWidth={3} />
                  </div>
                ) : (
                  <Circle className="w-6 h-6 text-[var(--muted)]" />
                )}
              </button>

              <span
                className={`flex-1 text-left transition-all duration-200 ${
                  todo.completed
                    ? "line-through text-[var(--muted)]"
                    : "text-[var(--foreground)]"
                }`}
              >
                {todo.text}
              </span>

              <button
                onClick={() => deleteTodo(todo.id)}
                disabled={actionLoading === todo.id}
                className="flex-shrink-0 p-2 rounded-lg text-[var(--muted)] 
                           hover:text-[var(--danger)] hover:bg-[var(--danger)]/10
                           opacity-0 group-hover:opacity-100 transition-all duration-200 disabled:opacity-50"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
