import { isAddress } from "viem";

/**
 * Format the given Ethereum address by displaying only the first and last few characters.
 *
 * @param address Complete Ethereum address
 * @param slice Number of characters to display from the start and end of the address
 * @returns Formatted Ethereum address
 */
const formatAddress = (address: null | string, slice = 4): string => {
  if (!address) {
    return "";
  }

  address = address.toLowerCase();

  if (isAddress(address)) {
    return `${address.slice(0, slice + 2)}…${address.slice(
      address.length - slice
    )}`;
  }

  return address;
};

export default formatAddress;
