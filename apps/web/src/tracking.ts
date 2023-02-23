// Strings used for events tracking

export const PAGEVIEW = 'pageview';
export const USER = {
  LOGIN: 'User login',
  LOGOUT: 'User logout',
  SIWL: 'Sign in with Lens',
  CHANGE_WALLET: 'Change wallet'
};

export const PROFILE = {
  FOLLOW: 'Follow profile',
  SUPER_FOLLOW: 'Super follow profile',
  UNFOLLOW: 'Unfollow profile',
  OPEN_SUPER_FOLLOW: 'Open super follow modal',
  OPEN_FOLLOWING: 'Open following list',
  OPEN_FOLLOWERS: 'Open followers list',
  OPEN_MUTUAL_FOLLOWERS: 'Open mutual followers list',
  SWITCH_FEED: 'Switch to feed tab in profile',
  SWITCH_REPLIES: 'Switch to replies tab in profile',
  SWITCH_MEDIA: 'Switch to media tab in profile',
  SWITCH_NFTS: 'Switch to NFT tab in profile',
  SWITCH_PROFILE: 'Switch profile',
  LOGOUT: 'Profile logout'
};

export const PUBLICATION = {
  LIKE: 'Like publication',
  DISLIKE: 'Dislike publication',
  MIRROR: 'Mirror publication',
  EMBED: 'Embed publication',
  PERMALINK: 'Permalink publication',
  MORE: 'More publication options',
  DELETE: 'Delete publication',
  REPORT: 'Report publication',
  OEMBED_CLICK: 'Click publication oembed',
  MENTION_CLICK: 'Click publication mention',
  HASHTAG_CLICK: 'Click publication hashtag',
  STATS: {
    MIRRORED_BY: 'Open mirrored by list',
    LIKED_BY: 'Open liked by list',
    COLLECTED_BY: 'Open collected by list'
  },
  ATTACHMENT: {
    IMAGE: {
      OPEN: 'Open image attachment'
    },
    AUDIO: {
      PLAY: 'Play audio',
      PAUSE: 'Pause audio'
    }
  },
  COLLECT_MODULE: {
    COLLECT: 'Collect publication',
    OPEN_COLLECT: 'Open collect modal',
    OPEN_COLLECTORS: 'Open collectors list',
    OPEN_UNISWAP: 'Open Uniswap'
  },
  TOKEN_GATED: {
    DECRYPT: 'Decrypt token gated publication',
    CHECKLIST_NAVIGATED_TO_COLLECT: 'Decrypt checklist navigated to collect',
    CHECKLIST_NAVIGATED_TO_TOKEN: 'Decrypt checklist navigated to token',
    CHECKLIST_NAVIGATED_TO_NFT: 'Decrypt checklist navigated to NFT'
  },
  NEW: {
    MARKDOWN_PREVIEW: 'Preview markdown',
    OPEN_GIF: 'Open GIF modal',
    ATTACHMENT: {
      UPLOAD_IMAGES: 'Select upload images',
      UPLOAD_VIDEO: 'Select upload video',
      UPLOAD_AUDIO: 'Select upload audio'
    },
    COLLECT_MODULE: {
      OPEN_COLLECT_SETTINGS: 'Open collect module settings',
      TOGGLE_COLLECT_MODULE: 'Toggle collect module',
      TOGGLE_CHARGE_FOR_COLLECT: 'Toggle charge for collect',
      TOGGLE_MIRROR_REFERRAL_REWARD: 'Toggle mirror referral reward',
      TOGGLE_LIMITED_EDITION_COLLECT: 'Toggle limited edition collect',
      TOGGLE_TIME_LIMIT_COLLECT: 'Toggle time limit collect',
      TOGGLE_FOLLOWERS_ONLY_COLLECT: 'Toggle followers only collect',
      TOGGLE_MULTIPLE_RECIPIENTS_COLLECT: 'Toggle multiple recipients collect'
    },
    REFERENCE_MODULE: {
      OPEN_REFERENCE_SETTINGS: 'Open reference module settings',
      EVERYONE: 'Select everyone reference',
      MY_FOLLOWERS: 'Select my followers reference',
      MY_FOLLOWS: 'Select my follows reference',
      FRIENDS_OF_FRIENDS: 'Select friends of friends reference'
    },
    ACCESS: {
      OPEN_ACCESS_SETTINGS: 'Open access settings',
      TOGGLE_RESTRICTED_ACCESS: 'Toggle restricted access',
      TOGGLE_COLLECT_TO_VIEW_ACCESS: 'Toggle collect to view access',
      TOGGLE_FOLLOW_TO_VIEW_ACCESS: 'Toggle follow to view access'
    }
  }
};

export const POST = {
  NEW: 'New post'
};

export const COMMENT = {
  NEW: 'New comment'
};

export const NOTIFICATION = {
  OPEN: 'Open notifications',
  SWITCH_ALL: 'Switch to all notifications',
  SWITCH_MENTIONS: 'Switch to mentions notifications',
  SWITCH_COMMENTS: 'Switch to comments notifications',
  SWITCH_COLLECTS: 'Switch to collects notifications',
  SWITCH_LIKES: 'Switch to likes notifications'
};

export const MESSAGES = {
  SEND: 'Send message',
  OPEN_NEW_CONVERSATION: 'Open new conversation modal'
};

export const SETTINGS = {
  ACCOUNT: {
    OPEN_VERIFICATION: 'Open account verification',
    SET_DEFAULT_PROFILE: 'Set default profile',
    SET_SUPER_FOLLOW: 'Set super follow'
  },
  PROFILE: {
    UPDATE: 'Update profile',
    SET_NFT_PICTURE: 'Set NFT profile picture',
    SET_PICTURE: 'Set profile picture',
    SET_STATUS: 'Set profile status',
    CLEAR_STATUS: 'Clear profile status'
  },
  DISPATCHER: {
    TOGGLE: 'Toggle dispatcher'
  },
  INTERESTS: {
    ADD: 'Add profile interest',
    REMOVE: 'Remove profile interest'
  },
  DELETE: 'Delete profile'
};

export const MOD = {
  SPAM: 'Mod spam report',
  OTHER: 'Mod report'
};

export const STAFFTOOLS = {
  TOGGLE_MODE: 'Toggle staff mode'
};

export const SEARCH = {
  FOCUS: 'Focus search input',
  CLEAR: 'Clear search text'
};

export const SYSTEM = {
  SWITCH_THEME: 'Switch theme',
  SWITCH_NETWORK: 'Switch network'
};

export const MISCELLANEOUS = {
  NAVIGATE_UPDATE_PROFILE: 'Navigate to update profile from onboarding',
  NAVIGATE_UPDATE_PROFILE_INTERESTS: 'Navigate to update profile interests from onboarding',
  OPEN_RECOMMENDED_PROFILES: 'Open recommended profiles modal',
  OPEN_TRENDING_TAG: 'Open trending tag',
  SWITCH_TIMELINE: 'Switch to timeline',
  SWITCH_HIGHLIGHTS: 'Switch to highlights',
  SELECT_USER_FEED: 'Select user feed'
};

export const FOOTER = {
  DISCORD: 'Open Discord',
  DONATE: 'Open donate',
  STATUS: 'Open status',
  VOTE: 'Open vote',
  FEEDBACK: 'Open feedback',
  GITHUB: 'Open GitHub',
  TRANSLATE: 'Open translate',
  VERCEL: 'Open Vercel'
};
