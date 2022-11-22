import { XMTP_PREFIX } from 'data/constants';

const conversationMatchesProfile = (profileId: string) => new RegExp(`${XMTP_PREFIX}/.*${profileId}`);

export default conversationMatchesProfile;
