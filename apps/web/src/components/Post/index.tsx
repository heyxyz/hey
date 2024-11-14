import CommentFeed from "@components/Comment/CommentFeed";
import NoneRelevantFeed from "@components/Comment/NoneRelevantFeed";
import MetaTags from "@components/Common/MetaTags";
import NewPublication from "@components/Composer/NewPublication";
import CommentSuspendedWarning from "@components/Shared/CommentSuspendedWarning";
import Footer from "@components/Shared/Footer";
import SingleProfile from "@components/Shared/SingleProfile";
import PostStaffTool from "@components/StaffTools/Panels/Post";
import { Leafwatch } from "@helpers/leafwatch";
import { APP_NAME } from "@hey/data/constants";
import { FeatureFlag } from "@hey/data/feature-flags";
import { PAGEVIEW, ProfileLinkSource } from "@hey/data/tracking";
import getPostData from "@hey/helpers/getPostData";
import getProfile from "@hey/helpers/getProfile";
import { isRepost } from "@hey/helpers/postHelpers";
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
import { useOptimisticNavigation } from "src/store/non-persisted/useOptimisticNavigation";
import { useProfileStatus } from "src/store/non-persisted/useProfileStatus";
import { useProfileStore } from "src/store/persisted/useProfileStore";
import { create } from "zustand";
import FullPost from "./FullPost";
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

const ViewPost: NextPage = () => {
  const {
    isReady,
    pathname,
    query: { id }
  } = useRouter();

  const { currentProfile } = useProfileStore();
  const { isCommentSuspended, isSuspended } = useProfileStatus();
  const { preLoadedPosts } = useOptimisticNavigation();
  const isStaff = useFlag(FeatureFlag.Staff);

  const showQuotes = pathname === "/posts/[id]/quotes";
  const preLoadedPost = preLoadedPosts.find((p) => p.id === id);

  useEffect(() => {
    Leafwatch.track(PAGEVIEW, {
      page: "publication",
      subpage: pathname.replace("/posts/[id]", "")
    });
  }, []);

  const { data, error, loading } = usePublicationQuery({
    skip: !id || preLoadedPost?.id,
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
    return <PublicationPageShimmer publicationList={showQuotes} />;
  }

  if (!preLoadedPost && !data?.publication) {
    return <Custom404 />;
  }

  if (error) {
    return <Custom500 />;
  }

  const post = preLoadedPost || (data?.publication as AnyPublication);
  const targetPost = isRepost(post) ? post.mirrorOn : post;
  const suspended = isSuspended || isCommentSuspended;

  return (
    <GridLayout>
      <MetaTags
        creator={getProfile(targetPost.by).displayName}
        description={getPostData(targetPost.metadata)?.content}
        title={`${targetPost.__typename} by ${
          getProfile(targetPost.by).slugWithPrefix
        } • ${APP_NAME}`}
      />
      <GridItemEight className="space-y-5">
        {showQuotes ? (
          <Quotes postId={targetPost.id} />
        ) : (
          <>
            <Card>
              <FullPost
                hasHiddenComments={hasHiddenComments}
                key={post?.id}
                post={post}
              />
            </Card>
            {suspended ? <CommentSuspendedWarning /> : null}
            {currentProfile && !post.isHidden && !suspended ? (
              <NewPublication post={targetPost} />
            ) : null}
            {post.isHidden ? null : (
              <>
                <CommentFeed postId={targetPost.id} />
                <NoneRelevantFeed postId={targetPost.id} />
              </>
            )}
          </>
        )}
      </GridItemEight>
      <GridItemFour className="space-y-5">
        <Card as="aside" className="p-5">
          <SingleProfile
            hideFollowButton={currentProfile?.id === targetPost.by.id}
            hideUnfollowButton={currentProfile?.id === targetPost.by.id}
            profile={targetPost.by}
            showBio
            source={ProfileLinkSource.Publication}
          />
        </Card>
        <RelevantPeople profilesMentioned={targetPost.profilesMentioned} />
        {isStaff ? <PostStaffTool post={targetPost} /> : null}
        <Footer />
      </GridItemFour>
    </GridLayout>
  );
};

export default ViewPost;
