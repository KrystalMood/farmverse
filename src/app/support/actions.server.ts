"use server";
import { Auth } from "@/utils/auth";
import { Schema } from "@/utils/schema";
import { Prisma } from "@/utils/prisma";

export async function Support(_prev: { error?: Record<string, string>; redirect?: string; values?: Record<string, string> }, form: FormData): Promise<{ error?: Record<string, string>; redirect?: string; values?: Record<string, string> }> {
  const { error } = Auth.Validation(Schema.Feedback, Auth.ParseForm<typeof Schema.Feedback._output>(form));
  const values = {
    full_name: form.get("full_name")?.toString() ?? "",
    email: form.get("email")?.toString() ?? "",
    phone: form.get("phone")?.toString() ?? "",
    message: form.get("message")?.toString() ?? "",
  };
  if (error) return { error, values };

  try {
    await Prisma.feedback.create({ data: values });
    return { redirect: "/support" };
  } catch (err) {
    const e = err as any;
    if (e.code === 'P2002') {
      return { error: { email: 'Anda sudah mengirim pesan.' }, values };
    }
    throw err;
  }
}