import type { Handler } from 'express';

import { IS_MAINNET } from '@hey/data/constants';
import logger from '@hey/helpers/logger';
import parseJwt from '@hey/helpers/parseJwt';
import axios from 'axios';
import { parseHTML } from 'linkedom';
import catchedError from 'src/helpers/catchedError';
import { HEY_USER_AGENT } from 'src/helpers/constants';
import signFrameAction from 'src/helpers/frames/signFrameAction';
import validateLensAccount from 'src/helpers/middlewares/validateLensAccount';
import getFrame from 'src/helpers/oembed/meta/getFrame';
import { invalidBody, noBody, notAllowed } from 'src/helpers/responses';
import { number, object, string } from 'zod';

type ExtensionRequest = {
  buttonIndex: number;
  inputText?: string;
  postUrl: string;
  pubId: string;
};

const validationSchema = object({
  buttonIndex: number(),
  postUrl: string(),
  pubId: string()
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

  const validateLensAccountStatus = await validateLensAccount(req);
  if (validateLensAccountStatus !== 200) {
    return notAllowed(res, validateLensAccountStatus);
  }

  const { buttonIndex, inputText, postUrl, pubId } = body as ExtensionRequest;

  try {
    const accessToken = req.headers['x-access-token'] as string;
    const identityToken = req.headers['x-identity-token'] as string;
    const payload = parseJwt(identityToken);
    const { id } = payload;

    const request = {
      actionResponse: '',
      buttonIndex,
      inputText: inputText ?? '',
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
      { headers: { 'User-Agent': HEY_USER_AGENT } }
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
