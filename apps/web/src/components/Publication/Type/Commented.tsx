import type { Comment } from '@good/lens';
import type { FC } from 'react';

import ThreadBody from '../ThreadBody';

interface CommentedProps {
  publication: Comment;
}

const Commented: FC<CommentedProps> = ({ publication }) => {
  const commentOn: any | Comment = publication?.commentOn;
  const root = commentOn?.root;

  return (
    <>
      {root ? <ThreadBody publication={root} /> : null}
      <ThreadBody publication={commentOn} />
    </>
  );
};

export default Commented;
