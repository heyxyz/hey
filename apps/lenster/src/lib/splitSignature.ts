import { utils } from 'ethers';

/**
 *
 * @param signature - Signature to split
 * @returns signature parts
 */
const splitSignature = (signature: string) => {
  return utils.splitSignature(signature);
};

export default splitSignature;
