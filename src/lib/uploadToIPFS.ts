import { S3 } from '@aws-sdk/client-s3';
import type { LensterAttachment } from '@generated/lenstertypes';
import axios from 'axios';
import { EVER_API } from 'src/constants';
import { v4 as uuid } from 'uuid';

const bucketName = process.env.NEXT_PUBLIC_EVER_BUCKET_NAME as string;

/**
 *
 * @param data - Data to upload to IPFS
 * @returns attachment array
 */
const uploadToIPFS = async (data: any): Promise<LensterAttachment[]> => {
  try {
    const token = await axios.get('/api/sts/token');
    const client = new S3({
      endpoint: EVER_API,
      credentials: {
        accessKeyId: token.data?.accessKeyId,
        secretAccessKey: token.data?.secretAccessKey,
        sessionToken: token.data?.sessionToken
      },
      region: 'us-west-2',
      maxAttempts: 3
    });
    const files = Array.from(data);
    const attachments = await Promise.all(
      files.map(async (_: any, i: number) => {
        const file = data.item(i);
        const params = {
          Bucket: bucketName,
          Key: uuid()
        };
        await client.putObject({ ...params, Body: file, ContentType: file.type });
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
