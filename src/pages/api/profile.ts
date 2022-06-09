import { gql } from '@apollo/client'
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

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
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
      res.setHeader('Cache-Control', 's-maxage=86400')
      return res.status(200).json({ success: true, profile: data?.profile })
    } else {
      return res
        .status(404)
        .json({ success: false, message: 'No profile found!' })
    }
  } catch (e) {
    return res.status(500).json({ success: false, message: ERROR_MESSAGE })
  }
}
