import { NextResponse } from "next/server";
import { JWT } from "@/utils/jwt";
import { Prisma } from "@/utils/prisma";
import { Token } from "@/types/auth";

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const body: Token = await request.json();
    const access_token = body.access_token;
    const refresh_token = body.refresh_token;
    if (!access_token || !refresh_token) return NextResponse.json({ message: "Token tidak valid." }, { status: 401 });

    const payload = await JWT.verify<{ id_user: string; role: string }>(access_token);
    if (!payload) return NextResponse.json({ message: "Gagal untuk memverifikasi token." }, { status: 401 });

    const session = await Prisma.sessions.findFirst({ where: { token: refresh_token },  include: { user: true } });
    if (!session || !session.expires_at || new Date() > session.expires_at) return NextResponse.json({ message: "Sesi tidak valid" }, { status: 401 });
    if (session.id_user !== payload.id_user) return NextResponse.json({ message: "Token tidak cocok dengan sesi" }, { status: 401 });

    return NextResponse.json({ role: session.user.role });
  } catch (error) {
    console.error(process.env.NODE_ENV !== "production" && `[Validation Error]: ${error}`);
    return NextResponse.json({ message: "Gagal untuk memvalidasi token!" }, { status: 500 });
  }
}