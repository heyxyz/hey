import type { Emoji } from '@hey/types/misc';

import { STATIC_ASSETS_URL } from '@hey/data/constants';
import { useEffect, useMemo, useState } from 'react';

const MAX_EMOJI_SUGGESTION_COUNT = 5;

export function useEmojiQuery(load: boolean, query: string): Emoji[] {
  const [emojis, setEmojis] = useState<Emoji[]>([]);
  const [loaded, setLoaded] = useState(false);

  const fetchEmojis = async () => {
    const res = await fetch(`${STATIC_ASSETS_URL}/emoji.json`);
    const data = await res.json();
    setEmojis(data);
  };

  useEffect(() => {
    if (load && !loaded) {
      fetchEmojis();
      setLoaded(true);
    }
  }, [load, loaded]);

  return useMemo(() => {
    return emojis
      .filter((emoji) => {
        return (
          emoji.aliases.some((alias) => alias.includes(query)) ||
          emoji.tags.some((tag) => tag.includes(query))
        );
      })
      .slice(0, MAX_EMOJI_SUGGESTION_COUNT);
  }, [query, emojis]);
}
