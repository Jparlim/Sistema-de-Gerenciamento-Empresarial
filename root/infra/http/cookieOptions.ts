import { CookieSerializeOptions } from "@fastify/cookie";

const isProd = process.env.NODE_ENV === "production";

const base: CookieSerializeOptions = {
  httpOnly: true,
  path: "/",
  secure: isProd,
  sameSite: isProd ? "none" : "lax",
};

export const verifyCookie: CookieSerializeOptions = {
  ...base,
  maxAge: 60 * 15,
};

export const accessCookie: CookieSerializeOptions = {
  ...base,
  maxAge: 60 * 30,
};

export const refreshCookie: CookieSerializeOptions = {
  ...base,
  maxAge: 60 * 60 * 24 * 7,
};
