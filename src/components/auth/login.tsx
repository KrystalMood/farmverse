"use client";

import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";
import { LockKeyhole, Mail } from "lucide-react";
import { Login as Actions } from "@/actions/login";
import Form from "next/form";
import Link from "next/link";
import Text from "@/shared/form/text";
import { toast } from "sonner";

// prettier-ignore
export function Login() {
  const [state, action, pending] = useActionState(Actions, { error: {} });
  const router = useRouter();

  useEffect(() => {
    if (typeof state?.redirect === "string") router.push(state.redirect);
    if (state.error?.form) {
      toast.error(state.error.form);
    } else if (typeof state?.redirect === "string") {
      toast.success("Berhasil masuk!");
    }
  }, [router, state]);

  return (
    <section className="bg-gradient-to-lr mx-auto flex w-4/5 flex-col items-center justify-center from-[#a9d6ff] to-[#edf2f7] bg-cover bg-center bg-no-repeat py-12 text-black lg:w-[65%]">
      <h3 className="cursor-default text-xl font-bold text-[#1a4167] lg:text-2xl">
        Selamat datang 🌿
      </h3>
      <h5 className="mt-1 cursor-default text-center text-sm text-gray-600 lg:mb-6 lg:text-base">
        Bersama kita wujudkan agrikultur yang lebih adil dan berkelanjutan.
      </h5>
      <Form action={action} className="w-full">
        <div className="mt-6 space-y-5">
          <Text
            icon={<Mail />}
            label="Surel"
            name="email"
            placeholder="Masukkan surel Anda"
            type="email"
            autoComplete="email"
            error={state.error?.email}
          />
          <Text
            icon={<LockKeyhole />}
            label="Kata Sandi"
            name="password"
            placeholder="Masukkan kata sandi Anda"
            type="password"
            error={state.error?.password}
          />
        </div>
        <button
          type="submit"
          className="mt-10 w-full transform cursor-pointer rounded-lg bg-amber-500 p-4 font-semibold text-white transition-all duration-300 hover:scale-[1.02] hover:bg-amber-400 focus:outline-none"
          disabled={pending}
        >
          {pending ? "Memuat..." : "Masuk"}
        </button>
      </Form>
      <div className="mt-8 flex w-full flex-col items-center justify-between text-sm lg:flex-row lg:text-base">
        <Link href="/register" className="font-semibold text-teal-600 transition-colors duration-300 hover:underline lg:hover:text-teal-500">
          Belum Punya Akun?
        </Link>
        <Link href="/forgot-password" className="font-semibold text-slate-600 transition-colors duration-300 hover:underline lg:hover:text-slate-500">
          Lupa Kata Sandi?
        </Link>
      </div>
      <h5 className="mt-8 cursor-default text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} Farmverse
      </h5>
    </section>
  );
}
