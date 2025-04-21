import { headers } from "next/headers";

export const baseUrl = async () => {
  return `${process.env.NODE_ENV === "production" ? "https" : "http"}://${(await headers()).get("host")}`;
};