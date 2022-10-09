import type { LensterPublication } from '@generated/lenstertypes';
import type { FC } from 'react';

import ThreadBody from '../ThreadBody';

interface Props {
  publication: LensterPublication;
}

const Commented: FC<Props> = ({ publication }) => {
  const commentOn: LensterPublication | any = publication?.commentOn;
  const mainPost = commentOn?.mainPost;

  return (
    <>
      {mainPost ? <ThreadBody publication={mainPost} /> : null}
      <ThreadBody publication={commentOn} />
    </>
  );
};

export default Commented;
