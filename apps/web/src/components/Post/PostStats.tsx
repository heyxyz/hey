import Collectors from "@components/Shared/Modal/Collectors";
import Likes from "@components/Shared/Modal/Likes";
import Reposts from "@components/Shared/Modal/Reposts";
import nFormatter from "@hey/helpers/nFormatter";
import type { PostFragment } from "@hey/indexer";
import { Modal } from "@hey/ui";
import Link from "next/link";
import plur from "plur";
import type { FC } from "react";
import { memo, useState } from "react";

interface PostStatsProps {
  post: PostFragment;
}

const PostStats: FC<PostStatsProps> = ({ post }) => {
  const [showLikesModal, setShowLikesModal] = useState(false);
  const [showRepostsModal, setShowRepostsModal] = useState(false);
  const [showCollectorsModal, setShowCollectorsModal] = useState(false);

  const { bookmarks, comments, reposts, quotes, reactions, collects, tips } =
    post.stats;

  const showStats =
    comments > 0 ||
    reactions > 0 ||
    reposts > 0 ||
    quotes > 0 ||
    bookmarks > 0 ||
    collects > 0 ||
    tips > 0;

  if (!showStats) {
    return null;
  }

  return (
    <>
      <div className="divider" />
      <div className="ld-text-gray-500 flex flex-wrap items-center gap-x-6 gap-y-3 py-3 text-sm">
        {comments > 0 ? (
          <span>
            <b className="text-black dark:text-white">{nFormatter(comments)}</b>{" "}
            {plur("Comment", comments)}
          </span>
        ) : null}
        {reposts > 0 ? (
          <button
            className="outline-offset-2"
            onClick={() => setShowRepostsModal(true)}
            type="button"
          >
            <b className="text-black dark:text-white">{nFormatter(reposts)}</b>{" "}
            {plur("Repost", reposts)}
          </button>
        ) : null}
        {quotes > 0 ? (
          <Link className="outline-offset-2" href={`/posts/${post.id}/quotes`}>
            <b className="text-black dark:text-white">{nFormatter(quotes)}</b>{" "}
            {plur("Quote", quotes)}
          </Link>
        ) : null}
        {reactions > 0 ? (
          <button
            className="outline-offset-2"
            onClick={() => setShowLikesModal(true)}
            type="button"
          >
            <b className="text-black dark:text-white">
              {nFormatter(reactions)}
            </b>{" "}
            {plur("Like", reactions)}
          </button>
        ) : null}
        {tips > 0 ? (
          <span>
            <b className="text-black dark:text-white">{nFormatter(tips)}</b>{" "}
            {plur("Tip", tips)}
          </span>
        ) : null}
        {collects > 0 ? (
          <span>
            <b className="text-black dark:text-white">{nFormatter(collects)}</b>{" "}
            {plur("Collect", collects)}
          </span>
        ) : null}
        {bookmarks > 0 ? (
          <span>
            <b className="text-black dark:text-white">
              {nFormatter(bookmarks)}
            </b>{" "}
            {plur("Bookmark", bookmarks)}
          </span>
        ) : null}
      </div>
      <Modal
        onClose={() => setShowLikesModal(false)}
        show={showLikesModal}
        title="Likes"
        size="md"
      >
        <Likes postId={post.id} />
      </Modal>
      <Modal
        onClose={() => setShowRepostsModal(false)}
        show={showRepostsModal}
        title="Reposts"
        size="md"
      >
        <Reposts postId={post.id} />
      </Modal>
      <Modal
        onClose={() => setShowCollectorsModal(false)}
        show={showCollectorsModal}
        title="Collectors"
        size="md"
      >
        <Collectors postId={post.id} />
      </Modal>
    </>
  );
};

export default memo(PostStats);
