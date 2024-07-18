import clickhouseClient from '@hey/db/clickhouseClient';
import logger from '@hey/helpers/logger';
import { lRangeRedis, lTrimRedis } from 'src/helpers/redisClient';

const batchProcessEvents = async () => {
  try {
    const startTime = Date.now();
    const events = (await lRangeRedis('events', 0, 999999)) || [];

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

    await lTrimRedis('events', events.length, -1);
  } catch (error) {
    logger.error('[Cron] batchProcessEvents - Error processing events', error);
  }
};

export default batchProcessEvents;
