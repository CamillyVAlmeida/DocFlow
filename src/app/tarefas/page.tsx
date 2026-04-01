"use client";

import { TarefasBoard } from "@/components/TarefasBoard";

export default function TarefasPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <header className="mb-8">
        <h1 className="mb-2 text-2xl font-bold text-slate-800 dark:text-slate-100">Tarefas</h1>
        <p className="text-slate-600 dark:text-slate-400">
          Organize o trabalho da equipe em projetos: defina responsáveis, prazos e prioridades e acompanhe o andamento no
          quadro.
        </p>
      </header>
      <TarefasBoard />
    </div>
  );
}
