// Strings used for events tracking

export const PAGEVIEW = "Pageview";
export const AUTH = {
  CHANGE_WALLET: "Change wallet",
  CONNECT_WALLET: "Connect wallet",
  LOGIN: "User login",
  LOGOUT: "User logout",
  OPEN_LOGIN: "Open login modal",
  OPEN_SIGNUP: "Open signup modal",
  SIGNUP: "User signup",
  SWITCH_TO_SIGNUP: "Switch to signup"
};

export const ACCOUNT = {
  BLOCK: "Block account",
  COPY_ACCOUNT_ADDRESS: "Copy account address",
  COPY_ACCOUNT_ID: "Copy account ID",
  COPY_ACCOUNT_LINK: "Copy account link",
  DISMISS_RECOMMENDED_ACCOUNT: "Dismiss recommended account",
  FOLLOW: "Follow account",
  OPEN_RECOMMENDED_ACCOUNTS: "Open recommended accounts modal",
  OPEN_SUPER_FOLLOW: "Open super follow modal",
  RECOMMENDED: "Recommended the account",
  REPORT: "Report account",
  SUPER_FOLLOW: "Super follow account",
  SWITCH_ACCOUNT: "Switch account",
  SWITCH_ACCOUNT_FEED_TAB: "Switch account feed tab",
  SWITCH_ACCOUNT_STATS_TAB: "Switch account stats tab",
  UNBLOCK: "Unblock account",
  UNFOLLOW: "Unfollow account",
  UNRECOMENDED: "Unrecommended the account",
  OPEN_FOLLOWERS: "Open followers modal",
  OPEN_FOLLOWING: "Open following modal",
  OPEN_MUTUAL_FOLLOWERS: "Open mutual followers modal"
};

export const POST = {
  ATTACHMENT: {
    AUDIO: {
      PAUSE: "Pause audio",
      PLAY: "Play audio"
    },
    IMAGE: {
      OPEN: "Open image attachment"
    }
  },
  BOOKMARK: "Bookmark post",
  CLICK_CASHTAG: "Click post cashtag",
  CLICK_CLUB: "Click post club",
  CLICK_FRAME_BUTTON: "Click post frame button",
  CLICK_HASHTAG: "Click post hashtag",
  CLICK_MENTION: "Click post mention",
  CLICK_OEMBED: "Click post oembed",
  COLLECT_MODULE: {
    COLLECT: "Collect post",
    DOWNLOAD_COLLECTORS: "Download collectors CSV file",
    OPEN_COLLECT: "Open collect modal",
    OPEN_UNISWAP: "Open Uniswap"
  },
  COPY_ID: "Copy post ID",
  COPY_TEXT: "Copy post text",
  DELETE: "Delete post",
  LIKE: "Like post",
  MIRROR: "Mirror post",
  NEW_COMMENT: "New comment",
  NEW_POST: "New post",
  NEW_QUOTE: "New quote",
  NOT_INTERESTED: "Not interested post",
  OPEN_GIFS: "Open GIFs modal",
  OPEN_LIKES: "Open likes modal",
  OPEN_MIRRORS: "Open mirrors modal",
  OPEN_COLLECTORS: "Open collectors modal",
  REMOVE_BOOKMARK: "Remove bookmark post",
  REPORT: "Report post",
  SHARE: "Share post",
  TIP: {
    ENABLE: "Tipping enabled",
    TIP: "Tip"
  },
  TOGGLE_HIDE_COMMENT: "Toggle post hide comment",
  TOGGLE_MUTED_POST: "Toggle muted post",
  TRANSLATE: "Translate post",
  UNDO_MIRROR: "Undo mirror post",
  UNDO_NOT_INTERESTED: "Undo not interested post",
  UNLIKE: "Unlike post",
  UNPIN: "Unpin post",
  WIDGET: {
    POLL: { VOTE: "Vote on poll" }
  }
};

export const LIST = {
  FOLLOW_ALL: "Follow all profiles in list"
};

export const NOTIFICATION = {
  SWITCH_NOTIFICATION_TAB: "Switch notifications tab"
};

export const ANALYTICS = {
  SWITCH_ANALYTICS_TAB: "Switch analytics tab"
};

export const HOME = {
  SELECT_USER_FEED: "Select user feed",
  SWITCH_FOLLOWING_FEED: "Switch to following feed",
  SWITCH_FORYOU_FEED: "Switch to for you feed",
  SWITCH_PREMIUM_FEED: "Switch to premium feed",
  SWITCH_PINNED_LIST: "Switch to pinned list"
};

export const EXPLORE = {
  SWITCH_EXPLORE_FEED_FOCUS: "Switch explore feed focus",
  SWITCH_EXPLORE_FEED_TAB: "Switch explore feed tab"
};

export const SETTINGS = {
  ACCOUNT: {
    REQUEST_VERIFICATION: "Request verification",
    RESEND_EMAIL_VERIFICATION: "Resend email verification",
    SET_DEFAULT_PROFILE: "Set default profile",
    SET_EMAIL: "Set email",
    SET_SUPER_FOLLOW: "Set super follow",
    UPDATE: "Update account"
  },
  ALLOWANCE: {
    TOGGLE: "Toggle allowance"
  },
  DANGER: {
    DELETE_PROFILE: "Delete profile",
    PROTECT_PROFILE: "Protect profile",
    UNPROTECT_HANDLE: "Unprotect handle",
    UNPROTECT_PROFILE: "Unprotect profile"
  },
  EXPORT: {
    FOLLOWERS: "Export followers",
    FOLLOWING: "Export following",
    NOTIFICATIONS: "Export notifications",
    PROFILE: "Export profile",
    POSTS: "Export posts"
  },
  HANDLE: {
    LINK: "Link handle",
    UNLINK: "Unlink handle"
  },
  INTERESTS: {
    ADD: "Add profile interest",
    REMOVE: "Remove profile interest"
  },
  MANAGER: {
    ADD_MANAGER: "Add profile manager",
    REMOVE_MANAGER: "Remove profile manager",
    TOGGLE: "Toggle lens manager",
    UPDATE: "Update lens manager"
  },
  PREFERENCES: {
    TOGGLE_HIGH_SIGNAL_NOTIFICATION_FILTER:
      "Toggle high signal notification filter",
    TOGGLE_DEVELOPER_MODE: "Toggle developer mode",
    APP_ICON: "Update app icon",
    MUTE_WORD: "Mute word",
    UNMUTE_WORD: "Unmute word"
  },
  SESSIONS: {
    REVOKE: "Revoke session"
  }
};

export const GARDENER = {
  REPORT: "Gardener report",
  SEARCH_POST: "Gardener search post"
};

export const STAFFTOOLS = {
  PERMISSIONS: {
    BULK_ASSIGN: "Staff Tool: Bulk assign permission"
  },
  STAFF_PICKS: {
    CREATE: "Staff Tool: Create staff pick",
    DELETE: "Staff Tool: Delete staff pick"
  },
  TOGGLE_MODE: "Toggle staff mode",
  TOKENS: {
    CREATE: "Staff Tool: Create token",
    DELETE: "Staff Tool: Delete token"
  },
  USERS: {
    ASSIGN_PERMISSION: "Staff Tool: Assign permission"
  }
};

export const CREATORTOOLS = {
  ASSIGN_PERMISSION: "Creator Tool: Assign permission"
};

export const SEARCH = {
  CLEAR_ALL_RECENT_SEARCH: "Clear all recent search",
  CLEAR_RECENT_SEARCH: "Clear recent search",
  SEARCH: "Search"
};

export const SYSTEM = {
  SWITCH_NETWORK: "Switch network",
  SWITCH_THEME: "Switch theme"
};

export const MISCELLANEOUS = {
  DISMISSED_MEMBERSHIP_NFT_BANNER: "Dismissed membership NFT banner",
  FOOTER: {
    OPEN_DISCORD: "Open Discord",
    OPEN_GITHUB: "Open GitHub",
    OPEN_HEY: "Open Hey",
    OPEN_STATUS: "Open status",
    OPEN_VERCEL: "Open Vercel"
  },
  OPEN_GITCOIN: "Open Gitcoin"
};

export const ONBOARDING = {
  NAVIGATE_UPDATE_PROFILE: "Navigate to update profile from onboarding",
  NAVIGATE_UPDATE_EMAIL: "Navigate to update email from onboarding",
  NAVIGATE_UPDATE_PROFILE_INTERESTS:
    "Navigate to update profile interests from onboarding"
};

// enums
export const ALL_EVENTS = {
  PAGEVIEW,
  ...AUTH,
  ...ACCOUNT,
  ...LIST,
  ...POST,
  ...NOTIFICATION,
  ...HOME,
  ...EXPLORE,
  ...SETTINGS,
  ...GARDENER,
  ...STAFFTOOLS,
  ...CREATORTOOLS,
  ...SEARCH,
  ...SYSTEM,
  ...MISCELLANEOUS,
  ...ONBOARDING
};

export enum AccountLinkSource {
  ClubMembers = "club-members",
  Collects = "collects",
  Followers = "followers",
  Following = "following",
  Likes = "likes",
  Mirrors = "mirrors",
  Post = "post",
  Quotes = "quotes",
  RecentSearch = "recent-search",
  RelevantPeople = "relevant-people",
  Search = "search",
  StaffPicks = "staff-picks",
  WhoToFollow = "who-to-follow",
  ListAccounts = "list-accounts"
}
