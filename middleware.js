export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/dashboard",
    "/teams",
    "/add-note",
    "/update-note",
    "/user-profile",
  ],
};
