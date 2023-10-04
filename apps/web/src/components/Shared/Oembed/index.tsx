import { OEMBED_WORKER_URL } from '@hey/data/constants';
import type { OG } from '@hey/types/misc';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import type { FC } from 'react';
import urlcat from 'urlcat';

import Embed from './Embed';
import Player from './Player';

interface OembedProps {
  url?: string;
  publicationId?: string;
  onData: (data: OG) => void;
}

const Oembed: FC<OembedProps> = ({ url, publicationId, onData }) => {
  const { isLoading, error, data } = useQuery(
    [url],
    () =>
      axios
        .get(`${OEMBED_WORKER_URL}/oembed`, { params: { url } })
        .then((res) => res.data.oembed),
    { enabled: Boolean(url) }
  );

  if (isLoading || error || !data) {
    return null;
  } else if (data) {
    onData(data);
  }

  const og: OG = {
    url: url as string,
    title: data?.title,
    description: data?.description,
    site: data?.site,
    favicon: urlcat('https://www.google.com/s2/favicons', {
      domain: data.url
    }),
    image: data?.image,
    isLarge: data?.isLarge,
    html: data?.html
  };

  if (!og.title) {
    return null;
  }

  return og.html ? (
    <Player og={og} />
  ) : (
    <Embed og={og} publicationId={publicationId} />
  );
};

export default Oembed;
