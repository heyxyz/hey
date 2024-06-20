import type { Handler } from 'express';

import logger from '@hey/helpers/logger';
import axios from 'axios';
import catchedError from 'src/helpers/catchedError';
import { arbitrum, mainnet, polygon, polygonAmoy, zora } from 'viem/chains';

export const POLYGON_WRITE_RPC =
  'https://polygon-mainnet.g.alchemy.com/v2/N_HuqeYE3mr_enxw-BGFI2rOm1U7bhGy';

export const POLYGON_RPCS = [
  'https://lb.nodies.app/v1/c4af832850924699b25128e185bde36e',
  'https://polygon-pokt.nodies.app',
  'https://rpc.ankr.com/polygon',
  'https://1rpc.io/matic',
  'https://polygon-bor-rpc.publicnode.com'
];

export const POLYGON_AMOY_RPCS = [
  'https://rpc-amoy.polygon.technology',
  'https://lb.nodies.app/v1/1c9670faa1fb4c59ac4b0185ec9f19b7',
  'https://polygon-amoy-bor-rpc.publicnode.com'
];

const ETHEREUM_RPCS = [
  'https://rpc-endpoints.superfluid.dev/eth-mainnet',
  'https://eth-pokt.nodies.app',
  'https://eth.drpc.org'
];

const ZORA_RPCS = ['https://rpc.zora.energy', 'https://zora.drpc.org'];

const ARBITRUM_RPCS = [
  'https://rpc-endpoints.superfluid.dev/arbitrum-one',
  'https://arb-pokt.nodies.app',
  'https://arbitrum.drpc.org'
];

const getRpcUrls = (chain: number) => {
  if (chain === polygon.id) {
    return POLYGON_RPCS;
  }

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

  return [POLYGON_WRITE_RPC];
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
