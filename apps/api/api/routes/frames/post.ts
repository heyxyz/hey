import type { Handler } from 'express';

import { IS_MAINNET } from '@good/data/constants';
import logger from '@good/helpers/logger';
import parseJwt from '@good/helpers/parseJwt';
import axios from 'axios';
import { parseHTML } from 'linkedom';
import catchedError from 'api/helpers/catchedError';
import { GOOD_USER_AGENT } from 'api/helpers/constants';
import signFrameAction from 'api/helpers/frames/signFrameAction';
import validateLensAccount from 'api/helpers/middlewares/validateLensAccount';
import getFrame from 'api/helpers/oembed/meta/getFrame';
import { invalidBody, noBody, notAllowed } from 'api/helpers/responses';
import { number, object, string } from 'zod';

type ExtensionRequest = {
  buttonIndex: number;
  identityToken: string;
  postUrl: string;
  pubId: string;
};

const validationSchema = object({
  buttonIndex: number(),
  identityToken: string(),
  postUrl: string(),
  pubId: string()
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

  const { buttonIndex, identityToken, postUrl, pubId } =
    body as ExtensionRequest;

  try {
    const payload = parseJwt(accessToken);
    const { id } = payload;

    const request = {
      actionResponse: '',
      buttonIndex,
      inputText: '',
      profileId: id,
      pubId,
      specVersion: '1.0.0',
      state: '',
      url: postUrl
    };

    const signature = await signFrameAction(
      request,
      accessToken,
      IS_MAINNET ? 'mainnet' : 'testnet'
    );

    const trustedData = { messageBytes: signature?.signature };
    const untrustedData = {
      identityToken,
      unixTimestamp: Math.floor(Date.now() / 1000),
      ...signature?.signedTypedData.value
    };

    const { data } = await axios.post(
      postUrl,
      { clientProtocol: 'lens@1.0.0', trustedData, untrustedData },
      { headers: { 'User-Agent': GOOD_USER_AGENT } }
    );

    const { document } = parseHTML(data);

    logger.info(`Open frame button clicked by ${id} on ${postUrl}`);

    return res
      .status(200)
      .json({ frame: getFrame(document, postUrl), success: true });
  } catch (error) {
    return catchedError(res, error);
  }
};
