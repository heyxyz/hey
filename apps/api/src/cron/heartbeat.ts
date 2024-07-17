import logger from '@hey/helpers/logger';
import axios from 'axios';

const heartbeat = async () => {
  if (process.env.NEXT_PUBLIC_LENS_NETWORK !== 'mainnet') {
    return;
  }

  try {
    await axios.head(
      'https://status.hey.xyz/api/push/NM16jFPpBf?status=up&msg=OK&ping='
    );

    logger.info('[Cron] heartbeat - Heartbeat sent to Status API');
  } catch (error) {
    logger.error('[Cron] heartbeat - Error sending heartbeat', error);
  }
};

export default heartbeat;
