import MetaTags from '@components/Common/MetaTags';
import { APP_NAME, COMMUNITIES_WORKER_URL } from '@lenster/data/constants';
import { FeatureFlag } from '@lenster/data/feature-flags';
import isFeatureEnabled from '@lenster/lib/isFeatureEnabled';
import type { Community } from '@lenster/types/communities';
import { GridItemEight, GridItemFour, GridLayout } from '@lenster/ui';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import Custom404 from 'src/pages/404';
import Custom500 from 'src/pages/500';

import Details from './Details';
import ProfilePageShimmer from './Shimmer';

const ViewCommunity: NextPage = () => {
  const {
    query: { slug }
  } = useRouter();
  const isCommunitiesEnabled = isFeatureEnabled(FeatureFlag.Communities);

  const fetchCommunity = async () => {
    try {
      const response = await axios(
        `${COMMUNITIES_WORKER_URL}/communities/${slug}`
      );

      return response.data;
    } catch (error) {
      return [];
    }
  };

  const { data, isLoading, error } = useQuery(['community', slug], () =>
    fetchCommunity().then((res) => res)
  );

  if (!isCommunitiesEnabled) {
    return <Custom404 />;
  }

  if (error) {
    return <Custom500 />;
  }

  if (isLoading) {
    return <ProfilePageShimmer />;
  }

  if (!data) {
    return <Custom404 />;
  }

  const community: Community = data;

  return (
    <>
      {community?.name ? (
        <MetaTags
          title={`${community?.name} (c/${community?.slug}) • ${APP_NAME}`}
        />
      ) : (
        <MetaTags title={`c/${community.slug} • ${APP_NAME}`} />
      )}
      <GridLayout className="pt-6">
        <GridItemFour>
          <Details community={community} />
        </GridItemFour>
        <GridItemEight className="space-y-5">
          {JSON.stringify(community)}
        </GridItemEight>
      </GridLayout>
    </>
  );
};

export default ViewCommunity;
