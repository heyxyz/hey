import logger from '@hey/helpers/logger';
import { clickhouseClient } from 'src/helpers/clickhouseClient';

const cleanClickhouse = async () => {
  if (process.env.NEXT_PUBLIC_LENS_NETWORK !== 'mainnet') {
    return;
  }

  await clickhouseClient.command({
    query: "ALTER TABLE events DELETE WHERE url NOT LIKE '%hey.xyz%';"
  });
  logger.info(
    '[Cron] cleanClickhouse - Cleaned non hey.xyz events from Clickhouse'
  );
};

export default cleanClickhouse;
