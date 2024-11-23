import CommentFeed from "@components/Comment/CommentFeed";
import NoneRelevantFeed from "@components/Comment/NoneRelevantFeed";
import MetaTags from "@components/Common/MetaTags";
import NewPublication from "@components/Composer/NewPublication";
import CommentSuspendedWarning from "@components/Shared/CommentSuspendedWarning";
import Footer from "@components/Shared/Footer";
import SingleAccount from "@components/Shared/SingleAccount";
import PostStaffTool from "@components/StaffTools/Panels/Post";
import { Leafwatch } from "@helpers/leafwatch";
import { APP_NAME } from "@hey/data/constants";
import { FeatureFlag } from "@hey/data/feature-flags";
import { AccountLinkSource, PAGEVIEW } from "@hey/data/tracking";
import getAccount from "@hey/helpers/getAccount";
import getPostData from "@hey/helpers/getPostData";
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
import { useAccountStatus } from "src/store/non-persisted/useAccountStatus";
import { useOptimisticNavigation } from "src/store/non-persisted/useOptimisticNavigation";
import { useAccountStore } from "src/store/persisted/useAccountStore";
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

  const { currentAccount } = useAccountStore();
  const { isCommentSuspended, isSuspended } = useAccountStatus();
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
        creator={getAccount(targetPost.by).displayName}
        description={getPostData(targetPost.metadata)?.content}
        title={`${targetPost.__typename} by ${
          getAccount(targetPost.by).slugWithPrefix
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
            {currentAccount && !post.isHidden && !suspended ? (
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
          <SingleAccount
            hideFollowButton={currentAccount?.id === targetPost.by.id}
            hideUnfollowButton={currentAccount?.id === targetPost.by.id}
            account={targetPost.by}
            showBio
            source={AccountLinkSource.Post}
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
