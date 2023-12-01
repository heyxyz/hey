import { APP_NAME, HEY_API_URL } from '@hey/data/constants';
import { PAGEVIEW } from '@hey/data/tracking';
import type { Group } from '@hey/types/hey';
import { GridItemEight, GridItemFour, GridLayout } from '@hey/ui';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useEffectOnce } from 'usehooks-ts';

import MetaTags from '@/components/Common/MetaTags';
import { Leafwatch } from '@/lib/leafwatch';
import Custom404 from '@/pages/404';
import Custom500 from '@/pages/500';

import Details from './Details';
import Feed from './Feed';
import GroupPageShimmer from './Shimmer';

const ViewGroup = () => {
  const isReady = true;
  const { slug } = useParams();

  useEffectOnce(() => {
    Leafwatch.track(PAGEVIEW, { page: 'group' });
  });

  const fetchGroup = async (): Promise<Group> => {
    const response: {
      data: { result: Group };
    } = await axios.get(`${HEY_API_URL}/group/getGroup`, {
      params: { slug }
    });

    return response.data?.result;
  };

  const {
    data: group,
    isLoading,
    error
  } = useQuery({
    queryKey: ['fetchGroup', slug],
    queryFn: fetchGroup,
    enabled: isReady
  });

  if (!isReady || isLoading) {
    return <GroupPageShimmer />;
  }

  if (!group) {
    return <Custom404 />;
  }

  if (error) {
    return <Custom500 />;
  }

  return (
    <>
      <MetaTags title={`Group • ${group.name} • ${APP_NAME}`} />
      <GridLayout className="pt-6">
        <GridItemFour>
          <Details group={group} />
        </GridItemFour>
        <GridItemEight className="space-y-5">
          <Feed group={group} />
        </GridItemEight>
      </GridLayout>
    </>
  );
};

export default ViewGroup;
