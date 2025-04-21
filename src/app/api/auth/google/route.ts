import { NextResponse } from "next/server";
import { hash } from "bcrypt";
import { Prisma } from "@/utils/prisma";
import { Role } from "@/types/auth";

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const { role, password, token } = await request.json() as { role: Role, password: string, token: string };
    if (!role || !password) return NextResponse.json({ message: !role ? "Peran diperlukan!" : "Kata sandi diperlukan!" }, { status: 400 });

    const hashing = await hash(password, 10);
    const session = await Prisma.sessions.findFirst({ where: { token }, include: { user: true } });
    if (!session || !session.expires_at || new Date() > session.expires_at) return NextResponse.json({ message: "Sesi tidak valid" }, { status: 400 });

    const email = session.user.email;
    const user = await Prisma.users.findUnique({ where: { email } });
    if (!user) return NextResponse.json({ message: "Akun Anda tidak ditemukan." }, { status: 404 });

    const { id_user } = user;
    await Prisma.users.update({ where: { id_user }, data: { role, password: hashing }});

    return NextResponse.json({ message: "Berhasil masuk ke akun Anda." }, { status: 200 });
  } catch (error) {
    console.error(process.env.NODE_ENV !== "production" && `Terjadi kesalahan saat verifikasi token Google Anda: ${error}`);
    return NextResponse.json({ message: "Terjadi kesalahan saat verifikasi token Google Anda." }, { status: 400 });
  }
}