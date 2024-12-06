import ActionType from "@components/Home/Timeline/EventType";
import PostWrapper from "@components/Shared/PostWrapper";
import type { AnyPost, TimelineItem } from "@hey/indexer";
import cn from "@hey/ui/cn";
import type { FC, ReactNode } from "react";
import { memo } from "react";
import PostActions from "./Actions";
import HiddenPost from "./HiddenPost";
import PostAvatar from "./PostAvatar";
import PostBody from "./PostBody";
import PostHeader from "./PostHeader";
import PostType from "./Type";

interface SinglePostProps {
  timelineItem?: TimelineItem;
  header?: ReactNode;
  isFirst?: boolean;
  isLast?: boolean;
  post: AnyPost;
  showActions?: boolean;
  showMore?: boolean;
  showThread?: boolean;
  showType?: boolean;
}

const SinglePost: FC<SinglePostProps> = ({
  timelineItem,
  header,
  isFirst = false,
  isLast = false,
  post,
  showActions = true,
  showMore = true,
  showThread = true,
  showType = true
}) => {
  const rootPost = timelineItem ? timelineItem?.primary : post;

  return (
    <PostWrapper
      className={cn(
        isFirst && "rounded-t-xl",
        isLast && "rounded-b-xl",
        "cursor-pointer px-5 pt-4 pb-3 transition-colors hover:bg-gray-100 dark:hover:bg-gray-900"
      )}
      post={rootPost}
    >
      {header}
      {timelineItem ? (
        <ActionType timelineItem={timelineItem} />
      ) : (
        <PostType post={post} showThread={showThread} showType={showType} />
      )}
      <div className="flex items-start space-x-3">
        <PostAvatar timelineItem={timelineItem} post={rootPost} />
        <div className="w-[calc(100%-55px)]">
          <PostHeader timelineItem={timelineItem} post={rootPost} />
          {post.isDeleted ? (
            <HiddenPost type={post.__typename} />
          ) : (
            <>
              <PostBody post={rootPost} showMore={showMore} />
              {showActions ? <PostActions post={rootPost} /> : null}
            </>
          )}
        </div>
      </div>
    </PostWrapper>
  );
};

export default memo(SinglePost);
