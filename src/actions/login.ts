"use server";

import { cookies } from "next/headers";
import { baseUrl } from "@/constants/base-url";
import { Auth } from "@/utils/auth";
import { Schema } from "@/utils/schema";
import { Login as ILogin } from "@/types/auth";

export async function Login(_prev: { error?: Record<string, string>, redirect?: string; values?: Record<string, string> }, form: FormData): Promise<{ error?: Record<string, string>, redirect?: string, values?: Record<string, string> }> {
  const values = { email: form.get("email")?.toString() ?? "", password: form.get("password")?.toString() ?? "" };

  const { error } = Auth.Validation(Schema.Login, Auth.ParseForm<typeof Schema.Login._output>(form));
  if (error) return { error, values };

  try {
    const response = await fetch(`${await baseUrl()}/api/auth/login`, {
      body: JSON.stringify(values),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    });

    if (!response.ok) throw new Error((await response.json()).message || "Gagal masuk ke akun Anda.");

    const result = await response.json() as ILogin;
    if (!result.data || !result.data.role) throw new Error("Respons tidak valid dari server.");

    const { role } = result.data;
    if (!role) throw new Error("Peran Anda tidak ditemukan.");

    (await cookies()).set("access_token", result.data.access_token, {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 15,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    (await cookies()).set("refresh_token", result.data.refresh_token, {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    if (!["ADMIN", "BANK", "CUSTOMER", "FARMER"].includes(role)) throw new Error("Peran Anda tidak valid.");
    return { redirect: `/${role.toLowerCase()}` };
  } catch (error) {
    if (error instanceof Error) return { error: { form: error.message } };
    return { error: { form: "Terjadi kesalahan tidak dikenal." } };
  }
}