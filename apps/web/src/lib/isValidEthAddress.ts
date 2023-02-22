import { ethers } from 'ethers';

const isValidEthAddress = (address: string) => {
  return ethers.utils.isAddress(address);
};

export default isValidEthAddress;
