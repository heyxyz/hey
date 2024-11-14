import Collectors from "@components/Shared/Modal/Collectors";
import Likes from "@components/Shared/Modal/Likes";
import Mirrors from "@components/Shared/Modal/Mirrors";
import { Leafwatch } from "@helpers/leafwatch";
import { POST } from "@hey/data/tracking";
import getPostsViews, {
  GET_POSTS_VIEWS_QUERY_KEY
} from "@hey/helpers/getPostsViews";
import nFormatter from "@hey/helpers/nFormatter";
import type { PublicationStats as IPublicationStats } from "@hey/lens";
import { Modal } from "@hey/ui";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import plur from "plur";
import type { FC } from "react";
import { memo, useState } from "react";

interface PostStatsProps {
  postId: string;
  postStats: IPublicationStats;
}

const PostStats: FC<PostStatsProps> = ({ postId, postStats }) => {
  const [showLikesModal, setShowLikesModal] = useState(false);
  const [showMirrorsModal, setShowMirrorsModal] = useState(false);
  const [showCollectorsModal, setShowCollectorsModal] = useState(false);

  const { data } = useQuery({
    enabled: Boolean(postId),
    queryFn: () => getPostsViews([postId]),
    queryKey: [GET_POSTS_VIEWS_QUERY_KEY, postId],
    refetchInterval: 5000
  });

  const views = data?.[0]?.views || 0;
  const { bookmarks, comments, countOpenActions, mirrors, quotes, reactions } =
    postStats;

  const showStats =
    comments > 0 ||
    reactions > 0 ||
    mirrors > 0 ||
    quotes > 0 ||
    countOpenActions > 0 ||
    bookmarks > 0 ||
    views > 0;

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
        {mirrors > 0 ? (
          <button
            className="outline-offset-2"
            onClick={() => setShowMirrorsModal(true)}
            type="button"
          >
            <b className="text-black dark:text-white">{nFormatter(mirrors)}</b>{" "}
            {plur("Mirror", mirrors)}
          </button>
        ) : null}
        {quotes > 0 ? (
          <Link className="outline-offset-2" href={`/posts/${postId}/quotes`}>
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
        {countOpenActions > 0 ? (
          <button
            className="outline-offset-2"
            onClick={() => setShowCollectorsModal(true)}
            type="button"
          >
            <b className="text-black dark:text-white">
              {nFormatter(countOpenActions)}
            </b>{" "}
            {plur("Collect", countOpenActions)}
          </button>
        ) : null}
        {bookmarks > 0 ? (
          <span>
            <b className="text-black dark:text-white">
              {nFormatter(bookmarks)}
            </b>{" "}
            {plur("Bookmark", bookmarks)}
          </span>
        ) : null}
        {views > 0 ? (
          <span>
            <b className="text-black dark:text-white">{nFormatter(views)}</b>{" "}
            {plur("View", views)}
          </span>
        ) : null}
      </div>
      <Modal
        onClose={() => {
          Leafwatch.track(POST.OPEN_LIKES);
          setShowLikesModal(false);
        }}
        show={showLikesModal}
        title="Likes"
        size="md"
      >
        <Likes postId={postId} />
      </Modal>
      <Modal
        onClose={() => {
          Leafwatch.track(POST.OPEN_MIRRORS);
          setShowMirrorsModal(false);
        }}
        show={showMirrorsModal}
        title="Mirrors"
        size="md"
      >
        <Mirrors postId={postId} />
      </Modal>
      <Modal
        onClose={() => {
          Leafwatch.track(POST.OPEN_COLLECTORS);
          setShowCollectorsModal(false);
        }}
        show={showCollectorsModal}
        title="Collectors"
        size="md"
      >
        <Collectors postId={postId} />
      </Modal>
    </>
  );
};

export default memo(PostStats);
