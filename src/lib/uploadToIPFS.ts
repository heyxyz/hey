import { S3 } from '@aws-sdk/client-s3';
import type { LensterAttachment } from '@generated/lenstertypes';
import { v4 as uuid } from 'uuid';

const accessKeyId = process.env.NEXT_PUBLIC_EVER_API_KEY as string;
const secretAccessKey = process.env.NEXT_PUBLIC_EVER_API_SECRET as string;
const bucketName = process.env.NEXT_PUBLIC_EVER_BUCKET_NAME as string;
const region = 'us-west-2';

const client = new S3({
  endpoint: 'https://ipfs.lenster.io',
  credentials: { accessKeyId, secretAccessKey },
  region,
  maxAttempts: 3
});

/**
 *
 * @param data - Data to upload to IPFS
 * @returns attachment array
 */
const uploadToIPFS = async (data: any): Promise<LensterAttachment[]> => {
  try {
    const files = Array.from(data);
    const attachments = await Promise.all(
      files.map(async (_: any, i: number) => {
        const file = data.item(i);
        const params = {
          Bucket: bucketName,
          Key: uuid(),
          Body: file,
          ContentType: file.type
        };
        const result = await client.headObject(params);
        const metadata = result.Metadata;

        return {
          item: `ipfs://${metadata?.['ipfs-hash']}`,
          type: file.type || 'image/jpeg',
          altTag: ''
        };
      })
    );

    return attachments;
  } catch {
    return [];
  }
};

export default uploadToIPFS;
