import React from "react";
import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";
import { Home, ShoppingCart, Heart, LogOut } from "lucide-react";
import { Logout } from "@/actions/logout";
import Image from "next/image";
import Form from "next/form";

function CustomerSidebar() {
  const router = useRouter();
  const [state, action] = useActionState(Logout, { oauth: false, redirect: "" });

  useEffect(() => {
    if (state && state.redirect) {
      router.push(state.redirect);
    }
  }, [router, state]);

  return (
    <aside className="fixed top-1/2 left-6 z-30 hidden h-[95svh] w-20 -translate-y-1/2 flex-col items-center rounded-xl border-2 border-amber-600 bg-amber-700 p-4 shadow-2xl transition-all duration-300 ease-in-out lg:flex">
      <section className="mb-4">
        <Image
          src="/favicon.ico"
          alt="Logo"
          width={40}
          height={40}
          className="rounded-full"
        />
      </section>
      <section className="flex flex-grow flex-col items-center justify-center space-y-6">
        <button
          className="text-white transition hover:text-amber-300"
          onClick={() => router.push("/customer")}
          title="Dashboard"
        >
          <Home size={24} />
        </button>
        <button
          className="text-white transition hover:text-amber-300"
          onClick={() => router.push("/customer/shop")}
          title="Shop"
        >
          <ShoppingCart size={24} />
        </button>
        <button
          className="text-white transition hover:text-amber-300"
          onClick={() => router.push("/customer/favorites")}
          title="Favorites"
        >
          <Heart size={24} />
        </button>
      </section>
      <Form action={action} className="mt-4">
        <button
          type="submit"
          className="text-white transition hover:text-red-400"
          title="Logout"
        >
          <LogOut size={20} />
        </button>
      </Form>
    </aside>
  );
}

export default CustomerSidebar;