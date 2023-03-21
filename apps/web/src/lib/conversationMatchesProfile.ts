import { XMTP_PREFIX } from 'data/constants';

/**
 *
 * @param profileId the profile id
 * @returns a regex that matches a conversation id for the given profile id
 */
const conversationMatchesProfile = (profileId: string) => new RegExp(`${XMTP_PREFIX}/.*${profileId}`);

export default conversationMatchesProfile;
