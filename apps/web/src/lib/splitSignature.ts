import { utils } from 'ethers';

/**
 * Split an Ethereum signature into its constituent parts.
 *
 * @param signature The signature to split.
 * @returns The signature's `r`, `s`, and `v` components.
 */
const splitSignature = (signature: string) => {
  return utils.splitSignature(signature);
};

export default splitSignature;
