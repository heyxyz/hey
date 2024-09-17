import { prideHashtags } from "./pride-hashtags";

export const hashflags: Record<string, string> = {
  bhm: "blm",
  bitcoin: "bitcoin",
  blacklivesmatter: "blm",
  blm: "blm",
  bonsai: "bonsai",
  btc: "bitcoin",
  bts: "bts",
  btsarmy: "btsarmy",
  eth: "ethereum",
  ethereum: "ethereum",
  hashtag: "hashtag",
  hey: "hey",
  lens: "lens",
  tape: "tape",
  voted: "voted",
  ...(() => {
    const acc: Record<string, string> = {};
    for (const cur of prideHashtags) {
      acc[cur] = "pride";
    }
    return acc;
  })()
};
