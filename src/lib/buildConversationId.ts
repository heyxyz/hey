import { XMTP_PREFIX } from 'src/constants';

const buildConversationId = (profileA: string, profileB: string) => {
  const numberA = parseInt(profileA.substring(2), 16);
  const numberB = parseInt(profileB.substring(2), 16);
  return numberA < numberB
    ? `${XMTP_PREFIX}/${profileA}-${profileB}`
    : `${XMTP_PREFIX}/${profileB}-${profileA}`;
};

export default buildConversationId;
