import logger from '@hey/helpers/logger';
import { clickhouseClient } from 'src/helpers/clickhouseClient';
import { lRange, lTrim } from 'src/helpers/redisClient';

const batchProcessEvents = async () => {
  try {
    const startTime = Date.now();
    const events = (await lRange('events', 0, 9999)) || [];

    if (events.length === 0) {
      logger.info('[Cron] batchProcessEvents - No events to process');
      return;
    }

    const parsedEvents = events.map((event) => JSON.parse(event));

    await clickhouseClient.insert({
      format: 'JSONEachRow',
      table: 'events',
      values: parsedEvents
    });

    const endTime = Date.now();
    const timeTaken = endTime - startTime;

    logger.info(
      `[Cron] batchProcessEvents - Batch inserted ${events.length} events to Clickhouse in ${timeTaken}ms`
    );

    await lTrim('events', events.length, -1);
  } catch {
    logger.error('[Cron] batchProcessEvents - Error processing events');
  }
};

export default batchProcessEvents;
