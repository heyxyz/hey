export const Events = {
  Account: {
    Signup: "signup_account",
    Login: "login_account",
    Switch: "switch_account",
    Follow: "follow_account",
    Unfollow: "unfollow_account",
    SuperFollow: "super_follow_account",
    Block: "block_account",
    Unblock: "unblock_account",
    Mute: "mute_account",
    Unmute: "unmute_account",
    UpdateSettings: "update_account_settings"
  },
  Post: {
    Post: "new_post",
    Comment: "new_comment",
    Quote: "new_quote",
    Like: "like_post",
    UndoLike: "undo_like_post",
    Repost: "repost_post",
    Collect: "collect_post",
    Tip: "tip_post",
    Delete: "delete_post"
  },
  Group: {
    Create: "create_group",
    Join: "join_group",
    Leave: "leave_group",
    Ban: "ban_group",
    Unban: "unban_group",
    UpdateSettings: "update_group_settings"
  }
};
