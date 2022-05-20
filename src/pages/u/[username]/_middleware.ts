import { Profile } from '@generated/types'
import getAvatar from '@lib/getAvatar'
import { NextRequest } from 'next/server'
import parser from 'ua-parser-js'

export async function middleware(req: NextRequest) {
  const { headers } = req
  const url = req.nextUrl.clone()
  const username = url.pathname.replace('/u/', '')
  const ua = parser(headers.get('user-agent')!)

  if (!ua.os.name) {
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

  <meta property="og:url" content="https://lenster.xyz" />
  <meta property="og:site_name" content="Lenster" />
  <meta property="og:title" content="${`${profile?.name} (@${profile?.handle}) • Lenster`}" />
  <meta property="og:description" content="${profile?.bio}" />
  <meta property="og:image" content="${profile && getAvatar(profile)}" />
  <meta property="og:image:width" content="400" />
  <meta property="og:image:height" content="400" />

  <meta property="twitter:card" content="summary" />
  <meta property="twitter:site" content="Lenster" />
  <meta property="twitter:title" content="${`${profile?.name} (@${profile?.handle}) • Lenster`}" />
  <meta property="twitter:description" content="${profile?.bio}" />
  <meta property="twitter:image:src" content="${
    profile && getAvatar(profile)
  }" />
  <meta property="twitter:image:width" content="400" />
  <meta property="twitter:image:height" content="400" />
  <meta property="twitter:creator" content="lensterxyz" />
</html>`,
      { headers: { 'Content-Type': 'text/html' } }
    )
  }
}
