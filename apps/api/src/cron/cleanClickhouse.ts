import logger from '@hey/helpers/logger';
import createClickhouseClient from 'src/helpers/createClickhouseClient';

const clickhouse = createClickhouseClient();

const cleanClickhouse = async () => {
  await clickhouse.command({
    query: "ALTER TABLE events DELETE WHERE url NOT LIKE '%hey.xyz%';"
  });
  logger.info('Cron: Cleaned non hey.xyz events from Clickhouse');
};

export default cleanClickhouse;
