import { gql } from '@apollo/client'
import { NextApiRequest, NextApiResponse } from 'next'
import { nodeClient } from 'src/apollo'
import { ERROR_MESSAGE } from 'src/constants'

const PING_QUERY = gql`
  query Ping {
    ping
  }
`

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { data, networkStatus } = await nodeClient.query({
      query: PING_QUERY
    })

    return res
      .status(networkStatus === 7 ? 200 : 500)
      .json({ success: networkStatus === 7, ping: data?.ping })
  } catch (e) {
    return res.status(500).json({ success: false, message: ERROR_MESSAGE })
  }
}
