import type { Handler } from 'express';
import type { Address } from 'viem';

import { GoodLensSignup } from '@good/abis';
import { GOOD_LENS_SIGNUP, IS_MAINNET } from '@good/data/constants';
import LensEndpoint from '@good/data/lens-endpoints';
import logger from '@good/helpers/logger';
import axios from 'axios';
import catchedError from 'src/helpers/catchedError';
import { CACHE_AGE_INDEFINITE, GOOD_USER_AGENT } from 'src/helpers/constants';
import getRpc from 'src/helpers/getRpc';
import { invalidBody, noBody } from 'src/helpers/responses';
import { createPublicClient, getAddress } from 'viem';
import { polygon, polygonAmoy } from 'viem/chains';

async function fetchAddressFromProfileId(id: string): Promise<Address> {
  const profileIdToAddressQuery = {
    query: `
      query ProfileIdToAddress($request: ProfileRequest!) {
        profile(request: $request) {
          ownedBy {
            address
          }
        }
      }
    `,
    variables: {
      request: {
        forProfileId: id
      }
    }
  };

  const { data } = await axios.post(
    IS_MAINNET ? LensEndpoint.Mainnet : LensEndpoint.Testnet,
    profileIdToAddressQuery,
    {
      headers: {
        'Content-Type': 'application/json',
        'User-agent': GOOD_USER_AGENT
      }
    }
  );

  return data.data.profile.ownedBy.address;
}

export const get: Handler = async (req, res) => {
  const { address, id } = req.query;

  if (!id && !address) {
    return noBody(res);
  }

  if (address && typeof address !== 'string') {
    return invalidBody(res);
  }

  if (id && typeof id !== 'string') {
    return invalidBody(res);
  }

  try {
    const formattedAddress = address
      ? getAddress(address)
      : await fetchAddressFromProfileId(id!);

    const viemclient = createPublicClient({
      chain: IS_MAINNET ? polygon : polygonAmoy,
      transport: getRpc({ mainnet: IS_MAINNET })
    });

    const data = await viemclient.readContract({
      abi: GoodLensSignup,
      address: GOOD_LENS_SIGNUP,
      args: [formattedAddress],
      functionName: 'profileCreated'
    });

    const isGoodProfile = !!data;

    logger.info(`Good profile badge fetched for ${id || formattedAddress}`);

    return res
      .status(200)
      .setHeader(
        'Cache-Control',
        isGoodProfile ? CACHE_AGE_INDEFINITE : 'no-cache'
      )
      .json({ isGoodProfile, success: true });
  } catch (error) {
    return catchedError(res, error);
  }
};
