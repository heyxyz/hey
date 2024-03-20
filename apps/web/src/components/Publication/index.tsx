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
import { createTrackedSelector } from 'react-tracked';
import Custom404 from 'src/pages/404';
import Custom500 from 'src/pages/500';
import { useGlobalModalStateStore } from 'src/store/non-persisted/useGlobalModalStateStore';
import { useProfileRestriction } from 'src/store/non-persisted/useProfileRestriction';
import { useFeatureFlagsStore } from 'src/store/persisted/useFeatureFlagsStore';
import { useProfileStore } from 'src/store/persisted/useProfileStore';
import { create } from 'zustand';

import Collectors from './Collectors';
import FullPublication from './FullPublication';
import Likes from './Likes';
import Mirrors from './Mirrors';
import OnchainMeta from './OnchainMeta';
import Quotes from './Quotes';
import RelevantPeople from './RelevantPeople';
import PublicationPageShimmer from './Shimmer';

interface HiddenCommentFeedState {
  setShowHiddenComments: (show: boolean) => void;
  showHiddenComments: boolean;
}

const store = create<HiddenCommentFeedState>((set) => ({
  setShowHiddenComments: (show) => set({ showHiddenComments: show }),
  showHiddenComments: false
}));

export const useHiddenCommentFeedStore = createTrackedSelector(store);

const ViewPublication: NextPage = () => {
  const {
    isReady,
    pathname,
    query: { id }
  } = useRouter();

  const { currentProfile } = useProfileStore();
  const { isSuspended } = useProfileRestriction();
  const { staffMode } = useFeatureFlagsStore();
  const { showNewPostModal } = useGlobalModalStateStore();

  const showQuotes = pathname === '/posts/[id]/quotes';
  const showMirrors = pathname === '/posts/[id]/mirrors';
  const showLikes = pathname === '/posts/[id]/likes';
  const showCollectors = pathname === '/posts/[id]/collectors';

  useEffect(() => {
    Leafwatch.track(PAGEVIEW, {
      page: 'publication',
      subpage: pathname.replace('/posts/[id]', '')
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
          commentOn: { hiddenComments: HiddenCommentsType.HiddenOnly, id }
        }
      }
    }
  });

  const hasHiddenComments = (comments?.publications.items.length || 0) > 0;

  if (!isReady || loading) {
    return (
      <PublicationPageShimmer
        profileList={showMirrors || showLikes || showCollectors}
        publicationList={showQuotes}
      />
    );
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
        {showQuotes ? (
          <Quotes publicationId={targetPublication.id} />
        ) : showLikes ? (
          <Likes publicationId={targetPublication.id} />
        ) : showMirrors ? (
          <Mirrors publicationId={targetPublication.id} />
        ) : showCollectors ? (
          <Collectors publicationId={targetPublication.id} />
        ) : (
          <>
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
          </>
        )}
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

export default ViewPublication;
