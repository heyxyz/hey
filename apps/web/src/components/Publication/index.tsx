import type { AnyPublication } from '@hey/lens';
import type { NextPage } from 'next';

import Feed from '@components/Comment/Feed';
import NoneRelevantFeed from '@components/Comment/NoneRelevantFeed';
import MetaTags from '@components/Common/MetaTags';
import NewPublication from '@components/Composer/NewPublication';
import CommentWarning from '@components/Shared/CommentWarning';
import Footer from '@components/Shared/Footer';
import UserProfile from '@components/Shared/UserProfile';
import PublicationStaffTool from '@components/StaffTools/Panels/Publication';
import { APP_NAME } from '@hey/data/constants';
import { PAGEVIEW, ProfileLinkSource } from '@hey/data/tracking';
import {
  HiddenCommentsType,
  LimitType,
  TriStateValue,
  usePublicationQuery,
  usePublicationsQuery
} from '@hey/lens';
import getProfile from '@hey/lib/getProfile';
import { isMirrorPublication } from '@hey/lib/publicationHelpers';
import { Card, GridItemEight, GridItemFour, GridLayout } from '@hey/ui';
import { Leafwatch } from '@lib/leafwatch';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Custom404 from 'src/pages/404';
import Custom500 from 'src/pages/500';
import { useGlobalModalStateStore } from 'src/store/non-persisted/useGlobalModalStateStore';
import { useProfileRestriction } from 'src/store/non-persisted/useProfileRestriction';
import { useFeatureFlagsStore } from 'src/store/persisted/useFeatureFlagsStore';
import useProfileStore from 'src/store/persisted/useProfileStore';
import { create } from 'zustand';

import FullPublication from './FullPublication';
import OnchainMeta from './OnchainMeta';
import RelevantPeople from './RelevantPeople';
import PublicationPageShimmer from './Shimmer';

interface HiddenCommentFeedState {
  setShowHiddenComments: (show: boolean) => void;
  showHiddenComments: boolean;
}

export const useHiddenCommentFeedStore = create<HiddenCommentFeedState>(
  (set) => ({
    setShowHiddenComments: (show) => set({ showHiddenComments: show }),
    showHiddenComments: false
  })
);

const ViewPublication: NextPage = () => {
  const currentProfile = useProfileStore((state) => state.currentProfile);
  const { isSuspended } = useProfileRestriction();
  const staffMode = useFeatureFlagsStore((state) => state.staffMode);
  const showNewPostModal = useGlobalModalStateStore(
    (state) => state.showNewPostModal
  );

  const {
    isReady,
    query: { id }
  } = useRouter();

  useEffect(() => {
    Leafwatch.track(PAGEVIEW, { page: 'publication' });
  }, []);

  const { data, error, loading } = usePublicationQuery({
    skip: !id,
    variables: { request: { forId: id } }
  });

  const { data: comments } = usePublicationsQuery({
    skip: !id,
    variables: {
      request: {
        limit: LimitType.Ten,
        where: {
          commentOn: {
            hiddenComments: HiddenCommentsType.HiddenOnly,
            id
          }
        }
      }
    }
  });

  const hasHiddenComments = (comments?.publications.items.length || 0) > 0;

  if (!isReady || loading) {
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
          <FullPublication
            hasHiddenComments={hasHiddenComments}
            key={publication?.id}
            publication={publication}
          />
        </Card>
        {currentProfile &&
        !publication.isHidden &&
        !showNewPostModal &&
        !isSuspended ? (
          canComment ? (
            <NewPublication publication={targetPublication} />
          ) : (
            <CommentWarning />
          )
        ) : null}
        <Feed
          isHidden={publication.isHidden}
          publicationId={targetPublication.id}
        />
        <NoneRelevantFeed publicationId={targetPublication.id} />
      </GridItemEight>
      <GridItemFour className="space-y-5">
        <Card as="aside" className="p-5">
          <UserProfile
            profile={targetPublication.by}
            showBio
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

export default ViewPublication;
