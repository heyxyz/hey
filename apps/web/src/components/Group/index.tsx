import type { Group } from '@hey/types/hey';
import type { NextPage } from 'next';

import MetaTags from '@components/Common/MetaTags';
import { APP_NAME, HEY_API_URL } from '@hey/data/constants';
import { PAGEVIEW } from '@hey/data/tracking';
import { GridItemEight, GridItemFour, GridLayout } from '@hey/ui';
import { Leafwatch } from '@lib/leafwatch';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Custom404 from 'src/pages/404';
import Custom500 from 'src/pages/500';
import useProfileStore from 'src/store/persisted/useProfileStore';

import Details from './Details';
import Feed from './Feed';
import GroupPageShimmer from './Shimmer';

const ViewGroup: NextPage = () => {
  const {
    isReady,
    query: { slug }
  } = useRouter();
  const currentProfile = useProfileStore((state) => state.currentProfile);

  useEffect(() => {
    Leafwatch.track(PAGEVIEW, { page: 'group' });
  }, []);

  const fetchGroup = async (): Promise<Group> => {
    const response: {
      data: { result: Group };
    } = await axios.get(`${HEY_API_URL}/groups/get`, {
      params: { slug, viewer: currentProfile?.id }
    });

    return response.data?.result;
  };

  const {
    data: group,
    error,
    isLoading
  } = useQuery({
    enabled: isReady,
    queryFn: fetchGroup,
    queryKey: ['fetchGroup', slug]
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
      <GridLayout>
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
