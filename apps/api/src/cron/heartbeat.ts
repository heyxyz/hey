import logger from '@hey/helpers/logger';
import axios from 'axios';

const heartbeat = async () => {
  if (process.env.NEXT_PUBLIC_LENS_NETWORK !== 'mainnet') {
    return;
  }

  await axios.head(
    'https://status.hey.xyz/api/push/NM16jFPpBf?status=up&msg=OK&ping='
  );

  logger.info('[Cron] heartbeat - Heartbeat sent to Status API');
};

export default heartbeat;
