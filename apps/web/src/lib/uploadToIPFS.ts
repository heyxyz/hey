import { S3 } from '@aws-sdk/client-s3';
import { ThirdwebStorage } from '@thirdweb-dev/storage';
import axios from 'axios';
import { KillSwitch } from 'data';
import { EVER_API, S3_BUCKET, STS_TOKEN_URL } from 'data/constants';
import type { MediaSet } from 'lens';
import { v4 as uuid } from 'uuid';

import { Growthbook } from './growthbook';

const FALLBACK_TYPE = 'image/jpeg';

/**
 * Returns an S3 client with temporary credentials obtained from the STS service.
 *
 * @returns S3 client instance.
 */
const getS3Client = async (): Promise<S3> => {
  const token = await axios.get(STS_TOKEN_URL);
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

  return client;
};

/**
 * Uploads a set of files to the IPFS network via S3 and returns an array of MediaSet objects.
 *
 * @param data Files to upload to IPFS.
 * @returns Array of MediaSet objects.
 */
const uploadToIPFS = async (data: any): Promise<MediaSet[]> => {
  try {
    const { on: useThirdwebIpfs } = Growthbook.feature(
      KillSwitch.UseThirdwebIpfs
    );
    const files = Array.from(data);

    if (useThirdwebIpfs) {
      const storage = new ThirdwebStorage();
      const uris = await storage.uploadBatch(files);

      return uris.map((uri: string) => {
        return {
          original: { url: uri, mimeType: data.type || FALLBACK_TYPE }
        };
      });
    }

    const client = await getS3Client();
    const attachments = await Promise.all(
      files.map(async (_: any, i: number) => {
        const file = data[i];
        const params = {
          Bucket: S3_BUCKET.LENSTER_MEDIA,
          Key: uuid()
        };
        await client.putObject({
          ...params,
          Body: file,
          ContentType: file.type
        });
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
  } catch (error) {
    return [];
  }
};

/**
 * Uploads a file to the IPFS network via S3 and returns a MediaSet object.
 *
 * @param file File to upload to IPFS.
 * @returns MediaSet object or null if the upload fails.
 */
export const uploadFileToIPFS = async (file: File): Promise<MediaSet> => {
  try {
    const ipfsResponse = await uploadToIPFS([file]);
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
