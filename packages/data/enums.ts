export enum HomeFeedType {
  FOLLOWING = 'FOLLOWING',
  HEY_MOSTINTERACTED = 'HEY_MOSTINTERACTED',
  HEY_MOSTVIEWED = 'HEY_MOSTVIEWED',
  HIGHLIGHTS = 'HIGHLIGHTS',
  K3L_CROWDSOURCED = 'K3L_CROWDSOURCED',
  K3L_FOLLOWING = 'K3L_FOLLOWING',
  K3L_POPULAR = 'K3L_POPULAR',
  // Thirdparty Algorithms
  K3L_RECENT = 'K3L_RECENT',
  K3L_RECOMMENDED = 'K3L_RECOMMENDED',
  PREMIUM = 'PREMIUM'
}
export enum ModFeedType {
  LATEST = 'LATEST',
  PROFILES = 'PROFILES',
  SEARCH = 'SEARCH'
}

export const AlgorithmProvider = {
  HEY: 'hey',
  K3L: 'k3l'
};

export enum OpenAction {
  Tip = 'Tip'
}
