import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { IFRAMELY_WORKER_URL } from 'data/constants';
import type { FC } from 'react';

import Embed from './Embed';
import Player from './Player';

interface IFramelyProps {
  url?: string;
}

const IFramely: FC<IFramelyProps> = ({ url }) => {
  const allowedSites = [
    'YouTube',
    'Spotify',
    'SoundCloud',
    'oohlala_xyz',
    'Lenstube'
  ];

  const { isLoading, error, data } = useQuery(
    [url],
    () =>
      axios({
        url: IFRAMELY_WORKER_URL,
        params: { url }
      }).then((res) => res.data.iframely),
    { enabled: Boolean(url) }
  );

  if (error || isLoading || !data) {
    return null;
  }

  const og = {
    url: url as string,
    title: data?.meta?.title,
    description: data?.meta?.description,
    site: data?.meta?.site,
    favicon: `https://www.google.com/s2/favicons?domain=${url}`,
    thumbnail: data?.links?.thumbnail && data?.links?.thumbnail[0]?.href,
    isSquare:
      data?.links?.thumbnail &&
      data?.links?.thumbnail[0]?.media?.width ===
        data?.links?.thumbnail[0]?.media?.height,
    html:
      data?.links?.player?.[0]?.html ?? data?.links?.reader?.[0]?.html ?? null
  };

  if (!og.title) {
    return null;
  }

  return og.html && allowedSites.includes(og.site) ? (
    <Player og={og} />
  ) : (
    <Embed og={og} />
  );
};

export default IFramely;
