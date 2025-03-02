import { isAddress } from "viem";

const prepareProUsername = (address: string, date?: string | null) => {
  if (!isAddress(address)) {
    throw new Error("Invalid Ethereum address");
  }

  const cleanedAddress = address.toLowerCase();
  const prefix = cleanedAddress.slice(2, 12) + cleanedAddress.slice(-10);

  const baseEpoch = date
    ? Math.floor(new Date(date).getTime() / 1000)
    : Math.floor(Date.now() / 1000);

  if (Number.isNaN(baseEpoch)) {
    throw new Error("Invalid date format");
  }

  const epoch = (baseEpoch + 30 * 24 * 60 * 60).toString().padStart(10, "0");

  return `${prefix}-${epoch}`;
};

export default prepareProUsername;
