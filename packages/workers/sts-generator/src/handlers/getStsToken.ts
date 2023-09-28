import { AssumeRoleCommand, STSClient } from '@aws-sdk/client-sts';
import { EVER_API, S3_BUCKET } from '@hey/data/constants';
import response from '@hey/lib/response';

import type { WorkerRequest } from '../types';

const bucketName = S3_BUCKET.HEY_MEDIA;
const everEndpoint = EVER_API;

const params = {
  DurationSeconds: 900,
  Policy: `{
    "Version": "2012-10-17",
    "Statement": [
      {
        "Effect": "Allow",
        "Action": [
          "s3:PutObject",
          "s3:GetObject",
          "s3:AbortMultipartUpload"
        ],
        "Resource": [
          "arn:aws:s3:::${bucketName}/*"
        ]
      }
    ]
  }`
};

export default async (request: WorkerRequest) => {
  try {
    const accessKeyId = request.env.EVER_ACCESS_KEY;
    const secretAccessKey = request.env.EVER_ACCESS_SECRET;
    const stsClient = new STSClient({
      endpoint: everEndpoint,
      region: 'us-west-2',
      credentials: { accessKeyId, secretAccessKey }
    });
    const command = new AssumeRoleCommand({
      ...params,
      RoleArn: undefined,
      RoleSessionName: undefined
    });
    const { Credentials: credentials } = await stsClient.send(command);

    return response({
      success: true,
      accessKeyId: credentials?.AccessKeyId,
      secretAccessKey: credentials?.SecretAccessKey,
      sessionToken: credentials?.SessionToken
    });
  } catch (error) {
    throw error;
  }
};
