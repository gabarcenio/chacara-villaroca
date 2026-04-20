import { cookies } from "next/headers";

const COOKIE = "vr_admin";

export async function isAdminAuthenticated() {
  const store = await cookies();
  return store.get(COOKIE)?.value === process.env.ADMIN_PASSWORD;
}

export function adminCookieHeader(password: string) {
  return `${COOKIE}=${password}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 24 * 30}`;
}

export function clearAdminCookieHeader() {
  return `${COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;
}
