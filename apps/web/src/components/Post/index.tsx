import CommentFeed from "@components/Comment/CommentFeed";
import NoneRelevantFeed from "@components/Comment/NoneRelevantFeed";
import MetaTags from "@components/Common/MetaTags";
import NewPublication from "@components/Composer/NewPublication";
import CommentSuspendedWarning from "@components/Shared/CommentSuspendedWarning";
import Footer from "@components/Shared/Footer";
import SingleAccount from "@components/Shared/SingleAccount";
import PostStaffTool from "@components/StaffTools/Panels/Post";
import { APP_NAME } from "@hey/data/constants";
import { FeatureFlag } from "@hey/data/feature-flags";
import { AccountLinkSource } from "@hey/data/tracking";
import getAccount from "@hey/helpers/getAccount";
import getPostData from "@hey/helpers/getPostData";
import { isRepost } from "@hey/helpers/postHelpers";
import {
  PageSize,
  type Post,
  PostReferenceType,
  PostVisibilityFilter,
  usePostQuery,
  usePostReferencesQuery
} from "@hey/indexer";
import { Card, GridItemEight, GridItemFour, GridLayout } from "@hey/ui";
import { useFlag } from "@unleash/proxy-client-react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
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

  const { data, error, loading } = usePostQuery({
    skip: !id || preLoadedPost?.id,
    variables: { request: { post: id } }
  });

  const { data: comments } = usePostReferencesQuery({
    skip: !id,
    variables: {
      request: {
        pageSize: PageSize.Fifty,
        referencedPost: id,
        visibilityFilter: PostVisibilityFilter.Hidden,
        referenceTypes: [PostReferenceType.CommentOn]
      }
    }
  });

  const hasHiddenComments = (comments?.postReferences.items.length || 0) > 0;

  if (!isReady || loading) {
    return <PublicationPageShimmer publicationList={showQuotes} />;
  }

  if (!preLoadedPost && !data?.post) {
    return <Custom404 />;
  }

  if (error) {
    return <Custom500 />;
  }

  const post = preLoadedPost || (data?.post as Post);
  const targetPost = isRepost(post) ? post.repostOf : post;
  const suspended = isSuspended || isCommentSuspended;

  return (
    <GridLayout>
      <MetaTags
        creator={getAccount(targetPost.author).name}
        description={getPostData(targetPost.metadata)?.content}
        title={`${targetPost.__typename} by ${
          getAccount(targetPost.author).usernameWithPrefix
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
            {currentAccount && !post.isDeleted && !suspended ? (
              <NewPublication post={targetPost} />
            ) : null}
            {post.isDeleted ? null : (
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
            hideFollowButton={
              currentAccount?.address === targetPost.author.address
            }
            hideUnfollowButton={
              currentAccount?.address === targetPost.author.address
            }
            account={targetPost.author}
            showBio
            source={AccountLinkSource.Post}
          />
        </Card>
        <RelevantPeople mentions={targetPost.mentions} />
        {isStaff ? <PostStaffTool post={targetPost} /> : null}
        <Footer />
      </GridItemFour>
    </GridLayout>
  );
};

export default ViewPost;
