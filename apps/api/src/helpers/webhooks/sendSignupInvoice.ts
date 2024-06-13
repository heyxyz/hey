import { APP_NAME } from '@hey/data/constants';
import { POYGON_WRITE_RPC } from '@hey/data/rpcs';
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

import sendEmail from '../sendEmail';

const MAX_RETRIES = 10;
const RETRY_DELAY_MS = 2000;

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
          `sendSignupInvoice: Attempt ${attempt} failed. Retrying in ${RETRY_DELAY_MS / 1000} seconds...`
        );
        await sleep(RETRY_DELAY_MS);
      } else {
        throw new Error(`sendSignupInvoice: Failed after ${retries} attempts`);
      }
    }
  }
};

const sendSignupInvoice = async (hash: Address, address: Address) => {
  if (!hash) {
    return;
  }

  logger.info(`sendSignupInvoice: Fetching transaction receipt for ${hash}`);

  const client = createPublicClient({
    chain: polygon,
    transport: http(POYGON_WRITE_RPC)
  });

  const receipt = await fetchTransactionReceiptWithRetry(client, hash);

  const log = receipt.logs.find(
    (log: any) =>
      log.topics[0] ===
      '0x30a132e912787e50de6193fe56a96ea6188c0bbf676679d630a25d3293c3e19a'
  );

  const data = log?.data;
  const decodedData = decodeEventLog({
    abi: parseAbi([
      'event HandleMinted(string handle, string namespace, uint256 handleId, address to, uint256 timestamp)'
    ]),
    data,
    topics: [
      '0x30a132e912787e50de6193fe56a96ea6188c0bbf676679d630a25d3293c3e19a'
    ]
  });

  const handle = decodedData.args?.handle;

  if (!handle) {
    return;
  }

  const { data: rates } = await axios.get('https://api.hey.xyz/lens/rate');
  const maticRate = rates.result.find(
    (rate: any) => rate.symbol === 'WMATIC'
  ).fiat;

  logger.info(`sendSignupInvoice: Sending signup invoice for @${handle}`);

  await sendEmail({
    body: `
      <html>
        <body>
          <p>Welcome to Hey!</p> 
          <p>Here is your invoice for ${APP_NAME} profile signup.</p>
          <a href="https://invoice.hey.xyz/signup/${handle}?rate=${maticRate}">Open Invoice →</a>
          <br>
          <br>
          <p>Thanks,</p>
          <p>${APP_NAME} team</p>
        </body>
      </html>
    `,
    recipient: `${address}@skiff.com`,
    subject: `Invoice for @${handle} for ${APP_NAME} Profile Signup`
  });

  logger.info(`sendSignupInvoice: Signup Invoice for @${handle} sent`);
};

export default sendSignupInvoice;
