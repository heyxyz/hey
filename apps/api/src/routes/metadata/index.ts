import { PutObjectCommand, S3 } from "@aws-sdk/client-s3";
import { METADATA_ENDPOINT } from "@hey/data/constants";
import logger from "@hey/helpers/logger";
import { signMetadata } from "@lens-protocol/metadata";
import type { Request, Response } from "express";
import catchedError from "src/helpers/catchedError";
import { rateLimiter } from "src/helpers/middlewares/rateLimiter";
import { noBody } from "src/helpers/responses";
import { v4 as uuid } from "uuid";
import { privateKeyToAccount } from "viem/accounts";

export const post = [
  rateLimiter({ requests: 30, within: 1 }),
  async (req: Request, res: Response) => {
    const { body } = req;

    if (!body) {
      return noBody(res);
    }

    try {
      const account = privateKeyToAccount(`0x${process.env.PRIVATE_KEY}`);
      const signed = await signMetadata(body, (message) =>
        account.signMessage({ message })
      );

      const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
      const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

      const s3Client = new S3({
        credentials: { accessKeyId, secretAccessKey },
        maxAttempts: 5,
        region: "eu-west-2"
      });

      const key = uuid();
      const uploadParams = {
        Bucket: "hey-metadata",
        Key: key,
        Body: JSON.stringify(signed),
        ContentType: "application/json"
      };

      const command = new PutObjectCommand(uploadParams);
      await s3Client.send(command);

      logger.info(`Uploaded metadata to S3: ${METADATA_ENDPOINT}/${key}`);

      return res.status(200).json({ id: key, success: true });
    } catch (error) {
      return catchedError(res, error);
    }
  }
];
