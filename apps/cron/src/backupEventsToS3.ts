import clickhouseClient from "@hey/db/clickhouseClient";
import { generateForeverExpiry, getRedis, setRedis } from "@hey/db/redisClient";
import logger from "@hey/helpers/logger";

const backupEventsToS3 = async () => {
  try {
    const cacheKey = "backups:events:offset";
    const batchSize = 100000;

    // Get the last offset from Redis (or start from 0 if no offset is stored)
    let offset = Number.parseInt((await getRedis(cacheKey)) || "0", 10);

    // Calculate the range for the current batch
    const startRange = offset;
    const endRange = offset + batchSize;
    const s3Path = `events-${startRange}-${endRange}.csv`;

    // Check the number of rows in the current batch
    const rowsCountResult = await clickhouseClient.query({
      format: "JSONEachRow",
      query: `
        SELECT count(*) as count
        FROM (
            SELECT *
            FROM events
            ORDER BY created
            LIMIT ${batchSize} OFFSET ${offset}
        ) as subquery;
      `
    });

    const rowsCount = await rowsCountResult.json<{ count: string }>();

    if (Number.parseInt(rowsCount[0].count) === batchSize) {
      // Proceed with the backup if there are rows to back up
      await clickhouseClient.query({
        format: "JSONEachRow",
        query: `
          INSERT INTO FUNCTION
          s3(
            'https://leafwatch.s3.eu-west-1.amazonaws.com/${s3Path}',
            '${process.env.AWS_ACCESS_KEY_ID}',
            '${process.env.AWS_SECRET_ACCESS_KEY}',
            'CSV'
          )
          SETTINGS s3_truncate_on_insert=1
          SELECT * FROM events
          ORDER BY created
          LIMIT ${batchSize} OFFSET ${offset};
        `
      });

      // Increment the offset
      offset += batchSize;
      await setRedis(cacheKey, offset.toString(), generateForeverExpiry());

      logger.info(
        `[Cron] backupEventsToS3 - Backup completed successfully for ${s3Path} with offset ${offset}`
      );
    } else {
      const remainingEvents = batchSize - Number.parseInt(rowsCount[0].count);

      logger.info(
        `[Cron] backupEventsToS3 - No more events to back up at offset ${offset}. ${remainingEvents} events still need to be backed up.`
      );
    }
  } catch (error) {
    logger.error("[Cron] backupEventsToS3 - Error processing events", error);
  }
};

export default backupEventsToS3;
