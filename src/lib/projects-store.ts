import { promises as fs } from "fs";
import path from "path";
import { dataFilePath } from "./data-dir";
import { deleteTasksByProjectId } from "./tasks-store";

export type ProjectRecord = {
  id: string;
  title: string;
  description: string;
  createdAt: string;
};

type ProjectsFile = { projects: ProjectRecord[] };

function dataPath(): string {
  return dataFilePath("projects.json");
}

async function ensureDataDir(): Promise<void> {
  await fs.mkdir(path.dirname(dataPath()), { recursive: true });
}

async function readFile(): Promise<ProjectsFile> {
  try {
    const raw = await fs.readFile(dataPath(), "utf-8");
    const parsed = JSON.parse(raw) as ProjectsFile;
    if (!parsed.projects || !Array.isArray(parsed.projects)) {
      return { projects: [] };
    }
    return parsed;
  } catch {
    return { projects: [] };
  }
}

async function writeFile(data: ProjectsFile): Promise<void> {
  await ensureDataDir();
  await fs.writeFile(dataPath(), JSON.stringify(data, null, 2), "utf-8");
}

export async function listProjects(): Promise<ProjectRecord[]> {
  const { projects } = await readFile();
  return [...projects].sort((a, b) => a.title.localeCompare(b.title, "pt-BR"));
}

export async function getProject(id: string): Promise<ProjectRecord | undefined> {
  const { projects } = await readFile();
  return projects.find((p) => p.id === id);
}

export async function createProject(input: { title: string; description?: string }): Promise<ProjectRecord> {
  const title = input.title.trim();
  if (!title) {
    throw new Error("Título do projeto é obrigatório");
  }
  const project: ProjectRecord = {
    id: crypto.randomUUID(),
    title,
    description: typeof input.description === "string" ? input.description.trim() : "",
    createdAt: new Date().toISOString(),
  };
  const file = await readFile();
  file.projects.push(project);
  await writeFile(file);
  return project;
}

export async function updateProject(
  id: string,
  input: { title?: string; description?: string }
): Promise<ProjectRecord | undefined> {
  const file = await readFile();
  const p = file.projects.find((x) => x.id === id);
  if (!p) return undefined;
  if (typeof input.title === "string") {
    const t = input.title.trim();
    if (t) p.title = t;
  }
  if (typeof input.description === "string") {
    p.description = input.description.trim();
  }
  await writeFile(file);
  return p;
}

export async function deleteProject(id: string): Promise<boolean> {
  const file = await readFile();
  const idx = file.projects.findIndex((p) => p.id === id);
  if (idx === -1) return false;
  await deleteTasksByProjectId(id);
  file.projects.splice(idx, 1);
  await writeFile(file);
  return true;
}
