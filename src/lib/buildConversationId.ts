const PREFIX = 'lens.dev/dm';

const buildConversationId = (profileA: string, profileB: string) => {
  const numberA = parseInt(profileA.substring(2), 16);
  const numberB = parseInt(profileB.substring(2), 16);
  return numberA < numberB ? `${PREFIX}/${profileA}-${profileB}` : `${PREFIX}/${profileB}-${profileA}`;
};

export default buildConversationId;
