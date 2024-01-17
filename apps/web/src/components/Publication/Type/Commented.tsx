import type { Comment } from '@hey/lens';
import type { FC } from 'react';

import ThreadBody from '../ThreadBody';

interface CommentedProps {
  publication: Comment;
}

const Commented: FC<CommentedProps> = ({ publication }) => {
  const commentOn: any = publication?.commentOn;
  const root = commentOn?.root;

  return (
    <>
      {root ? <ThreadBody publication={root} /> : null}
      {commentOn ? <ThreadBody publication={commentOn} /> : null}
    </>
  );
};

export default Commented;
