import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/u/')) {
    const isBot = request.headers.get('user-agent')?.match(/bot/i);
    if (!isBot) {
      return NextResponse.next();
    }

    const handle = request.nextUrl.pathname.replace('/u/', '');
    return NextResponse.rewrite(
      new URL(`https://prerender.hey.xyz/u/${handle}`)
    );
  }
}

export const config = {
  matcher: ['/u/:path*', '/posts/:path*']
};
