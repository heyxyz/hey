import Feed from '@components/Comment/Feed';
import NoneRelevantFeed from '@components/Comment/NoneRelevantFeed';
import MetaTags from '@components/Common/MetaTags';
import NewPublication from '@components/Composer/NewPublication';
import CommentWarning from '@components/Shared/CommentWarning';
import Footer from '@components/Shared/Footer';
import UserProfile from '@components/Shared/UserProfile';
import PublicationStaffTool from '@components/StaffTools/Panels/Publication';
import { APP_NAME } from '@hey/data/constants';
import { PAGEVIEW } from '@hey/data/tracking';
import type { AnyPublication } from '@hey/lens';
import { TriStateValue, usePublicationQuery } from '@hey/lens';
import getProfile from '@hey/lib/getProfile';
import { isMirrorPublication } from '@hey/lib/publicationHelpers';
import { Card, GridItemEight, GridItemFour, GridLayout } from '@hey/ui';
import { Leafwatch } from '@lib/leafwatch';
import type { NextPage } from 'next';
import { useParams } from 'next/navigation';
import Custom500 from 'src/app/500';
import Custom404 from 'src/app/not-found';
import { useFeatureFlagsStore } from 'src/store/useFeatureFlagsStore';
import { useGlobalModalStateStore } from 'src/store/useGlobalModalStateStore';
import useProfilePersistStore from 'src/store/useProfilePersistStore';
import { useEffectOnce } from 'usehooks-ts';

import FullPublication from './FullPublication';
import OnchainMeta from './OnchainMeta';
import RelevantPeople from './RelevantPeople';
import PublicationPageShimmer from './Shimmer';

const ViewPublication: NextPage = () => {
  const currentProfile = useProfilePersistStore(
    (state) => state.currentProfile
  );
  const staffMode = useFeatureFlagsStore((state) => state.staffMode);
  const showNewPostModal = useGlobalModalStateStore(
    (state) => state.showNewPostModal
  );

  const searchParams = useParams();
  const { id } = searchParams;

  useEffectOnce(() => {
    Leafwatch.track(PAGEVIEW, { page: 'publication' });
  });

  const { data, loading, error } = usePublicationQuery({
    variables: { request: { forId: id } },
    skip: !id
  });

  if (loading) {
    return <PublicationPageShimmer />;
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
  const canComment =
    targetPublication?.operations.canComment === TriStateValue.Yes;

  return (
    <GridLayout>
      <MetaTags
        title={`${targetPublication.__typename} by ${
          getProfile(targetPublication.by).slugWithPrefix
        } • ${APP_NAME}`}
      />
      <GridItemEight className="space-y-5">
        <Card>
          <FullPublication publication={publication} key={publication?.id} />
        </Card>
        {currentProfile && !publication.isHidden && !showNewPostModal ? (
          canComment ? (
            <NewPublication publication={publication} />
          ) : (
            <CommentWarning />
          )
        ) : null}
        <Feed publication={publication} />
        <NoneRelevantFeed publication={publication} />
      </GridItemEight>
      <GridItemFour className="space-y-5">
        <Card as="aside" className="p-5">
          <UserProfile profile={targetPublication.by} showBio />
        </Card>
        <RelevantPeople publication={publication} />
        <OnchainMeta publication={publication} />
        {staffMode ? <PublicationStaffTool publication={publication} /> : null}
        <Footer />
      </GridItemFour>
    </GridLayout>
  );
};

export default ViewPublication;
