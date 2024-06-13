import { APP_NAME } from '@hey/data/constants';
import logger from '@hey/helpers/logger';
import axios from 'axios';
import lensPg from 'src/db/lensPg';
import { type Address, getAddress } from 'viem';

import sendEmail from '../sendEmail';

const sendSignupInvoice = async (address: Address) => {
  if (!address) {
    return;
  }

  const formattedAddress = getAddress(address as Address);

  const result = await lensPg.query(
    `
      SELECT profile_id, owned_by 
      FROM profile.record
      WHERE
        block_timestamp = (
          SELECT MAX(block_timestamp)
          FROM profile.record
          WHERE owned_by = $1
        )
      AND owned_by = $1
    `,
    [formattedAddress]
  );

  const profileId = result[0]?.profile_id;
  const { data: rates } = await axios.get('https://api.hey.xyz/lens/rate');
  const maticRate = rates.result.find(
    (rate: any) => rate.symbol === 'WMATIC'
  ).fiat;

  logger.info(`Sending signup invoice for ${profileId}`);

  await sendEmail({
    body: `
      <html>
        <body>
          <p>Welcome to Hey!</p> 
          <br>
          <p>Here is your invoice for ${APP_NAME} profile signup.</p>
          <a href="https://invoice.hey.xyz/signup/${profileId}?rate=${maticRate}">Open Invoice →</a>
          <br>
          <p>Thanks,</p>
          <p>${APP_NAME} team</p>
        </body>
      </html>
    `,
    recipient: `${formattedAddress}@skiff.com`,
    subject: `Invoice for ${APP_NAME} Profile Signup`
  });

  logger.info(`Signup Invoice #${parseInt(profileId)} sent for ${profileId}`);
};

export default sendSignupInvoice;
