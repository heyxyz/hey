import { AssumeRoleCommand, STSClient } from '@aws-sdk/client-sts';
import { withSentry } from '@sentry/nextjs';
import type { NextApiRequest, NextApiResponse } from 'next';
import { EVER_API } from 'src/constants';

interface Data {
  accessKeyId?: string;
  secretAccessKey?: string;
  sessionToken?: string;
  bucketName?: string;
  success: boolean;
}

const accessKeyId = process.env.EVER_ACCESS_KEY as string;
const secretAccessKey = process.env.EVER_ACCESS_SECRET as string;
const bucketName = process.env.NEXT_PUBLIC_EVER_BUCKET_NAME as string;

const handler = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  if (req.method !== 'GET') {
    return res.status(400).json({ success: false });
  }

  try {
    const stsClient = new STSClient({
      endpoint: EVER_API,
      region: 'us-west-2',
      credentials: { accessKeyId, secretAccessKey }
    });
    const params = {
      DurationSeconds: 200,
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

    const data = await stsClient.send(
      new AssumeRoleCommand({
        ...params,
        RoleArn: undefined,
        RoleSessionName: undefined
      })
    );

    return res.json({
      success: true,
      accessKeyId: data.Credentials?.AccessKeyId,
      secretAccessKey: data.Credentials?.SecretAccessKey,
      sessionToken: data.Credentials?.SessionToken
    });
  } catch (error) {
    return res.status(500).json({ success: false });
  }
};

export default withSentry(handler);
