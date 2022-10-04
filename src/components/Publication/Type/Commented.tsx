import { LensterPublication } from '@generated/lenstertypes';
import { FC } from 'react';

import ThreadBody from '../ThreadBody';

interface Props {
  publication: LensterPublication;
}

const Commented: FC<Props> = ({ publication }) => {
  const commentOn: LensterPublication | any = publication?.commentOn;
  const mainPost = commentOn?.mainPost;

  return (
    <div>
      {mainPost ? <ThreadBody publication={mainPost} /> : null}
      <ThreadBody publication={commentOn} />
    </div>
  );
};

export default Commented;
