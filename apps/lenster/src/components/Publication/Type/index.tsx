import { LensterPublication } from '@generated/lenstertypes';
import React, { FC } from 'react';

import Collected from './Collected';
import Commented from './Commented';
import CommentedPublication from './CommentedPublication';
import Mirrored from './Mirrored';

interface Props {
  publication: LensterPublication;
  showType?: boolean;
  showThread?: boolean;
}

const PublicationType: FC<Props> = ({ publication, showType, showThread = false }) => {
  const type = publication?.__typename;
  const publicationType = publication?.metadata?.attributes[0]?.value;
  const isCollected = !!publication?.collectedBy;

  if (!showType) {
    return null;
  }

  return (
    <>
      {type === 'Mirror' && <Mirrored publication={publication} />}
      {type === 'Comment' && !showThread && <CommentedPublication publication={publication} />}
      {type === 'Comment' && showThread && !isCollected && <Commented publication={publication} />}
      {isCollected && publicationType !== 'crowdfund' && (
        <Collected publication={publication} type="collected" />
      )}
      {isCollected && publicationType === 'crowdfund' && (
        <Collected publication={publication} type="funded" />
      )}
    </>
  );
};

export default PublicationType;
