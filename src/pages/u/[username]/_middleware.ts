import { Profile } from '@generated/types'
import generateMeta from '@lib/generateMeta'
import { NextRequest } from 'next/server'
import parser from 'ua-parser-js'

export async function middleware(req: NextRequest) {
  const { headers } = req
  const url = req.nextUrl.clone()
  const username = url.pathname.replace('/u/', '')
  const ua = parser(headers.get('user-agent')!)

  if (!ua.os.name) {
    const result = await fetch(`${url.origin}/api/profile?handle=${username}`)
    const data = await result.json()
    const profile: Profile = data?.profile

    const title = `${profile?.name} (@${profile?.handle}) • Lenster`

    console.log(data)

    return new Response(generateMeta(title), {
      headers: { 'Content-Type': 'text/html' }
    })
  }
}
