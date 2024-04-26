import type { Address } from 'viem';

import { VerifiedOpenActionModules } from '@hey/data/verified-openaction-modules';

/**
 * Returns the name of the specified open action module.
 *
 * @param address Address of the module.
 * @returns Object containing the name of the module.
 */
const getAllowanceOpenAction = (
  address: Address
): {
  name: string;
} => {
  switch (address) {
    case VerifiedOpenActionModules.Swap:
      return { name: 'Swap Open Action' };

    default:
      return { name: 'Unknown Open Action' };
  }
};

export default getAllowanceOpenAction;
