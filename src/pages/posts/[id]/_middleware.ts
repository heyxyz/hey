import { Publication } from '@generated/types'
import generateMeta from '@lib/generateMeta'
import getIPFSLink from '@lib/getIPFSLink'
import { NextRequest } from 'next/server'
import parser from 'ua-parser-js'

export async function middleware(req: NextRequest) {
  const { headers } = req
  const url = req.nextUrl.clone()
  const id = url.pathname.replace('/posts/', '')
  const ua = parser(headers.get('user-agent')!)

  if (!ua.os.name) {
    const result = await fetch(`${url.origin}/api/publication?id=${id}`)
    const data = await result.json()
    const publication: Publication = data?.publication
    const profile =
      publication?.__typename === 'Mirror'
        ? publication?.mirrorOf?.profile
        : publication?.profile

    if (data?.success) {
      const title = `${
        publication?.__typename === 'Post' ? 'Post' : 'Comment'
      } by @${profile.handle} • Lenster`
      const description = publication.metadata?.content ?? ''
      const image = profile
        ? `https://ik.imagekit.io/lensterimg/tr:n-avatar/${getIPFSLink(
            // @ts-ignore
            profile?.picture?.original?.url ??
              // @ts-ignore
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
