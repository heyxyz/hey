import getAccount from "@hey/helpers/getAccount";
import getAvatar from "@hey/helpers/getAvatar";
import getLennyURL from "@hey/helpers/getLennyURL";
import { isRepost } from "@hey/helpers/postHelpers";
import stopEventPropagation from "@hey/helpers/stopEventPropagation";
import type { AnyPublication, FeedItem } from "@hey/lens";
import { Image } from "@hey/ui";
import cn from "@hey/ui/cn";
import Link from "next/link";
import { useRouter } from "next/router";
import type { FC } from "react";
import { memo } from "react";

interface PostAvatarProps {
  feedItem?: FeedItem;
  post: AnyPublication;
  quoted?: boolean;
}

const PostAvatar: FC<PostAvatarProps> = ({
  feedItem,
  post,
  quoted = false
}) => {
  const { push } = useRouter();
  const targetPost = isRepost(post) ? post?.mirrorOn : post;
  const rootPublication = feedItem ? feedItem?.root : targetPost;
  const account = feedItem ? rootPublication.by : targetPost.by;

  return (
    <Link
      className="contents"
      href={getAccount(account).link}
      onClick={stopEventPropagation}
    >
      <Image
        alt={account.id}
        className={cn(
          quoted ? "size-6" : "size-11",
          "z-[1] cursor-pointer rounded-full border bg-gray-200 dark:border-gray-700"
        )}
        height={quoted ? 25 : 44}
        loading="lazy"
        onClick={() => push(getAccount(account).link)}
        onError={({ currentTarget }) => {
          currentTarget.src = getLennyURL(account.id);
        }}
        src={getAvatar(account)}
        width={quoted ? 25 : 44}
      />
    </Link>
  );
};

export default memo(PostAvatar);
