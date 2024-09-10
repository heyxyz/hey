import clickhouseClient from '@hey/db/clickhouseClient';
import logger from '@hey/helpers/logger';

// SELECT
//   table,
//   formatReadableSize(sum(bytes_on_disk)) AS total_size
// FROM system.parts
// GROUP BY database, table
// ORDER BY total_size DESC;

const cleanClickhouse = async () => {
  try {
    await clickhouseClient.command({
      query: "ALTER TABLE events DELETE WHERE url NOT LIKE '%hey.xyz%';"
    });

    // Truncate all Clickhouse system logs
    await clickhouseClient.command({
      query: 'TRUNCATE TABLE system.processors_profile_log;'
    });
    await clickhouseClient.command({
      query: 'TRUNCATE TABLE system.asynchronous_metric_log;'
    });
    await clickhouseClient.command({
      query: 'TRUNCATE TABLE system.query_log;'
    });
    await clickhouseClient.command({
      query: 'TRUNCATE TABLE system.metric_log;'
    });
    await clickhouseClient.command({
      query: 'TRUNCATE TABLE system.trace_log;'
    });

    logger.info(
      '[Cron] cleanClickhouse - Cleaned non hey.xyz events from Clickhouse'
    );
  } catch (error) {
    logger.error('[Cron] cleanClickhouse - Error cleaning Clickhouse', error);
  }
};

export default cleanClickhouse;
