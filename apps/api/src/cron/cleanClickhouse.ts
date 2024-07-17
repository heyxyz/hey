import logger from '@hey/helpers/logger';
import { clickhouseClient } from 'src/helpers/clickhouseClient';

const cleanClickhouse = async () => {
  if (process.env.NEXT_PUBLIC_LENS_NETWORK !== 'mainnet') {
    return;
  }

  try {
    await clickhouseClient.command({
      query: "ALTER TABLE events DELETE WHERE url NOT LIKE '%hey.xyz%';"
    });

    logger.info(
      '[Cron] cleanClickhouse - Cleaned non hey.xyz events from Clickhouse'
    );
  } catch (error) {
    logger.error('[Cron] cleanClickhouse - Error cleaning Clickhouse', error);
  }
};

export default cleanClickhouse;
