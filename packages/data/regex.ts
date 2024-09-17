import { regexLookbehindAvailable } from "./can-use-regex-lookbehind";

const RESTRICTED_SYMBOLS = "☑️✓✔✅";

// We only want to match mention when the `@` character is at the start of the
// line or right after a whilespace.
const MATCH_BEHIND = regexLookbehindAvailable ? "(?<=^|\\s)" : "";

const MENTION_NAMESPACE = "\\w+\\/";
const MENTION_BODY = "([\\dA-Za-z]\\w{2,25})";
const EDITOR_MENTION = "([\\dA-Za-z]\\w*)"; // This will start searching for mentions after the first character
const EDITOR_CLUB = "([\\dA-Za-z]\\w*)"; // This will start searching for clubs after the first character

export const Regex = {
  cashtag: /(\$\w*[A-Za-z]\w*)/g,
  ethereumAddress: /^(0x)?[\da-f]{40}$/i,
  handle: /^[\dA-Za-z]\w{4,25}$/g,
  hashtag: /(#\w*[A-Za-z]\w*)/g,
  // Match string like @lens/someone.
  mention: new RegExp(
    `${MATCH_BEHIND}@${MENTION_NAMESPACE}${MENTION_BODY}`,
    "g"
  ),
  // Match string like @someone.
  profileNameFilter: new RegExp(`[${RESTRICTED_SYMBOLS}]`, "gu"),
  profileNameValidator: new RegExp(`^[^${RESTRICTED_SYMBOLS}]+$`),
  txHash: /^0x[\dA-Fa-f]{64}$/,
  // modified version of https://stackoverflow.com/a/6041965/961254 to support unicode international characters
  url: /\b(http|https):\/\/([\p{L}\p{N}_-]+(?:(?:\.[\p{L}\p{N}_-]+)+))([\p{L}\p{N}_.,@?^=%&:\/~+#-]*[\p{L}\p{N}_@?^=%&\/~+#-])/gu
};

export const EditorRegex = {
  // club looks like: /bonsai or /orbcommunities
  club: new RegExp(`${MATCH_BEHIND}\/(${EDITOR_CLUB})$`, "g"),
  emoji: new RegExp(`${MATCH_BEHIND}:\\w*$`, "g"),
  mention: new RegExp(`${MATCH_BEHIND}@${EDITOR_MENTION}$`, "g")
};
