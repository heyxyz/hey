import type { Handler } from 'express';

import { Errors } from '@hey/data/errors';
import logger from '@hey/lib/logger';
import catchedError from '@utils/catchedError';
import { invalidBody, noBody } from '@utils/responses';
import axios from 'axios';
import { object, string } from 'zod';

type ExtensionRequest = {
  secret: string;
  serviceId: string;
};

const validationSchema = object({
  secret: string(),
  serviceId: string()
});

export const post: Handler = async (req, res) => {
  const { body } = req;

  if (!body) {
    return noBody(res);
  }

  const validation = validationSchema.safeParse(body);

  if (!validation.success) {
    return invalidBody(res);
  }

  const { secret, serviceId } = body as ExtensionRequest;

  if (secret !== process.env.SECRET) {
    return res
      .status(400)
      .json({ error: Errors.InvalidSecret, success: false });
  }

  const environments = [
    '7211f8ea-d802-46b8-96bb-a260d9b4888c',
    '057b8889-2d38-4a7f-8033-4263b2731547',
    '057b8889-2d38-4a7f-8033-4263b2731547'
  ];

  const triggerApiDeployment = async (environmentId: string) => {
    const response = await axios.post(
      'https://backboard.railway.app/graphql/v2',
      {
        query: `
          mutation {
            serviceInstanceRedeploy(
              serviceId: "${serviceId}",
              environmentId: "${environmentId}"
            )
          }
        `
      },
      { headers: { Authorization: `Bearer ${process.env.RAILWAY_TOKEN}` } }
    );

    return response.data;
  };

  try {
    Promise.all(environments.map(triggerApiDeployment));
    logger.info('Triggered API deployment');

    return res.status(200).json({ success: true });
  } catch (error) {
    return catchedError(res, error);
  }
};
