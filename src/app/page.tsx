import TodoList from "@/components/TodoList";

export default function Home() {
  return (
    <main className="min-h-screen bg-[var(--background)]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(59,130,246,0.15),transparent)] pointer-events-none" />
      <TodoList />
    </main>
  );
}
