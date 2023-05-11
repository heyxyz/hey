import { XMTP_PREFIX } from 'data/constants';

/**
 * Returns a regex that matches a conversation ID for the given profile ID.
 *
 * @param profileId The profile ID to match.
 * @returns A regular expression object that matches the conversation ID.
 */
const conversationMatchesProfile = (profileId: string) =>
  new RegExp(`${XMTP_PREFIX}/.*${profileId}`);

export default conversationMatchesProfile;
