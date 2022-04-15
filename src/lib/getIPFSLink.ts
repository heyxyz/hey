const getIPFSLink = (hash: string): string => {
  return hash.replace('ipfs://', 'https://ipfs.infura.io/ipfs/')
}

export default getIPFSLink
