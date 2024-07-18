import logger from '@hey/helpers/logger';

const heartbeat = async () => {
  if (process.env.NEXT_PUBLIC_LENS_NETWORK !== 'mainnet') {
    return;
  }

  try {
    await fetch(
      'https://status.hey.xyz/api/push/NM16jFPpBf?status=up&msg=OK&ping=',
      { method: 'POST' }
    );

    logger.info('[Cron] heartbeat - Heartbeat sent to Status API');
  } catch (error) {
    logger.error('[Cron] heartbeat - Error sending heartbeat', error);
  }
};

export default heartbeat;
