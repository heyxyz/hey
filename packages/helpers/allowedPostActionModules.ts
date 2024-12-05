import { PostActionType } from "@hey/indexer";

const allowedPostActionModules = [
  PostActionType.SimpleCollectAction,
  PostActionType.MultirecipientFeeCollectOpenActionModule
];

export default allowedPostActionModules;
