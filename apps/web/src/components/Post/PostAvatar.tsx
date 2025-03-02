import getAccount from "@hey/helpers/getAccount";
import getAvatar from "@hey/helpers/getAvatar";
import { isRepost } from "@hey/helpers/postHelpers";
import stopEventPropagation from "@hey/helpers/stopEventPropagation";
import type { AnyPostFragment, TimelineItemFragment } from "@hey/indexer";
import { Image } from "@hey/ui";
import cn from "@hey/ui/cn";
import Link from "next/link";
import { useRouter } from "next/router";
import type { FC } from "react";
import { memo } from "react";

interface PostAvatarProps {
  timelineItem?: TimelineItemFragment;
  post: AnyPostFragment;
  quoted?: boolean;
}

const PostAvatar: FC<PostAvatarProps> = ({
  timelineItem,
  post,
  quoted = false
}) => {
  const { push } = useRouter();
  const targetPost = isRepost(post) ? post?.repostOf : post;
  const rootPost = timelineItem ? timelineItem?.primary : targetPost;
  const account = timelineItem ? rootPost.author : targetPost.author;

  return (
    <Link
      className="contents"
      href={getAccount(account).link}
      onClick={stopEventPropagation}
    >
      <Image
        alt={account.address}
        className={cn(
          quoted ? "size-6" : "size-11",
          "z-[1] cursor-pointer rounded-full border bg-gray-200 dark:border-gray-700"
        )}
        height={quoted ? 25 : 44}
        loading="lazy"
        onClick={() => push(getAccount(account).link)}
        src={getAvatar(account)}
        width={quoted ? 25 : 44}
      />
    </Link>
  );
};

export default memo(PostAvatar);
