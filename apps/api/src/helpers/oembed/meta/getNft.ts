import type { Nft } from "@hey/types/misc";
import type { Address } from "viem";

import { IGNORED_NFT_HOSTS } from "@hey/data/og";
import getNftChainId from "@hey/helpers/getNftChainId";

// https://reflect.site/g/yoginth/hey-nft-extended-open-graph-spec/780502f3c8a3404bb2d7c39ec091602e
const getNft = (document: Document, sourceUrl: string): Nft | null => {
  if (IGNORED_NFT_HOSTS.includes(new URL(sourceUrl).hostname)) {
    return null;
  }

  const getMeta = (key: string) => {
    const selector = `meta[name="${key}"], meta[property="${key}"]`;
    const metaTag = document.querySelector(selector);
    return metaTag ? metaTag.getAttribute("content") : null;
  };

  let collectionName = getMeta("eth:nft:collection") as string;
  const contractAddress = getMeta("eth:nft:contract_address") as Address;
  const creatorAddress = getMeta("eth:nft:creator_address") as Address;
  let chain = getMeta("eth:nft:chain") || getMeta("nft:chain");
  let mediaUrl = (getMeta("og:image") ||
    getMeta("eth:nft:media_url")) as string;
  const description = getMeta("og:description") as string;
  const mintCount = getMeta("eth:nft:mint_count") as string;
  const mintStatus = getMeta("eth:nft:status");
  const mintUrl = getMeta("eth:nft:mint_url") as string;
  const schema = getMeta("eth:nft:schema") as string;
  const endTime = getMeta("eth:nft:endtime");

  if (!collectionName || !mediaUrl) {
    const hasFCFrame = getMeta("fc:frame:button:1:action") === "mint";

    if (hasFCFrame) {
      const target = getMeta("fc:frame:button:1:target");
      collectionName = getMeta("og:title") as string;

      chain = target?.startsWith("eip")
        ? getNftChainId(target.split(":")[1])
        : null;
      mediaUrl = (getMeta("fc:frame:image") || getMeta("og:image")) as string;

      if (!collectionName || !mediaUrl) {
        return null;
      }
    }
  }

  if (!collectionName && !contractAddress && !creatorAddress && !schema) {
    return null;
  }

  return {
    chain,
    collectionName,
    contractAddress,
    creatorAddress,
    description,
    endTime,
    mediaUrl,
    mintCount,
    mintStatus,
    mintUrl,
    schema,
    sourceUrl
  };
};

export default getNft;
