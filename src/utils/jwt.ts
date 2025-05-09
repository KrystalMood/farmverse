import { JWTPayload, SignJWT, jwtVerify } from "jose";
import { Role } from "@/types/auth";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "supersecretkey");

export class JWT {
  static async sign(payload: JWTPayload): Promise<string> {
    return await new SignJWT(payload).setProtectedHeader({ alg: "HS256" }).setExpirationTime("15m").sign(JWT_SECRET);
  }

  static async validate(origin: string, token: string, refreshToken: string) {
    const payload = await this.verify<{ id_user: string; role: string }>(token);
    if (payload && payload.role) return payload.role as Role;

    const response = await fetch(`${origin}/api/auth/verify-token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, refreshToken }),
    });

    if (!response.ok) throw new Error("Gagal untuk memvalidasi token!");

    const { role } = await response.json();
    if (payload?.role !== role) throw new Error("Peran Anda tidak valid.");
    return role;
  }

  static async verify<T>(token: string): Promise<T | null> {
    try {
      if (!token) return null;
      const { payload } = await jwtVerify(token, JWT_SECRET);
      return payload as T;
    } catch (error) {
      if (process.env.NODE_ENV !== "production") console.error(`Terdapat kesalahan pada token Anda: ${error}`);
      return null;
    }
  }
}