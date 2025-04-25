"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, FormEvent } from "react";
import { LockKeyhole, ShieldCheck, SquareUser } from "lucide-react";
import Text from "@/shared/form/text";
import Select from "@/shared/form/select";

// prettier-ignore
export function Verify() {
  const [state, setState] = useState<{ error?: Record<string,string>; message?: string; redirect?: string; values?: Record<string,string> }>({ error: {} });
  const [pending, setPending] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (state.redirect) router.push(state.redirect);
  }, [state.redirect, router]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setPending(false);
  }

  return (
    <section className="bg-gradient-to-lr mx-auto flex w-4/5 flex-col items-center justify-center from-[#a9d6ff] to-[#edf2f7] bg-cover bg-center bg-no-repeat py-12 text-black lg:w-[65%]">
      <h3 className="cursor-default text-xl font-bold text-[#1a4167] lg:text-2xl">
        Selamat datang 🌿
      </h3>
      <h5 className="mt-1 cursor-default text-center text-sm text-gray-600 lg:mb-6 lg:text-base">
        Lengkapi informasi Anda untuk mulai menjelajahi solusi agrikultur
        berkelanjutan bersama kami.
      </h5>
      <form onSubmit={handleSubmit} className="w-full">
        {state.error?.form && (
          <h5 className="mb-4 text-sm text-red-500">{state.error.form}</h5>
        )}
        {state.message && (
          <h5 className="mb-4 text-sm text-green-600">{state.message}</h5>
        )}
        <div className="mt-6 space-y-5">
          <Select
            icon={<SquareUser />}
            label="Peran"
            name="role"
            placeholder="Masukkan peran Anda"
            options={[
              { label: "Farmer", value: "FARMER" },
              { label: "Bank", value: "BANK" },
              { label: "Customer", value: "CUSTOMER" },
            ]}
            value={state.values?.role}
            error={state.error?.role}
          />
          <Text
            icon={<LockKeyhole />}
            label="Kata Sandi"
            name="password"
            placeholder="Masukkan kata sandi Anda"
            type="password"
            error={state.error?.password}
            value={state.values?.password}
          />
          <Text
            icon={<ShieldCheck />}
            label="Konfirmasi Kata Sandi"
            name="confirm_password"
            placeholder="Konfirmasi kata sandi Anda"
            type="password"
            error={state.error?.confirm_password}
            value={state.values?.confirm_password}
          />
        </div>
        <span className="flex items-center justify-between"></span>
        <button
          type="submit"
          className="mt-10 w-full transform cursor-pointer rounded-lg bg-amber-500 p-4 font-semibold text-white transition-all duration-300 hover:scale-[1.02] hover:bg-amber-400 focus:outline-none"
          disabled={pending}
        >
          {pending ? "Memuat..." : "Masuk"}
        </button>
      </form>
      <h5 className="mt-8 cursor-default text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} Farmverse
      </h5>
    </section>
  );
}