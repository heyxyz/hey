import MetaTags from '@components/Common/MetaTags';
import { APP_NAME } from '@lenster/data/constants';
import { FeatureFlag } from '@lenster/data/feature-flags';
import isFeatureEnabled from '@lenster/lib/isFeatureEnabled';
import type { Community } from '@lenster/types/communities';
import { GridItemEight, GridItemFour, GridLayout } from '@lenster/ui';
import fetchCommunity from '@lib/communities/fetchCommunity';
import { useQuery } from '@tanstack/react-query';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import Custom404 from 'src/pages/404';
import Custom500 from 'src/pages/500';

import Details from './Details';
import Feed from './Feed';
import CommunityPageShimmer from './Shimmer';

const ViewCommunity: NextPage = () => {
  const {
    query: { slug }
  } = useRouter();
  const isCommunitiesEnabled = isFeatureEnabled(FeatureFlag.Communities);

  const { data, isLoading, error } = useQuery(['community', slug], () =>
    fetchCommunity(slug as string).then((res) => res)
  );

  if (!isCommunitiesEnabled) {
    return <Custom404 />;
  }

  if (error) {
    return <Custom500 />;
  }

  if (isLoading) {
    return <CommunityPageShimmer />;
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
          <Feed communityId={community.id} />
        </GridItemEight>
      </GridLayout>
    </>
  );
};

export default ViewCommunity;
