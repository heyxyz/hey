import { S3 } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import {
  EVER_API,
  S3_BUCKET,
  STS_GENERATOR_WORKER_URL
} from '@hey/data/constants';
import type { MediaSetWithoutOnChain } from '@hey/types/misc';
import axios from 'axios';
import { v4 as uuid } from 'uuid';

const FALLBACK_TYPE = 'image/jpeg';

/**
 * Returns an S3 client with temporary credentials obtained from the STS service.
 *
 * @returns S3 client instance.
 */
const getS3Client = async (): Promise<S3> => {
  const token = await axios.get(`${STS_GENERATOR_WORKER_URL}/token`);
  const client = new S3({
    endpoint: EVER_API,
    credentials: {
      accessKeyId: token.data?.accessKeyId,
      secretAccessKey: token.data?.secretAccessKey,
      sessionToken: token.data?.sessionToken
    },
    region: 'us-west-2',
    maxAttempts: 10
  });

  client.middlewareStack.addRelativeTo(
    (next: Function) => async (args: any) => {
      const { response } = await next(args);
      if (response.body == null) {
        response.body = new Uint8Array();
      }
      return { response };
    },
    {
      name: 'nullFetchResponseBodyMiddleware',
      toMiddleware: 'deserializerMiddleware',
      relation: 'after',
      override: true
    }
  );

  return client;
};

/**
 * Uploads a set of files to the IPFS network via S3 and returns an array of MediaSet objects.
 *
 * @param data Files to upload to IPFS.
 * @returns Array of MediaSet objects.
 */
const uploadToIPFS = async (
  data: any,
  onProgress?: (percentage: number) => void
): Promise<MediaSetWithoutOnChain[]> => {
  try {
    const files = Array.from(data);
    const client = await getS3Client();
    const attachments = await Promise.all(
      files.map(async (_: any, i: number) => {
        const file = data[i];
        const params = {
          Bucket: S3_BUCKET.HEY_MEDIA,
          Key: uuid(),
          Body: file,
          ContentType: file.type
        };
        const task = new Upload({
          client,
          params
        });
        task.on('httpUploadProgress', (e) => {
          const loaded = e.loaded ?? 0;
          const total = e.total ?? 0;
          const progress = (loaded / total) * 100;
          onProgress?.(Math.round(progress));
        });
        await task.done();
        const result = await client.headObject(params);
        const metadata = result.Metadata;

        return {
          original: {
            url: `ipfs://${metadata?.['ipfs-hash']}`,
            mimeType: file.type || FALLBACK_TYPE
          }
        };
      })
    );

    return attachments;
  } catch {
    return [];
  }
};

/**
 * Uploads a file to the IPFS network via S3 and returns a MediaSet object.
 *
 * @param file File to upload to IPFS.
 * @returns MediaSet object or null if the upload fails.
 */
export const uploadFileToIPFS = async (
  file: File,
  onProgress?: (percentage: number) => void
): Promise<MediaSetWithoutOnChain> => {
  try {
    const ipfsResponse = await uploadToIPFS([file], onProgress);
    const metadata = ipfsResponse[0];

    return {
      original: {
        url: metadata.original.url,
        mimeType: file.type || FALLBACK_TYPE
      }
    };
  } catch {
    return { original: { url: '', mimeType: file.type || FALLBACK_TYPE } };
  }
};

export default uploadToIPFS;
