import { PostActionType } from "@hey/indexer";

/**
 * Returns the name of the specified module to be used in the actOn key.
 *
 * @param name Name of the module.
 * @returns Name of the module to be used in the actOn key.
 */
const getPostActionActOnKey = (name: string): string => {
  switch (name) {
    case PostActionType.SimpleCollectAction:
      return "simpleCollectOpenAction";
    case PostActionType.MultirecipientFeeCollectAction:
      return "multirecipientCollectOpenAction";
    default:
      return "unknownOpenAction";
  }
};

export default getPostActionActOnKey;
