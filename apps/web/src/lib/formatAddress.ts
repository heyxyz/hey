import { ADDRESS_REGEX } from 'data/constants';

/**
 *
 * @param address - Complete ethereum address
 * @returns formatted ethereum address
 */
const formatAddress = (address: string | null): string => {
  if (!address) {
    return '';
  }

  const regex = ADDRESS_REGEX;
  if (address.match(regex)) {
    return `${address.slice(0, 4)}…${address.slice(address.length - 4, address.length)}`;
  }

  return address;
};

export default formatAddress;
