/** Tipo alinhado aos módulos DocFlow (QA, Suporte, Requisitos). */
export type TaskTipo = "bug_qa" | "plano_teste" | "bug_cliente" | "doc_requisitos";

export const TASK_TIPO_VALUES: TaskTipo[] = ["bug_qa", "plano_teste", "bug_cliente", "doc_requisitos"];

export const TASK_TIPO_LABELS: Record<TaskTipo, string> = {
  bug_qa: "Bug QA",
  plano_teste: "Plano de teste",
  bug_cliente: "Bug de cliente",
  doc_requisitos: "Documento de requisitos",
};

export const DEFAULT_TASK_TIPO: TaskTipo = "plano_teste";

export function isTaskTipo(v: unknown): v is TaskTipo {
  return typeof v === "string" && TASK_TIPO_VALUES.includes(v as TaskTipo);
}
