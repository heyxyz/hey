import { Regex } from "@hey/data/regex";
import type { AccountMention } from "@hey/indexer";

const getMentions = (text: string): [] | AccountMention[] => {
  if (!text) {
    return [];
  }

  const mentions = text.match(Regex.mention);
  const processedMentions = mentions?.map((mention) => {
    const splited = mention.split("/");
    const handleWithoutNameSpace = splited[splited.length - 1];

    return {
      account: "",
      namespace: "",
      replace: {
        from: handleWithoutNameSpace.toLowerCase(),
        to: handleWithoutNameSpace.toLowerCase()
      }
    } as AccountMention;
  });

  return processedMentions || [];
};

export default getMentions;
