import { ADDRESS_REGEX } from 'src/constants';

const formatAddress = (address: string | null | undefined): string => {
  if (!address) return '';

  const regex = ADDRESS_REGEX;
  if (address.match(regex)) {
    return `${address.slice(0, 4)}…${address.slice(address.length - 4, address.length)}`;
  } else {
    return address;
  }
};

export default formatAddress;
