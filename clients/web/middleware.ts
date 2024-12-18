import { getAuthToken } from "@/lib/auth";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getAuthToken();

  const url = req.nextUrl.clone();

  if (!process.env.SESAME_USER_TOKEN && !token && url.pathname !== "/sign-in") {
    url.pathname = "/sign-in";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|sign-in).*)",
  ],
};
