export const polygonRpcs = ['https://polygon.rpc.thirdweb.com', 'https://rpc.ankr.com/polygon'];
export const mumbaiRpcs = ['https://mumbai.rpc.thirdweb.com', 'https://rpc.ankr.com/polygon_mumbai'];
export const ethereumRpcs = ['https://ethereum.rpc.thirdweb.com', 'https://rpc.ankr.com/eth'];

/**
 * Get RPC URL based on chainId
 * @param chainId Chain ID
 * @returns RPC URL
 */
const getRpc = (chainId: number) => {
  switch (chainId) {
    case 137:
      return polygonRpcs[Math.floor(Math.random() * polygonRpcs.length)];
    case 80001:
      return mumbaiRpcs[Math.floor(Math.random() * mumbaiRpcs.length)];
    default:
      return ethereumRpcs[Math.floor(Math.random() * ethereumRpcs.length)];
  }
};

export default getRpc;
