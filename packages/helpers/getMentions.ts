import type { ProfileMentioned } from "@hey/lens";

import { Regex } from "@hey/data/regex";

const getMentions = (text: string): [] | ProfileMentioned[] => {
  if (!text) {
    return [];
  }

  const mentions = text.match(Regex.mention);
  const processedMentions = mentions?.map((mention) => {
    const splited = mention.split("/");
    const handle = mention.replace("@", "");
    const handleWithoutNameSpace = splited[splited.length - 1];

    return {
      profile: {},
      snapshotHandleMentioned: {
        fullHandle: handle,
        localName: handleWithoutNameSpace
      },
      stillOwnsHandle: true
    } as ProfileMentioned;
  });

  return processedMentions || [];
};

export default getMentions;
