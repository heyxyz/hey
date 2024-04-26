import type { Handler } from 'express';

import { Errors } from '@hey/data/errors';
import logger from '@hey/helpers/logger';
import axios from 'axios';
import catchedError from 'src/helpers/catchedError';
import { invalidBody, noBody } from 'src/helpers/responses';
import { object, string } from 'zod';

type ExtensionRequest = {
  secret: string;
  serviceId: string;
};

const validationSchema = object({
  secret: string(),
  serviceId: string()
});

export const post: Handler = (req, res) => {
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
    '7211f8ea-d802-46b8-96bb-a260d9b4888c', // mainnet
    'daf09dab-8ed9-4987-a2bf-bfce34fe49e9', // testnet
    '3531fbe2-a703-421c-889f-4fe1f011e535' // staging
  ];

  const triggerApiDeployment = async (environmentId: string) => {
    const response = await axios.post(
      'https://backboard.railway.app/graphql/v2',
      {
        operationName: 'ServiceInstanceRedeploy',
        query: `
          mutation ServiceInstanceRedeploy($serviceId: String!, $environmentId: String!) {
            serviceInstanceRedeploy(
              serviceId: $serviceId
              environmentId: $environmentId
            )
          }
        `,
        variables: { environmentId, serviceId }
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
