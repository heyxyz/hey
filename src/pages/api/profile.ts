import { gql } from '@apollo/client'
import { MediaSet, NftImage, Profile } from '@generated/types'
import generateMeta from '@lib/generateMeta'
import getIPFSLink from '@lib/getIPFSLink'
import { withSentry } from '@sentry/nextjs'
import { NextApiRequest, NextApiResponse } from 'next'
import { nodeClient } from 'src/apollo'
import { ERROR_MESSAGE } from 'src/constants'

const PROFILE_QUERY = gql`
  query Profile($request: SingleProfileQueryRequest!) {
    profile(request: $request) {
      handle
      name
      bio
      stats {
        totalFollowers
        totalFollowing
      }
      picture {
        ... on MediaSet {
          original {
            url
          }
        }
        ... on NftImage {
          uri
        }
      }
    }
  }
`

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { handle } = req.query

    if (!handle) {
      return res
        .status(200)
        .json({ success: false, message: 'No handle passed!' })
    }

    const { data } = await nodeClient.query({
      query: PROFILE_QUERY,
      variables: { request: { handle } }
    })

    if (data?.profile) {
      const profile: Profile & { picture: MediaSet & NftImage } = data?.profile
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

      res.setHeader('Cache-Control', 's-maxage=86400')
      return res.send(generateMeta(title, description, image))
    } else {
      return res
        .status(404)
        .json({ success: false, message: 'No profile found!' })
    }
  } catch (e) {
    return res.status(500).json({ success: false, message: ERROR_MESSAGE })
  }
}

export default withSentry(handler)
