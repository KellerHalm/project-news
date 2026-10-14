import { type NextRequest, NextResponse } from 'next/server';

import { routes } from '@/shared/constants';

const TOKEN_COOKIE = 'token';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  // const token = request.cookies.get(TOKEN_COOKIE)?.value;
  const token = 'test-token';

  const isProfileRoute =
    pathname === routes.profile || pathname.startsWith(`${routes.profile}/`);

  if (isProfileRoute && !token) {
    return NextResponse.redirect(new URL(routes.home, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/profile', '/profile/:path*', '/auth', '/auth/:path*']
};
