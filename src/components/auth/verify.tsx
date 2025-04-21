"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useActionState, useEffect, useTransition } from "react";
import { LockKeyhole, ShieldCheck, SquareUser } from "lucide-react";
import { Logout } from "@/actions/logout";
import { Google } from "@/actions/google";
import Form from "next/form";
import Text from "@/shared/form/text";
import Select from "@/shared/form/select";

// prettier-ignore
export function Verify() {
  const [googleState, googleAction, googlePending] = useActionState(Google, { error: {} });
  const [logoutState, logoutAction, logoutPending] = useActionState(Logout, null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const searchParams = useSearchParams();

  const accessToken = searchParams.get('access_token') || '';
  const refreshToken = searchParams.get('refresh_token') || '';

  useEffect(() => {
    if (typeof googleState.redirect === "string") router.push(googleState.redirect);
    if (logoutState && typeof logoutState.redirect === "string") router.push(logoutState.redirect);
  }, [logoutState, router, googleState]);

  return (
    <section className="bg-gradient-to-lr mx-auto flex w-4/5 flex-col items-center justify-center from-[#a9d6ff] to-[#edf2f7] bg-cover bg-center bg-no-repeat py-12 text-black lg:w-[65%]">
      <h3 className="cursor-default text-xl font-bold text-[#1a4167] lg:text-2xl">
        Selamat datang 🌿
      </h3>
      <h5 className="mt-1 cursor-default text-center text-sm text-gray-600 lg:mb-6 lg:text-base">
        Lengkapi informasi Anda untuk mulai menjelajahi solusi agrikultur
        berkelanjutan bersama kami.
      </h5>
      <Form action={googleAction} className="w-full">
        <input type="hidden" name="access_token" value={accessToken} />
        <input type="hidden" name="refresh_token" value={refreshToken} />
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
            value={googleState.values?.role}
          />
          <Text
            icon={<LockKeyhole />}
            label="Kata Sandi"
            name="password"
            placeholder="Masukkan kata sandi Anda"
            type="password"
            error={googleState.error?.password}
            value={googleState.values?.password}
          />
          <Text
            icon={<ShieldCheck />}
            label="Konfirmasi Kata Sandi"
            name="confirm_password"
            placeholder="Konfirmasi kata sandi Anda"
            type="password"
            error={googleState.error?.confirm_password}
            value={googleState.values?.confirm_password}
          />
        </div>
        <button
          type="submit"
          className="mt-10 w-full transform cursor-pointer rounded-lg bg-amber-500 p-4 font-semibold text-white transition-all duration-300 hover:scale-[1.02] hover:bg-amber-400 focus:outline-none"
          disabled={googlePending}
        >
          {googlePending ? "Memuat..." : "Masuk"}
        </button>
      </Form>
      <p className="mt-6 text-sm text-gray-600 text-center">
        Bukan kamu?{" "}
        <button
          type="button"
          onClick={() => startTransition(() => logoutAction())}
          className="cursor-pointer transition-colors duration-300 text-amber-600 underline hover:text-amber-500"
          disabled={isPending || logoutPending}
        >
          Keluar
        </button>
      </p>
      <h5 className="mt-8 cursor-default text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} Farmverse
      </h5>
    </section>
  );
}