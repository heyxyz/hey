import { utils } from 'ethers';

/**
 * Checks if the given string is a valid Ethereum address.
 *
 * @param address The address to validate.
 * @returns True if the address is valid, false otherwise.
 */
const isValidEthAddress = (address: string) => {
  return utils.isAddress(address);
};

export default isValidEthAddress;
