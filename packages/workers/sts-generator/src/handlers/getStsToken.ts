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

export default async (request: IRequest, env: Env) => {
  try {
    const accessKeyId = env.EVER_ACCESS_KEY;
    const secretAccessKey = env.EVER_ACCESS_SECRET;

    const stsClient = new STSClient({
      endpoint: everEndpoint,
      region: 'us-west-2',
      credentials: { accessKeyId, secretAccessKey }
    });

    const data = await stsClient.send(
      new AssumeRoleCommand({
        ...params,
        RoleArn: undefined,
        RoleSessionName: undefined
      })
    );

    return new Response(
      JSON.stringify({
        success: true,
        accessKeyId: data.Credentials?.AccessKeyId,
        secretAccessKey: data.Credentials?.SecretAccessKey,
        sessionToken: data.Credentials?.SessionToken
      })
    );
  } catch (error) {
    console.error('Failed to get oembed data', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Something went wrong!' })
    );
  }
};
