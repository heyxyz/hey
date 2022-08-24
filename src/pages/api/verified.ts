import { withSentry } from '@sentry/nextjs';
import { mainnetVerified, testnetVerified } from 'data/verified';
import { NextApiRequest, NextApiResponse } from 'next';
import { ERROR_MESSAGE, IS_MAINNET } from 'src/constants';

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  try {
    return res
      .status(200)
      .setHeader('Cache-Control', 's-maxage=86400')
      .json({
        success: true,
        network: IS_MAINNET ? 'mainnet' : 'testnet',
        profile_ids: IS_MAINNET ? mainnetVerified : testnetVerified
      });
  } catch {
    return res.status(500).json({ success: false, message: ERROR_MESSAGE });
  }
};

export default withSentry(handler);
