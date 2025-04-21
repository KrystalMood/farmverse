import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { randomUUID } from "crypto";
import { Prisma } from "@/utils/prisma";
import NextAuth, { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const createUserIfNotExists = async (email: string, name?: string | null | undefined) => {
  const existingUser = await Prisma.users.findUnique({ where: { email } });
  if (existingUser) return existingUser;

  try {
    return await Prisma.users.create({
      data: {
        username: name ?? email ?? "Tidak Diketahui",
        name: name ?? email ?? "Tidak Diketahui",
        email,
        password: null,
        role: "UNKNOWN",
      },
    });
  } catch (error) {
    console.error(process.env.NODE_ENV !== "production" && `Gagal membuat pengguna: ${error}`);
    throw new Error("Gagal membuat pengguna.");
  }
};

const google: AuthOptions = {
  adapter: PrismaAdapter(Prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== "google" || !user.email) return false;
      const dbUser = await createUserIfNotExists(user.email, user.name);
      const existingSession = await Prisma.sessions.findFirst({ where: { id_user: dbUser!.id_user } });
      if (!existingSession) await Prisma.sessions.create({ data: { id_user: dbUser!.id_user, token: account.access_token ?? randomUUID() } });
      return true;
    },
    async jwt({ token, user, account }) {
      if (user?.email) {
        const dbUser = await Prisma.users.findUnique({ where: { email: user.email } });
        const dbSession = await Prisma.sessions.findUnique({ where: { id_user: dbUser?.id_user } });
        if (dbUser) {
          token.role = dbUser.role;
          token.id_user = dbUser.id_user;
          token.id_session = dbSession?.id_user as string;

          const existing = await Prisma.sessions.findFirst({ where: { id_user: dbUser.id_user } });
          if (!existing) await Prisma.sessions.create({ data: { id_user: dbUser.id_user, token: account?.access_token ?? randomUUID() } });
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
        session.user.role = token.role as string;
        session.user.id_session = token.id_user as string;
        session.user.session_token = token.session_token as string;
      }
      return session;
    },
    redirect({ url, baseUrl }) {
      const isInternalUrl = url.startsWith(baseUrl) || url.startsWith("/");
      return isInternalUrl ? (url.startsWith("/") ? `${baseUrl}${url}` : url) : baseUrl;
    },
  },
  pages: { signIn: "/login", signOut: "/login", error: "/login" },
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
};

const handler = NextAuth(google);
export { handler as GET, handler as POST };