"use server";

import { cookies } from "next/headers";
import { baseUrl } from "@/constants/base-url";

export async function Logout(): Promise<{ message?: string; oauth: boolean; redirect: string }> {
  const cookie = await cookies();
  const refreshToken = cookie.get("refresh_token");
  const nextAuthToken = cookie.get("next-auth.session-token") || cookie.get("__Secure-next-auth.session-token");
  if (!refreshToken && !nextAuthToken) return { message: "Token tidak ditemukan!", oauth: true, redirect: "" };

  const response = await fetch(`${await baseUrl()}/api/auth/logout`, {
    body: JSON.stringify({ refresh_token: refreshToken?.value }),
    headers: { "Content-Type": "application/json" },
    method: "POST",
  });

  if (!response.ok) throw new Error("Gagal keluar dari akun Anda.");

  const result = await response.json();
  cookie.delete("refresh_token");
  cookie.delete("access_token");
  cookie.delete("next-auth.session-token");
  cookie.delete("__Secure-next-auth.session-token");
  cookie.delete("next-auth.callback-url");
  cookie.delete("next-auth.csrf-token");
  return { message: result.message, oauth: false, redirect: "/login" };
}