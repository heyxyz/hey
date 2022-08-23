import { gql } from '@apollo/client';
import { withSentry } from '@sentry/nextjs';
import { NextApiRequest, NextApiResponse } from 'next';
import { nodeClient } from 'src/apollo';
import { ERROR_MESSAGE } from 'src/constants';

const PING_QUERY = gql`
  query Ping {
    profile(request: { profileId: "0x0d" }) {
      id
    }
  }
`;

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { data, networkStatus } = await nodeClient.query({
      query: PING_QUERY
    });

    return res
      .status(networkStatus === 7 ? 200 : 500)
      .json({ success: networkStatus === 7, ping: data?.profile?.id === '0x0d' ? 'pong' : 'oops' });
  } catch {
    return res.status(500).json({ success: false, message: ERROR_MESSAGE });
  }
};

export default withSentry(handler);
