// Strings used for events tracking

export const AUTH = {
  LOGIN: 'user_login',
  LOGOUT: 'user_logout',
  SIWL: 'sign_in_with_lens',
  CONNECT_WALLET: 'connect_wallet',
  CHANGE_WALLET: 'change_wallet'
};

export const PROFILE = {
  FOLLOW: 'follow_profile',
  SUPER_FOLLOW: 'super_follow_profile',
  UNFOLLOW: 'unfollow_profile',
  DISMISS_RECOMMENDED_PROFILE: 'dismiss_recommended_profile',
  OPEN_SUPER_FOLLOW: 'open_super_follow_modal',
  OPEN_FOLLOWERS: 'open_followers_modal',
  OPEN_FOLLOWING: 'open_following_modal',
  SWITCH_PROFILE_FEED_TAB: 'switch_profile_feed_tab',
  SWITCH_PROFILE: 'switch_profile',
  LOGOUT: 'profile_logout'
};

export const PUBLICATION = {
  NEW_POST: 'new_post',
  NEW_COMMENT: 'new_comment',
  LIKE: 'like_publication',
  UNLIKE: 'unlike_publication',
  MIRROR: 'mirror_publication',
  SHARE: 'share_publication',
  TRANSLATE: 'translate_publication',
  COPY_TEXT: 'copy_publication_text',
  DELETE: 'delete_publication',
  REPORT: 'report_publication',
  CLICK_OEMBED: 'click_publication_oembed',
  CLICK_HASHTAG: 'click_publication_hashtag',
  CLICK_MENTION: 'click_publication_mention',
  OPEN_LIKES: 'open_likes_modal',
  OPEN_MIRRORS: 'open_mirrors_modal',
  OPEN_COLLECTORS: 'open_collectors_modal',
  OPEN_GIFS: 'open_gifs_modal',
  ATTACHMENT: {
    IMAGE: {
      OPEN: 'open_image_attachment'
    },
    AUDIO: {
      PLAY: 'play_audio',
      PAUSE: 'pause_audio'
    }
  },
  COLLECT_MODULE: {
    OPEN_COLLECT: 'open_collect_modal',
    COLLECT: 'collect_publication',
    OPEN_UNISWAP: 'open_uniswap'
  },
  TOKEN_GATED: {
    CHECKLIST_NAVIGATED_TO_COLLECT: 'decrypt_checklist_navigated_to_collect',
    CHECKLIST_NAVIGATED_TO_TOKEN: 'decrypt_checklist_navigated_to_token',
    CHECKLIST_NAVIGATED_TO_NFT: 'decrypt_checklist_navigated_to_nft',
    DECRYPT: 'decrypt_token_gated_publication'
  },
  WIDGET: {
    SNAPSHOT: {
      OPEN_CAST_VOTE: 'snapshot_open_cast_vote_modal',
      VOTE: 'snapshot_vote'
    }
  }
};

export const NOTIFICATION = {
  SWITCH_NOTIFICATION_TAB: 'switch_notifications_tab'
};

export const EXPLORE = {
  SWITCH_EXPLORE_FEED_TAB: 'switch_explore_feed_tab',
  SWITCH_EXPLORE_FEED_FOCUS: 'switch_explore_feed_focus'
};

export const MESSAGES = {
  SEND: 'send_message',
  OPEN_NEW_CONVERSATION: 'open_new_conversation_modal'
};

export const SETTINGS = {
  ACCOUNT: {
    SET_DEFAULT_PROFILE: 'set_default_profile',
    SET_SUPER_FOLLOW: 'set_super_follow'
  },
  PROFILE: {
    UPDATE: 'update_profile',
    SET_NFT_PICTURE: 'set_nft_profile_picture',
    SET_PICTURE: 'set_profile_picture',
    SET_STATUS: 'set_profile_status',
    CLEAR_STATUS: 'clear_profile_status'
  },
  DISPATCHER: {
    TOGGLE: 'toggle_dispatcher',
    UPDATE: 'update_dispatcher'
  },
  ALLOWANCE: {
    TOGGLE: 'toggle_allowance'
  },
  INTERESTS: {
    ADD: 'add_profile_interest',
    REMOVE: 'remove_profile_interest'
  },
  EXPORT: {
    PROFILE: 'export_profile',
    PUBLICATIONS: 'export_publications',
    NOTIFICATIONS: 'export_notifications',
    FOLLOWING: 'export_following',
    FOLLOWERS: 'export_followers'
  },
  DELETE: 'delete_profile'
};

export const MOD = {
  TOGGLE_MODE: 'toggle_mod_mode',
  REPORT: 'mod_report'
};

export const STAFFTOOLS = {
  TOGGLE_MODE: 'toggle_staff_mode'
};

export const SYSTEM = {
  SWITCH_THEME: 'switch_theme',
  SWITCH_NETWORK: 'switch_network'
};

export const MISCELLANEOUS = {
  OPEN_RECOMMENDED_PROFILES: 'open_recommended_profiles_modal',
  OPEN_TRENDING_TAG: 'open_trending_tag',
  SWITCH_FOR_YOU_FEED: 'switch_to_for_you_feed',
  SWITCH_FOLLOWING_FEED: 'switch_to_following_feed',
  SWITCH_HIGHLIGHTS_FEED: 'switch_to_highlights_feed',
  SELECT_USER_FEED: 'select_user_feed',
  SELECT_LOCALE: 'select_locale',
  FOOTER: {
    OPEN_DISCORD: 'open_discord',
    OPEN_GITHUB: 'open_github',
    OPEN_VERCEL: 'open_vercel',
    OPEN_STATUS: 'open_status',
    OPEN_FEEDBACK: 'open_feedback',
    OPEN_TRANSLATE: 'open_translate',
    OPEN_DONATE: 'open_donate'
  }
};

export const ONBOARDING = {
  NAVIGATE_UPDATE_PROFILE: 'navigate_to_update_profile_from_onboarding',
  NAVIGATE_UPDATE_PROFILE_INTERESTS:
    'navigate_to_update_profile_interests_from_onboarding'
};

// enums
export enum FollowUnfollowSource {
  WHO_TO_FOLLOW = 'who_to_follow',
  WHO_TO_FOLLOW_MODAL = 'who_to_follow_modal',
  LIKES_MODAL = 'likes_modal',
  MIRRORS_MODAL = 'mirrors_modal',
  COLLECTORS_MODAL = 'collectors_modal',
  FOLLOWERS_MODAL = 'followers_modal',
  FOLLOWING_MODAL = 'following_modal',
  MUTUAL_FOLLOWERS_MODAL = 'mutual_followers_modal',
  PUBLICATION_RELEVANT_PROFILES = 'publication_relevant_profiles',
  DIRECT_MESSAGE_HEADER = 'direct_message_header',
  PROFILE_PAGE = 'profile_page',
  PROFILE_POPOVER = 'profile_popover'
}
