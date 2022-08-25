import { LensterPublication } from '@generated/lenstertypes';
import { Comment, Maybe } from '@generated/types';
import React, { FC } from 'react';

import ThreadBody from '../ThreadBody';

interface Props {
  publication: LensterPublication;
}

const Commented: FC<Props> = ({ publication }) => {
  const commentOn = publication?.commentOn as Maybe<Comment>;
  const mainPost = commentOn?.mainPost as LensterPublication;
  const publicationType = mainPost?.metadata?.attributes[0]?.value;

  return (
    <div>
      {mainPost && publicationType !== 'community' ? <ThreadBody publication={mainPost} /> : null}
      <ThreadBody publication={commentOn as LensterPublication} />
    </div>
  );
};

export default Commented;
