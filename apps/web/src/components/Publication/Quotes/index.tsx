import type { AnyPublication } from '@hey/lens';
import type { NextPage } from 'next';

import MetaTags from '@components/Common/MetaTags';
import Footer from '@components/Shared/Footer';
import UserProfile from '@components/Shared/UserProfile';
import PublicationStaffTool from '@components/StaffTools/Panels/Publication';
import { APP_NAME } from '@hey/data/constants';
import { PAGEVIEW, ProfileLinkSource } from '@hey/data/tracking';
import { usePublicationQuery } from '@hey/lens';
import getProfile from '@hey/lib/getProfile';
import { isMirrorPublication } from '@hey/lib/publicationHelpers';
import { Card, GridItemEight, GridItemFour, GridLayout } from '@hey/ui';
import { Leafwatch } from '@lib/leafwatch';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Custom404 from 'src/pages/404';
import Custom500 from 'src/pages/500';
import { useFeatureFlagsStore } from 'src/store/persisted/useFeatureFlagsStore';
import { useProfileStore } from 'src/store/persisted/useProfileStore';

import OnchainMeta from '../OnchainMeta';
import RelevantPeople from '../RelevantPeople';
import Feed from './Feed';
import QuotesPageShimmer from './Shimmer';

const Quotes: NextPage = () => {
  const { currentProfile } = useProfileStore();
  const { staffMode } = useFeatureFlagsStore();

  const {
    isReady,
    query: { id }
  } = useRouter();

  useEffect(() => {
    Leafwatch.track(PAGEVIEW, { page: 'publication', subpage: 'quotes' });
  }, []);

  const { data, error, loading } = usePublicationQuery({
    skip: !id,
    variables: { request: { forId: id } }
  });

  if (!isReady || loading) {
    return <QuotesPageShimmer />;
  }

  if (!data?.publication) {
    return <Custom404 />;
  }

  if (error) {
    return <Custom500 />;
  }

  const publication = data.publication as AnyPublication;
  const targetPublication = isMirrorPublication(publication)
    ? publication.mirrorOn
    : publication;

  return (
    <GridLayout>
      <MetaTags
        title={`${targetPublication.__typename} by ${
          getProfile(targetPublication.by).slugWithPrefix
        } • Quotes • ${APP_NAME}`}
      />
      <GridItemEight className="space-y-5">
        <Feed
          publicationBy={getProfile(targetPublication.by).slugWithPrefix}
          publicationId={targetPublication.id}
        />
      </GridItemEight>
      <GridItemFour className="space-y-5">
        <Card as="aside" className="p-5">
          <UserProfile
            profile={targetPublication.by}
            showBio
            showFollowUnfollowButton={
              targetPublication.by.id !== currentProfile?.id
            }
            source={ProfileLinkSource.Publication}
          />
        </Card>
        <RelevantPeople
          profilesMentioned={targetPublication.profilesMentioned}
        />
        <OnchainMeta publication={targetPublication} />
        {staffMode ? <PublicationStaffTool publication={publication} /> : null}
        <Footer />
      </GridItemFour>
    </GridLayout>
  );
};

export default Quotes;
