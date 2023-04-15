import { AssumeRoleCommand, STSClient } from '@aws-sdk/client-sts';

interface EnvType {
  EVER_ACCESS_KEY: string;
  EVER_ACCESS_SECRET: string;
}

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Content-Type': 'application/json'
};
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

async function handleRequest(request: Request, env: EnvType) {
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
      }),
      { headers }
    );
  } catch {
    return new Response(JSON.stringify({ success: false, message: 'Something went wrong!' }), { headers });
  }
}

export default {
  async fetch(request: Request, env: EnvType) {
    return await handleRequest(request, env);
  }
};
