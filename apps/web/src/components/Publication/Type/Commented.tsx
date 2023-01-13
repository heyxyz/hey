import type { Comment } from 'lens';
import type { FC } from 'react';

import ThreadBody from '../ThreadBody';

interface Props {
  publication: Comment;
}

const Commented: FC<Props> = ({ publication }) => {
  const commentOn: Comment | any = publication?.commentOn;
  const mainPost = commentOn?.mainPost;

  return (
    <>
      {mainPost ? <ThreadBody publication={mainPost} /> : null}
      <ThreadBody publication={commentOn} />
    </>
  );
};

export default Commented;
