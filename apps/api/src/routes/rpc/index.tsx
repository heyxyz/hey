import type { Handler } from 'express';

import {
  ARBITRUM_RPCS,
  ETHEREUM_RPCS,
  POLYGON_AMOY_RPCS,
  POLYGON_RPCS,
  ZORA_RPCS
} from '@hey/data/rpcs';
import logger from '@hey/helpers/logger';
import axios from 'axios';
import catchedError from 'src/helpers/catchedError';
import { arbitrum, mainnet, polygon, polygonAmoy, zora } from 'viem/chains';

const getRpcUrls = (chain: number) => {
  if (chain === polygonAmoy.id) {
    return POLYGON_AMOY_RPCS;
  }

  if (chain === mainnet.id) {
    return ETHEREUM_RPCS;
  }

  if (chain === zora.id) {
    return ZORA_RPCS;
  }

  if (chain === arbitrum.id) {
    return ARBITRUM_RPCS;
  }

  return POLYGON_RPCS;
};

const tryRpcs = async (rpcs: string[], body: any) => {
  for (const rpc of rpcs) {
    try {
      const result = await axios.post(rpc, body);
      return result.data;
    } catch (error) {
      logger.error(`RPC call failed for ${rpc}`);
    }
  }

  throw new Error('All RPC calls failed');
};

export const post: Handler = async (req, res) => {
  const { chain } = req.query;
  const chainId = parseInt(chain as string);

  const supportedChains = [
    mainnet.id,
    polygon.id,
    polygonAmoy.id,
    zora.id,
    arbitrum.id
  ];

  if (!supportedChains.includes(chainId as any)) {
    return res.status(400).json({ error: 'Invalid chain' });
  }

  try {
    const rpcUrls = getRpcUrls(chainId);
    const result = await tryRpcs(rpcUrls, req.body);
    return res.status(200).json(result);
  } catch (error) {
    return catchedError(res, error);
  }
};
