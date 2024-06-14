import type { Handler } from 'express';

import { GoodLensSignup } from '@good/abis';
import {
  GOOD_LENS_SIGNUP,
  GOOD_MEMBERSHIP_NFT_PUBLICATION_ID,
  IS_MAINNET
} from '@good/data/constants';
import LensEndpoint from '@good/data/lens-endpoints';
import logger from '@good/helpers/logger';
import axios from 'axios';
import catchedError from 'src/helpers/catchedError';
import { GOOD_USER_AGENT } from 'src/helpers/constants';
import getRpc from 'src/helpers/getRpc';
import validateIsStaff from 'src/helpers/middlewares/validateIsStaff';
import { notAllowed } from 'src/helpers/responses';
import { createPublicClient } from 'viem';
import { polygon, polygonAmoy } from 'viem/chains';

async function fetchCollectCountOnPublication(
  publicationId: string
): Promise<number> {
  const collectCountOnPublicationQuery = {
    query: `
      query OpenActionsOnPublication($request: PublicationRequest!, $countOpenActionsRequest2: PublicationStatsCountOpenActionArgs) {
        publication(request: $request) {
          ... on Post {
            stats {
              countOpenActions(request: $countOpenActionsRequest2)
            }
          }
        }
      }
    `,
    variables: {
      countOpenActionsRequest2: {
        anyOf: [
          {
            category: 'COLLECT'
          }
        ]
      },
      request: {
        forId: publicationId
      }
    }
  };

  const { data } = await axios.post(
    IS_MAINNET ? LensEndpoint.Mainnet : LensEndpoint.Testnet,
    collectCountOnPublicationQuery,
    {
      headers: {
        'Content-Type': 'application/json',
        'User-agent': GOOD_USER_AGENT
      }
    }
  );

  const collectCount = data.data.publication.stats.countOpenActions;

  if (typeof collectCount !== 'number') {
    throw new TypeError('collect count on publication is not a number');
  }

  return collectCount;
}

// TODO: add tests
export const get: Handler = async (req, res) => {
  const validateIsStaffStatus = await validateIsStaff(req);
  if (validateIsStaffStatus !== 200) {
    return notAllowed(res, validateIsStaffStatus);
  }

  try {
    const viemclient = createPublicClient({
      chain: IS_MAINNET ? polygon : polygonAmoy,
      transport: getRpc({ mainnet: IS_MAINNET })
    });

    const signupCount = await viemclient.readContract({
      abi: GoodLensSignup,
      address: GOOD_LENS_SIGNUP,
      args: [],
      functionName: 'totalProfilesCreated'
    });

    const mintCount = await fetchCollectCountOnPublication(
      GOOD_MEMBERSHIP_NFT_PUBLICATION_ID
    );

    const formattedResult = [
      {
        date: new Date().toISOString(),
        mint_count: mintCount,
        signups_count: Number(signupCount)
      }
    ];

    logger.info('Lens: Fetched signup and membership NFT stats');

    return res.status(200).json({ result: formattedResult, success: true });
  } catch (error) {
    catchedError(res, error);
  }
};
