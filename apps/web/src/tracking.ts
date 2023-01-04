// Strings used for events tracking

export const USER = {
  LOGIN: 'user_login',
  LOGOUT: 'user_logout',
  SIWL: 'sign_in_with_lens'
};

export const PROFILE = {
  FOLLOW: 'follow_profile',
  SUPER_FOLLOW: 'super_follow_profile',
  UNFOLLOW: 'unfollow_profile',
  OPEN_SUPER_FOLLOW: 'open_super_follow_modal',
  OPEN_FOLLOWING: 'open_following_list',
  OPEN_FOLLOWERS: 'open_followers_list',
  OPEN_MUTUAL_FOLLOWERS: 'open_mutual_followers_list',
  SWITCH_FEED: 'switch_to_feed_tab_in_profile',
  SWITCH_REPLIES: 'switch_to_replies_tab_in_profile',
  SWITCH_MEDIA: 'switch_to_media_tab_in_profile',
  SWITCH_NFTS: 'switch_to_nft_tab_in_profile',
  SWITCH_PROFILE: 'switch_profile',
  LOGOUT: 'profile_logout'
};

export const PUBLICATION = {
  OPEN: 'open_publication',
  LIKE: 'like_publication',
  DISLIKE: 'dislike_publication',
  MIRROR: 'mirror_publication',
  EMBED: 'embed_publication',
  PERMALINK: 'permalink_publication',
  MORE: 'more_publication_options',
  DELETE: 'delete_publication',
  REPORT: 'report_publication',
  OEMBED_CLICK: 'click_publication_oemebed',
  MENTION_CLICK: 'click_publication_mention',
  HASHTAG_CLICK: 'click_publication_hashtag',
  STATS: {
    MIRRORED_BY: 'open_mirrored_by_list',
    LIKED_BY: 'open_liked_by_list',
    COLLECTED_BY: 'open_collected_by_list'
  },
  ATTACHEMENT: {
    IMAGE: {
      OPEN: 'open_image_attachment'
    },
    AUDIO: {
      PLAY: 'play_audio',
      PAUSE: 'pause_audio'
    }
  },
  COLLECT_MODULE: {
    COLLECT: 'collect_publication',
    OPEN_COLLECT: 'open_collect_modal',
    OPEN_COLLECTORS: 'open_collectors_list',
    OPEN_UNISWAP: 'open_uniswap'
  },
  NEW: {
    MARKDOWN_PREVIEW: 'preview_markdown',
    OPEN_GIF: 'open_gif_modal',
    ATTACHMENT: {
      UPLOAD_IMAGES: 'select_upload_images',
      UPLOAD_VIDEO: 'select_upload_video',
      UPLOAD_AUDIO: 'select_upload_audio'
    },
    COLLECT_MODULE: {
      OPEN_COLLECT_SETTINGS: 'open_collect_module_settings',
      TOGGLE_COLLECT_MODULE: 'toggle_collect_module',
      TOGGLE_CHARGE_FOR_COLLECT: 'toggle_charge_for_collect',
      TOGGLE_LIMITED_EDITION_COLLECT: 'toggle_limited_edition_collect',
      TOGGLE_TIME_LIMIT_COLLECT: 'toggle_time_limit_collect',
      TOGGLE_FOLLOWERS_ONLY_COLLECT: 'toggle_followers_only_collect'
    },
    REFERENCE_MODULE: {
      OPEN_REFERENCE_SETTINGS: 'open_reference_module_settings',
      EVERYONE: 'select_everyone_reference',
      MY_FOLLOWERS: 'select_my_followers_reference',
      MY_FOLLOWS: 'select_my_follows_reference',
      FRIENDS_OF_FRIENDS: 'select_friends_of_friends_reference'
    },
    ACCESS: {
      OPEN_ACCESS_SETTINGS: 'open_access_settings',
      TOGGLE_RESTRICTED_ACCESS: 'toggle_restricted_access',
      TOGGLE_COLLECT_TO_VIEW_ACCESS: 'toggle_collect_to_view_access',
      TOGGLE_FOLLOW_TO_VIEW_ACCESS: 'toggle_follow_to_view_access'
    }
  }
};

export const POST = {
  NEW: 'new_post',
  TOKEN_GATED: 'new_token_gated_post'
};

export const COMMENT = {
  NEW: 'new_comment',
  TOKEN_GATED: 'new_token_gated_comment'
};

export const NOTIFICATION = {
  OPEN: 'open_notifications',
  SWITCH_ALL: 'switch_to_all_notifications',
  SWITCH_MENTIONS: 'switch_to_mentions_notifications',
  SWITCH_COMMENTS: 'switch_to_comments_notifications',
  SWITCH_COLLECTS: 'switch_to_collects_notifications'
};

export const MESSAGES = {
  SEND: 'send_message',
  OPEN_NEW_CONVERSATION: 'open_new_conversation_modal'
};

export const SETTINGS = {
  ACCOUNT: {
    OPEN_REFLECT_ENABLE: 'open_reflect_enable',
    OPEN_REFLECT_DISABLE: 'open_reflect_disable',
    OPEN_VERIFICATION: 'open_account_verification',
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
    TOGGLE: 'toggle_dispatcher'
  },
  INTERESTS: {
    ADD: 'add_profile_interest',
    REMOVE: 'remove_profile_interest'
  },
  DELETE: 'delete_profile'
};

export const MOD = {
  SPAM: 'mod_spam_report',
  OTHER: 'mod_report'
};

export const STAFFTOOLS = {
  TOGGLE_MODE: 'toggle_staff_mode'
};

export const SEARCH = {
  FOCUS: 'focus_search_input',
  CLEAR: 'clear_search_text'
};

export const SYSTEM = {
  SWITCH_LIGHT_THEME: 'switch_light_theme',
  SWITCH_DARK_THEME: 'switch_dark_theme',
  SWITCH_NETWORK: 'switch_network'
};

export const MISCELLANEOUS = {
  NAVIGATE_UPDATE_PROFILE: 'navigate_to_update_profile_from_onboarding',
  NAVIGATE_UPDATE_PROFILE_INTERESTS: 'navigate_to_update_profile_interests_from_onboarding',
  OPEN_RECOMMENDED_PROFILES: 'open_recommended_profiles_modal',
  OPEN_TRENDING_TAG: 'open_trending_tag',
  SWITCH_TIMELINE: 'switch_to_timeline',
  SWITCH_HIGHLIGHTS: 'switch_to_highlights',
  SELECT_USER_FEED: 'select_user_feed'
};

export const FOOTER = {
  DISCORD: 'open_discord',
  DONATE: 'open_donate',
  STATUS: 'open_status',
  VOTE: 'open_vote',
  FEEDBACK: 'open_feedback',
  GITHUB: 'open_github',
  VERCEL: 'open_vercel'
};
