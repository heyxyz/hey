import logger from '@hey/helpers/logger';
import createClickhouseClient from 'src/helpers/createClickhouseClient';
import { lRange, lTrim } from 'src/helpers/redisClient';

const batchProcessEvents = async () => {
  const clickhouse = createClickhouseClient();

  try {
    const events = (await lRange('events', 0, 99)) || [];

    if (events.length === 0) {
      logger.info('[Cron] cleanClickhouse - No events to process');
    }

    const parsedEvents = events.map((event) => JSON.parse(event));

    await clickhouse.insert({
      format: 'JSONEachRow',
      table: 'events',
      values: parsedEvents
    });

    logger.info(
      `Cron] cleanClickhouse - Batch inserted ${events.length} events to Clickhouse`
    );

    await lTrim('events', events.length, -1);
  } catch {
    logger.error('[Cron] cleanClickhouse - Error processing events');
  }
};

export default batchProcessEvents;
