export const getIPFSLink = (hash: string) => {
  return hash.replace('ipfs://', 'https://ipfs.infura.io/ipfs/')
}
