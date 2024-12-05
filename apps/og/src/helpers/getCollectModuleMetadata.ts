import getPostOGImages from "@helpers/getPostOGImages";
import { APP_NAME } from "@hey/data/constants";
import allowedPostActionModules from "@hey/helpers/allowedPostActionModules";
import getAccount from "@hey/helpers/getAccount";
import type { Post } from "@hey/indexer";

const getCollectModuleMetadata = (post: Post) => {
  const { actions } = post;

  if (!actions) {
    return;
  }

  const postAction = actions.filter((action) =>
    allowedPostActionModules.includes(action.__typename)
  );

  // 0 th index is the collect module
  const collectModule = postAction.length ? postAction[0] : null;

  if (!collectModule) {
    return;
  }

  const { slugWithPrefix } = getAccount(post.author);

  return {
    "eth:nft:chain": "polygon",
    "eth:nft:collection": `${post.__typename} by ${slugWithPrefix} • ${APP_NAME}`,
    "eth:nft:contract_address": collectModule.contract.address,
    "eth:nft:creator_address": post.author.owner,
    "eth:nft:media_url": getPostOGImages(post.metadata)[0],
    "eth:nft:mint_count": post.stats.countOpenActions,
    "eth:nft:mint_url": `https://hey.xyz/posts/${post.id}`,
    "eth:nft:schema": "ERC721"
  };
};

export default getCollectModuleMetadata;
