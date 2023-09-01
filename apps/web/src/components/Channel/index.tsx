import MetaTags from '@components/Common/MetaTags';
import { APP_NAME, CHANNELS_WORKER_URL } from '@lenster/data/constants';
import { PAGEVIEW } from '@lenster/data/tracking';
import type { Channel } from '@lenster/types/lenster';
import { GridItemEight, GridItemFour, GridLayout } from '@lenster/ui';
import { Leafwatch } from '@lib/leafwatch';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import Custom404 from 'src/pages/404';
import Custom500 from 'src/pages/500';
import { useEffectOnce } from 'usehooks-ts';

import Details from './Details';
import Feed from './Feed';
import ChannelPageShimmer from './Shimmer';

const ViewChannel: NextPage = () => {
  const {
    query: { slug },
    isReady
  } = useRouter();

  useEffectOnce(() => {
    Leafwatch.track(PAGEVIEW, { page: 'channel' });
  });

  const fetchCommunity = async (): Promise<Channel> => {
    const response = await axios.get(`${CHANNELS_WORKER_URL}/get/${slug}`);

    return response.data?.result;
  };

  const {
    data: channel,
    isLoading,
    error
  } = useQuery(['channel', slug], () => fetchCommunity().then((res) => res), {
    enabled: isReady
  });

  if (isLoading) {
    return <ChannelPageShimmer />;
  }

  if (!channel) {
    return <Custom404 />;
  }

  if (error) {
    return <Custom500 />;
  }

  return (
    <>
      <MetaTags title={`Channel • ${channel.name} • ${APP_NAME}`} />
      <GridLayout className="pt-6">
        <GridItemFour>
          <Details channel={channel} />
        </GridItemFour>
        <GridItemEight className="space-y-5">
          <Feed channel={channel} />
        </GridItemEight>
      </GridLayout>
    </>
  );
};

export default ViewChannel;
