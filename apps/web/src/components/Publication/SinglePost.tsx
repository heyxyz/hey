import ActionType from "@components/Home/Timeline/EventType";
import PostWrapper from "@components/Shared/PostWrapper";
import type { AnyPublication, FeedItem } from "@hey/lens";
import cn from "@hey/ui/cn";
import type { FC, ReactNode } from "react";
import { memo } from "react";
import usePushToImpressions from "src/hooks/usePushToImpressions";
import PostActions from "./Actions";
import HiddenPost from "./HiddenPost";
import PostAvatar from "./PostAvatar";
import PostBody from "./PostBody";
import PostHeader from "./PostHeader";
import PostType from "./Type";

interface SinglePostProps {
  feedItem?: FeedItem;
  header?: ReactNode;
  isFirst?: boolean;
  isLast?: boolean;
  post: AnyPublication;
  showActions?: boolean;
  showMore?: boolean;
  showThread?: boolean;
  showType?: boolean;
}

const SinglePost: FC<SinglePostProps> = ({
  feedItem,
  header,
  isFirst = false,
  isLast = false,
  post,
  showActions = true,
  showMore = true,
  showThread = true,
  showType = true
}) => {
  const rootPublication = feedItem ? feedItem?.root : post;
  usePushToImpressions(rootPublication.id);

  return (
    <PostWrapper
      className={cn(
        isFirst && "rounded-t-xl",
        isLast && "rounded-b-xl",
        "cursor-pointer px-5 pt-4 pb-3 transition-colors hover:bg-gray-100 dark:hover:bg-gray-900"
      )}
      post={rootPublication}
    >
      {header}
      {feedItem ? (
        <ActionType feedItem={feedItem} />
      ) : (
        <PostType post={post} showThread={showThread} showType={showType} />
      )}
      <div className="flex items-start space-x-3">
        <PostAvatar feedItem={feedItem} post={rootPublication} />
        <div className="w-[calc(100%-55px)]">
          <PostHeader feedItem={feedItem} post={rootPublication} />
          {post.isHidden ? (
            <HiddenPost type={post.__typename} />
          ) : (
            <>
              <PostBody post={rootPublication} showMore={showMore} />
              {showActions ? <PostActions post={rootPublication} /> : null}
            </>
          )}
        </div>
      </div>
    </PostWrapper>
  );
};

export default memo(SinglePost);
