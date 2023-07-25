import { AssumeRoleCommand, STSClient } from '@aws-sdk/client-sts';
import type { IRequest } from 'itty-router';

import type { Env } from '../types';

const bucketName = 'lenster-media';
const everEndpoint = 'https://endpoint.4everland.co';

const params = {
  DurationSeconds: 900,
  Policy: `{
    "Version": "2012-10-17",
    "Statement": [
      {
        "Effect": "Allow",
        "Action": [
          "s3:PutObject",
          "s3:GetObject"
        ],
        "Resource": [
          "arn:aws:s3:::${bucketName}/*"
        ]
      }
    ]
  }`
};

export default async (_request: IRequest, env: Env) => {
  try {
    const accessKeyId = env.EVER_ACCESS_KEY;
    const secretAccessKey = env.EVER_ACCESS_SECRET;

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

    // @ts-ignore
    const { Credentials: credentials } = await stsClient.send(command);

    return new Response(
      JSON.stringify({
        success: true,
        accessKeyId: credentials?.AccessKeyId,
        secretAccessKey: credentials?.SecretAccessKey,
        sessionToken: credentials?.SessionToken
      })
    );
  } catch (error) {
    throw error;
  }
};
