import { POLYGONSCAN_URL } from '@hey/data/constants';
import { POLYGON_WRITE_RPC } from '@hey/data/rpcs';
import logger from '@hey/helpers/logger';
import axios from 'axios';
import {
  type Address,
  createPublicClient,
  decodeEventLog,
  http,
  parseAbi
} from 'viem';
import { polygon } from 'viem/chains';

import sendSlackMessage from '../slack';

const MAX_RETRIES = 10;
const RETRY_DELAY_MS = 3000;
const TOPIC =
  '0x30a132e912787e50de6193fe56a96ea6188c0bbf676679d630a25d3293c3e19a';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const fetchTransactionReceiptWithRetry = async (
  client: any,
  hash: Address,
  retries: number = MAX_RETRIES
): Promise<any> => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await client.getTransactionReceipt({ hash });
    } catch (error) {
      if (attempt < retries) {
        logger.error(
          `sendSignupNotificationToSlack: Attempt ${attempt} failed. Retrying in ${RETRY_DELAY_MS / 1000} seconds...`
        );
        await sleep(RETRY_DELAY_MS);
      } else {
        throw new Error(
          `sendSignupNotificationToSlack: Failed after ${retries} attempts`
        );
      }
    }
  }
};

const sendSignupNotificationToSlack = async (hash: Address) => {
  if (!hash) {
    return;
  }

  logger.info(
    `sendSignupNotificationToSlack: Fetching transaction receipt for ${hash}`
  );

  try {
    const client = createPublicClient({
      chain: polygon,
      transport: http(POLYGON_WRITE_RPC)
    });

    const receipt = await fetchTransactionReceiptWithRetry(client, hash);

    const log = receipt.logs.find((log: any) => log.topics[0] === TOPIC);

    const data = log?.data;
    const decodedData = decodeEventLog({
      abi: parseAbi([
        'event HandleMinted(string handle, string namespace, uint256 handleId, address to, uint256 timestamp)'
      ]),
      data,
      topics: [TOPIC]
    });

    const handle = decodedData.args?.handle;

    if (!handle) {
      return;
    }

    const { data: rates } = await axios.get('https://api.hey.xyz/lens/rate');
    const maticRate = rates.result.find(
      (rate: any) => rate.symbol === 'WMATIC'
    ).fiat;

    logger.info(
      `sendSignupNotificationToSlack: Sending signup invoice to Slack`
    );

    await sendSlackMessage({
      channel: '#signups',
      color: '#22c55e',
      fields: [
        {
          short: false,
          title: 'Transaction',
          value: `${POLYGONSCAN_URL}/tx/${hash}`
        },
        {
          short: false,
          title: 'Profile',
          value: `https://hey.xyz/u/${handle}`
        },
        {
          short: false,
          title: 'Invoice',
          value: `https://invoice.hey.xyz/signup/${handle}?rate=${maticRate}`
        },
        {
          short: false,
          title: 'Amount',
          value: `${maticRate * 8} USD`
        }
      ],
      text: ':tada: A new profile has been signed up to :hey:'
    });

    logger.info(
      `sendSignupNotificationToSlack: Signup Invoice for @${handle} sent to Slack`
    );
  } catch (error) {
    logger.error(
      'sendSignupNotificationToSlack: Failed to send signup notification to Slack',
      error as Error
    );
  }
};

export default sendSignupNotificationToSlack;
