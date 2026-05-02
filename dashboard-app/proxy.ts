import { auth } from "./auth";

export default auth;

export const config = {
  matcher: [
    "/((?!api/auth|_next/static|_next/image|favicon\\.ico|uploads|logo\\.png|.*\\.(?:png|jpg|jpeg|gif|svg|ico|webp)$).*)",
  ],
};
