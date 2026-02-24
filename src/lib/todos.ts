import { supabase } from "./supabase";
import type { Todo } from "@/types/database";

function rowToTodo(row: { id: string; text: string; completed: boolean; created_at: string }): Todo {
  return {
    id: row.id,
    text: row.text,
    completed: row.completed,
    createdAt: new Date(row.created_at),
  };
}

function getSupabase() {
  if (!supabase) throw new Error("Supabase가 설정되지 않았습니다. .env.local에 URL과 Anon Key를 추가해주세요.");
  return supabase;
}

export async function fetchTodos(): Promise<Todo[]> {
  const { data, error } = await getSupabase()
    .from("todos")
    .select("id, text, completed, created_at")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []).map(rowToTodo);
}

export async function addTodo(text: string): Promise<Todo> {
  const { data, error } = await getSupabase()
    .from("todos")
    .insert({ text })
    .select("id, text, completed, created_at")
    .single();

  if (error) throw error;
  return rowToTodo(data);
}

export async function toggleTodo(id: string, completed: boolean): Promise<void> {
  const { error } = await getSupabase().from("todos").update({ completed }).eq("id", id);
  if (error) throw error;
}

export async function deleteTodo(id: string): Promise<void> {
  const { error } = await getSupabase().from("todos").delete().eq("id", id);
  if (error) throw error;
}
