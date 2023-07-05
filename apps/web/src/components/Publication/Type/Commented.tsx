import type { Comment } from 'lens';
import type { Dispatch, FC, SetStateAction } from 'react';

import ThreadBody from '../ThreadBody';

interface CommentedProps {
  publication: Comment;
  roundAddress?: string;
  setRoundAddress?: Dispatch<SetStateAction<string>>;
}

const Commented: FC<CommentedProps> = ({ publication, roundAddress, setRoundAddress }) => {
  const commentOn: Comment | any = publication?.commentOn;
  const mainPost = commentOn?.mainPost;

  return (
    <>
      {mainPost ? (
        <ThreadBody publication={mainPost} roundAddress={roundAddress} setRoundAddress={setRoundAddress} />
      ) : null}
      <ThreadBody publication={commentOn} roundAddress={roundAddress} setRoundAddress={setRoundAddress} />
    </>
  );
};

export default Commented;
