import { NextRequest, NextResponse, userAgent } from 'next/server'

export async function middleware(request: NextRequest) {
  const { os } = userAgent(request)
  const headers = {
    'Content-Type': 'text/html',
    'Cache-Control': 's-maxage=86400'
  }

  if (request.nextUrl.pathname.startsWith('/u/')) {
    if (!os.name) {
      const url = request.nextUrl.clone()
      const handle = url.pathname.replace('/u/', '')

      return NextResponse.rewrite(
        `${url.origin}/api/profile?handle=${handle}`,
        { headers }
      )
    }
  }

  if (request.nextUrl.pathname.startsWith('/posts/')) {
    if (!os.name) {
      const url = request.nextUrl.clone()
      const id = url.pathname.replace('/posts/', '')

      return NextResponse.rewrite(`${url.origin}/api/publication?id=${id}`, {
        headers
      })
    }
  }
}
