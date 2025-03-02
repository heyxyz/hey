import { isAddress } from "viem";

const prepareProUsername = (address: string) => {
  if (!isAddress(address)) {
    throw new Error("Invalid Ethereum address");
  }

  const cleanedAddress = address.toLowerCase();
  const prefix = cleanedAddress.slice(2, 12) + cleanedAddress.slice(-10);
  const epoch = Math.floor(Date.now() / 1000)
    .toString()
    .padStart(10, "0");

  return `${prefix}-${epoch}`;
};

export default prepareProUsername;
