import { LensterPublication } from '@generated/lenstertypes';
import React, { FC } from 'react';

import ThreadBody from '../ThreadBody';

interface Props {
  publication: LensterPublication;
}

const Commented: FC<Props> = ({ publication }) => {
  const commentOn: LensterPublication | any = publication?.commentOn;
  const mainPost = commentOn?.mainPost;
  const publicationType = mainPost?.metadata?.attributes[0]?.value;

  return (
    <div>
      {mainPost && publicationType !== 'community' ? <ThreadBody publication={mainPost} /> : null}
      <ThreadBody publication={commentOn} />
    </div>
  );
};

export default Commented;
