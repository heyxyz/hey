import { APP_NAME } from '@hey/data/constants';
import logger from '@hey/helpers/logger';
import axios from 'axios';
import lensPg from 'src/db/lensPg';
import { type Address, getAddress } from 'viem';

import sendEmail from '../sendEmail';

const getProfileId = async (
  formattedAddress: string
): Promise<null | string> => {
  const result = await lensPg.query(
    `
      SELECT profile_id, owned_by 
      FROM profile.record
      WHERE block_timestamp = (SELECT MAX(block_timestamp) FROM profile.record WHERE owned_by = $1)
      AND owned_by = $1
    `,
    [formattedAddress]
  );

  return result[0]?.profile_id || null;
};

const sendSignupInvoice = async (address: Address) => {
  if (!address) {
    return;
  }

  const formattedAddress = getAddress(address as Address);
  let profileId: null | string = null;
  let attempts = 0;

  while (!profileId && attempts < 5) {
    attempts++;
    logger.info(
      `sendSignupInvoice: Attempt ${attempts}: Fetching profile ID for ${formattedAddress}...`
    );
    profileId = await getProfileId(formattedAddress);

    if (!profileId) {
      logger.info(
        `sendSignupInvoice: No profile ID found for ${formattedAddress}, retrying...`
      );
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Add delay between retries if necessary
    }
  }

  if (!profileId) {
    logger.error(
      `sendSignupInvoice: Failed to find profile ID for ${formattedAddress} after ${attempts} attempts.`
    );
    return;
  }

  const { data: rates } = await axios.get('https://api.hey.xyz/lens/rate');
  const maticRate = rates.result.find(
    (rate: any) => rate.symbol === 'WMATIC'
  ).fiat;

  logger.info(`sendSignupInvoice: Sending signup invoice for ${profileId}`);

  await sendEmail({
    body: `
      <html>
        <body>
          <p>Welcome to Hey!</p> 
          <p>Here is your invoice for ${APP_NAME} profile signup.</p>
          <a href="https://invoice.hey.xyz/signup/${profileId}?rate=${maticRate}">Open Invoice →</a>
          <br>
          <br>
          <p>Thanks,</p>
          <p>${APP_NAME} team</p>
        </body>
      </html>
    `,
    recipient: `${formattedAddress}@skiff.com`,
    subject: `Invoice #${parseInt(profileId)} for ${APP_NAME} Profile Signup`
  });

  logger.info(
    `sendSignupInvoice: Signup Invoice #${parseInt(profileId)} sent for ${profileId}`
  );
};

export default sendSignupInvoice;
