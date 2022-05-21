import { gql } from '@apollo/client'
import { CommentFields } from '@gql/CommentFields'
import { MirrorFields } from '@gql/MirrorFields'
import { PostFields } from '@gql/PostFields'
import { NextApiRequest, NextApiResponse } from 'next'
import { nodeClient } from 'src/apollo'
import { ERROR_MESSAGE } from 'src/constants'

const PUBLICATION_QUERY = gql`
  query Post($request: PublicationQueryRequest!) {
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

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { id } = req.query

    if (!id) {
      return res.status(200).json({ success: false, message: 'No id passed!' })
    }

    const { data } = await nodeClient.query({
      query: PUBLICATION_QUERY,
      variables: { request: { publicationId: id } }
    })

    if (data?.publication) {
      res.setHeader('Cache-Control', 's-maxage=86400')
      return res
        .status(200)
        .json({ success: true, publication: data?.publication })
    } else {
      return res
        .status(404)
        .json({ success: false, message: 'No publication found!' })
    }
  } catch (e) {
    return res.status(500).json({ success: false, message: ERROR_MESSAGE })
  }
}
