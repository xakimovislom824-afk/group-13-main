import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Login talab qilinmaydigan sahifalar
const PUBLIC_ROUTES = ["/kirish", "/login", "/parolniTiklash", "/verify"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const accessToken =
    request.cookies.get("access")?.value ||
    request.headers.get("authorization")?.replace("Bearer ", "");

  const isPublic = PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );

  // Public sahifalarga login qilingan bo'lsa → /kabnet ga yuboramiz
  if (isPublic) {
    if (accessToken) {
      return NextResponse.redirect(new URL("/kabnet", request.url));
    }
    return NextResponse.next();
  }

  // Token yo'q bo'lsa → /kirish ga yuboramiz
  if (!accessToken) {
    const loginUrl = new URL("/kirish", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
