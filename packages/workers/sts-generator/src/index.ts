import { AssumeRoleCommand, AssumeRoleRequest, STSClient } from '@aws-sdk/client-sts';
import dotenv from 'dotenv';
import express from 'express';
import { promises as fs } from 'fs';

dotenv.config();

interface Env {
  bucketName: string;
  bucketRegion: string;
  stsEndpoint: string;
  filePath: string;
  secretContent?: string;
}

let envVars: Env;
let params: AssumeRoleRequest;
const app = express();

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', process.env.CORS ?? 'http://localhost:4783');
  res.header('Access-Control-Allow-Methods', 'GET');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.get('/', async (req, res) => {
  try {
    if (!envVars.secretContent || envVars.secretContent === '') {
      envVars.secretContent = await fs.readFile(envVars.filePath, { encoding: 'utf8' });
    }

    const { accessKeyId, secretAccessKey } = JSON.parse(envVars.secretContent);

    const stsClient = new STSClient({
      endpoint: envVars.stsEndpoint,
      region: envVars.bucketRegion,
      credentials: { accessKeyId, secretAccessKey }
    });

    const data = await stsClient.send(new AssumeRoleCommand(params));

    res.send(
      JSON.stringify({
        success: true,
        accessKeyId: data.Credentials?.AccessKeyId,
        secretAccessKey: data.Credentials?.SecretAccessKey,
        sessionToken: data.Credentials?.SessionToken
      })
    );
  } catch (error) {
    console.error(error);
    res.send(JSON.stringify({ success: false, message: 'Something went wrong!' }));
  }
});

const port = process.env.PORT ?? 8082;

app.listen(port, () => {
  envVars = {
    bucketName: process.env.BUCKET_NAME ?? 'lineaster-media',
    bucketRegion: process.env.BUCKET_REGION ?? 'us-west-2',
    stsEndpoint: process.env.STS_ENDPOINT ?? 'https://sts.amazonaws.com',
    filePath: process.env.FILE_PATH ?? '',
    secretContent: process.env.SECRET_CONTENT
  };

  params = {
    RoleArn: undefined,
    RoleSessionName: undefined,
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
          "arn:aws:s3:::${envVars.bucketName}/*"
        ]
      }
    ]
  }`
  };

  console.log(`ready - started server on 0.0.0.0:8082, url: http://localhost:${port}`);
});
