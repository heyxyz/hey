import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  const userAgent = requestHeaders.get('user-agent');
  if (
    userAgent?.match(
      /twitterbot|linkedinbot|whatsapp|slackbot|telegrambot|discordbot|facebookbot/i
    )
  ) {
    // return NextResponse.rewrite(new URL(url.pathname, 'https://my-og-service.railway.app'));
    return NextResponse.rewrite(new URL('/', 'https://rishi.app'));
  }
}

export const config = {
  matcher: ['/posts/:path*', '/u/:path*', '/u/lens/:path*']
};
