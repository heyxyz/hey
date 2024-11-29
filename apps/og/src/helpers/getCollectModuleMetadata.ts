import getPostOGImages from "@helpers/getPostOGImages";
import { APP_NAME } from "@hey/data/constants";
import allowedOpenActionModules from "@hey/helpers/allowedOpenActionModules";
import getAccount from "@hey/helpers/getAccount";

const getCollectModuleMetadata = (post: MirrorablePublication) => {
  const { openActionModules } = post;

  if (!openActionModules) {
    return;
  }

  const openAction = openActionModules.filter((module) =>
    allowedOpenActionModules.includes(module.type)
  );

  // 0 th index is the collect module
  const collectModule = openAction.length ? openAction[0] : null;

  if (!collectModule) {
    return;
  }

  const { slugWithPrefix } = getAccount(post.by);

  return {
    "eth:nft:chain": "polygon",
    "eth:nft:collection": `${post.__typename} by ${slugWithPrefix} • ${APP_NAME}`,
    "eth:nft:contract_address": collectModule.contract.address,
    "eth:nft:creator_address": post.by.owner,
    "eth:nft:media_url": getPostOGImages(post.metadata)[0],
    "eth:nft:mint_count": post.stats.countOpenActions,
    "eth:nft:mint_url": `https://hey.xyz/posts/${post.id}`,
    "eth:nft:schema": "ERC721"
  };
};

export default getCollectModuleMetadata;
