import imagekitURL from '@lib/imagekitURL';
import axios from 'axios';
import type { FC } from 'react';
import { useEffect, useState } from 'react';

import Embed from './Embed';
import Player from './Player';

interface Props {
  url: string;
}

const IFramely: FC<Props> = ({ url }) => {
  const [error, setError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [data, setData] = useState<any>();

  useEffect(() => {
    if (url) {
      axios(`https://iframe.ly/api/iframely?api_key=258c8580bd477c9b886b49&url=${url}`)
        .then(({ data }) => {
          setIsLoaded(true);
          if (data) {
            setData(data);
          } else {
            setError(true);
          }
        })
        .catch(() => {
          setIsLoaded(true);
          setError(true);
        });
    } else {
      setError(true);
    }
  }, [url]);

  useEffect(() => {
    (window as any).iframely && (window as any).iframely.load();
  }, []);

  if (error || !isLoaded) {
    return null;
  }

  const og = {
    title: data?.meta?.title,
    description: data?.meta?.description,
    site: data?.meta?.site,
    url: data?.url,
    favicon: `https://www.google.com/s2/favicons?domain=${url}`,
    thumbnail: data?.links?.thumbnail && imagekitURL(data?.links?.thumbnail[0]?.href, 'attachment'),
    isSquare:
      data?.links?.thumbnail &&
      data?.links?.thumbnail[0]?.media?.width === data?.links?.thumbnail[0]?.media?.height,
    html: data?.links?.player ? data?.links?.player[0]?.html : null
  };

  if (!og.title) {
    return null;
  }

  return og.html ? <Player og={og} /> : <Embed og={og} />;
};

export default IFramely;
