import {
  DeleteObjectsCommand,
  ListObjectsV2Command,
  S3Client
} from '@aws-sdk/client-s3';
import { EVER_API } from '@hey/data/constants';
import logger from '@hey/helpers/logger';

const truncate4EverlandBucket = async () => {
  try {
    const bucketName = 'lenster-media';

    // Initialize S3 client
    const s3Client = new S3Client({
      credentials: {
        accessKeyId: process.env.EVER_ACCESS_KEY as string,
        secretAccessKey: process.env.EVER_ACCESS_SECRET as string
      },
      endpoint: EVER_API,
      forcePathStyle: true,
      region: 'us-east-2'
    });

    // List objects in the bucket
    const listParams = { Bucket: bucketName };
    const objects = await s3Client.send(new ListObjectsV2Command(listParams));

    if (objects.Contents && objects.Contents.length > 0) {
      const deleteParams = {
        Bucket: bucketName,
        Delete: { Objects: objects.Contents.map((obj) => ({ Key: obj.Key })) }
      };

      const { Deleted } = await s3Client.send(
        new DeleteObjectsCommand(deleteParams)
      );

      logger.info(
        `[Cron] Successfully emptied bucket: ${bucketName} - Deleted: ${Deleted?.length}`
      );
    } else {
      logger.info(`[Cron] No objects found in bucket: ${bucketName}`);
    }
  } catch (error) {
    logger.error(
      '[Cron] truncate4EverlandBucket - Error emptying bucket',
      error
    );
  }
};

export default truncate4EverlandBucket;
