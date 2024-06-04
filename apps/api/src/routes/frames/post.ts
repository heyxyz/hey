import type { Handler } from 'express';

import logger from '@hey/helpers/logger';
import parseJwt from '@hey/helpers/parseJwt';
import axios from 'axios';
import { parseHTML } from 'linkedom';
import catchedError from 'src/helpers/catchedError';
import { HEY_USER_AGENT } from 'src/helpers/constants';
import validateLensAccount from 'src/helpers/middlewares/validateLensAccount';
import getFrame from 'src/helpers/oembed/meta/getFrame';
import { invalidBody, noBody, notAllowed } from 'src/helpers/responses';
import { polygon } from 'viem/chains';
import { number, object, string } from 'zod';

type ExtensionRequest = {
  buttonIndex: number;
  postUrl: string;
  publicationId: string;
};

const validationSchema = object({
  buttonIndex: number(),
  postUrl: string(),
  publicationId: string()
});

export const post: Handler = async (req, res) => {
  const { body } = req;

  if (!body) {
    return noBody(res);
  }

  const accessToken = req.headers['x-access-token'] as string;
  const validation = validationSchema.safeParse(body);

  if (!validation.success) {
    return invalidBody(res);
  }

  const validateLensAccountStatus = await validateLensAccount(req);
  if (validateLensAccountStatus !== 200) {
    return notAllowed(res, validateLensAccountStatus);
  }

  const { buttonIndex, postUrl, publicationId } = body as ExtensionRequest;

  try {
    const payload = parseJwt(accessToken);
    const { evmAddress, id } = payload;

    const untrustedData = {
      address: evmAddress,
      buttonIndex,
      fid: id,
      network: polygon.id,
      profileId: id,
      publicationId,
      timestamp: Date.now(),
      url: postUrl
    };

    const { data } = await axios.post(
      postUrl,
      { trustedData: untrustedData, untrustedData },
      { headers: { 'User-Agent': HEY_USER_AGENT } }
    );

    const { document } = parseHTML(data);

    logger.info(`Open frame button clicked by ${id} on ${postUrl}`);

    return res.status(200).json({ frame: getFrame(document), success: true });
  } catch (error) {
    return catchedError(res, error);
  }
};
