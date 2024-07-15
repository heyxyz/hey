import logger from '@hey/helpers/logger';
import createClickhouseClient from 'src/helpers/createClickhouseClient';
import { lRange, lTrim } from 'src/helpers/redisClient';

const batchProcessImpressions = async () => {
  const clickhouse = createClickhouseClient();

  try {
    const startTime = Date.now();
    const impressions = (await lRange('impressions', 0, 999)) || [];

    if (impressions.length === 0) {
      logger.info('[Cron] batchProcessImpressions - No impressions to process');
      return;
    }

    const parsedImpressions = impressions.flatMap((impression) =>
      JSON.parse(impression)
    );

    await clickhouse.insert({
      format: 'JSONEachRow',
      table: 'impressions',
      values: parsedImpressions
    });

    const endTime = Date.now();
    const timeTaken = endTime - startTime;

    logger.info(
      `[Cron] batchProcessImpressions - Batch inserted ${parsedImpressions.length} impressions to Clickhouse in ${timeTaken}ms`
    );

    await lTrim('impressions', impressions.length, -1);
  } catch {
    logger.error(
      '[Cron] batchProcessImpressions - Error processing impressions'
    );
  }
};

export default batchProcessImpressions;
