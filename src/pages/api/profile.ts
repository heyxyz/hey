import { PROFILE_QUERY } from '@components/Profile'
import { NextApiRequest, NextApiResponse } from 'next'
import { nodeClient } from 'src/apollo'
import { ERROR_MESSAGE } from 'src/constants'

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
      variables: { request: { handles: handle } }
    })

    if (data?.profiles?.items[0]) {
      return res
        .status(200)
        .json({ success: true, profile: data?.profiles?.items[0] })
    } else {
      return res
        .status(404)
        .json({ success: false, message: 'No profile found!' })
    }
  } catch (e) {
    return res.status(500).json({ success: false, message: ERROR_MESSAGE })
  }
}
