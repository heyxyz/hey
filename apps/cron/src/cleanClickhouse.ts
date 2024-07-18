import clickhouseClient from '@hey/db/clickhouseClient';
import logger from '@hey/helpers/logger';

const cleanClickhouse = async () => {
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
