import { ADDRESS_REGEX } from 'data/constants';

/**
 * Format the given Ethereum address by displaying only the first and last few characters.
 *
 * @param address - Complete Ethereum address
 * @param slice - Number of characters to display from the start and end of the address
 * @returns Formatted Ethereum address
 */
const formatAddress = (address: string | null, slice = 4): string => {
  if (!address) {
    return '';
  }

  if (address.match(ADDRESS_REGEX)) {
    return `${address.slice(0, slice)}…${address.slice(address.length - slice, address.length)}`;
  }

  return address;
};

export default formatAddress;
