const conversationMatchesProfile = (profileId: string) => new RegExp(`lens.dev/dm/.*${profileId}`);

export default conversationMatchesProfile;
