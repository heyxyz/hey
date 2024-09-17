import type { ListObjectsV2CommandOutput } from "@aws-sdk/client-s3";

import {
  DeleteObjectsCommand,
  ListObjectsV2Command,
  S3
} from "@aws-sdk/client-s3";
import { EVER_API, EVER_BUCKET, EVER_REGION } from "@hey/data/constants";
import logger from "@hey/helpers/logger";

const truncate4EverlandBucket = async () => {
  try {
    const accessKeyId = process.env.EVER_ACCESS_KEY!;
    const secretAccessKey = process.env.EVER_ACCESS_SECRET!;

    const s3Client = new S3({
      credentials: { accessKeyId, secretAccessKey },
      endpoint: EVER_API,
      maxAttempts: 5,
      region: EVER_REGION
    });

    const daysToSubtract = 15;
    const currentDate = new Date();
    const dateDaysAgo = new Date(
      currentDate.setDate(currentDate.getDate() - daysToSubtract)
    );

    const Bucket = EVER_BUCKET;
    let ContinuationToken: string | undefined;
    let objectsToDelete: { Key: string }[] = [];

    do {
      const response: ListObjectsV2CommandOutput = await s3Client.send(
        new ListObjectsV2Command({ Bucket, ContinuationToken })
      );
      const { Contents, IsTruncated, NextContinuationToken } = response;

      if (Contents) {
        const oldObjects = Contents.filter(
          (object) =>
            object.LastModified && new Date(object.LastModified) < dateDaysAgo
        );
        objectsToDelete = objectsToDelete.concat(
          oldObjects
            .map((object) => ({ Key: object.Key! }))
            .filter((obj) => obj.Key)
        );
      }

      ContinuationToken = IsTruncated ? NextContinuationToken : undefined;
    } while (ContinuationToken);

    logger.info(
      `[Cron] truncate4EverlandBucket - Found ${objectsToDelete.length} objects older than ${daysToSubtract} days.`
    );

    if (objectsToDelete.length > 0) {
      const deleteBatchSize = 1000;

      while (objectsToDelete.length > 0) {
        const batch = objectsToDelete.splice(0, deleteBatchSize);

        const deleteCommand = new DeleteObjectsCommand({
          Bucket,
          Delete: { Objects: batch }
        });

        s3Client.send(deleteCommand);
        logger.info(
          `[Cron] truncate4EverlandBucket - Deleted ${batch.length} objects in a batch.`
        );
      }

      logger.info(
        `[Cron] truncate4EverlandBucket - Deleted all objects older than ${daysToSubtract} days.`
      );
      return;
    }

    logger.info(
      `[Cron] truncate4EverlandBucket - No objects older than ${daysToSubtract} days found.`
    );
  } catch (error) {
    logger.error(
      "[Cron] truncate4EverlandBucket - Error deleting objects",
      error
    );
  }
};

export default truncate4EverlandBucket;
