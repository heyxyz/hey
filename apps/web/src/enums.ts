export enum OptmisticPublicationType {
  NewPost = 'NEW_POST',
  NewComment = 'NEW_COMMENT'
}

export enum NotificationType {
  All = 'ALL',
  Mentions = 'MENTIONS',
  Comments = 'COMMENTS',
  Likes = 'LIKES',
  Collects = 'COLLECTS'
}

export enum ProfileFeedType {
  Feed = 'FEED',
  Replies = 'REPLIES',
  Media = 'MEDIA',
  Collects = 'COLLECTS',
  Nft = 'NFT',
  Stats = 'STATS'
}

export enum MessageTabs {
  Inbox = 'Inbox',
  Following = 'Following'
}

export enum TokenGateCondition {
  HAVE_A_LENS_PROFILE = 'HAVE_HANDLE',
  FOLLOW_A_LENS_PROFILE = 'FOLLOW_HANDLE',
  COLLECT_A_POST = 'COLLECT_POST',
  MIRROR_A_POST = 'MIRROR_POST'
}

export enum MusicTrack {
  DEFAULT = 'DEFAULT',
  CALM_MY_MIND = 'CALM_MY_MIND',
  CRADLE_OF_SOUL = 'CRADLE_OF_SOUL',
  FOREST_LULLABY = 'FOREST_LULLABY'
}

export enum NewPublicationTypes {
  Publication = 'PUBLICATION',
  Spaces = 'SPACES'
}

export enum SpacesEvents {
  APP_INITIALIZED = 'app:initialized',
  APP_MIC_ON = 'app:mic-on',
  APP_MIC_OFF = 'app:mic-off',
  ROOM_DATA_RECEIVED = 'room:data-received',
  ROOM_PEER_JOINED = 'room:peer-joined',
  ROOM_ME_LEFT = 'room:me-left',
  ROOM_ME_ROLE_UPDATE = 'room:me-role-update'
}
