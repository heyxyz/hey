// Strings used for events tracking

export const PAGEVIEW = 'Pageview';
export const AUTH = {
  CHANGE_WALLET: 'Change wallet',
  CONNECT_WALLET: 'Connect wallet',
  LOGIN: 'User login',
  LOGOUT: 'User logout',
  OPEN_LOGIN: 'Open login modal',
  OPEN_SIGNUP: 'Open signup modal',
  SIGNUP: 'User signup',
  SWITCH_TO_SIGNUP: 'Switch to signup'
};

export const PROFILE = {
  BLOCK: 'Block profile',
  COPY_PROFILE_LINK: 'Copy profile link',
  DISMISS_RECOMMENDED_PROFILE: 'Dismiss recommended profile',
  FOLLOW: 'Follow profile',
  OPEN_RECOMMENDED_PROFILES: 'Open recommended profiles modal',
  OPEN_SUPER_FOLLOW: 'Open super follow modal',
  REPORT: 'Report profile',
  SUPER_FOLLOW: 'Super follow profile',
  SWITCH_PROFILE: 'Switch profile',
  SWITCH_PROFILE_FEED_TAB: 'Switch profile feed tab',
  SWITCH_PROFILE_STATS_TAB: 'Switch profile stats tab',
  UNBLOCK: 'Unblock profile',
  UNFOLLOW: 'Unfollow profile'
};

export const PUBLICATION = {
  ATTACHMENT: {
    AUDIO: {
      PAUSE: 'Pause audio',
      PLAY: 'Play audio'
    },
    IMAGE: {
      OPEN: 'Open image attachment'
    }
  },
  CLICK_CASHTAG: 'Click publication cashtag',
  CLICK_HASHTAG: 'Click publication hashtag',
  CLICK_MENTION: 'Click publication mention',
  CLICK_OEMBED: 'Click publication oembed',
  COLLECT_MODULE: {
    COLLECT: 'Collect publication',
    OPEN_COLLECT: 'Open collect modal',
    OPEN_UNISWAP: 'Open Uniswap'
  },
  COPY_TEXT: 'Copy publication text',
  DELETE: 'Delete publication',
  LIKE: 'Like publication',
  MIRROR: 'Mirror publication',
  NEW_COMMENT: 'New comment',
  NEW_POST: 'New post',
  NEW_QUOTE: 'New quote',
  OPEN_ACTIONS: {
    SWAP: {
      SWAP: 'Swap OA: Swap'
    },
    TIP: {
      OPEN_TIP: 'Tip OA: Open tip modal',
      TIP: 'Tip OA: Tip a profile'
    }
  },
  OPEN_GIFS: 'Open GIFs modal',
  OPEN_LIKES: 'Open likes modal',
  OPEN_NFT: 'Open NFT',
  REPORT: 'Report publication',
  SHARE: 'Share publication',
  TOGGLE_BOOKMARK: 'Toggle publication bookmark',
  TOGGLE_HIDE_COMMENT: 'Toggle publication hide comment',
  TOGGLE_NOT_INTERESTED: 'Toggle publication not interested',
  TRANSLATE: 'Translate publication',
  UNDO_MIRROR: 'Undo mirror publication',
  UNLIKE: 'Unlike publication',
  WIDGET: {
    POLL: { VOTE: 'Vote on poll' }
  }
};

export const NOTIFICATION = {
  SWITCH_NOTIFICATION_TAB: 'Switch notifications tab'
};

export const HOME = {
  ALGORITHMS: {
    OPEN_ALGORITHMS: 'Open algorithms modal',
    SWITCH_ALGORITHMIC_FEED: 'Switch to algorithmic feed'
  },
  SELECT_USER_FEED: 'Select user feed',
  SWITCH_FOLLOWING_FEED: 'Switch to following feed',
  SWITCH_HIGHLIGHTS_FEED: 'Switch to highlights feed',
  SWITCH_PREMIUM_FEED: 'Switch to premium feed'
};

export const EXPLORE = {
  SWITCH_EXPLORE_FEED_FOCUS: 'Switch explore feed focus',
  SWITCH_EXPLORE_FEED_TAB: 'Switch explore feed tab'
};

export const SETTINGS = {
  ACCOUNT: {
    SET_DEFAULT_PROFILE: 'Set default profile',
    SET_SUPER_FOLLOW: 'Set super follow'
  },
  ALLOWANCE: {
    TOGGLE: 'Toggle allowance'
  },
  DANGER: {
    DELETE_PROFILE: 'Delete profile',
    PROTECT_PROFILE: 'Protect profile',
    UNPROTECT_HANDLE: 'Unprotect handle',
    UNPROTECT_PROFILE: 'Unprotect profile'
  },
  EXPORT: {
    FOLLOWERS: 'Export followers',
    FOLLOWING: 'Export following',
    NOTIFICATIONS: 'Export notifications',
    PROFILE: 'Export profile',
    PUBLICATIONS: 'Export publications'
  },
  HANDLE: {
    LINK: 'Link handle',
    UNLINK: 'Unlink handle'
  },
  INTERESTS: {
    ADD: 'Add profile interest',
    REMOVE: 'Remove profile interest'
  },
  MANAGER: {
    ADD_MANAGER: 'Add profile manager',
    REMOVE_MANAGER: 'Remove profile manager',
    TOGGLE: 'Toggle lens manager',
    UPDATE: 'Update lens manager'
  },
  PREFERENCES: {
    TOGGLE_HIGH_SIGNAL_NOTIFICATION_FILTER:
      'Toggle high signal notification filter',
    TOGGLE_IS_PRIDE: 'Toggle is pride',
    TOGGLE_PUSH_NOTIFICATIONS: 'Toggle push notifications'
  },
  PROFILE: {
    SET_PICTURE: 'Set profile picture',
    UPDATE: 'Update profile'
  },
  SESSIONS: {
    REVOKE: 'Revoke session'
  }
};

export const INVITE = {
  INVITE: 'Invite address',
  OPEN_INVITE: 'Open invite modal'
};

export const MESSAGES = {
  ALLOW_USER: 'Allow user',
  BLOCK_USER: 'Block user',
  ENABLE_MESSAGES: 'Enable messages',
  OPEN_CONVERSATION: 'Open conversation',
  SEND_MESSAGE: 'Send message',
  START_CONVERSATION: 'Start conversation'
};

export const GARDENER = {
  PROFILE: {
    P2P_RECOMMEND: 'P2P recommend profile',
    P2P_UNRECOMMEND: 'P2P unrecommend profile'
  },
  REPORT: 'Gardener report',
  SEARCH_PUBLICATION: 'Gardener search publication',
  TOGGLE_MODE: 'Toggle gardener mode'
};

export const STAFFTOOLS = {
  FEATURE_FLAGS: {
    BULK_ASSIGN: 'Staff Tool: Bulk assign feature flag',
    CREATE: 'Staff Tool: Create feature flag',
    DELETE: 'Staff Tool: Delete feature flag',
    KILL: 'Staff Tool: Kill feature flag'
  },
  SIGNUP_CONTRACT: {
    REFILL: 'Staff Tool: Refill relayer',
    WITHDRAW_FUNDS: 'Staff Tool: Withdraw funds'
  },
  STAFF_PICKS: {
    CREATE: 'Staff Tool: Create staff pick',
    DELETE: 'Staff Tool: Delete staff pick'
  },
  TOGGLE_MODE: 'Toggle staff mode',
  TOKENS: {
    CREATE: 'Staff Tool: Create token',
    DELETE: 'Staff Tool: Delete token'
  },
  USERS: {
    ASSIGN_FEATURE_FLAG: 'Staff Tool: Assign feature flag'
  }
};

export const CREATORTOOLS = {
  ASSIGN_FEATURE_FLAG: 'Creator Tool: Assign feature flag'
};

export const SEARCH = {
  CLEAR_ALL_RECENT_SEARCH: 'Clear all recent search',
  CLEAR_RECENT_SEARCH: 'Clear recent search',
  SEARCH: 'Search'
};

export const SYSTEM = {
  SWITCH_NETWORK: 'Switch network',
  SWITCH_THEME: 'Switch theme'
};

export const MISCELLANEOUS = {
  DISMISSED_MEMBERSHIP_NFT_BANNER: 'Dismissed membership NFT banner',
  FOOTER: {
    OPEN_DISCORD: 'Open Discord',
    OPEN_FEEDBACK: 'Open feedback',
    OPEN_GITHUB: 'Open GitHub',
    OPEN_STATUS: 'Open status',
    OPEN_SUPPORT: 'Open support',
    OPEN_VERCEL: 'Open Vercel'
  },
  OPEN_GITCOIN: 'Open Gitcoin'
};

export const ONBOARDING = {
  NAVIGATE_UPDATE_PROFILE: 'Navigate to update profile from onboarding',
  NAVIGATE_UPDATE_PROFILE_INTERESTS:
    'Navigate to update profile interests from onboarding'
};

// enums
export const ALL_EVENTS = {
  PAGEVIEW,
  ...AUTH,
  ...PROFILE,
  ...PUBLICATION,
  ...NOTIFICATION,
  ...HOME,
  ...EXPLORE,
  ...SETTINGS,
  ...INVITE,
  ...MESSAGES,
  ...GARDENER,
  ...STAFFTOOLS,
  ...CREATORTOOLS,
  ...SEARCH,
  ...SYSTEM,
  ...MISCELLANEOUS,
  ...ONBOARDING
};

export enum ProfileLinkSource {
  Collects = 'collects',
  Followers = 'followers',
  Following = 'following',
  Likes = 'likes',
  Mirrors = 'mirrors',
  Publication = 'publication',
  Quotes = 'quotes',
  RecentSearch = 'recent-search',
  RelevantPeople = 'relevant-people',
  Search = 'search',
  StaffPicks = 'staff-picks',
  WhoToFollow = 'who-to-follow'
}
