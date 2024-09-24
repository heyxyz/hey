import Feed from "@components/Comment/Feed";
import NoneRelevantFeed from "@components/Comment/NoneRelevantFeed";
import MetaTags from "@components/Common/MetaTags";
import NewPublication from "@components/Composer/NewPublication";
import CommentSuspendedWarning from "@components/Shared/CommentSuspendedWarning";
import Footer from "@components/Shared/Footer";
import UserProfile from "@components/Shared/UserProfile";
import PublicationStaffTool from "@components/StaffTools/Panels/Publication";
import { Leafwatch } from "@helpers/leafwatch";
import { APP_NAME } from "@hey/data/constants";
import { FeatureFlag } from "@hey/data/feature-flags";
import { PAGEVIEW, ProfileLinkSource } from "@hey/data/tracking";
import getProfile from "@hey/helpers/getProfile";
import getPublicationData from "@hey/helpers/getPublicationData";
import { isMirrorPublication } from "@hey/helpers/publicationHelpers";
import type { AnyPublication } from "@hey/lens";
import {
  HiddenCommentsType,
  LimitType,
  usePublicationQuery,
  usePublicationsQuery
} from "@hey/lens";
import { Card, GridItemEight, GridItemFour, GridLayout } from "@hey/ui";
import { useFlag } from "@unleash/proxy-client-react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { createTrackedSelector } from "react-tracked";
import Custom404 from "src/pages/404";
import Custom500 from "src/pages/500";
import { useProfileStatus } from "src/store/non-persisted/useProfileStatus";
import { useProfileStore } from "src/store/persisted/useProfileStore";
import { create } from "zustand";
import Collectors from "./Collectors";
import FullPublication from "./FullPublication";
import Quotes from "./Quotes";
import RelevantPeople from "./RelevantPeople";
import PublicationPageShimmer from "./Shimmer";

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
  const { isCommentSuspended, isSuspended } = useProfileStatus();
  const isStaff = useFlag(FeatureFlag.Staff);

  const showQuotes = pathname === "/posts/[id]/quotes";
  const showCollectors = pathname === "/posts/[id]/collectors";

  useEffect(() => {
    Leafwatch.track(PAGEVIEW, {
      page: "publication",
      subpage: pathname.replace("/posts/[id]", "")
    });
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
        profileList={showCollectors}
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
  const suspended = isSuspended || isCommentSuspended;

  return (
    <GridLayout>
      <MetaTags
        creator={getProfile(targetPublication.by).displayName}
        description={getPublicationData(targetPublication.metadata)?.content}
        title={`${targetPublication.__typename} by ${
          getProfile(targetPublication.by).slugWithPrefix
        } • ${APP_NAME}`}
      />
      <GridItemEight className="space-y-5">
        {showQuotes ? (
          <Quotes publicationId={targetPublication.id} />
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
            {suspended ? <CommentSuspendedWarning /> : null}
            {currentProfile && !publication.isHidden && !suspended ? (
              <NewPublication publication={targetPublication} />
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
            hideFollowButton={currentProfile?.id === targetPublication.by.id}
            hideUnfollowButton={currentProfile?.id === targetPublication.by.id}
            profile={targetPublication.by}
            showBio
            source={ProfileLinkSource.Publication}
          />
        </Card>
        <RelevantPeople
          profilesMentioned={targetPublication.profilesMentioned}
        />
        {isStaff ? (
          <PublicationStaffTool publication={targetPublication} />
        ) : null}
        <Footer />
      </GridItemFour>
    </GridLayout>
  );
};

export default ViewPublication;
