import ThreadBody from '@components/Publication/ThreadBody';
import type { FeedItem } from 'lens';
import type { Dispatch, FC, SetStateAction } from 'react';

interface CommentedProps {
  feedItem: FeedItem;
  roundAddress?: string;
  setRoundAddress: Dispatch<SetStateAction<string>>;
}

const Commented: FC<CommentedProps> = ({ feedItem, roundAddress, setRoundAddress }) => {
  const publication = feedItem.root;
  const firstComment = feedItem.comments?.[0];
  const firstCommentParent = publication.__typename === 'Comment' && publication?.commentOn;
  return firstComment ? (
    <>
      {firstCommentParent ? (
        <ThreadBody
          publication={firstCommentParent}
          roundAddress={roundAddress}
          setRoundAddress={setRoundAddress}
        />
      ) : null}
      <ThreadBody publication={publication} roundAddress={roundAddress} setRoundAddress={setRoundAddress} />
    </>
  ) : firstCommentParent ? (
    <ThreadBody
      publication={firstCommentParent}
      roundAddress={roundAddress}
      setRoundAddress={setRoundAddress}
    />
  ) : null;
};

export default Commented;
