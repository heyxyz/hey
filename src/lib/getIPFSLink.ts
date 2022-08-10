import { IPFS_GATEWAY } from 'src/constants';

const getIPFSLink = (hash: string): string => {
  const infuraIPFS = `${IPFS_GATEWAY}/ipfs/`;

  return hash
    .replace(/^Qm[1-9A-Za-z]{44}/gm, `${infuraIPFS}${hash}`)
    .replace('https://ipfs.io/ipfs/', infuraIPFS)
    .replace('ipfs://', infuraIPFS);
};

export default getIPFSLink;
