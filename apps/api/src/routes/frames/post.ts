import type { ButtonType } from '@hey/types/misc';
import type { Request, Response } from 'express';

import { IS_MAINNET } from '@hey/data/constants';
import logger from '@hey/helpers/logger';
import parseJwt from '@hey/helpers/parseJwt';
import axios from 'axios';
import { parseHTML } from 'linkedom';
import catchedError from 'src/helpers/catchedError';
import { HEY_USER_AGENT } from 'src/helpers/constants';
import signFrameAction from 'src/helpers/frames/signFrameAction';
import { rateLimiter } from 'src/helpers/middlewares/rateLimiter';
import validateLensAccount from 'src/helpers/middlewares/validateLensAccount';
import getFrame from 'src/helpers/oembed/meta/getFrame';
import { invalidBody, noBody } from 'src/helpers/responses';
import { number, object, string } from 'zod';

type ExtensionRequest = {
  buttonAction?: ButtonType;
  buttonIndex: number;
  inputText?: string;
  postUrl: string;
  pubId: string;
  state?: string;
};

const validationSchema = object({
  buttonAction: string().optional(),
  buttonIndex: number(),
  postUrl: string(),
  pubId: string()
});

export const post = [
  rateLimiter({ requests: 100, within: 1 }),
  validateLensAccount,
  async (req: Request, res: Response) => {
    const { body } = req;

    if (!body) {
      return noBody(res);
    }

    const validation = validationSchema.safeParse(body);

    if (!validation.success) {
      return invalidBody(res);
    }

    const { buttonAction, buttonIndex, inputText, postUrl, pubId, state } =
      body as ExtensionRequest;

    try {
      const accessToken = req.headers['x-access-token'] as string;
      const identityToken = req.headers['x-identity-token'] as string;
      const payload = parseJwt(identityToken);
      const { id } = payload;

      let request = {
        actionResponse: '',
        buttonIndex,
        inputText: inputText || '',
        profileId: id,
        pubId,
        specVersion: '1.0.0',
        state: state || '',
        url: postUrl
      };

      let signature = '';

      // Sign request if Frame accepts Lens authenticated response
      if (req.body.acceptsLens) {
        const signatureResponse = await signFrameAction(
          request,
          accessToken,
          IS_MAINNET ? 'mainnet' : 'testnet'
        );
        if (signatureResponse) {
          signature = signatureResponse.signature;
          request = signatureResponse.signedTypedData.value;
        }
      }

      const trustedData = { messageBytes: signature };
      const untrustedData = {
        identityToken,
        unixTimestamp: Math.floor(Date.now() / 1000),
        ...request
      };

      const { data } = await axios.post(
        postUrl,
        { clientProtocol: 'lens@1.0.0', trustedData, untrustedData },
        { headers: { 'User-Agent': HEY_USER_AGENT } }
      );

      logger.info(`Open frame button clicked by ${id} on ${postUrl}`);

      if (buttonAction === 'tx') {
        return res
          .status(200)
          .json({ frame: { transaction: data }, success: true });
      }

      const { document } = parseHTML(data);

      return res
        .status(200)
        .json({ frame: getFrame(document, postUrl), success: true });
    } catch (error) {
      return catchedError(res, error);
    }
  }
];
