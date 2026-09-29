import { createServerFn } from "@tanstack/react-start";
import { useSession as getServerSession } from "@tanstack/react-start/server";

type AdminSession = {
  authenticated: boolean;
  username: string;
};

type LoginInput = {
  username: string;
  password: string;
};

type StoredUser = {
  username: string;
  passwordHash: string;
  createdAt: string;
};

type UserDirectory = {
  users: StoredUser[];
};

type CreateUserInput = LoginInput;

type DeleteUserInput = {
  username: string;
};

const DEFAULT_USERNAME = "admin";
const DEFAULT_PASSWORD_HASH = "8cc0e1da31a80f886f51a5eea2e04584b5c44b88356c3c81d6c53e1fa401e021";
const DEFAULT_SESSION_SECRET = "prime-motors-admin-session-2026-8f4d9c2a7e1b6f3d5a0c";

function sessionConfig() {
  return {
    name: "prime-motors-admin",
    password: process.env['ADMIN_SESSION_SECRET'] ?? DEFAULT_SESSION_SECRET,
    maxAge: 60 * 60 * 8,
    cookie: {
      httpOnly: true,
      sameSite: "strict" as const,
      secure: process.env['NODE_ENV'] === "production",
      path: "/",
    },
  };
}

function usersConfig() {
  return {
    ...sessionConfig(),
    name: "prime-motors-users",
    maxAge: 60 * 60 * 24 * 365,
  };
}

async function requireAdminSession() {
  const session = await getServerSession<AdminSession>(sessionConfig());
  if (session.data.authenticated !== true) throw new Error("Acesso não autorizado.");
  return session;
}

async function sha256(value: string) {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function safeEqual(left: string, right: string) {
  if (left.length !== right.length) return false;
  let difference = 0;
  for (let index = 0; index < left.length; index += 1) {
    difference |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }
  return difference === 0;
}

export const getAdminSession = createServerFn({ method: "GET" }).handler(async () => {
  const session = await getServerSession<AdminSession>(sessionConfig());
  return { authenticated: session.data.authenticated === true };
});

export const loginAdmin = createServerFn({ method: "POST" })
  .validator((input: LoginInput) => input)
  .handler(async ({ data }) => {
    const expectedUsername = process.env['ADMIN_USERNAME'] ?? DEFAULT_USERNAME;
    const expectedPasswordHash = process.env['ADMIN_PASSWORD_HASH'] ?? DEFAULT_PASSWORD_HASH;
    const suppliedHash = await sha256(data.password);
    const isMainAdmin =
      safeEqual(data.username.trim(), expectedUsername) &&
      safeEqual(suppliedHash, expectedPasswordHash);

    const directory = await getServerSession<UserDirectory>(usersConfig());
    const storedUser = (directory.data.users ?? []).find(
      (user) => user.username === data.username.trim(),
    );
    const isAdditionalUser = storedUser ? safeEqual(suppliedHash, storedUser.passwordHash) : false;

    const valid = isMainAdmin || isAdditionalUser;

    if (!valid) return { authenticated: false, error: "Usuário ou senha incorretos." };

    const session = await getServerSession<AdminSession>(sessionConfig());
    await session.update({ authenticated: true, username: data.username.trim() });
    return { authenticated: true, error: "" };
  });

export const logoutAdmin = createServerFn({ method: "POST" }).handler(async () => {
  const session = await getServerSession<AdminSession>(sessionConfig());
  await session.clear();
  return { authenticated: false };
});

export const listAdminUsers = createServerFn({ method: "GET" }).handler(async () => {
  await requireAdminSession();
  const directory = await getServerSession<UserDirectory>(usersConfig());
  const mainUsername = process.env['ADMIN_USERNAME'] ?? DEFAULT_USERNAME;
  return [
    { username: mainUsername, createdAt: "Administrador principal", removable: false },
    ...(directory.data.users ?? []).map((user) => ({
      username: user.username,
      createdAt: user.createdAt,
      removable: true,
    })),
  ];
});

export const createAdminUser = createServerFn({ method: "POST" })
  .validator((input: CreateUserInput) => input)
  .handler(async ({ data }) => {
    await requireAdminSession();
    const username = data.username.trim().toLowerCase();
    if (!/^[a-z0-9._-]{3,30}$/.test(username)) {
      return {
        success: false,
        error: "Use de 3 a 30 caracteres: letras, números, ponto, traço ou sublinhado.",
      };
    }
    if (data.password.length < 8) {
      return { success: false, error: "A senha precisa ter pelo menos 8 caracteres." };
    }

    const mainUsername = (process.env['ADMIN_USERNAME'] ?? DEFAULT_USERNAME).toLowerCase();
    const directory = await getServerSession<UserDirectory>(usersConfig());
    const currentUsers = directory.data.users ?? [];
    if (username === mainUsername || currentUsers.some((user) => user.username === username)) {
      return { success: false, error: "Este nome de usuário já está em uso." };
    }

    await directory.update({
      users: [
        ...currentUsers,
        {
          username,
          passwordHash: await sha256(data.password),
          createdAt: new Date().toISOString(),
        },
      ],
    });
    return { success: true, error: "" };
  });

export const deleteAdminUser = createServerFn({ method: "POST" })
  .validator((input: DeleteUserInput) => input)
  .handler(async ({ data }) => {
    await requireAdminSession();
    const directory = await getServerSession<UserDirectory>(usersConfig());
    await directory.update({
      users: (directory.data.users ?? []).filter((user) => user.username !== data.username),
    });
    return { success: true };
  });
