import { rewrite } from '@vercel/edge';

export default function handler(request: Request) {
  // const url = new URL(request.url);
  const userAgent = request.headers.get('user-agent');
  if (
    userAgent?.match(/twitterbot|linkedinbot|whatsapp|slackbot|telegrambot/i)
  ) {
    // return rewrite(new URL(url.pathname, 'https://my-og-service.railway.app'));
    return rewrite(new URL('/', 'https://rishi.app'));
  }
}

export const config = {
  matcher: ['/posts/:path', '/u/:path', '/u/lens/:path']
};
