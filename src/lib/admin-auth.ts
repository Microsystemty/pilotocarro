import { createServerFn } from "@tanstack/react-start";
import { useSession } from "@tanstack/react-start/server";

type AdminSession = {
  authenticated: boolean;
  username: string;
};

type LoginInput = {
  username: string;
  password: string;
};

const DEFAULT_USERNAME = "admin";
const DEFAULT_PASSWORD_HASH = "1a036617a40acfcc487fa3c64d9b8a128d7dc63564332a61f2ba095efbca63d7";
const DEFAULT_SESSION_SECRET = "prime-motors-admin-session-2026-8f4d9c2a7e1b6f3d5a0c";

function sessionConfig() {
  return {
    name: "prime-motors-admin",
    password: process.env.ADMIN_SESSION_SECRET ?? DEFAULT_SESSION_SECRET,
    maxAge: 60 * 60 * 8,
    cookie: {
      httpOnly: true,
      sameSite: "strict" as const,
      secure: process.env.NODE_ENV === "production",
      path: "/",
    },
  };
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
  const session = await useSession<AdminSession>(sessionConfig());
  return { authenticated: session.data.authenticated === true };
});

export const loginAdmin = createServerFn({ method: "POST" })
  .validator((input: LoginInput) => input)
  .handler(async ({ data }) => {
    const expectedUsername = process.env.ADMIN_USERNAME ?? DEFAULT_USERNAME;
    const expectedPasswordHash = process.env.ADMIN_PASSWORD_HASH ?? DEFAULT_PASSWORD_HASH;
    const suppliedHash = await sha256(data.password);
    const valid =
      safeEqual(data.username.trim(), expectedUsername) &&
      safeEqual(suppliedHash, expectedPasswordHash);

    if (!valid) return { authenticated: false, error: "Usuário ou senha incorretos." };

    const session = await useSession<AdminSession>(sessionConfig());
    await session.update({ authenticated: true, username: expectedUsername });
    return { authenticated: true, error: "" };
  });

export const logoutAdmin = createServerFn({ method: "POST" }).handler(async () => {
  const session = await useSession<AdminSession>(sessionConfig());
  await session.clear();
  return { authenticated: false };
});
