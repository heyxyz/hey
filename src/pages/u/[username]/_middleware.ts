import { MediaSet, NftImage, Profile } from '@generated/types'
import generateMeta from '@lib/generateMeta'
import getIPFSLink from '@lib/getIPFSLink'
import { NextRequest } from 'next/server'
import parser from 'ua-parser-js'

export async function middleware(req: NextRequest) {
  const { headers } = req
  const ua = parser(headers.get('user-agent')!)

  if (!ua.os.name) {
    const url = req.nextUrl.clone()
    const username = url.pathname.replace('/u/', '')
    const result = await fetch(`${url.origin}/api/profile?handle=${username}`)
    const data = await result.json()
    const profile: Profile & { picture: MediaSet & NftImage } = data?.profile

    if (data?.success) {
      const title = profile?.name
        ? `${profile?.name} (@${profile?.handle}) • Lenster`
        : `@${profile?.handle} • Lenster`
      const description = profile?.bio ?? ''
      const image = profile
        ? `https://ik.imagekit.io/lensterimg/tr:n-avatar/${getIPFSLink(
            profile?.picture?.original?.url ??
              profile?.picture?.uri ??
              `https://avatar.tobi.sh/${profile?.ownedBy}_${profile?.handle}.png`
          )}`
        : 'https://assets.lenster.xyz/images/og/logo.jpeg'

      return new Response(generateMeta(title, description, image), {
        headers: {
          'Content-Type': 'text/html',
          'Cache-Control': 's-maxage=86400'
        }
      })
    }
  }
}
