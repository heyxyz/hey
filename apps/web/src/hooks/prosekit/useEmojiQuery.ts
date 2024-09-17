import type { Emoji } from "@hey/types/misc";

import { STATIC_ASSETS_URL } from "@hey/data/constants";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useMemo } from "react";

const MAX_EMOJI_SUGGESTION_COUNT = 5;

const useEmojiQuery = (query: string): Emoji[] => {
  const { data: emojis } = useQuery<Emoji[]>({
    queryFn: async () => {
      const response = await axios.get(`${STATIC_ASSETS_URL}/emoji.json`);
      return response.data;
    },
    queryKey: ["getEmojis"]
  });

  return useMemo(() => {
    if (!emojis) {
      return [];
    }

    return emojis
      .filter((emoji) => {
        return (
          emoji.aliases.some((alias) => alias.includes(query)) ||
          emoji.tags.some((tag) => tag.includes(query))
        );
      })
      .slice(0, MAX_EMOJI_SUGGESTION_COUNT);
  }, [query, emojis]);
};

export default useEmojiQuery;
