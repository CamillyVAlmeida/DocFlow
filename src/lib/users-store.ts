import { promises as fs } from "fs";
import path from "path";
import bcrypt from "bcryptjs";

export type UserRecord = {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  createdAt: string;
};

type UsersFile = { users: UserRecord[] };

const SALT_ROUNDS = 10;

function dataPath(): string {
  return path.join(process.cwd(), "data", "users.json");
}

async function ensureDataDir(): Promise<void> {
  const dir = path.join(process.cwd(), "data");
  await fs.mkdir(dir, { recursive: true });
}

async function readFile(): Promise<UsersFile> {
  try {
    const raw = await fs.readFile(dataPath(), "utf-8");
    const parsed = JSON.parse(raw) as UsersFile;
    if (!parsed.users || !Array.isArray(parsed.users)) {
      return { users: [] };
    }
    return parsed;
  } catch {
    return { users: [] };
  }
}

async function writeFile(data: UsersFile): Promise<void> {
  await ensureDataDir();
  await fs.writeFile(dataPath(), JSON.stringify(data, null, 2), "utf-8");
}

export async function findUserByEmail(email: string): Promise<UserRecord | undefined> {
  const normalized = email.trim().toLowerCase();
  const { users } = await readFile();
  return users.find((u) => u.email === normalized);
}

export async function findUserById(id: string): Promise<UserRecord | undefined> {
  const { users } = await readFile();
  return users.find((u) => u.id === id);
}

export async function listUsersForAssignment(): Promise<{ id: string; email: string; name: string }[]> {
  const { users } = await readFile();
  return users.map(({ id, email, name }) => ({ id, email, name }));
}

export async function createUser(input: {
  email: string;
  name: string;
  password: string;
}): Promise<UserRecord> {
  const email = input.email.trim().toLowerCase();
  const name = input.name.trim();
  if (!email || !name) {
    throw new Error("Dados inválidos");
  }
  const existing = await findUserByEmail(email);
  if (existing) {
    throw new Error("E-mail já cadastrado");
  }
  const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);
  const user: UserRecord = {
    id: crypto.randomUUID(),
    email,
    name,
    passwordHash,
    createdAt: new Date().toISOString(),
  };
  const file = await readFile();
  file.users.push(user);
  await writeFile(file);
  return user;
}

export async function verifyPassword(user: UserRecord, password: string): Promise<boolean> {
  return bcrypt.compare(password, user.passwordHash);
}
