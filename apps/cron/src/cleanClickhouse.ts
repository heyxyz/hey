import clickhouseClient from '@hey/db/clickhouseClient';
import logger from '@hey/helpers/logger';

// Use this query to get the total size of all tables in Clickhouse
// SELECT
//   table,
//   formatReadableSize(sum(bytes_on_disk)) AS total_size
// FROM system.parts
// GROUP BY database, table
// ORDER BY total_size DESC;

const cleanClickhouse = async () => {
  const queries = [
    "ALTER TABLE events DELETE WHERE url NOT LIKE '%hey.xyz%';",
    'TRUNCATE TABLE system.processors_profile_log;',
    'TRUNCATE TABLE system.asynchronous_metric_log;',
    'TRUNCATE TABLE system.query_log;',
    'TRUNCATE TABLE system.query_log_0;',
    'TRUNCATE TABLE system.metric_log;',
    'TRUNCATE TABLE system.metric_log_0;',
    'TRUNCATE TABLE system.metric_log_1;',
    'TRUNCATE TABLE system.trace_log;',
    'TRUNCATE TABLE system.trace_log_0;',
    'TRUNCATE TABLE system.opentelemetry_span_log;',
    'TRUNCATE TABLE system.part_log;',
    'TRUNCATE TABLE system.part_log_0;'
  ];

  try {
    // Map each query to the clickhouse command and execute concurrently
    await Promise.all(
      queries.map((query) => clickhouseClient.command({ query }))
    );

    logger.info(
      '[Cron] cleanClickhouse - Cleaned non hey.xyz events and system logs from Clickhouse'
    );
  } catch (error) {
    logger.error('[Cron] cleanClickhouse - Error cleaning Clickhouse', error);
  }
};

export default cleanClickhouse;
