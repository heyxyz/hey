import { XMTP_PREFIX } from 'src/constants';

const conversationMatchesProfile = (profileId: string) => new RegExp(`${XMTP_PREFIX}/.*${profileId}`);

export default conversationMatchesProfile;
