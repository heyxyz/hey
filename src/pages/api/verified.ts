import { withSentry } from '@sentry/nextjs'
import { mainnetVerified, testnetVerified } from 'data/verified'
import { NextApiRequest, NextApiResponse } from 'next'
import { ERROR_MESSAGE } from 'src/constants'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.query?.network === 'testnet') {
      return res
        .status(200)
        .json({ success: true, profile_ids: testnetVerified })
    }

    return res.status(200).json({ success: true, profile_ids: mainnetVerified })
  } catch (e) {
    return res.status(500).json({ success: false, message: ERROR_MESSAGE })
  }
}

export default withSentry(handler)
