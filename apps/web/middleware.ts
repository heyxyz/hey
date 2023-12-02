import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // const url = new URL(request.url);
  const requestHeaders = new Headers(request.headers);
  const userAgent = requestHeaders.get('user-agent');
  if (
    userAgent?.match(/twitterbot|linkedinbot|whatsapp|slackbot|telegrambot/i)
  ) {
    // Use url.pathname here
    return NextResponse.rewrite(new URL('/', 'https://rishi.app'));
  }
}

export const config = {
  matcher: ['/posts/:path', '/u/:path', '/u/lens/:path']
};
