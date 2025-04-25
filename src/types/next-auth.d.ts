import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id_session: string;
      role: string;
      session_token: string;
      token: string;
    } & DefaultSession["user"];
  }

  interface User {
    id_user: string;
    role: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id_session: string;
    id_user: string;
    role: string;
    session_token: string;
  }
}