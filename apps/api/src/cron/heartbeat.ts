import logger from '@hey/helpers/logger';
import axios from 'axios';

const heartbeat = async () => {
  if (process.env.NEXT_PUBLIC_LENS_NETWORK !== 'mainnet') {
    return;
  }

  await axios.head(
    'https://uptime.betterstack.com/api/v1/heartbeat/ikCu7EqaXdm2Fm2ShsYbKJKJ'
  );

  logger.info('Cron: heartbeat - Heartbeat sent to BetterStack');
};

export default heartbeat;
