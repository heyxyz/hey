import { Profile } from '@generated/types'
import { NextRequest, NextResponse } from 'next/server'

export async function middleware(req: NextRequest, res: NextResponse) {
  const { headers } = req
  const url = req.nextUrl.clone()
  const username = url.pathname.replace('/u/', '')
  const ua = headers.get('user-agent')

  if (ua === 'googlebot') {
    const result = await fetch(
      `http://localhost:4783/api/profile?handle=${username}`
    )
    const data = await result.json()
    const profile: Profile = data?.profile

    return new Response(
      `<!DOCTYPE html>
<html lang="en">
  <title>${`${profile?.name} (@${profile?.handle}) • Lenster`}</title>
  <meta name="description" content="${profile?.bio}" />
</html>`,
      { headers: { 'Content-Type': 'text/html' } }
    )
  }
}
