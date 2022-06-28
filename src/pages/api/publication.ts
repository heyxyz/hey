import { gql } from '@apollo/client'
import { Publication } from '@generated/types'
import { CommentFields } from '@gql/CommentFields'
import { MirrorFields } from '@gql/MirrorFields'
import { PostFields } from '@gql/PostFields'
import generateMeta from '@lib/generateMeta'
import getIPFSLink from '@lib/getIPFSLink'
import { withSentry } from '@sentry/nextjs'
import { NextApiRequest, NextApiResponse } from 'next'
import { nodeClient } from 'src/apollo'
import { ERROR_MESSAGE } from 'src/constants'

const PUBLICATION_QUERY = gql`
  query Post(
    $request: PublicationQueryRequest!
    $reactionRequest: ReactionFieldResolverRequest
  ) {
    publication(request: $request) {
      ... on Post {
        ...PostFields
      }
      ... on Comment {
        ...CommentFields
      }
      ... on Mirror {
        ...MirrorFields
      }
    }
  }
  ${PostFields}
  ${CommentFields}
  ${MirrorFields}
`

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { id } = req.query

    if (!id) {
      return res.status(200).json({ success: false, message: 'No id passed!' })
    }

    const { data } = await nodeClient.query({
      query: PUBLICATION_QUERY,
      variables: {
        request: { publicationId: id },
        reactionRequest: null
      }
    })

    if (data?.publication) {
      const publication: Publication = data?.publication
      const profile: any =
        publication?.__typename === 'Mirror'
          ? publication?.mirrorOf?.profile
          : publication?.profile

      const title = `${
        publication?.__typename === 'Post' ? 'Post' : 'Comment'
      } by @${profile.handle} • Lenster`
      const description = publication.metadata?.content ?? ''
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
        .json({ success: false, message: 'No publication found!' })
    }
  } catch (e) {
    return res.status(500).json({ success: false, message: ERROR_MESSAGE })
  }
}

export default withSentry(handler)
