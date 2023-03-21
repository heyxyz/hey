import { utils } from 'ethers';

/**
 *
 * @param address the address to validate
 * @returns true if the address is valid
 */
const isValidEthAddress = (address: string) => {
  return utils.isAddress(address);
};

export default isValidEthAddress;
