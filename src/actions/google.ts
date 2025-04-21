"use server";

import { cookies } from "next/headers";
import { baseUrl } from "@/constants/base-url";
import { Auth } from "@/utils/auth";
import { Schema } from "@/utils/schema";
import { Login } from "@/types/auth";

// prettier-ignore
export async function Google(_prev: { error?: Record<string, string>; message?: string; redirect?: string; values?: Record<string, string> }, form: FormData): Promise<{ error?: Record<string, string>; message?: string; redirect?: string; values?: Record<string, string> }> {
  const cookie = await cookies();

  const values = {
    role: form.get("role")?.toString() ?? "",
    password: form.get("password")?.toString() ?? "",
    confirm_password: form.get("confirm_password")?.toString() ?? "",
    token: cookie.get("next-auth.session-token")?.value as string,
  };

  const { error } = Auth.Validation(Schema.Verify, Auth.ParseForm<typeof Schema.Verify._output>(form));
  if (error) return { error, values };

  try {
    const response = await fetch(`${await baseUrl()}/api/auth/google`, {
      method: "POST",
      body: JSON.stringify(values),
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) throw new Error((await response.json()).message || "Gagal masuk ke akun Anda.");

    const result = await response.json() as Login;
    const { role } = result.data;

    cookie.set("next-auth.session-token", result.data.access_token, {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    return { redirect: `/${role.toLowerCase()}`, message: "Akun berhasil diverifikasi!" };
  } catch (error) {
    console.error(process.env.NODE_ENV !== "production" && `Terjadi kesalahan saat memverifikasi akun Anda: ${error}`);
    return { error: { form: "Terjadi kesalahan saat memverifikasi akun Anda." } };
  }
}