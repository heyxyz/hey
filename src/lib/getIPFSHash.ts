const getIPFSHash = (url: string): string | undefined => {
  return url
    ?.match(
      /Qm[1-9A-HJ-NP-Za-km-z]{44,}|b[A-Za-z2-7]{58,}|B[A-Z2-7]{58,}|z[1-9A-HJ-NP-Za-km-z]{48,}|F[0-9A-F]{50,}/
    )
    ?.at(0)
    ?.replace('.json', '');
};

export default getIPFSHash;
