import { CookieSerializeOptions } from "@fastify/cookie";

const base: CookieSerializeOptions = {
  httpOnly: true,
  secure: false,
  sameSite: "lax",
  path: "/",
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
