import { ChatBubbleLeftIcon } from "@heroicons/react/24/outline";
import humanize from "@hey/helpers/humanize";
import nFormatter from "@hey/helpers/nFormatter";
import type { MirrorablePublication } from "@hey/lens";
import { Tooltip } from "@hey/ui";
import { useRouter } from "next/router";
import type { FC } from "react";

interface CommentProps {
  post: MirrorablePublication;
  showCount: boolean;
}

const Comment: FC<CommentProps> = ({ post, showCount }) => {
  const { push } = useRouter();
  const count = post.stats.comments;
  const iconClassName = showCount
    ? "w-[17px] sm:w-[20px]"
    : "w-[15px] sm:w-[18px]";

  return (
    <div className="ld-text-gray-500 flex items-center space-x-1">
      <button
        aria-label="Comment"
        className="rounded-full p-1.5 outline-offset-2 hover:bg-gray-300/20"
        onClick={() => {
          push(`/posts/${post.id}`);
        }}
        type="button"
      >
        <Tooltip
          content={count > 0 ? `${humanize(count)} Comments` : "Comment"}
          placement="top"
          withDelay
        >
          <ChatBubbleLeftIcon className={iconClassName} />
        </Tooltip>
      </button>
      {count > 0 && !showCount ? (
        <span className="text-[11px] sm:text-xs">{nFormatter(count)}</span>
      ) : null}
    </div>
  );
};

export default Comment;
