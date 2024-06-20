import type { HttpTransport } from 'viem';

import { HEY_API_URL } from '@hey/data/constants';
import { http } from 'viem';
import { polygon, polygonAmoy } from 'viem/chains';

const getRpc = ({ mainnet }: { mainnet: boolean }): HttpTransport => {
  if (mainnet) {
    return http(`${HEY_API_URL}/rpc?chain=${polygon.id}`);
  }

  return http(`${HEY_API_URL}/rpc?chain=${polygonAmoy.id}`);
};

export default getRpc;
