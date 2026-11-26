const base = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
};
export const verifyCookie = {
    ...base,
    maxAge: 60 * 15,
};
export const accessCookie = {
    ...base,
    maxAge: 60 * 30,
};
export const refreshCookie = {
    ...base,
    maxAge: 60 * 60 * 24 * 7,
};
